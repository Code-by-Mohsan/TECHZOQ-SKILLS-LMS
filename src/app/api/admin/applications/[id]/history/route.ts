import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import ApplicationStatusHistory from "@/models/ApplicationStatusHistory";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const permissionCheck = await requirePermissions(req, ["application.review"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { id } = await params;

    const history = await ApplicationStatusHistory.find({ application: id })
      .populate("changedBy", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: history });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load application history";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

