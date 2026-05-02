import mongoose, { Schema } from "mongoose";

const PaymentSubmissionSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      default: null,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "jazzcash_manual", "easypaisa_manual", "cash", "other"],
      required: true,
    },
    transactionReference: {
      type: String,
      required: true,
      trim: true,
    },
    screenshotUrl: {
      type: String,
      default: "",
    },
    screenshotFileAsset: {
      type: Schema.Types.ObjectId,
      ref: "FileAsset",
      default: null,
    },
    providerType: {
      type: String,
      enum: ["manual", "jazzcash", "easypaisa", "stripe", "other"],
      default: "manual",
    },
    providerReference: {
      type: String,
      default: "",
    },
    providerStatus: {
      type: String,
      enum: ["not_attempted", "pending", "verified", "failed"],
      default: "not_attempted",
    },
    providerMeta: {
      type: Schema.Types.Mixed,
      default: null,
    },
    verificationStatus: {
      type: String,
      enum: ["submitted", "under_review", "verified", "rejected"],
      default: "submitted",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    financeRemarks: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

PaymentSubmissionSchema.index({ student: 1, createdAt: -1 });
PaymentSubmissionSchema.index({ invoice: 1, verificationStatus: 1 });
PaymentSubmissionSchema.index({ transactionReference: 1 });

export default
  mongoose.models.PaymentSubmission ||
  mongoose.model("PaymentSubmission", PaymentSubmissionSchema);
