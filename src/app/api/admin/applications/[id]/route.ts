import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Application from "@/models/Application";
import { createNotification } from "@/lib/notifications";
import { adminApplicationUpdateSchema } from "@/lib/validations/admin";
import ApplicationStatusHistory from "@/models/ApplicationStatusHistory";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import Enrollment from "@/models/Enrollment";
import Invoice from "@/models/Invoice";
import PaymentSubmission from "@/models/PaymentSubmission";
import LedgerEntry from "@/models/LedgerEntry";
import CouponRedemption from "@/models/CouponRedemption";
import AdminDiscount from "@/models/AdminDiscount";
import InstallmentPlan from "@/models/InstallmentPlan";
import ReferralEvent from "@/models/ReferralEvent";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

// Ensure models are registered for populate
import "@/models/Course";
import "@/models/Batch";
import "@/models/Student";
import "@/models/User";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const STATUS_MESSAGES: Record<string, { message: string; type: string }> = {
  submitted: {
    message: "Your application has been submitted.",
    type: "application_submitted",
  },
  under_review: {
    message: "Your application is now under review.",
    type: "application_submitted",
  },
  shortlisted: {
    message: "Your application has been shortlisted.",
    type: "application_approved",
  },
  approved: {
    message: "Your application has been approved!",
    type: "application_approved",
  },
  waitlisted: {
    message: "Your application is currently waitlisted.",
    type: "application_submitted",
  },
  fee_pending: {
    message: "Please submit your fees to complete enrollment.",
    type: "fees_pending",
  },
  rejected: {
    message: "Your application has been rejected.",
    type: "application_rejected",
  },
  fees_pending: {
    message: "Please submit your fees to complete enrollment.",
    type: "fees_pending",
  },
  fees_submitted: {
    message: "Your fee submission has been recorded. Awaiting verification.",
    type: "fees_submitted",
  },
  enrolled: {
    message: "Congratulations! You are now enrolled in the course.",
    type: "enrolled",
  },
};

const ALL_APPLICATION_STATUSES = [
  "draft", "submitted", "under_review", "contacted", "shortlisted",
  "pending", "approved", "waitlisted", "fee_pending", "fees_pending",
  "fees_submitted", "enrolled", "rejected", "cancelled",
];

function normalizeApplicationStatus(input: string): string {
  return input === "fee_pending" ? "fees_pending" : input;
}

