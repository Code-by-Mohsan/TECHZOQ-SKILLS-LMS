import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import PipelineStage from "@/models/PipelineStage";
import { pipelineStageUpsertSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionCheck = await requirePermissions(req, ["lead.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = pipelineStageUpsertSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    await dbConnect();

    const { id } = await params;
    const stage = await PipelineStage.findById(id);
    if (!stage) {
      return NextResponse.json({ success: false, message: "Stage not found" }, { status: 404 });
    }
    const beforeState = {
      key: stage.key,
      name: stage.name,
      order: stage.order,
      isActive: stage.isActive,
    };

    Object.assign(stage, parsed.data);
    stage.updatedBy = permissionCheck.auth?.userId ?? null;
    await stage.save();

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "lead.stage.update",
      module: "leads",
      entityType: "PipelineStage",
      entityId: String(stage._id),
      beforeState,
      afterState: { key: stage.key, name: stage.name, order: stage.order, isActive: stage.isActive },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: stage });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update stage";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionCheck = await requirePermissions(req, ["lead.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { id } = await params;
    const stage = await PipelineStage.findById(id);
    if (!stage) {
      return NextResponse.json({ success: false, message: "Stage not found" }, { status: 404 });
    }
    stage.isActive = false;
    stage.updatedBy = permissionCheck.auth?.userId ?? null;
    await stage.save();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete stage";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
