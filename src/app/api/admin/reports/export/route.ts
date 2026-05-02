import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Application from "@/models/Application";
import PaymentSubmission from "@/models/PaymentSubmission";
import CommunicationLog from "@/models/CommunicationLog";
import Attendance from "@/models/Attendance";
import ReferralEvent from "@/models/ReferralEvent";
import Invoice from "@/models/Invoice";
import { toCsv } from "@/lib/reporting";
import Lead from "@/models/Lead";

function csvResponse(fileName: string, csv: string): Response {
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["report.view"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type") || "").trim();
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    const dateFilter: Record<string, unknown> = {};
    if (fromDate && !Number.isNaN(fromDate.getTime())) dateFilter.$gte = fromDate;
    if (toDate && !Number.isNaN(toDate.getTime())) dateFilter.$lte = toDate;

    const byDate = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    if (type === "applications") {
      const rows = await Application.find(byDate)
        .populate({ path: "student", select: "user phone", populate: { path: "user", select: "name email" } })
        .populate("course", "title")
        .populate("batch", "name")
        .sort({ createdAt: -1 })
        .lean();
      const csv = toCsv(rows.map((item: any) => ({
        id: String(item._id),
        student_name: item.student?.user?.name || "",
        student_email: item.student?.user?.email || "",
        course: item.course?.title || "",
        batch: item.batch?.name || "",
        status: item.status || "",
        fees_paid: item.feesPaid ? "yes" : "no",
        lead_source: item.leadSource || "",
        referral_code: item.referralCode || "",
        coupon_code: item.couponCode || "",
        discount_amount: item.discountAmountSnapshot || 0,
        payable_amount: item.payableAmountSnapshot || 0,
        created_at: item.createdAt ? new Date(item.createdAt).toISOString() : "",
      })));
      return csvResponse("applications-report.csv", csv);
    }

    if (type === "finance") {
      const [payments, invoices] = await Promise.all([
        PaymentSubmission.find(byDate)
          .populate({
            path: "student",
            select: "user",
            populate: { path: "user", select: "name email" },
          })
          .populate("invoice", "invoiceNumber")
          .sort({ createdAt: -1 })
          .lean(),
        Invoice.find(byDate)
          .populate({
            path: "student",
            select: "user",
            populate: { path: "user", select: "name email" },
          })
          .sort({ createdAt: -1 })
          .lean(),
      ]);
      const csv = toCsv([
        ...invoices.map((item: any) => ({
          record_type: "invoice",
          id: String(item._id),
          invoice_number: item.invoiceNumber,
          student_name: item.student?.user?.name || "",
          student_email: item.student?.user?.email || "",
          total_amount: item.totalAmount || 0,
          paid_amount: item.paidAmount || 0,
          due_amount: item.dueAmount || 0,
          status: item.status || "",
          created_at: item.createdAt ? new Date(item.createdAt).toISOString() : "",
        })),
        ...payments.map((item: any) => ({
          record_type: "payment_submission",
          id: String(item._id),
          invoice_number: item.invoice?.invoiceNumber || "",
          student_name: item.student?.user?.name || "",
          student_email: item.student?.user?.email || "",
          submission_amount: item.amount || 0,
          verified_amount: item.verificationStatus === "verified" ? item.amount || 0 : 0,
          method: item.paymentMethod || "",
          reference: item.transactionReference || "",
          verification_status: item.verificationStatus || "",
          kpi_group: item.verificationStatus === "verified" ? "verified_payment" : "submission_only",
          provider: item.providerType || "",
          created_at: item.createdAt ? new Date(item.createdAt).toISOString() : "",
        })),
      ]);
      return csvResponse("finance-report.csv", csv);
    }

    if (type === "communications") {
      const rows = await CommunicationLog.find(byDate)
        .populate("senderUser", "name email")
        .populate("recipientUser", "name email")
        .sort({ createdAt: -1 })
        .lean();
      const csv = toCsv(rows.map((item: any) => ({
        id: String(item._id),
        sender_name: item.senderUser?.name || "",
        recipient_name: item.recipientUser?.name || "",
        recipient_phone: item.recipientPhone || "",
        source_module: item.sourceModule || "",
        status: item.status || "",
        sent_at: item.sentAt ? new Date(item.sentAt).toISOString() : "",
        created_at: item.createdAt ? new Date(item.createdAt).toISOString() : "",
      })));
      return csvResponse("communications-report.csv", csv);
    }

    if (type === "attendance") {
      const rows = await Attendance.find(byDate)
        .populate({ path: "student", select: "user", populate: { path: "user", select: "name email" } })
        .populate("session", "title startsAt")
        .populate("batch", "name")
        .sort({ createdAt: -1 })
        .lean();
      const csv = toCsv(rows.map((item: any) => ({
        id: String(item._id),
        student_name: item.student?.user?.name || "",
        student_email: item.student?.user?.email || "",
        batch_name: item.batch?.name || "",
        session_title: item.session?.title || "",
        session_start: item.session?.startsAt ? new Date(item.session.startsAt).toISOString() : "",
        status: item.status || "",
        remarks: item.remarks || "",
        marked_at: item.markedAt ? new Date(item.markedAt).toISOString() : "",
      })));
      return csvResponse("attendance-report.csv", csv);
    }

    if (type === "referrals") {
      const rows = await ReferralEvent.find(byDate)
        .populate("referrerUser", "name email")
        .populate("refereeUser", "name email")
        .sort({ createdAt: -1 })
        .lean();
      const csv = toCsv(rows.map((item: any) => ({
        id: String(item._id),
        code: item.code || "",
        referrer_name: item.referrerUser?.name || "",
        referrer_email: item.referrerUser?.email || "",
        referee_name: item.refereeUser?.name || "",
        referee_email: item.refereeUser?.email || "",
        event_type: item.eventType || "",
        status: item.status || "",
        created_at: item.createdAt ? new Date(item.createdAt).toISOString() : "",
      })));
      return csvResponse("referrals-report.csv", csv);
    }

    if (type === "leads") {
      const rows = await Lead.find(byDate)
        .populate("stage", "name key")
        .populate("assignedTo", "name email")
        .populate("interestCourse", "title")
        .sort({ createdAt: -1 })
        .lean();
      const csv = toCsv(rows.map((item: any) => ({
        id: String(item._id),
        name: item.name || "",
        email: item.email || "",
        phone: item.phone || "",
        type: item.type || "",
        source: item.source || "",
        campaign: item.campaign || "",
        stage: item.stage?.name || "",
        assigned_to: item.assignedTo?.name || "",
        interest_course: item.interestCourse?.title || "",
        score: item.score || 0,
        temperature: item.temperature || "",
        follow_up_status: item.followUpStatus || "",
        next_follow_up_at: item.nextFollowUpAt ? new Date(item.nextFollowUpAt).toISOString() : "",
        is_converted: item.isConverted ? "yes" : "no",
        created_at: item.createdAt ? new Date(item.createdAt).toISOString() : "",
      })));
      return csvResponse("leads-report.csv", csv);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unsupported report type. Use one of: applications, finance, communications, attendance, referrals, leads",
      },
      { status: 400 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to export report";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