function isValidStatusTransition(_currentStatus: string, nextStatus: string): boolean {
  return ALL_APPLICATION_STATUSES.includes(nextStatus);
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["application.review"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id } = await params;
    await dbConnect();

    const application = await Application.findById(id)
      .populate({
        path: "student",
        select: "user phone address city education dateOfBirth gender occupation",
        populate: { path: "user", select: "name email" },
      })
      .populate("course", "title slug category level duration price enrollmentFee thumbnail")
      .populate("batch", "name startDate endDate status")
      .lean() as Record<string, unknown> | null;

    if (!application) {
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    const studentId = (application.student as Record<string, unknown>)?._id;

    // Fetch related data in parallel
    const [history, invoices, payments, ledger, couponRedemptions, adminDiscounts, installmentPlans, referralEvents] = await Promise.all([
      ApplicationStatusHistory.find({ application: id })
        .populate("changedBy", "name email")
        .sort({ createdAt: -1 })
        .lean(),
      Invoice.find({
        student: studentId,
        course: (application.course as Record<string, unknown>)?._id,
        status: { $ne: "cancelled" },
      })
        .select("invoiceNumber subtotalAmount discountAmount totalAmount paidAmount dueAmount status issuedAt dueDate")
        .sort({ createdAt: -1 })
        .lean(),
      PaymentSubmission.find({ student: studentId })
        .populate("invoice", "invoiceNumber course")
        .select("amount paymentMethod transactionReference verificationStatus submittedAt verifiedAt financeRemarks rejectionReason")
        .sort({ createdAt: -1 })
        .lean()
        .then((subs) =>
          subs.filter((s) => {
            const inv = s.invoice as Record<string, unknown> | null;
            return inv && String(inv.course) === String((application.course as Record<string, unknown>)?._id);
          }),
        ),
      LedgerEntry.find({ student: studentId })
        .select("entryType debitAmount creditAmount balanceAfter remarks createdAt")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      CouponRedemption.find({ application: id })
        .populate("coupon", "code title discountType discountValue")
        .select("code baseAmount discountAmount payableAmount status consumedAt")
        .lean(),
      AdminDiscount.find({ application: id })
        .populate("givenBy", "name email")
        .select("discountType discountValue discountAmount reason givenBy createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      InstallmentPlan.find({ application: id })
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .lean(),
      ReferralEvent.find({ application: id })
        .populate("referrerUser", "name email")
        .populate("refereeUser", "name email")
        .populate("referralCode", "code rewardDiscountType rewardDiscountValue")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // Compute fee summary
    const course = application.course as Record<string, unknown>;
    const courseFee = (course?.price as number) || 0;
    const enrollmentFee = (course?.enrollmentFee as number) || 0;

    const totalInvoiced = invoices.reduce((s, i) => s + ((i as Record<string, number>).totalAmount || 0), 0);

    // Sum discounts from admin discounts + non-reversed coupon redemptions (source of truth)
    const adminDiscountTotal = adminDiscounts.reduce((s, d) => s + ((d as Record<string, number>).discountAmount || 0), 0);
    const couponDiscountTotal = couponRedemptions
      .filter((cr) => (cr as Record<string, unknown>).status !== "reversed")
      .reduce((s, cr) => s + ((cr as Record<string, number>).discountAmount || 0), 0);
    const totalDiscount = adminDiscountTotal + couponDiscountTotal;

    const netFee = Math.max(0, courseFee - totalDiscount);

    // Compute totalPaid from verified payment submissions (source of truth)
    const totalPaidFromPayments = payments.reduce((s, p) => {
      const ps = p as Record<string, unknown>;
      return s + (ps.verificationStatus === "verified" ? (ps.amount as number) || 0 : 0);
    }, 0);
    // Use whichever is higher: invoice-tracked paid or actual verified payments
    const totalPaid = Math.max(
      totalPaidFromPayments,
      invoices.reduce((s, i) => s + ((i as Record<string, number>).paidAmount || 0), 0),
    );
    const totalDue = Math.max(0, netFee - totalPaid);

    let feeStatus: "unpaid" | "partially_paid" | "paid" = "unpaid";
    if (netFee > 0) {
      if (totalDue <= 0) feeStatus = "paid";
      else if (totalPaid > 0) feeStatus = "partially_paid";
    }

    const feeSummary = {
      courseFee,
      enrollmentFee,
      remainingFee: courseFee - enrollmentFee,
      totalDiscount,
      netFee,
      totalInvoiced,
      totalPaid,
      totalDue,
      feeStatus,
    };

    return NextResponse.json({
      success: true,
      data: {
        application,
        history,
        invoices,
        payments,
        ledger,
        couponRedemptions,
        adminDiscounts,
        installmentPlans,
        referralEvents,
        feeSummary,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["application.approve"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id } = await params;
    const parsed = adminApplicationUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    const body = parsed.data;
    const batchId = body.batchId !== undefined ? body.batchId : body.batch;

    await dbConnect();
    const tx = await runInTransaction(async (session) => {
      const application = await Application.findById(id)
        .session(session)
        .populate("course", "title")
        .populate({
          path: "student",
          select: "user",
        });

      if (!application) {
        throw new HttpRouteError(404, "Application not found");
      }

      const beforeState = {
        status: application.status,
        feesPaid: application.feesPaid,
        batch: application.batch,
        statusNote: application.statusNote,
      };

      const normalizedStatus = body.status ? normalizeApplicationStatus(body.status) : undefined;
      if (normalizedStatus && !isValidStatusTransition(application.status, normalizedStatus)) {
        throw new HttpRouteError(
          400,
          `Invalid status transition: ${application.status} -> ${normalizedStatus}`,
        );
      }

      if (normalizedStatus) application.status = normalizedStatus;
      if (body.feesPaid !== undefined) application.feesPaid = body.feesPaid;
      if (batchId !== undefined) application.batch = batchId || null;
      if (body.statusNote !== undefined) application.statusNote = body.statusNote;

      if (permissionCheck.auth?.userId) application.updatedBy = permissionCheck.auth.userId;
      await application.save({ session });

      if (normalizedStatus && normalizedStatus !== beforeState.status) {
        await ApplicationStatusHistory.create(
          [
            {
              application: application._id,
              fromStatus: beforeState.status,
              toStatus: normalizedStatus,
              changedBy: permissionCheck.auth?.userId ?? null,
              statusNote: body.statusNote || "",
            },
          ],
          { session },
        );
      }

      if (normalizedStatus === "enrolled" && application.batch) {
        await Enrollment.updateOne(
          {
            student: application.student,
            course: application.course,
            batch: application.batch,
          },
          {
            $setOnInsert: {
              application: application._id,
              status: "enrolled",
              createdBy: permissionCheck.auth?.userId ?? null,
              updatedBy: permissionCheck.auth?.userId ?? null,
            },
          },
          { upsert: true, session },
        );
      }

      if (normalizedStatus && ["rejected", "cancelled"].includes(normalizedStatus)) {
        await Enrollment.updateMany(
          { application: application._id, status: { $in: ["enrolled", "active", "paused"] } },
          {
            $set: {
              status: "cancelled",
              cancelledAt: new Date(),
              updatedBy: permissionCheck.auth?.userId ?? null,
            },
          },
          { session },
        );
      }

      return {
        applicationId: String(application._id),
        status: application.status,
        feesPaid: application.feesPaid,
        batch: application.batch,
        statusNote: application.statusNote,
        normalizedStatus,
        beforeState,
        courseTitle: (application.course as { title: string }).title,
        userId: String((application.student as { user: { toString: () => string } }).user),
      };
    });

    // Notifications are post-commit side-effects.
    if (tx.normalizedStatus && STATUS_MESSAGES[tx.normalizedStatus]) {
      const { message, type } = STATUS_MESSAGES[tx.normalizedStatus];
      await createNotification(
        tx.userId,
        `${tx.courseTitle}: ${message}`,
        type as "application_submitted" | "application_approved" | "application_rejected" | "fees_pending" | "fees_submitted" | "enrolled",
        "/dashboard/student",
      ).catch(() => null);
    }

    if (batchId) {
      await createNotification(
        tx.userId,
        `You have been assigned to a batch for ${tx.courseTitle}.`,
        "batch_assigned",
        "/dashboard/student",
      ).catch(() => null);
    }

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "application.update",
      module: "applications",
      entityType: "Application",
      entityId: tx.applicationId,
      beforeState: tx.beforeState,
      afterState: {
        status: tx.status,
        feesPaid: tx.feesPaid,
        batch: tx.batch,
        statusNote: tx.statusNote,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    const application = await Application.findById(tx.applicationId)
      .populate("course", "title slug")
      .populate({ path: "student", select: "user phone", populate: { path: "user", select: "name email" } })
      .populate("batch", "name")
      .lean();

    return NextResponse.json({ success: true, data: application });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
