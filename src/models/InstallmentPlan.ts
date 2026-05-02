import mongoose, { Schema } from "mongoose";

const InstallmentSchema = new Schema(
  {
    installmentNumber: { type: Number, required: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["upcoming", "due", "paid", "overdue", "cancelled"],
      default: "upcoming",
    },
    paidAmount: { type: Number, default: 0, min: 0 },
    paidAt: { type: Date, default: null },
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice", default: null },
  },
  { _id: true },
);

const InstallmentPlanSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalInstallments: {
      type: Number,
      required: true,
      min: 1,
      max: 24,
    },
    installments: [InstallmentSchema],
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

InstallmentPlanSchema.index({ student: 1, application: 1 });
InstallmentPlanSchema.index({ application: 1 });

export default mongoose.models.InstallmentPlan ||
  mongoose.model("InstallmentPlan", InstallmentPlanSchema);
