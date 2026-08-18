import "server-only";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/authorization";
import { getJob } from "@/services/recruiting/jobService";
import { listCandidates, type Candidate } from "@/services/recruiting/candidateService";
import { getAIProvider } from "@/services/ai/provider";
import { buildJobPromptContext, buildCandidatePromptContext, formatMatchingPrompt } from "@/services/ai/promptContext";
import {
  scoreSkillsMatch,
  scoreExperienceMatch,
  scoreLocationMatch,
  scoreCompensationMatch,
  scoreDomainMatch,
  computeOverallScore
} from "@/services/matching/scoring";
import { recordAgentAuditLog } from "@/lib/audit/recordAuditLog";
import type { Json } from "@/lib/supabase/database.types";
import type { RequestContext } from "@/lib/auth/context";

const AI_QUALITATIVE_SCHEMA = z.object({
  ai_score: z.number().min(0).max(100),
  strengths: z.array(z.string()).max(6),
  concerns: z.array(z.string()).max(6),
  recommendation: z.enum(["shortlist", "consider", "pass"]),
  summary: z.string().max(600)
});
type AiQualitative = z.infer<typeof AI_QUALITATIVE_SCHEMA>;

const AI_QUALITATIVE_JSON_SCHEMA = {
  type: "object",
  properties: {
    ai_score: { type: "number", description: "0-100 qualitative fit score" },
    strengths: { type: "array", items: { type: "string" } },
    concerns: { type: "array", items: { type: "string" } },
    recommendation: { type: "string", enum: ["shortlist", "consider", "pass"] },
    summary: { type: "string", description: "1-2 sentence overall summary" }
  },
  required: ["ai_score", "strengths", "concerns", "recommendation", "summary"]
};

const SHORTLIST_THRESHOLD = 75;
/** Caps AI calls per run for cost/latency — the rest fall back to deterministic-only scoring (computeOverallScore uses domainScore in place of a missing aiScore). */
const AI_SCORING_TOP_N = 15;

type Severity = "info" | "success" | "warning" | "error";

