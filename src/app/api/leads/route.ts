import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import LeadAssignment from "@/models/LeadAssignment";
import { calculateLeadScore, inferLeadTags, scoreToTemperature } from "@/lib/leads";
import {
  getPreferredCounselorAssignee,
  normalizeLeadType,
} from "@/lib/lead-routing";
import { rateLimit } from "@/lib/rateLimit";
import "@/models/Course";

const limiter = rateLimit(5, 60_000); // 5 requests per minute

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const { allowed } = limiter(ip);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please wait a minute before trying again." },
        { status: 429 },
      );
    }

    await dbConnect();
    const body = await req.json();

    // Honeypot spam check — if the hidden field has a value, it's a bot
    if (body._hp_website) {
      // Silently accept to not reveal the trap
      return NextResponse.json({ success: true, data: { _id: "ok" } }, { status: 201 });
    }

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 },
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    // Timing check — reject if form submitted too fast (< 3 seconds)
    if (body._formLoadedAt) {
      const elapsed = Date.now() - Number(body._formLoadedAt);
      if (elapsed < 3000) {
        return NextResponse.json({ success: true, data: { _id: "ok" } }, { status: 201 });
      }
    }
    const leadType = normalizeLeadType(body.type);

    const duplicateLead = await Lead.findOne({
      $or: [
        { email: String(body.email).toLowerCase().trim() },
        ...(body.phone ? [{ phone: String(body.phone).trim() }] : []),
      ],
      isConverted: false,
      status: { $ne: "converted" },
    }).select("_id").lean() as unknown as { _id: unknown } | null;
    if (duplicateLead) {
      return NextResponse.json(
        { success: false, message: "Duplicate lead already exists" },
        { status: 409 },
      );
    }

    const tags = inferLeadTags({
      type: leadType,
      source: body.source,
      campaign: body.campaign,
      adSet: body.adSet,
      message: body.message,
      selectedCourseTitle: body.course,
    });
    const autoAssignedCounselorId =
      leadType === "counseling" ? await getPreferredCounselorAssignee() : null;
    const counselingFollowUpAt =
      leadType === "counseling"
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : null;
    const score = calculateLeadScore({
      type: leadType,
      source: body.source,
      hasPhone: Boolean(body.phone),
      hasCourseInterest: Boolean(body.interestCourseId || body.course),
      hasRecentFollowUp: Boolean(counselingFollowUpAt),
      isOverdue: false,
    });

    const lead = await Lead.create({
      name: String(body.name).trim(),
      email: String(body.email).toLowerCase().trim(),
      phone: body.phone ? String(body.phone).trim() : "",
      type: leadType,
      source: body.source || "general",
      campaign: body.campaign || "",
      adSet: body.adSet || "",
      adId: body.adId || "",
      landingPage: body.landingPage || "",
      interestCourses: body.interestCourseId ? [body.interestCourseId] : [],
      interestCourse: body.interestCourseId || null, // legacy compat
      status: "lead",
      assignedTo: autoAssignedCounselorId,
      assignedAt: autoAssignedCounselorId ? new Date() : null,
      notes: body.notes || "",
      message: body.message || "",
      preferredDate: body.preferredDate ? new Date(body.preferredDate) : null,
      tags,
      score,
      temperature: scoreToTemperature(score),
      nextFollowUpAt: counselingFollowUpAt,
      followUpStatus: counselingFollowUpAt ? "scheduled" : "not_scheduled",
    });
    if (autoAssignedCounselorId) {
      await LeadAssignment.create({
        lead: lead._id,
        assignedTo: autoAssignedCounselorId,
        assignedBy: null,
        reason: "Auto-assigned from counseling booking",
      });
    }
    await LeadActivity.create({
      lead: lead._id,
      type: "note",
      message:
        leadType === "counseling"
          ? "Career counseling request submitted"
          : "Lead submitted from public form",
      meta: {
        type: leadType,
        status: "lead",
        landingPage: body.landingPage || "",
      },
      createdBy: null,
    });
    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const leads = await Lead.find({})
      .populate("interestCourses", "title")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json({ success: true, data: leads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
