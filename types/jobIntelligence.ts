/**
 * Job Intelligence domain types.
 *
 * These describe SoloRec's canonical job model — one universal job record
 * that can appear across many sources (see docs/database-schema.md's Job
 * Intelligence section). A single opportunity ("Senior Cybersecurity
 * Engineer @ Lockheed Martin, Orlando FL") may be posted on LinkedIn,
 * Indeed, the company career site and Workday all at once; SoloRec collapses
 * those into one `CanonicalJob` with many `JobSourceRecord`s.
 *
 * The `NormalizedJob` at the bottom is the integration contract every source
 * connector (services/integrations/jobs) must emit, regardless of whether it
 * scraped a board or read an ATS API.
 */

/**
 * Concrete source identity. Distinct from a source *category* — the same
 * opportunity read from Greenhouse (an ATS) carries more authority than the
 * same opportunity seen on an aggregator. See `JobSourceCategory` and
 * lib/recruiting/source-authority.ts.
 */
export type JobSource =
  | "employer_ats"
  | "company_career_site"
  | "greenhouse"
  | "lever"
  | "ashby"
  | "workday"
  | "icims"
  | "bullhorn"
  | "linkedin"
  | "indeed"
  | "glassdoor"
  | "ziprecruiter"
  | "dice"
  | "monster"
  | "other_aggregator";

export type JobSourceCategory = "ats" | "career_site" | "board" | "aggregator";

/** Lifecycle of a canonical job as SoloRec observes it across sources. */
export type CanonicalJobStatus = "open" | "reposted" | "stale" | "closed";

export type JobIntelEmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "contract_to_hire"
  | "internship"
  | "temporary"
  | "unknown";

export type JobIntelWorkplaceType = "onsite" | "hybrid" | "remote" | "unknown";

/** How confident SoloRec is that a source still reports the job as live. */
export type SourceStatus = "open" | "closed" | "unknown";

/**
 * Canonical job — the single record a recruiter reasons about. Scores are
 * derived (lib/recruiting) and cached here; source-level detail lives on the
 * attached `JobSourceRecord`s.
 */
export interface CanonicalJob {
  id: string;
  organizationId: string;
  companyId: string;
  company: string;
  companyDomain?: string;

  title: string;
  normalizedTitle: string;
  description: string;
  location?: string;
  employmentType: JobIntelEmploymentType;
  workplaceType: JobIntelWorkplaceType;

  salaryMin?: number;
  salaryMax?: number;
  currency: string;

  /** Stable identity used to fold duplicate postings together. */
  fingerprint: string;

  firstSeenAt: string;
  lastSeenAt: string;
  status: CanonicalJobStatus;
  repostCount: number;

  scores: JobScores;
}

/** One source's view of a canonical job. */
export interface JobSourceRecord {
  id: string;
  jobId: string;
  source: JobSource;
  externalId: string;
  sourceUrl: string;
  applyUrl?: string;
  firstSeenAt: string;
  lastSeenAt: string;
  sourcePostedAt?: string;
  sourceStatus: SourceStatus;
}

/** Point-in-time capture of a job, used to detect edits, reposts and decay. */
export interface JobSnapshot {
  id: string;
  jobId: string;
  capturedAt: string;
  title: string;
  descriptionHash: string;
  salaryMin?: number;
  salaryMax?: number;
  sourceStatus: SourceStatus;
}

export type JobSignalType =
  | "listed_on_employer_ats"
  | "recently_posted"
  | "multiple_openings"
  | "reposted"
  | "salary_disclosed"
  | "company_expanding"
  | "stale_third_party_listing"
  | "closed_on_authoritative_source"
  | "conflicting_source_status";

/** An observed fact about a job that feeds one or more scores. */
export interface JobSignal {
  id: string;
  jobId: string;
  signalType: JobSignalType;
  value: number;
  confidence: number;
  evidence: string;
  detectedAt: string;
}

export type ScoreBand = "very_low" | "low" | "medium" | "high" | "very_high";

/**
 * Every job carries three scores, not one. Ghost Risk measures staleness,
 * Hiring Probability measures whether a real requirement exists, and Staffing
 * Opportunity — the score SoloRec actually optimizes for — measures whether
 * it is worth a recruiter's outreach.
 */
export interface JobScores {
  ghostRisk: number;
  hiringProbability: number;
  staffingOpportunity: number;
  ghostRiskBand: ScoreBand;
  hiringProbabilityBand: ScoreBand;
  staffingOpportunityBand: ScoreBand;
  /** Human-readable signal lines behind the scores, for the UI. */
  reasons: string[];
  recommendation?: string;
}

export type CompanySignalType =
  | "hiring_acceleration"
  | "engineering_demand"
  | "multi_location_hiring"
  | "high_open_req_count"
  | "repeat_staffing_pattern";

export interface CompanySignal {
  id: string;
  companyId: string;
  signalType: CompanySignalType;
  value: number;
  confidence: number;
  detectedAt: string;
}

/** Company-level roll-up SoloRec builds from that company's canonical jobs. */
export interface CompanyIntelligence {
  companyId: string;
  company: string;
  companyDomain?: string;
  openJobs: number;
  engineeringJobs: number;
  jobsPostedLast7Days: number;
  repostedJobs: number;
  hiringLocations: string[];
  hiringScore: number;
  hiringAccelerationPct: number;
  primaryDemand: string[];
  hotLocations: string[];
  staffingOpportunityMin: number;
  staffingOpportunityMax: number;
}

/**
 * The integration contract. Every connector in services/integrations/jobs —
 * ATS or board — must produce this shape so downstream normalization,
 * deduplication and scoring are source-agnostic.
 */
export interface NormalizedJob {
  externalId: string;
  source: JobSource;

  title: string;
  company: string;
  companyDomain?: string;

  description: string;
  location?: string;

  employmentType?: JobIntelEmploymentType;
  workplaceType?: JobIntelWorkplaceType;

  salaryMin?: number;
  salaryMax?: number;
  currency?: string;

  postedAt?: string;
  /** Whether the source still reports the listing as live, when known. */
  sourceStatus?: SourceStatus;

  applyUrl: string;
  sourceUrl: string;
}
