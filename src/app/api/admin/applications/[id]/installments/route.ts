import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Application from "@/models/Application";
import InstallmentPlan from "@/models/InstallmentPlan";
import { installmentPlanCreateSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

import "@/models/Course";
import "@/models/User";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["application.review"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id } = await params;
    await dbConnect();

    const plans = await InstallmentPlan.find({ application: id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: plans });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["finance.view"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id } = await params;
    const parsed = installmentPlanCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { installments } = parsed.data;

    await dbConnect();

    const result = await runInTransaction(async (session) => {
      const application = await Application.findById(id)
        .populate("course", "price enrollmentFee")
        .session(session);

      if (!application) {
        throw new HttpRouteError(404, "Application not found");
      }

      // Cancel any existing active plan
      await InstallmentPlan.updateMany(
        { application: id, status: "active" },
        { $set: { status: "cancelled" } },
        { session },
      );

      const courseData = application.course as Record<string, unknown>;
      const courseFee = (courseData.price as number) || 0;
      const enrollmentFee = (courseData.enrollmentFee as number) || 0;
      const remainingFee = courseFee - enrollmentFee;
      const totalPlanAmount = installments.reduce((sum, i) => sum + i.amount, 0);

      // Validate total doesn't exceed remaining fee
      if (totalPlanAmount > remainingFee * 1.01) {
        throw new HttpRouteError(
          400,
          `Total installment amount (${totalPlanAmount}) exceeds remaining fee (${remainingFee})`,
        );
      }

      const installmentDocs = installments.map((inst, idx) => ({
        installmentNumber: idx + 1,
        amount: inst.amount,
        dueDate: inst.dueDate,
        status: "upcoming" as const,
        paidAmount: 0,
      }));

      const [plan] = await InstallmentPlan.create(
        [
          {
            student: application.student,
            application: id,
            course: courseData._id,
            totalAmount: totalPlanAmount,
            totalInstallments: installments.length,
            installments: installmentDocs,
            status: "active",
            createdBy: permissionCheck.auth?.userId,
          },
        ],
        { session },
      );

      return plan;
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "installment_plan.create",
      module: "finance",
      entityType: "InstallmentPlan",
      entityId: String(result._id),
      afterState: {
        applicationId: id,
        totalAmount: result.totalAmount,
        totalInstallments: result.totalInstallments,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
