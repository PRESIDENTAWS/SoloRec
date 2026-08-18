import { hiringSignalService } from "@/services/recruiting/hiringSignalService";
import { Card, CardBody } from "@/components/ui/Card";
import { ScoreBadge } from "@/components/job-intelligence/ScoreBadge";

export default async function HiringSignalsPage() {
  const [companySignals, jobSignals] = await Promise.all([
    hiringSignalService.listCompanySignals(),
    hiringSignalService.listJobSignals()
  ]);

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Company Momentum
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {companySignals.map((signal) => (
            <Card key={signal.companyId}>
              <CardBody className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-100">{signal.company}</div>
                  <div className="mt-1 text-xs text-slate-400">{signal.headline}</div>
                </div>
                {signal.hiringAccelerationPct > 0 ? (
                  <span className="shrink-0 rounded-md bg-status-healthy/15 px-2 py-1 text-xs font-semibold text-status-healthy">
                    +{signal.hiringAccelerationPct}%
                  </span>
                ) : null}
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Strongest Job Signals
        </div>
        <Card className="overflow-hidden">
          <ul className="divide-y divide-base-line">
            {jobSignals.map((signal) => (
              <li key={signal.jobId} className="flex items-start justify-between gap-4 px-5 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-100">
                    {signal.title} · {signal.company}
                  </div>
                  <div className="mt-1 truncate text-xs text-slate-400">
                    {signal.evidence.slice(0, 3).join(" · ") || "—"}
                  </div>
                </div>
                <ScoreBadge kind="hiring" score={signal.hiringProbability} />
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
