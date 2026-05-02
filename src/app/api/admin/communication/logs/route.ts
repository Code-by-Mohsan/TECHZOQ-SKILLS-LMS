import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import CommunicationLog from "@/models/CommunicationLog";
import MessageTemplate from "@/models/MessageTemplate";
import Student from "@/models/Student";
import { communicationLogCreateSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["communication.view"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "").trim();
    const sourceModule = (searchParams.get("sourceModule") || "").trim();
    const limit = Math.min(Number(searchParams.get("limit") || 50), 200);
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (sourceModule) filter.sourceModule = sourceModule;

    const [items, total] = await Promise.all([
      CommunicationLog.find(filter)
        .populate("senderUser", "name email")
        .populate("recipientUser", "name email")
        .populate("template", "name channel")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CommunicationLog.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load communication logs";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const permissionCheck = await requirePermissions(req, ["whatsapp.send"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = communicationLogCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const payload = parsed.data;

    let recipientUserId: string | null = payload.recipientUserId || null;
    let recipientPhone = payload.recipientPhone || "";

    if (recipientUserId && !recipientPhone) {
      const student = await Student.findOne({ user: recipientUserId }).select("phone").lean() as { phone?: string } | null;
      if (student?.phone) recipientPhone = student.phone;
    }

    if (!recipientUserId && recipientPhone) {
      const student = await Student.findOne({ phone: recipientPhone }).populate("user", "_id").lean() as { user?: { _id?: unknown } } | null;
      if (student?.user?._id) recipientUserId = String(student.user._id);
    }

    if (payload.templateId) {
      const templateExists = await MessageTemplate.exists({ _id: payload.templateId, isActive: true });
      if (!templateExists) {
        return NextResponse.json({ success: false, message: "Template not found or inactive" }, { status: 404 });
      }
    }

    const log = await CommunicationLog.create({
      senderUser: permissionCheck.auth?.userId ?? null,
      recipientUser: recipientUserId,
      recipientPhone,
      channel: "whatsapp",
      sourceModule: payload.sourceModule,
      template: payload.templateId || null,
      message: payload.message,
      status: payload.status,
      sentAt: payload.status === "marked_sent" ? new Date() : null,
    });

    const waUrl = recipientPhone
      ? `https://wa.me/${recipientPhone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(payload.message)}`
      : null;

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "communication.log.create",
      module: "communication",
      entityType: "CommunicationLog",
      entityId: String(log._id),
      afterState: {
        recipientUser: recipientUserId,
        recipientPhone,
        status: log.status,
        sourceModule: log.sourceModule,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: { ...log.toObject(), waUrl } }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create communication log";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
