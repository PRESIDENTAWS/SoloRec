-- CRM

create table companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  website text,
  industry text,
  employee_count integer,
  headquarters text,
  description text,
  status text not null default 'active',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index companies_org_idx on companies(organization_id);
create trigger set_updated_at before update on companies
  for each row execute function public.set_updated_at();

create table contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  first_name text not null,
  last_name text not null,
  title text,
  email text,
  phone text,
  linkedin_url text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contacts_org_idx on contacts(organization_id);
create index contacts_company_idx on contacts(company_id);
create trigger set_updated_at before update on contacts
  for each row execute function public.set_updated_at();

create table clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  status client_status not null default 'prospect',
  owner_user_id uuid references auth.users(id),
  fee_type fee_type not null default 'percentage',
  fee_percentage numeric(5,2),
  payment_terms_days integer not null default 30,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, company_id)
);
create index clients_org_idx on clients(organization_id);
create trigger set_updated_at before update on clients
  for each row execute function public.set_updated_at();

-- Recruiting

create table jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  company_id uuid references companies(id) on delete set null,
  title text not null,
  department text,
  location text,
  workplace_type workplace_type not null default 'onsite',
  employment_type employment_type not null default 'direct_hire',
  description text,
  requirements text,
  preferred_qualifications text,
  salary_min numeric(12,2),
  salary_max numeric(12,2),
  currency text not null default 'USD',
  fee_percentage numeric(5,2),
  status job_status not null default 'draft',
  priority job_priority not null default 'medium',
  owner_user_id uuid references auth.users(id),
  opened_at timestamptz,
  target_fill_date date,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index jobs_org_idx on jobs(organization_id);
create index jobs_org_status_idx on jobs(organization_id, status);
create trigger set_updated_at before update on jobs
  for each row execute function public.set_updated_at();

create table candidates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  location text,
  current_title text,
  current_company text,
  linkedin_url text,
  years_experience numeric(4,1),
  salary_expectation numeric(12,2),
  currency text not null default 'USD',
  summary text,
  skills text[] not null default '{}',
  source text,
  status candidate_status not null default 'active',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index candidates_org_idx on candidates(organization_id);
create index candidates_org_status_idx on candidates(organization_id, status);
create index candidates_skills_gin_idx on candidates using gin(skills);
create index candidates_search_idx on candidates using gin (
  to_tsvector(
    'english',
    coalesce(first_name,'') || ' ' || coalesce(last_name,'') || ' ' ||
    coalesce(current_title,'') || ' ' || coalesce(current_company,'')
  )
);
create trigger set_updated_at before update on candidates
  for each row execute function public.set_updated_at();

-- Pipeline

create table applications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  stage application_stage not null default 'sourced',
  status text not null default 'active',
  match_score numeric(5,2),
  owner_user_id uuid references auth.users(id),
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);
create index applications_org_idx on applications(organization_id);
create index applications_job_idx on applications(job_id);
create index applications_candidate_idx on applications(candidate_id);
create trigger set_updated_at before update on applications
  for each row execute function public.set_updated_at();

create table submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  submitted_by uuid references auth.users(id),
  summary text,
  submitted_at timestamptz,
  status submission_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index submissions_org_idx on submissions(organization_id);
create index submissions_application_idx on submissions(application_id);
create trigger set_updated_at before update on submissions
  for each row execute function public.set_updated_at();

create table interviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  type text,
  scheduled_at timestamptz,
  duration_minutes integer,
  location_or_link text,
  status interview_status not null default 'scheduled',
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index interviews_org_idx on interviews(organization_id);
create index interviews_application_idx on interviews(application_id);
create trigger set_updated_at before update on interviews
  for each row execute function public.set_updated_at();

create table placements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  start_date date,
  salary numeric(12,2),
  fee_amount numeric(12,2),
  status placement_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index placements_org_idx on placements(organization_id);
create trigger set_updated_at before update on placements
  for each row execute function public.set_updated_at();

create table tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  description text,
  status task_status not null default 'open',
  priority task_priority not null default 'medium',
  assigned_user_id uuid references auth.users(id),
  related_entity_type text,
  related_entity_id uuid,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_org_idx on tasks(organization_id);
create index tasks_related_idx on tasks(related_entity_type, related_entity_id);
create trigger set_updated_at before update on tasks
  for each row execute function public.set_updated_at();

-- Standard tenant-isolation RLS across every table in this file — see
-- user_organization_ids() in 20260815000002_identity_and_tenancy.sql.
do $$
declare
  t text;
begin
  foreach t in array array[
    'companies','contacts','clients','jobs','candidates',
    'applications','submissions','interviews','placements','tasks'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy tenant_isolation on %I for all using (organization_id in (select public.user_organization_ids())) with check (organization_id in (select public.user_organization_ids()))',
      t
    );
  end loop;
end $$;
