import mongoose, { Schema } from "mongoose";

const FileAssetSchema = new Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
      unique: true,
    },
    storageProvider: {
      type: String,
      enum: ["cloudinary", "s3", "local", "other"],
      default: "cloudinary",
    },
    url: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ["payment_proof", "admission_document", "profile", "course_asset", "other"],
      default: "other",
    },
    sourceModule: {
      type: String,
      default: "general",
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    visibility: {
      type: String,
      enum: ["private", "internal", "public"],
      default: "private",
    },
    checksum: {
      type: String,
      default: "",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

FileAssetSchema.index({ uploadedBy: 1, createdAt: -1 });
FileAssetSchema.index({ category: 1, sourceModule: 1, createdAt: -1 });
FileAssetSchema.index({ ownerUser: 1, createdAt: -1 });

export default mongoose.models.FileAsset || mongoose.model("FileAsset", FileAssetSchema);
