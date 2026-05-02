import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Session from "@/models/Session";
import Batch from "@/models/Batch";
import { sessionCreateSchema } from "@/lib/validations/admin";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["attendance.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const batchId = (searchParams.get("batchId") || "").trim();

    const filter: Record<string, unknown> = {};
    if (batchId) filter.batch = batchId;

    const sessions = await Session.find(filter)
      .populate({
        path: "batch",
        select: "name status course",
        populate: { path: "course", select: "title" },
      })
      .sort({ startsAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: sessions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load sessions";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const permissionCheck = await requirePermissions(req, ["attendance.manage"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    const parsed = sessionCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    if (parsed.data.endsAt <= parsed.data.startsAt) {
      return NextResponse.json(
        { success: false, message: "Session end time must be after start time" },
        { status: 400 },
      );
    }

    await dbConnect();

    const batch = await Batch.findById(parsed.data.batchId).select("_id");
    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found" }, { status: 404 });
    }

    const session = await Session.create({
      batch: parsed.data.batchId,
      title: parsed.data.title,
      topic: parsed.data.topic || "",
      startsAt: parsed.data.startsAt,
      endsAt: parsed.data.endsAt,
      meetingLink: parsed.data.meetingLink || "",
      createdBy: permissionCheck.auth?.userId ?? null,
      updatedBy: permissionCheck.auth?.userId ?? null,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: permissionCheck.auth?.userId,
      actorRole: permissionCheck.auth?.role,
      action: "attendance.session.create",
      module: "attendance",
      entityType: "Session",
      entityId: String(session._id),
      afterState: {
        batchId: parsed.data.batchId,
        title: session.title,
        startsAt: session.startsAt,
        endsAt: session.endsAt,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create session";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
