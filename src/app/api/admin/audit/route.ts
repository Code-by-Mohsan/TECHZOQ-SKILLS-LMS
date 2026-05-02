import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import AuditLog from "@/models/AuditLog";

export async function GET(req: Request) {
  const permissionCheck = await requirePermissions(req, ["audit.view"]);
  if (permissionCheck.error) return permissionCheck.error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 25));
    const moduleFilter = (searchParams.get("module") || "").trim();
    const actionFilter = (searchParams.get("action") || "").trim();
    const entityTypeFilter = (searchParams.get("entityType") || "").trim();

    const filter: Record<string, unknown> = {};
    if (moduleFilter) filter.module = moduleFilter;
    if (actionFilter) filter.action = actionFilter;
    if (entityTypeFilter) filter.entityType = entityTypeFilter;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { logs, total, page, limit },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch audit logs";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

