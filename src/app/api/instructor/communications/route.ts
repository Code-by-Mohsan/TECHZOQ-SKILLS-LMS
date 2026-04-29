import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { normalizeRole } from "@/lib/constants/auth";
import BatchInstructorAssignment from "@/models/BatchInstructorAssignment";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";
import CommunicationLog from "@/models/CommunicationLog";
import { communicationLogCreateSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

async function getInstructorStudentUserIds(userId: string): Promise<string[]> {
  const assignments = await BatchInstructorAssignment.find({ user: userId, isActive: true })
    .select("batch")
    .lean();
  const batchIds = assignments.map((item: any) => item.batch).filter(Boolean);
  if (batchIds.length === 0) return [];

  const enrollments = await Enrollment.find({
    batch: { $in: batchIds },
    status: { $in: ["enrolled", "active"] },
  }).select("student").lean();
  const studentIds = enrollments.map((item: any) => item.student).filter(Boolean);
  if (studentIds.length === 0) return [];

  const students = await Student.find({ _id: { $in: studentIds } }).select("user").lean();
  return students.map((item: any) => String(item.user)).filter(Boolean);
}

export async function GET(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const normalizedRole = normalizeRole(auth.role);
  if (normalizedRole !== "instructor" && normalizedRole !== "teaching_assistant") {
    return NextResponse.json({ success: false, message: "Instructor access required" }, { status: 403 });
  }

  try {
    await dbConnect();
    const studentUserIds = await getInstructorStudentUserIds(auth.userId);
    const filter = {
      $or: [
        { senderUser: auth.userId },
        { recipientUser: { $in: studentUserIds } },
      ],
    };

    const logs = await CommunicationLog.find(filter)
      .populate("recipientUser", "name email")
      .populate("senderUser", "name email")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ success: true, data: logs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load instructor communications";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const normalizedRole = normalizeRole(auth.role);
  if (normalizedRole !== "instructor" && normalizedRole !== "teaching_assistant") {
    return NextResponse.json({ success: false, message: "Instructor access required" }, { status: 403 });
  }

  try {
    const parsed = communicationLogCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const allowedUserIds = await getInstructorStudentUserIds(auth.userId);
    const recipientUserId = parsed.data.recipientUserId || null;

    if (!recipientUserId || !allowedUserIds.includes(recipientUserId)) {
      return NextResponse.json(
        { success: false, message: "Recipient is outside your assigned batch scope" },
        { status: 403 },
      );
    }

    const student = await Student.findOne({ user: recipientUserId }).select("phone").lean() as { phone?: string } | null;
    const recipientPhone = parsed.data.recipientPhone || student?.phone || "";

    const log = await CommunicationLog.create({
      senderUser: auth.userId,
      recipientUser: recipientUserId,
      recipientPhone,
      channel: "whatsapp",
      sourceModule: parsed.data.sourceModule,
      template: parsed.data.templateId || null,
      message: parsed.data.message,
      status: parsed.data.status,
      sentAt: parsed.data.status === "marked_sent" ? new Date() : null,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: auth.userId,
      actorRole: auth.role,
      action: "communication.instructor.send",
      module: "communication",
      entityType: "CommunicationLog",
      entityId: String(log._id),
      afterState: {
        recipientUserId,
        sourceModule: log.sourceModule,
        status: log.status,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    const waUrl = recipientPhone
      ? `https://wa.me/${recipientPhone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(parsed.data.message)}`
      : null;

    return NextResponse.json({ success: true, data: { ...log.toObject(), waUrl } }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create communication log";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
