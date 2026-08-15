import { notFound } from "next/navigation";
import type { MemoryCategory } from "@/types";
import { MemorySection } from "@/components/memory/MemorySection";
import { getRequestContext } from "@/lib/auth/context";
import { getAgent } from "@/services/agents/agentService";
import { memoryService } from "@/services/memory/memoryService";

const CATEGORIES: MemoryCategory[] = ["company", "client", "candidate", "market", "performance"];

export default async function AgentMemoryPage({ params }: { params: { agentId: string } }) {
  const ctx = await getRequestContext();
  const agent = await getAgent(ctx, params.agentId);
  if (!agent) notFound();

  const memory = await memoryService.getMemoryForAgent(agent.id);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          {agent.name} · Memory
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Agent Memory</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Placeholder UI over a service interface designed for a future pgvector-backed
          implementation — see docs/architecture/04-ai-and-agents.md#m-memory-architecture.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CATEGORIES.map((category) => (
          <MemorySection key={category} category={category} items={memory[category] ?? []} />
        ))}
      </div>
    </div>
  );
}
