import Notification from "@/models/Notification";

type NotificationType =
  | "application_submitted"
  | "application_approved"
  | "application_rejected"
  | "fees_pending"
  | "fees_submitted"
  | "enrolled"
  | "batch_assigned"
  | "status_update"
  | "payment_submitted"
  | "payment_verified"
  | "payment_rejected"
  | "attendance_alert"
  | "communication_update"
  | "enrollment"
  | "quiz_passed"
  | "course_complete"
  | "certificate";

export async function createNotification(
  userId: string,
  message: string,
  type: NotificationType,
  link?: string,
  options?: {
    channel?: "in_app" | "email" | "whatsapp";
    metadata?: Record<string, unknown> | null;
  },
) {
  return Notification.create({
    user: userId,
    message,
    type,
    link,
    channel: options?.channel || "in_app",
    metadata: options?.metadata || null,
  });
}
