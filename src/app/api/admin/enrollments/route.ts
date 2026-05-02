import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import { adminEnrollmentCreateSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["enrollment.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
    const batchId = (searchParams.get("batchId") || "").trim();
    const courseId = (searchParams.get("courseId") || "").trim();
    const status = (searchParams.get("status") || "").trim();

    const filter: Record<string, unknown> = {};
    if (batchId) filter.batch = batchId;
    if (courseId) filter.course = courseId;
    if (status) filter.status = status;

    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter)
        .populate({
          path: "student",
          select: "user phone city",
          populate: { path: "user", select: "name email" },
        })
        .populate("course", "title slug")
        .populate("batch", "name status startDate")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Enrollment.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { enrollments, total, page, limit },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch enrollments";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const permissionCheck = await requirePermissions(req, ["enrollment.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = adminEnrollmentCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { applicationId, studentId, courseId, batchId } = parsed.data;
    await dbConnect();

    const enrollment = await runInTransaction(async (session) => {
      let resolvedStudentId = studentId;
      if (applicationId) {
        const app = (await Application.findById(applicationId)
          .session(session)
          .select("student course status batch feesPaid")
          .lean()) as
          | { student: string; course: string; status: string; batch?: string | null; feesPaid?: boolean }
          | null;
        if (!app) {
          throw new HttpRouteError(404, "Application not found");
        }
        resolvedStudentId = String(app.student);
        if (String(app.course) !== courseId) {
          throw new HttpRouteError(400, "Course mismatch with application");
        }
        if (!app.feesPaid && app.status !== "enrolled") {
          throw new HttpRouteError(400, "Application fees must be marked paid before enrollment");
        }
      }

      if (!resolvedStudentId) {
        throw new HttpRouteError(400, "Student is required for enrollment");
      }

      const existing = await Enrollment.findOne({
        student: resolvedStudentId,
        course: courseId,
        batch: batchId,
      })
        .session(session)
        .lean();
      if (existing) {
        throw new HttpRouteError(409, "Enrollment already exists for this student/batch");
      }

      const created = (
        await Enrollment.create(
          [
            {
              student: resolvedStudentId,
              course: courseId,
              batch: batchId,
              application: applicationId || null,
              status: "enrolled",
              createdBy: permissionCheck.auth?.userId ?? null,
              updatedBy: permissionCheck.auth?.userId ?? null,
            },
          ],
          { session },
        )
      )[0];

      if (applicationId) {
        await Application.findByIdAndUpdate(
          applicationId,
          {
            status: "enrolled",
            batch: batchId,
            updatedBy: permissionCheck.auth?.userId ?? null,
          },
          { session },
        );
      }

      return created;
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "enrollment.create",
      module: "enrollments",
      entityType: "Enrollment",
      entityId: String(enrollment._id),
      afterState: {
        student: String(enrollment.student),
        course: String(enrollment.course),
        batch: String(enrollment.batch),
        status: enrollment.status,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: enrollment }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Failed to create enrollment";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
