import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "application_submitted",
      "application_approved",
      "application_rejected",
      "fees_pending",
      "fees_submitted",
      "enrolled",
      "batch_assigned",
      "status_update",
      "payment_submitted",
      "payment_verified",
      "payment_rejected",
      "attendance_alert",
      "communication_update",
      "enrollment",
      "quiz_passed",
      "course_complete",
      "certificate",
    ],
    required: true,
  },
  link: { type: String },
  channel: {
    type: String,
    enum: ["in_app", "email", "whatsapp"],
    default: "in_app",
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: null,
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

NotificationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
