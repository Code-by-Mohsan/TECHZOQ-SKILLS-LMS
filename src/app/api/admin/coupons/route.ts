import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Coupon from "@/models/Coupon";
import { couponUpsertSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["coupon.create"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: coupons });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load coupons";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const permissionCheck = await requirePermissions(req, ["coupon.create"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = couponUpsertSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const coupon = await Coupon.create({
      ...parsed.data,
      createdBy: permissionCheck.auth?.userId ?? null,
      updatedBy: permissionCheck.auth?.userId ?? null,
      minimumAmount: parsed.data.minimumAmount || 0,
      perUserLimit: parsed.data.perUserLimit || 1,
      applicableCourses: parsed.data.applicableCourses || [],
      applicableBatches: parsed.data.applicableBatches || [],
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "coupon.create",
      module: "coupon",
      entityType: "Coupon",
      entityId: String(coupon._id),
      afterState: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create coupon";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
