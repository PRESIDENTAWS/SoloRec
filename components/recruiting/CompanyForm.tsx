"use client";

import { useFormState } from "react-dom";
import { Field } from "@/components/auth/Field";
import { FormError } from "@/components/ui/FormMessages";
import { SubmitButton } from "@/components/auth/SubmitButton";
import type { Company } from "@/services/recruiting/companyService";
import type { CompanyFormState } from "@/app/(app)/companies/actions";

const initialState: CompanyFormState = { error: null };

export function CompanyForm({
  action,
  defaultValues,
  submitLabel
}: {
  action: (state: CompanyFormState, formData: FormData) => Promise<CompanyFormState>;
  defaultValues?: Partial<Company>;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Company name" name="name" defaultValue={defaultValues?.name} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Website" name="website" defaultValue={defaultValues?.website ?? ""} placeholder="https://" />
        <Field label="Industry" name="industry" defaultValue={defaultValues?.industry ?? ""} />
        <Field
          label="Employee count"
          name="employeeCount"
          type="number"
          min={0}
          defaultValue={defaultValues?.employee_count ?? ""}
        />
        <Field label="Headquarters" name="headquarters" defaultValue={defaultValues?.headquarters ?? ""} />
      </div>
      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          className="w-full rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-blue-soft focus:outline-none focus:ring-1 focus:ring-accent-blue-soft"
        />
      </div>
      <FormError message={state.error} />
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
