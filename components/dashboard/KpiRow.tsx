import type { KpiDefinition } from "@/lib/data/mockKpis";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

const TONE_CLASS: Record<NonNullable<KpiDefinition["tone"]>, string> = {
  default: "text-slate-50",
  healthy: "text-status-healthy",
  review: "text-status-review",
  blocked: "text-status-blocked"
};

export function KpiRow({ kpis }: { kpis: KpiDefinition[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="px-4 py-4">
          <div className="text-xs font-medium text-slate-500">{kpi.label}</div>
          <div className={cn("mt-1 text-2xl font-bold", TONE_CLASS[kpi.tone ?? "default"])}>
            {kpi.value}
          </div>
        </Card>
      ))}
    </div>
  );
}
