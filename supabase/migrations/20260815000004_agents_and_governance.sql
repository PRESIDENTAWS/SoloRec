-- Agent registry, tasks, events, approvals, matching, audit — see
-- docs/AI_AGENT_ARCHITECTURE.md and
-- docs/architecture/04-ai-and-agents.md#k-human-approval-engine.

create table agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_key text not null,
  name text not null,
  role text not null,
  department text not null,
  status agent_status not null default 'idle',
  autonomy_level smallint not null default 1 check (autonomy_level between 0 and 5),
  health smallint not null default 100 check (health between 0 and 100),
  system_prompt_version text,
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, agent_key)
);
create index agents_org_idx on agents(organization_id);
create trigger set_updated_at before update on agents
  for each row execute function public.set_updated_at();

create table agent_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  task_type agent_task_type not null,
  status agent_task_status not null default 'queued',
  priority task_priority not null default 'medium',
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  related_entity_type text,
  related_entity_id uuid,
  created_by_user_id uuid references auth.users(id),
  started_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index agent_tasks_org_idx on agent_tasks(organization_id);
create index agent_tasks_agent_idx on agent_tasks(agent_id);
create index agent_tasks_related_idx on agent_tasks(related_entity_type, related_entity_id);
create trigger set_updated_at before update on agent_tasks
  for each row execute function public.set_updated_at();

create table agent_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete cascade,
  agent_task_id uuid references agent_tasks(id) on delete cascade,
  event_type text not null,
  severity agent_event_severity not null default 'info',
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index agent_events_org_idx on agent_events(organization_id);
create index agent_events_org_created_idx on agent_events(organization_id, created_at desc);
create index agent_events_task_idx on agent_events(agent_task_id);

create table approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete cascade,
  agent_task_id uuid references agent_tasks(id) on delete cascade,
  action_type approval_action_type not null,
  status approval_status not null default 'pending',
  risk_level approval_risk_level not null default 'medium',
  reason text,
  payload jsonb not null default '{}'::jsonb,
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by_user_id uuid references auth.users(id),
  decision_notes text,
  created_at timestamptz not null default now()
);
create index approvals_org_idx on approvals(organization_id);
create index approvals_org_status_idx on approvals(organization_id, status);

create table candidate_matches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  overall_score numeric(5,2) not null,
  skills_score numeric(5,2),
  experience_score numeric(5,2),
  location_score numeric(5,2),
  compensation_score numeric(5,2),
  domain_score numeric(5,2),
  ai_score numeric(5,2),
  reasoning jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);
create index candidate_matches_org_idx on candidate_matches(organization_id);
create index candidate_matches_job_score_idx on candidate_matches(job_id, overall_score desc);
create trigger set_updated_at before update on candidate_matches
  for each row execute function public.set_updated_at();

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_type audit_actor_type not null,
  actor_id text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  source text,
  ip_address text,
  created_at timestamptz not null default now()
);
create index audit_logs_org_idx on audit_logs(organization_id);
create index audit_logs_org_created_idx on audit_logs(organization_id, created_at desc);

-- Standard tenant-isolation RLS for agent/matching tables (read+write within
-- the caller's org; fine-grained action authorization, e.g. who may decide
-- an approval, is enforced in application code via requirePermission(), not
-- here — see lib/auth/authorization.ts).
do $$
declare
  t text;
begin
  foreach t in array array[
    'agents','agent_tasks','agent_events','approvals','candidate_matches'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy tenant_isolation on %I for all using (organization_id in (select public.user_organization_ids())) with check (organization_id in (select public.user_organization_ids()))',
      t
    );
  end loop;
end $$;

-- audit_logs is deliberately NOT in the loop above: org members may read
-- their org's audit trail, but only the service-role client (server-side
-- application code) may write to it — no insert/update/delete policy is
-- granted to the regular authenticated role, which keeps it append-only in
-- practice even though Postgres itself doesn't have a native "append-only"
-- table mode.
alter table audit_logs enable row level security;
create policy read_own_org_audit_logs on audit_logs
  for select
  using (organization_id in (select public.user_organization_ids()));
