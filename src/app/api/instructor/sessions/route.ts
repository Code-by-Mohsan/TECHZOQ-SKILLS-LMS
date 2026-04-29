import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { normalizeRole } from "@/lib/constants/auth";
import BatchInstructorAssignment from "@/models/BatchInstructorAssignment";
import Session from "@/models/Session";
import { sessionCreateSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

async function getAssignedBatchIds(userId: string): Promise<string[]> {
  const assignments = await BatchInstructorAssignment.find({
    user: userId,
    isActive: true,
  }).select("batch").lean();

  return assignments.map((item: any) => String(item.batch)).filter(Boolean);
}

function isInstructorRole(role: string): boolean {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === "instructor" || normalizedRole === "teaching_assistant";
}

export async function GET(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!isInstructorRole(auth.role)) {
    return NextResponse.json({ success: false, message: "Instructor access required" }, { status: 403 });
  }

  try {
    await dbConnect();
    const batchIds = await getAssignedBatchIds(auth.userId);
    if (batchIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const sessions = await Session.find({ batch: { $in: batchIds } })
      .populate({
        path: "batch",
        select: "name status course",
        populate: { path: "course", select: "title" },
      })
      .sort({ startsAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: sessions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load instructor sessions";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!isInstructorRole(auth.role)) {
    return NextResponse.json({ success: false, message: "Instructor access required" }, { status: 403 });
  }

  try {
    const parsed = sessionCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    if (parsed.data.endsAt <= parsed.data.startsAt) {
      return NextResponse.json(
        { success: false, message: "Session end time must be after start time" },
        { status: 400 },
      );
    }

    await dbConnect();
    const batchIds = await getAssignedBatchIds(auth.userId);
    if (!batchIds.includes(parsed.data.batchId)) {
      return NextResponse.json(
        { success: false, message: "Batch is outside your assignment scope" },
        { status: 403 },
      );
    }

    const session = await Session.create({
      batch: parsed.data.batchId,
      title: parsed.data.title,
      topic: parsed.data.topic || "",
      startsAt: parsed.data.startsAt,
      endsAt: parsed.data.endsAt,
      meetingLink: parsed.data.meetingLink || "",
      createdBy: auth.userId,
      updatedBy: auth.userId,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: auth.userId,
      actorRole: auth.role,
      action: "attendance.session.create.instructor",
      module: "attendance",
      entityType: "Session",
      entityId: String(session._id),
      afterState: {
        batchId: parsed.data.batchId,
        title: session.title,
        startsAt: session.startsAt,
        endsAt: session.endsAt,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create session";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
