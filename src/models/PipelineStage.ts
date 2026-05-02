import mongoose, { Schema } from "mongoose";

const PipelineStageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    color: {
      type: String,
      default: "#3b82f6",
    },
    isFinal: {
      type: Boolean,
      default: false,
    },
    isConversionStage: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

PipelineStageSchema.index({ order: 1, isActive: 1 });

export default mongoose.models.PipelineStage ||
  mongoose.model("PipelineStage", PipelineStageSchema);
