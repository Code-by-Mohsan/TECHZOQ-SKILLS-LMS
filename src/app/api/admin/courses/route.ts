import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Course from "@/models/Course";
import Application from "@/models/Application";
import cloudinary from "@/lib/cloudinary";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { ALLOWED_UPLOAD_MIME_TYPES } from "@/lib/upload";

export async function GET(req: Request) {
  try {
    const permissionCheck = await requirePermissions(req, ["course.view"]);
    if (permissionCheck.error) return permissionCheck.error;

    await dbConnect();
    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Attach application count to each course
    const coursesWithCount = await Promise.all(
      courses.map(async (course) => {
        const applicationCount = await Application.countDocuments({ course: course._id });
        return { ...course, applicationCount };
      }),
    );

    return NextResponse.json({ success: true, data: coursesWithCount });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const permissionCheck = await requirePermissions(req, ["course.create"]);
    if (permissionCheck.error) return permissionCheck.error;

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const level = formData.get("level") as string;
    const duration = formData.get("duration") as string;
    const slug = formData.get("slug") as string;
    const thumbnail = formData.get("thumbnail") as File | null;
    const featuresRaw = formData.get("features") as string;
    const priceRaw = formData.get("price") as string;
    const enrollmentFeeRaw = formData.get("enrollmentFee") as string;
    const curriculumRaw = formData.get("curriculum") as string;
    const instructorRaw = formData.get("instructor") as string;

    if (!title || !description || !category || !slug) {
      return NextResponse.json(
        { success: false, message: "Title, description, category, and slug are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return NextResponse.json(
        { success: false, message: "A course with this slug already exists" },
        { status: 409 },
      );
    }

    let thumbnailUrl = "";
    if (thumbnail && thumbnail.size > 0) {
      if (!ALLOWED_UPLOAD_MIME_TYPES.has(thumbnail.type) || !thumbnail.type.startsWith("image/")) {
        return NextResponse.json(
          { success: false, message: "Thumbnail must be a valid image file" },
          { status: 400 },
        );
      }
      if (thumbnail.size > 3 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "Thumbnail exceeds 3MB size limit" },
          { status: 400 },
        );
      }
      const bytes = await thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "courses", resource_type: "image" },
              (err, res) => {
                if (err) return reject(err);
                resolve(res as { secure_url: string });
              },
            )
            .end(buffer);
        },
      );
      thumbnailUrl = result.secure_url;
    }

    const features = featuresRaw
      ? featuresRaw.split(",").map((f) => f.trim()).filter(Boolean)
      : [];

    let curriculum = [];
    if (curriculumRaw) {
      try { curriculum = JSON.parse(curriculumRaw); } catch { /* ignore */ }
    }

    let instructor = undefined;
    if (instructorRaw) {
      try { instructor = JSON.parse(instructorRaw); } catch { /* ignore */ }
    }

    const price = priceRaw ? Number(priceRaw) : 0;
    const enrollmentFee = enrollmentFeeRaw ? Number(enrollmentFeeRaw) : 0;

    const course = await Course.create({
      title,
      slug,
      description,
      category,
      level: level || "Beginner",
      duration: duration || "",
      thumbnail: thumbnailUrl,
      features,
      curriculum,
      instructor,
      price,
      enrollmentFee,
      createdBy: permissionCheck.auth?.userId ?? null,
      updatedBy: permissionCheck.auth?.userId ?? null,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "course.create",
      module: "courses",
      entityType: "Course",
      entityId: String(course._id),
      afterState: {
        title: course.title,
        slug: course.slug,
        category: course.category,
        isPublished: course.isPublished,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json(
      { success: true, data: course },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
