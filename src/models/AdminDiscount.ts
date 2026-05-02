import mongoose from "mongoose";

const AdminDiscountSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
    },
    discountType: {
      type: String,
      required: true,
      enum: ["flat", "percentage"],
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

AdminDiscountSchema.index({ student: 1, application: 1 });
AdminDiscountSchema.index({ application: 1 });

export default mongoose.models.AdminDiscount ||
  mongoose.model("AdminDiscount", AdminDiscountSchema);
