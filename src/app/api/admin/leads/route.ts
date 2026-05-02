import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Lead from "@/models/Lead";
import { leadCreateSchema } from "@/lib/validations/admin";
import { calculateLeadScore, inferLeadTags, scoreToTemperature } from "@/lib/leads";
import LeadActivity from "@/models/LeadActivity";
import LeadAssignment from "@/models/LeadAssignment";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import { normalizeLeadType } from "@/lib/lead-routing";
import "@/models/Course";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["lead.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const status = (searchParams.get("status") || "").trim();
    const source = (searchParams.get("source") || "").trim();
    const type = (searchParams.get("type") || "").trim();
    const assignedTo = (searchParams.get("assignedTo") || "").trim();
    const temperature = (searchParams.get("temperature") || "").trim();
    const overdueOnly = searchParams.get("overdue") === "true";
    const search = (searchParams.get("search") || "").trim();
    const from = (searchParams.get("from") || "").trim();
    const to = (searchParams.get("to") || "").trim();
    const page = Math.max(Number(searchParams.get("page") || "1"), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "30"), 1), 1000);

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (type) filter.type = type;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (temperature) filter.temperature = temperature;
    if (overdueOnly) {
      filter.nextFollowUpAt = { $lte: new Date() };
      filter.followUpStatus = { $in: ["scheduled", "overdue"] };
    }
    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.$gte = new Date(from);
      if (to) dateFilter.$lte = new Date(to);
      filter.createdAt = dateFilter;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Lead.find(filter)
        .populate("interestCourses", "title slug")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load leads";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const permissionCheck = await requirePermissions(req, ["lead.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = leadCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await dbConnect();
    const data = parsed.data;

    // Duplicate check (only if email provided)
    if (data.email) {
      const duplicateLead = await Lead.findOne({
        $or: [
          { email: data.email.toLowerCase().trim() },
          ...(data.phone ? [{ phone: data.phone.trim() }] : []),
        ],
        isConverted: false,
        status: { $ne: "converted" },
      }).select("_id name email phone").lean() as unknown as {
        _id: unknown;
        name?: string;
        email?: string;
        phone?: string;
      } | null;
      if (duplicateLead) {
        return NextResponse.json(
          {
            success: false,
            message: "Duplicate active lead found with same email/phone",
            data: duplicateLead,
          },
          { status: 409 },
        );
      }
    }

    const leadType = normalizeLeadType(data.type);

    // Resolve interest courses — support both single and array
    const interestCourseIds = data.interestCourseIds?.length
      ? data.interestCourseIds
      : data.interestCourseId
        ? [data.interestCourseId]
        : [];

    const inferredTags = inferLeadTags({
      type: leadType,
      source: data.source,
      campaign: data.campaign,
      adSet: data.adSet,
      message: data.message,
    });
    const tags = Array.from(new Set([...(data.tags || []), ...inferredTags]));
    const score = calculateLeadScore({
      type: leadType,
      source: data.source,
      hasPhone: Boolean(data.phone),
      hasCourseInterest: interestCourseIds.length > 0,
      hasRecentFollowUp: Boolean(data.nextFollowUpAt),
      isOverdue: false,
      interestPercentage: data.interestPercentage,
    });

    const lead = await Lead.create({
      name: data.name,
      email: data.email ? data.email.toLowerCase().trim() : "",
      phone: data.phone?.trim() || "",
      type: leadType,
      status: data.status || "lead",
      source: data.source || "general",
      campaign: data.campaign || "",
      adSet: data.adSet || "",
      adId: data.adId || "",
      landingPage: data.landingPage || "",
      interestCourses: interestCourseIds,
      interestPercentage: data.interestPercentage ?? null,
      temperature: data.temperature || scoreToTemperature(score),
      assignedTo: data.assignedTo || null,
      assignedBy: data.assignedTo ? permissionCheck.auth?.userId ?? null : null,
      assignedAt: data.assignedTo ? new Date() : null,
      notes: data.notes || "",
      message: data.message || "",
      tags,
      score,
      nextFollowUpAt: data.nextFollowUpAt || null,
      followUpStatus: data.nextFollowUpAt ? "scheduled" : "not_scheduled",
      createdBy: permissionCheck.auth?.userId ?? null,
      updatedBy: permissionCheck.auth?.userId ?? null,
    });

    if (data.assignedTo) {
      await LeadAssignment.create({
        lead: lead._id,
        assignedTo: data.assignedTo,
        assignedBy: permissionCheck.auth?.userId ?? null,
        reason: "Initial assignment",
      });
    }

    await LeadActivity.create({
      lead: lead._id,
      type: "note",
      message: "Lead created",
      meta: {
        source: lead.source,
        type: lead.type,
        status: lead.status,
      },
      createdBy: permissionCheck.auth?.userId ?? null,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "lead.create",
      module: "leads",
      entityType: "Lead",
      entityId: String(lead._id),
      afterState: {
        source: lead.source,
        type: lead.type,
        status: lead.status,
        assignedTo: lead.assignedTo,
        score: lead.score,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create lead";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
