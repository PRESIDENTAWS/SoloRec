import type { NormalizedJob } from "@/types";
import type { JobSourceConnector, JobSourceQuery } from "@/services/integrations/jobs";

/**
 * Lever ATS connector.
 *
 * Lever exposes a public postings API per employer:
 *   https://api.lever.co/v0/postings/{company}?mode=json
 * Authoritative source (the employer's own ATS). Ships the mapping and
 * contract; fetch is wired once an employer slug is configured.
 */

interface LeverPosting {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl?: string;
  createdAt?: number;
  descriptionPlain?: string;
  categories?: { location?: string; commitment?: string };
}

export function mapLeverPosting(raw: LeverPosting, company: string): NormalizedJob {
  return {
    externalId: raw.id,
    source: "lever",
    title: raw.text,
    company,
    description: raw.descriptionPlain ?? "",
    location: raw.categories?.location,
    postedAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : undefined,
    sourceStatus: "open",
    applyUrl: raw.applyUrl ?? raw.hostedUrl,
    sourceUrl: raw.hostedUrl
  };
}

class LeverConnector implements JobSourceConnector {
  readonly source = "lever" as const;
  readonly displayName = "Lever";

  isConfigured(): boolean {
    return false;
  }

  async fetchJobs(_query: JobSourceQuery): Promise<NormalizedJob[]> {
    // Real impl: fetch api.lever.co/v0/postings/{company}?mode=json and map
    // each with mapLeverPosting(raw, employerName).
    return [];
  }
}

export const leverConnector: JobSourceConnector = new LeverConnector();
