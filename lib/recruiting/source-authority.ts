import type { JobSource, JobSourceCategory } from "@/types";

/**
 * Source verification hierarchy.
 *
 * A listing on a third-party aggregator does not carry the same confidence as
 * the same opportunity read straight from the employer's ATS. When LinkedIn
 * says a job is OPEN but Workday says CLOSED, SoloRec trusts Workday — the
 * LinkedIn listing is a stale third-party copy, not a live opportunity.
 *
 * Authority is a 0–100 weight. Everything downstream (ghost scoring, source
 * status resolution) reads from this single table.
 */

interface SourceProfile {
  authority: number;
  category: JobSourceCategory;
  label: string;
}

const SOURCE_PROFILES: Record<JobSource, SourceProfile> = {
  employer_ats: { authority: 100, category: "ats", label: "Employer ATS" },
  company_career_site: { authority: 95, category: "career_site", label: "Company Career Site" },
  greenhouse: { authority: 95, category: "ats", label: "Greenhouse" },
  lever: { authority: 95, category: "ats", label: "Lever" },
  ashby: { authority: 95, category: "ats", label: "Ashby" },
  workday: { authority: 95, category: "ats", label: "Workday" },
  icims: { authority: 92, category: "ats", label: "iCIMS" },
  bullhorn: { authority: 90, category: "ats", label: "Bullhorn" },
  linkedin: { authority: 80, category: "board", label: "LinkedIn" },
  indeed: { authority: 75, category: "board", label: "Indeed" },
  dice: { authority: 75, category: "board", label: "Dice" },
  ziprecruiter: { authority: 70, category: "board", label: "ZipRecruiter" },
  glassdoor: { authority: 65, category: "board", label: "Glassdoor" },
  monster: { authority: 60, category: "board", label: "Monster" },
  other_aggregator: { authority: 40, category: "aggregator", label: "Aggregator" }
};

export function sourceAuthority(source: JobSource): number {
  return SOURCE_PROFILES[source].authority;
}

export function sourceCategory(source: JobSource): JobSourceCategory {
  return SOURCE_PROFILES[source].category;
}

export function sourceLabel(source: JobSource): string {
  return SOURCE_PROFILES[source].label;
}

/** True for ATS/career-site sources SoloRec treats as authoritative. */
export function isAuthoritativeSource(source: JobSource): boolean {
  return sourceAuthority(source) >= 90;
}

/** The most authoritative source in a set — the one to trust on conflicts. */
export function mostAuthoritativeSource(sources: JobSource[]): JobSource | undefined {
  if (sources.length === 0) return undefined;
  return sources.reduce((best, s) => (sourceAuthority(s) > sourceAuthority(best) ? s : best));
}
