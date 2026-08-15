"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { FormError } from "@/components/ui/FormMessages";
import type { Candidate } from "@/services/recruiting/candidateService";
import type { JobDetailActionState } from "@/app/(app)/jobs/[id]/actions";

const initialState: JobDetailActionState = { error: null };
const selectClass =
  "w-full rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-100 focus:border-accent-blue-soft focus:outline-none focus:ring-1 focus:ring-accent-blue-soft";

export function AddCandidateToPipelineForm({
  action,
  availableCandidates
}: {
  action: (state: JobDetailActionState, formData: FormData) => Promise<JobDetailActionState>;
  availableCandidates: Pick<Candidate, "id" | "first_name" | "last_name" | "current_title">[];
}) {
  const [state, formAction] = useFormState(action, initialState);

  if (availableCandidates.length === 0) {
    return <p className="text-sm text-slate-500">Every candidate in your organization is already in this pipeline.</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1">
        <select id="candidateId" name="candidateId" defaultValue="" required className={selectClass}>
          <option value="" disabled>
            Choose a candidate…
          </option>
          {availableCandidates.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.first_name} {candidate.last_name}
              {candidate.current_title ? ` — ${candidate.current_title}` : ""}
            </option>
          ))}
        </select>
        <FormError message={state.error} />
      </div>
      <SubmitButton>Add to pipeline</SubmitButton>
    </form>
  );
}
