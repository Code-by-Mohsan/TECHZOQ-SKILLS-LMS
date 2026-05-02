import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { normalizeRole } from "@/lib/constants/auth";
import BatchInstructorAssignment from "@/models/BatchInstructorAssignment";
import Session from "@/models/Session";
import Enrollment from "@/models/Enrollment";
import Attendance from "@/models/Attendance";
import { attendanceMarkSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

function isInstructorRole(role: string): boolean {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === "instructor" || normalizedRole === "teaching_assistant";
}

async function canAccessSession(userId: string, sessionBatchId: string): Promise<boolean> {
  const assignment = await BatchInstructorAssignment.exists({
    user: userId,
    batch: sessionBatchId,
    isActive: true,
  });
  return Boolean(assignment);
}

export async function GET(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!isInstructorRole(auth.role)) {
    return NextResponse.json({ success: false, message: "Instructor access required" }, { status: 403 });
  }

  try {
    await dbConnect();
    const { sessionId } = await params;

    const session = await Session.findById(sessionId).lean() as { _id: unknown; batch: unknown } | null;
    if (!session) {
      return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });
    }

    const batchId = String(session.batch);
    const access = await canAccessSession(auth.userId, batchId);
    if (!access) {
      return NextResponse.json({ success: false, message: "Session is outside your assignment scope" }, { status: 403 });
    }

    const enrollments = await Enrollment.find({
      batch: batchId,
      status: { $in: ["enrolled", "active"] },
    })
      .populate({
        path: "student",
        select: "user",
        populate: { path: "user", select: "name email" },
      })
      .lean();

    const studentIds = enrollments.map((item: any) => item.student?._id).filter(Boolean);
    const attendanceRows = await Attendance.find({
      session: sessionId,
      student: { $in: studentIds },
    }).lean();

    const byStudent = new Map(attendanceRows.map((item: any) => [String(item.student), item]));
    const roster = enrollments.map((item: any) => {
      const studentDoc = item.student;
      const attendance = byStudent.get(String(studentDoc?._id));
      return {
        enrollmentId: String(item._id),
        studentId: String(studentDoc?._id),
        studentName: studentDoc?.user?.name || "Student",
        studentEmail: studentDoc?.user?.email || "",
        attendance: attendance
          ? {
              status: attendance.status,
              remarks: attendance.remarks,
              markedAt: attendance.markedAt,
            }
          : null,
      };
    });

    return NextResponse.json({ success: true, data: { roster } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load session attendance";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!isInstructorRole(auth.role)) {
    return NextResponse.json({ success: false, message: "Instructor access required" }, { status: 403 });
  }

  try {
    const parsed = attendanceMarkSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    }

    const { sessionId } = await params;
    if (parsed.data.sessionId !== sessionId) {
      return NextResponse.json({ success: false, message: "Session ID mismatch" }, { status: 400 });
    }

    await dbConnect();
    const session = await Session.findById(sessionId).lean() as { _id: unknown; batch: unknown } | null;
    if (!session) {
      return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });
    }

    const batchId = String(session.batch);
    const access = await canAccessSession(auth.userId, batchId);
    if (!access) {
      return NextResponse.json({ success: false, message: "Session is outside your assignment scope" }, { status: 403 });
    }

    const allowedEnrollments = await Enrollment.find({
      batch: batchId,
      status: { $in: ["enrolled", "active"] },
    }).select("student").lean();
    const allowedStudentIds = new Set(allowedEnrollments.map((item: any) => String(item.student)));

    for (const record of parsed.data.records) {
      if (!allowedStudentIds.has(record.studentId)) {
        return NextResponse.json(
          { success: false, message: "At least one student is outside batch scope" },
          { status: 403 },
        );
      }
    }

    await Promise.all(
      parsed.data.records.map((record) =>
        Attendance.findOneAndUpdate(
          { session: sessionId, student: record.studentId },
          {
            $set: {
              batch: batchId,
              status: record.status,
              remarks: record.remarks || "",
              markedBy: auth.userId,
              markedAt: new Date(),
            },
          },
          { upsert: true, new: true },
        ),
      ),
    );

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: auth.userId,
      actorRole: auth.role,
      action: "attendance.mark.bulk",
      module: "attendance",
      entityType: "Session",
      entityId: String(session._id),
      afterState: {
        sessionId,
        recordsCount: parsed.data.records.length,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update attendance";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
