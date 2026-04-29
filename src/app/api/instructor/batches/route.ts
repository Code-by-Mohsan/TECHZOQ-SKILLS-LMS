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
    })
      .populate({
        path: "batch",
        select: "name status startDate endDate course maxStudents",
        populate: { path: "course", select: "title slug category" },
      })
      .sort({ createdAt: -1 })
      .lean();

    const batchIds = assignments
      .map((assignment: any) => assignment.batch?._id)
      .filter(Boolean);

    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { batch: { $in: batchIds } } },
      { $group: { _id: "$batch", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      enrollmentCounts.map((row: any) => [String(row._id), Number(row.count)]),
    );

    const data = assignments.map((assignment: any) => ({
      ...assignment,
      enrollmentCount: countMap.get(String(assignment.batch?._id)) || 0,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load instructor batches";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

