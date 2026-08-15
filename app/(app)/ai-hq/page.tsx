import { KpiRow } from "@/components/dashboard/KpiRow";
import { CommandCenterClient } from "@/components/command-center/CommandCenterClient";
import { getRequestContext } from "@/lib/auth/context";
import { listAgents } from "@/services/agents/agentService";
import { getDashboardMetrics, toKpiDefinitions } from "@/services/dashboard/metricsService";

export default async function AiHqPage() {
  const ctx = await getRequestContext();
  const [agents, metrics] = await Promise.all([listAgents(ctx), getDashboardMetrics(ctx)]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          AI Workforce Operating System
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">AI HQ Command Center</h1>
      </div>

      <KpiRow kpis={toKpiDefinitions(metrics)} />

      <CommandCenterClient agents={agents} />
    </div>
  );
}
