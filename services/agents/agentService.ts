import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { RequestContext } from "@/lib/auth/context";
import type { Agent, AgentStatus, AutonomyLevel } from "@/types/agent";

/**
 * Reads the real `agents` table (per-organization rows seeded at signup —
 * see lib/auth/bootstrap.ts) and adapts each row into the existing
 * frontend `Agent` shape the AI HQ UI already renders, enriched with live
 * counts from agent_tasks/approvals/agent_events. The frontend type and
 * components are unchanged from the mock-data scaffold; only where the
 * data comes from has changed — see docs/AI_AGENT_ARCHITECTURE.md.
 */

function toFrontendAgent(
  row: { agent_key: string; name: string; role: string; department: string; status: string; autonomy_level: number; health: number },
  extra: { currentTask: string; taskCount: number; approvalCount: number; lastAction: string }
): Agent {
  return {
    id: row.agent_key,
    name: row.name,
    role: row.role,
    department: row.department,
    status: row.status as AgentStatus,
    avatar: row.name.slice(0, 2).toUpperCase(),
    currentTask: extra.currentTask,
    autonomyLevel: row.autonomy_level as AutonomyLevel,
    health: row.health,
    lastAction: extra.lastAction,
    taskCount: extra.taskCount,
    approvalCount: extra.approvalCount,
    kpis: [],
    tools: [],
    permissions: []
  };
}

export async function listAgents(ctx: RequestContext): Promise<Agent[]> {
  const supabase = createClient();
  const { data: agents, error } = await supabase
    .from("agents")
    .select("id, agent_key, name, role, department, status, autonomy_level, health")
    .eq("organization_id", ctx.organizationId)
    .order("name");
  if (error) throw new Error(`Failed to list agents: ${error.message}`);
  if (!agents || agents.length === 0) return [];

  const [{ data: tasks }, { data: pendingApprovals }, { data: events }] = await Promise.all([
    supabase.from("agent_tasks").select("agent_id").eq("organization_id", ctx.organizationId),
    supabase
      .from("approvals")
      .select("agent_id")
      .eq("organization_id", ctx.organizationId)
      .eq("status", "pending"),
    supabase
      .from("agent_events")
      .select("agent_id, message")
      .eq("organization_id", ctx.organizationId)
      .order("created_at", { ascending: false })
      .limit(200)
  ]);

  return agents.map((row) => {
    const taskCount = (tasks ?? []).filter((t) => t.agent_id === row.id).length;
    const approvalCount = (pendingApprovals ?? []).filter((a) => a.agent_id === row.id).length;
    const latestEvent = (events ?? []).find((e) => e.agent_id === row.id);
    const lastAction = latestEvent?.message ?? "No activity yet";
    return toFrontendAgent(row, {
      currentTask: row.status === "idle" ? "Idle — no active task" : lastAction,
      taskCount,
      approvalCount,
      lastAction
    });
  });
}

export async function getAgent(ctx: RequestContext, agentKey: string): Promise<Agent | null> {
  const agents = await listAgents(ctx);
  return agents.find((agent) => agent.id === agentKey) ?? null;
}
