import { notFound } from "next/navigation";
import { getRequestContext } from "@/lib/auth/context";
import { getCompany } from "@/services/recruiting/companyService";
import { listContacts } from "@/services/recruiting/contactService";
import { listJobs } from "@/services/recruiting/jobService";
import { NotFoundError } from "@/lib/errors";
import { Card, CardBody } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CompanyForm } from "@/components/recruiting/CompanyForm";
import { updateCompanyAction } from "@/app/(app)/companies/actions";
import Link from "next/link";

export default async function CompanyDetailPage({ params }: { params: { id: string } }) {
  const ctx = await getRequestContext();

  let company;
  try {
    company = await getCompany(ctx, params.id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const [contacts, jobs] = await Promise.all([listContacts(ctx, { companyId: company.id }), listJobs(ctx)]);
  const companyJobs = jobs.filter((job) => job.company_id === company.id);
  const boundUpdate = updateCompanyAction.bind(null, company.id);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">Company</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">{company.name}</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <SectionHeader eyebrow="Details" title="Company Overview" />
          <CardBody>
            <CompanyForm action={boundUpdate} defaultValues={company} submitLabel="Save changes" />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionHeader eyebrow="Contacts" title={`${contacts.length}`} />
            <CardBody className="space-y-2">
              {contacts.length === 0 ? (
                <p className="text-sm text-slate-500">No contacts yet.</p>
              ) : (
                contacts.map((contact) => (
                  <Link
                    key={contact.id}
                    href={`/contacts/${contact.id}`}
                    className="block rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-200 hover:border-accent-blue-soft/40"
                  >
                    {contact.first_name} {contact.last_name}
                    {contact.title && <span className="text-slate-500"> · {contact.title}</span>}
                  </Link>
                ))
              )}
            </CardBody>
          </Card>

          <Card>
            <SectionHeader eyebrow="Jobs" title={`${companyJobs.length}`} />
            <CardBody className="space-y-2">
              {companyJobs.length === 0 ? (
                <p className="text-sm text-slate-500">No jobs yet.</p>
              ) : (
                companyJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-200 hover:border-accent-blue-soft/40"
                  >
                    {job.title}
                    <span className="text-slate-500"> · {job.status}</span>
                  </Link>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
