import mongoose, { Schema } from "mongoose";

const NotificationPreferenceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    inAppEnabled: {
      type: Boolean,
      default: true,
    },
    emailEnabled: {
      type: Boolean,
      default: false,
    },
    whatsappEnabled: {
      type: Boolean,
      default: false,
    },
    quietHoursStart: {
      type: String,
      default: "",
    },
    quietHoursEnd: {
      type: String,
      default: "",
    },
    timezone: {
      type: String,
      default: "Asia/Karachi",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export default
  mongoose.models.NotificationPreference ||
  mongoose.model("NotificationPreference", NotificationPreferenceSchema);
