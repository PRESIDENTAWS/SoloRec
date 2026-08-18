import { jobFamily, normalizeTitle } from "@/lib/recruiting/job-normalizer";

/**
 * Candidate ↔ job matching.
 *
 * Deliberately simple and explainable for the MVP: title/family overlap,
 * location compatibility and compensation fit produce a 0–100 score with the
 * reasons behind it. A real implementation swaps this heuristic for pgvector
 * similarity over embedded profiles (docs/architecture/04-ai-and-agents.md),
 * but keeps this signature so calling code does not change.
 */

export interface MatchCandidate {
  title: string;
  location?: string;
  /** Desired / current compensation, annualized. */
  compensation?: number;
  skills?: string[];
}

export interface MatchJob {
  title: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  keywords?: string[];
}

export interface MatchResult {
  score: number;
  reasons: string[];
}

function tokenSet(text: string): Set<string> {
  return new Set(normalizeTitle(text).split(" ").filter(Boolean));
}

function overlap(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / Math.max(a.size, b.size);
}

function metro(location?: string): string {
  return (location?.split(",")[0] ?? "").toLowerCase().trim();
}

export function matchCandidateToJob(candidate: MatchCandidate, job: MatchJob): MatchResult {
  const reasons: string[] = [];
  let score = 0;

  // Title / discipline alignment (up to 55).
  const titleOverlap = overlap(tokenSet(candidate.title), tokenSet(job.title));
  score += Math.round(titleOverlap * 40);
  if (titleOverlap > 0.4) reasons.push("Strong title alignment");

  if (jobFamily(candidate.title) === jobFamily(job.title) && jobFamily(job.title) !== "Other") {
    score += 15;
    reasons.push(`Same discipline (${jobFamily(job.title)})`);
  }

  // Skill keyword overlap (up to 20).
  if (candidate.skills && job.keywords) {
    const cSkills = new Set(candidate.skills.map((s) => s.toLowerCase()));
    const matched = job.keywords.filter((k) => cSkills.has(k.toLowerCase()));
    if (matched.length > 0) {
      score += Math.min(20, matched.length * 7);
      reasons.push(`Matching skills: ${matched.slice(0, 3).join(", ")}`);
    }
  }

  // Location compatibility (up to 15).
  const remote = (job.location ?? "").toLowerCase().includes("remote");
  if (remote || (candidate.location && metro(candidate.location) === metro(job.location))) {
    score += 15;
    reasons.push(remote ? "Remote-friendly" : "Located in the target metro");
  }

  // Compensation fit (up to 10).
  if (candidate.compensation && (job.salaryMin || job.salaryMax)) {
    const lo = job.salaryMin ?? 0;
    const hi = job.salaryMax ?? Number.MAX_SAFE_INTEGER;
    if (candidate.compensation >= lo * 0.9 && candidate.compensation <= hi * 1.1) {
      score += 10;
      reasons.push("Compensation in range");
    }
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}
