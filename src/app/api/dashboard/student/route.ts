import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import User from "@/models/User";
import Student from "@/models/Student";
import Application from "@/models/Application";
import "@/models/Course";
import "@/models/Batch";

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

    const user = await User.findById(auth.userId).select("name email").lean() as { name: string; email: string } | null;

    const student = await Student.findOne({ user: auth.userId }).lean() as { _id: string } | null;
    if (!student) {
      return NextResponse.json({
        success: true,
        data: {
          user: user ? { name: user.name, email: user.email } : null,
          applications: [],
        },
      });
    }

    const applications = await Application.find({ student: student._id })
      .populate("course", "title slug category level duration thumbnail price")
      .populate("batch", "name startDate endDate status")
      .sort({ appliedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        user: user ? { name: user.name, email: user.email } : null,
        applications,
      },
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
