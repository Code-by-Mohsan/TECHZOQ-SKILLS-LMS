import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import User from "@/models/User";
import Course from "@/models/Course";
import Application from "@/models/Application";
import DemoRegistration from "@/models/DemoRegistration";
import Enrollment from "@/models/Enrollment";
import Invoice from "@/models/Invoice";
import PaymentSubmission from "@/models/PaymentSubmission";
import CommunicationLog from "@/models/CommunicationLog";
import Attendance from "@/models/Attendance";
import Lead from "@/models/Lead";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["report.view"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();

    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [
      totalUsers,
      totalCourses,
      totalApplications,
      pendingApplications,
      approvedApplications,
      enrolledApplications,
      totalDemoRegistrations,
      applicationsByMonthRaw,
      coursePopularityRaw,
      monthlySignups,
      totalEnrollments,
      activeEnrollments,
      financeSummary,
      paymentVerificationSummary,
      paymentSubmissionKpisRaw,
      communicationSummary,
      attendanceSummary,
      monthlyVerifiedCollectionRaw,
      totalLeads,
      convertedLeads,
      overdueLeads,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      Application.countDocuments(),
      Application.countDocuments({ status: { $in: ["pending", "submitted", "under_review"] } }),
      Application.countDocuments({ status: { $in: ["approved", "shortlisted", "waitlisted"] } }),
      Application.countDocuments({ status: "enrolled" }),
      DemoRegistration.countDocuments(),
      Application.aggregate([
        { $match: { appliedAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$appliedAt" },
              month: { $month: "$appliedAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Application.aggregate([
        { $group: { _id: "$course", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "course",
          },
        },
        { $unwind: "$course" },
        {
          $project: {
            name: "$course.title",
            applications: "$count",
          },
        },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: { $in: ["enrolled", "active"] } }),
      Invoice.aggregate([
        {
          $group: {
            _id: null,
            totalInvoiced: { $sum: "$totalAmount" },
            totalPaid: { $sum: "$paidAmount" },
            totalDue: { $sum: "$dueAmount" },
          },
        },
      ]),
      PaymentSubmission.aggregate([
        {
          $group: {
            _id: "$verificationStatus",
            count: { $sum: 1 },
            amount: { $sum: "$amount" },
          },
        },
      ]),
      PaymentSubmission.aggregate([
        {
          $group: {
            _id: null,
            totalSubmissions: { $sum: 1 },
            totalSubmittedAmount: { $sum: "$amount" },
            totalVerifiedSubmissions: {
              $sum: {
                $cond: [{ $eq: ["$verificationStatus", "verified"] }, 1, 0],
              },
            },
            totalVerifiedAmount: {
              $sum: {
                $cond: [{ $eq: ["$verificationStatus", "verified"] }, "$amount", 0],
              },
            },
          },
        },
      ]),
      CommunicationLog.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Attendance.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      PaymentSubmission.aggregate([
        { $match: { verificationStatus: "verified", createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            amount: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Lead.countDocuments(),
      Lead.countDocuments({ isConverted: true }),
      Lead.countDocuments({
        nextFollowUpAt: { $lte: now },
        followUpStatus: { $in: ["scheduled", "overdue"] },
      }),
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const applicationsByMonth = applicationsByMonthRaw.map(
      (row: { _id: { year: number; month: number }; count: number }) => ({
        month: `${months[row._id.month - 1]} ${row._id.year}`,
        applications: row.count,
      }),
    );

    const signupsByMonth = monthlySignups.map(
      (row: { _id: { year: number; month: number }; count: number }) => ({
        month: `${months[row._id.month - 1]} ${row._id.year}`,
        users: row.count,
      }),
    );

    const feeCollectionByMonth = monthlyVerifiedCollectionRaw.map(
      (row: { _id: { year: number; month: number }; amount: number }) => ({
        month: `${months[row._id.month - 1]} ${row._id.year}`,
        amount: row.amount,
      }),
    );

    const financeAggregate = (financeSummary[0] || {
      totalInvoiced: 0,
      totalPaid: 0,
      totalDue: 0,
    }) as { totalInvoiced: number; totalPaid: number; totalDue: number };

    const paymentSubmissionKpis = (paymentSubmissionKpisRaw[0] || {
      totalSubmissions: 0,
      totalSubmittedAmount: 0,
      totalVerifiedSubmissions: 0,
      totalVerifiedAmount: 0,
    }) as {
      totalSubmissions: number;
      totalSubmittedAmount: number;
      totalVerifiedSubmissions: number;
      totalVerifiedAmount: number;
    };

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCourses,
          totalApplications,
          pendingApplications,
          approvedApplications,
          enrolledApplications,
          totalDemoRegistrations,
          totalEnrollments,
          activeEnrollments,
          totalLeads,
          convertedLeads,
          overdueLeads,
        },
        applicationsByMonth,
        coursePopularity: coursePopularityRaw,
        signupsByMonth,
        feeCollectionByMonth,
        finance: financeAggregate,
        paymentSubmissionKpis,
        paymentVerificationSummary,
        communicationSummary,
        attendanceSummary,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
