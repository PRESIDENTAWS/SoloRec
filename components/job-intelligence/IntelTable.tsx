import { Flame } from "lucide-react";
import type { JobIntelRow } from "@/services/recruiting/jobIntelligenceService";
import { Card } from "@/components/ui/Card";
import { ScoreBadge } from "@/components/job-intelligence/ScoreBadge";

/**
 * The core intelligence table: one row per canonical job, ranked by staffing
 * opportunity, with all three scores side by side. The action row beneath each
 * job (View Job / View Company / Find Hiring Manager / Generate Outreach / Add
 * to BD Pipeline) is the money workflow — surfaced here as the intended next
 * steps, wired up as those features land.
 */
const ACTIONS = ["View Job", "View Company", "Find Hiring Manager", "Generate Outreach", "Add to BD Pipeline"];

export function IntelTable({ rows }: { rows: JobIntelRow[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-base-line text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium">Ghost</th>
              <th className="px-4 py-3 font-medium">Hiring</th>
              <th className="px-4 py-3 font-medium">Opportunity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-line">
            {rows.map((row) => (
              <tr key={row.jobId} className="text-slate-300">
                <td className="px-5 py-3 font-semibold text-slate-100">{row.company}</td>
                <td className="px-4 py-3">
                  <div>{row.title}</div>
                  {row.location ? (
                    <div className="text-xs text-slate-500">{row.location}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <ScoreBadge kind="ghost" score={row.ghostRisk} />
                </td>
                <td className="px-4 py-3">
                  <ScoreBadge kind="hiring" score={row.hiringProbability} />
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <ScoreBadge kind="opportunity" score={row.staffingOpportunity} />
                    {row.isHotLead ? (
                      <Flame size={14} className="text-accent-purple-soft" aria-label="Hot lead" />
                    ) : null}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-base-line px-5 py-3">
        {ACTIONS.map((action) => (
          <span
            key={action}
            className="rounded-lg border border-base-line bg-base-panel2 px-3 py-1.5 text-xs font-medium text-slate-400"
          >
            {action}
          </span>
        ))}
      </div>
    </Card>
  );
}
