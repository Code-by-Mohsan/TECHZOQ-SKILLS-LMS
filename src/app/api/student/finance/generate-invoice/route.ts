import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import Student from "@/models/Student";
import Application from "@/models/Application";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";
import InstallmentPlan from "@/models/InstallmentPlan";
import CouponRedemption from "@/models/CouponRedemption";
import AdminDiscount from "@/models/AdminDiscount";
import { generateInvoiceNumber } from "@/lib/finance";
import { studentGenerateInvoiceSchema } from "@/lib/validations/admin";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

export async function POST(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = studentGenerateInvoiceSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { applicationId, type, installmentNumber } = parsed.data;

    await dbConnect();

    const student = (await Student.findOne({ user: auth.userId }).select("_id").lean()) as
      | { _id: string }
      | null;
    if (!student) {
      return NextResponse.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const result = await runInTransaction(async (session) => {
      const application = await Application.findOne({
        _id: applicationId,
        student: student._id,
      })
        .populate("course", "title price enrollmentFee")
        .session(session);

      if (!application) {
        throw new HttpRouteError(404, "Application not found");
      }

      const course = application.course as Record<string, unknown>;
      const courseId = course._id;
      const courseFee = Number(course.price || 0);
      const enrollmentFee = Number(course.enrollmentFee || 0);
      const studentId = String(student._id);

      // Calculate total discount for this application
      const [couponRedemptions, adminDiscounts] = await Promise.all([
        CouponRedemption.find({ student: studentId, application: applicationId })
          .session(session)
          .lean() as Promise<Record<string, unknown>[]>,
        AdminDiscount.find({ student: studentId, application: applicationId })
          .session(session)
          .lean() as Promise<Record<string, unknown>[]>,
      ]);

      const couponDiscountTotal = couponRedemptions.reduce(
        (s, c) => s + Number(c.discountAmount || 0), 0,
      );
      const adminDiscountTotal = adminDiscounts.reduce(
        (s, d) => s + Number(d.discountAmount || 0), 0,
      );
      const snapshotDiscount = Number(application.discountAmountSnapshot || 0);
      const totalDiscount = Math.max(couponDiscountTotal + adminDiscountTotal, snapshotDiscount);
      const netFee = Math.max(0, courseFee - totalDiscount);

      // Get existing invoices for total paid
      const existingInvoices = (await Invoice.find({
        student: studentId,
        course: courseId,
        status: { $ne: "cancelled" },
      })
        .session(session)
        .lean()) as Record<string, unknown>[];

      const totalPaid = existingInvoices.reduce(
        (s, inv) => s + Number(inv.paidAmount || 0), 0,
      );
      const totalInvoiced = existingInvoices.reduce(
        (s, inv) => s + Number(inv.totalAmount || 0), 0,
      );

      let invoiceAmount = 0;
      let remarks = "";

      if (type === "enrollment") {
        if (enrollmentFee <= 0) {
          throw new HttpRouteError(400, "No enrollment fee configured for this course");
        }
        // Check if enrollment invoice already exists
        const hasEnrollmentInvoice = existingInvoices.some(
          (inv) => Number(inv.totalAmount) === enrollmentFee && String(inv.remarks || "").includes("Enrollment"),
        );
        if (hasEnrollmentInvoice) {
          throw new HttpRouteError(400, "Enrollment fee invoice already exists");
        }
        invoiceAmount = enrollmentFee;
        remarks = `Enrollment fee for ${course.title}`;
      } else if (type === "remaining") {
        const remaining = Math.max(0, netFee - totalInvoiced);
        if (remaining <= 0) {
          throw new HttpRouteError(400, "No remaining fee to invoice — all fees are already invoiced");
        }
        invoiceAmount = remaining;
        remarks = `Remaining fee for ${course.title}`;
      } else if (type === "installment") {
        if (!installmentNumber) {
          throw new HttpRouteError(400, "Installment number is required");
        }
        const plan = await InstallmentPlan.findOne({
          student: studentId,
          application: applicationId,
          status: "active",
        }).session(session);

        if (!plan) {
          throw new HttpRouteError(404, "No active installment plan found");
        }

        const installment = plan.installments.find(
          (inst: Record<string, unknown>) => Number(inst.installmentNumber) === installmentNumber,
        );
        if (!installment) {
          throw new HttpRouteError(404, `Installment #${installmentNumber} not found`);
        }
        if (installment.invoice) {
          throw new HttpRouteError(400, `Installment #${installmentNumber} already has an invoice`);
        }
        if (installment.status === "paid") {
          throw new HttpRouteError(400, `Installment #${installmentNumber} is already paid`);
        }

        invoiceAmount = Number(installment.amount);
        remarks = `Installment #${installmentNumber} for ${course.title}`;

        // Link invoice to installment after creation (below)
      }

      if (invoiceAmount <= 0) {
        throw new HttpRouteError(400, "Invoice amount must be greater than zero");
      }

      const invoiceNumber = await generateInvoiceNumber();
      const [invoice] = await Invoice.create(
        [
          {
            invoiceNumber,
            student: studentId,
            course: courseId,
            batch: application.batch || null,
            subtotalAmount: invoiceAmount,
            discountAmount: 0,
            totalAmount: invoiceAmount,
            paidAmount: 0,
            dueAmount: invoiceAmount,
            status: "issued",
            createdBy: auth.userId,
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
            debitAmount: invoiceAmount,
            creditAmount: 0,
            balanceAfter: prevBalance + invoiceAmount,
            remarks,
            createdBy: auth.userId,
          },
        ],
        { session },
      );

      // If installment, link invoice to the installment
      if (type === "installment" && installmentNumber) {
        await InstallmentPlan.updateOne(
          {
            student: studentId,
            application: applicationId,
            status: "active",
            "installments.installmentNumber": installmentNumber,
          },
          {
            $set: { "installments.$.invoice": invoice._id },
          },
          { session },
        );
      }

      return {
        invoiceId: String(invoice._id),
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.totalAmount,
        dueAmount: invoice.dueAmount,
        status: invoice.status,
      };
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Failed to generate invoice";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
