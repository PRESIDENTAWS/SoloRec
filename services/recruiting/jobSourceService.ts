import type {
  CanonicalJob,
  CanonicalJobStatus,
  JobSourceRecord,
  NormalizedJob
} from "@/types";
import {
  MOCK_COMPANY_FACTS,
  MOCK_JOB_LISTINGS,
  MOCK_REPOST_COUNTS,
  type MockCompanyFacts
} from "@/lib/recruiting/mockJobIntel";
import { deduplicateJobs, type DedupedJobGroup } from "@/lib/recruiting/job-deduplicator";
import { fingerprintJob } from "@/lib/recruiting/job-fingerprint";
import { normalizeJob } from "@/lib/recruiting/job-normalizer";
import { companyIdentity } from "@/lib/recruiting/company-normalizer";
import { salaryMidpoint } from "@/lib/recruiting/salary-normalizer";
import { mostAuthoritativeSource, sourceAuthority } from "@/lib/recruiting/source-authority";
import { scoreJob } from "@/lib/recruiting/ghost-score";
import type { JobScoringInput } from "@/lib/recruiting/hiring-signals";

/**
 * Job source ingestion seam.
 *
 * Turns raw source listings (the `NormalizedJob` contract emitted by any
 * connector) into SoloRec's canonical model: dedup by fingerprint, resolve
 * source-status conflicts by authority, run the three-score engine, and emit
 * `CanonicalJob`s plus their per-source `JobSourceRecord`s.
 *
 * Only the *input* changes when a real backend arrives — swap MOCK_JOB_LISTINGS
 * for connector output (services/integrations/jobs) and the same pipeline runs.
 */

const ORG_ID = "org-demo";
/** Reference "now" for age-based scoring; anchored to the scaffold's data. */
const NOW = Date.parse("2026-08-18T00:00:00.000Z");
const DAY_MS = 86_400_000;

const FACTS_BY_IDENTITY = new Map<string, MockCompanyFacts>(
  MOCK_COMPANY_FACTS.map((f) => [f.identity, f])
);

function ageDaysFrom(iso?: string): number {
  if (!iso) return 999;
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return 999;
  return Math.max(0, Math.round((NOW - parsed) / DAY_MS));
}

function earliestPostedAt(listings: NormalizedJob[]): string | undefined {
  const dates = listings
    .map((l) => l.postedAt)
    .filter((d): d is string => Boolean(d))
    .sort();
  return dates[0];
}

function repostCountFor(group: DedupedJobGroup): number {
  for (const listing of group.listings) {
    const count = MOCK_REPOST_COUNTS[listing.externalId];
    if (count !== undefined) return count;
  }
  return 0;
}

function primaryListing(group: DedupedJobGroup): NormalizedJob {
  const bestSource = mostAuthoritativeSource(group.sources);
  const byAuthority = [...group.listings].sort(
    (a, b) => sourceAuthority(b.source) - sourceAuthority(a.source)
  );
  return group.listings.find((l) => l.source === bestSource) ?? byAuthority[0] ?? group.listings[0]!;
}

function deriveStatus(group: DedupedJobGroup, repostCount: number): CanonicalJobStatus {
  if (group.resolvedStatus === "closed") return "closed";
  if (repostCount >= 4) return "stale";
  if (repostCount >= 1) return "reposted";
  return "open";
}

function buildScoringInput(
  group: DedupedJobGroup,
  facts: MockCompanyFacts | undefined,
  ageDays: number,
  repostCount: number,
  primary: NormalizedJob
): JobScoringInput {
  const core = normalizeJob(primary);
  const salaryDisclosed = core.salaryMin !== undefined || core.salaryMax !== undefined;
  return {
    ageDays,
    sources: group.sources,
    onAuthoritativeSource: group.onAuthoritativeSource,
    resolvedStatus: group.resolvedStatus,
    hasConflictingStatus: group.hasConflictingStatus,
    repostCount,
    salaryDisclosed,
    salaryMidpoint: salaryMidpoint({
      min: core.salaryMin,
      max: core.salaryMax,
      currency: core.currency,
      disclosed: salaryDisclosed
    }),
    jobFamily: core.jobFamily,
    companyOpenReqs: facts?.openReqs ?? group.listings.length,
    companyEngineeringReqs: facts?.engineeringReqs ?? 0,
    companyHiringAccelerationPct: facts?.hiringAccelerationPct ?? 0
  };
}

export interface IngestResult {
  jobs: CanonicalJob[];
  sources: JobSourceRecord[];
}

/** Run raw listings through the full normalize → dedup → score pipeline. */
export function ingestListings(listings: NormalizedJob[]): IngestResult {
  const groups = deduplicateJobs(listings);
  const jobs: CanonicalJob[] = [];
  const sources: JobSourceRecord[] = [];

  for (const group of groups) {
    const primary = primaryListing(group);
    const core = normalizeJob(primary);
    const identity = companyIdentity(primary.company, primary.companyDomain);
    const facts = FACTS_BY_IDENTITY.get(identity);
    const firstSeen = earliestPostedAt(group.listings);
    const ageDays = ageDaysFrom(firstSeen);
    const repostCount = repostCountFor(group);
    const scores = scoreJob(
      buildScoringInput(group, facts, ageDays, repostCount, primary)
    );
    const jobId = `job-${group.fingerprint}`;

    jobs.push({
      id: jobId,
      organizationId: ORG_ID,
      companyId: identity,
      company: facts?.name ?? primary.company,
      companyDomain: primary.companyDomain ?? facts?.domain,
      title: primary.title,
      normalizedTitle: core.normalizedTitle,
      description: primary.description,
      location: core.location,
      employmentType: core.employmentType,
      workplaceType: core.workplaceType,
      salaryMin: core.salaryMin,
      salaryMax: core.salaryMax,
      currency: core.currency,
      fingerprint: group.fingerprint,
      firstSeenAt: firstSeen ?? "unknown",
      lastSeenAt: "2026-08-18T00:00:00.000Z",
      status: deriveStatus(group, repostCount),
      repostCount,
      scores
    });

    for (const listing of group.listings) {
      sources.push({
        id: `src-${listing.source}-${listing.externalId}`,
        jobId,
        source: listing.source,
        externalId: listing.externalId,
        sourceUrl: listing.sourceUrl,
        applyUrl: listing.applyUrl,
        firstSeenAt: listing.postedAt ?? firstSeen ?? "unknown",
        lastSeenAt: "2026-08-18T00:00:00.000Z",
        sourcePostedAt: listing.postedAt,
        sourceStatus: listing.sourceStatus ?? "unknown"
      });
    }
  }

  return { jobs, sources };
}

export interface JobSourceService {
  /** All canonical jobs, freshly ingested from the current source set. */
  ingest(): Promise<IngestResult>;
  getSourcesForJob(jobId: string): Promise<JobSourceRecord[]>;
}

class MockJobSourceService implements JobSourceService {
  async ingest(): Promise<IngestResult> {
    return ingestListings(MOCK_JOB_LISTINGS);
  }

  async getSourcesForJob(jobId: string): Promise<JobSourceRecord[]> {
    const { sources } = ingestListings(MOCK_JOB_LISTINGS);
    return sources.filter((s) => s.jobId === jobId);
  }
}

export const jobSourceService: JobSourceService = new MockJobSourceService();

/** Fingerprint helper re-export so callers can identify a raw listing. */
export { fingerprintJob };
