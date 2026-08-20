import { jobIntelligenceService } from "@/services/recruiting/jobIntelligenceService";
import { IntelTable } from "@/components/job-intelligence/IntelTable";

export default async function NewJobsPage() {
  const rows = await jobIntelligenceService.listNewRows();

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Freshly detected openings — first seen within the last 7 days. Recency lifts hiring
        probability and is the strongest window for outreach.
      </p>
      <IntelTable rows={rows} />
    </div>
  );
}
