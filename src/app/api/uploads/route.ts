import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import FileAsset from "@/models/FileAsset";
import { ALLOWED_UPLOAD_MIME_TYPES, normalizeFileName, sha256FromBuffer } from "@/lib/upload";
import { extractClientMeta, writeAuditLog } from "@/lib/audit";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_CATEGORIES = new Set(["payment_proof", "admission_document", "profile", "course_asset", "other"]);
const ALLOWED_VISIBILITY = new Set(["private", "internal", "public"]);

export async function POST(req: Request) {
  const auth = verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const category = String(formData.get("category") || "other").trim();
    const sourceModule = String(formData.get("sourceModule") || "general");
    const ownerUserParam = String(formData.get("ownerUser") || "").trim();
    const visibility = String(formData.get("visibility") || "private").trim();
    const ownerUser = auth.userId;

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "File is required" }, { status: 400 });
    }
    if (!ALLOWED_UPLOAD_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, message: "Unsupported file type" }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ success: false, message: "File exceeds allowed size limit" }, { status: 400 });
    }
    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ success: false, message: "Invalid file category" }, { status: 400 });
    }
    if (!ALLOWED_VISIBILITY.has(visibility)) {
      return NextResponse.json({ success: false, message: "Invalid file visibility" }, { status: 400 });
    }
    if (ownerUserParam && ownerUserParam !== auth.userId) {
      return NextResponse.json(
        { success: false, message: "ownerUser must match authenticated user" },
        { status: 403 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const checksum = sha256FromBuffer(buffer);
    const safeName = normalizeFileName(file.name);

    await dbConnect();
    const existing = await FileAsset.findOne({
      uploadedBy: auth.userId,
      checksum,
      sizeBytes: file.size,
      isActive: true,
    }).lean();
    if (existing) {
      return NextResponse.json({ success: true, data: existing });
    }

    const folder = `techzoq/${category}`;
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              resource_type: "auto",
              public_id: `${Date.now()}_${safeName}`,
              overwrite: false,
            },
            (error, result) => {
              if (error || !result) return reject(error || new Error("Upload failed"));
              resolve({
                secure_url: String(result.secure_url),
                public_id: String(result.public_id),
              });
            },
          )
          .end(buffer);
      },
    );

    const asset = await FileAsset.create({
      originalName: safeName,
      storageKey: uploadResult.public_id,
      storageProvider: "cloudinary",
      url: uploadResult.secure_url,
      contentType: file.type,
      sizeBytes: file.size,
      category,
      sourceModule: sourceModule.slice(0, 80),
      uploadedBy: auth.userId,
      ownerUser,
      visibility,
      checksum,
    });

    const clientMeta = extractClientMeta(req);
    await writeAuditLog({
      actorUserId: auth.userId,
      actorRole: auth.role,
      action: "file.upload",
      module: "files",
      entityType: "FileAsset",
      entityId: String(asset._id),
      afterState: {
        storageKey: asset.storageKey,
        category: asset.category,
        sourceModule: asset.sourceModule,
        sizeBytes: asset.sizeBytes,
      },
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
