import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import PaymentSubmission from "@/models/PaymentSubmission";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";
import { adminPaymentReviewSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { getStudentBalance } from "@/lib/finance";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

const paymentReviewPayloadSchema = z.object({
  paymentId: z.string().min(1),
  review: adminPaymentReviewSchema,
});

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["finance.view"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "").trim();

    const filter: Record<string, unknown> = {};
    if (status) filter.verificationStatus = status;

    const payments = await PaymentSubmission.find(filter)
      .populate({
        path: "student",
        select: "user",
        populate: { path: "user", select: "name email" },
      })
      .populate("invoice", "invoiceNumber totalAmount dueAmount status")
      .sort({ createdAt: -1 })
      .lean();

    const data = payments.map((payment: any) => ({
      ...payment,
      screenshotAccessPath: payment.screenshotFileAsset
        ? `/api/files/${String(payment.screenshotFileAsset)}?redirect=true`
        : null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load payment submissions";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const permissionCheck = await requirePermissions(req, ["payment.verify"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = paymentReviewPayloadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    await dbConnect();

    const tx = await runInTransaction(async (session) => {
      const payment = await PaymentSubmission.findById(parsed.data.paymentId).session(session);
      if (!payment) {
        throw new HttpRouteError(404, "Payment submission not found");
      }

      const beforeState = {
        verificationStatus: payment.verificationStatus,
        rejectionReason: payment.rejectionReason,
        financeRemarks: payment.financeRemarks,
      };
      const nextStatus = parsed.data.review.verificationStatus;

      if (beforeState.verificationStatus === "verified" && nextStatus === "verified") {
        throw new HttpRouteError(409, "Payment is already verified");
      }

      if (beforeState.verificationStatus === "verified" && nextStatus !== "verified") {
        throw new HttpRouteError(400, "Verified payments cannot be downgraded from this endpoint");
      }

      const existingLedger = await LedgerEntry.findOne({
        paymentSubmission: payment._id,
        entryType: "payment_verified",
      })
        .session(session)
        .select("_id")
        .lean();
      if (existingLedger) {
        throw new HttpRouteError(409, "Payment verification ledger entry already exists");
      }

      payment.verificationStatus = nextStatus;
      payment.rejectionReason = parsed.data.review.rejectionReason || "";
      payment.financeRemarks = parsed.data.review.financeRemarks || "";
      payment.verifiedBy = permissionCheck.auth?.userId ?? null;
      payment.verifiedAt = new Date();
      payment.updatedBy = permissionCheck.auth?.userId ?? null;
      await payment.save({ session });

      if (payment.verificationStatus === "verified") {
        const invoice = await Invoice.findById(payment.invoice).session(session);
        if (invoice) {
          invoice.paidAmount = Math.max(0, (invoice.paidAmount || 0) + payment.amount);
          invoice.dueAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);
          if (invoice.dueAmount === 0) {
            invoice.status = "paid";
          } else if (invoice.paidAmount > 0) {
            invoice.status = "partially_paid";
          }
          invoice.updatedBy = permissionCheck.auth?.userId ?? null;
          await invoice.save({ session });

          const previousBalance = await getStudentBalance(String(payment.student), session);
          const newBalance = previousBalance - payment.amount;
          await LedgerEntry.create(
            [
              {
                student: payment.student,
                invoice: payment.invoice,
                paymentSubmission: payment._id,
                entryType: "payment_verified",
                debitAmount: 0,
                creditAmount: payment.amount,
                balanceAfter: newBalance,
                remarks: `Payment verified for invoice ${invoice.invoiceNumber}`,
                createdBy: permissionCheck.auth?.userId ?? null,
              },
            ],
            { session },
          );
        }
      }

      return {
        paymentId: String(payment._id),
        beforeState,
        afterState: {
          verificationStatus: payment.verificationStatus,
          rejectionReason: payment.rejectionReason,
          financeRemarks: payment.financeRemarks,
        },
      };
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "finance.payment.review",
      module: "finance",
      entityType: "PaymentSubmission",
      entityId: tx.paymentId,
      beforeState: tx.beforeState,
      afterState: tx.afterState,
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    const payment = await PaymentSubmission.findById(tx.paymentId).lean();
    return NextResponse.json({ success: true, data: payment });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Failed to review payment";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

