import mongoose, { Schema } from "mongoose";

const ReferralCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    ownerUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerRoleSnapshot: {
      type: String,
      default: "student",
    },
    title: {
      type: String,
      default: "",
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    startsAt: {
      type: Date,
      default: null,
    },
    endsAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
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

ReferralCodeSchema.index({ ownerUser: 1, isActive: 1 });

export default mongoose.models.ReferralCode || mongoose.model("ReferralCode", ReferralCodeSchema);
