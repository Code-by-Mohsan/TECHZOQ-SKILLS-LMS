import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import PipelineStage from "@/models/PipelineStage";
import { pipelineStageUpsertSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { ensureDefaultPipelineStages } from "@/lib/lead-routing";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["lead.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const stages = await ensureDefaultPipelineStages(permissionCheck.auth?.userId ?? null);
    return NextResponse.json({ success: true, data: stages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load pipeline stages";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
    const stage = await PipelineStage.create({
      ...parsed.data,
      createdBy: permissionCheck.auth?.userId ?? null,
      updatedBy: permissionCheck.auth?.userId ?? null,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "lead.stage.create",
      module: "leads",
      entityType: "PipelineStage",
      entityId: String(stage._id),
      afterState: { key: stage.key, name: stage.name, order: stage.order },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: stage }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create stage";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
