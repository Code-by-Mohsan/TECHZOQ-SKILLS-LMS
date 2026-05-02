import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePermissions, syncPrimaryUserRole } from "@/lib/rbac";
import UserRole from "@/models/UserRole";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

const userRoleUpdateSchema = z.object({
  roleIds: z.array(z.string()).default([]),
});

interface RouteParams {
  params: Promise<{ userId: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  const permissionCheck = await requirePermissions(req, ["user.role.assign"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const { userId } = await params;
    const parsed = userRoleUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const roleIds = parsed.data.roleIds;
    const beforeRows = await UserRole.find({ user: userId }).select("role").lean();
    const beforeRoleIds = beforeRows.map((row: any) => String(row.role));

    await UserRole.deleteMany({ user: userId, role: { $nin: roleIds } });

    for (const roleId of roleIds) {
      await UserRole.updateOne(
        { user: userId, role: roleId },
        {
          $set: {
            assignedBy: permissionCheck.auth?.userId ?? null,
            assignedAt: new Date(),
          },
          $setOnInsert: {
            isPrimary: false,
          },
        },
        { upsert: true },
      );
    }

    await syncPrimaryUserRole(userId);

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "rbac.user_roles.update",
      module: "rbac",
      entityType: "User",
      entityId: userId,
      beforeState: { roleIds: beforeRoleIds },
      afterState: { roleIds },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, message: "User roles updated" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update user roles";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
