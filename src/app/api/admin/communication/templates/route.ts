import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import MessageTemplate from "@/models/MessageTemplate";
import { messageTemplateUpsertSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["communication.view"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const channel = (searchParams.get("channel") || "").trim();
    const active = searchParams.get("active");

    const filter: Record<string, unknown> = {};
    if (channel) filter.channel = channel;
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    const templates = await MessageTemplate.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: templates });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load templates";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
    const template = await MessageTemplate.create({
      ...parsed.data,
      variables: parsed.data.variables || [],
      createdBy: permissionCheck.auth?.userId ?? null,
      updatedBy: permissionCheck.auth?.userId ?? null,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "communication.template.create",
      module: "communication",
      entityType: "MessageTemplate",
      entityId: String(template._id),
      afterState: {
        name: template.name,
        channel: template.channel,
        isActive: template.isActive,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: template }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create template";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
