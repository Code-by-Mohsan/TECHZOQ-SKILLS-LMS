import mongoose, { Schema } from "mongoose";

const AttendanceSchema = new Schema(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

AttendanceSchema.index({ session: 1, student: 1 }, { unique: true });
AttendanceSchema.index({ student: 1, createdAt: -1 });
AttendanceSchema.index({ batch: 1, createdAt: -1 });

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
