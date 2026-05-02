export interface DefaultRoleDef {
  key: string;
  name: string;
  description: string;
  isSystem: boolean;
}

export interface DefaultPermissionDef {
  key: string;
  name: string;
  module: string;
  description: string;
  isSystem: boolean;
}

export const DEFAULT_RBAC_ROLES: DefaultRoleDef[] = [
  { key: "super_admin", name: "Super Admin", description: "Full platform control", isSystem: true },
  { key: "admin", name: "Admin", description: "Institute operations admin", isSystem: true },
  { key: "counselor", name: "Counselor", description: "Admissions counselor", isSystem: true },
  { key: "finance_manager", name: "Finance Manager", description: "Finance lead", isSystem: true },
  { key: "finance_operator", name: "Finance Operator", description: "Finance operations", isSystem: true },
  { key: "instructor", name: "Instructor", description: "Teaching staff", isSystem: true },
  { key: "teaching_assistant", name: "Teaching Assistant", description: "Assistant teaching staff", isSystem: true },
  { key: "student", name: "Student", description: "Learner account", isSystem: true },
  { key: "marketing_agent", name: "Marketing Agent", description: "Growth and lead support", isSystem: true },
  { key: "referral_partner", name: "Referral Partner", description: "Partner referral actor", isSystem: true },
];

export const DEFAULT_RBAC_PERMISSIONS: DefaultPermissionDef[] = [
  { key: "report.view", name: "View Reports", module: "reports", description: "Can access reporting dashboards", isSystem: true },
  { key: "course.view", name: "View Courses", module: "courses", description: "Can list and view courses", isSystem: true },
  { key: "course.create", name: "Create Course", module: "courses", description: "Can create courses", isSystem: true },
  { key: "course.edit", name: "Edit Course", module: "courses", description: "Can update courses", isSystem: true },
  { key: "course.publish", name: "Publish Course", module: "courses", description: "Can publish/unpublish courses", isSystem: true },
  { key: "batch.view", name: "View Batches", module: "batches", description: "Can view batch records", isSystem: true },
  { key: "batch.create", name: "Create Batch", module: "batches", description: "Can create batches", isSystem: true },
  { key: "batch.assign_students", name: "Assign Batch Students", module: "batches", description: "Can assign students into batches", isSystem: true },
  { key: "enrollment.manage", name: "Manage Enrollments", module: "enrollments", description: "Can manage enrollments and transfers", isSystem: true },
  { key: "instructor.assign", name: "Assign Instructors", module: "batches", description: "Can assign instructors to batches", isSystem: true },
  { key: "application.review", name: "Review Applications", module: "applications", description: "Can review admissions applications", isSystem: true },
  { key: "application.approve", name: "Approve Applications", module: "applications", description: "Can approve/reject applications", isSystem: true },
  { key: "lead.manage", name: "Manage Leads", module: "leads", description: "Can manage lead pipeline and activities", isSystem: true },
  { key: "user.view", name: "View Users", module: "users", description: "Can view users", isSystem: true },
  { key: "user.role.assign", name: "Assign User Roles", module: "users", description: "Can assign/remove user roles", isSystem: true },
  { key: "finance.view", name: "View Finance", module: "finance", description: "Can view financial records", isSystem: true },
  { key: "payment.verify", name: "Verify Payments", module: "finance", description: "Can verify payments", isSystem: true },
  { key: "coupon.create", name: "Manage Coupons", module: "coupon", description: "Can create/update coupons", isSystem: true },
  { key: "referral.manage", name: "Manage Referrals", module: "referral", description: "Can manage referral codes/events", isSystem: true },
  { key: "communication.view", name: "View Communication", module: "communication", description: "Can view communication logs", isSystem: true },
  { key: "whatsapp.send", name: "Send WhatsApp", module: "communication", description: "Can trigger WhatsApp outreach", isSystem: true },
  { key: "attendance.manage", name: "Manage Attendance", module: "attendance", description: "Can manage sessions and attendance", isSystem: true },
  { key: "audit.view", name: "View Audit Logs", module: "audit", description: "Can view audit trails", isSystem: true },
  { key: "rbac.manage", name: "Manage RBAC", module: "rbac", description: "Can manage roles and permissions", isSystem: true },
];

export const DEFAULT_ROLE_PERMISSION_KEYS: Record<string, string[]> = {
  super_admin: ["*"],
  admin: [
    "report.view",
    "course.view",
    "course.create",
    "course.edit",
    "course.publish",
    "batch.view",
    "batch.create",
    "batch.assign_students",
    "enrollment.manage",
    "instructor.assign",
    "application.review",
    "application.approve",
    "lead.manage",
    "user.view",
    "user.role.assign",
    "finance.view",
    "payment.verify",
    "coupon.create",
    "referral.manage",
    "communication.view",
    "whatsapp.send",
    "attendance.manage",
    "audit.view",
    "rbac.manage",
  ],
  counselor: ["application.review", "application.approve", "lead.manage", "course.view", "batch.view", "batch.assign_students", "report.view", "referral.manage", "communication.view", "whatsapp.send"],
  finance_manager: ["finance.view", "payment.verify", "coupon.create", "report.view", "audit.view", "communication.view"],
  finance_operator: ["finance.view", "payment.verify"],
  instructor: ["course.view", "batch.view", "attendance.manage", "communication.view", "whatsapp.send"],
  teaching_assistant: ["course.view", "batch.view", "attendance.manage"],
  student: [],
  marketing_agent: ["application.review", "lead.manage", "report.view", "referral.manage", "communication.view", "whatsapp.send"],
  referral_partner: [],
};
