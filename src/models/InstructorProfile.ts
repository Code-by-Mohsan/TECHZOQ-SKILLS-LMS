import mongoose, { Schema } from "mongoose";

const InstructorProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 2000,
    },
    specializations: {
      type: [String],
      default: [],
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

InstructorProfileSchema.index({ isActive: 1, updatedAt: -1 });

export default
  mongoose.models.InstructorProfile ||
  mongoose.model("InstructorProfile", InstructorProfileSchema);

