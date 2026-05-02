export const LEAD_TYPES = [
  "general",
  "course_inquiry",
  "demo",
  "counseling",
  "job",
  "internship",
  "cospace",
  "client",
] as const;

export const LEAD_STATUSES = [
  "lead",
  "interested",
  "not_interested",
  "enrolled",
  "converted",
] as const;

export const LEAD_SOURCES = [
  "facebook_ads",
  "google_ads",
  "organic",
  "referral",
  "walk_in",
  "whatsapp",
  "website",
  "other",
] as const;

/* ── Legacy pipeline stages (kept for backward compatibility, no longer used in CRM UI) ── */

export const DEFAULT_PIPELINE_STAGES = [
  { key: "new_lead", name: "New Lead", order: 10, color: "#3b82f6" },
  { key: "contacted", name: "Contacted", order: 20, color: "#06b6d4" },
  { key: "interested", name: "Interested", order: 30, color: "#14b8a6" },
  { key: "counseling_requested", name: "Counseling Requested", order: 35, color: "#0f766e" },
  { key: "demo_scheduled", name: "Demo Scheduled", order: 40, color: "#6366f1" },
  { key: "counseling_scheduled", name: "Counseling Scheduled", order: 45, color: "#7c3aed" },
  { key: "demo_attended", name: "Demo Attended", order: 50, color: "#8b5cf6" },
  { key: "counseling_completed", name: "Counseling Completed", order: 55, color: "#16a34a" },
  { key: "follow_up", name: "Follow-up Needed", order: 60, color: "#f59e0b" },
  { key: "application_started", name: "Application Started", order: 70, color: "#2563eb" },
  { key: "applied", name: "Applied", order: 80, color: "#0ea5e9" },
  { key: "payment_pending", name: "Payment Pending", order: 90, color: "#f97316" },
  { key: "enrolled", name: "Enrolled", order: 100, color: "#16a34a", isFinal: true, isConversionStage: true },
  { key: "not_interested", name: "Not Interested", order: 110, color: "#64748b", isFinal: true },
] as const;

export const DEFAULT_STAGE_BY_LEAD_TYPE: Record<string, string> = {
  general: "new_lead",
  course_inquiry: "new_lead",
  demo: "demo_scheduled",
  counseling: "counseling_requested",
};
