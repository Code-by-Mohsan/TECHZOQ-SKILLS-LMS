import mongoose, { Schema } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    status: {
      type: String,
      enum: ["enrolled", "active", "paused", "completed", "cancelled", "transferred"],
      default: "enrolled",
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
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

EnrollmentSchema.index({ student: 1, course: 1, batch: 1 }, { unique: true });
EnrollmentSchema.index({ batch: 1, status: 1 });
EnrollmentSchema.index({ student: 1, enrolledAt: -1 });

export default mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

