import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";
import PaymentSubmission from "@/models/PaymentSubmission";
import AdminDiscount from "@/models/AdminDiscount";
import User from "@/models/User";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

interface RouteParams {
  params: Promise<{ id: string; invoiceId: string }>;
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["finance.view"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id, invoiceId } = await params;
    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Admin password is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Verify admin password
    const adminUser = await User.findById(permissionCheck.auth?.userId).select("+password");
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Admin user not found" },
        { status: 404 },
      );
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 403 },
      );
    }

    await runInTransaction(async (session) => {
      const invoice = await Invoice.findOne({
        _id: invoiceId,
        student: { $exists: true },
      }).session(session);

      if (!invoice) {
        throw new HttpRouteError(404, "Invoice not found");
      }

      // Reverse verified payments linked to this invoice
      const verifiedPayments = await PaymentSubmission.find({
        invoice: invoiceId,
        verificationStatus: "verified",
      }).session(session);

      let runningBalance: number | null = null;
      const getBalance = async () => {
        if (runningBalance !== null) return runningBalance;
        const lastEntry = await LedgerEntry.findOne({ student: invoice.student })
          .sort({ createdAt: -1 })
          .session(session)
          .lean();
        runningBalance = (lastEntry as Record<string, number> | null)?.balanceAfter ?? 0;
        return runningBalance;
      };

      for (const payment of verifiedPayments) {
        const balance = await getBalance();
        runningBalance = balance + payment.amount;

        await LedgerEntry.create(
          [
            {
              student: invoice.student,
              invoice: invoice._id,
              paymentSubmission: payment._id,
              entryType: "payment_reversed",
              debitAmount: payment.amount,
              creditAmount: 0,
              balanceAfter: runningBalance,
              remarks: `Payment reversed – invoice ${invoice.invoiceNumber} deleted by admin`,
              createdBy: permissionCheck.auth?.userId,
            },
          ],
          { session },
        );
      }

      // Mark all payments (verified, pending, submitted, etc.) as rejected
      await PaymentSubmission.updateMany(
        { invoice: invoiceId },
        {
          $set: {
            verificationStatus: "rejected",
            rejectionReason: `Invoice ${invoice.invoiceNumber} deleted by admin`,
            updatedBy: permissionCheck.auth?.userId,
          },
        },
      ).session(session);

      // Remove invoice link from admin discounts
      await AdminDiscount.updateMany(
        { invoice: invoiceId },
        { $set: { invoice: null } },
      ).session(session);

      // Create reversal ledger entry for the invoice itself
      if (invoice.totalAmount > 0) {
        const balance = await getBalance();
        runningBalance = balance - invoice.totalAmount;

        await LedgerEntry.create(
          [
            {
              student: invoice.student,
              invoice: invoice._id,
              entryType: "adjustment",
              debitAmount: 0,
              creditAmount: invoice.totalAmount,
              balanceAfter: runningBalance,
              remarks: `Invoice ${invoice.invoiceNumber} deleted by admin`,
              createdBy: permissionCheck.auth?.userId,
            },
          ],
          { session },
        );
      }

      // Delete the original invoice_issue ledger entry
      await LedgerEntry.deleteMany({
        invoice: invoiceId,
        entryType: "invoice_issue",
      }).session(session);

      // Delete the invoice
      await Invoice.deleteOne({ _id: invoiceId }).session(session);

      return true;
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "invoice.delete",
      module: "finance",
      entityType: "Invoice",
      entityId: invoiceId,
      afterState: { applicationId: id },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, message: "Invoice deleted" });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
