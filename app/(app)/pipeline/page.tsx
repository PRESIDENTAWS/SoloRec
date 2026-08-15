import { getRequestContext } from "@/lib/auth/context";
import { listAllApplications } from "@/services/recruiting/applicationService";
import { PipelineBoard } from "@/components/recruiting/PipelineBoard";
import { Card } from "@/components/ui/Card";
import { GitBranch } from "lucide-react";

export default async function PipelinePage() {
  const ctx = await getRequestContext();
  const applications = await listAllApplications(ctx);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          Recruiting
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Pipeline</h1>
        <p className="mt-1 text-sm text-slate-400">
          Every candidate currently in a job pipeline, across all jobs. Change a candidate's stage
          with the selector on their card — it saves immediately.
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <GitBranch size={28} className="text-slate-600" aria-hidden="true" />
          <p className="text-sm text-slate-400">
            No candidates in any pipeline yet. Add a candidate to a job's pipeline from the job
            detail page.
          </p>
        </Card>
      ) : (
        <PipelineBoard applications={applications} />
      )}
    </div>
  );
}
