"use server";

import { revalidatePath } from "next/cache";
import { getRequestContext } from "@/lib/auth/context";
import { createApplication } from "@/services/recruiting/applicationService";
import { runAvaCandidateMatching } from "@/services/agents/avaMatchingWorkflow";
import { toActionError } from "@/lib/actions/toActionError";

export type JobDetailActionState = { error: string | null };

export async function addCandidateToPipelineAction(
  jobId: string,
  _prevState: JobDetailActionState,
  formData: FormData
): Promise<JobDetailActionState> {
  const ctx = await getRequestContext();
  const candidateId = formData.get("candidateId");
  if (typeof candidateId !== "string" || !candidateId) {
    return { error: "Choose a candidate to add." };
  }
  try {
    await createApplication(ctx, { jobId, candidateId, stage: "sourced" });
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/pipeline");
  return { error: null };
}

export async function assignToAvaAction(jobId: string): Promise<{ error: string | null }> {
  const ctx = await getRequestContext();
  try {
    await runAvaCandidateMatching(ctx, jobId);
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/ai-hq");
  revalidatePath("/ai-hq/approvals");
  revalidatePath("/ai-hq/activity");
  return { error: null };
}
