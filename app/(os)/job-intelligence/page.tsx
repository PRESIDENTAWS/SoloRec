import { jobIntelligenceService } from "@/services/recruiting/jobIntelligenceService";
import { MarketPulse } from "@/components/job-intelligence/MarketPulse";
import { RecommendationsBanner } from "@/components/job-intelligence/RecommendationsBanner";
import { IntelTable } from "@/components/job-intelligence/IntelTable";

export default async function JobIntelligenceOverviewPage() {
  const [pulse, recommendations, rows] = await Promise.all([
    jobIntelligenceService.getMarketPulse(),
    jobIntelligenceService.getRecommendations(),
    jobIntelligenceService.listIntelRows()
  ]);

  return (
    <div className="space-y-6">
      <MarketPulse pulse={pulse} />
      <RecommendationsBanner recommendations={recommendations} />
      <div>
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Ranked by Staffing Opportunity
        </div>
        <IntelTable rows={rows} />
      </div>
    </div>
  );
}
