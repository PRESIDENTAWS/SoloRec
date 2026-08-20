import type { NormalizedJob } from "@/types";
import type { JobSourceConnector, JobSourceQuery } from "@/services/integrations/jobs";

/**
 * Indeed job board connector.
 *
 * Board-level source (lower authority than an employer ATS). Ships the
 * contract only; real retrieval requires Indeed's publisher/partner access.
 */
class IndeedConnector implements JobSourceConnector {
  readonly source = "indeed" as const;
  readonly displayName = "Indeed";

  isConfigured(): boolean {
    return false;
  }

  async fetchJobs(_query: JobSourceQuery): Promise<NormalizedJob[]> {
    return [];
  }
}

export const indeedConnector: JobSourceConnector = new IndeedConnector();
