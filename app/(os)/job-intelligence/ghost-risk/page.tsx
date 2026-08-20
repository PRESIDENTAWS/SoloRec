import { ghostJobService } from "@/services/recruiting/ghostJobService";
import { Card } from "@/components/ui/Card";
import { ScoreBadge } from "@/components/job-intelligence/ScoreBadge";

export default async function GhostRiskPage() {
  const [jobs, rate] = await Promise.all([
    ghostJobService.listByGhostRisk("all"),
    ghostJobService.ghostRate()
  ]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Ghost Risk measures how likely a listing is stale or questionable — an aggregator-only,
        aged, reposted, or conflicting posting scores high. Portfolio ghost rate:{" "}
        <span className="font-semibold text-slate-200">{Math.round(rate * 100)}%</span>.
      </p>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-base-line text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Ghost</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-line">
              {jobs.map((job) => (
                <tr key={job.id} className="align-top text-slate-300">
                  <td className="px-5 py-3">
                    <ScoreBadge kind="ghost" score={job.scores.ghostRisk} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-100">{job.company}</td>
                  <td className="px-4 py-3">{job.title}</td>
                  <td className="px-4 py-3 capitalize">{job.status}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {job.scores.reasons.slice(0, 3).join(" · ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
