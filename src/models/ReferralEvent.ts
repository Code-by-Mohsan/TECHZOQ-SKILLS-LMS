import mongoose, { Schema } from "mongoose";

const ReferralEventSchema = new Schema(
  {
    referralCode: {
      type: Schema.Types.ObjectId,
      ref: "ReferralCode",
      required: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
    },
    referrerUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refereeUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    eventType: {
      type: String,
      enum: ["signup", "application_submitted", "payment_verified", "rejected", "cancelled"],
      default: "application_submitted",
    },
    status: {
      type: String,
      enum: ["pending", "qualified", "disqualified"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
    rewardDiscountType: {
      type: String,
      enum: ["flat", "percentage", ""],
      default: "",
    },
    rewardDiscountValue: {
      type: Number,
      default: 0,
    },
    rewardDiscountAmount: {
      type: Number,
      default: 0,
    },
    rewardAppliedTo: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    rewardAppliedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

ReferralEventSchema.index({ referralCode: 1, createdAt: -1 });
ReferralEventSchema.index({ referrerUser: 1, createdAt: -1 });
ReferralEventSchema.index({ refereeUser: 1, createdAt: -1 });
ReferralEventSchema.index(
  { referralCode: 1, application: 1, eventType: 1 },
  {
    unique: true,
    partialFilterExpression: { application: { $exists: true, $ne: null } },
  },
);

export default mongoose.models.ReferralEvent || mongoose.model("ReferralEvent", ReferralEventSchema);
