import { jobIntelligenceService } from "@/services/recruiting/jobIntelligenceService";
import { IntelTable } from "@/components/job-intelligence/IntelTable";

export default async function RepostedJobsPage() {
  const rows = await jobIntelligenceService.listRepostedRows();

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Jobs SoloRec has seen reposted on at least one source. A single repost is normal churn;
        repeated reposts push ghost risk up and read as a stale evergreen listing.
      </p>
      <IntelTable rows={rows} />
    </div>
  );
}
