import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { validateReferralCode } from "@/lib/growth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const { searchParams } = new URL(req.url);
    const code = (searchParams.get("code") || "").trim();
    if (!code) {
      return NextResponse.json({ success: false, message: "code is required" }, { status: 400 });
    }

    const result = await validateReferralCode({
      referralCode: code,
      refereeUserId: auth?.userId,
    });

    if (!result.referral) {
      return NextResponse.json({ success: false, message: result.reason || "Invalid referral code" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        code: result.referral.code,
        ownerRole: result.referral.ownerRoleSnapshot,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to validate referral code";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
