import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Application from "@/models/Application";
import AdminDiscount from "@/models/AdminDiscount";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";
import { adminDirectDiscountSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["application.review"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id } = await params;
    await dbConnect();

    const discounts = await AdminDiscount.find({ application: id })
      .populate("givenBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: discounts });
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
    const parsed = adminDirectDiscountSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { discountType, discountValue, reason } = parsed.data;

    await dbConnect();

    const result = await runInTransaction(async (session) => {
      const application = await Application.findById(id)
        .populate("course", "price enrollmentFee")
        .session(session);

      if (!application) {
        throw new HttpRouteError(404, "Application not found");
      }

      const courseFee = (application.course as Record<string, unknown>).price as number || 0;

      // Calculate discount amount
      let discountAmount: number;
      if (discountType === "flat") {
        discountAmount = Math.min(discountValue, courseFee);
      } else {
        discountAmount = Math.round((courseFee * discountValue) / 100);
      }
      discountAmount = Math.max(0, discountAmount);

      // Create AdminDiscount record
      const [discount] = await AdminDiscount.create(
        [
          {
            student: application.student,
            application: application._id,
            course: application.course._id || application.course,
            discountType,
            discountValue,
            discountAmount,
            reason,
            givenBy: permissionCheck.auth?.userId,
          },
        ],
        { session },
      );

      // Update invoice if one exists — add to discountAmount and recalculate
      const invoice = await Invoice.findOne({
        student: application.student,
        course: application.course._id || application.course,
        status: { $ne: "cancelled" },
      }).session(session);

      if (invoice) {
        invoice.discountAmount = (invoice.discountAmount || 0) + discountAmount;
        invoice.totalAmount = Math.max(0, invoice.subtotalAmount - invoice.discountAmount);
        invoice.dueAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);
        if (invoice.dueAmount <= 0 && invoice.totalAmount > 0) {
          invoice.status = "paid";
        } else if (invoice.paidAmount > 0) {
          invoice.status = "partially_paid";
        }
        invoice.updatedBy = permissionCheck.auth?.userId ?? null;
        await invoice.save({ session });

        discount.invoice = invoice._id;
        await discount.save({ session });

        // Create ledger entry
        const lastEntry = await LedgerEntry.findOne({ student: application.student })
          .sort({ createdAt: -1 })
          .session(session)
          .lean();
        const prevBalance = (lastEntry as Record<string, number> | null)?.balanceAfter ?? 0;

        await LedgerEntry.create(
          [
            {
              student: application.student,
              invoice: invoice._id,
              entryType: "discount_applied",
              debitAmount: 0,
              creditAmount: discountAmount,
              balanceAfter: prevBalance - discountAmount,
              remarks: `Admin discount: ${discountType === "flat" ? `PKR ${discountValue}` : `${discountValue}%`} — ${reason}`,
              createdBy: permissionCheck.auth?.userId,
            },
          ],
          { session },
        );
      }

      return { discount, invoiceUpdated: !!invoice };
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "discount.create",
      module: "finance",
      entityType: "AdminDiscount",
      entityId: String(result.discount._id),
      afterState: {
        discountType,
        discountValue,
        discountAmount: result.discount.discountAmount,
        reason,
        applicationId: id,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: result.discount }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
