import mongoose, { Schema } from "mongoose";

const EnrollmentTransferLogSchema = new Schema(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    fromBatch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    toBatch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    reason: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    transferredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

EnrollmentTransferLogSchema.index({ enrollment: 1, createdAt: -1 });

export default
  mongoose.models.EnrollmentTransferLog ||
  mongoose.model("EnrollmentTransferLog", EnrollmentTransferLogSchema);

