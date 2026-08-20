import { Card } from "@/components/ui/Card";

export interface Stat {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="px-4 py-4">
          <div className="text-2xl font-bold tabular-nums text-slate-50">{stat.value}</div>
          <div className="mt-1 text-xs text-slate-400">{stat.label}</div>
          {stat.hint ? <div className="mt-1 text-[11px] text-slate-500">{stat.hint}</div> : null}
        </Card>
      ))}
    </div>
  );
}
