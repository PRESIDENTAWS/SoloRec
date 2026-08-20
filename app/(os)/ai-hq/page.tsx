import { AI_HQ_KPIS } from "@/lib/data/mockKpis";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { CommandCenterClient } from "@/components/command-center/CommandCenterClient";
import { agentService } from "@/services/agents/agentService";

export default async function AiHqPage() {
  const agents = await agentService.listAgents();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          AI Workforce Operating System
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">AI HQ Command Center</h1>
      </div>

      <KpiRow kpis={AI_HQ_KPIS} />

      <CommandCenterClient agents={agents} />
    </div>
  );
}
