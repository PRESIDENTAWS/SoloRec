import Link from "next/link";
import { Building2 } from "lucide-react";
import { getRequestContext } from "@/lib/auth/context";
import { listCompanies } from "@/services/recruiting/companyService";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function CompaniesPage() {
  const ctx = await getRequestContext();
  const companies = await listCompanies(ctx);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
            Recruiting
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Companies</h1>
        </div>
        <LinkButton href="/companies/new" variant="primary">
          + New Company
        </LinkButton>
      </div>

      {companies.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <Building2 size={28} className="text-slate-600" aria-hidden="true" />
          <p className="text-sm text-slate-400">No companies yet.</p>
          <LinkButton href="/companies/new" variant="secondary">
            Add your first company
          </LinkButton>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-base-line text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Industry</th>
                  <th className="px-4 py-3 font-medium">Headquarters</th>
                  <th className="px-4 py-3 font-medium">Employees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-line">
                {companies.map((company) => (
                  <tr key={company.id} className="text-slate-300">
                    <td className="px-5 py-3">
                      <Link
                        href={`/companies/${company.id}`}
                        className="font-semibold text-slate-100 hover:text-accent-blue-soft"
                      >
                        {company.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{company.industry ?? "—"}</td>
                    <td className="px-4 py-3">{company.headquarters ?? "—"}</td>
                    <td className="px-4 py-3">{company.employee_count ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
