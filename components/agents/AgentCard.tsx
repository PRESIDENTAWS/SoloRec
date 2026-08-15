import Link from "next/link";
import type { Agent } from "@/types";
import { Card, CardBody } from "@/components/ui/Card";
import { AgentStatusBadge } from "@/components/agents/AgentStatusBadge";
import { AutonomyMeter } from "@/components/agents/AutonomyMeter";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link href={`/ai-hq/agents/${agent.id}`} className="block">
      <Card className="h-full transition hover:border-accent-blue-soft/40">
        <CardBody className="flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-blue/10 text-sm font-bold text-accent-blue-soft">
                {agent.avatar}
              </div>
              <div>
                <div className="font-semibold text-slate-50">{agent.name}</div>
                <div className="text-xs text-slate-500">{agent.department}</div>
              </div>
            </div>
            <AgentStatusBadge status={agent.status} />
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-600">
              Current assignment
            </div>
            <p className="mt-1 text-sm text-slate-300">{agent.currentTask}</p>
          </div>

          <AutonomyMeter level={agent.autonomyLevel} />

          <div className="mt-auto grid grid-cols-2 gap-2 pt-2 text-xs text-slate-500">
            <span>{agent.taskCount} tasks</span>
            <span className="text-right">{agent.approvalCount} pending approval</span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
