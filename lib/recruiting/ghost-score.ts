import type { JobScores } from "@/types";
import {
  computeHiringProbability,
  deriveSignals,
  scoreBand,
  type JobScoringInput
} from "@/lib/recruiting/hiring-signals";
import { isEngineeringFamilyName } from "@/lib/recruiting/job-normalizer";

/**
 * The three-score engine.
 *
 * A standalone ghost score is not enough. Every job carries:
 *   - Ghost Risk           — probability the listing is stale / questionable.
 *   - Hiring Probability    — likelihood a real requirement exists (hiring-signals.ts).
 *   - Staffing Opportunity  — the score SoloRec optimizes: is this company
 *                             worth a recruiter calling? This is where the
 *                             product turns job data into revenue intelligence.
 */

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Ghost Risk (0–100). High = likely stale or a third-party artifact. An
 * authoritative source that still reports the job as open is the strongest
 * evidence *against* ghost risk; an aggregator-only, aged, or conflicting
 * listing is evidence *for* it.
 */
export function computeGhostRisk(input: JobScoringInput): number {
  let score = 30;

  if (input.onAuthoritativeSource) score -= 22;
  else score += 14; // seen only on boards/aggregators

  if (input.resolvedStatus === "closed") score += 50;
  if (input.hasConflictingStatus) score += 22;

  if (input.ageDays > 60) score += 26;
  else if (input.ageDays > 45) score += 18;
  else if (input.ageDays > 30) score += 10;
  else if (input.ageDays <= 7) score -= 12;

  // A single repost is normal churn; repeated reposts read as a stale evergreen.
  if (input.repostCount >= 4) score += 16;
  else if (input.repostCount >= 2) score += 6;

  if (input.salaryDisclosed) score -= 6;
  if (input.companyOpenReqs >= 3) score -= 6;

  return Math.round(clamp(score));
}

/**
 * Staffing Opportunity (0–100). Answers "is this worth a recruiter's outreach?"
 * Rewards a real, fresh requirement (low ghost risk, high hiring probability),
 * multi-req demand at the company, engineering/specialist families, disclosed
 * comp, and company expansion — the ingredients of a billable, multi-position
 * account rather than a one-off.
 */
export function computeStaffingOpportunity(
  input: JobScoringInput,
  ghostRisk: number,
  hiringProbability: number
): number {
  let score = 0.5 * hiringProbability + 0.25 * (100 - ghostRisk);

  if (input.companyOpenReqs >= 10) score += 8;
  else if (input.companyOpenReqs >= 5) score += 5;
  else if (input.companyOpenReqs >= 3) score += 3;

  if (input.companyEngineeringReqs >= 5) score += 4;
  if (isEngineeringFamilyName(input.jobFamily) || input.jobFamily === "Nursing & Clinical") score += 3;

  if (input.companyHiringAccelerationPct >= 25) score += 4;
  else if (input.companyHiringAccelerationPct >= 15) score += 2;

  if (input.salaryDisclosed) score += 2;

  return Math.round(clamp(score));
}

/** Estimated agency fee range for a placement, from the salary midpoint. */
export function estimateStaffingValue(
  salaryMidpoint: number | undefined,
  companyOpenReqs: number
): { min: number; max: number } | undefined {
  if (!salaryMidpoint) return undefined;
  // Typical direct-hire fee band, 18%–25% of first-year salary.
  const feeLow = Math.round(salaryMidpoint * 0.18);
  const feeHigh = Math.round(salaryMidpoint * 0.25);
  // Multi-req accounts imply more than one placement in play.
  const reqMultiplier = companyOpenReqs >= 5 ? 2 : 1;
  return { min: feeLow, max: feeHigh * reqMultiplier };
}

function buildRecommendation(input: JobScoringInput, staffingOpportunity: number): string {
  if (staffingOpportunity >= 85) {
    return input.companyOpenReqs >= 5
      ? "HIGH PRIORITY ACCOUNT — likely multi-position requirement. Identify the Director of Talent Acquisition or the hiring manager and open a conversation now."
      : "HIGH PRIORITY — active, well-evidenced requirement. Identify the hiring manager and reach out today.";
  }
  if (staffingOpportunity >= 65) {
    return "WORTH PURSUING — real requirement with room to add value. Research the buyer and prepare tailored outreach.";
  }
  if (staffingOpportunity >= 40) {
    return "MONITOR — some positive signal, but not yet a priority. Add to a watchlist and revisit if demand accelerates.";
  }
  return "DEPRIORITIZE — weak or stale signal. Likely not worth outreach right now.";
}

/** Compute all three scores plus evidence and a recommendation for a job. */
export function scoreJob(input: JobScoringInput): JobScores {
  const ghostRisk = computeGhostRisk(input);
  const hiringProbability = computeHiringProbability(input);
  const staffingOpportunity = computeStaffingOpportunity(input, ghostRisk, hiringProbability);
  const reasons = deriveSignals(input).map((s) => s.evidence);

  return {
    ghostRisk,
    hiringProbability,
    staffingOpportunity,
    ghostRiskBand: scoreBand(ghostRisk),
    hiringProbabilityBand: scoreBand(hiringProbability),
    staffingOpportunityBand: scoreBand(staffingOpportunity),
    reasons,
    recommendation: buildRecommendation(input, staffingOpportunity)
  };
}
