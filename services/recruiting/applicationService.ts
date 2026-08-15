import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/authorization";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";
import {
  applicationInputSchema,
  applicationStageSchema,
  type ApplicationInput
} from "@/lib/validation/schemas";
import type { RequestContext } from "@/lib/auth/context";
import type { z } from "zod";

export type ApplicationStage = z.infer<typeof applicationStageSchema>;

export interface Application {
  id: string;
  organization_id: string;
  job_id: string;
  candidate_id: string;
  stage: ApplicationStage;
  status: string;
  match_score: number | null;
  owner_user_id: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

/** Application joined with the candidate fields the pipeline board needs to render a card. */
export interface ApplicationWithCandidate extends Application {
  candidate: {
    id: string;
    first_name: string;
    last_name: string;
    current_title: string | null;
    current_company: string | null;
    location: string | null;
  };
}

/** Application joined with both candidate and job fields — for the org-wide pipeline board. */
export interface ApplicationWithCandidateAndJob extends ApplicationWithCandidate {
  job: { id: string; title: string };
}

export async function listAllApplications(ctx: RequestContext): Promise<ApplicationWithCandidateAndJob[]> {
  await requirePermission(ctx, "job:read");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(
      "*, candidate:candidates(id, first_name, last_name, current_title, current_company, location), job:jobs(id, title)"
    )
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to list applications: ${error.message}`);
  return (data ?? []) as unknown as ApplicationWithCandidateAndJob[];
}

export async function listApplicationsForJob(
  ctx: RequestContext,
  jobId: string
): Promise<ApplicationWithCandidate[]> {
  await requirePermission(ctx, "job:read");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(
      "*, candidate:candidates(id, first_name, last_name, current_title, current_company, location)"
    )
    .eq("organization_id", ctx.organizationId)
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to list applications: ${error.message}`);
  return (data ?? []) as unknown as ApplicationWithCandidate[];
}

export async function createApplication(ctx: RequestContext, rawInput: unknown): Promise<Application> {
  await requirePermission(ctx, "job:update");
  const parsed = applicationInputSchema.safeParse(rawInput);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .insert({
      organization_id: ctx.organizationId,
      job_id: parsed.data.jobId,
      candidate_id: parsed.data.candidateId,
      stage: parsed.data.stage,
      source: parsed.data.source || null,
      owner_user_id: ctx.userId
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new ConflictError("This candidate is already in the pipeline for this job.");
    }
    throw new Error(`Failed to add candidate to pipeline: ${error.message}`);
  }

  await recordAuditLog(ctx, {
    action: "application.created",
    entityType: "application",
    entityId: data.id,
    afterData: data
  });
  return data as unknown as Application;
}

export async function updateApplicationStage(
  ctx: RequestContext,
  applicationId: string,
  stage: ApplicationStage
): Promise<Application> {
  await requirePermission(ctx, "job:update");
  const parsedStage = applicationStageSchema.safeParse(stage);
  if (!parsedStage.success) throw new ValidationError("Invalid pipeline stage.");

  const supabase = createClient();
  const { data: before, error: beforeError } = await supabase
    .from("applications")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .eq("id", applicationId)
    .maybeSingle();
  if (beforeError) throw new Error(`Failed to load application: ${beforeError.message}`);
  if (!before) throw new NotFoundError("Application");

  const { data, error } = await supabase
    .from("applications")
    .update({ stage: parsedStage.data })
    .eq("organization_id", ctx.organizationId)
    .eq("id", applicationId)
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to update pipeline stage: ${error?.message ?? "unknown error"}`);

  await recordAuditLog(ctx, {
    action: "application.stage_changed",
    entityType: "application",
    entityId: applicationId,
    beforeData: { stage: before.stage },
    afterData: { stage: data.stage }
  });
  return data as unknown as Application;
}
