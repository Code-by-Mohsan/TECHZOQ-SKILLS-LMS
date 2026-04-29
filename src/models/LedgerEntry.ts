import mongoose, { Schema } from "mongoose";

const LedgerEntrySchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
    },
    paymentSubmission: {
      type: Schema.Types.ObjectId,
      ref: "PaymentSubmission",
      default: null,
    },
    entryType: {
      type: String,
      enum: ["invoice_issue", "payment_verified", "payment_reversed", "discount_applied", "adjustment"],
      required: true,
    },
    debitAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    creditAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

LedgerEntrySchema.index({ student: 1, createdAt: -1 });
LedgerEntrySchema.index({ invoice: 1, createdAt: -1 });
LedgerEntrySchema.index(
  { paymentSubmission: 1, entryType: 1 },
  {
    unique: true,
    partialFilterExpression: {
      paymentSubmission: { $exists: true, $ne: null },
      entryType: "payment_verified",
    },
  },
);

export default mongoose.models.LedgerEntry || mongoose.model("LedgerEntry", LedgerEntrySchema);

