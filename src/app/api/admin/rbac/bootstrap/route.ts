import { NextResponse } from "next/server";
import { requirePermissions } from "@/lib/rbac";
import dbConnect from "@/lib/db";
import {
  DEFAULT_RBAC_PERMISSIONS,
  DEFAULT_RBAC_ROLES,
  DEFAULT_ROLE_PERMISSION_KEYS,
} from "@/lib/constants/rbac";
import Permission from "@/models/Permission";
import Role from "@/models/Role";
import RolePermission from "@/models/RolePermission";
import User from "@/models/User";
import UserRole from "@/models/UserRole";
import { normalizeRole } from "@/lib/constants/auth";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  const permissionCheck = await requirePermissions(req, ["rbac.manage"]);
  if (permissionCheck.error) return permissionCheck.error;
  const auth = permissionCheck.auth;

  try {
    await dbConnect();

    for (const roleDef of DEFAULT_RBAC_ROLES) {
      await Role.updateOne(
        { key: roleDef.key },
        {
          $set: {
            name: roleDef.name,
            description: roleDef.description,
            isSystem: roleDef.isSystem,
            isActive: true,
            updatedBy: auth?.userId ?? null,
          },
          $setOnInsert: {
            createdBy: auth?.userId ?? null,
          },
        },
        { upsert: true },
      );
    }

    for (const permDef of DEFAULT_RBAC_PERMISSIONS) {
      await Permission.updateOne(
        { key: permDef.key },
        {
          $set: {
            name: permDef.name,
            module: permDef.module,
            description: permDef.description,
            isSystem: permDef.isSystem,
            isActive: true,
          },
        },
        { upsert: true },
      );
    }

    const roles = await Role.find({ key: { $in: Object.keys(DEFAULT_ROLE_PERMISSION_KEYS) } })
      .select("_id key")
      .lean();
    const permissions = await Permission.find({ isActive: true }).select("_id key").lean();

    const roleIdByKey = new Map(roles.map((role: any) => [String(role.key), String(role._id)]));
    const permissionIdByKey = new Map(
      permissions.map((permission: any) => [String(permission.key), String(permission._id)]),
    );

    for (const [roleKey, permissionKeys] of Object.entries(DEFAULT_ROLE_PERMISSION_KEYS)) {
      const roleId = roleIdByKey.get(roleKey);
      if (!roleId) continue;

      if (permissionKeys.includes("*")) {
        continue;
      }

      const permissionIds = permissionKeys
        .map((key) => permissionIdByKey.get(key))
        .filter((id): id is string => Boolean(id));

      await RolePermission.deleteMany({ role: roleId, permission: { $nin: permissionIds } });
      for (const permissionId of permissionIds) {
        await RolePermission.updateOne(
          { role: roleId, permission: permissionId },
          { $setOnInsert: { createdBy: auth?.userId ?? null } },
          { upsert: true },
        );
      }
    }

    const users = await User.find({}).select("_id role").lean();
    for (const user of users as any[]) {
      const normalizedRole = normalizeRole(user.role || "student");
      const roleId = roleIdByKey.get(normalizedRole);
      if (!roleId) continue;

      await UserRole.updateOne(
        { user: user._id, role: roleId },
        {
          $setOnInsert: {
            assignedBy: auth?.userId ?? null,
            isPrimary: true,
          },
        },
        { upsert: true },
      );
    }

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: auth?.userId,
      actorRole: auth?.role,
      action: "rbac.bootstrap",
      module: "rbac",
      entityType: "System",
      entityId: "rbac-defaults",
      afterState: {
        roles: roles.length,
        permissions: permissions.length,
        usersMigrated: users.length,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({
      success: true,
      message: "RBAC defaults seeded successfully",
      data: {
        roles: roles.length,
        permissions: permissions.length,
        usersMigrated: users.length,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to bootstrap RBAC";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
