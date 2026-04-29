import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Application from "@/models/Application";
import Invoice from "@/models/Invoice";
import PaymentSubmission from "@/models/PaymentSubmission";
import LedgerEntry from "@/models/LedgerEntry";
import AdminDiscount from "@/models/AdminDiscount";
import CouponRedemption from "@/models/CouponRedemption";
import { generateInvoiceNumber } from "@/lib/finance";
import { adminRecordPaymentSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["finance.view"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id } = await params;
    const parsed = adminRecordPaymentSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { amount, paymentMethod, transactionReference, remarks } = parsed.data;

    await dbConnect();

    const result = await runInTransaction(async (session) => {
      const application = await Application.findById(id)
        .populate("course", "price enrollmentFee")
        .session(session);

      if (!application) {
        throw new HttpRouteError(404, "Application not found");
      }

      const courseId = application.course._id || application.course;
      const studentId = application.student;

      // Find or create invoice
      let invoice = await Invoice.findOne({
        student: studentId,
        course: courseId,
        status: { $ne: "cancelled" },
      }).session(session);

      if (!invoice) {
        const courseFee = (application.course as Record<string, unknown>).price as number || 0;

        // Compute real discount from AdminDiscount + CouponRedemption records
        const [adArr, crArr] = await Promise.all([
          AdminDiscount.find({ application: id }).session(session).lean(),
          CouponRedemption.find({ application: id, status: { $ne: "reversed" } }).session(session).lean(),
        ]);
        const realDiscountForInvoice =
          adArr.reduce((s, d) => s + ((d as Record<string, number>).discountAmount || 0), 0) +
          crArr.reduce((s, cr) => s + ((cr as Record<string, number>).discountAmount || 0), 0);

        const subtotal = courseFee;
        const totalAmount = Math.max(0, subtotal - realDiscountForInvoice);

        const invoiceNumber = await generateInvoiceNumber();
        [invoice] = await Invoice.create(
          [
            {
              invoiceNumber,
              student: studentId,
              course: courseId,
              batch: application.batch || null,
              subtotalAmount: subtotal,
              discountAmount: realDiscountForInvoice,
              totalAmount,
              paidAmount: 0,
              dueAmount: totalAmount,
              status: "issued",
              createdBy: permissionCheck.auth?.userId,
            },
          ],
          { session },
        );

        // Ledger entry for invoice issuance
        const prevEntry = await LedgerEntry.findOne({ student: studentId })
          .sort({ createdAt: -1 })
          .session(session)
          .lean();
        const prevBalance = (prevEntry as Record<string, number> | null)?.balanceAfter ?? 0;

        await LedgerEntry.create(
          [
            {
              student: studentId,
              invoice: invoice._id,
              entryType: "invoice_issue",
              debitAmount: totalAmount,
              creditAmount: 0,
              balanceAfter: prevBalance + totalAmount,
              remarks: `Auto-created invoice for payment recording`,
              createdBy: permissionCheck.auth?.userId,
            },
          ],
          { session },
        );
      }

      // Compute real remaining from discount records + verified payments (same as fee summary)
      const courseFeeForValidation = (application.course as Record<string, unknown>).price as number || 0;
      const [adminDiscounts, couponRedemptions, existingVerifiedPayments] = await Promise.all([
        AdminDiscount.find({ application: id }).session(session).lean(),
        CouponRedemption.find({ application: id, status: { $ne: "reversed" } }).session(session).lean(),
        PaymentSubmission.find({ invoice: invoice._id, verificationStatus: "verified" }).session(session).lean(),
      ]);
      const realDiscount =
        adminDiscounts.reduce((s, d) => s + ((d as Record<string, number>).discountAmount || 0), 0) +
        couponRedemptions.reduce((s, cr) => s + ((cr as Record<string, number>).discountAmount || 0), 0);
      const realNetFee = Math.max(0, courseFeeForValidation - realDiscount);
      const realPaid = existingVerifiedPayments.reduce((s, p) => s + ((p as Record<string, number>).amount || 0), 0);
      const realRemaining = Math.max(0, realNetFee - realPaid);

      // Sync invoice amounts to match real discount
      invoice.discountAmount = realDiscount;
      invoice.totalAmount = realNetFee;
      invoice.paidAmount = realPaid;
      invoice.dueAmount = realRemaining;

      if (amount > realRemaining) {
        throw new HttpRouteError(400, `Amount (${amount}) exceeds remaining due (${realRemaining})`);
      }

      // Create PaymentSubmission — auto-verified since admin is recording it
      const [payment] = await PaymentSubmission.create(
        [
          {
            student: studentId,
            invoice: invoice._id,
            amount,
            paymentMethod,
            transactionReference,
            providerType: "manual",
            verificationStatus: "verified",
            financeRemarks: remarks || "Recorded by admin",
            submittedAt: new Date(),
            verifiedAt: new Date(),
            verifiedBy: permissionCheck.auth?.userId,
            createdBy: permissionCheck.auth?.userId,
          },
        ],
        { session },
      );

      // Update invoice
      invoice.paidAmount = (invoice.paidAmount || 0) + amount;
      invoice.dueAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);
      if (invoice.dueAmount <= 0 && invoice.totalAmount > 0) {
        invoice.status = "paid";
      } else if (invoice.paidAmount > 0) {
        invoice.status = "partially_paid";
      }
      invoice.updatedBy = permissionCheck.auth?.userId ?? null;
      await invoice.save({ session });

      // Ledger entry for payment
      const lastEntry = await LedgerEntry.findOne({ student: studentId })
        .sort({ createdAt: -1 })
        .session(session)
        .lean();
      const balanceBefore = (lastEntry as Record<string, number> | null)?.balanceAfter ?? 0;

      await LedgerEntry.create(
        [
          {
            student: studentId,
            invoice: invoice._id,
            paymentSubmission: payment._id,
            entryType: "payment_verified",
            debitAmount: 0,
            creditAmount: amount,
            balanceAfter: balanceBefore - amount,
            remarks: `Admin-recorded payment: ${paymentMethod.replace(/_/g, " ")} — Ref: ${transactionReference}`,
            createdBy: permissionCheck.auth?.userId,
          },
        ],
        { session },
      );

      // Update application feesPaid if fully paid
      if (invoice.dueAmount <= 0) {
        application.feesPaid = true;
        await application.save({ session });
      }

      return { payment, invoice };
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "payment.record",
      module: "finance",
      entityType: "PaymentSubmission",
      entityId: String(result.payment._id),
      afterState: {
        amount,
        paymentMethod,
        transactionReference,
        applicationId: id,
        invoiceId: String(result.invoice._id),
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: result.payment }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
