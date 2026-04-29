import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Batch from "@/models/Batch";
import "@/models/Course";
import { adminBatchUpsertSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import Enrollment from "@/models/Enrollment";

function normalizeBatchStatus(status: string | undefined): string {
  if (!status) return "planned";
  if (status === "upcoming") return "planned";
  if (status === "active") return "running";
  return status;
}

export async function GET(req: Request) {
  try {
    const permissionCheck = await requirePermissions(req, ["batch.view"]);
    if (permissionCheck.error) return permissionCheck.error;

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const courseFilter = searchParams.get("course");

    const filter: Record<string, unknown> = {};
    if (courseFilter) filter.course = courseFilter;

    const batches = await Batch.find(filter)
      .populate("course", "title slug category")
      .sort({ startDate: -1 })
      .lean();

    const batchIds = batches.map((batch: any) => batch._id);
    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { batch: { $in: batchIds } } },
      { $group: { _id: "$batch", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      enrollmentCounts.map((row: any) => [String(row._id), Number(row.count)]),
    );
    const data = batches.map((batch: any) => ({
      ...batch,
      enrollmentCount: countMap.get(String(batch._id)) || 0,
    }));

    return NextResponse.json({ success: true, data });
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
    const permissionCheck = await requirePermissions(req, ["batch.create"]);
    if (permissionCheck.error) return permissionCheck.error;

    const parsed = adminBatchUpsertSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    const { courseId, name, startDate, endDate, maxStudents, status } = parsed.data;

    await dbConnect();

    const batch = await Batch.create({
      course: courseId,
      name,
      startDate,
      endDate: endDate || null,
      maxStudents: maxStudents || null,
      status: normalizeBatchStatus(status),
      createdBy: permissionCheck.auth?.userId ?? null,
      updatedBy: permissionCheck.auth?.userId ?? null,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "batch.create",
      module: "batches",
      entityType: "Batch",
      entityId: String(batch._id),
      afterState: {
        course: String(batch.course),
        name: batch.name,
        status: batch.status,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json(
      { success: true, data: batch },
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
