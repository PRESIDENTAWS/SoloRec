import Link from "next/link";
import { Briefcase } from "lucide-react";
import { getRequestContext } from "@/lib/auth/context";
import { listJobs } from "@/services/recruiting/jobService";
import { listCompanies } from "@/services/recruiting/companyService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { cn } from "@/lib/utils/cn";

const STATUS_CLASS: Record<string, string> = {
  draft: "bg-base-panel2 text-slate-400 border-base-line",
  open: "bg-accent-blue/15 text-accent-blue-soft border-accent-blue/30",
  on_hold: "bg-status-review/15 text-status-review border-status-review/30",
  filled: "bg-status-healthy/15 text-status-healthy border-status-healthy/30",
  closed: "bg-base-panel2 text-slate-500 border-base-line",
  cancelled: "bg-status-blocked/15 text-status-blocked border-status-blocked/30"
};

export default async function JobsPage() {
  const ctx = await getRequestContext();
  const [jobs, companies] = await Promise.all([listJobs(ctx), listCompanies(ctx)]);
  const companyNameById = new Map(companies.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
            Recruiting
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Jobs</h1>
        </div>
        <LinkButton href="/jobs/new" variant="primary">
          + New Job
        </LinkButton>
      </div>

      {jobs.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <Briefcase size={28} className="text-slate-600" aria-hidden="true" />
          <p className="text-sm text-slate-400">No jobs yet.</p>
          <LinkButton href="/jobs/new" variant="secondary">
            Create your first job
          </LinkButton>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-base-line text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-line">
                {jobs.map((job) => (
                  <tr key={job.id} className="text-slate-300">
                    <td className="px-5 py-3">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-semibold text-slate-100 hover:text-accent-blue-soft"
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {job.company_id ? companyNameById.get(job.company_id) ?? "—" : "—"}
                    </td>
                    <td className="px-4 py-3">{job.location ?? "—"}</td>
                    <td className="px-4 py-3 capitalize">{job.priority}</td>
                    <td className="px-4 py-3">
                      <Badge className={cn(STATUS_CLASS[job.status])}>{job.status.replace("_", " ")}</Badge>
                    </td>
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
