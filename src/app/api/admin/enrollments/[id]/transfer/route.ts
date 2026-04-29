import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import { adminEnrollmentTransferSchema } from "@/lib/validations/admin";
import Enrollment from "@/models/Enrollment";
import EnrollmentTransferLog from "@/models/EnrollmentTransferLog";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  const permissionCheck = await requirePermissions(req, ["enrollment.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = adminEnrollmentTransferSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { id } = await params;
    await dbConnect();

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return NextResponse.json({ success: false, message: "Enrollment not found" }, { status: 404 });
    }

    const fromBatch = String(enrollment.batch);
    if (fromBatch === parsed.data.toBatchId) {
      return NextResponse.json(
        { success: false, message: "Student is already in target batch" },
        { status: 400 },
      );
    }

    enrollment.batch = parsed.data.toBatchId as any;
    enrollment.status = "transferred";
    enrollment.updatedBy = permissionCheck.auth?.userId ?? null;
    await enrollment.save();

    await EnrollmentTransferLog.create({
      enrollment: enrollment._id,
      fromBatch,
      toBatch: parsed.data.toBatchId,
      reason: parsed.data.reason || "",
      transferredBy: permissionCheck.auth?.userId ?? null,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "enrollment.transfer",
      module: "enrollments",
      entityType: "Enrollment",
      entityId: String(enrollment._id),
      beforeState: { batch: fromBatch, status: "enrolled" },
      afterState: { batch: parsed.data.toBatchId, status: "transferred" },
      notes: parsed.data.reason || "",
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: enrollment });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to transfer enrollment";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

