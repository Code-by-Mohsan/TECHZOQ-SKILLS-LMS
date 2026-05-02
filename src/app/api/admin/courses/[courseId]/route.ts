import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Course from "@/models/Course";
import Application from "@/models/Application";
import Batch from "@/models/Batch";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ courseId: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["course.view"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { courseId } = await params;
    await dbConnect();

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    const [applicationCount, batches] = await Promise.all([
      Application.countDocuments({ course: courseId }),
      Batch.find({ course: courseId }).sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: { ...course, applicationCount, batches },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["course.edit"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { courseId } = await params;
    const body = await req.json();

    await dbConnect();
    const beforeCourse = await Course.findById(courseId).lean();

    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        ...body,
        updatedBy: permissionCheck.auth?.userId ?? null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "course.update",
      module: "courses",
      entityType: "Course",
      entityId: courseId,
      beforeState: beforeCourse,
      afterState: course.toObject ? course.toObject() : course,
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: course });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["course.edit"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { courseId } = await params;
    await dbConnect();

    const applicationCount = await Application.countDocuments({ course: courseId });
    if (applicationCount > 0) {
      return NextResponse.json(
        { success: false, message: "Cannot delete course with existing applications" },
        { status: 400 },
      );
    }

    const batchCount = await Batch.countDocuments({ course: courseId });
    if (batchCount > 0) {
      return NextResponse.json(
        { success: false, message: "Cannot delete course with existing batches" },
        { status: 400 },
      );
    }

    const beforeCourse = await Course.findById(courseId).lean();
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "course.delete",
      module: "courses",
      entityType: "Course",
      entityId: courseId,
      beforeState: beforeCourse,
      afterState: null,
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
