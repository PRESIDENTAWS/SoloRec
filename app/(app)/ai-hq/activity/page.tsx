import { getRequestContext } from "@/lib/auth/context";
import { listRecentEvents } from "@/services/agents/agentEventService";
import { listAgents } from "@/services/agents/agentService";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

const SEVERITY_DOT_CLASS: Record<string, string> = {
  info: "bg-accent-blue-soft",
  success: "bg-status-healthy",
  warning: "bg-status-review",
  error: "bg-status-blocked"
};

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default async function ActivityPage() {
  const ctx = await getRequestContext();
  const [events, agents] = await Promise.all([listRecentEvents(ctx), listAgents(ctx)]);

  const supabase = createClient();
  const { data: agentRows } = await supabase
    .from("agents")
    .select("id, agent_key")
    .eq("organization_id", ctx.organizationId);
  const agentNameByDbId = new Map(
    (agentRows ?? []).map((row) => [row.id, agents.find((a) => a.id === row.agent_key)?.name ?? row.agent_key])
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          AI Workforce
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Live Activity</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Real events recorded as agents work — task lifecycle, candidate evaluations, shortlists,
          and approval decisions. Updates automatically as new events arrive.
        </p>
      </div>

      {events.length === 0 ? (
        <Card>
          <div className="p-8 text-center text-sm text-slate-500">
            No activity yet. Assign a job to AVA to see her work show up here.
          </div>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-base-line">
            {events.map((event) => (
              <li key={event.id} className="flex items-start gap-3 px-5 py-4">
                <span
                  className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", SEVERITY_DOT_CLASS[event.severity])}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-200">
                    <span className="font-semibold text-slate-50">
                      {event.agent_id ? agentNameByDbId.get(event.agent_id) ?? "Agent" : "System"}
                    </span>{" "}
                    {event.message}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-slate-500">{formatTime(event.created_at)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
