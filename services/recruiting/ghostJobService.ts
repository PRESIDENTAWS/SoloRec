import type { CanonicalJob } from "@/types";
import { jobService } from "@/services/recruiting/jobService";

/**
 * Ghost-risk views.
 *
 * A recruiter should not log in just to find fake jobs — but Ghost Risk is
 * still a first-class filter. This service exposes the ghost-risk lens over the
 * canonical jobs: the riskiest listings, and a portfolio ghost rate for reports.
 */

export type GhostRiskFilter = "all" | "high_only" | "clean_only";

const HIGH_GHOST_THRESHOLD = 65;
const LOW_GHOST_THRESHOLD = 25;

export interface GhostJobService {
  listByGhostRisk(filter?: GhostRiskFilter): Promise<CanonicalJob[]>;
  /** Share of jobs above the high-ghost threshold, 0–1. */
  ghostRate(): Promise<number>;
}

class MockGhostJobService implements GhostJobService {
  async listByGhostRisk(filter: GhostRiskFilter = "all"): Promise<CanonicalJob[]> {
    const jobs = await jobService.listJobs();
    const filtered = jobs.filter((j) => {
      if (filter === "high_only") return j.scores.ghostRisk >= HIGH_GHOST_THRESHOLD;
      if (filter === "clean_only") return j.scores.ghostRisk <= LOW_GHOST_THRESHOLD;
      return true;
    });
    return filtered.sort((a, b) => b.scores.ghostRisk - a.scores.ghostRisk);
  }

  async ghostRate(): Promise<number> {
    const jobs = await jobService.listJobs();
    if (jobs.length === 0) return 0;
    const high = jobs.filter((j) => j.scores.ghostRisk >= HIGH_GHOST_THRESHOLD).length;
    return high / jobs.length;
  }
}

export const ghostJobService: GhostJobService = new MockGhostJobService();
