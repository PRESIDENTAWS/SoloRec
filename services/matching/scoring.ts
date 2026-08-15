/**
 * Deterministic candidate/job scoring. Pure functions, no I/O — fully
 * unit-testable without a database or AI call (see
 * tests/matching/scoring.test.ts). AVA calls these first and only sends the
 * AI provider a qualitative judgment on top, per
 * docs/AI_AGENT_ARCHITECTURE.md: "Do NOT rely solely on LLM judgment."
 *
 * Weights per the sprint spec:
 *   Skill Match 35% · Experience Match 20% · Location Match 10% ·
 *   Compensation Match 15% · Title/Domain Match 10% · AI Qualitative 10%
 */

export const SCORE_WEIGHTS = {
  skills: 0.35,
  experience: 0.2,
  location: 0.1,
  compensation: 0.15,
  domain: 0.1,
  ai: 0.1
} as const;

function normalizeToken(value: string): string {
  return value.toLowerCase().trim();
}

export function scoreSkillsMatch(requiredSkills: string[], candidateSkills: string[]): number {
  if (requiredSkills.length === 0) return 100;
  const candidateSet = new Set(candidateSkills.map(normalizeToken));
  const matched = requiredSkills.filter((skill) => candidateSet.has(normalizeToken(skill))).length;
  return Math.round((matched / requiredSkills.length) * 100);
}

export function scoreExperienceMatch(yearsExperience: number | null): number {
  if (yearsExperience == null) return 50;
  if (yearsExperience < 1) return 30;
  if (yearsExperience < 3) return 65;
  if (yearsExperience < 5) return 85;
  if (yearsExperience <= 12) return 100;
  return 90; // very senior — not penalized as heavily as underqualified
}

export function scoreLocationMatch(
  jobLocation: string | null,
  jobWorkplaceType: string,
  candidateLocation: string | null
): number {
  if (jobWorkplaceType === "remote") return 100;
  if (!jobLocation || !candidateLocation) return 50;

  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z]/g, "");
  const jobCity = normalize(jobLocation.split(",")[0] ?? jobLocation);
  const candidateCity = normalize(candidateLocation.split(",")[0] ?? candidateLocation);
  if (jobCity && candidateCity && jobCity === candidateCity) return 100;

  const jobFull = normalize(jobLocation);
  const candidateFull = normalize(candidateLocation);
  if (jobFull && candidateFull && (jobFull.includes(candidateCity) || candidateFull.includes(jobCity))) {
    return 75;
  }
  return jobWorkplaceType === "hybrid" ? 40 : 20;
}

export function scoreCompensationMatch(
  jobSalaryMin: number | null,
  jobSalaryMax: number | null,
  candidateExpectation: number | null
): number {
  if (candidateExpectation == null) return 60;
  if (jobSalaryMin == null && jobSalaryMax == null) return 60;

  const min = jobSalaryMin ?? 0;
  const max = jobSalaryMax ?? Math.max(min * 1.3, candidateExpectation);

  if (candidateExpectation >= min && candidateExpectation <= max) return 100;
  if (candidateExpectation < min) return 90; // under budget — not a real concern for the agency

  const overBy = (candidateExpectation - max) / max;
  if (overBy <= 0.05) return 80;
  if (overBy <= 0.15) return 55;
  if (overBy <= 0.3) return 30;
  return 10;
}

export function scoreDomainMatch(candidateTitle: string | null, jobTitle: string): number {
  if (!candidateTitle) return 40;
  const jobWords = new Set(
    normalizeToken(jobTitle)
      .split(/\s+/)
      .filter((word) => word.length > 2)
  );
  const titleWords = normalizeToken(candidateTitle)
    .split(/\s+/)
    .filter((word) => word.length > 2);
  const overlap = titleWords.filter((word) => jobWords.has(word)).length;
  if (overlap >= 2) return 100;
  if (overlap === 1) return 70;
  return 40;
}

export interface DeterministicScores {
  skillsScore: number;
  experienceScore: number;
  locationScore: number;
  compensationScore: number;
  domainScore: number;
}

export function computeOverallScore(scores: DeterministicScores & { aiScore: number | null }): number {
  // Falls back to domainScore when the AI component hasn't run for this
  // candidate (see the top-N cap in avaMatchingWorkflow.ts) rather than
  // silently zeroing out 10% of the weight.
  const aiComponent = scores.aiScore ?? scores.domainScore;
  const weighted =
    scores.skillsScore * SCORE_WEIGHTS.skills +
    scores.experienceScore * SCORE_WEIGHTS.experience +
    scores.locationScore * SCORE_WEIGHTS.location +
    scores.compensationScore * SCORE_WEIGHTS.compensation +
    scores.domainScore * SCORE_WEIGHTS.domain +
    aiComponent * SCORE_WEIGHTS.ai;
  return Math.round(weighted);
}
