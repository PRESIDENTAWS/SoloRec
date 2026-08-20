import type {
  JobIntelEmploymentType,
  JobIntelWorkplaceType,
  NormalizedJob
} from "@/types";
import { companyIdentity } from "@/lib/recruiting/company-normalizer";
import { normalizeSalaryRange } from "@/lib/recruiting/salary-normalizer";

/**
 * Title and job-family normalization.
 *
 * `normalizedTitle` is a comparison key (used for deduplication and demand
 * roll-ups); `jobFamily` buckets a title into a coarse discipline so company
 * intelligence can report "primary demand: Software Engineering, Cybersecurity".
 */

/** Noise tokens that do not distinguish one requisition from another. */
const TITLE_NOISE = [
  "senior",
  "sr",
  "junior",
  "jr",
  "staff",
  "principal",
  "lead",
  "i",
  "ii",
  "iii",
  "iv",
  "1",
  "2",
  "3",
  "the",
  "of",
  "and"
];

const FAMILY_KEYWORDS: Array<{ family: string; keywords: string[] }> = [
  { family: "Cybersecurity", keywords: ["security", "cyber", "infosec", "soc", "appsec"] },
  {
    family: "Software Engineering",
    keywords: ["software", "developer", "engineer", "sde", "programmer", "fullstack", "backend", "frontend"]
  },
  { family: "Data & AI", keywords: ["data", "machine learning", "ml", "ai", "analytics", "scientist"] },
  { family: "Systems Engineering", keywords: ["systems", "platform", "devops", "sre", "infrastructure"] },
  { family: "Cloud", keywords: ["cloud", "aws", "azure", "gcp"] },
  { family: "Product & Design", keywords: ["product", "designer", "ux", "ui"] },
  { family: "Nursing & Clinical", keywords: ["nurse", "rn", "clinical", "healthcare"] },
  { family: "Sales", keywords: ["sales", "account executive", "business development"] }
];

/** Lowercased, seniority-stripped, ordered token key for a title. */
export function normalizeTitle(title: string): string {
  const tokens = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !TITLE_NOISE.includes(t));
  return tokens.join(" ");
}

/** Coarse discipline bucket for demand analysis. */
export function jobFamily(title: string): string {
  const t = title.toLowerCase();
  for (const { family, keywords } of FAMILY_KEYWORDS) {
    if (keywords.some((k) => t.includes(k))) return family;
  }
  return "Other";
}

export const ENGINEERING_FAMILIES = [
  "Software Engineering",
  "Systems Engineering",
  "Cybersecurity",
  "Data & AI",
  "Cloud"
] as const;

/** True when a job-family *name* is an engineering discipline. */
export function isEngineeringFamilyName(family: string): boolean {
  return (ENGINEERING_FAMILIES as readonly string[]).includes(family);
}

/** True when a job *title* resolves to an engineering discipline. */
export function isEngineeringFamily(title: string): boolean {
  return isEngineeringFamilyName(jobFamily(title));
}

export interface NormalizedJobCore {
  companyIdentity: string;
  normalizedTitle: string;
  jobFamily: string;
  employmentType: JobIntelEmploymentType;
  workplaceType: JobIntelWorkplaceType;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  location?: string;
}

function inferWorkplaceType(job: NormalizedJob): JobIntelWorkplaceType {
  if (job.workplaceType) return job.workplaceType;
  const haystack = `${job.location ?? ""} ${job.description}`.toLowerCase();
  if (haystack.includes("remote")) return "remote";
  if (haystack.includes("hybrid")) return "hybrid";
  return "unknown";
}

/** Derive the stable, comparable core of a raw source job. */
export function normalizeJob(job: NormalizedJob): NormalizedJobCore {
  const salary = normalizeSalaryRange(job.salaryMin, job.salaryMax, job.currency ?? "USD");
  return {
    companyIdentity: companyIdentity(job.company, job.companyDomain),
    normalizedTitle: normalizeTitle(job.title),
    jobFamily: jobFamily(job.title),
    employmentType: job.employmentType ?? "unknown",
    workplaceType: inferWorkplaceType(job),
    salaryMin: salary.min,
    salaryMax: salary.max,
    currency: salary.currency,
    location: job.location?.trim()
  };
}
