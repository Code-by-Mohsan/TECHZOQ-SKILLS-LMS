import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import FileAsset from "@/models/FileAsset";
import { getUserRoleKeys } from "@/lib/rbac";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

const PRIVILEGED_FILE_ROLES = new Set([
  "super_admin",
  "admin",
  "counselor",
  "finance_manager",
  "finance_operator",
]);

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const redirect = searchParams.get("redirect") === "true";

    const asset = await FileAsset.findById(id).lean() as {
      _id: unknown;
      url: string;
      originalName: string;
      contentType: string;
      sizeBytes: number;
      category: string;
      sourceModule: string;
      visibility: "private" | "internal" | "public";
      uploadedBy?: unknown;
      ownerUser?: unknown;
      isActive?: boolean;
    } | null;

    if (!asset || !asset.isActive) {
      return NextResponse.json({ success: false, message: "File not found" }, { status: 404 });
    }

    const ownerMatch =
      String(asset.uploadedBy || "") === auth.userId ||
      String(asset.ownerUser || "") === auth.userId;

    let allowed = ownerMatch || asset.visibility === "public";
    if (!allowed) {
      const roleKeys = await getUserRoleKeys(auth.userId);
      allowed = roleKeys.some((roleKey) => PRIVILEGED_FILE_ROLES.has(roleKey));
    }

    if (!allowed) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: auth.userId,
      actorRole: auth.role,
      action: "file.access",
      module: "files",
      entityType: "FileAsset",
      entityId: String(asset._id),
      afterState: {
        category: asset.category,
        sourceModule: asset.sourceModule,
        visibility: asset.visibility,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    }).catch(() => null);

    if (redirect) {
      return NextResponse.redirect(asset.url, { status: 307 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: String(asset._id),
        originalName: asset.originalName,
        contentType: asset.contentType,
        sizeBytes: asset.sizeBytes,
        category: asset.category,
        sourceModule: asset.sourceModule,
        visibility: asset.visibility,
        url: asset.url,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch file";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

