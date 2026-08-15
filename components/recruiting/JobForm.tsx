"use client";

import { useFormState } from "react-dom";
import { Field } from "@/components/auth/Field";
import { FormError } from "@/components/ui/FormMessages";
import { SubmitButton } from "@/components/auth/SubmitButton";
import type { Job } from "@/services/recruiting/jobService";
import type { Company } from "@/services/recruiting/companyService";
import type { JobFormState } from "@/app/(app)/jobs/actions";

const initialState: JobFormState = { error: null };
const inputClass =
  "w-full rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-blue-soft focus:outline-none focus:ring-1 focus:ring-accent-blue-soft";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500";

export function JobForm({
  action,
  defaultValues,
  companies,
  submitLabel
}: {
  action: (state: JobFormState, formData: FormData) => Promise<JobFormState>;
  defaultValues?: Partial<Job>;
  companies: Pick<Company, "id" | "name">[];
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Job title" name="title" defaultValue={defaultValues?.title} required />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="companyId" className={labelClass}>
            Company
          </label>
          <select id="companyId" name="companyId" defaultValue={defaultValues?.company_id ?? ""} className={inputClass}>
            <option value="">No company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <Field label="Department" name="department" defaultValue={defaultValues?.department ?? ""} />
        <Field label="Location" name="location" defaultValue={defaultValues?.location ?? ""} />
        <div>
          <label htmlFor="workplaceType" className={labelClass}>
            Workplace type
          </label>
          <select
            id="workplaceType"
            name="workplaceType"
            defaultValue={defaultValues?.workplace_type ?? "onsite"}
            className={inputClass}
          >
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>
        </div>
        <div>
          <label htmlFor="employmentType" className={labelClass}>
            Employment type
          </label>
          <select
            id="employmentType"
            name="employmentType"
            defaultValue={defaultValues?.employment_type ?? "direct_hire"}
            className={inputClass}
          >
            <option value="direct_hire">Direct hire</option>
            <option value="contract">Contract</option>
            <option value="contract_to_hire">Contract to hire</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority" className={labelClass}>
            Priority
          </label>
          <select id="priority" name="priority" defaultValue={defaultValues?.priority ?? "medium"} className={inputClass}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Salary min" name="salaryMin" type="number" min={0} defaultValue={defaultValues?.salary_min ?? ""} />
        <Field label="Salary max" name="salaryMax" type="number" min={0} defaultValue={defaultValues?.salary_max ?? ""} />
        <Field label="Fee %" name="feePercentage" type="number" min={0} max={100} step="0.5" defaultValue={defaultValues?.fee_percentage ?? ""} />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea id="description" name="description" rows={3} defaultValue={defaultValues?.description ?? ""} className={inputClass} />
      </div>
      <div>
        <label htmlFor="requirements" className={labelClass}>
          Requirements (one per line — required skills/qualifications)
        </label>
        <textarea
          id="requirements"
          name="requirements"
          rows={4}
          defaultValue={defaultValues?.requirements ?? ""}
          className={inputClass}
          placeholder={"AWS\nKubernetes\nTerraform\nCI/CD"}
        />
      </div>
      <div>
        <label htmlFor="preferredQualifications" className={labelClass}>
          Preferred qualifications (one per line)
        </label>
        <textarea
          id="preferredQualifications"
          name="preferredQualifications"
          rows={3}
          defaultValue={defaultValues?.preferred_qualifications ?? ""}
          className={inputClass}
        />
      </div>

      <FormError message={state.error} />
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
