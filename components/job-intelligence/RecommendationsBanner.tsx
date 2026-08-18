import { Flame } from "lucide-react";
import type { IntelRecommendation } from "@/services/recruiting/jobIntelligenceService";
import { Card } from "@/components/ui/Card";

function money(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export function RecommendationsBanner({
  recommendations
}: {
  recommendations: IntelRecommendation[];
}) {
  if (recommendations.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-base-line bg-accent-purple/10 px-5 py-3">
        <Flame size={16} className="text-accent-purple-soft" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-100">
          {recommendations.length} companies should be contacted today
        </span>
      </div>
      <ul className="divide-y divide-base-line">
        {recommendations.map((rec, i) => (
          <li key={rec.companyId} className="flex items-center justify-between gap-4 px-5 py-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-100">
                {i + 1}. {rec.company}
              </div>
              <div className="truncate text-xs text-slate-400">{rec.headline}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xs uppercase tracking-wide text-slate-500">Opportunity</div>
              <div className="text-sm font-semibold text-status-healthy">
                {money(rec.staffingOpportunityMin)}–{money(rec.staffingOpportunityMax)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
