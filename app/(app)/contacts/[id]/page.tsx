import { notFound } from "next/navigation";
import { getRequestContext } from "@/lib/auth/context";
import { getContact } from "@/services/recruiting/contactService";
import { listCompanies } from "@/services/recruiting/companyService";
import { NotFoundError } from "@/lib/errors";
import { Card, CardBody } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/recruiting/ContactForm";
import { updateContactAction } from "@/app/(app)/contacts/actions";

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const ctx = await getRequestContext();

  let contact;
  try {
    contact = await getContact(ctx, params.id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const companies = await listCompanies(ctx);
  const boundUpdate = updateContactAction.bind(null, contact.id);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">Contact</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">
          {contact.first_name} {contact.last_name}
        </h1>
      </div>

      <div className="max-w-2xl">
        <Card>
          <SectionHeader eyebrow="Details" title="Contact Overview" />
          <CardBody>
            <ContactForm action={boundUpdate} defaultValues={contact} companies={companies} submitLabel="Save changes" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
