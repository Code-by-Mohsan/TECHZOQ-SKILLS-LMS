import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import User from "@/models/User";
import Student from "@/models/Student";
import Application from "@/models/Application";
import Course from "@/models/Course";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import { createNotification } from "@/lib/notifications";
import {
  createReferralEvent,
  reserveCoupon,
  validateCouponForApplication,
  validateReferralCode,
} from "@/lib/growth";

export async function GET(req: Request) {
  try {
    const auth = verifyAuth(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const student = await Student.findOne({ user: auth.userId }).lean() as { _id: string } | null;
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student profile not found" },
        { status: 404 },
      );
    }

    const applications = await Application.find({ student: student._id })
      .populate("course", "title slug category level duration thumbnail price")
      .populate("batch", "name startDate endDate status")
      .sort({ appliedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: applications });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = verifyAuth(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const body = await req.json();
    const {
      courseIds,
      couponCode,
      referralCode,
      leadSource,
      campaignSource,
    } = body;

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Select at least one course" },
        { status: 400 },
      );
    }

    const student = await Student.findOne({ user: auth.userId }).lean() as { _id: string } | null;
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student profile not found" },
        { status: 404 },
      );
    }

    // Validate courses exist
    const courses = await Course.find({
      _id: { $in: courseIds },
      isPublished: true,
    }).lean();

    if (courses.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid courses selected" },
        { status: 400 },
      );
    }

    // Check for existing applications
    const existingApps = await Application.find({
      student: student._id,
      course: { $in: courseIds },
    }).lean();

    const existingCourseIds = new Set(
      existingApps.map((a) => String(a.course)),
    );
    const newCourseIds = courseIds.filter(
      (id: string) => !existingCourseIds.has(id),
    );

    if (newCourseIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "You have already applied for all selected courses" },
        { status: 409 },
      );
    }

    const referralValidation = referralCode
      ? await validateReferralCode({ referralCode, refereeUserId: auth.userId })
      : { referral: null, reason: "" };
    if (referralCode && !referralValidation.referral) {
      return NextResponse.json(
        { success: false, message: referralValidation.reason || "Invalid referral code" },
        { status: 400 },
      );
    }

    const couponSnapshots = new Map<string, {
      code: string;
      type: "flat" | "percentage";
      value: number;
      discountAmount: number;
      payableAmount: number;
      coupon: any;
    }>();
    if (couponCode) {
      for (const courseId of newCourseIds) {
        const course = courses.find((item: any) => String(item._id) === courseId) as any;
        const validation = await validateCouponForApplication({
          couponCode,
          courseId,
          studentId: String(student._id),
          baseAmount: Number(course?.price || 0),
        });
        if (!validation.coupon) {
          return NextResponse.json(
            { success: false, message: validation.reason || "Invalid coupon code" },
            { status: 400 },
          );
        }
        couponSnapshots.set(courseId, {
          code: validation.coupon.code,
          type: validation.coupon.discountType,
          value: validation.coupon.discountValue,
          discountAmount: validation.discountAmount,
          payableAmount: validation.payableAmount,
          coupon: validation.coupon,
        });
      }
    }

    const applications = await Application.insertMany(
      newCourseIds.map((courseId: string) => {
        const couponSnapshot = couponSnapshots.get(courseId);
        const course = courses.find((item: any) => String(item._id) === courseId) as any;
        const baseAmount = Number(course?.price || 0);
        return {
          student: student._id,
          course: courseId,
          status: "submitted",
          leadSource: leadSource || (referralCode ? "referral" : "direct"),
          campaignSource: campaignSource || "",
          referralCode: referralValidation.referral?.code || "",
          referralOwnerUser: referralValidation.referral?.ownerUser?._id || referralValidation.referral?.ownerUser || null,
          referralOwnerRole: referralValidation.referral?.ownerRoleSnapshot || "",
          couponCode: couponSnapshot?.code || "",
          couponTypeSnapshot: couponSnapshot?.type || "",
          couponValueSnapshot: couponSnapshot?.value || 0,
          discountAmountSnapshot: couponSnapshot?.discountAmount || 0,
          payableAmountSnapshot: couponSnapshot?.payableAmount ?? baseAmount,
          appliedAt: new Date(),
          createdBy: auth.userId,
          updatedBy: auth.userId,
        };
      }),
    );

    for (const application of applications as any[]) {
      const couponSnapshot = couponSnapshots.get(String(application.course));
      if (couponSnapshot) {
        await reserveCoupon({
          coupon: couponSnapshot.coupon,
          code: couponSnapshot.code,
          studentId: String(student._id),
          applicationId: String(application._id),
          baseAmount: Number(
            courses.find((item: any) => String(item._id) === String(application.course))?.price || 0,
          ),
          discountAmount: couponSnapshot.discountAmount,
          payableAmount: couponSnapshot.payableAmount,
        });
      }
      if (referralValidation.referral) {
        await createReferralEvent({
          referral: referralValidation.referral,
          refereeUserId: auth.userId,
          studentId: String(student._id),
          applicationId: String(application._id),
          eventType: "application_submitted",
        });
      }
    }

    const courseNames = courses
      .filter((c: any) => newCourseIds.includes(String(c._id)))
      .map((c: any) => c.title)
      .join(", ");

    // ── Create a Lead entry marked as converted ──
    try {
      const appUser = await User.findById(auth.userId).select("name email").lean() as { _id: any; name: string; email: string } | null;
      if (appUser) {
        const leadSourceVal = leadSource || (referralCode ? "referral" : "website");
        const sourceMap: Record<string, string> = { direct: "website", facebook: "facebook_ads", google: "google_ads" };
        const mappedSource = sourceMap[leadSourceVal] || ([
          "facebook_ads", "google_ads", "organic", "referral", "walk_in", "whatsapp", "website", "other",
        ].includes(leadSourceVal) ? leadSourceVal : "website");

        const lead = await Lead.create({
          name: appUser.name,
          email: appUser.email,
          phone: (student as any).phone || "",
          type: "course_inquiry",
          status: "interested",
          source: mappedSource,
          campaign: campaignSource || "",
          interestCourses: newCourseIds,
          temperature: "hot",
          isConverted: true,
          convertedToApplication: applications[0]._id,
          convertedAt: new Date(),
          createdBy: appUser._id,
        });

        await LeadActivity.create({
          lead: lead._id,
          type: "conversion",
          message: `Auto-converted: student enrolled directly via website for ${courseNames || "courses"}`,
          createdBy: appUser._id,
        });
      }
    } catch (_leadErr) {
      // Lead creation is non-critical — don't fail the application
      console.error("Lead auto-creation failed:", _leadErr);
    }

    await createNotification(
      auth.userId,
      `Your application for ${courseNames} has been submitted!`,
      "application_submitted",
      "/dashboard/student",
    );

    return NextResponse.json(
      {
        success: true,
        message: `Applied for ${applications.length} course(s)`,
        data: applications,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
