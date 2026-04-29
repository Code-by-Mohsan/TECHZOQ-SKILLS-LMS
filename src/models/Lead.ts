import mongoose, { Schema } from "mongoose";
import { LEAD_TYPES, LEAD_STATUSES } from "@/lib/constants/leads";

const LeadSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: [...LEAD_TYPES],
      default: "general",
    },
    status: {
      type: String,
      enum: [...LEAD_STATUSES],
      default: "lead",
    },
    source: {
      type: String,
      enum: ["facebook_ads", "google_ads", "organic", "referral", "walk_in", "whatsapp", "website", "other", "general"],
      default: "general",
    },
    campaign: {
      type: String,
      default: "",
    },
    adSet: {
      type: String,
      default: "",
    },
    adId: {
      type: String,
      default: "",
    },
    landingPage: {
      type: String,
      default: "",
    },
    interestCourses: {
      type: [{ type: Schema.Types.ObjectId, ref: "Course" }],
      default: [],
    },
    interestPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    // Legacy — kept for backward compat, no longer used in CRM UI
    stage: {
      type: Schema.Types.ObjectId,
      ref: "PipelineStage",
      default: null,
    },
    // Legacy single course reference (public forms may still send this)
    interestCourse: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    temperature: {
      type: String,
      enum: ["hot", "warm", "cold"],
      default: "warm",
    },
    score: {
      type: Number,
      default: 0,
    },
    lastContactedAt: {
      type: Date,
      default: null,
    },
    nextFollowUpAt: {
      type: Date,
      default: null,
    },
    followUpStatus: {
      type: String,
      enum: ["not_scheduled", "scheduled", "completed", "overdue"],
      default: "not_scheduled",
    },
    isConverted: {
      type: Boolean,
      default: false,
    },
    convertedToApplication: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    convertedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    // Backward compatibility with old lead capture fields.
    company: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    course: {
      type: String,
      default: "",
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    passType: {
      type: String,
      default: "",
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

LeadSchema.index({ email: 1, createdAt: -1 });
LeadSchema.index({ phone: 1, createdAt: -1 });
LeadSchema.index({ status: 1, createdAt: -1 });
LeadSchema.index({ status: 1, type: 1, assignedTo: 1 });
LeadSchema.index({ source: 1, campaign: 1, createdAt: -1 });
LeadSchema.index({ nextFollowUpAt: 1, followUpStatus: 1 });

// Delete cached model to pick up schema changes (HMR safety)
if (mongoose.models.Lead) {
  delete mongoose.models.Lead;
}

export default mongoose.model("Lead", LeadSchema);
