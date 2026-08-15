"use client";

import { useFormState } from "react-dom";
import { Field } from "@/components/auth/Field";
import { FormError } from "@/components/ui/FormMessages";
import { SubmitButton } from "@/components/auth/SubmitButton";
import type { Candidate } from "@/services/recruiting/candidateService";
import type { CandidateFormState } from "@/app/(app)/candidates/actions";

const initialState: CandidateFormState = { error: null };
const inputClass =
  "w-full rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-blue-soft focus:outline-none focus:ring-1 focus:ring-accent-blue-soft";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500";

export function CandidateForm({
  action,
  defaultValues,
  submitLabel
}: {
  action: (state: CandidateFormState, formData: FormData) => Promise<CandidateFormState>;
  defaultValues?: Partial<Candidate>;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" defaultValue={defaultValues?.first_name} required />
        <Field label="Last name" name="lastName" defaultValue={defaultValues?.last_name} required />
        <Field label="Current title" name="currentTitle" defaultValue={defaultValues?.current_title ?? ""} />
        <Field label="Current company" name="currentCompany" defaultValue={defaultValues?.current_company ?? ""} />
        <Field label="Location" name="location" defaultValue={defaultValues?.location ?? ""} />
        <Field
          label="Years of experience"
          name="yearsExperience"
          type="number"
          min={0}
          step="0.5"
          defaultValue={defaultValues?.years_experience ?? ""}
        />
        <Field label="Email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
        <Field label="Phone" name="phone" defaultValue={defaultValues?.phone ?? ""} />
        <Field label="LinkedIn URL" name="linkedinUrl" defaultValue={defaultValues?.linkedin_url ?? ""} />
        <Field
          label="Salary expectation"
          name="salaryExpectation"
          type="number"
          min={0}
          defaultValue={defaultValues?.salary_expectation ?? ""}
        />
      </div>

      <div>
        <label htmlFor="skills" className={labelClass}>
          Skills (comma-separated)
        </label>
        <input
          id="skills"
          name="skills"
          className={inputClass}
          defaultValue={defaultValues?.skills?.join(", ") ?? ""}
          placeholder="AWS, Kubernetes, Terraform, CI/CD"
        />
      </div>

      <div>
        <label htmlFor="summary" className={labelClass}>
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={3}
          defaultValue={defaultValues?.summary ?? ""}
          className={inputClass}
        />
      </div>

      <Field label="Source" name="source" defaultValue={defaultValues?.source ?? ""} placeholder="Referral, LinkedIn, …" />

      <FormError message={state.error} />
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
