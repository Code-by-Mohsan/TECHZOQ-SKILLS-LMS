import mongoose, { Schema } from "mongoose";

const FeeStructureSchema = new Schema(
  {
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
    currency: {
      type: String,
      default: "PKR",
    },
    admissionFee: {
      type: Number,
      default: 0,
    },
    tuitionFee: {
      type: Number,
      default: 0,
    },
    installmentsAllowed: {
      type: Boolean,
      default: false,
    },
    installmentCount: {
      type: Number,
      default: 1,
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

FeeStructureSchema.index({ course: 1, batch: 1, isActive: 1 });

export default mongoose.models.FeeStructure || mongoose.model("FeeStructure", FeeStructureSchema);

