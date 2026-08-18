import { companyIntelligenceService } from "@/services/recruiting/companyIntelligenceService";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

function money(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export default async function CompaniesHiringPage() {
  const companies = await companyIntelligenceService.listCompanyIntelligence();

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Companies rolled up from their canonical jobs — hiring velocity, demand mix, and an
        estimated staffing opportunity range. One click from here becomes a BD opportunity.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {companies.map((company) => (
          <Card key={company.companyId}>
            <CardHeader className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-slate-50">{company.company}</div>
                {company.companyDomain ? (
                  <div className="text-xs text-slate-500">{company.companyDomain}</div>
                ) : null}
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">Hiring Score</div>
                <div className="text-xl font-bold text-accent-blue-soft">{company.hiringScore}</div>
              </div>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-semibold text-slate-100">{company.openJobs}</div>
                  <div className="text-xs text-slate-500">Open</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-100">{company.engineeringJobs}</div>
                  <div className="text-xs text-slate-500">Engineering</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-status-healthy">
                    {company.hiringAccelerationPct > 0 ? `+${company.hiringAccelerationPct}%` : "—"}
                  </div>
                  <div className="text-xs text-slate-500">Velocity</div>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Primary demand</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {company.primaryDemand.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-base-line bg-base-panel2 px-2 py-0.5 text-xs text-slate-300"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Hot locations</div>
                <div className="mt-1 text-sm text-slate-300">
                  {company.hotLocations.join(" · ") || "—"}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-base-line pt-3">
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Est. staffing opportunity
                </span>
                <span className="text-sm font-semibold text-status-healthy">
                  {money(company.staffingOpportunityMin)}–{money(company.staffingOpportunityMax)}
                </span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
