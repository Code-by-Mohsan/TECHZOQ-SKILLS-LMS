import mongoose, { Schema } from "mongoose";

const BatchSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a batch name"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
    },
    endDate: {
      type: Date,
      default: null,
    },
    maxStudents: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "planned", "open", "full", "running", "completed", "cancelled", "upcoming", "active"],
      default: "planned",
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

BatchSchema.index({ course: 1, name: 1 }, { unique: true });

export default mongoose.models.Batch ||
  mongoose.model("Batch", BatchSchema);
