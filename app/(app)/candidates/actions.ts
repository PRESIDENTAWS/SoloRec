"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRequestContext } from "@/lib/auth/context";
import { createCandidate, updateCandidate } from "@/services/recruiting/candidateService";
import { toActionError } from "@/lib/actions/toActionError";

export type CandidateFormState = { error: string | null };

function formToInput(formData: FormData) {
  const skillsRaw = String(formData.get("skills") ?? "");
  return {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    currentTitle: formData.get("currentTitle"),
    currentCompany: formData.get("currentCompany"),
    linkedinUrl: formData.get("linkedinUrl"),
    yearsExperience: formData.get("yearsExperience") || undefined,
    salaryExpectation: formData.get("salaryExpectation") || undefined,
    currency: formData.get("currency") || "USD",
    summary: formData.get("summary"),
    skills: skillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    source: formData.get("source")
  };
}

export async function createCandidateAction(
  _prevState: CandidateFormState,
  formData: FormData
): Promise<CandidateFormState> {
  const ctx = await getRequestContext();
  let candidateId: string;
  try {
    const candidate = await createCandidate(ctx, formToInput(formData));
    candidateId = candidate.id;
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath("/candidates");
  redirect(`/candidates/${candidateId}`);
}

export async function updateCandidateAction(
  id: string,
  _prevState: CandidateFormState,
  formData: FormData
): Promise<CandidateFormState> {
  const ctx = await getRequestContext();
  try {
    await updateCandidate(ctx, id, formToInput(formData));
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath(`/candidates/${id}`);
  revalidatePath("/candidates");
  return { error: null };
}
