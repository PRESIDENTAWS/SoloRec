import "server-only";
import type { Job } from "@/services/recruiting/jobService";
import type { Candidate } from "@/services/recruiting/candidateService";

export interface JobPromptContext {
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  location: string | null;
  workplaceType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
}

export interface CandidatePromptContext {
  currentTitle: string | null;
  currentCompany: string | null;
  skills: string[];
  yearsExperience: number | null;
  location: string | null;
  salaryExpectation: number | null;
  currency: string;
  summary: string | null;
}

function linesToList(text: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function buildJobPromptContext(job: Job): JobPromptContext {
  return {
    title: job.title,
    requiredSkills: linesToList(job.requirements),
    preferredSkills: linesToList(job.preferred_qualifications),
    location: job.location,
    workplaceType: job.workplace_type,
    salaryMin: job.salary_min,
    salaryMax: job.salary_max,
    currency: job.currency
  };
}

/**
 * Deliberately omits email, phone, and any other PII — see the PII rules in
 * docs/AI_AGENT_ARCHITECTURE.md. Only fields relevant to matching quality
 * are sent to the model.
 */
export function buildCandidatePromptContext(candidate: Candidate): CandidatePromptContext {
  return {
    currentTitle: candidate.current_title,
    currentCompany: candidate.current_company,
    skills: candidate.skills,
    yearsExperience: candidate.years_experience,
    location: candidate.location,
    salaryExpectation: candidate.salary_expectation,
    currency: candidate.currency,
    summary: candidate.summary
  };
}

export function formatMatchingPrompt(job: JobPromptContext, candidate: CandidatePromptContext): string {
  const lines = [
    "Job:",
    job.title,
    "",
    "Required skills:",
    job.requiredSkills.length ? job.requiredSkills.join(", ") : "(none specified)",
    "",
    "Preferred qualifications:",
    job.preferredSkills.length ? job.preferredSkills.join(", ") : "(none specified)",
    "",
    `Location: ${job.location ?? "unspecified"} (${job.workplaceType})`,
    job.salaryMin || job.salaryMax
      ? `Budget: ${job.salaryMin ?? "?"}-${job.salaryMax ?? "?"} ${job.currency}`
      : "",
    "",
    "Candidate:",
    `Current title: ${candidate.currentTitle ?? "unknown"}`,
    `Current company: ${candidate.currentCompany ?? "unknown"}`,
    `Skills: ${candidate.skills.join(", ") || "none listed"}`,
    `Years experience: ${candidate.yearsExperience ?? "unknown"}`,
    `Location: ${candidate.location ?? "unknown"}`,
    candidate.salaryExpectation ? `Expected salary: ${candidate.salaryExpectation} ${candidate.currency}` : "",
    candidate.summary ? `Summary: ${candidate.summary}` : ""
  ];
  return lines.filter((line) => line !== "").join("\n");
}
