import mongoose, { Schema } from "mongoose";

const BatchInstructorAssignmentSchema = new Schema(
  {
    batch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignmentType: {
      type: String,
      enum: ["instructor", "assistant"],
      default: "instructor",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

BatchInstructorAssignmentSchema.index(
  { batch: 1, user: 1, assignmentType: 1 },
  { unique: true },
);
BatchInstructorAssignmentSchema.index({ user: 1, isActive: 1 });

export default
  mongoose.models.BatchInstructorAssignment ||
  mongoose.model("BatchInstructorAssignment", BatchInstructorAssignmentSchema);

