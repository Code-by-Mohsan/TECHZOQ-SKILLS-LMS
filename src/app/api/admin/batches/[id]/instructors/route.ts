import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import { batchInstructorAssignmentSchema } from "@/lib/validations/admin";
import BatchInstructorAssignment from "@/models/BatchInstructorAssignment";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const permissionCheck = await requirePermissions(req, ["batch.view"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { id } = await params;
    const assignments = await BatchInstructorAssignment.find({ batch: id, isActive: true })
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: assignments });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load batch instructors";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  const permissionCheck = await requirePermissions(req, ["instructor.assign"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = batchInstructorAssignmentSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const { id } = await params;

    const assignment = await BatchInstructorAssignment.findOneAndUpdate(
      {
        batch: id,
        user: parsed.data.userId,
        assignmentType: parsed.data.assignmentType,
      },
      {
        $set: {
          isActive: parsed.data.isActive ?? true,
          assignedBy: permissionCheck.auth?.userId ?? null,
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "batch.instructor.assign",
      module: "batches",
      entityType: "Batch",
      entityId: id,
      afterState: {
        user: parsed.data.userId,
        assignmentType: parsed.data.assignmentType,
        isActive: parsed.data.isActive ?? true,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: assignment });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to assign instructor";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

