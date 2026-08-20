import { notFound } from "next/navigation";
import { AgentDetailPanel } from "@/components/agents/AgentDetailPanel";
import { SourcingFunnel } from "@/components/recruiting/SourcingFunnel";
import { CandidateTable } from "@/components/recruiting/CandidateTable";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { agentService } from "@/services/agents/agentService";
import { candidateService } from "@/services/recruiting/candidateService";

export default async function AgentWorkspacePage({ params }: { params: { agentId: string } }) {
  const agent = await agentService.getAgent(params.agentId);
  if (!agent) notFound();

  const isAva = agent.id === "ava";
  const [funnel, candidates] = isAva
    ? await Promise.all([
        candidateService.getSourcingFunnel(agent.id),
        candidateService.listCandidatesForAgent(agent.id)
      ])
    : [[], []];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {isAva ? (
            <>
              <Card>
                <SectionHeader eyebrow="Current Assignment" title="Senior DevOps Engineer" />
                <CardBody className="text-sm text-slate-400">
                  Atlanta, GA · Client: Acme Technologies
                </CardBody>
              </Card>

              <div>
                <SectionHeader eyebrow="Sourcing" title="Funnel" />
                <div className="mt-3">
                  <SourcingFunnel stages={funnel} />
                </div>
              </div>

              <div>
                <SectionHeader eyebrow="Candidates" title="Sourced for This Role" />
                <div className="mt-3">
                  <CandidateTable candidates={candidates} />
                </div>
              </div>
            </>
          ) : (
            <Card>
              <CardBody className="py-10 text-center text-sm text-slate-500">
                A dedicated workspace for {agent.name} is not yet built in this starter — see
                docs/product/backlog.md.
              </CardBody>
            </Card>
          )}
        </div>

        <AgentDetailPanel agent={agent} />
      </div>
    </div>
  );
}
