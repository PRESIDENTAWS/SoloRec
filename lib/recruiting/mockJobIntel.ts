import type { NormalizedJob } from "@/types";

/**
 * MOCK DATA — raw source listings for the Job Intelligence scaffold.
 *
 * These are deliberately *raw* `NormalizedJob`s (the integration contract),
 * not pre-scored rows: the services run them through the real lib/recruiting
 * engine (dedup → signals → three scores) so the UI reflects the actual logic,
 * not hand-tuned numbers. Some opportunities appear on multiple sources to
 * exercise deduplication and source-authority conflict resolution.
 *
 * Once a real backend is connected, these are replaced by connector output
 * (services/integrations/jobs) with no change to the services or the engine.
 */

export interface MockCompanyFacts {
  identity: string;
  name: string;
  domain: string;
  industry: string;
  /** Total currently-open requisitions at the company. */
  openReqs: number;
  engineeringReqs: number;
  /** Hiring-velocity change as a percentage (e.g. 27 => +27%). */
  hiringAccelerationPct: number;
  locations: string[];
  primaryDemand: string[];
}

export const MOCK_COMPANY_FACTS: MockCompanyFacts[] = [
  {
    identity: "lockheedmartin.com",
    name: "Lockheed Martin",
    domain: "lockheedmartin.com",
    industry: "Aerospace & Defense",
    openReqs: 14,
    engineeringReqs: 11,
    hiringAccelerationPct: 27,
    locations: ["Orlando, FL", "Fort Worth, TX", "Denver, CO"],
    primaryDemand: ["Software Engineering", "Cybersecurity", "Systems Engineering"]
  },
  {
    identity: "rtx.com",
    name: "RTX",
    domain: "rtx.com",
    industry: "Aerospace & Defense",
    openReqs: 9,
    engineeringReqs: 7,
    hiringAccelerationPct: 19,
    locations: ["Tucson, AZ", "McKinney, TX"],
    primaryDemand: ["Systems Engineering", "Software Engineering"]
  },
  {
    identity: "northropgrumman.com",
    name: "Northrop Grumman",
    domain: "northropgrumman.com",
    industry: "Aerospace & Defense",
    openReqs: 12,
    engineeringReqs: 9,
    hiringAccelerationPct: 31,
    locations: ["San Diego, CA", "Baltimore, MD"],
    primaryDemand: ["Software Engineering", "Systems Engineering"]
  },
  {
    identity: "boozallen.com",
    name: "Booz Allen Hamilton",
    domain: "boozallen.com",
    industry: "Consulting",
    openReqs: 6,
    engineeringReqs: 4,
    hiringAccelerationPct: 12,
    locations: ["McLean, VA", "Tampa, FL"],
    primaryDemand: ["Cloud", "Cybersecurity"]
  },
  {
    identity: "atlashealth.com",
    name: "Atlas Health",
    domain: "atlashealth.com",
    industry: "Healthcare",
    openReqs: 22,
    engineeringReqs: 2,
    hiringAccelerationPct: 43,
    locations: ["Dallas, TX", "Phoenix, AZ", "Atlanta, GA"],
    primaryDemand: ["Nursing & Clinical"]
  },
  {
    identity: "vertexailabs.com",
    name: "Vertex AI Labs",
    domain: "vertexailabs.com",
    industry: "Artificial Intelligence",
    openReqs: 6,
    engineeringReqs: 6,
    hiringAccelerationPct: 38,
    locations: ["San Francisco, CA", "Remote"],
    primaryDemand: ["Data & AI", "Software Engineering"]
  },
  {
    identity: "acmeaero.com",
    name: "Acme Aerospace",
    domain: "acmeaero.com",
    industry: "Aerospace",
    openReqs: 2,
    engineeringReqs: 1,
    hiringAccelerationPct: 0,
    locations: ["Wichita, KS"],
    primaryDemand: ["Other"]
  }
];

