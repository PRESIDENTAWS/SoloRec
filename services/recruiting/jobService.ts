import type { CanonicalJob } from "@/types";
import { jobSourceService } from "@/services/recruiting/jobSourceService";

/**
 * Canonical job read service.
 *
 * Sits on top of the ingestion pipeline (jobSourceService) and exposes the
 * canonical `CanonicalJob` records to the rest of the app. This is the seam a
 * real repository (Supabase `jobs` table) drops into unchanged.
 */
export interface JobService {
  listJobs(): Promise<CanonicalJob[]>;
  getJob(id: string): Promise<CanonicalJob | null>;
  listJobsForCompany(companyId: string): Promise<CanonicalJob[]>;
}

class MockJobService implements JobService {
  async listJobs(): Promise<CanonicalJob[]> {
    const { jobs } = await jobSourceService.ingest();
    return jobs;
  }

  async getJob(id: string): Promise<CanonicalJob | null> {
    const jobs = await this.listJobs();
    return jobs.find((j) => j.id === id) ?? null;
  }

  async listJobsForCompany(companyId: string): Promise<CanonicalJob[]> {
    const jobs = await this.listJobs();
    return jobs.filter((j) => j.companyId === companyId);
  }
}

export const jobService: JobService = new MockJobService();
