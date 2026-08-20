import type { CanonicalJob, CompanyIntelligence } from "@/types";
import { jobService } from "@/services/recruiting/jobService";
import { companyIntelligenceService } from "@/services/recruiting/companyIntelligenceService";

/**
 * Hiring-signal surfacing.
 *
 * The scoring engine already derives per-job evidence (JobScores.reasons); this
 * service exposes it as a feed and rolls company-level hiring momentum up for
 * the "Hiring Signals" view — who is accelerating, and why.
 */

export interface JobHiringSignal {
  jobId: string;
  company: string;
  title: string;
  evidence: string[];
  hiringProbability: number;
}

export interface CompanyHiringSignal {
  companyId: string;
  company: string;
  hiringAccelerationPct: number;
  openJobs: number;
  primaryDemand: string[];
  headline: string;
}

function companyHeadline(intel: CompanyIntelligence): string {
  if (intel.hiringAccelerationPct >= 25) {
    return `${intel.company} hiring +${intel.hiringAccelerationPct}% — ${intel.primaryDemand[0] ?? "multiple"} demand rising`;
  }
  if (intel.openJobs >= 10) {
    return `${intel.company} running ${intel.openJobs} open reqs across ${intel.hotLocations.length} locations`;
  }
  return `${intel.company} steady hiring in ${intel.primaryDemand[0] ?? "core roles"}`;
}

export interface HiringSignalService {
  listJobSignals(): Promise<JobHiringSignal[]>;
  listCompanySignals(): Promise<CompanyHiringSignal[]>;
}

class MockHiringSignalService implements HiringSignalService {
  async listJobSignals(): Promise<JobHiringSignal[]> {
    const jobs = await jobService.listJobs();
    return jobs
      .map((job: CanonicalJob) => ({
        jobId: job.id,
        company: job.company,
        title: job.title,
        evidence: job.scores.reasons,
        hiringProbability: job.scores.hiringProbability
      }))
      .sort((a, b) => b.hiringProbability - a.hiringProbability);
  }

  async listCompanySignals(): Promise<CompanyHiringSignal[]> {
    const intel = await companyIntelligenceService.listCompanyIntelligence();
    return intel
      .map((c) => ({
        companyId: c.companyId,
        company: c.company,
        hiringAccelerationPct: c.hiringAccelerationPct,
        openJobs: c.openJobs,
        primaryDemand: c.primaryDemand,
        headline: companyHeadline(c)
      }))
      .sort((a, b) => b.hiringAccelerationPct - a.hiringAccelerationPct);
  }
}

export const hiringSignalService: HiringSignalService = new MockHiringSignalService();
