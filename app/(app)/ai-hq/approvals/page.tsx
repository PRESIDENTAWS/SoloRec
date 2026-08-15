import { getRequestContext } from "@/lib/auth/context";
import { listApprovals } from "@/services/agents/approvalDecisionService";
import { listAgents } from "@/services/agents/agentService";
import { createClient } from "@/lib/supabase/server";
import { ApprovalCard } from "@/components/approvals/ApprovalCard";
import { Card, CardBody } from "@/components/ui/Card";

export default async function ApprovalsPage() {
  const ctx = await getRequestContext();
  const [approvals, agents] = await Promise.all([listApprovals(ctx), listAgents(ctx)]);

  // Approvals store agent_id (DB uuid); agents from agentService are keyed by
  // agent_key for the frontend Agent type — resolve names via a small lookup.
  const supabase = createClient();
  const { data: agentRows } = await supabase
    .from("agents")
    .select("id, agent_key")
    .eq("organization_id", ctx.organizationId);
  const agentNameByDbId = new Map(
    (agentRows ?? []).map((row) => [row.id, agents.find((a) => a.id === row.agent_key)?.name ?? row.agent_key])
  );

  const pending = approvals.filter((a) => a.status === "pending");
  const decided = approvals.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          AI Workforce
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Approval Center</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Every consequential AI action — candidate outreach, rejections, offer changes, contract
          exceptions — routes here before it executes.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <Card>
            <CardBody className="text-sm text-slate-500">No pending approvals.</CardBody>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {pending.map((approval) => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                agentName={approval.agent_id ? agentNameByDbId.get(approval.agent_id) ?? "Agent" : "System"}
              />
            ))}
          </div>
        )}
      </div>

      {decided.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Decided ({decided.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {decided.map((approval) => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                agentName={approval.agent_id ? agentNameByDbId.get(approval.agent_id) ?? "Agent" : "System"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
