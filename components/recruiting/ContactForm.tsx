"use client";

import { useFormState } from "react-dom";
import { Field } from "@/components/auth/Field";
import { FormError } from "@/components/ui/FormMessages";
import { SubmitButton } from "@/components/auth/SubmitButton";
import type { Contact } from "@/services/recruiting/contactService";
import type { Company } from "@/services/recruiting/companyService";
import type { ContactFormState } from "@/app/(app)/contacts/actions";

const initialState: ContactFormState = { error: null };
const selectClass =
  "w-full rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-100 focus:border-accent-blue-soft focus:outline-none focus:ring-1 focus:ring-accent-blue-soft";

export function ContactForm({
  action,
  defaultValues,
  companies,
  submitLabel
}: {
  action: (state: ContactFormState, formData: FormData) => Promise<ContactFormState>;
  defaultValues?: Partial<Contact>;
  companies: Pick<Company, "id" | "name">[];
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" defaultValue={defaultValues?.first_name} required />
        <Field label="Last name" name="lastName" defaultValue={defaultValues?.last_name} required />
      </div>
      <div>
        <label
          htmlFor="companyId"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          Company
        </label>
        <select
          id="companyId"
          name="companyId"
          defaultValue={defaultValues?.company_id ?? ""}
          className={selectClass}
        >
          <option value="">No company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={defaultValues?.title ?? ""} />
        <Field label="Email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
        <Field label="Phone" name="phone" defaultValue={defaultValues?.phone ?? ""} />
        <Field label="LinkedIn URL" name="linkedinUrl" defaultValue={defaultValues?.linkedin_url ?? ""} />
      </div>
      <div>
        <label htmlFor="notes" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaultValues?.notes ?? ""}
          className="w-full rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-100 focus:border-accent-blue-soft focus:outline-none focus:ring-1 focus:ring-accent-blue-soft"
        />
      </div>
      <FormError message={state.error} />
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
