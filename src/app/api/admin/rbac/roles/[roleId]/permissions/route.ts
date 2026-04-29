import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePermissions } from "@/lib/rbac";
import RolePermission from "@/models/RolePermission";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

const rolePermissionUpdateSchema = z.object({
  permissionIds: z.array(z.string()).default([]),
});

interface RouteParams {
  params: Promise<{ roleId: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  const permissionCheck = await requirePermissions(req, ["rbac.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const { roleId } = await params;
    const parsed = rolePermissionUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const permissionIds = parsed.data.permissionIds;
    const beforeRows = await RolePermission.find({ role: roleId }).select("permission").lean();
    const beforePermissionIds = beforeRows.map((row: any) => String(row.permission));

    await RolePermission.deleteMany({ role: roleId, permission: { $nin: permissionIds } });

    for (const permissionId of permissionIds) {
      await RolePermission.updateOne(
        { role: roleId, permission: permissionId },
        {
          $setOnInsert: {
            createdBy: permissionCheck.auth?.userId ?? null,
          },
        },
        { upsert: true },
      );
    }

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "rbac.role_permissions.update",
      module: "rbac",
      entityType: "Role",
      entityId: roleId,
      beforeState: { permissionIds: beforePermissionIds },
      afterState: { permissionIds },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, message: "Role permissions updated" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update role permissions";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
