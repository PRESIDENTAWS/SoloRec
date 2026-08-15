import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestContext } from "@/lib/auth/context";
import { getJob, type JobStatus } from "@/services/recruiting/jobService";
import { getCompany } from "@/services/recruiting/companyService";
import { listCompanies } from "@/services/recruiting/companyService";
import { listApplicationsForJob } from "@/services/recruiting/applicationService";
import { listCandidatesNotOnJob } from "@/services/recruiting/candidateService";
import { listMatchesForJob } from "@/services/matching/candidateMatchService";
import { listEventsForEntity } from "@/services/agents/agentEventService";
import { NotFoundError } from "@/lib/errors";
import { Card, CardBody } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { JobForm } from "@/components/recruiting/JobForm";
import { AssignToAvaButton } from "@/components/recruiting/AssignToAvaButton";
import { AddCandidateToPipelineForm } from "@/components/recruiting/AddCandidateToPipelineForm";
import { JobStatusSelect } from "@/components/recruiting/JobStatusSelect";
import { updateJobAction } from "@/app/(app)/jobs/actions";
import { addCandidateToPipelineAction } from "@/app/(app)/jobs/[id]/actions";
import { cn } from "@/lib/utils/cn";

const SEVERITY_CLASS: Record<string, string> = {
  info: "text-accent-blue-soft",
  success: "text-status-healthy",
  warning: "text-status-review",
  error: "text-status-blocked"
};

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const ctx = await getRequestContext();

  let job;
  try {
    job = await getJob(ctx, params.id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const [company, companies, applications, matches, events, availableCandidates] = await Promise.all([
    job.company_id ? getCompany(ctx, job.company_id).catch(() => null) : Promise.resolve(null),
    listCompanies(ctx),
    listApplicationsForJob(ctx, job.id),
    listMatchesForJob(ctx, job.id),
    listEventsForEntity(ctx, "job", job.id),
    listCandidatesNotOnJob(ctx, job.id)
  ]);

  const matchByCandidateId = new Map(matches.map((m) => [m.candidate_id, m]));
  const boundUpdate = updateJobAction.bind(null, job.id);
  const boundAddCandidate = addCandidateToPipelineAction.bind(null, job.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">Job</div>
          <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">{job.title}</h1>
          {company && (
            <Link href={`/companies/${company.id}`} className="mt-1 inline-block text-sm text-slate-400 hover:text-accent-blue-soft">
              {company.name}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <JobStatusSelect jobId={job.id} currentStatus={job.status as JobStatus} />
          <AssignToAvaButton jobId={job.id} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card>
            <SectionHeader eyebrow="Overview · Requirements · Compensation · Client" title="Job Details" />
            <CardBody>
              <JobForm action={boundUpdate} defaultValues={job} companies={companies} submitLabel="Save changes" />
            </CardBody>
          </Card>

          <Card>
            <SectionHeader eyebrow="Pipeline" title={`Candidates (${applications.length})`} />
            <CardBody className="space-y-4">
              <AddCandidateToPipelineForm action={boundAddCandidate} availableCandidates={availableCandidates} />

              {applications.length === 0 ? (
                <p className="text-sm text-slate-500">No candidates in this job's pipeline yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-base-line text-xs uppercase tracking-wide text-slate-500">
                        <th className="py-2 pr-4 font-medium">Candidate</th>
                        <th className="py-2 pr-4 font-medium">Stage</th>
                        <th className="py-2 pr-4 font-medium">Match Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-line">
                      {applications.map((application) => {
                        const match = matchByCandidateId.get(application.candidate_id);
                        return (
                          <tr key={application.id} className="text-slate-300">
                            <td className="py-2 pr-4">
                              <Link
                                href={`/candidates/${application.candidate.id}`}
                                className="font-medium text-slate-100 hover:text-accent-blue-soft"
                              >
                                {application.candidate.first_name} {application.candidate.last_name}
                              </Link>
                            </td>
                            <td className="py-2 pr-4 capitalize">{application.stage.replace("_", " ")}</td>
                            <td className="py-2 pr-4">
                              {match ? (
                                <span className="font-semibold text-accent-blue-soft">{match.overall_score}%</span>
                              ) : (
                                <span className="text-slate-600">Not yet scored</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>

          {matches.length > 0 && (
            <Card>
              <SectionHeader eyebrow="AVA" title="Candidate Matches & Reasoning" />
              <CardBody className="space-y-3">
                {matches.map((match) => (
                  <div key={match.id} className="rounded-xl border border-base-line bg-base-panel2 p-4">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/candidates/${match.candidate.id}`}
                        className="font-semibold text-slate-100 hover:text-accent-blue-soft"
                      >
                        {match.candidate.first_name} {match.candidate.last_name}
                      </Link>
                      <span className="text-lg font-bold text-accent-blue-soft">{match.overall_score}%</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-500 sm:grid-cols-6">
                      <span>Skills {match.skills_score}</span>
                      <span>Exp {match.experience_score}</span>
                      <span>Location {match.location_score}</span>
                      <span>Comp {match.compensation_score}</span>
                      <span>Domain {match.domain_score}</span>
                      <span>AI {match.ai_score ?? "—"}</span>
                    </div>
                    {match.reasoning && (
                      <div className="mt-3 space-y-1.5 text-sm">
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
                ))}
              </CardBody>
            </Card>
          )}
        </div>

        <Card>
          <SectionHeader eyebrow="AI Activity" title="AVA on this Job" />
          <CardBody>
            {events.length === 0 ? (
              <p className="text-sm text-slate-500">
                No AI activity yet. Click "Assign to AVA" to have her evaluate candidates for this job.
              </p>
            ) : (
              <ul className="space-y-3">
                {events.map((event) => (
                  <li key={event.id} className="text-sm">
                    <span className={cn("font-medium", SEVERITY_CLASS[event.severity])}>●</span>{" "}
                    <span className="text-slate-300">{event.message}</span>
                    <div className="text-[11px] text-slate-600">
                      {new Date(event.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
