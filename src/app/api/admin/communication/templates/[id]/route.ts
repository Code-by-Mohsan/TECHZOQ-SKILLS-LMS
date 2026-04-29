import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import MessageTemplate from "@/models/MessageTemplate";
import { messageTemplateUpsertSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionCheck = await requirePermissions(req, ["whatsapp.send"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = messageTemplateUpsertSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const { id } = await params;
    const template = await MessageTemplate.findById(id);
    if (!template) {
      return NextResponse.json({ success: false, message: "Template not found" }, { status: 404 });
    }

    const beforeState = {
      name: template.name,
      channel: template.channel,
      body: template.body,
      variables: template.variables,
      isActive: template.isActive,
    };

    template.name = parsed.data.name;
    template.channel = parsed.data.channel;
    template.body = parsed.data.body;
    template.variables = parsed.data.variables || [];
    template.isActive = parsed.data.isActive ?? template.isActive;
    template.updatedBy = permissionCheck.auth?.userId ?? null;
    await template.save();

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "communication.template.update",
      module: "communication",
      entityType: "MessageTemplate",
      entityId: String(template._id),
      beforeState,
      afterState: {
        name: template.name,
        channel: template.channel,
        body: template.body,
        variables: template.variables,
        isActive: template.isActive,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: template });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update template";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionCheck = await requirePermissions(req, ["whatsapp.send"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { id } = await params;
    const template = await MessageTemplate.findById(id);
    if (!template) {
      return NextResponse.json({ success: false, message: "Template not found" }, { status: 404 });
    }

    const beforeState = {
      name: template.name,
      channel: template.channel,
      isActive: template.isActive,
    };

    template.isActive = false;
    template.updatedBy = permissionCheck.auth?.userId ?? null;
    await template.save();

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "communication.template.deactivate",
      module: "communication",
      entityType: "MessageTemplate",
      entityId: String(template._id),
      beforeState,
      afterState: {
        isActive: template.isActive,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to deactivate template";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
