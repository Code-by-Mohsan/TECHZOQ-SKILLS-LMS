import mongoose, { Schema } from "mongoose";

const SessionSchema = new Schema(
  {
    batch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      default: "",
    },
    startsAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    meetingLink: {
      type: String,
      default: "",
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

SessionSchema.index({ batch: 1, startsAt: 1 });

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);

