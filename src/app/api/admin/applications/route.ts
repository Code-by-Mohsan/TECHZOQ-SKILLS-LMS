import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Application from "@/models/Application";
import Student from "@/models/Student";
import User from "@/models/User";
import Invoice from "@/models/Invoice";

// Ensure models are registered for populate
import "@/models/Course";
import "@/models/Batch";

export async function GET(req: Request) {
  try {
    const permissionCheck = await requirePermissions(req, ["application.review"]);
    if (permissionCheck.error) return permissionCheck.error;

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const courseFilter = searchParams.get("course");
    const statusFilter = searchParams.get("status");
    const search = searchParams.get("search");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));

    // Build filter
    const filter: Record<string, unknown> = {};
    if (courseFilter) filter.course = courseFilter;
    if (statusFilter) filter.status = statusFilter;

    // If searching, get matching student IDs first
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      })
        .select("_id")
        .lean();

      const userIds = users.map((u) => u._id);
      const students = await Student.find({ user: { $in: userIds } })
        .select("_id")
        .lean();

      filter.student = { $in: students.map((s) => s._id) };
    }

    const total = await Application.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const applications = await Application.find(filter)
      .populate({
        path: "student",
        select: "user phone address city education dateOfBirth gender",
        populate: { path: "user", select: "name email" },
      })
      .populate("course", "title slug category level duration price enrollmentFee")
      .populate("batch", "name startDate endDate status")
      .sort({ appliedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Compute fee status for each application from Invoice data
    const studentCourseKeys = applications.map((app: Record<string, unknown>) => ({
      student: (app.student as Record<string, unknown>)?._id,
      course: (app.course as Record<string, unknown>)?._id,
    }));

    const studentIds = [...new Set(studentCourseKeys.map((k) => String(k.student)).filter(Boolean))];
    const invoices = studentIds.length
      ? await Invoice.find({
          student: { $in: studentIds },
          status: { $ne: "cancelled" },
        })
          .select("student course totalAmount paidAmount dueAmount status")
          .lean()
      : [];

    // Build lookup map: "studentId_courseId" → aggregated invoice data
    const invoiceMap = new Map<string, { totalAmount: number; paidAmount: number; dueAmount: number }>();
    for (const inv of invoices) {
      const key = `${String(inv.student)}_${String(inv.course)}`;
      const existing = invoiceMap.get(key);
      if (existing) {
        existing.totalAmount += (inv as Record<string, number>).totalAmount || 0;
        existing.paidAmount += (inv as Record<string, number>).paidAmount || 0;
        existing.dueAmount += (inv as Record<string, number>).dueAmount || 0;
      } else {
        invoiceMap.set(key, {
          totalAmount: (inv as Record<string, number>).totalAmount || 0,
          paidAmount: (inv as Record<string, number>).paidAmount || 0,
          dueAmount: (inv as Record<string, number>).dueAmount || 0,
        });
      }
    }

    const applicationsWithFeeStatus = applications.map((app: Record<string, unknown>) => {
      const studentId = String((app.student as Record<string, unknown>)?._id || "");
      const courseId = String((app.course as Record<string, unknown>)?._id || "");
      const key = `${studentId}_${courseId}`;
      const inv = invoiceMap.get(key);

      let feeStatus: "unpaid" | "partially_paid" | "paid" = "unpaid";
      if (inv && inv.totalAmount > 0) {
        if (inv.dueAmount <= 0) {
          feeStatus = "paid";
        } else if (inv.paidAmount > 0) {
          feeStatus = "partially_paid";
        }
      }

      return { ...app, feeStatus };
    });

    return NextResponse.json({
      success: true,
      data: applicationsWithFeeStatus,
      total,
      page,
      totalPages,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
