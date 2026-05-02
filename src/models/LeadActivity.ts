import mongoose, { Schema } from "mongoose";

const LeadActivitySchema = new Schema(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    type: {
      type: String,
      enum: ["call", "whatsapp", "meeting", "note", "email", "stage_change", "status_change", "assignment", "conversion", "followup_note"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 4000,
    },
    meta: {
      type: Schema.Types.Mixed,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

LeadActivitySchema.index({ lead: 1, createdAt: -1 });
LeadActivitySchema.index({ type: 1, createdAt: -1 });

delete mongoose.models.LeadActivity;
export default mongoose.model("LeadActivity", LeadActivitySchema);
