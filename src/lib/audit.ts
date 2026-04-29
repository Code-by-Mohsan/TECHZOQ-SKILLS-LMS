import AuditLog from "@/models/AuditLog";

export interface WriteAuditInput {
  actorUserId?: string | null;
  actorRole?: string | null;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  beforeState?: unknown;
  afterState?: unknown;
  success?: boolean;
  notes?: string;
  metadata?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

export function extractClientMeta(req: Request) {
  return {
    ipAddress:
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "",
    userAgent: req.headers.get("user-agent") || "",
  };
}

export async function writeAuditLog(input: WriteAuditInput) {
  return AuditLog.create({
    actorUserId: input.actorUserId ?? null,
    actorRole: input.actorRole ?? "unknown",
    action: input.action,
    module: input.module,
    entityType: input.entityType,
    entityId: input.entityId,
    beforeState: input.beforeState ?? null,
    afterState: input.afterState ?? null,
    success: input.success ?? true,
    notes: input.notes ?? "",
    metadata: input.metadata ?? null,
    ipAddress: input.ipAddress ?? "",
    userAgent: input.userAgent ?? "",
  });
}

