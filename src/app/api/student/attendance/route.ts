import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import Student from "@/models/Student";
import Attendance from "@/models/Attendance";

export async function GET(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const student = await Student.findOne({ user: auth.userId }).select("_id").lean() as { _id?: unknown } | null;
    if (!student?._id) {
      return NextResponse.json({ success: true, data: { records: [], stats: null } });
    }

    const records = await Attendance.find({ student: student._id })
      .populate("session", "title topic startsAt")
      .populate({
        path: "batch",
        select: "name course",
        populate: { path: "course", select: "title" },
      })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const total = records.length;
    const present = records.filter((item: any) => item.status === "present").length;
    const late = records.filter((item: any) => item.status === "late").length;
    const absent = records.filter((item: any) => item.status === "absent").length;
    const percentage = total > 0 ? Number((((present + late) / total) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      success: true,
      data: {
        records,
        stats: {
          total,
          present,
          late,
          absent,
          percentage,
        },
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load attendance";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
