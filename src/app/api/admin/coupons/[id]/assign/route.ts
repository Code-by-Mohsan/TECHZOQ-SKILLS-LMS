import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Coupon from "@/models/Coupon";
import Application from "@/models/Application";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";
import { adminCouponAssignSchema } from "@/lib/validations/admin";
import { calculateDiscount, reserveCoupon } from "@/lib/growth";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

import "@/models/Course";
import "@/models/Student";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["coupon.create"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id: couponId } = await params;
    const parsed = adminCouponAssignSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { applicationId } = parsed.data;

    await dbConnect();

    const result = await runInTransaction(async (session) => {
      const coupon = await Coupon.findById(couponId).session(session).lean() as Record<string, unknown> | null;
      if (!coupon || !coupon.isActive) {
        throw new HttpRouteError(404, "Coupon not found or inactive");
      }

      const application = await Application.findById(applicationId)
        .populate("course", "price enrollmentFee")
        .session(session);

      if (!application) {
        throw new HttpRouteError(404, "Application not found");
      }

      const courseData = application.course as Record<string, unknown>;
      const baseAmount = (courseData.price as number) || 0;
      const studentId = String(application.student);
      const courseId = String(courseData._id);

      // Check coupon validity (dates, limits, course applicability)
      const now = new Date();
      if (coupon.startsAt && new Date(coupon.startsAt as string) > now) {
        throw new HttpRouteError(400, "Coupon is not active yet");
      }
      if (coupon.endsAt && new Date(coupon.endsAt as string) < now) {
        throw new HttpRouteError(400, "Coupon has expired");
      }
      if (coupon.usageLimit && (coupon.usedCount as number) >= (coupon.usageLimit as number)) {
        throw new HttpRouteError(400, "Coupon usage limit reached");
      }
      if (coupon.minimumAmount && baseAmount < (coupon.minimumAmount as number)) {
        throw new HttpRouteError(400, `Minimum amount of PKR ${coupon.minimumAmount} not met`);
      }
      const applicableCourses = (coupon.applicableCourses as string[]) || [];
      if (applicableCourses.length > 0) {
        const hasCourse = applicableCourses.some((id) => String(id) === courseId);
        if (!hasCourse) {
          throw new HttpRouteError(400, "Coupon not applicable for this course");
        }
      }

      // Calculate discount
      const discountAmount = calculateDiscount(
        coupon.discountType as "flat" | "percentage",
        coupon.discountValue as number,
        baseAmount,
        coupon.maxDiscountAmount as number | null,
      );
      const payableAmount = Math.max(0, Number((baseAmount - discountAmount).toFixed(2)));

      // Reserve coupon (creates CouponRedemption + increments usedCount)
      const redemption = await reserveCoupon({
        coupon,
        code: coupon.code as string,
        studentId,
        applicationId,
        baseAmount,
        discountAmount,
        payableAmount,
        session,
      });

      // Update application snapshots
      application.couponCode = coupon.code as string;
      application.couponTypeSnapshot = coupon.discountType as string;
      application.couponValueSnapshot = coupon.discountValue as number;
      application.discountAmountSnapshot = (application.discountAmountSnapshot || 0) + discountAmount;
      application.payableAmountSnapshot = Math.max(0, baseAmount - application.discountAmountSnapshot);
      await application.save({ session });

      // Update invoice if exists
      const invoice = await Invoice.findOne({
        student: studentId,
        course: courseId,
        status: { $ne: "cancelled" },
      }).session(session);

      if (invoice) {
        invoice.discountAmount = (invoice.discountAmount || 0) + discountAmount;
        invoice.totalAmount = Math.max(0, invoice.subtotalAmount - invoice.discountAmount);
        invoice.dueAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);
        if (invoice.dueAmount <= 0 && invoice.totalAmount > 0) {
          invoice.status = "paid";
        }
        invoice.updatedBy = permissionCheck.auth?.userId ?? null;
        await invoice.save({ session });

        // Ledger entry for coupon discount
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
              entryType: "discount_applied",
              debitAmount: 0,
              creditAmount: discountAmount,
              balanceAfter: prevBalance - discountAmount,
              remarks: `Admin-assigned coupon: ${coupon.code}`,
              createdBy: permissionCheck.auth?.userId,
            },
          ],
          { session },
        );
      }

      return { redemption, discountAmount, couponCode: coupon.code };
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "coupon.assign",
      module: "coupon",
      entityType: "CouponRedemption",
      entityId: String(result.redemption._id),
      afterState: {
        couponId,
        couponCode: result.couponCode,
        applicationId,
        discountAmount: result.discountAmount,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: result.redemption }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
