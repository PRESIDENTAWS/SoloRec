import { AgentCard } from "@/components/agents/AgentCard";
import { LinkButton } from "@/components/ui/LinkButton";
import { getRequestContext } from "@/lib/auth/context";
import { listAgents } from "@/services/agents/agentService";

export default async function AgentsPage() {
  const ctx = await getRequestContext();
  const agents = await listAgents(ctx);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
            AI Workforce
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Agents</h1>
        </div>
        <LinkButton href="/ai-hq/agents/new" variant="primary">
          + Deploy Agent
        </LinkButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
