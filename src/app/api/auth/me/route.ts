import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { getUserPermissionKeys, getUserRoleKeys } from "@/lib/rbac";
import { isAdminRole, normalizeRole } from "@/lib/constants/auth";
import { DEFAULT_ROLE_PERMISSION_KEYS } from "@/lib/constants/rbac";
import User from "@/models/User";

export async function GET(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const user = await User.findById(auth.userId).select("name email role");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const [roleKeys, permissions] = await Promise.all([
      getUserRoleKeys(auth.userId),
      getUserPermissionKeys(auth.userId),
    ]);

    const normalizedRole = normalizeRole(user.role);
    const fallbackPermissions = DEFAULT_ROLE_PERMISSION_KEYS[normalizedRole] || [];
    const effectivePermissions =
      permissions.length > 0
        ? permissions
        : fallbackPermissions.includes("*")
          ? ["*"]
          : fallbackPermissions;

    return NextResponse.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        role: normalizedRole,
        roleKeys,
        permissions: effectivePermissions,
        canAccessAdmin: isAdminRole(normalizedRole),
      },
    });
  } catch (err) {
    console.error("[/api/auth/me] Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
