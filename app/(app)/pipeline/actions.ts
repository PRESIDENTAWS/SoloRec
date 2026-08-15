"use server";

import { revalidatePath } from "next/cache";
import { getRequestContext } from "@/lib/auth/context";
import { updateApplicationStage, type ApplicationStage } from "@/services/recruiting/applicationService";

export async function updateApplicationStageAction(applicationId: string, stage: ApplicationStage): Promise<void> {
  const ctx = await getRequestContext();
  await updateApplicationStage(ctx, applicationId, stage);
  revalidatePath("/pipeline");
  revalidatePath("/jobs");
}
