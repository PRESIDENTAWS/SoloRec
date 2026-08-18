import { getRequestContext } from "@/lib/auth/context";
import { listCompanies } from "@/services/recruiting/companyService";
import { Card, CardBody } from "@/components/ui/Card";
import { ContactForm } from "@/components/recruiting/ContactForm";
import { createContactAction } from "@/app/(app)/contacts/actions";

export default async function NewContactPage() {
  const ctx = await getRequestContext();
  const companies = await listCompanies(ctx);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          Recruiting
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">New Contact</h1>
      </div>
      <div className="max-w-2xl">
        <Card>
          <CardBody>
            <ContactForm action={createContactAction} companies={companies} submitLabel="Create contact" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
