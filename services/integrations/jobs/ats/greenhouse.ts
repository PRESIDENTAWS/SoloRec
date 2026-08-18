import type { NormalizedJob } from "@/types";
import type { JobSourceConnector, JobSourceQuery } from "@/services/integrations/jobs";

/**
 * Greenhouse ATS connector.
 *
 * Greenhouse exposes a public job board API per employer:
 *   https://boards-api.greenhouse.io/v1/boards/{token}/jobs?content=true
 * That endpoint is authoritative (it is the employer's own ATS), so jobs from
 * here carry high source authority and always report a live `sourceStatus`.
 *
 * This starter ships the mapping and the contract; it does not fetch until an
 * employer board token is supplied. Wiring in the fetch is a change confined to
 * `fetchJobs` — nothing downstream moves.
 */

/** Shape of a Greenhouse board API job (subset we consume). */
interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  updated_at?: string;
  content?: string;
  location?: { name?: string };
  metadata?: Array<{ name: string; value: string | null }>;
}

/** Map one raw Greenhouse job onto the normalized contract. */
export function mapGreenhouseJob(raw: GreenhouseJob, company: string): NormalizedJob {
  return {
    externalId: String(raw.id),
    source: "greenhouse",
    title: raw.title,
    company,
    description: raw.content ?? "",
    location: raw.location?.name,
    postedAt: raw.updated_at,
    sourceStatus: "open",
    applyUrl: raw.absolute_url,
    sourceUrl: raw.absolute_url
  };
}

class GreenhouseConnector implements JobSourceConnector {
  readonly source = "greenhouse" as const;
  readonly displayName = "Greenhouse";

  isConfigured(): boolean {
    // Configured per-employer via a board token; none wired up in the starter.
    return false;
  }

  async fetchJobs(_query: JobSourceQuery): Promise<NormalizedJob[]> {
    // Real impl: fetch boards-api.greenhouse.io/v1/boards/{token}/jobs and
    // map each with mapGreenhouseJob(raw, employerName).
    return [];
  }
}

export const greenhouseConnector: JobSourceConnector = new GreenhouseConnector();
