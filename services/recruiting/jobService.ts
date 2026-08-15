import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/authorization";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";
import { jobInputSchema, type JobInput } from "@/lib/validation/schemas";
import type { RequestContext } from "@/lib/auth/context";

export interface Job {
  id: string;
  organization_id: string;
  client_id: string | null;
  company_id: string | null;
  title: string;
  department: string | null;
  location: string | null;
  workplace_type: string;
  employment_type: string;
  description: string | null;
  requirements: string | null;
  preferred_qualifications: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  fee_percentage: number | null;
  status: string;
  priority: string;
  owner_user_id: string | null;
  opened_at: string | null;
  target_fill_date: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

const JOB_STATUSES = ["draft", "open", "on_hold", "filled", "closed", "cancelled"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

function toRow(input: JobInput) {
  return {
    company_id: input.companyId || null,
    title: input.title,
    department: input.department || null,
    location: input.location || null,
    workplace_type: input.workplaceType,
    employment_type: input.employmentType,
    description: input.description || null,
    requirements: input.requirements || null,
    preferred_qualifications: input.preferredQualifications || null,
    salary_min: input.salaryMin ?? null,
    salary_max: input.salaryMax ?? null,
    currency: input.currency,
    fee_percentage: input.feePercentage ?? null,
    priority: input.priority,
    ...(input.status ? { status: input.status } : {})
  };
}

export async function listJobs(ctx: RequestContext): Promise<Job[]> {
  await requirePermission(ctx, "job:read");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to list jobs: ${error.message}`);
  return data ?? [];
}

export async function getJob(ctx: RequestContext, id: string): Promise<Job> {
  await requirePermission(ctx, "job:read");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load job: ${error.message}`);
  if (!data) throw new NotFoundError("Job");
  return data;
}

export async function createJob(ctx: RequestContext, rawInput: unknown): Promise<Job> {
  await requirePermission(ctx, "job:create");
  const parsed = jobInputSchema.safeParse(rawInput);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      ...toRow(parsed.data),
      organization_id: ctx.organizationId,
      owner_user_id: ctx.userId,
      status: parsed.data.status ?? "draft"
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to create job: ${error?.message ?? "unknown error"}`);

  await recordAuditLog(ctx, { action: "job.created", entityType: "job", entityId: data.id, afterData: data });
  return data;
}

export async function updateJob(ctx: RequestContext, id: string, rawInput: unknown): Promise<Job> {
  await requirePermission(ctx, "job:update");
  const parsed = jobInputSchema.safeParse(rawInput);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");

  const before = await getJob(ctx, id);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .update(toRow(parsed.data))
    .eq("organization_id", ctx.organizationId)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to update job: ${error?.message ?? "unknown error"}`);

  await recordAuditLog(ctx, {
    action: "job.updated",
    entityType: "job",
    entityId: id,
    beforeData: before,
    afterData: data
  });
  return data;
}

export async function setJobStatus(ctx: RequestContext, id: string, status: JobStatus): Promise<Job> {
  await requirePermission(ctx, status === "closed" || status === "cancelled" ? "job:close" : "job:update");
  if (!JOB_STATUSES.includes(status)) throw new ValidationError(`Invalid job status: ${status}`);

  const before = await getJob(ctx, id);
  const supabase = createClient();
  const patch: { status: JobStatus; opened_at?: string; closed_at?: string } = { status };
  if (status === "open" && !before.opened_at) patch.opened_at = new Date().toISOString();
  if ((status === "closed" || status === "filled" || status === "cancelled") && !before.closed_at) {
    patch.closed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("jobs")
    .update(patch)
    .eq("organization_id", ctx.organizationId)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to update job status: ${error?.message ?? "unknown error"}`);

  await recordAuditLog(ctx, {
    action: "job.status_changed",
    entityType: "job",
    entityId: id,
    beforeData: { status: before.status },
    afterData: { status: data.status }
  });
  return data as Job;
}
