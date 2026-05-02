export const PLATFORM_ROLES = [
  "super_admin",
  "admin",
  "counselor",
  "finance_manager",
  "finance_operator",
  "instructor",
  "teaching_assistant",
  "student",
  "marketing_agent",
  "referral_partner",
] as const;

export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export const ADMIN_PORTAL_ROLES: PlatformRole[] = [
  "super_admin",
  "admin",
  "counselor",
  "finance_manager",
  "finance_operator",
  "marketing_agent",
];

// Legacy role aliases supported during migration.
export const LEGACY_ROLE_ALIASES = {
  user: "student",
  tutor: "instructor",
} as const;

export type LegacyRole = keyof typeof LEGACY_ROLE_ALIASES;
export type SupportedRole = PlatformRole | LegacyRole;

export function normalizeRole(role: string | undefined | null): PlatformRole {
  if (!role) return "student";
  if (role in LEGACY_ROLE_ALIASES) {
    return LEGACY_ROLE_ALIASES[role as LegacyRole];
  }
  return PLATFORM_ROLES.includes(role as PlatformRole)
    ? (role as PlatformRole)
    : "student";
}

export function isAdminRole(role: string | undefined | null): boolean {
  const normalized = normalizeRole(role);
  return ADMIN_PORTAL_ROLES.includes(normalized);
}

export function canAccessStudentDashboard(
  role: string | undefined | null,
): boolean {
  const normalized = normalizeRole(role);
  return normalized === "student" || normalized === "instructor";
}
