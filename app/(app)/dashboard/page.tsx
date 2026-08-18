import { Sparkles } from "lucide-react";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { Card, CardBody } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LinkButton } from "@/components/ui/LinkButton";
import { getRequestContext } from "@/lib/auth/context";
import { listAgents } from "@/services/agents/agentService";
import { listApprovals } from "@/services/agents/approvalDecisionService";
import { listRecentEvents } from "@/services/agents/agentEventService";
import { getDashboardMetrics, toKpiDefinitions } from "@/services/dashboard/metricsService";
import { createClient } from "@/lib/supabase/server";
import type { AgentEvent as FrontendAgentEvent, AgentEventType } from "@/types";

function toFrontendEventType(severity: string): AgentEventType {
  if (severity === "success") return "success";
  if (severity === "warning" || severity === "error") return "warning";
  return "info";
}

export default async function DashboardPage() {
  const ctx = await getRequestContext();
  const [agents, approvals, events, metrics] = await Promise.all([
    listAgents(ctx),
    listApprovals(ctx),
    listRecentEvents(ctx, 5),
    getDashboardMetrics(ctx)
  ]);

  const supabase = createClient();
  const { data: agentRows } = await supabase
    .from("agents")
    .select("id, agent_key")
    .eq("organization_id", ctx.organizationId);
  const agentNameByDbId = new Map(
    (agentRows ?? []).map((row) => [row.id, agents.find((a) => a.id === row.agent_key)?.name ?? row.agent_key])
  );

  const frontendEvents: FrontendAgentEvent[] = events.map((event) => ({
    id: event.id,
    agentId: event.agent_id ?? "system",
    agentName: event.agent_id ? (agentNameByDbId.get(event.agent_id) ?? "Agent") : "System",
    message: event.message,
    type: toFrontendEventType(event.severity),
    timestamp: event.created_at
  }));

  const working = agents.filter((a) => a.status === "working").length;
  const reviewRequired = agents.filter((a) => a.status === "review_required").length;
  const pendingApprovals = approvals.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
            Agency Overview
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Dashboard</h1>
        </div>
        <LinkButton href="/ai-hq" variant="primary">
          <Sparkles size={16} aria-hidden="true" />
          Open AI HQ
        </LinkButton>
      </div>

      <KpiRow kpis={toKpiDefinitions(metrics)} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <SectionHeader eyebrow="AI Workforce" title="Snapshot" />
          <CardBody className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Agents active</span>
              <span className="font-semibold text-slate-100">{agents.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Currently working</span>
              <span className="font-semibold text-accent-blue-soft">{working}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Needs review</span>
              <span className="font-semibold text-accent-purple-soft">{reviewRequired}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pending approvals</span>
              <span className="font-semibold text-status-review">{pendingApprovals}</span>
            </div>
            <LinkButton href="/ai-hq/agents" variant="secondary" className="mt-2 w-full">
              View all agents
            </LinkButton>
          </CardBody>
        </Card>

        <div className="lg:col-span-2">
          <SectionHeader eyebrow="Event Stream" title="Recent Activity" />
          <div className="mt-3">
            {frontendEvents.length === 0 ? (
              <Card>
                <CardBody className="text-sm text-slate-500">
                  No activity yet. Assign a job to AVA from a job's detail page to get started.
                </CardBody>
              </Card>
            ) : (
              <ActivityFeed events={frontendEvents} limit={5} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
