import { z } from "zod";
import { PLATFORM_ROLES } from "@/lib/constants/auth";
import { LEAD_TYPES, LEAD_STATUSES } from "@/lib/constants/leads";

const platformRoleEnum = z.enum(PLATFORM_ROLES);
const leadTypeEnum = z.enum(LEAD_TYPES);
const leadStatusEnum = z.enum(LEAD_STATUSES);

export const adminUserRoleUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: platformRoleEnum,
});

export const adminApplicationStatusEnum = z.enum([
  "draft",
  "submitted",
  "under_review",
  "contacted",
  "shortlisted",
  "pending",
  "approved",
  "waitlisted",
  "fee_pending",
  "fees_pending",
  "fees_submitted",
  "enrolled",
  "rejected",
  "cancelled",
]);

export const adminApplicationUpdateSchema = z
  .object({
    status: adminApplicationStatusEnum.optional(),
    feesPaid: z.boolean().optional(),
    batchId: z.string().min(1).nullable().optional(),
    // Backward compatibility with previous frontend payload.
    batch: z.string().min(1).nullable().optional(),
    statusNote: z.string().max(500).optional(),
  })
  .refine(
    (data) =>
      data.status !== undefined ||
      data.feesPaid !== undefined ||
      data.batchId !== undefined ||
      data.batch !== undefined ||
      data.statusNote !== undefined,
    { message: "At least one field is required for update" },
  );

export const adminBatchUpsertSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  name: z.string().min(1, "Batch name is required").max(120),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  maxStudents: z.number().int().positive().nullable().optional(),
  status: z
    .enum(["draft", "planned", "open", "full", "running", "completed", "cancelled", "upcoming", "active"])
    .optional(),
});

export const adminEnrollmentCreateSchema = z.object({
  applicationId: z.string().min(1).optional(),
  studentId: z.string().min(1).optional(),
  courseId: z.string().min(1, "Course is required"),
  batchId: z.string().min(1, "Batch is required"),
}).refine((data) => Boolean(data.applicationId) || Boolean(data.studentId), {
  message: "Either applicationId or studentId is required",
});

export const adminEnrollmentTransferSchema = z.object({
  toBatchId: z.string().min(1, "Target batch is required"),
  reason: z.string().max(1000).optional(),
});

export const batchInstructorAssignmentSchema = z.object({
  userId: z.string().min(1, "Instructor user is required"),
  assignmentType: z.enum(["instructor", "assistant"]).default("instructor"),
  isActive: z.boolean().optional(),
});

export const invoiceCreateSchema = z.object({
  studentId: z.string().min(1),
  enrollmentId: z.string().optional(),
  courseId: z.string().min(1),
  batchId: z.string().optional(),
  subtotalAmount: z.number().nonnegative(),
  discountAmount: z.number().nonnegative().default(0),
  dueDate: z.coerce.date().optional(),
});

export const studentPaymentSubmissionSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.enum(["bank_transfer", "jazzcash_manual", "easypaisa_manual", "cash", "other"]),
  transactionReference: z.string().min(1).max(120),
  screenshotUrl: z.string().url().optional(),
  screenshotFileAssetId: z.string().optional(),
  providerType: z.enum(["manual", "jazzcash", "easypaisa", "stripe", "other"]).default("manual"),
});

export const studentGenerateInvoiceSchema = z.object({
  applicationId: z.string().min(1),
  type: z.enum(["enrollment", "remaining", "installment"]),
  installmentNumber: z.number().int().positive().optional(),
});

export const adminPaymentReviewSchema = z.object({
  verificationStatus: z.enum(["under_review", "verified", "rejected"]),
  rejectionReason: z.string().max(500).optional(),
  financeRemarks: z.string().max(1000).optional(),
});

export const adminDirectDiscountSchema = z.object({
  discountType: z.enum(["flat", "percentage"]),
  discountValue: z.number().positive(),
  reason: z.string().min(1).max(1000),
});

export const adminRecordPaymentSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.enum(["cash", "bank_transfer", "jazzcash_manual", "easypaisa_manual", "other"]),
  transactionReference: z.string().min(1).max(120),
  remarks: z.string().max(500).optional(),
});

export const installmentPlanCreateSchema = z.object({
  installments: z
    .array(
      z.object({
        amount: z.number().positive(),
        dueDate: z.coerce.date(),
      }),
    )
    .min(1)
    .max(24),
});

export const adminCouponAssignSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
});

export const messageTemplateUpsertSchema = z.object({
  name: z.string().min(1).max(120),
  channel: z.enum(["whatsapp", "email", "sms", "in_app"]).default("whatsapp"),
  body: z.string().min(1).max(4000),
  variables: z.array(z.string().min(1).max(50)).max(30).optional(),
  isActive: z.boolean().optional(),
});

export const communicationLogCreateSchema = z.object({
  recipientUserId: z.string().optional(),
  recipientPhone: z.string().min(7).max(20).optional(),
  sourceModule: z.string().min(1).max(80).default("general"),
  templateId: z.string().optional(),
  message: z.string().min(1).max(4000),
  status: z
    .enum(["queued", "opened_in_whatsapp", "marked_sent", "failed", "skipped", "not_attempted"])
    .default("opened_in_whatsapp"),
}).refine((value) => Boolean(value.recipientUserId) || Boolean(value.recipientPhone), {
  message: "Either recipientUserId or recipientPhone is required",
});

