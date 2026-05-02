import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import AdminDiscount from "@/models/AdminDiscount";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

interface RouteParams {
  params: Promise<{ id: string; discountId: string }>;
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["finance.view"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id, discountId } = await params;
    await dbConnect();

    await runInTransaction(async (session) => {
      const discount = await AdminDiscount.findOne({
        _id: discountId,
        application: id,
      }).session(session);

      if (!discount) {
        throw new HttpRouteError(404, "Discount not found");
      }

      const amount = discount.discountAmount;

      // Reverse discount on invoice if linked
      if (discount.invoice) {
        const invoice = await Invoice.findById(discount.invoice).session(session);
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
          const lastEntry = await LedgerEntry.findOne({ student: discount.student })
            .sort({ createdAt: -1 })
            .session(session)
            .lean();
          const prevBalance = (lastEntry as Record<string, number> | null)?.balanceAfter ?? 0;

          await LedgerEntry.create(
            [
              {
                student: discount.student,
                invoice: invoice._id,
                entryType: "discount_reversed",
                debitAmount: amount,
                creditAmount: 0,
                balanceAfter: prevBalance + amount,
                remarks: `Discount removed: ${discount.reason}`,
                createdBy: permissionCheck.auth?.userId,
              },
            ],
            { session },
          );
        }
      }

      await AdminDiscount.deleteOne({ _id: discountId }).session(session);

      return true;
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "discount.delete",
      module: "finance",
      entityType: "AdminDiscount",
      entityId: discountId,
      afterState: { applicationId: id },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, message: "Discount removed" });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
