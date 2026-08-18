import type { CanonicalJob, CompanyIntelligence } from "@/types";
import { jobService } from "@/services/recruiting/jobService";
import { MOCK_COMPANY_FACTS } from "@/lib/recruiting/mockJobIntel";
import { isEngineeringFamily, jobFamily } from "@/lib/recruiting/job-normalizer";
import { estimateStaffingValue } from "@/lib/recruiting/ghost-score";
import { salaryMidpoint } from "@/lib/recruiting/salary-normalizer";

/**
 * Company-level intelligence roll-up.
 *
 * This is where Job Intelligence stops being a search engine and starts being
 * an account-targeting system: aggregate a company's canonical jobs into
 * hiring velocity, demand mix, hot locations and an estimated staffing
 * opportunity range — the inputs to "Create BD Opportunity".
 */

const FACTS = new Map(MOCK_COMPANY_FACTS.map((f) => [f.identity, f]));

function buildForCompany(companyId: string, jobs: CanonicalJob[]): CompanyIntelligence {
  const facts = FACTS.get(companyId);
  const company = facts?.name ?? jobs[0]?.company ?? companyId;

  const engineeringJobs = jobs.filter((j) => isEngineeringFamily(jobFamily(j.title))).length;
  const reposted = jobs.filter((j) => j.repostCount > 0).length;
  const locations = [...new Set(jobs.map((j) => j.location).filter((l): l is string => Boolean(l)))];

  // Demand mix by job family, most common first.
  const familyCounts = new Map<string, number>();
  for (const j of jobs) {
    const family = jobFamily(j.title);
    familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
  }
  const primaryDemand =
    facts?.primaryDemand ??
    [...familyCounts.entries()].sort((a, b) => b[1] - a[1]).map(([f]) => f).slice(0, 3);

  // Hiring score blends the jobs' own opportunity scores with company velocity.
  const avgOpportunity =
    jobs.length > 0
      ? jobs.reduce((sum, j) => sum + j.scores.staffingOpportunity, 0) / jobs.length
      : 0;
  const acceleration = facts?.hiringAccelerationPct ?? 0;
  const hiringScore = Math.round(Math.min(100, 0.7 * avgOpportunity + acceleration));

  // Staffing opportunity range: sum estimated fee bands across the open reqs.
  let oppMin = 0;
  let oppMax = 0;
  for (const j of jobs) {
    const mid = salaryMidpoint({
      min: j.salaryMin,
      max: j.salaryMax,
      currency: j.currency,
      disclosed: j.salaryMin !== undefined || j.salaryMax !== undefined
    });
    const est = estimateStaffingValue(mid, facts?.openReqs ?? jobs.length);
    if (est) {
      oppMin += est.min;
      oppMax += est.max;
    }
  }

  return {
    companyId,
    company,
    companyDomain: facts?.domain ?? jobs[0]?.companyDomain,
    openJobs: facts?.openReqs ?? jobs.length,
    engineeringJobs: facts?.engineeringReqs ?? engineeringJobs,
    jobsPostedLast7Days: jobs.filter((j) => j.scores.reasons.some((r) => r.includes("Posted"))).length,
    repostedJobs: reposted,
    hiringLocations: facts?.locations ?? locations,
    hiringScore,
    hiringAccelerationPct: acceleration,
    primaryDemand,
    hotLocations: (facts?.locations ?? locations).slice(0, 3),
    staffingOpportunityMin: Math.round(oppMin),
    staffingOpportunityMax: Math.round(oppMax)
  };
}

export interface CompanyIntelligenceService {
  listCompanyIntelligence(): Promise<CompanyIntelligence[]>;
  getCompanyIntelligence(companyId: string): Promise<CompanyIntelligence | null>;
}

class MockCompanyIntelligenceService implements CompanyIntelligenceService {
  async listCompanyIntelligence(): Promise<CompanyIntelligence[]> {
    const jobs = await jobService.listJobs();
    const byCompany = new Map<string, CanonicalJob[]>();
    for (const job of jobs) {
      const bucket = byCompany.get(job.companyId);
      if (bucket) bucket.push(job);
      else byCompany.set(job.companyId, [job]);
    }
    return [...byCompany.entries()]
      .map(([companyId, companyJobs]) => buildForCompany(companyId, companyJobs))
      .sort((a, b) => b.hiringScore - a.hiringScore);
  }

  async getCompanyIntelligence(companyId: string): Promise<CompanyIntelligence | null> {
    const jobs = await jobService.listJobsForCompany(companyId);
    if (jobs.length === 0) return null;
    return buildForCompany(companyId, jobs);
  }
}

export const companyIntelligenceService: CompanyIntelligenceService =
  new MockCompanyIntelligenceService();
