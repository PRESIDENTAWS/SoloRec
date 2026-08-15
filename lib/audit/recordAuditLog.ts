import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import type { RequestContext } from "@/lib/auth/context";

interface AuditLogInput {
  action: string;
  entityType: string;
  entityId?: string;
  beforeData?: unknown;
  afterData?: unknown;
  source?: string;
}

/**
 * Writes an audit_logs row via the service-role client — the regular
 * per-user client has no insert policy on audit_logs (see
 * supabase/migrations/20260815000004_agents_and_governance.sql), so this is
 * the only code path that can write one, which is what keeps the table
 * append-only in practice.
 *
 * Deliberately does not throw on failure: an audit-log write failing should
 * not roll back or fail the primary business action it's describing, but it
 * must not be silent either — logged server-side for operator visibility
 * (see docs/PRODUCT_ARCHITECTURE.md's observability section).
 */
export async function recordAuditLog(ctx: RequestContext, input: AuditLogInput): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("audit_logs").insert({
    organization_id: ctx.organizationId,
    actor_type: "user",
    actor_id: ctx.userId,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    before_data: (input.beforeData ?? null) as Json,
    after_data: (input.afterData ?? null) as Json,
    source: input.source ?? "app"
  });
  if (error) {
    console.error("[audit_log] write failed", {
      action: input.action,
      entityType: input.entityType,
      error: error.message
    });
  }
}

/** Same as recordAuditLog, but attributed to an agent rather than a user. */
export async function recordAgentAuditLog(
  organizationId: string,
  input: AuditLogInput & { agentKey: string }
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("audit_logs").insert({
    organization_id: organizationId,
    actor_type: "agent",
    actor_id: input.agentKey,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    before_data: (input.beforeData ?? null) as Json,
    after_data: (input.afterData ?? null) as Json,
    source: input.source ?? "agent"
  });
  if (error) {
    console.error("[audit_log] agent write failed", {
      action: input.action,
      entityType: input.entityType,
      error: error.message
    });
  }
}
