import type { MarketPulse as MarketPulseData } from "@/services/recruiting/jobIntelligenceService";
import { Card } from "@/components/ui/Card";

const CELLS: Array<{ key: keyof MarketPulseData; label: string }> = [
  { key: "activeJobs", label: "Active Jobs" },
  { key: "newLast7Days", label: "New (7 days)" },
  { key: "highDemand", label: "High Demand" },
  { key: "hotAccounts", label: "Hot Accounts" }
];

export function MarketPulse({ pulse }: { pulse: MarketPulseData }) {
  return (
    <div>
      <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        Market Pulse
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CELLS.map((cell) => (
          <Card key={cell.key} className="px-4 py-4">
            <div className="text-2xl font-bold tabular-nums text-slate-50">{pulse[cell.key]}</div>
            <div className="mt-1 text-xs text-slate-400">{cell.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
