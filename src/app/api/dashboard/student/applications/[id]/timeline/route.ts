import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import Student from "@/models/Student";
import Application from "@/models/Application";
import ApplicationStatusHistory from "@/models/ApplicationStatusHistory";
import ApplicationNote from "@/models/ApplicationNote";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = await params;

    const student = (await Student.findOne({ user: auth.userId }).select("_id").lean()) as {
      _id: string;
    } | null;
    if (!student) {
      return NextResponse.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const application = await Application.findOne({ _id: id, student: student._id })
      .select("_id")
      .lean();
    if (!application) {
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    const [statusHistory, notes] = await Promise.all([
      ApplicationStatusHistory.find({ application: id, visibleToStudent: true })
        .sort({ createdAt: -1 })
        .lean(),
      ApplicationNote.find({ application: id, noteType: "student_visible" })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        statusHistory,
        notes,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load timeline";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

