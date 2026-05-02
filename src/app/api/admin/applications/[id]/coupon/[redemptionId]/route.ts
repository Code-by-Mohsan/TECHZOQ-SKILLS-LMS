import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import CouponRedemption from "@/models/CouponRedemption";
import Coupon from "@/models/Coupon";
import Application from "@/models/Application";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

interface RouteParams {
  params: Promise<{ id: string; redemptionId: string }>;
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["coupon.create"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id, redemptionId } = await params;
    await dbConnect();

    await runInTransaction(async (session) => {
      const redemption = await CouponRedemption.findOne({
        _id: redemptionId,
        application: id,
      }).session(session);

      if (!redemption) {
        throw new HttpRouteError(404, "Coupon redemption not found");
      }

      const amount = redemption.discountAmount;

      // Decrement coupon usedCount
      await Coupon.updateOne(
        { _id: redemption.coupon },
        { $inc: { usedCount: -1 } },
      ).session(session);

      // Reverse discount on application snapshots
      const application = await Application.findById(id).session(session);
      if (application) {
        application.discountAmountSnapshot = Math.max(0, (application.discountAmountSnapshot || 0) - amount);
        const coursePrice = application.payableAmountSnapshot + amount; // approximate restore
        application.payableAmountSnapshot = Math.max(0, coursePrice);
        if (String(application.couponCode).toUpperCase() === String(redemption.code).toUpperCase()) {
          application.couponCode = "";
          application.couponTypeSnapshot = "";
          application.couponValueSnapshot = 0;
        }
        await application.save({ session });
      }

      // Reverse discount on invoice if linked
      if (redemption.invoice) {
        const invoice = await Invoice.findById(redemption.invoice).session(session);
        if (invoice && invoice.status !== "cancelled") {
          invoice.discountAmount = Math.max(0, (invoice.discountAmount || 0) - amount);
          invoice.totalAmount = Math.max(0, invoice.subtotalAmount - invoice.discountAmount);
          invoice.dueAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);
          if (invoice.dueAmount <= 0 && invoice.totalAmount > 0) {
            invoice.status = "paid";
          } else if (invoice.paidAmount > 0) {
            invoice.status = "partially_paid";
          } else {
            invoice.status = "issued";
          }
          invoice.updatedBy = permissionCheck.auth?.userId ?? null;
          await invoice.save({ session });

          // Create reversal ledger entry
          const lastEntry = await LedgerEntry.findOne({ student: redemption.student })
            .sort({ createdAt: -1 })
            .session(session)
            .lean();
          const prevBalance = (lastEntry as Record<string, number> | null)?.balanceAfter ?? 0;

          await LedgerEntry.create(
            [
              {
                student: redemption.student,
                invoice: invoice._id,
                entryType: "discount_reversed",
                debitAmount: amount,
                creditAmount: 0,
                balanceAfter: prevBalance + amount,
                remarks: `Coupon reversed: ${redemption.code}`,
                createdBy: permissionCheck.auth?.userId,
              },
            ],
            { session },
          );
        }
      }

      // Mark redemption as reversed
      redemption.status = "reversed";
      await redemption.save({ session });

      return true;
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "coupon_redemption.delete",
      module: "finance",
      entityType: "CouponRedemption",
      entityId: redemptionId,
      afterState: { applicationId: id },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, message: "Coupon removed" });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
