import mongoose, { Schema } from "mongoose";

const ApplicationNoteSchema = new Schema(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    authorUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    noteType: {
      type: String,
      enum: ["internal", "student_visible"],
      default: "internal",
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true },
);

ApplicationNoteSchema.index({ application: 1, createdAt: -1 });
ApplicationNoteSchema.index({ authorUser: 1, createdAt: -1 });

export default
  mongoose.models.ApplicationNote ||
  mongoose.model("ApplicationNote", ApplicationNoteSchema);

