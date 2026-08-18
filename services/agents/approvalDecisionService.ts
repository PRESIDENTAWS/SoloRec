import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/authorization";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";
import type { RequestContext } from "@/lib/auth/context";

export interface Approval {
  id: string;
  organization_id: string;
  agent_id: string | null;
  agent_task_id: string | null;
  action_type: string;
  status: string;
  risk_level: string;
  reason: string | null;
  payload: Record<string, unknown>;
  requested_at: string;
  decided_at: string | null;
  decided_by_user_id: string | null;
  decision_notes: string | null;
  created_at: string;
}

interface OutreachPayload {
  jobId?: string;
  jobTitle?: string;
  candidates?: Array<{ candidateId: string; name: string; overallScore: number }>;
}

export async function listApprovals(ctx: RequestContext): Promise<Approval[]> {
  await requirePermission(ctx, "approval:decide");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("approvals")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .order("requested_at", { ascending: false });
  if (error) throw new Error(`Failed to list approvals: ${error.message}`);
  return (data ?? []) as unknown as Approval[];
}

/**
 * Decides a pending approval. On approval of a `candidate_outreach`
 * request, this authorizes creation of a draft task rather than actually
 * sending email — per this sprint's scope, AVA never sends outreach
 * directly; a human still has to write and send it. That's still the full
 * governance loop (propose → human decides → recorded), just without an
 * email-sending integration this sprint.
 */
export async function decideApproval(
  ctx: RequestContext,
  approvalId: string,
  decision: "approved" | "rejected",
  notes?: string
): Promise<Approval> {
  await requirePermission(ctx, "approval:decide");

  const admin = createAdminClient();
  const { data: approval, error: fetchError } = await admin
    .from("approvals")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .eq("id", approvalId)
    .maybeSingle();
  if (fetchError) throw new Error(`Failed to load approval: ${fetchError.message}`);
  if (!approval) throw new NotFoundError("Approval");
  if (approval.status !== "pending") {
    throw new ValidationError(`This approval has already been ${approval.status}.`);
  }

  const { data: updated, error: updateError } = await admin
    .from("approvals")
    .update({
      status: decision,
      decided_at: new Date().toISOString(),
      decided_by_user_id: ctx.userId,
      decision_notes: notes || null
    })
    .eq("id", approvalId)
    .select("*")
    .single();
  if (updateError || !updated) {
    throw new Error(`Failed to record decision: ${updateError?.message ?? "unknown error"}`);
  }

  await admin.from("agent_events").insert({
    organization_id: ctx.organizationId,
    agent_id: approval.agent_id,
    agent_task_id: approval.agent_task_id,
    event_type: decision === "approved" ? "approval.approved" : "approval.rejected",
    severity: decision === "approved" ? "success" : "warning",
    message: `${decision === "approved" ? "Approved" : "Rejected"}: ${approval.reason ?? approval.action_type}`,
    payload: { approvalId, decidedBy: ctx.userId }
  });

  await recordAuditLog(ctx, {
    action: `approval.${decision}`,
    entityType: "approval",
    entityId: approvalId,
    beforeData: { status: approval.status },
    afterData: { status: decision }
  });

  if (approval.agent_task_id) {
    await admin
      .from("agent_tasks")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", approval.agent_task_id)
      .eq("status", "waiting_for_approval");
  }
  if (approval.agent_id) {
    await admin.from("agents").update({ status: "idle" }).eq("id", approval.agent_id);
  }

  if (decision === "approved" && approval.action_type === "candidate_outreach") {
    const payload = approval.payload as OutreachPayload;
    const count = payload.candidates?.length ?? 0;
    await admin.from("tasks").insert({
      organization_id: ctx.organizationId,
      title: `Draft outreach to ${count} shortlisted candidate${count === 1 ? "" : "s"} for ${payload.jobTitle ?? "job"}`,
      description:
        "Approved from the AI HQ Approval Center. Draft and send outreach messages to the shortlisted " +
        "candidates listed on this task.",
      status: "open",
      priority: "medium",
      assigned_user_id: ctx.userId,
      related_entity_type: "job",
      related_entity_id: payload.jobId ?? null
    });
  }

  return updated as unknown as Approval;
}
