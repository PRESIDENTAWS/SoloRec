import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/authorization";
import type { RequestContext } from "@/lib/auth/context";

export interface CandidateMatchReasoning {
  strengths: string[];
  concerns: string[];
  recommendation: "shortlist" | "consider" | "pass";
  summary: string;
}

export interface CandidateMatch {
  id: string;
  organization_id: string;
  job_id: string;
  candidate_id: string;
  overall_score: number;
  skills_score: number | null;
  experience_score: number | null;
  location_score: number | null;
  compensation_score: number | null;
  domain_score: number | null;
  ai_score: number | null;
  reasoning: CandidateMatchReasoning | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateMatchWithJob extends CandidateMatch {
  job: { id: string; title: string; status: string };
}

export interface CandidateMatchWithCandidate extends CandidateMatch {
  candidate: {
    id: string;
    first_name: string;
    last_name: string;
    current_title: string | null;
    current_company: string | null;
    location: string | null;
    years_experience: number | null;
  };
}

export async function listMatchesForJob(
  ctx: RequestContext,
  jobId: string
): Promise<CandidateMatchWithCandidate[]> {
  await requirePermission(ctx, "job:read");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("candidate_matches")
    .select(
      "*, candidate:candidates(id, first_name, last_name, current_title, current_company, location, years_experience)"
    )
    .eq("organization_id", ctx.organizationId)
    .eq("job_id", jobId)
    .order("overall_score", { ascending: false });
  if (error) throw new Error(`Failed to list candidate matches: ${error.message}`);
  return (data ?? []) as unknown as CandidateMatchWithCandidate[];
}

export async function listMatchesForCandidate(
  ctx: RequestContext,
  candidateId: string
): Promise<CandidateMatchWithJob[]> {
  await requirePermission(ctx, "candidate:read");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("candidate_matches")
    .select("*, job:jobs(id, title, status)")
    .eq("organization_id", ctx.organizationId)
    .eq("candidate_id", candidateId)
    .order("overall_score", { ascending: false });
  if (error) throw new Error(`Failed to list candidate matches: ${error.message}`);
  return (data ?? []) as unknown as CandidateMatchWithJob[];
}
