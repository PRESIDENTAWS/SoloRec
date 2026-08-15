import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { RequestContext } from "@/lib/auth/context";

export interface AvaWorkspaceSummary {
  jobId: string | null;
  jobTitle: string | null;
  taskStatus: string | null;
  candidatesEvaluated: number;
  shortlisted: number;
  needsReview: number;
  averageMatchScore: number | null;
}

const SHORTLIST_THRESHOLD = 75;
const REVIEW_THRESHOLD = 50;

/** Summarizes AVA's most recent candidate_matching task for the AI HQ workspace page. */
export async function getAvaWorkspaceSummary(ctx: RequestContext): Promise<AvaWorkspaceSummary> {
  const empty: AvaWorkspaceSummary = {
    jobId: null,
    jobTitle: null,
    taskStatus: null,
    candidatesEvaluated: 0,
    shortlisted: 0,
    needsReview: 0,
    averageMatchScore: null
  };

  const supabase = createClient();
  const { data: agent } = await supabase
    .from("agents")
    .select("id")
    .eq("organization_id", ctx.organizationId)
    .eq("agent_key", "ava")
    .maybeSingle();
  if (!agent) return empty;

  const { data: latestTask } = await supabase
    .from("agent_tasks")
    .select("status, related_entity_id")
    .eq("organization_id", ctx.organizationId)
    .eq("agent_id", agent.id)
    .eq("task_type", "candidate_matching")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!latestTask || !latestTask.related_entity_id) return empty;

  const [{ data: job }, { data: matches }] = await Promise.all([
    supabase.from("jobs").select("id, title").eq("id", latestTask.related_entity_id).maybeSingle(),
    supabase
      .from("candidate_matches")
      .select("overall_score")
      .eq("organization_id", ctx.organizationId)
      .eq("job_id", latestTask.related_entity_id)
  ]);

  const scores = (matches ?? []).map((m) => m.overall_score);
  const shortlisted = scores.filter((score) => score >= SHORTLIST_THRESHOLD).length;
  const needsReview = scores.filter((score) => score >= REVIEW_THRESHOLD && score < SHORTLIST_THRESHOLD).length;
  const averageMatchScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : null;

  return {
    jobId: job?.id ?? null,
    jobTitle: job?.title ?? null,
    taskStatus: latestTask.status,
    candidatesEvaluated: scores.length,
    shortlisted,
    needsReview,
    averageMatchScore
  };
}
