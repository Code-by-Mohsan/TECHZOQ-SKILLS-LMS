import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import User from "@/models/User";
import Role from "@/models/Role";
import UserRole from "@/models/UserRole";
import { adminUserRoleUpdateSchema } from "@/lib/validations/admin";
import { normalizeRole } from "@/lib/constants/auth";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["user.view"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
    const search = searchParams.get("search") || "";

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("name email role createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { users, total, page, limit },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const permissionCheck = await requirePermissions(req, ["user.role.assign"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = adminUserRoleUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { userId, role } = parsed.data;
    const normalizedRole = normalizeRole(role);

    await dbConnect();
    const beforeUser = await User.findById(userId).select("role").lean() as { role?: string } | null;

    const user = await User.findByIdAndUpdate(userId, { role: normalizedRole }, {
      new: true,
      runValidators: true,
    }).select("name email role createdAt");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const matchingRole = (await Role.findOne({ key: normalizedRole })
      .select("_id")
      .lean()) as { _id: string } | null;
    if (matchingRole) {
      await UserRole.updateOne(
        { user: userId, role: matchingRole._id },
        {
          $set: {
            assignedBy: permissionCheck.auth?.userId ?? null,
            assignedAt: new Date(),
          },
          $setOnInsert: { isPrimary: true },
        },
        { upsert: true },
      );
    }

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "user.role.update",
      module: "users",
      entityType: "User",
      entityId: userId,
      beforeState: { role: beforeUser?.role ?? null },
      afterState: { role: user.role },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
