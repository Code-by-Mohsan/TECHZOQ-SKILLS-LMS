import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import ReferralCode from "@/models/ReferralCode";
import User from "@/models/User";
import { referralCodeUpsertSchema } from "@/lib/validations/admin";
import { normalizeRole } from "@/lib/constants/auth";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["referral.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const codes = await ReferralCode.find({})
      .populate("ownerUser", "name email role")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: codes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load referral codes";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const permissionCheck = await requirePermissions(req, ["referral.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = referralCodeUpsertSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const owner = await User.findById(parsed.data.ownerUserId).select("role");
    if (!owner) {
      return NextResponse.json({ success: false, message: "Owner user not found" }, { status: 404 });
    }

    const referral = await ReferralCode.create({
      code: parsed.data.code,
      ownerUser: parsed.data.ownerUserId,
      ownerRoleSnapshot: normalizeRole(owner.role),
      title: parsed.data.title || "",
      usageLimit: parsed.data.usageLimit || null,
      startsAt: parsed.data.startsAt || null,
      endsAt: parsed.data.endsAt || null,
      isActive: parsed.data.isActive ?? true,
      rewardDiscountType: parsed.data.rewardDiscountType || "",
      rewardDiscountValue: parsed.data.rewardDiscountValue || 0,
      createdBy: permissionCheck.auth?.userId ?? null,
      updatedBy: permissionCheck.auth?.userId ?? null,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "referral.code.create",
      module: "referral",
      entityType: "ReferralCode",
      entityId: String(referral._id),
      afterState: { code: referral.code, ownerUser: parsed.data.ownerUserId },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: referral }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create referral code";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
