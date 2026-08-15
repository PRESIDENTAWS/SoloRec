import { notFound } from "next/navigation";
import { getRequestContext } from "@/lib/auth/context";
import { getAgent } from "@/services/agents/agentService";
import { getAvaWorkspaceSummary } from "@/services/agents/avaWorkspaceService";
import { listMatchesForJob } from "@/services/matching/candidateMatchService";
import { AgentDetailPanel } from "@/components/agents/AgentDetailPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";

export default async function AgentWorkspacePage({ params }: { params: { agentId: string } }) {
  const ctx = await getRequestContext();
  const agent = await getAgent(ctx, params.agentId);
  if (!agent) notFound();

  const isAva = agent.id === "ava";
  const summary = isAva ? await getAvaWorkspaceSummary(ctx) : null;
  const matches = isAva && summary?.jobId ? await listMatchesForJob(ctx, summary.jobId) : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {isAva ? (
            summary?.jobId ? (
              <>
                <Card>
                  <SectionHeader eyebrow="Current Assignment" title={summary.jobTitle ?? "Job"} />
                  <CardBody>
                    <Link href={`/jobs/${summary.jobId}`} className="text-sm text-accent-blue-soft hover:underline">
                      View job →
                    </Link>
                    <span className="ml-3 text-xs uppercase tracking-wide text-slate-500">
                      Task status: {summary.taskStatus?.replace("_", " ")}
                    </span>
                  </CardBody>
                </Card>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Candidates Evaluated", value: summary.candidatesEvaluated },
                    { label: "Shortlisted", value: summary.shortlisted },
                    { label: "Needs Review", value: summary.needsReview },
                    { label: "Avg Match Score", value: summary.averageMatchScore != null ? `${summary.averageMatchScore}%` : "—" }
                  ].map((stat) => (
                    <Card key={stat.label} className="px-4 py-4">
                      <div className="text-xs font-medium text-slate-500">{stat.label}</div>
                      <div className="mt-1 text-2xl font-bold text-slate-50">{stat.value}</div>
                    </Card>
                  ))}
                </div>

                <Card>
                  <SectionHeader eyebrow="Candidates" title="Match Results" />
                  <CardBody className="space-y-3">
                    {matches.length === 0 ? (
                      <p className="text-sm text-slate-500">No candidates scored yet.</p>
                    ) : (
                      matches.map((match) => (
                        <div key={match.id} className="rounded-xl border border-base-line bg-base-panel2 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Link
                                href={`/candidates/${match.candidate.id}`}
                                className="font-semibold text-slate-100 hover:text-accent-blue-soft"
                              >
                                {match.candidate.first_name} {match.candidate.last_name}
                              </Link>
                              <div className="text-xs text-slate-500">
                                {match.candidate.current_title ?? "—"} · {match.candidate.location ?? "—"} ·{" "}
                                {match.candidate.years_experience ?? "?"} yrs
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-accent-blue-soft">{match.overall_score}%</div>
                              {match.reasoning && (
                                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                                  {match.reasoning.recommendation}
                                </div>
                              )}
                            </div>
                          </div>
                          {match.reasoning && (
                            <div className="mt-2 space-y-1 text-sm">
                              <p className="text-slate-300">{match.reasoning.summary}</p>
                              {match.reasoning.strengths.length > 0 && (
                                <p className="text-xs text-status-healthy">+ {match.reasoning.strengths.join(" · ")}</p>
                              )}
                              {match.reasoning.concerns.length > 0 && (
                                <p className="text-xs text-status-review">- {match.reasoning.concerns.join(" · ")}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardBody>
                </Card>
              </>
            ) : (
              <Card>
                <CardBody className="py-10 text-center text-sm text-slate-500">
                  AVA hasn't run a candidate matching task yet. Open a job and click "Assign to AVA" to
                  get started.
                </CardBody>
              </Card>
            )
          ) : (
            <Card>
              <CardBody className="py-10 text-center text-sm text-slate-500">
                A dedicated workspace for {agent.name} is not yet built — see docs/product/backlog.md.
              </CardBody>
            </Card>
          )}
        </div>

        <AgentDetailPanel agent={agent} />
      </div>
    </div>
  );
}
