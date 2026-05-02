import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import Notification from "@/models/Notification";

export async function GET(req: Request) {
  try {
    const auth = verifyAuth(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const baseFilter: Record<string, unknown> = { user: auth.userId };
    if (unreadOnly) baseFilter.read = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(baseFilter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Notification.countDocuments(baseFilter),
      Notification.countDocuments({ user: auth.userId, read: false }),
    ]);

    return NextResponse.json({
      success: true,
      data: { notifications, total, unreadCount, page, limit },
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
  try {
    const auth = verifyAuth(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { notificationIds, read } = await req.json();
    await dbConnect();
    const nextRead = read === false ? false : true;

    if (notificationIds && Array.isArray(notificationIds)) {
      await Notification.updateMany(
        { _id: { $in: notificationIds }, user: auth.userId },
        { read: nextRead },
      );
    } else {
      await Notification.updateMany(
        { user: auth.userId, read: false },
        { read: nextRead },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
