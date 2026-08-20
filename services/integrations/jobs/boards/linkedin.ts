import type { NormalizedJob } from "@/types";
import type { JobSourceConnector, JobSourceQuery } from "@/services/integrations/jobs";

/**
 * LinkedIn job board connector.
 *
 * A board is a third-party surface, not the employer's system of record — so
 * jobs from here carry lower source authority and an often-unknown live status
 * (see lib/recruiting/source-authority.ts). When a board says OPEN but the
 * employer ATS says CLOSED, SoloRec treats the board copy as stale.
 *
 * Access requires a partner API or compliant retrieval; the starter ships the
 * contract only.
 */
class LinkedInConnector implements JobSourceConnector {
  readonly source = "linkedin" as const;
  readonly displayName = "LinkedIn";

  isConfigured(): boolean {
    return false;
  }

  async fetchJobs(_query: JobSourceQuery): Promise<NormalizedJob[]> {
    return [];
  }
}

export const linkedinConnector: JobSourceConnector = new LinkedInConnector();
