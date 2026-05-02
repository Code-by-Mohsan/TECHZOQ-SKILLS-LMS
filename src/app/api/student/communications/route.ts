import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import CommunicationLog from "@/models/CommunicationLog";

export async function GET(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") || 50), 200);
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const skip = (page - 1) * limit;

    const filter = { recipientUser: auth.userId };
    const [items, total] = await Promise.all([
      CommunicationLog.find(filter)
        .populate("senderUser", "name email")
        .populate("template", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CommunicationLog.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load communication timeline";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
