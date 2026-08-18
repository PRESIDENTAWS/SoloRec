-- Extensions
create extension if not exists pgcrypto;
-- pgvector: enabled now per docs/architecture/04-ai-and-agents.md's future
-- memory architecture, not used by any table yet this sprint.
create extension if not exists vector;

-- Shared enums
create type membership_role as enum ('owner','admin','recruiter','sales','coordinator','finance');
create type membership_status as enum ('invited','active','suspended','removed');

create type job_status as enum ('draft','open','on_hold','filled','closed','cancelled');
create type job_priority as enum ('low','medium','high');
create type employment_type as enum ('direct_hire','contract','contract_to_hire');
create type workplace_type as enum ('onsite','hybrid','remote');

create type candidate_status as enum ('active','passive','engaged','screening','submitted','interviewing','offer','placed','archived');

create type application_stage as enum ('sourced','contacted','responded','screening','qualified','submitted','client_review','interview','offer','placed','rejected','withdrawn');

create type submission_status as enum ('draft','pending_review','approved','sent','client_review','rejected','withdrawn');
create type interview_status as enum ('scheduled','completed','cancelled','no_show');
create type placement_status as enum ('active','guarantee_period','confirmed','fell_through');

create type task_status as enum ('open','in_progress','done','cancelled');
create type task_priority as enum ('low','medium','high');

create type client_status as enum ('prospect','active','dormant','churned');
create type fee_type as enum ('percentage','flat');

create type agent_status as enum ('working','review_required','idle','blocked','offline');
create type agent_task_status as enum ('queued','running','waiting_for_approval','completed','failed','cancelled');
create type agent_task_type as enum ('candidate_matching','outreach_draft');
create type agent_event_severity as enum ('info','success','warning','error');

create type approval_status as enum ('pending','approved','rejected','expired','cancelled');
create type approval_risk_level as enum ('low','medium','high','critical');
create type approval_action_type as enum ('candidate_outreach','candidate_rejection','offer_change','contract_exception');

create type audit_actor_type as enum ('user','agent','system','integration');

-- Shared updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
