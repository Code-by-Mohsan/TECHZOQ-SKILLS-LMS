import mongoose, { Schema } from "mongoose";

const CouponRedemptionSchema = new Schema(
  {
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
    },
    baseAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    payableAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["reserved", "consumed", "reversed"],
      default: "reserved",
    },
    consumedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true },
);

CouponRedemptionSchema.index({ coupon: 1, student: 1, createdAt: -1 });
CouponRedemptionSchema.index({ application: 1 });
CouponRedemptionSchema.index({ code: 1 });
CouponRedemptionSchema.index(
  { coupon: 1, student: 1, application: 1 },
  {
    unique: true,
    partialFilterExpression: { application: { $exists: true, $ne: null } },
  },
);

export default mongoose.models.CouponRedemption ||
  mongoose.model("CouponRedemption", CouponRedemptionSchema);
