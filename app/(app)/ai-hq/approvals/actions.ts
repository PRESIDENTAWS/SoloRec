"use server";

import { revalidatePath } from "next/cache";
import { getRequestContext } from "@/lib/auth/context";
import { decideApproval } from "@/services/agents/approvalDecisionService";
import { toActionError } from "@/lib/actions/toActionError";

export async function decideApprovalAction(
  approvalId: string,
  decision: "approved" | "rejected"
): Promise<{ error: string | null }> {
  const ctx = await getRequestContext();
  try {
    await decideApproval(ctx, approvalId, decision);
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath("/ai-hq/approvals");
  revalidatePath("/ai-hq");
  revalidatePath("/ai-hq/activity");
  revalidatePath("/dashboard");
  return { error: null };
}
