import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    perUserLimit: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    applicableCourses: {
      type: [Schema.Types.ObjectId],
      ref: "Course",
      default: [],
    },
    applicableBatches: {
      type: [Schema.Types.ObjectId],
      ref: "Batch",
      default: [],
    },
    firstPaymentOnly: {
      type: Boolean,
      default: false,
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

CouponSchema.index({ isActive: 1, startsAt: 1, endsAt: 1 });

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
