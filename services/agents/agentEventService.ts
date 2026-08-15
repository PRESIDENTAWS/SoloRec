import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { RequestContext } from "@/lib/auth/context";

export interface AgentEvent {
  id: string;
  agent_id: string | null;
  agent_task_id: string | null;
  event_type: string;
  severity: string;
  message: string;
  payload: Record<string, unknown>;
  created_at: string;
}

/** Events tied to agent_tasks whose related_entity_type/id match — e.g. every AVA event for one job. */
export async function listEventsForEntity(
  ctx: RequestContext,
  entityType: string,
  entityId: string,
  limit = 25
): Promise<AgentEvent[]> {
  const supabase = createClient();
  const { data: tasks, error: tasksError } = await supabase
    .from("agent_tasks")
    .select("id")
    .eq("organization_id", ctx.organizationId)
    .eq("related_entity_type", entityType)
    .eq("related_entity_id", entityId);
  if (tasksError) throw new Error(`Failed to list agent tasks: ${tasksError.message}`);

  const taskIds = (tasks ?? []).map((t) => t.id);
  if (taskIds.length === 0) return [];

  const { data, error } = await supabase
    .from("agent_events")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .in("agent_task_id", taskIds)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Failed to list agent events: ${error.message}`);
  return (data ?? []) as unknown as AgentEvent[];
}

export async function listRecentEvents(ctx: RequestContext, limit = 30): Promise<AgentEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agent_events")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Failed to list agent events: ${error.message}`);
  return (data ?? []) as unknown as AgentEvent[];
}
