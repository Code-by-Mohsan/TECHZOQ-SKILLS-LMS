import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import Student from "@/models/Student";
import Application from "@/models/Application";
import Invoice from "@/models/Invoice";
import PaymentSubmission from "@/models/PaymentSubmission";
import CouponRedemption from "@/models/CouponRedemption";
import AdminDiscount from "@/models/AdminDiscount";
import InstallmentPlan from "@/models/InstallmentPlan";

export async function GET(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const student = (await Student.findOne({ user: auth.userId }).select("_id").lean()) as
      | { _id: string }
      | null;
    if (!student) {
      return NextResponse.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const applications = (await Application.find({ student: student._id })
      .populate("course", "title price enrollmentFee slug")
      .sort({ appliedAt: -1 })
      .lean()) as Record<string, unknown>[];

    const appIds = applications.map((a) => a._id);

    const [invoices, couponRedemptions, adminDiscounts, installmentPlans, payments] =
      await Promise.all([
        Invoice.find({ student: student._id })
          .populate("course", "title")
          .populate("batch", "name")
          .sort({ createdAt: -1 })
          .lean() as Promise<Record<string, unknown>[]>,
        CouponRedemption.find({ student: student._id, application: { $in: appIds } })
          .sort({ createdAt: -1 })
          .lean() as Promise<Record<string, unknown>[]>,
        AdminDiscount.find({ student: student._id, application: { $in: appIds } })
          .sort({ createdAt: -1 })
          .lean() as Promise<Record<string, unknown>[]>,
        InstallmentPlan.find({ student: student._id, application: { $in: appIds }, status: "active" })
          .sort({ createdAt: -1 })
          .lean() as Promise<Record<string, unknown>[]>,
        PaymentSubmission.find({ student: student._id })
          .populate("invoice", "invoiceNumber")
          .sort({ createdAt: -1 })
          .lean() as Promise<Record<string, unknown>[]>,
      ]);

    const breakdowns = applications.map((app) => {
      const appId = String(app._id);
      const course = app.course as Record<string, unknown> | null;
      const courseFee = Number(course?.price || 0);
      const enrollmentFee = Number(course?.enrollmentFee || 0);

      const appCoupons = couponRedemptions.filter(
        (c) => String(c.application) === appId,
      );
      const appAdminDiscounts = adminDiscounts.filter(
        (d) => String(d.application) === appId,
      );
      const appInstallmentPlan = installmentPlans.find(
        (p) => String(p.application) === appId,
      ) || null;

      const couponDiscountTotal = appCoupons.reduce(
        (sum, c) => sum + Number(c.discountAmount || 0),
        0,
      );
      const adminDiscountTotal = appAdminDiscounts.reduce(
        (sum, d) => sum + Number(d.discountAmount || 0),
        0,
      );
      const snapshotDiscount = Number(app.discountAmountSnapshot || 0);
      const totalDiscount = Math.max(
        couponDiscountTotal + adminDiscountTotal,
        snapshotDiscount,
      );

      const netFee = Math.max(0, courseFee - totalDiscount);

      const appInvoices = invoices.filter(
        (inv) =>
          String((inv.course as Record<string, unknown>)?._id || inv.course) ===
          String(course?._id || ""),
      );
      const totalPaid = appInvoices.reduce(
        (sum, inv) => sum + Number(inv.paidAmount || 0),
        0,
      );
      const totalDue = Math.max(0, netFee - totalPaid);

      return {
        applicationId: appId,
        status: app.status,
        courseName: course?.title || "Unknown Course",
        courseSlug: course?.slug || "",
        courseFee,
        enrollmentFee,
        discounts: {
          coupons: appCoupons.map((c) => ({
            code: c.code,
            discountAmount: Number(c.discountAmount || 0),
            status: c.status,
          })),
          adminDiscounts: appAdminDiscounts.map((d) => ({
            reason: d.reason,
            discountType: d.discountType,
            discountValue: Number(d.discountValue || 0),
            discountAmount: Number(d.discountAmount || 0),
          })),
          totalDiscount,
        },
        netFee,
        totalPaid,
        totalDue,
        invoices: appInvoices.map((inv) => ({
          _id: String(inv._id),
          invoiceNumber: inv.invoiceNumber,
          totalAmount: Number(inv.totalAmount || 0),
          paidAmount: Number(inv.paidAmount || 0),
          dueAmount: Number(inv.dueAmount || 0),
          status: inv.status,
          issuedAt: inv.issuedAt,
          dueDate: inv.dueDate,
        })),
        installmentPlan: appInstallmentPlan
          ? {
              _id: String(appInstallmentPlan._id),
              totalAmount: Number(appInstallmentPlan.totalAmount || 0),
              totalInstallments: Number(appInstallmentPlan.totalInstallments || 0),
              status: appInstallmentPlan.status,
              installments: (
                (appInstallmentPlan.installments as Record<string, unknown>[]) || []
              ).map((inst) => ({
                installmentNumber: Number(inst.installmentNumber || 0),
                amount: Number(inst.amount || 0),
                dueDate: inst.dueDate,
                status: inst.status,
                paidAmount: Number(inst.paidAmount || 0),
              })),
            }
          : null,
      };
    });

    const paymentHistory = payments.map((p) => ({
      _id: String(p._id),
      amount: Number(p.amount || 0),
      paymentMethod: p.paymentMethod,
      transactionReference: p.transactionReference,
      verificationStatus: p.verificationStatus,
      invoiceNumber:
        (p.invoice as Record<string, unknown>)?.invoiceNumber || null,
      createdAt: p.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        breakdowns,
        paymentHistory,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load fee breakdown";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
