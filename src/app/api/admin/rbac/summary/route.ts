import { NextResponse } from "next/server";
import { requirePermissions } from "@/lib/rbac";
import Role from "@/models/Role";
import Permission from "@/models/Permission";
import RolePermission from "@/models/RolePermission";
import User from "@/models/User";
import UserRole from "@/models/UserRole";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["rbac.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const { searchParams } = new URL(req.url);
    const userSearch = (searchParams.get("search") || "").trim();

    const [roles, permissions, users] = await Promise.all([
      Role.find({ isActive: true }).sort({ key: 1 }).lean(),
      Permission.find({ isActive: true }).sort({ module: 1, key: 1 }).lean(),
      User.find(
        userSearch
          ? {
              $or: [
                { name: { $regex: userSearch, $options: "i" } },
                { email: { $regex: userSearch, $options: "i" } },
              ],
            }
          : {},
      )
        .select("name email role createdAt")
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    ]);

    const [rolePermissions, userRoles] = await Promise.all([
      RolePermission.find({ role: { $in: roles.map((r: any) => r._id) } })
        .select("role permission")
        .lean(),
      UserRole.find({ user: { $in: users.map((u: any) => u._id) } })
        .select("user role")
        .lean(),
    ]);

    const rolePermissionMap = new Map<string, string[]>();
    rolePermissions.forEach((rp: any) => {
      const roleId = String(rp.role);
      const current = rolePermissionMap.get(roleId) || [];
      current.push(String(rp.permission));
      rolePermissionMap.set(roleId, current);
    });

    const userRoleMap = new Map<string, string[]>();
    userRoles.forEach((ur: any) => {
      const userId = String(ur.user);
      const current = userRoleMap.get(userId) || [];
      current.push(String(ur.role));
      userRoleMap.set(userId, current);
    });

    const hydratedRoles = roles.map((role: any) => ({
      ...role,
      permissionIds: rolePermissionMap.get(String(role._id)) || [],
      assignedUsers: Array.from(userRoleMap.values()).filter((ids) =>
        ids.includes(String(role._id)),
      ).length,
    }));

    const hydratedUsers = users.map((user: any) => ({
      ...user,
      roleIds: userRoleMap.get(String(user._id)) || [],
    }));

    return NextResponse.json({
      success: true,
      data: {
        roles: hydratedRoles,
        permissions,
        users: hydratedUsers,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load RBAC summary";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