/** First-seen dates drive age-based scoring; anchored near 2026-08-18. */
export const MOCK_JOB_LISTINGS: NormalizedJob[] = [
  // Lockheed — same opportunity on ATS + a board (dedups to one, ATS wins).
  {
    externalId: "gh-lm-88213",
    source: "greenhouse",
    title: "Senior Cybersecurity Engineer",
    company: "Lockheed Martin",
    companyDomain: "lockheedmartin.com",
    description: "Lead defensive security engineering for mission systems. Clearance required.",
    location: "Orlando, FL",
    salaryMin: 135000,
    salaryMax: 165000,
    currency: "USD",
    postedAt: "2026-08-15T00:00:00.000Z",
    sourceStatus: "open",
    applyUrl: "https://boards.greenhouse.io/lockheedmartin/jobs/88213",
    sourceUrl: "https://boards.greenhouse.io/lockheedmartin/jobs/88213"
  },
  {
    externalId: "li-77120",
    source: "linkedin",
    title: "Sr. Cybersecurity Engineer",
    company: "Lockheed Martin",
    companyDomain: "lockheedmartin.com",
    description: "Defensive security engineering for mission systems.",
    location: "Orlando, FL",
    postedAt: "2026-08-16T00:00:00.000Z",
    sourceStatus: "open",
    applyUrl: "https://linkedin.com/jobs/view/77120",
    sourceUrl: "https://linkedin.com/jobs/view/77120"
  },
  // RTX — fresh ATS listing.
  {
    externalId: "wd-rtx-4410",
    source: "workday",
    title: "Systems Engineer II",
    company: "RTX",
    companyDomain: "rtx.com",
    description: "Model-based systems engineering across radar programs.",
    location: "Tucson, AZ",
    salaryMin: 118000,
    salaryMax: 148000,
    currency: "USD",
    postedAt: "2026-08-13T00:00:00.000Z",
    sourceStatus: "open",
    applyUrl: "https://rtx.wd5.myworkdayjobs.com/jobs/4410",
    sourceUrl: "https://rtx.wd5.myworkdayjobs.com/jobs/4410"
  },
  // Northrop — very hot, multi-source agreement.
  {
    externalId: "gh-ng-5521",
    source: "greenhouse",
    title: "Aegis Combat Systems Engineer",
    company: "Northrop Grumman",
    companyDomain: "northropgrumman.com",
    description: "Combat systems integration for naval platforms.",
    location: "San Diego, CA",
    salaryMin: 128000,
    salaryMax: 158000,
    currency: "USD",
    postedAt: "2026-08-17T00:00:00.000Z",
    sourceStatus: "open",
    applyUrl: "https://boards.greenhouse.io/northropgrumman/jobs/5521",
    sourceUrl: "https://boards.greenhouse.io/northropgrumman/jobs/5521"
  },
  // Booz Allen — cloud role on career site, mid strength.
  {
    externalId: "cs-ba-9032",
    source: "company_career_site",
    title: "Cloud Engineer",
    company: "Booz Allen Hamilton",
    companyDomain: "boozallen.com",
    description: "AWS-based cloud modernization for federal clients.",
    location: "Tampa, FL",
    salaryMin: 110000,
    salaryMax: 140000,
    currency: "USD",
    postedAt: "2026-08-02T00:00:00.000Z",
    sourceStatus: "open",
    applyUrl: "https://careers.boozallen.com/jobs/9032",
    sourceUrl: "https://careers.boozallen.com/jobs/9032"
  },
  // Atlas Health — nursing, high company acceleration.
  {
    externalId: "wd-atlas-2201",
    source: "workday",
    title: "Registered Nurse — ICU",
    company: "Atlas Health",
    companyDomain: "atlashealth.com",
    description: "ICU RN, night shift, sign-on bonus.",
    location: "Dallas, TX",
    salaryMin: 88000,
    salaryMax: 112000,
    currency: "USD",
    postedAt: "2026-08-14T00:00:00.000Z",
    sourceStatus: "open",
    applyUrl: "https://atlashealth.wd1.myworkdayjobs.com/jobs/2201",
    sourceUrl: "https://atlashealth.wd1.myworkdayjobs.com/jobs/2201"
  },
  // Vertex AI — brand-new AI role.
  {
    externalId: "ash-vx-771",
    source: "ashby",
    title: "Machine Learning Engineer",
    company: "Vertex AI Labs",
    companyDomain: "vertexailabs.com",
    description: "Train and serve large models; remote-friendly.",
    location: "Remote",
    salaryMin: 170000,
    salaryMax: 210000,
    currency: "USD",
    postedAt: "2026-08-17T00:00:00.000Z",
    sourceStatus: "open",
    applyUrl: "https://jobs.ashbyhq.com/vertexailabs/771",
    sourceUrl: "https://jobs.ashbyhq.com/vertexailabs/771"
  },
  // Acme — classic ghost: aggregator only, aged, and a stale board copy that
  // conflicts with a career-site "closed".
  {
    externalId: "mon-acme-3390",
    source: "monster",
    title: "Software Developer",
    company: "Acme Aerospace",
    companyDomain: "acmeaero.com",
    description: "General software development role.",
    location: "Wichita, KS",
    postedAt: "2026-06-01T00:00:00.000Z",
    sourceStatus: "open",
    applyUrl: "https://monster.com/jobs/3390",
    sourceUrl: "https://monster.com/jobs/3390"
  },
  {
    externalId: "cs-acme-118",
    source: "company_career_site",
    title: "Software Developer",
    company: "Acme Aerospace",
    companyDomain: "acmeaero.com",
    description: "General software development role.",
    location: "Wichita, KS",
    postedAt: "2026-06-01T00:00:00.000Z",
    sourceStatus: "closed",
    applyUrl: "https://careers.acmeaero.com/jobs/118",
    sourceUrl: "https://careers.acmeaero.com/jobs/118"
  }
];

/** Per-opportunity repost counts, keyed by the earliest listing's externalId. */
export const MOCK_REPOST_COUNTS: Record<string, number> = {
  "gh-lm-88213": 1,
  "gh-ng-5521": 1,
  "mon-acme-3390": 5
};
