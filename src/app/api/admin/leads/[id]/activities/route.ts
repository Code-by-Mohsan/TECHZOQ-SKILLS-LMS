import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import { leadActivityCreateSchema } from "@/lib/validations/admin";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionCheck = await requirePermissions(req, ["lead.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { id } = await params;
    const activities = await LeadActivity.find({ lead: id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json({ success: true, data: activities });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load lead activities";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionCheck = await requirePermissions(req, ["lead.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = leadActivityCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    await dbConnect();

    const { id } = await params;
    const lead = await Lead.findById(id).select("_id");
    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    const activity = await LeadActivity.create({
      lead: id,
      type: parsed.data.type,
      message: parsed.data.message,
      createdBy: permissionCheck.auth?.userId ?? null,
    });

    return NextResponse.json({ success: true, data: activity }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create lead activity";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
