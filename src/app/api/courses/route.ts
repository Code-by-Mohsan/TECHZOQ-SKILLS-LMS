import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

export async function GET() {
  try {
    await dbConnect();

    const courses = await Course.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select("title slug category description price level duration thumbnail features curriculum instructor")
      .lean();

    return NextResponse.json({ success: true, data: courses });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
