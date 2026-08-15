import type { AvaCandidateRow } from "@/lib/recruiting/mockCandidates";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

const STATUS_CLASS: Record<AvaCandidateRow["status"], string> = {
  shortlisted: "bg-base-panel2 text-slate-400 border-base-line",
  contacted: "bg-accent-blue/15 text-accent-blue-soft border-accent-blue/30",
  responded: "bg-accent-purple/15 text-accent-purple-soft border-accent-purple/30",
  interested: "bg-status-healthy/15 text-status-healthy border-status-healthy/30"
};

export function CandidateTable({ candidates }: { candidates: AvaCandidateRow[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-base-line text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Current Role</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Match Score</th>
              <th className="px-4 py-3 font-medium">Compensation</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-line">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="text-slate-300">
                <td className="px-5 py-3 font-semibold text-slate-100">{candidate.name}</td>
                <td className="px-4 py-3">{candidate.currentRole}</td>
                <td className="px-4 py-3">{candidate.company}</td>
                <td className="px-4 py-3">{candidate.location}</td>
                <td className="px-4 py-3">{candidate.experienceYears} yrs</td>
                <td className="px-4 py-3 font-semibold text-accent-blue-soft">
                  {candidate.matchScore}%
                </td>
                <td className="px-4 py-3">{candidate.compensation}</td>
                <td className="px-4 py-3">
                  <Badge className={cn(STATUS_CLASS[candidate.status])}>{candidate.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
