import mongoose, { Schema } from "mongoose";

const PaymentProviderEventSchema = new Schema(
  {
    providerType: {
      type: String,
      enum: ["manual", "jazzcash", "easypaisa", "stripe", "other"],
      required: true,
    },
    eventType: {
      type: String,
      default: "webhook",
    },
    providerReference: {
      type: String,
      default: "",
      index: true,
    },
    transactionReference: {
      type: String,
      default: "",
      index: true,
    },
    status: {
      type: String,
      enum: ["received", "verified", "failed", "ignored"],
      default: "received",
    },
    payload: {
      type: Schema.Types.Mixed,
      default: null,
    },
    verificationResponse: {
      type: Schema.Types.Mixed,
      default: null,
    },
    paymentSubmission: {
      type: Schema.Types.ObjectId,
      ref: "PaymentSubmission",
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

PaymentProviderEventSchema.index({ providerType: 1, createdAt: -1 });

export default
  mongoose.models.PaymentProviderEvent ||
  mongoose.model("PaymentProviderEvent", PaymentProviderEventSchema);
