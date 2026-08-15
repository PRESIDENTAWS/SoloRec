import Link from "next/link";
import { Contact as ContactIcon } from "lucide-react";
import { getRequestContext } from "@/lib/auth/context";
import { listContacts } from "@/services/recruiting/contactService";
import { listCompanies } from "@/services/recruiting/companyService";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function ContactsPage() {
  const ctx = await getRequestContext();
  const [contacts, companies] = await Promise.all([listContacts(ctx), listCompanies(ctx)]);
  const companyNameById = new Map(companies.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
            Recruiting
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Contacts</h1>
        </div>
        <LinkButton href="/contacts/new" variant="primary">
          + New Contact
        </LinkButton>
      </div>

      {contacts.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <ContactIcon size={28} className="text-slate-600" aria-hidden="true" />
          <p className="text-sm text-slate-400">No contacts yet.</p>
          <LinkButton href="/contacts/new" variant="secondary">
            Add your first contact
          </LinkButton>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-base-line text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-line">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="text-slate-300">
                    <td className="px-5 py-3">
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="font-semibold text-slate-100 hover:text-accent-blue-soft"
                      >
                        {contact.first_name} {contact.last_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{contact.title ?? "—"}</td>
                    <td className="px-4 py-3">
                      {contact.company_id ? companyNameById.get(contact.company_id) ?? "—" : "—"}
                    </td>
                    <td className="px-4 py-3">{contact.email ?? "—"}</td>
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
