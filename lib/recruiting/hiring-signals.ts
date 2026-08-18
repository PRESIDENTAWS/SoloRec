import type { JobSignalType, JobSource, ScoreBand, SourceStatus } from "@/types";
import { isAuthoritativeSource, sourceLabel } from "@/lib/recruiting/source-authority";

/**
 * Hiring-signal derivation and Hiring Probability scoring.
 *
 * Hiring Probability answers "is there an active, real requirement here?" —
 * separate from Ghost Risk ("is this listing stale?"). A job can be low ghost
 * risk yet low hiring probability (a genuine but nearly-filled req), or the
 * reverse. Signals derived here are also consumed by ghost scoring and by the
 * UI's evidence list.
 */

export interface JobScoringInput {
  /** Days since the opportunity was first posted on its earliest source. */
  ageDays: number;
  sources: JobSource[];
  onAuthoritativeSource: boolean;
  resolvedStatus: SourceStatus;
  hasConflictingStatus: boolean;
  repostCount: number;
  salaryDisclosed: boolean;
  salaryMidpoint?: number;
  jobFamily: string;
  /** Other currently-open requisitions at the same company. */
  companyOpenReqs: number;
  companyEngineeringReqs: number;
  /** Company hiring-velocity change, as a percentage (e.g. 27 for +27%). */
  companyHiringAccelerationPct: number;
}

export interface DerivedSignal {
  type: JobSignalType;
  value: number;
  confidence: number;
  evidence: string;
}

/** Map a 0–100 score to a coarse band for the UI. */
export function scoreBand(score: number): ScoreBand {
  if (score >= 85) return "very_high";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  if (score >= 20) return "low";
  return "very_low";
}

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Derive the discrete signals behind a job's scores. */
export function deriveSignals(input: JobScoringInput): DerivedSignal[] {
  const signals: DerivedSignal[] = [];

  if (input.onAuthoritativeSource) {
    const source = input.sources.find(isAuthoritativeSource);
    signals.push({
      type: "listed_on_employer_ats",
      value: 1,
      confidence: 0.95,
      evidence: `Listed on employer ATS${source ? ` (${sourceLabel(source)})` : ""}`
    });
  }

  if (input.ageDays <= 7) {
    signals.push({
      type: "recently_posted",
      value: input.ageDays,
      confidence: 0.9,
      evidence: `Posted ${input.ageDays} day${input.ageDays === 1 ? "" : "s"} ago`
    });
  }

  if (input.companyOpenReqs >= 3) {
    signals.push({
      type: "multiple_openings",
      value: input.companyOpenReqs,
      confidence: 0.8,
      evidence: `${input.companyOpenReqs} additional openings at this company`
    });
  }

  if (input.repostCount >= 1) {
    signals.push({
      type: "reposted",
      value: input.repostCount,
      confidence: 0.7,
      evidence: `Reposted ${input.repostCount} time${input.repostCount === 1 ? "" : "s"}`
    });
  }

  if (input.salaryDisclosed) {
    signals.push({
      type: "salary_disclosed",
      value: input.salaryMidpoint ?? 1,
      confidence: 0.75,
      evidence: input.salaryMidpoint
        ? `Salary disclosed (~$${Math.round(input.salaryMidpoint / 1000)}K)`
        : "Salary disclosed"
    });
  }

  if (input.companyHiringAccelerationPct >= 15) {
    signals.push({
      type: "company_expanding",
      value: input.companyHiringAccelerationPct,
      confidence: 0.8,
      evidence: `Company hiring +${input.companyHiringAccelerationPct}%`
    });
  }

  if (input.resolvedStatus === "closed") {
    signals.push({
      type: "closed_on_authoritative_source",
      value: 1,
      confidence: 0.9,
      evidence: "Closed on an authoritative source"
    });
  }

  if (input.hasConflictingStatus) {
    signals.push({
      type: "conflicting_source_status",
      value: 1,
      confidence: 0.85,
      evidence: "Third-party board disagrees with the authoritative source"
    });
  }

  return signals;
}

/**
 * Hiring Probability (0–100): likelihood there is an active hiring requirement.
 * Driven up by authoritative freshness, related openings and company
 * expansion; driven down by an authoritative closed/conflicting status.
 */
export function computeHiringProbability(input: JobScoringInput): number {
  let score = 50;

  if (input.onAuthoritativeSource) score += 14;
  if (input.ageDays <= 1) score += 13;
  else if (input.ageDays <= 3) score += 11;
  else if (input.ageDays <= 7) score += 7;
  else if (input.ageDays <= 21) score += 2;
  else if (input.ageDays > 45) score -= 20;
  else if (input.ageDays > 30) score -= 8;

  if (input.companyOpenReqs >= 10) score += 9;
  else if (input.companyOpenReqs >= 3) score += 5;

  if (input.companyHiringAccelerationPct >= 25) score += 6;
  else if (input.companyHiringAccelerationPct >= 15) score += 3;

  if (input.salaryDisclosed) score += 3;

  if (input.resolvedStatus === "closed") score -= 48;
  if (input.hasConflictingStatus) score -= 14;

  return Math.round(clamp(score));
}
