import type { CanonicalJob } from "@/types";
import { jobService } from "@/services/recruiting/jobService";
import { companyIntelligenceService } from "@/services/recruiting/companyIntelligenceService";

/**
 * Job Intelligence orchestration.
 *
 * The read model behind the /job-intelligence overview: the market pulse
 * counters, the AI "who to contact today" recommendations, and the ranked
 * intel table. It composes the canonical jobs (jobService) and company
 * roll-ups (companyIntelligenceService) rather than computing scores itself —
 * the engine lives in lib/recruiting.
 */

const HOT_ACCOUNT_THRESHOLD = 85;
const HIGH_DEMAND_THRESHOLD = 65;

export interface MarketPulse {
  activeJobs: number;
  newLast7Days: number;
  highDemand: number;
  hotAccounts: number;
}

export interface IntelRecommendation {
  companyId: string;
  company: string;
  headline: string;
  staffingOpportunityMin: number;
  staffingOpportunityMax: number;
}

export interface JobIntelRow {
  jobId: string;
  companyId: string;
  company: string;
  title: string;
  location?: string;
  ghostRisk: number;
  hiringProbability: number;
  staffingOpportunity: number;
  isHotLead: boolean;
}

function toRow(job: CanonicalJob): JobIntelRow {
  return {
    jobId: job.id,
    companyId: job.companyId,
    company: job.company,
    title: job.title,
    location: job.location,
    ghostRisk: job.scores.ghostRisk,
    hiringProbability: job.scores.hiringProbability,
    staffingOpportunity: job.scores.staffingOpportunity,
    isHotLead: job.scores.staffingOpportunity >= HOT_ACCOUNT_THRESHOLD
  };
}

export interface JobIntelligenceService {
  getMarketPulse(): Promise<MarketPulse>;
  getRecommendations(): Promise<IntelRecommendation[]>;
  listIntelRows(): Promise<JobIntelRow[]>;
  /** Jobs observed as reposted on at least one source. */
  listRepostedRows(): Promise<JobIntelRow[]>;
  /** Jobs first seen within the last 7 days. */
  listNewRows(): Promise<JobIntelRow[]>;
  getJob(jobId: string): Promise<CanonicalJob | null>;
}

class MockJobIntelligenceService implements JobIntelligenceService {
  async getMarketPulse(): Promise<MarketPulse> {
    const jobs = await jobService.listJobs();
    const companies = await companyIntelligenceService.listCompanyIntelligence();
    return {
      activeJobs: jobs.filter((j) => j.status !== "closed").length,
      newLast7Days: jobs.filter((j) => j.scores.reasons.some((r) => r.includes("Posted"))).length,
      highDemand: jobs.filter((j) => j.scores.staffingOpportunity >= HIGH_DEMAND_THRESHOLD).length,
      hotAccounts: companies.filter((c) => c.hiringScore >= HOT_ACCOUNT_THRESHOLD).length
    };
  }

  async getRecommendations(): Promise<IntelRecommendation[]> {
    const companies = await companyIntelligenceService.listCompanyIntelligence();
    return companies
      .filter((c) => c.hiringScore >= HIGH_DEMAND_THRESHOLD)
      .map((c) => ({
        companyId: c.companyId,
        company: c.company,
        headline:
          c.hiringAccelerationPct >= 20
            ? `${c.engineeringJobs} eng roles, hiring +${c.hiringAccelerationPct}%`
            : `${c.openJobs} open reqs across ${c.hotLocations.length} locations`,
        staffingOpportunityMin: c.staffingOpportunityMin,
        staffingOpportunityMax: c.staffingOpportunityMax
      }));
  }

  async listIntelRows(): Promise<JobIntelRow[]> {
    const jobs = await jobService.listJobs();
    return jobs.map(toRow).sort((a, b) => b.staffingOpportunity - a.staffingOpportunity);
  }

  async listRepostedRows(): Promise<JobIntelRow[]> {
    const jobs = await jobService.listJobs();
    return jobs
      .filter((j) => j.repostCount > 0)
      .map(toRow)
      .sort((a, b) => b.staffingOpportunity - a.staffingOpportunity);
  }

  async listNewRows(): Promise<JobIntelRow[]> {
    const jobs = await jobService.listJobs();
    return jobs
      .filter((j) => j.scores.reasons.some((r) => r.includes("Posted")))
      .map(toRow)
      .sort((a, b) => b.staffingOpportunity - a.staffingOpportunity);
  }

  async getJob(jobId: string): Promise<CanonicalJob | null> {
    return jobService.getJob(jobId);
  }
}

export const jobIntelligenceService: JobIntelligenceService = new MockJobIntelligenceService();
