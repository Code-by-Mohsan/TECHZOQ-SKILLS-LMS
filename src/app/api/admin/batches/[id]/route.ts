import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Batch from "@/models/Batch";
import Enrollment from "@/models/Enrollment";
import { adminBatchUpsertSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function normalizeBatchStatus(status: string | undefined): string {
  if (!status) return "planned";
  if (status === "upcoming") return "planned";
  if (status === "active") return "running";
  return status;
}

export async function PUT(req: Request, { params }: RouteParams) {
  const permissionCheck = await requirePermissions(req, ["batch.create"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const { id } = await params;
    const parsed = adminBatchUpsertSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const existing = await Batch.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Batch not found" },
        { status: 404 },
      );
    }

    const beforeState = {
      course: existing.course,
      name: existing.name,
      startDate: existing.startDate,
      endDate: existing.endDate,
      maxStudents: existing.maxStudents,
      status: existing.status,
    };

    existing.course = parsed.data.courseId as any;
    existing.name = parsed.data.name;
    existing.startDate = parsed.data.startDate as any;
    existing.endDate = (parsed.data.endDate || null) as any;
    existing.maxStudents = (parsed.data.maxStudents || null) as any;
    existing.status = normalizeBatchStatus(parsed.data.status) as any;
    existing.updatedBy = permissionCheck.auth?.userId ?? null;

    await existing.save();

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "batch.update",
      module: "batches",
      entityType: "Batch",
      entityId: String(existing._id),
      beforeState,
      afterState: {
        course: existing.course,
        name: existing.name,
        startDate: existing.startDate,
        endDate: existing.endDate,
        maxStudents: existing.maxStudents,
        status: existing.status,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: existing });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update batch";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const permissionCheck = await requirePermissions(req, ["batch.create"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const { id } = await params;
    await dbConnect();

    const batch = await Batch.findById(id);
    if (!batch) {
      return NextResponse.json(
        { success: false, message: "Batch not found" },
        { status: 404 },
      );
    }

    const enrollmentsCount = await Enrollment.countDocuments({ batch: id });
    if (enrollmentsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete batch with enrollments. Transfer/cancel enrollments first.",
        },
        { status: 409 },
      );
    }

    const beforeState = {
      course: batch.course,
      name: batch.name,
      status: batch.status,
    };

    await batch.deleteOne();

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "batch.delete",
      module: "batches",
      entityType: "Batch",
      entityId: id,
      beforeState,
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete batch";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
