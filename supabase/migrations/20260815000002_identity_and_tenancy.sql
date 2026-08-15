-- Identity & Tenancy — see docs/architecture/03-security-and-tenancy.md and
-- docs/adr/ADR-011-supabase-auth.md for the design this implements.

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on organizations
  for each row execute function public.set_updated_at();

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on profiles
  for each row execute function public.set_updated_at();

create table organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role membership_role not null default 'recruiter',
  status membership_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
create index organization_memberships_user_idx on organization_memberships(user_id);
create index organization_memberships_org_idx on organization_memberships(organization_id);

create table roles (
  id uuid primary key default gen_random_uuid(),
  key membership_role not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text not null
);

create table role_permissions (
  role_key membership_role not null references roles(key) on delete cascade,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role_key, permission_id)
);

-- RLS helper: the set of organizations the current authenticated user
-- belongs to as an active member. SECURITY DEFINER so it bypasses RLS on
-- organization_memberships when evaluating this — without that, a policy
-- on organization_memberships that calls this function would recurse into
-- itself. This is the standard Supabase multi-tenant RLS pattern and is the
-- single place tenant scoping is defined; every other policy below calls it
-- rather than re-deriving membership itself.
create or replace function public.user_organization_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id
  from organization_memberships
  where user_id = auth.uid()
    and status = 'active';
$$;

alter table organizations enable row level security;
create policy read_own_organizations on organizations
  for select
  using (id in (select public.user_organization_ids()));
-- No insert/update/delete policy: organization creation and mutation go
-- through server-side code using the service-role client (see
-- lib/auth/bootstrap.ts), which layers requirePermission() checks —
-- consistent with "Supabase user metadata is not the business
-- authorization system."

alter table organization_memberships enable row level security;
create policy read_own_org_memberships on organization_memberships
  for select
  using (user_id = auth.uid() or organization_id in (select public.user_organization_ids()));
-- Same reasoning as organizations: membership mutations (invite, role
-- change) go through server-side privileged code, not client RLS writes.

alter table roles enable row level security;
create policy read_roles on roles for select using (auth.role() = 'authenticated');

alter table permissions enable row level security;
create policy read_permissions on permissions for select using (auth.role() = 'authenticated');

alter table role_permissions enable row level security;
create policy read_role_permissions on role_permissions for select using (auth.role() = 'authenticated');

alter table profiles enable row level security;
create policy manage_own_profile on profiles
  for all
  using (id = auth.uid())
  with check (id = auth.uid());
create policy read_org_mate_profiles on profiles
  for select
  using (
    id in (
      select user_id from organization_memberships
      where organization_id in (select public.user_organization_ids())
        and status = 'active'
    )
  );

-- Auto-create a profile row when a new auth user is created, so the app
-- never has to remember to do it manually in more than one place.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
