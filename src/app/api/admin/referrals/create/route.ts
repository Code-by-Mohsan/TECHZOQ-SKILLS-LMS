import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import User from "@/models/User";
import Student from "@/models/Student";
import Application from "@/models/Application";
import ReferralCode from "@/models/ReferralCode";
import ReferralEvent from "@/models/ReferralEvent";
import Invoice from "@/models/Invoice";
import LedgerEntry from "@/models/LedgerEntry";
import AdminDiscount from "@/models/AdminDiscount";
import { adminCreateReferralSchema } from "@/lib/validations/admin";
import { calculateDiscount } from "@/lib/growth";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

import "@/models/Course";

export async function POST(req: Request) {
  try {
    const permissionCheck = await requirePermissions(req, ["referral.manage"]);
    if (permissionCheck.error) return permissionCheck.error;

    const parsed = adminCreateReferralSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { referrerEmail, refereeEmail, discountType, discountValue, details } = parsed.data;

    if (referrerEmail.toLowerCase() === refereeEmail.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: "Referrer and referee cannot be the same person" },
        { status: 400 },
      );
    }

    await dbConnect();

    const result = await runInTransaction(async (session) => {
      // Find both users
      const [referrerUser, refereeUser] = await Promise.all([
        User.findOne({ email: referrerEmail.toLowerCase() }).select("_id name email role").session(session),
        User.findOne({ email: refereeEmail.toLowerCase() }).select("_id name email role").session(session),
      ]);

      if (!referrerUser) {
        throw new HttpRouteError(404, `Referrer not found with email: ${referrerEmail}`);
      }
      if (!refereeUser) {
        throw new HttpRouteError(404, `Referee not found with email: ${refereeEmail}`);
      }

      // Find students
      const [referrerStudent, refereeStudent] = await Promise.all([
        Student.findOne({ user: referrerUser._id }).select("_id").session(session),
        Student.findOne({ user: refereeUser._id }).select("_id").session(session),
      ]);

      if (!referrerStudent) {
        throw new HttpRouteError(404, "Referrer does not have a student profile");
      }
      if (!refereeStudent) {
        throw new HttpRouteError(404, "Referee does not have a student profile");
      }

      // Find the most recent non-cancelled application for each
      const [referrerApp, refereeApp] = await Promise.all([
        Application.findOne({
          student: referrerStudent._id,
          status: { $nin: ["cancelled", "rejected"] },
        })
          .populate("course", "price enrollmentFee title")
          .sort({ appliedAt: -1 })
          .session(session),
        Application.findOne({
          student: refereeStudent._id,
          status: { $nin: ["cancelled", "rejected"] },
        })
          .sort({ appliedAt: -1 })
          .session(session),
      ]);

      if (!referrerApp) {
        throw new HttpRouteError(404, "Referrer has no active application");
      }
      if (!refereeApp) {
        throw new HttpRouteError(404, "Referee has no active application");
      }

      const courseData = referrerApp.course as Record<string, unknown>;
      const courseFee = (courseData.price as number) || 0;

      // Calculate discount
      const discountAmount = calculateDiscount(
        discountType,
        discountValue,
        courseFee,
        null,
      );
      if (discountAmount <= 0) {
        throw new HttpRouteError(400, "Calculated discount is zero — check course fee and discount value");
      }

      // Auto-generate a referral code
      const codeStr = `REF-${referrerUser.name ? referrerUser.name.split(" ")[0].toUpperCase().slice(0, 6) : "USER"}-${Date.now().toString(36).toUpperCase().slice(-4)}`;

      // Create ReferralCode
      const [refCode] = await ReferralCode.create(
        [
          {
            code: codeStr,
            ownerUser: referrerUser._id,
            ownerRoleSnapshot: referrerUser.role || "student",
            title: details || `Admin-created referral`,
            usageLimit: 1,
            usedCount: 1,
            isActive: false, // single-use, already used
            rewardDiscountType: discountType,
            rewardDiscountValue: discountValue,
            createdBy: permissionCheck.auth?.userId,
            updatedBy: permissionCheck.auth?.userId,
          },
        ],
        { session },
      );

      // Create ReferralEvent
      const [refEvent] = await ReferralEvent.create(
        [
          {
            referralCode: refCode._id,
            code: codeStr,
            referrerUser: referrerUser._id,
            refereeUser: refereeUser._id,
            student: refereeStudent._id,
            application: refereeApp._id,
            eventType: "application_submitted",
            status: "qualified",
            rewardDiscountType: discountType,
            rewardDiscountValue: discountValue,
            rewardDiscountAmount: discountAmount,
            rewardAppliedTo: referrerApp._id,
            rewardAppliedAt: new Date(),
          },
        ],
        { session },
      );

      // Create AdminDiscount on referrer's application
      await AdminDiscount.create(
        [
          {
            student: referrerStudent._id,
            application: referrerApp._id,
            course: courseData._id,
            discountType,
            discountValue,
            discountAmount,
            reason: details
              ? `Referral reward: ${details}`
              : `Referral reward — referred ${refereeUser.name || refereeUser.email}`,
            givenBy: permissionCheck.auth?.userId,
          },
        ],
        { session },
      );

      // Update referrer's application snapshots
      referrerApp.discountAmountSnapshot = (referrerApp.discountAmountSnapshot || 0) + discountAmount;
      referrerApp.payableAmountSnapshot = Math.max(0, courseFee - referrerApp.discountAmountSnapshot);
      referrerApp.referralCode = codeStr;
      await referrerApp.save({ session });

      // Update referrer's invoice if exists
      const invoice = await Invoice.findOne({
        student: String(referrerStudent._id),
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

        // Ledger entry for discount
        const prevEntry = await LedgerEntry.findOne({ student: String(referrerStudent._id) })
          .sort({ createdAt: -1 })
          .session(session)
          .lean();
        const prevBalance = (prevEntry as Record<string, number> | null)?.balanceAfter ?? 0;

        await LedgerEntry.create(
          [
            {
              student: referrerStudent._id,
              invoice: invoice._id,
              entryType: "discount_applied",
              debitAmount: 0,
              creditAmount: discountAmount,
              balanceAfter: prevBalance - discountAmount,
              remarks: `Referral reward: ${codeStr} — referred ${refereeUser.name || refereeUser.email}`,
              createdBy: permissionCheck.auth?.userId,
            },
          ],
          { session },
        );
      }

      return {
        code: codeStr,
        referrerName: referrerUser.name || referrerUser.email,
        refereeName: refereeUser.name || refereeUser.email,
        discountType,
        discountValue,
        discountAmount,
        invoiceUpdated: !!invoice,
      };
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "referral.create_and_apply",
      module: "referral",
      entityType: "ReferralCode",
      entityId: result.code,
      afterState: result,
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Failed to create referral";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
