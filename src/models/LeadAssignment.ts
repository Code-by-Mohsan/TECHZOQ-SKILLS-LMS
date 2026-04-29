import mongoose, { Schema } from "mongoose";

const LeadAssignmentSchema = new Schema(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

LeadAssignmentSchema.index({ lead: 1, createdAt: -1 });
LeadAssignmentSchema.index({ assignedTo: 1, createdAt: -1 });

export default mongoose.models.LeadAssignment ||
  mongoose.model("LeadAssignment", LeadAssignmentSchema);
