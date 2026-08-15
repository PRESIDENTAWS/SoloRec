"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRequestContext } from "@/lib/auth/context";
import { createJob, updateJob, setJobStatus, type JobStatus } from "@/services/recruiting/jobService";
import { toActionError } from "@/lib/actions/toActionError";

export type JobFormState = { error: string | null };

function formToInput(formData: FormData) {
  return {
    title: formData.get("title"),
    companyId: formData.get("companyId") || undefined,
    department: formData.get("department"),
    location: formData.get("location"),
    workplaceType: formData.get("workplaceType") || "onsite",
    employmentType: formData.get("employmentType") || "direct_hire",
    description: formData.get("description"),
    requirements: formData.get("requirements"),
    preferredQualifications: formData.get("preferredQualifications"),
    salaryMin: formData.get("salaryMin") || undefined,
    salaryMax: formData.get("salaryMax") || undefined,
    currency: formData.get("currency") || "USD",
    feePercentage: formData.get("feePercentage") || undefined,
    priority: formData.get("priority") || "medium"
  };
}

export async function createJobAction(_prevState: JobFormState, formData: FormData): Promise<JobFormState> {
  const ctx = await getRequestContext();
  let jobId: string;
  try {
    const job = await createJob(ctx, formToInput(formData));
    jobId = job.id;
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath("/jobs");
  redirect(`/jobs/${jobId}`);
}

export async function updateJobAction(
  id: string,
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const ctx = await getRequestContext();
  try {
    await updateJob(ctx, id, formToInput(formData));
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/jobs");
  return { error: null };
}

export async function setJobStatusAction(id: string, status: JobStatus): Promise<void> {
  const ctx = await getRequestContext();
  await setJobStatus(ctx, id, status);
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/jobs");
}
