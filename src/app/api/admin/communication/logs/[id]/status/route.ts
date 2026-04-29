import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import CommunicationLog from "@/models/CommunicationLog";
import { communicationStatusUpdateSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionCheck = await requirePermissions(req, ["whatsapp.send"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = communicationStatusUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const { id } = await params;
    const log = await CommunicationLog.findById(id);
    if (!log) {
      return NextResponse.json({ success: false, message: "Communication log not found" }, { status: 404 });
    }

    const beforeState = {
      status: log.status,
      failureReason: log.failureReason,
      sentAt: log.sentAt,
    };

    log.status = parsed.data.status;
    log.failureReason = parsed.data.failureReason || "";
    if (parsed.data.status === "marked_sent" && !log.sentAt) {
      log.sentAt = new Date();
    }
    await log.save();

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "communication.log.update_status",
      module: "communication",
      entityType: "CommunicationLog",
      entityId: String(log._id),
      beforeState,
      afterState: {
        status: log.status,
        failureReason: log.failureReason,
        sentAt: log.sentAt,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update communication status";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
