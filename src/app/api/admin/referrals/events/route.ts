import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import ReferralEvent from "@/models/ReferralEvent";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["referral.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "").trim();
    const eventType = (searchParams.get("eventType") || "").trim();

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;

    const events = await ReferralEvent.find(filter)
      .populate("referrerUser", "name email role")
      .populate("refereeUser", "name email role")
      .populate("application", "status appliedAt")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json({ success: true, data: events });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load referral events";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
