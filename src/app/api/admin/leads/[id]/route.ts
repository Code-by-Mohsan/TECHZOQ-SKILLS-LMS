import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import LeadAssignment from "@/models/LeadAssignment";
import { leadUpdateSchema } from "@/lib/validations/admin";
import { calculateLeadScore, scoreToTemperature } from "@/lib/leads";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";
import "@/models/Course";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionCheck = await requirePermissions(req, ["lead.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { id } = await params;
    const lead = await Lead.findById(id)
      .populate("interestCourses", "title slug")
      .populate("assignedTo", "name email")
      .lean();
    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: lead });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load lead";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionCheck = await requirePermissions(req, ["lead.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = leadUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    await dbConnect();

    const { id } = await params;
    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }
    const beforeState = {
      type: lead.type,
      status: lead.status,
      assignedTo: lead.assignedTo,
      nextFollowUpAt: lead.nextFollowUpAt,
      followUpStatus: lead.followUpStatus,
      isConverted: lead.isConverted,
      score: lead.score,
      temperature: lead.temperature,
    };

    const data = parsed.data;
    if (data.name !== undefined) lead.name = data.name;
    if (data.email !== undefined) lead.email = data.email.toLowerCase().trim();
    if (data.phone !== undefined) lead.phone = data.phone;
    if (data.type !== undefined) lead.type = data.type;
    if (data.source !== undefined) lead.source = data.source;
    if (data.campaign !== undefined) lead.campaign = data.campaign;
    if (data.adSet !== undefined) lead.adSet = data.adSet;
    if (data.adId !== undefined) lead.adId = data.adId;
    if (data.landingPage !== undefined) lead.landingPage = data.landingPage;
    if (data.notes !== undefined) lead.notes = data.notes;
    if (data.tags !== undefined) lead.tags = data.tags;
    if (data.interestCourseIds !== undefined) lead.interestCourses = data.interestCourseIds as any;
    if (data.interestPercentage !== undefined) lead.interestPercentage = data.interestPercentage as any;
    if (data.lastContactedAt !== undefined) lead.lastContactedAt = (data.lastContactedAt || null) as any;
    if (data.nextFollowUpAt !== undefined) lead.nextFollowUpAt = (data.nextFollowUpAt || null) as any;
    if (data.followUpStatus !== undefined) lead.followUpStatus = data.followUpStatus;
    if (data.temperature !== undefined) lead.temperature = data.temperature;

    // Status change
    if (data.status !== undefined && data.status !== lead.status) {
      const previousStatus = lead.status;
      lead.status = data.status;
      await LeadActivity.create({
        lead: lead._id,
        type: "note",
        message: `Status changed from "${previousStatus}" to "${data.status}"`,
        meta: { previousStatus, newStatus: data.status },
        createdBy: permissionCheck.auth?.userId ?? null,
      });
    }

    if (data.assignedTo !== undefined) {
      const previousAssignedTo = lead.assignedTo ? String(lead.assignedTo) : "";
      lead.assignedTo = (data.assignedTo || null) as any;
      lead.assignedBy = (data.assignedTo ? permissionCheck.auth?.userId ?? null : null) as any;
      lead.assignedAt = (data.assignedTo ? new Date() : null) as any;
      if (data.assignedTo && previousAssignedTo !== data.assignedTo) {
        await LeadAssignment.create({
          lead: lead._id,
          assignedTo: data.assignedTo,
          assignedBy: permissionCheck.auth?.userId ?? null,
          reason: "Manual reassignment",
        });
        await LeadActivity.create({
          lead: lead._id,
          type: "assignment",
          message: "Lead reassigned",
          meta: { assignedTo: data.assignedTo },
          createdBy: permissionCheck.auth?.userId ?? null,
        });
      }
    }

    const isOverdue = Boolean(
      lead.nextFollowUpAt &&
      lead.followUpStatus !== "completed" &&
      new Date(lead.nextFollowUpAt).getTime() < Date.now(),
    );
    if (isOverdue) {
      lead.followUpStatus = "overdue";
    }

    const score = calculateLeadScore({
      type: lead.type,
      source: lead.source,
      hasPhone: Boolean(lead.phone),
      hasCourseInterest: lead.interestCourses?.length > 0,
      hasRecentFollowUp: Boolean(lead.nextFollowUpAt),
      isOverdue,
      interestPercentage: lead.interestPercentage,
    });
    lead.score = score;
    if (!data.temperature) {
      lead.temperature = scoreToTemperature(score);
    }

    if (permissionCheck.auth?.userId) {
      lead.updatedBy = permissionCheck.auth.userId as any;
    }
    await lead.save();

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "lead.update",
      module: "leads",
      entityType: "Lead",
      entityId: String(lead._id),
      beforeState,
      afterState: {
        status: lead.status,
        type: lead.type,
        assignedTo: lead.assignedTo,
        nextFollowUpAt: lead.nextFollowUpAt,
        followUpStatus: lead.followUpStatus,
        score: lead.score,
        temperature: lead.temperature,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: lead });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update lead";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
