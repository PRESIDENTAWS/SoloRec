import { Card } from "@/components/ui/Card";

interface FunnelStage {
  stage: string;
  count: number;
}

export function SourcingFunnel({ stages }: { stages: FunnelStage[] }) {
  const max = stages[0]?.count ?? 1;

  return (
    <Card>
      <ul className="space-y-3 p-5">
        {stages.map((stage) => (
          <li key={stage.stage}>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
              <span>{stage.stage}</span>
              <span className="font-semibold text-slate-200">{stage.count.toLocaleString()}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-base-panel2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple"
                style={{ width: `${Math.max(4, (stage.count / max) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
