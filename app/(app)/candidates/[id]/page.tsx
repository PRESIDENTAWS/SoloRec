import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestContext } from "@/lib/auth/context";
import { getCandidate } from "@/services/recruiting/candidateService";
import { listMatchesForCandidate } from "@/services/matching/candidateMatchService";
import { NotFoundError } from "@/lib/errors";
import { Card, CardBody } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CandidateForm } from "@/components/recruiting/CandidateForm";
import { updateCandidateAction } from "@/app/(app)/candidates/actions";

export default async function CandidateDetailPage({ params }: { params: { id: string } }) {
  const ctx = await getRequestContext();

  let candidate;
  try {
    candidate = await getCandidate(ctx, params.id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const matches = await listMatchesForCandidate(ctx, candidate.id);
  const boundUpdate = updateCandidateAction.bind(null, candidate.id);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">Candidate</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">
          {candidate.first_name} {candidate.last_name}
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <SectionHeader eyebrow="Details" title="Candidate Overview" />
          <CardBody>
            <CandidateForm action={boundUpdate} defaultValues={candidate} submitLabel="Save changes" />
          </CardBody>
        </Card>

        <Card>
          <SectionHeader eyebrow="AI Matching" title="Job Applications & Match Scores" />
          <CardBody className="space-y-2">
            {matches.length === 0 ? (
              <p className="text-sm text-slate-500">
                Not yet evaluated against any job. Match scores appear here once AVA runs candidate
                matching for a job this candidate is in the pipeline for.
              </p>
            ) : (
              matches.map((match) => (
                <Link
                  key={match.id}
                  href={`/jobs/${match.job_id}`}
                  className="flex items-center justify-between rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm hover:border-accent-blue-soft/40"
                >
                  <span className="text-slate-200">{match.job.title}</span>
                  <span className="font-semibold text-accent-blue-soft">{match.overall_score}%</span>
                </Link>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
