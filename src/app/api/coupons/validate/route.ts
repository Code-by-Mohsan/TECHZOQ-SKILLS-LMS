import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { validateCouponForApplication } from "@/lib/growth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const code = (searchParams.get("code") || "").trim();
    const courseId = (searchParams.get("courseId") || "").trim();
    const amount = Number(searchParams.get("amount") || "0");

    if (!code || !courseId || !Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { success: false, message: "code, courseId and amount are required" },
        { status: 400 },
      );
    }

    const result = await validateCouponForApplication({
      couponCode: code,
      courseId,
      studentId: "preview",
      baseAmount: amount,
    });

    if (!result.coupon) {
      return NextResponse.json({ success: false, message: result.reason || "Invalid coupon" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        code: result.coupon.code,
        discountType: result.coupon.discountType,
        discountValue: result.coupon.discountValue,
        discountAmount: result.discountAmount,
        payableAmount: result.payableAmount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to validate coupon";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