export const communicationStatusUpdateSchema = z.object({
  status: z.enum(["queued", "opened_in_whatsapp", "marked_sent", "failed", "skipped", "not_attempted"]),
  failureReason: z.string().max(500).optional(),
});

export const sessionCreateSchema = z.object({
  batchId: z.string().min(1),
  title: z.string().min(1).max(150),
  topic: z.string().max(500).optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  meetingLink: z.string().url().optional(),
});

export const attendanceMarkSchema = z.object({
  sessionId: z.string().min(1),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(["present", "absent", "late"]),
      remarks: z.string().max(500).optional(),
    }),
  ).min(1),
});

export const couponUpsertSchema = z.object({
  code: z.string().min(3).max(30).transform((value) => value.toUpperCase().trim()),
  title: z.string().min(1).max(120),
  discountType: z.enum(["flat", "percentage"]),
  discountValue: z.number().positive(),
  minimumAmount: z.number().nonnegative().optional(),
  maxDiscountAmount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().optional(),
  applicableCourses: z.array(z.string()).optional(),
  applicableBatches: z.array(z.string()).optional(),
  firstPaymentOnly: z.boolean().optional(),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const referralCodeUpsertSchema = z.object({
  code: z.string().min(3).max(30).transform((value) => value.toUpperCase().trim()),
  ownerUserId: z.string().min(1),
  title: z.string().max(120).optional(),
  usageLimit: z.number().int().positive().optional(),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
  rewardDiscountType: z.enum(["flat", "percentage", ""]).optional(),
  rewardDiscountValue: z.number().nonnegative().optional(),
});

export const adminReferralRewardSchema = z.object({
  referralEventId: z.string().min(1, "Referral event ID is required"),
  referrerApplicationId: z.string().min(1, "Referrer application ID is required"),
});

export const adminCreateReferralSchema = z.object({
  referrerEmail: z.string().email("Valid referrer email is required"),
  refereeEmail: z.string().email("Valid referee email is required"),
  discountType: z.enum(["flat", "percentage"]),
  discountValue: z.number().positive("Discount value must be positive"),
  details: z.string().max(500).optional(),
});

export const pipelineStageUpsertSchema = z.object({
  name: z.string().min(1).max(120),
  key: z.string().min(1).max(80).regex(/^[a-z0-9_]+$/),
  order: z.number().int().nonnegative(),
  color: z.string().min(4).max(20).optional(),
  isFinal: z.boolean().optional(),
  isConversionStage: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const leadCreateSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  type: leadTypeEnum.optional(),
  status: leadStatusEnum.optional(),
  source: z
    .enum(["facebook_ads", "google_ads", "organic", "referral", "walk_in", "whatsapp", "website", "other", "general"])
    .optional(),
  campaign: z.string().max(200).optional(),
  adSet: z.string().max(200).optional(),
  adId: z.string().max(200).optional(),
  landingPage: z.string().max(500).optional(),
  interestCourseIds: z.array(z.string()).max(20).optional(),
  interestCourseId: z.string().optional(),
  interestPercentage: z.number().int().min(0).max(100).optional(),
  assignedTo: z.string().optional(),
  notes: z.string().max(2000).optional(),
  nextFollowUpAt: z.preprocess((v) => (v === "" || v === null ? undefined : v), z.coerce.date().optional()),
  message: z.string().max(2000).optional(),
  tags: z.array(z.string().max(50)).max(30).optional(),
  temperature: z.enum(["hot", "warm", "cold"]).optional(),
});

export const leadUpdateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  type: leadTypeEnum.optional(),
  status: leadStatusEnum.optional(),
  source: z
    .enum(["facebook_ads", "google_ads", "organic", "referral", "walk_in", "whatsapp", "website", "other", "general"])
    .optional(),
  campaign: z.string().max(200).optional(),
  adSet: z.string().max(200).optional(),
  adId: z.string().max(200).optional(),
  landingPage: z.string().max(500).optional(),
  interestCourseIds: z.array(z.string()).max(20).optional(),
  interestPercentage: z.number().int().min(0).max(100).nullable().optional(),
  assignedTo: z.string().nullable().optional(),
  notes: z.string().max(2000).optional(),
  nextFollowUpAt: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.date().nullable().optional()),
  followUpStatus: z.enum(["not_scheduled", "scheduled", "completed", "overdue"]).optional(),
  lastContactedAt: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.date().nullable().optional()),
  temperature: z.enum(["hot", "warm", "cold"]).optional(),
  tags: z.array(z.string().max(50)).max(30).optional(),
});

export const leadActivityCreateSchema = z.object({
  type: z.enum(["call", "whatsapp", "meeting", "note", "email", "followup_note"]),
  message: z.string().min(1).max(4000),
});

export const leadConvertSchema = z.object({
  courseId: z.string().min(1),
  studentId: z.string().optional(),
});
