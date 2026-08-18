import type { JobSource, NormalizedJob, SourceStatus } from "@/types";
import { fingerprintJob } from "@/lib/recruiting/job-fingerprint";
import { isAuthoritativeSource, sourceAuthority } from "@/lib/recruiting/source-authority";

/**
 * Deduplication — folds many raw source listings into one group per
 * opportunity, and resolves conflicting facts across sources by authority.
 *
 * This is where SoloRec decides that a LinkedIn "OPEN" and a Workday "CLOSED"
 * for the same fingerprint means the opportunity is *closed* and the LinkedIn
 * copy is stale — not that there are two jobs.
 */

export interface DedupedJobGroup {
  fingerprint: string;
  /** All raw listings that resolved to this opportunity. */
  listings: NormalizedJob[];
  sources: JobSource[];
  /** Status implied by the most authoritative source that stated one. */
  resolvedStatus: SourceStatus;
  /** True when a low-authority board disagrees with an authoritative source. */
  hasConflictingStatus: boolean;
  /** True when at least one listing came from an ATS / career site. */
  onAuthoritativeSource: boolean;
}

function resolveStatus(listings: NormalizedJob[]): {
  status: SourceStatus;
  conflicting: boolean;
} {
  const stated = listings.filter((l) => l.sourceStatus && l.sourceStatus !== "unknown");
  if (stated.length === 0) return { status: "unknown", conflicting: false };

  const ranked = [...stated].sort((a, b) => sourceAuthority(b.source) - sourceAuthority(a.source));
  const authoritative = ranked[0]!;
  const status = authoritative.sourceStatus as SourceStatus;

  // Conflict: a meaningfully-less-authoritative source claims the opposite.
  const conflicting = stated.some(
    (l) =>
      l.sourceStatus !== status &&
      sourceAuthority(authoritative.source) - sourceAuthority(l.source) >= 10
  );

  return { status, conflicting };
}

/** Group raw listings by fingerprint into resolved opportunities. */
export function deduplicateJobs(jobs: NormalizedJob[]): DedupedJobGroup[] {
  const groups = new Map<string, NormalizedJob[]>();

  for (const job of jobs) {
    const fp = fingerprintJob(job);
    const bucket = groups.get(fp);
    if (bucket) bucket.push(job);
    else groups.set(fp, [job]);
  }

  return [...groups.entries()].map(([fingerprint, listings]) => {
    const sources = [...new Set(listings.map((l) => l.source))];
    const { status, conflicting } = resolveStatus(listings);
    return {
      fingerprint,
      listings,
      sources,
      resolvedStatus: status,
      hasConflictingStatus: conflicting,
      onAuthoritativeSource: sources.some(isAuthoritativeSource)
    };
  });
}
