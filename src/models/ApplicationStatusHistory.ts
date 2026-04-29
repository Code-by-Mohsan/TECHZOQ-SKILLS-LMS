import mongoose, { Schema } from "mongoose";

const ApplicationStatusHistorySchema = new Schema(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    fromStatus: {
      type: String,
      default: null,
    },
    toStatus: {
      type: String,
      required: true,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    statusNote: {
      type: String,
      default: "",
    },
    visibleToStudent: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

ApplicationStatusHistorySchema.index({ application: 1, createdAt: -1 });

export default
  mongoose.models.ApplicationStatusHistory ||
  mongoose.model("ApplicationStatusHistory", ApplicationStatusHistorySchema);

