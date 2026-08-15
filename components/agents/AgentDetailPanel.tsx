import type { Agent } from "@/types";
import { Card, CardBody } from "@/components/ui/Card";
import { AgentStatusBadge } from "@/components/agents/AgentStatusBadge";
import { AutonomyMeter } from "@/components/agents/AutonomyMeter";
import { AgentActionButtons } from "@/components/agents/AgentActionButtons";

export function AgentDetailPanel({ agent }: { agent: Agent }) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-blue-soft">
              {agent.department}
            </div>
            <h2 className="mt-1 text-2xl font-bold text-slate-50">{agent.name}</h2>
            <p className="text-sm text-slate-400">{agent.role}</p>
          </div>
          <AgentStatusBadge status={agent.status} />
        </div>

        <div className="rounded-xl border border-base-line bg-base-panel2 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-600">
            Current assignment
          </div>
          <p className="mt-1 text-sm text-slate-200">{agent.currentTask}</p>
          {agent.currentJob && <p className="mt-0.5 text-xs text-slate-500">{agent.currentJob}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {agent.kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-base-line bg-base-panel2 p-3">
              <div className="text-[11px] uppercase tracking-wide text-slate-600">{kpi.label}</div>
              <div className="mt-1 text-lg font-bold text-slate-50">{kpi.value}</div>
            </div>
          ))}
        </div>

        <AutonomyMeter level={agent.autonomyLevel} />

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-600">Tools</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {agent.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-base-line bg-base-panel2 px-2.5 py-1 text-[11px] text-slate-400"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-400">
          <div>
            <span className="block text-2xl font-bold text-slate-50">{agent.taskCount}</span>
            Tasks
          </div>
          <div>
            <span className="block text-2xl font-bold text-slate-50">{agent.approvalCount}</span>
            Pending approvals
          </div>
        </div>

        <AgentActionButtons agentId={agent.id} />
      </CardBody>
    </Card>
  );
}
