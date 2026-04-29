import mongoose, { Schema } from "mongoose";

const CommunicationLogSchema = new Schema(
  {
    senderUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    recipientUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    recipientPhone: {
      type: String,
      default: "",
    },
    channel: {
      type: String,
      enum: ["whatsapp", "email", "sms", "in_app"],
      default: "whatsapp",
    },
    sourceModule: {
      type: String,
      default: "general",
    },
    template: {
      type: Schema.Types.ObjectId,
      ref: "MessageTemplate",
      default: null,
    },
    message: {
      type: String,
      required: true,
      maxlength: 4000,
    },
    status: {
      type: String,
      enum: ["queued", "opened_in_whatsapp", "marked_sent", "failed", "skipped", "not_attempted"],
      default: "queued",
    },
    failureReason: {
      type: String,
      default: "",
    },
    sentAt: {
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

CommunicationLogSchema.index({ sourceModule: 1, createdAt: -1 });
CommunicationLogSchema.index({ recipientUser: 1, createdAt: -1 });
CommunicationLogSchema.index({ senderUser: 1, createdAt: -1 });

export default
  mongoose.models.CommunicationLog || mongoose.model("CommunicationLog", CommunicationLogSchema);

