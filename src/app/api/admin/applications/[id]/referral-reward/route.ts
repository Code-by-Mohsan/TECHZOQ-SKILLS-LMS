import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Application from "@/models/Application";
import ReferralEvent from "@/models/ReferralEvent";
import ReferralCode from "@/models/ReferralCode";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";
import AdminDiscount from "@/models/AdminDiscount";
import { adminReferralRewardSchema } from "@/lib/validations/admin";
import { calculateDiscount } from "@/lib/growth";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

import "@/models/Course";
import "@/models/Student";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Apply referral reward discount to the REFERRER (Student A).
 * Called from the REFEREE's (Student B) application detail view.
 *
 * - `id` param = Student B's application ID (the one that used the referral code)
 * - Body `referralEventId` = the ReferralEvent linking A→B
 * - Body `referrerApplicationId` = Student A's application to receive the discount
 */
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const permissionCheck = await requirePermissions(req, ["finance.view"]);
    if (permissionCheck.error) return permissionCheck.error;

    const { id } = await params;
    const parsed = adminReferralRewardSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { referralEventId, referrerApplicationId } = parsed.data;

    await dbConnect();

    const result = await runInTransaction(async (session) => {
      // Load the referral event
      const event = await ReferralEvent.findById(referralEventId).session(session);
      if (!event || String(event.application) !== id) {
        throw new HttpRouteError(404, "Referral event not found for this application");
      }
      if (event.rewardAppliedAt) {
        throw new HttpRouteError(400, "Reward already applied for this referral event");
      }

      // Load the referral code to get reward config
      const refCode = await ReferralCode.findById(event.referralCode).session(session).lean() as Record<string, unknown> | null;
      if (!refCode) {
        throw new HttpRouteError(404, "Referral code not found");
      }

      const rewardType = (refCode.rewardDiscountType as string) || "";
      const rewardValue = (refCode.rewardDiscountValue as number) || 0;
      if (!rewardType || rewardValue <= 0) {
        throw new HttpRouteError(400, "No reward discount configured on this referral code");
      }

      // Load referrer's application (Student A)
      const referrerApp = await Application.findById(referrerApplicationId)
        .populate("course", "price enrollmentFee")
        .session(session);
      if (!referrerApp) {
        throw new HttpRouteError(404, "Referrer application not found");
      }

      const courseData = referrerApp.course as Record<string, unknown>;
      const courseFee = (courseData.price as number) || 0;
      const referrerStudentId = String(referrerApp.student);

      // Calculate discount amount
      const discountAmount = calculateDiscount(
        rewardType as "flat" | "percentage",
        rewardValue,
        courseFee,
        null,
      );

      if (discountAmount <= 0) {
        throw new HttpRouteError(400, "Calculated discount is zero");
      }

      // Create AdminDiscount on referrer's application
      const [discount] = await AdminDiscount.create(
        [
          {
            student: referrerStudentId,
            application: referrerApplicationId,
            course: courseData._id,
            discountType: rewardType,
            discountValue: rewardValue,
            discountAmount,
            reason: `Referral reward — code ${event.code} used by referee`,
            givenBy: permissionCheck.auth?.userId,
          },
        ],
        { session },
      );

      // Update referrer's application snapshots
      referrerApp.discountAmountSnapshot = (referrerApp.discountAmountSnapshot || 0) + discountAmount;
      referrerApp.payableAmountSnapshot = Math.max(0, courseFee - referrerApp.discountAmountSnapshot);
      await referrerApp.save({ session });

      // Update referrer's invoice if exists
      const invoice = await Invoice.findOne({
        student: referrerStudentId,
        course: courseData._id,
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

        // Ledger entry
        const prevEntry = await LedgerEntry.findOne({ student: referrerStudentId })
          .sort({ createdAt: -1 })
          .session(session)
          .lean();
        const prevBalance = (prevEntry as Record<string, number> | null)?.balanceAfter ?? 0;

        await LedgerEntry.create(
          [
            {
              student: referrerStudentId,
              invoice: invoice._id,
              entryType: "discount_applied",
              debitAmount: 0,
              creditAmount: discountAmount,
              balanceAfter: prevBalance - discountAmount,
              remarks: `Referral reward: code ${event.code}`,
              createdBy: permissionCheck.auth?.userId,
            },
          ],
          { session },
        );
      }

      // Update the referral event with reward info
      event.rewardDiscountType = rewardType;
      event.rewardDiscountValue = rewardValue;
      event.rewardDiscountAmount = discountAmount;
      event.rewardAppliedTo = referrerApplicationId;
      event.rewardAppliedAt = new Date();
      event.status = "qualified";
      await event.save({ session });

      return { discount, discountAmount, referrerApplicationId };
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "referral_reward.apply",
      module: "finance",
      entityType: "ReferralEvent",
      entityId: referralEventId,
      afterState: {
        refereeApplicationId: id,
        referrerApplicationId,
        discountAmount: result.discountAmount,
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
