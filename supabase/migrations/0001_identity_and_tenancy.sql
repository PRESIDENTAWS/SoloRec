-- ============================================================================
-- 0001 — Identity & tenancy
-- ============================================================================
-- One identity system with role-based access (see lib/auth/roles.ts). A single
-- auth user carries a `role` that decides which portal they land in:
--   admin / recruiter -> the OS (/dashboard)
--   client            -> /client
--   candidate         -> /candidate
--
-- `profiles` extends Supabase's `auth.users` with the app-level role and the
-- tenant (`organization_id`). Every domain table carries organization_id and is
-- guarded by RLS scoped through the helper functions defined here.
-- ============================================================================

create extension if not exists pgcrypto;

-- Portal-level role (distinct from org-internal permissions).
create type portal_role as enum ('admin', 'recruiter', 'client', 'candidate');

-- --- Tenant root -------------------------------------------------------------
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan_tier text not null default 'starter',
  created_at timestamptz not null default now()
);

-- --- Profiles (extends auth.users) ------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  full_name text,
  email text,
  role portal_role not null default 'recruiter',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_org_idx on profiles (organization_id);

-- --- Helper functions (used by every RLS policy) ----------------------------
-- SECURITY DEFINER so policies can read the caller's profile without recursing
-- into profiles' own RLS.
create or replace function public.current_profile_org()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

create or replace function public.current_profile_role()
returns portal_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- --- Keep updated_at fresh ---------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function public.set_updated_at();

-- --- Auto-create a profile for every new auth user --------------------------
-- Role comes from the sign-up metadata (the login lane), defaulting to recruiter.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    coalesce((new.raw_user_meta_data ->> 'role')::portal_role, 'recruiter')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --- Row-level security ------------------------------------------------------
alter table organizations enable row level security;
alter table profiles enable row level security;

-- A user can read their own organization.
create policy organizations_select_own
  on organizations for select
  to authenticated
  using (id = public.current_profile_org());

-- A user can read their own profile, and profiles in their organization.
create policy profiles_select_self_or_org
  on profiles for select
  to authenticated
  using (id = auth.uid() or organization_id = public.current_profile_org());

-- A user can update only their own profile.
create policy profiles_update_self
  on profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
