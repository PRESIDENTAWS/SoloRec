import { AgentBuilderForm } from "@/components/agents/AgentBuilderForm";

export default function NewAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          AI Workforce
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Agent Builder</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Configure a new agent. Creation is local/mock only in this starter — nothing is
          persisted to a backend yet.
        </p>
      </div>

      <div className="max-w-3xl">
        <AgentBuilderForm />
      </div>
    </div>
  );
}
