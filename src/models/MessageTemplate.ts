import mongoose, { Schema } from "mongoose";

const MessageTemplateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      enum: ["whatsapp", "email", "sms", "in_app"],
      default: "whatsapp",
    },
    body: {
      type: String,
      required: true,
      maxlength: 4000,
    },
    variables: {
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

MessageTemplateSchema.index({ channel: 1, isActive: 1 });

export default
  mongoose.models.MessageTemplate || mongoose.model("MessageTemplate", MessageTemplateSchema);

