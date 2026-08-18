import { getRequestContext } from "@/lib/auth/context";
import { listCompanies } from "@/services/recruiting/companyService";
import { Card, CardBody } from "@/components/ui/Card";
import { JobForm } from "@/components/recruiting/JobForm";
import { createJobAction } from "@/app/(app)/jobs/actions";

export default async function NewJobPage() {
  const ctx = await getRequestContext();
  const companies = await listCompanies(ctx);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          Recruiting
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">New Job</h1>
      </div>
      <div className="max-w-3xl">
        <Card>
          <CardBody>
            <JobForm action={createJobAction} companies={companies} submitLabel="Create job" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
