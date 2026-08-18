import { Card, CardBody } from "@/components/ui/Card";
import { CompanyForm } from "@/components/recruiting/CompanyForm";
import { createCompanyAction } from "@/app/(app)/companies/actions";

export default function NewCompanyPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          Recruiting
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">New Company</h1>
      </div>
      <div className="max-w-2xl">
        <Card>
          <CardBody>
            <CompanyForm action={createCompanyAction} submitLabel="Create company" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
