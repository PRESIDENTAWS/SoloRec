-- ============================================================================
-- Job Intelligence — canonical job model (design-target migration)
-- ============================================================================
-- No database is connected in this starter; services/* are mock
-- implementations (see docs/database-schema.md). This migration is the schema
-- those services are designed to be swapped onto. The central decision here is
-- ONE universal job record (`jobs`) that many sources map onto — not a separate
-- linkedin_jobs / indeed_jobs / workday_jobs table per source. A single
-- opportunity can appear on LinkedIn, Indeed, the company career site and
-- Workday at once; SoloRec collapses them into one canonical job with many
-- `job_sources`, and builds historical intelligence in `job_snapshots`,
-- `job_signals`, `job_scores` and `company_signals`.
--
-- Every table carries organization_id for row-level tenancy
-- (docs/architecture/03-security-and-tenancy.md). RLS policies are added in a
-- later migration once auth is wired.
-- ============================================================================

create extension if not exists "pgcrypto";

-- --- Enumerated domains ------------------------------------------------------
create type job_source_kind as enum (
  'employer_ats', 'company_career_site',
  'greenhouse', 'lever', 'ashby', 'workday', 'icims', 'bullhorn',
  'linkedin', 'indeed', 'glassdoor', 'ziprecruiter', 'dice', 'monster',
  'other_aggregator'
);

create type canonical_job_status as enum ('open', 'reposted', 'stale', 'closed');
create type source_status as enum ('open', 'closed', 'unknown');
create type job_signal_type as enum (
  'listed_on_employer_ats', 'recently_posted', 'multiple_openings', 'reposted',
  'salary_disclosed', 'company_expanding', 'stale_third_party_listing',
  'closed_on_authoritative_source', 'conflicting_source_status'
);
create type company_signal_type as enum (
  'hiring_acceleration', 'engineering_demand', 'multi_location_hiring',
  'high_open_req_count', 'repeat_staffing_pattern'
);

-- --- Companies (intelligence view) ------------------------------------------
-- Distinct from the CRM `clients` table: a company can be a target account
-- surfaced by Job Intelligence long before it becomes a paying client.
create table if not exists companies_intel (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  name text not null,
  domain text,
  industry text,
  employee_count int,
  headquarters text,
  linkedin_url text,
  created_at timestamptz not null default now(),
  unique (organization_id, domain)
);

-- --- Canonical jobs ----------------------------------------------------------
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  company_id uuid not null references companies_intel(id) on delete cascade,

  title text not null,
  normalized_title text not null,
  description text,
  location text,
  employment_type text,
  workplace_type text,

  salary_min numeric,
  salary_max numeric,
  currency text not null default 'USD',

  -- Stable content identity used to fold duplicate postings together.
  fingerprint text not null,

  first_seen_at timestamptz,
  last_seen_at timestamptz,
  status canonical_job_status not null default 'open',
  repost_count int not null default 0,

  -- Cached three-score outputs (computed in lib/recruiting).
  ghost_score int,
  hiring_probability int,
  staffing_opportunity_score int,

  created_at timestamptz not null default now(),
  unique (organization_id, fingerprint)
);
create index if not exists jobs_company_idx on jobs (company_id);
create index if not exists jobs_org_status_idx on jobs (organization_id, status);
create index if not exists jobs_opportunity_idx on jobs (organization_id, staffing_opportunity_score desc);

-- --- Per-source listings for a canonical job --------------------------------
create table if not exists job_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  job_id uuid not null references jobs(id) on delete cascade,
  source job_source_kind not null,
  external_id text not null,
  source_url text not null,
  apply_url text,
  first_seen_at timestamptz,
  last_seen_at timestamptz,
  source_posted_at timestamptz,
  source_status source_status not null default 'unknown',
  unique (source, external_id)
);
create index if not exists job_sources_job_idx on job_sources (job_id);

-- --- Point-in-time captures (history / repost detection) --------------------
create table if not exists job_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  job_id uuid not null references jobs(id) on delete cascade,
  captured_at timestamptz not null default now(),
  title text,
  description_hash text,
  salary_min numeric,
  salary_max numeric,
  source_status source_status not null default 'unknown'
);
create index if not exists job_snapshots_job_idx on job_snapshots (job_id, captured_at desc);

-- --- Discrete signals feeding the scores ------------------------------------
create table if not exists job_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  job_id uuid not null references jobs(id) on delete cascade,
  signal_type job_signal_type not null,
  value numeric,
  confidence numeric,
  evidence text,
  detected_at timestamptz not null default now()
);
create index if not exists job_signals_job_idx on job_signals (job_id);

-- --- Repost events -----------------------------------------------------------
create table if not exists job_reposts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  job_id uuid not null references jobs(id) on delete cascade,
  source job_source_kind not null,
  detected_at timestamptz not null default now()
);
create index if not exists job_reposts_job_idx on job_reposts (job_id);

-- --- Company-level signals ---------------------------------------------------
create table if not exists company_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  company_id uuid not null references companies_intel(id) on delete cascade,
  signal_type company_signal_type not null,
  value numeric,
  confidence numeric,
  detected_at timestamptz not null default now()
);
create index if not exists company_signals_company_idx on company_signals (company_id);

-- --- Watchlists & saved searches --------------------------------------------
create table if not exists job_watchlists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  owner_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists job_watchlist_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  watchlist_id uuid not null references job_watchlists(id) on delete cascade,
  -- A watchlist item targets either a company or a specific canonical job.
  company_id uuid references companies_intel(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (company_id is not null or job_id is not null)
);
create index if not exists job_watchlist_items_list_idx on job_watchlist_items (watchlist_id);

create table if not exists saved_job_searches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  owner_id uuid not null,
  name text not null,
  -- Serialized query: keywords, location, source and score filters.
  query jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists saved_job_searches_owner_idx on saved_job_searches (owner_id);
