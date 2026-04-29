import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Attendance from "@/models/Attendance";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["attendance.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const batchId = (searchParams.get("batchId") || "").trim();
    const sessionId = (searchParams.get("sessionId") || "").trim();
    const studentId = (searchParams.get("studentId") || "").trim();
    const limit = Math.min(Number(searchParams.get("limit") || 100), 500);

    const filter: Record<string, unknown> = {};
    if (batchId) filter.batch = batchId;
    if (sessionId) filter.session = sessionId;
    if (studentId) filter.student = studentId;

    const records = await Attendance.find(filter)
      .populate({
        path: "student",
        select: "user",
        populate: { path: "user", select: "name email" },
      })
      .populate("session", "title startsAt")
      .populate("batch", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: records });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load attendance report";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
