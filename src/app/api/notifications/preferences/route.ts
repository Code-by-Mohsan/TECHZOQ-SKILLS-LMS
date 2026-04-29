import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import NotificationPreference from "@/models/NotificationPreference";

export async function GET(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    let preference = await NotificationPreference.findOne({ user: auth.userId }).lean();
    if (!preference) {
      preference = await NotificationPreference.create({
        user: auth.userId,
        updatedBy: auth.userId,
      });
    }
    return NextResponse.json({ success: true, data: preference });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load notification preferences";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await dbConnect();
    const preference = await NotificationPreference.findOneAndUpdate(
      { user: auth.userId },
      {
        $set: {
          inAppEnabled: body.inAppEnabled ?? true,
          emailEnabled: body.emailEnabled ?? false,
          whatsappEnabled: body.whatsappEnabled ?? false,
          quietHoursStart: body.quietHoursStart || "",
          quietHoursEnd: body.quietHoursEnd || "",
          timezone: body.timezone || "Asia/Karachi",
          updatedBy: auth.userId,
        },
      },
      { upsert: true, new: true },
    ).lean();

    return NextResponse.json({ success: true, data: preference });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update notification preferences";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
