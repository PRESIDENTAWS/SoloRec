-- ============================================================================
-- 0002 — Job Intelligence (canonical job model)
-- ============================================================================
-- One universal job record that many sources map onto (docs/JOB_INTELLIGENCE.md).
-- The canonical tables are prefixed `intel_` so the recruiting requisitions
-- domain can later own the unprefixed `jobs` table (docs/database-schema.md)
-- without a name collision — these are market-intelligence jobs ingested from
-- boards/ATSes, not internal requisitions.
--
-- Every table carries organization_id and is guarded by org-scoped RLS via the
-- helper functions from 0001. The service-role key (server-side) bypasses RLS.
-- ============================================================================

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

-- --- Companies (target accounts / intelligence view) ------------------------
create table companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  domain text,
  industry text,
  employee_count int,
  headquarters text,
  linkedin_url text,
  created_at timestamptz not null default now(),
  unique (organization_id, domain)
);
create index companies_org_idx on companies (organization_id);

-- --- Canonical jobs ----------------------------------------------------------
create table intel_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,

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
create index intel_jobs_company_idx on intel_jobs (company_id);
create index intel_jobs_org_status_idx on intel_jobs (organization_id, status);
create index intel_jobs_opportunity_idx
  on intel_jobs (organization_id, staffing_opportunity_score desc);

-- --- Per-source listings for a canonical job --------------------------------
create table intel_job_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  job_id uuid not null references intel_jobs(id) on delete cascade,
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
create index intel_job_sources_job_idx on intel_job_sources (job_id);

-- --- Point-in-time captures (history / repost detection) --------------------
create table intel_job_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  job_id uuid not null references intel_jobs(id) on delete cascade,
  captured_at timestamptz not null default now(),
  title text,
  description_hash text,
  salary_min numeric,
  salary_max numeric,
  source_status source_status not null default 'unknown'
);
create index intel_job_snapshots_job_idx on intel_job_snapshots (job_id, captured_at desc);

-- --- Discrete signals feeding the scores ------------------------------------
create table intel_job_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  job_id uuid not null references intel_jobs(id) on delete cascade,
  signal_type job_signal_type not null,
  value numeric,
  confidence numeric,
  evidence text,
  detected_at timestamptz not null default now()
);
create index intel_job_signals_job_idx on intel_job_signals (job_id);

-- --- Repost events -----------------------------------------------------------
create table intel_job_reposts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  job_id uuid not null references intel_jobs(id) on delete cascade,
  source job_source_kind not null,
  detected_at timestamptz not null default now()
);
create index intel_job_reposts_job_idx on intel_job_reposts (job_id);

-- --- Company-level signals ---------------------------------------------------
create table intel_company_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  signal_type company_signal_type not null,
  value numeric,
  confidence numeric,
  detected_at timestamptz not null default now()
);
create index intel_company_signals_company_idx on intel_company_signals (company_id);

-- --- Watchlists & saved searches --------------------------------------------
create table intel_watchlists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  owner_id uuid references profiles(id) on delete set null,
  name text not null,
  created_at timestamptz not null default now()
);

create table intel_watchlist_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  watchlist_id uuid not null references intel_watchlists(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  job_id uuid references intel_jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (company_id is not null or job_id is not null)
);
create index intel_watchlist_items_list_idx on intel_watchlist_items (watchlist_id);

create table intel_saved_searches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  owner_id uuid references profiles(id) on delete set null,
  name text not null,
  query jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index intel_saved_searches_owner_idx on intel_saved_searches (owner_id);

-- --- Row-level security (org-scoped) ----------------------------------------
-- Each table is readable/writable only within the caller's organization. The
-- service-role key used by the server bypasses RLS entirely.
do $$
declare
  t text;
begin
  foreach t in array array[
    'companies', 'intel_jobs', 'intel_job_sources', 'intel_job_snapshots',
    'intel_job_signals', 'intel_job_reposts', 'intel_company_signals',
    'intel_watchlists', 'intel_watchlist_items', 'intel_saved_searches'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format(
      'create policy %I on %I for all to authenticated
         using (organization_id = public.current_profile_org())
         with check (organization_id = public.current_profile_org());',
      t || '_org_scope', t
    );
  end loop;
end;
$$;
