import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Student from "@/models/Student";
import Course from "@/models/Course";
import Application from "@/models/Application";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { applySchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";
import { createNotification } from "@/lib/notifications";
import {
  createReferralEvent,
  reserveCoupon,
  validateCouponForApplication,
  validateReferralCode,
} from "@/lib/growth";
import { HttpRouteError, runInTransaction } from "@/lib/transaction";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_please_change";
const limiter = rateLimit(5, 60_000);

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = limiter(ip);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    await dbConnect();

    const body = await req.json();
    const parsed = applySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      password,
      phone,
      address,
      dateOfBirth,
      gender,
      educationLevel,
      courseIds,
      couponCode,
      referralCode,
      leadSource,
      campaignSource,
    } = parsed.data;

    // Validate all course IDs exist
    const courses = await Course.find({
      _id: { $in: courseIds },
      isPublished: true,
    }).lean();

    if (courses.length !== courseIds.length) {
      return NextResponse.json(
        { success: false, message: "One or more selected courses are invalid" },
        { status: 400 },
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const tx = await runInTransaction(async (session) => {
      // Re-check uniqueness inside transaction.
      const existingUser = await User.findOne({ email }).session(session).select("_id").lean();
      if (existingUser) {
        throw new HttpRouteError(409, "An account with this email already exists. Please login instead.");
      }

      const existingStudentByPhone = await Student.findOne({ phone }).session(session).select("_id").lean();
      if (existingStudentByPhone) {
        throw new HttpRouteError(409, "An account with this phone number already exists. Please login instead.");
      }

      const [user] = await User.create(
        [
          {
            name,
            email,
            password: hashedPassword,
            role: "student",
          },
        ],
        { session },
      );

      const [student] = await Student.create(
        [
          {
            user: user._id,
            phone,
            address,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender: gender || null,
            city: address,
            education: {
              level: educationLevel || "Other",
            },
          },
        ],
        { session },
      );

      const couponSnapshots = new Map<string, {
        code: string;
        type: "flat" | "percentage";
        value: number;
        discountAmount: number;
        payableAmount: number;
        coupon: any;
      }>();

      if (couponCode) {
        for (const course of courses as any[]) {
          const baseAmount = Number(course.price || 0);
          const validation = await validateCouponForApplication({
            couponCode,
            courseId: String(course._id),
            studentId: String(student._id),
            baseAmount,
            session,
          });
          if (!validation.coupon) {
            throw new HttpRouteError(400, validation.reason || "Invalid coupon code");
          }
          couponSnapshots.set(String(course._id), {
            code: validation.coupon.code,
            type: validation.coupon.discountType,
            value: validation.coupon.discountValue,
            discountAmount: validation.discountAmount,
            payableAmount: validation.payableAmount,
            coupon: validation.coupon,
          });
        }
      }

      const referralValidation = referralCode
        ? await validateReferralCode({ referralCode, refereeUserId: String(user._id), session })
        : { referral: null, reason: "" };
      if (referralCode && !referralValidation.referral) {
        throw new HttpRouteError(400, referralValidation.reason || "Invalid referral code");
      }

      const applications = await Application.insertMany(
        courseIds.map((courseId: string) => {
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
            referralOwnerUser:
              referralValidation.referral?.ownerUser?._id ||
              referralValidation.referral?.ownerUser ||
              null,
            referralOwnerRole: referralValidation.referral?.ownerRoleSnapshot || "",
            couponCode: couponSnapshot?.code || "",
            couponTypeSnapshot: couponSnapshot?.type || "",
            couponValueSnapshot: couponSnapshot?.value || 0,
            discountAmountSnapshot: couponSnapshot?.discountAmount || 0,
            payableAmountSnapshot: couponSnapshot?.payableAmount ?? baseAmount,
            appliedAt: new Date(),
            createdBy: user._id,
            updatedBy: user._id,
          };
        }),
        { session },
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
            session,
          });
        }
        if (referralValidation.referral) {
          await createReferralEvent({
            referral: referralValidation.referral,
            refereeUserId: String(user._id),
            studentId: String(student._id),
            applicationId: String(application._id),
            eventType: "application_submitted",
            session,
          });
        }
      }

      // ── Create a Lead entry marked as converted ──
      const leadSource_ = leadSource || (referralCode ? "referral" : "website");
      const sourceMap: Record<string, string> = { direct: "website", facebook: "facebook_ads", google: "google_ads" };
      const mappedSource = sourceMap[leadSource_] || ([
        "facebook_ads", "google_ads", "organic", "referral", "walk_in", "whatsapp", "website", "other",
      ].includes(leadSource_) ? leadSource_ : "website");

      const [lead] = await Lead.create(
        [
          {
            name,
            email,
            phone: phone || "",
            type: "course_inquiry",
            status: "interested",
            source: mappedSource,
            campaign: campaignSource || "",
            interestCourses: courseIds,
            temperature: "hot",
            isConverted: true,
            convertedToApplication: applications[0]._id,
            convertedAt: new Date(),
            createdBy: user._id,
          },
        ],
        { session },
      );

      const courseNames = courses
        .map((c) => ("title" in c ? String(c.title) : "Course"))
        .join(", ");
      await LeadActivity.create(
        [
          {
            lead: lead._id,
            type: "conversion",
            message: `Auto-converted: student enrolled directly via website for ${courseNames || "courses"}`,
            createdBy: user._id,
          },
        ],
        { session },
      );

      return { user, student, applications };
    });

    // courseNames used inside transaction — redefine for notification below

    // Create notification
    const courseNames_ = courses
      .map((c) => ("title" in c ? String(c.title) : "Course"))
      .join(", ");
    await createNotification(
      String(tx.user._id),
      `Your application for ${courseNames_} has been submitted successfully!`,
      "application_submitted",
      "/dashboard/student",
    ).catch(() => null);

    // Generate JWT Token
    const token = jwt.sign(
      { userId: String(tx.user._id), role: tx.user.role, name: tx.user.name },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: {
          user: { id: tx.user._id, name: tx.user.name, email: tx.user.email },
          applications: tx.applications.map((a) => ({
            id: a._id,
            course: a.course,
            status: a.status,
          })),
        },
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof HttpRouteError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    console.error("Apply Error:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
