import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/authorization";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";
import { candidateInputSchema, type CandidateInput } from "@/lib/validation/schemas";
import type { RequestContext } from "@/lib/auth/context";

export interface Candidate {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  current_title: string | null;
  current_company: string | null;
  linkedin_url: string | null;
  years_experience: number | null;
  salary_expectation: number | null;
  currency: string;
  summary: string | null;
  skills: string[];
  source: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

function toRow(input: CandidateInput) {
  return {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email || null,
    phone: input.phone || null,
    location: input.location || null,
    current_title: input.currentTitle || null,
    current_company: input.currentCompany || null,
    linkedin_url: input.linkedinUrl || null,
    years_experience: input.yearsExperience ?? null,
    salary_expectation: input.salaryExpectation ?? null,
    currency: input.currency,
    summary: input.summary || null,
    skills: input.skills,
    source: input.source || null
  };
}

export interface CandidateFilters {
  search?: string;
  status?: string;
}

/**
 * candidate:read_pii gates email/phone visibility, per
 * docs/architecture/03-security-and-tenancy.md's PII classification — a
 * role without it still gets the row, just with contact fields stripped,
 * rather than the whole candidate hidden.
 */
async function redactPiiIfNeeded<T extends Pick<Candidate, "email" | "phone">>(
  ctx: RequestContext,
  rows: T[]
): Promise<T[]> {
  const { hasPermission } = await import("@/lib/auth/authorization");
  const canReadPii = await hasPermission(ctx, "candidate:read_pii");
  if (canReadPii) return rows;
  return rows.map((row) => ({ ...row, email: null, phone: null }));
}

export async function listCandidates(ctx: RequestContext, filters: CandidateFilters = {}): Promise<Candidate[]> {
  await requirePermission(ctx, "candidate:read");
  const supabase = createClient();
  let query = supabase.from("candidates").select("*").eq("organization_id", ctx.organizationId);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) {
    const term = filters.search.trim();
    if (term) {
      query = query.or(
        `first_name.ilike.%${term}%,last_name.ilike.%${term}%,current_title.ilike.%${term}%,current_company.ilike.%${term}%`
      );
    }
  }
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to list candidates: ${error.message}`);
  return redactPiiIfNeeded(ctx, data ?? []);
}

export async function getCandidate(ctx: RequestContext, id: string): Promise<Candidate> {
  await requirePermission(ctx, "candidate:read");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load candidate: ${error.message}`);
  if (!data) throw new NotFoundError("Candidate");
  const redacted = (await redactPiiIfNeeded(ctx, [data]))[0];
  return redacted as Candidate;
}

export async function createCandidate(ctx: RequestContext, rawInput: unknown): Promise<Candidate> {
  await requirePermission(ctx, "candidate:create");
  const parsed = candidateInputSchema.safeParse(rawInput);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("candidates")
    .insert({ ...toRow(parsed.data), organization_id: ctx.organizationId, created_by: ctx.userId })
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to create candidate: ${error?.message ?? "unknown error"}`);

  await recordAuditLog(ctx, {
    action: "candidate.created",
    entityType: "candidate",
    entityId: data.id,
    afterData: { ...data, email: undefined, phone: undefined } // audit trail: never store raw PII in before/after either
  });
  return data;
}

export async function updateCandidate(ctx: RequestContext, id: string, rawInput: unknown): Promise<Candidate> {
  await requirePermission(ctx, "candidate:update");
  const parsed = candidateInputSchema.safeParse(rawInput);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("candidates")
    .update(toRow(parsed.data))
    .eq("organization_id", ctx.organizationId)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to update candidate: ${error?.message ?? "unknown error"}`);

  await recordAuditLog(ctx, { action: "candidate.updated", entityType: "candidate", entityId: id });
  return data;
}

/** Candidates within the org NOT yet linked to a given job — used by the "Add to pipeline" picker. */
export async function listCandidatesNotOnJob(ctx: RequestContext, jobId: string): Promise<Candidate[]> {
  await requirePermission(ctx, "candidate:read");
  const supabase = createClient();
  const { data: existingApplications, error: applicationsError } = await supabase
    .from("applications")
    .select("candidate_id")
    .eq("organization_id", ctx.organizationId)
    .eq("job_id", jobId);
  if (applicationsError) throw new Error(`Failed to check existing applications: ${applicationsError.message}`);

  const excludeIds = (existingApplications ?? []).map((a) => a.candidate_id);
  let query = supabase.from("candidates").select("*").eq("organization_id", ctx.organizationId);
  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to list candidates: ${error.message}`);
  return redactPiiIfNeeded(ctx, data ?? []);
}
