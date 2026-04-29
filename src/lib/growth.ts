import Coupon from "@/models/Coupon";
import CouponRedemption from "@/models/CouponRedemption";
import ReferralCode from "@/models/ReferralCode";
import ReferralEvent from "@/models/ReferralEvent";
import type { ClientSession } from "mongoose";

export function calculateDiscount(
  discountType: "flat" | "percentage",
  discountValue: number,
  baseAmount: number,
  maxDiscountAmount?: number | null,
): number {
  if (baseAmount <= 0) return 0;
  const computed = discountType === "flat"
    ? discountValue
    : (baseAmount * discountValue) / 100;
  const capped = typeof maxDiscountAmount === "number" && maxDiscountAmount > 0
    ? Math.min(computed, maxDiscountAmount)
    : computed;
  return Math.max(0, Number(capped.toFixed(2)));
}

export async function validateCouponForApplication(args: {
  couponCode?: string;
  courseId: string;
  studentId: string;
  baseAmount: number;
  session?: ClientSession;
}) {
  const { couponCode, courseId, studentId, baseAmount, session } = args;
  if (!couponCode) return { coupon: null, discountAmount: 0, payableAmount: baseAmount, reason: "" };

  const normalizedCode = couponCode.toUpperCase().trim();
  const coupon = await Coupon.findOne({ code: normalizedCode, isActive: true }).session(session || null).lean() as any;
  if (!coupon) {
    return { coupon: null, discountAmount: 0, payableAmount: baseAmount, reason: "Coupon not found or inactive" };
  }

  const now = new Date();
  if (coupon.startsAt && new Date(coupon.startsAt) > now) {
    return { coupon: null, discountAmount: 0, payableAmount: baseAmount, reason: "Coupon is not active yet" };
  }
  if (coupon.endsAt && new Date(coupon.endsAt) < now) {
    return { coupon: null, discountAmount: 0, payableAmount: baseAmount, reason: "Coupon has expired" };
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { coupon: null, discountAmount: 0, payableAmount: baseAmount, reason: "Coupon usage limit reached" };
  }
  if (coupon.minimumAmount && baseAmount < coupon.minimumAmount) {
    return { coupon: null, discountAmount: 0, payableAmount: baseAmount, reason: "Minimum amount condition not met" };
  }
  if (Array.isArray(coupon.applicableCourses) && coupon.applicableCourses.length > 0) {
    const hasCourse = coupon.applicableCourses.some((id: unknown) => String(id) === courseId);
    if (!hasCourse) {
      return { coupon: null, discountAmount: 0, payableAmount: baseAmount, reason: "Coupon not applicable for this course" };
    }
  }

  const userUses = await CouponRedemption.countDocuments({
    coupon: coupon._id,
    student: studentId,
    status: { $in: ["reserved", "consumed"] },
  }).session(session || null);
  if (coupon.perUserLimit && userUses >= coupon.perUserLimit) {
    return { coupon: null, discountAmount: 0, payableAmount: baseAmount, reason: "Per-user coupon limit reached" };
  }

  const discountAmount = calculateDiscount(coupon.discountType, coupon.discountValue, baseAmount, coupon.maxDiscountAmount);
  const payableAmount = Math.max(0, Number((baseAmount - discountAmount).toFixed(2)));
  return { coupon, discountAmount, payableAmount, reason: "" };
}

export async function reserveCoupon(args: {
  coupon: any;
  code: string;
  studentId: string;
  applicationId: string;
  baseAmount: number;
  discountAmount: number;
  payableAmount: number;
  session?: ClientSession;
}) {
  const session = args.session || null;
  const existing = await CouponRedemption.findOne({
    coupon: args.coupon._id,
    student: args.studentId,
    application: args.applicationId,
  }).session(session);

  if (existing) {
    return existing;
  }

  let redemption: any;
  try {
    [redemption] = await CouponRedemption.create(
      [
        {
          coupon: args.coupon._id,
          code: args.code,
          student: args.studentId,
          application: args.applicationId,
          baseAmount: args.baseAmount,
          discountAmount: args.discountAmount,
          payableAmount: args.payableAmount,
          status: "reserved",
        },
      ],
      { session: session || undefined },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("E11000")) {
      const duplicate = await CouponRedemption.findOne({
        coupon: args.coupon._id,
        student: args.studentId,
        application: args.applicationId,
      }).session(session);
      if (duplicate) return duplicate;
    }
    throw error;
  }

  await Coupon.updateOne(
    { _id: args.coupon._id },
    { $inc: { usedCount: 1 } },
    { session: session || undefined },
  );
  return redemption;
}

export async function validateReferralCode(args: {
  referralCode?: string;
  refereeUserId?: string;
  session?: ClientSession;
}) {
  const { referralCode, refereeUserId, session } = args;
  if (!referralCode) return { referral: null, reason: "" };

  const normalized = referralCode.toUpperCase().trim();
  const referral = await ReferralCode.findOne({ code: normalized, isActive: true })
    .session(session || null)
    .populate("ownerUser", "role")
    .lean() as any;
  if (!referral) return { referral: null, reason: "Referral code not found or inactive" };

  const now = new Date();
  if (referral.startsAt && new Date(referral.startsAt) > now) {
    return { referral: null, reason: "Referral code is not active yet" };
  }
  if (referral.endsAt && new Date(referral.endsAt) < now) {
    return { referral: null, reason: "Referral code has expired" };
  }
  if (referral.usageLimit && referral.usedCount >= referral.usageLimit) {
    return { referral: null, reason: "Referral usage limit reached" };
  }
  if (refereeUserId && String(referral.ownerUser?._id) === refereeUserId) {
    return { referral: null, reason: "Self-referral is not allowed" };
  }

  return { referral, reason: "" };
}

export async function createReferralEvent(args: {
  referral: any;
  refereeUserId?: string;
  studentId?: string;
  applicationId?: string;
  eventType?: "signup" | "application_submitted" | "payment_verified" | "rejected" | "cancelled";
  session?: ClientSession;
}) {
  if (!args.referral) return null;
  const session = args.session || null;
  const eventType = args.eventType || "application_submitted";
  const existing = args.applicationId
    ? await ReferralEvent.findOne({
        referralCode: args.referral._id,
        application: args.applicationId,
        eventType,
      }).session(session)
    : null;

  if (existing) {
    return existing;
  }

  let event: any;
  try {
    [event] = await ReferralEvent.create(
      [
        {
          referralCode: args.referral._id,
          code: args.referral.code,
          referrerUser: args.referral.ownerUser?._id || args.referral.ownerUser,
          refereeUser: args.refereeUserId || null,
          student: args.studentId || null,
          application: args.applicationId || null,
          eventType,
        },
      ],
      { session: session || undefined },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("E11000") && args.applicationId) {
      const duplicate = await ReferralEvent.findOne({
        referralCode: args.referral._id,
        application: args.applicationId,
        eventType,
      }).session(session);
      if (duplicate) return duplicate;
    }
    throw error;
  }

  await ReferralCode.updateOne(
    { _id: args.referral._id },
    { $inc: { usedCount: 1 } },
    { session: session || undefined },
  );
  return event;
}
