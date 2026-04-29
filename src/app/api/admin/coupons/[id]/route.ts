import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Coupon from "@/models/Coupon";
import { couponUpsertSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params;
    const existing = await Coupon.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    const beforeState = {
      code: existing.code,
      discountType: existing.discountType,
      discountValue: existing.discountValue,
      isActive: existing.isActive,
    };

    existing.code = parsed.data.code;
    existing.title = parsed.data.title;
    existing.discountType = parsed.data.discountType;
    existing.discountValue = parsed.data.discountValue;
    existing.minimumAmount = parsed.data.minimumAmount || 0;
    existing.maxDiscountAmount = parsed.data.maxDiscountAmount || null;
    existing.usageLimit = parsed.data.usageLimit || null;
    existing.perUserLimit = parsed.data.perUserLimit || 1;
    existing.applicableCourses = parsed.data.applicableCourses || [];
    existing.applicableBatches = parsed.data.applicableBatches || [];
    existing.firstPaymentOnly = parsed.data.firstPaymentOnly || false;
    existing.startsAt = parsed.data.startsAt || null;
    existing.endsAt = parsed.data.endsAt || null;
    existing.isActive = parsed.data.isActive ?? existing.isActive;
    existing.updatedBy = permissionCheck.auth?.userId ?? null;
    await existing.save();

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "coupon.update",
      module: "coupon",
      entityType: "Coupon",
      entityId: String(existing._id),
      beforeState,
      afterState: {
        code: existing.code,
        discountType: existing.discountType,
        discountValue: existing.discountValue,
        isActive: existing.isActive,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: existing });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update coupon";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
