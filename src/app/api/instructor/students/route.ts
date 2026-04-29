import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { normalizeRole } from "@/lib/constants/auth";
import BatchInstructorAssignment from "@/models/BatchInstructorAssignment";
import Enrollment from "@/models/Enrollment";

export async function GET(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const normalizedRole = normalizeRole(auth.role);
  if (normalizedRole !== "instructor" && normalizedRole !== "teaching_assistant") {
    return NextResponse.json({ success: false, message: "Instructor access required" }, { status: 403 });
  }

  try {
    await dbConnect();
    const assignments = await BatchInstructorAssignment.find({
      user: auth.userId,
      isActive: true,
    }).select("batch").lean();
    const batchIds = assignments.map((item: any) => item.batch).filter(Boolean);
    if (batchIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const enrollments = await Enrollment.find({
      batch: { $in: batchIds },
      status: { $in: ["enrolled", "active"] },
    })
      .populate({
        path: "student",
        select: "user phone",
        populate: { path: "user", select: "name email" },
      })
      .populate("batch", "name")
      .sort({ createdAt: -1 })
      .lean();

    const data = enrollments.map((item: any) => ({
      enrollmentId: String(item._id),
      batchId: String(item.batch?._id || ""),
      batchName: item.batch?.name || "",
      studentId: String(item.student?._id || ""),
      userId: String(item.student?.user?._id || ""),
      name: item.student?.user?.name || "Student",
      email: item.student?.user?.email || "",
      phone: item.student?.phone || "",
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load assigned students";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