export async function runAvaCandidateMatching(ctx: RequestContext, jobId: string): Promise<{ agentTaskId: string }> {
  await requirePermission(ctx, "job:update");
  const job = await getJob(ctx, jobId);

  const admin = createAdminClient();
  const { data: agent, error: agentError } = await admin
    .from("agents")
    .select("id")
    .eq("organization_id", ctx.organizationId)
    .eq("agent_key", "ava")
    .single();
  if (agentError || !agent) {
    throw new Error("AVA is not provisioned for this organization.");
  }

  const { data: agentTask, error: taskError } = await admin
    .from("agent_tasks")
    .insert({
      organization_id: ctx.organizationId,
      agent_id: agent.id,
      task_type: "candidate_matching",
      status: "running",
      input: { job_id: jobId },
      related_entity_type: "job",
      related_entity_id: jobId,
      created_by_user_id: ctx.userId,
      started_at: new Date().toISOString()
    })
    .select("id")
    .single();
  if (taskError || !agentTask) {
    throw new Error(`Failed to create agent task: ${taskError?.message ?? "unknown error"}`);
  }

  async function writeEvent(event: { eventType: string; severity?: Severity; message: string; payload?: Record<string, unknown> }) {
    await admin.from("agent_events").insert({
      organization_id: ctx.organizationId,
      agent_id: agent!.id,
      agent_task_id: agentTask!.id,
      event_type: event.eventType,
      severity: event.severity ?? "info",
      message: event.message,
      payload: (event.payload ?? {}) as Json
    });
  }

  await admin.from("agents").update({ status: "working" }).eq("id", agent.id);
  await writeEvent({ eventType: "task.started", message: `AVA started candidate matching for ${job.title}` });

  try {
    const candidates = await listCandidates(ctx);
    const jobContext = buildJobPromptContext(job);

    const deterministic = candidates.map((candidate) => {
      const skillsScore = scoreSkillsMatch(jobContext.requiredSkills, candidate.skills);
      const experienceScore = scoreExperienceMatch(candidate.years_experience);
      const locationScore = scoreLocationMatch(job.location, job.workplace_type, candidate.location);
      const compensationScore = scoreCompensationMatch(job.salary_min, job.salary_max, candidate.salary_expectation);
      const domainScore = scoreDomainMatch(candidate.current_title, job.title);
      const preScore = computeOverallScore({
        skillsScore,
        experienceScore,
        locationScore,
        compensationScore,
        domainScore,
        aiScore: null
      });
      return { candidate, skillsScore, experienceScore, locationScore, compensationScore, domainScore, preScore };
    });
    deterministic.sort((a, b) => b.preScore - a.preScore);

    const aiEligible = deterministic.slice(0, AI_SCORING_TOP_N);
    const aiResults = new Map<string, AiQualitative>();

    let provider: ReturnType<typeof getAIProvider> | null = null;
    try {
      provider = getAIProvider();
    } catch (err) {
      await writeEvent({
        eventType: "task.warning",
        severity: "warning",
        message: `AI provider unavailable (${(err as Error).message}) — continuing with deterministic scoring only.`
      });
    }

    if (provider) {
      const settled = await Promise.allSettled(
        aiEligible.map(async (entry) => {
          const prompt = formatMatchingPrompt(jobContext, buildCandidatePromptContext(entry.candidate));
          const result = await provider!.generateObject({
            system:
              "You are a recruiting analyst scoring how well a candidate fits a job, based only on the structured facts given. Be concise and specific.",
            prompt,
            schema: AI_QUALITATIVE_SCHEMA,
            jsonSchema: AI_QUALITATIVE_JSON_SCHEMA,
            toolName: "score_candidate_fit",
            maxTokens: 500
          });
          return { candidateId: entry.candidate.id, result };
        })
      );
      for (const outcome of settled) {
        if (outcome.status === "fulfilled") {
          aiResults.set(outcome.value.candidateId, outcome.value.result);
        }
      }
      const failures = settled.filter((o) => o.status === "rejected").length;
      if (failures > 0) {
        await writeEvent({
          eventType: "task.warning",
          severity: "warning",
          message: `AI scoring failed for ${failures} candidate(s) — those candidates were still scored deterministically.`
        });
      }
    }

    const shortlisted: Array<{ candidateId: string; name: string; overallScore: number }> = [];
    let evaluatedCount = 0;

    for (const entry of deterministic) {
      const aiResult = aiResults.get(entry.candidate.id) ?? null;
      const overallScore = computeOverallScore({
        skillsScore: entry.skillsScore,
        experienceScore: entry.experienceScore,
        locationScore: entry.locationScore,
        compensationScore: entry.compensationScore,
        domainScore: entry.domainScore,
        aiScore: aiResult?.ai_score ?? null
      });

      const { error: upsertError } = await admin.from("candidate_matches").upsert(
        {
          organization_id: ctx.organizationId,
          job_id: jobId,
          candidate_id: entry.candidate.id,
          overall_score: overallScore,
          skills_score: entry.skillsScore,
          experience_score: entry.experienceScore,
          location_score: entry.locationScore,
          compensation_score: entry.compensationScore,
          domain_score: entry.domainScore,
          ai_score: aiResult?.ai_score ?? null,
          reasoning: aiResult ?? null
        },
        { onConflict: "job_id,candidate_id" }
      );
      if (upsertError) throw new Error(`Failed to store candidate match: ${upsertError.message}`);

      evaluatedCount += 1;
      const candidateName = `${entry.candidate.first_name} ${entry.candidate.last_name}`;
      await writeEvent({
        eventType: "candidate.evaluated",
        message: `AVA evaluated ${candidateName} — ${overallScore}%`,
        payload: { candidateId: entry.candidate.id, overallScore }
      });

      if (overallScore >= SHORTLIST_THRESHOLD) {
        shortlisted.push({ candidateId: entry.candidate.id, name: candidateName, overallScore });
      }
    }

    if (shortlisted.length > 0) {
      await writeEvent({
        eventType: "candidate.shortlisted",
        severity: "success",
        message: `AVA shortlisted ${shortlisted.length} candidate${shortlisted.length === 1 ? "" : "s"}`,
        payload: { candidateIds: shortlisted.map((s) => s.candidateId) }
      });

      const { data: approval, error: approvalError } = await admin
        .from("approvals")
        .insert({
          organization_id: ctx.organizationId,
          agent_id: agent.id,
          agent_task_id: agentTask.id,
          action_type: "candidate_outreach",
          status: "pending",
          risk_level: "medium",
          reason: `AVA wants to prepare outreach for ${shortlisted.length} shortlisted candidate${
            shortlisted.length === 1 ? "" : "s"
          } for ${job.title}.`,
          payload: { jobId, jobTitle: job.title, candidates: shortlisted }
        })
        .select("id")
        .single();
      if (approvalError || !approval) {
        throw new Error(`Failed to create approval request: ${approvalError?.message ?? "unknown error"}`);
      }

      await writeEvent({
        eventType: "approval.requested",
        message: `AVA requested outreach approval for ${shortlisted.length} candidate${shortlisted.length === 1 ? "" : "s"}`,
        payload: { approvalId: approval.id }
      });

      await admin
        .from("agent_tasks")
        .update({
          status: "waiting_for_approval",
          output: { evaluatedCount, shortlistedCount: shortlisted.length, approvalId: approval.id }
        })
        .eq("id", agentTask.id);
      await admin.from("agents").update({ status: "review_required" }).eq("id", agent.id);
    } else {
      await admin
        .from("agent_tasks")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          output: { evaluatedCount, shortlistedCount: 0 }
        })
        .eq("id", agentTask.id);
      await admin.from("agents").update({ status: "idle" }).eq("id", agent.id);
      await writeEvent({
        eventType: "task.completed",
        severity: "success",
        message: `AVA completed candidate matching for ${job.title} — no candidates met the shortlist threshold`
      });
    }

    await recordAgentAuditLog(ctx.organizationId, {
      agentKey: "ava",
      action: "agent_task.completed",
      entityType: "agent_task",
      entityId: agentTask.id,
      afterData: { jobId, evaluatedCount, shortlistedCount: shortlisted.length }
    });

    return { agentTaskId: agentTask.id };
  } catch (err) {
    await admin
      .from("agent_tasks")
      .update({
        status: "failed",
        failed_at: new Date().toISOString(),
        error_message: (err as Error).message
      })
      .eq("id", agentTask.id);
    await admin.from("agents").update({ status: "blocked" }).eq("id", agent.id);
    await writeEvent({
      eventType: "task.failed",
      severity: "error",
      message: `AVA's candidate matching task failed: ${(err as Error).message}`
    });
    throw err;
  }
}

export type { Candidate };
