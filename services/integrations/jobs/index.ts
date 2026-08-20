import type { JobSource, NormalizedJob } from "@/types";

/**
 * Unified job-source integration layer.
 *
 * Every connector — an ATS API (Greenhouse, Lever, Ashby, Workday, iCIMS,
 * Bullhorn) or a job board (LinkedIn, Indeed, Glassdoor, ZipRecruiter, Dice,
 * Monster) — implements the SAME contract and emits the SAME `NormalizedJob`
 * shape. That abstraction is what lets the rest of SoloRec (normalization,
 * deduplication, scoring) stay completely source-agnostic; adding a new board
 * or ATS is a new file here, not a change anywhere downstream.
 *
 * Connectors in this starter are interface-complete but return empty results
 * until real API credentials / scraping are wired in — the seam is the
 * deliverable, not live ingestion.
 */

export interface JobSourceQuery {
  /** Free-text keywords, e.g. "Software Engineer". */
  keywords?: string;
  location?: string;
  /** For ATS connectors: the employer's board token / company slug. */
  company?: string;
  limit?: number;
}

export interface JobSourceConnector {
  readonly source: JobSource;
  readonly displayName: string;
  /** Whether real credentials/config are present for this connector. */
  isConfigured(): boolean;
  /** Fetch listings and return them in the normalized contract. */
  fetchJobs(query: JobSourceQuery): Promise<NormalizedJob[]>;
}

import { greenhouseConnector } from "@/services/integrations/jobs/ats/greenhouse";
import { leverConnector } from "@/services/integrations/jobs/ats/lever";
import { linkedinConnector } from "@/services/integrations/jobs/boards/linkedin";
import { indeedConnector } from "@/services/integrations/jobs/boards/indeed";

/** All registered connectors, keyed by source. */
export const JOB_SOURCE_CONNECTORS: Record<string, JobSourceConnector> = {
  greenhouse: greenhouseConnector,
  lever: leverConnector,
  linkedin: linkedinConnector,
  indeed: indeedConnector
};

export function getConnector(source: JobSource): JobSourceConnector | undefined {
  return JOB_SOURCE_CONNECTORS[source];
}

export function listConnectors(): JobSourceConnector[] {
  return Object.values(JOB_SOURCE_CONNECTORS);
}

/**
 * Fan a query out across every configured connector and flatten the results.
 * Unconfigured connectors are skipped; a single connector failure does not
 * fail the whole aggregate.
 */
export async function fetchFromAllSources(query: JobSourceQuery): Promise<NormalizedJob[]> {
  const active = listConnectors().filter((c) => c.isConfigured());
  const results = await Promise.allSettled(active.map((c) => c.fetchJobs(query)));
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
