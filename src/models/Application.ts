import mongoose, { Schema } from "mongoose";

const ApplicationSchema = new Schema(
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
      default: null,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "contacted",
        "shortlisted",
        "pending",
        "approved",
        "waitlisted",
        "fee_pending",
        "fees_pending",
        "fees_submitted",
        "enrolled",
        "rejected",
        "cancelled",
      ],
      default: "submitted",
    },
    feesPaid: {
      type: Boolean,
      default: false,
    },
    statusNote: {
      type: String,
      default: "",
    },
    leadSource: {
      type: String,
      default: "direct",
    },
    campaignSource: {
      type: String,
      default: "",
    },
    referralCode: {
      type: String,
      default: "",
    },
    referralOwnerUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    referralOwnerRole: {
      type: String,
      default: "",
    },
    couponCode: {
      type: String,
      default: "",
    },
    couponTypeSnapshot: {
      type: String,
      enum: ["flat", "percentage", ""],
      default: "",
    },
    couponValueSnapshot: {
      type: Number,
      default: 0,
    },
    discountAmountSnapshot: {
      type: Number,
      default: 0,
    },
    payableAmountSnapshot: {
      type: Number,
      default: 0,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
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

ApplicationSchema.index({ student: 1, course: 1 }, { unique: true });
ApplicationSchema.index({ course: 1, status: 1 });
ApplicationSchema.index({ student: 1, appliedAt: -1 });
ApplicationSchema.index({ referralCode: 1 });
ApplicationSchema.index({ couponCode: 1 });

export default mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
