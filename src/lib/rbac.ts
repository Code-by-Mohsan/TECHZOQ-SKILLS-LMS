import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { normalizeRole } from "@/lib/constants/auth";
import { DEFAULT_ROLE_PERMISSION_KEYS } from "@/lib/constants/rbac";
import dbConnect from "@/lib/db";
import Role from "@/models/Role";
import Permission from "@/models/Permission";
import RolePermission from "@/models/RolePermission";
import User from "@/models/User";
import UserRole from "@/models/UserRole";

type PermissionCheckResult = {
  auth: { userId: string; role: string } | null;
  roleKeys: string[];
  permissions: string[];
  error: NextResponse | null;
};

export async function getUserRoleKeys(userId: string): Promise<string[]> {
  const explicitRoles = await UserRole.find({ user: userId })
    .populate("role", "key isActive")
    .lean();

  const activeKeys = explicitRoles
    .map((ur: any) => ur.role)
    .filter((role: any) => role && role.isActive)
    .map((role: any) => String(role.key));

  if (activeKeys.length > 0) {
    return Array.from(new Set(activeKeys));
  }

  return [];
}

export async function getUserPermissionKeys(userId: string): Promise<string[]> {
  const roleKeys = await getUserRoleKeys(userId);

  if (roleKeys.includes("super_admin")) {
    return ["*"];
  }

  const roles = await Role.find({ key: { $in: roleKeys }, isActive: true })
    .select("_id")
    .lean();

  if (roles.length === 0) {
    return [];
  }

  const roleIds = roles.map((role: any) => role._id);
  const rolePermissions = await RolePermission.find({ role: { $in: roleIds } })
    .populate("permission", "key isActive")
    .lean();

  const permissionKeys = rolePermissions
    .map((rp: any) => rp.permission)
    .filter((permission: any) => permission && permission.isActive)
    .map((permission: any) => String(permission.key));

  return Array.from(new Set(permissionKeys));
}

export function hasPermission(
  grantedPermissions: string[],
  requiredPermissions: string[],
): boolean {
  if (grantedPermissions.includes("*")) return true;
  return requiredPermissions.every((perm) => grantedPermissions.includes(perm));
}

export async function requirePermissions(
  req: Request,
  requiredPermissions: string[],
): Promise<PermissionCheckResult> {
  const auth = verifyAuth(req);
  if (!auth) {
    return {
      auth: null,
      roleKeys: [],
      permissions: [],
      error: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  await dbConnect();
  const roleKeys = await getUserRoleKeys(auth.userId);

  let effectiveRoleKeys = roleKeys;
  let permissions: string[];

  if (roleKeys.length === 0) {
    // Fallback: derive permissions from JWT role when no DB-based RBAC records exist.
    // This mirrors the same fallback used in /api/auth/me so the admin layout
    // and the data-fetching API routes stay in sync.
    const normalizedRole = normalizeRole(auth.role);
    const fallback = DEFAULT_ROLE_PERMISSION_KEYS[normalizedRole] || [];
    permissions = fallback.includes("*") ? ["*"] : fallback;
    effectiveRoleKeys = normalizedRole ? [normalizedRole] : [];

    if (permissions.length === 0) {
      return {
        auth,
        roleKeys: [],
        permissions: [],
        error: NextResponse.json(
          { success: false, message: "No roles assigned to this account" },
          { status: 403 },
        ),
      };
    }
  } else {
    permissions = await getUserPermissionKeys(auth.userId);
  }

  if (!hasPermission(permissions, requiredPermissions)) {
    return {
      auth,
      roleKeys: effectiveRoleKeys,
      permissions,
      error: NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 },
      ),
    };
  }

  return { auth, roleKeys: effectiveRoleKeys, permissions, error: null };
}

export async function syncPrimaryUserRole(userId: string): Promise<void> {
  const roleKeys = await getUserRoleKeys(userId);

  if (roleKeys.includes("super_admin") || roleKeys.includes("admin")) {
    await User.findByIdAndUpdate(userId, { role: "admin" });
    return;
  }

  if (roleKeys.includes("instructor") || roleKeys.includes("teaching_assistant")) {
    await User.findByIdAndUpdate(userId, { role: "instructor" });
    return;
  }

  await User.findByIdAndUpdate(userId, { role: "student" });
}

export async function resolvePermissionIds(permissionKeys: string[]): Promise<string[]> {
  const permissions = await Permission.find({ key: { $in: permissionKeys } })
    .select("_id key")
    .lean();
  return permissions.map((permission: any) => String(permission._id));
}
