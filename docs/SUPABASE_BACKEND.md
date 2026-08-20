# Supabase backend

The SoloRec backend is a live Supabase project. The migrations in
[`supabase/migrations`](../supabase/migrations) are the source of truth and have
been applied to it in order.

| | |
|---|---|
| Project | `solorec-ai-hq` |
| Region | `us-east-1` |
| Postgres | 17 |
| API URL | `https://hhlovzodsyugfsjewtxh.supabase.co` |

Keys are **not** committed. Copy `.env.example` to `.env.local` and fill in the
publishable key (client) and the service-role key (server only, never exposed to
the browser).

## Migrations

| File | What it creates |
|---|---|
| `0001_identity_and_tenancy.sql` | `portal_role` enum, `organizations`, `profiles`, RLS helpers, new-user trigger, RLS |
| `0002_job_intelligence.sql` | `companies` + the canonical `intel_*` job-intelligence tables, org-scoped RLS |
| `0003_seed_demo.sql` | Idempotent demo org, companies, canonical jobs, sources, watchlist, saved search |
| `0004_harden_security_definer_functions.sql` | Revokes public `EXECUTE` on the `SECURITY DEFINER` helpers |

## Identity model

One identity system with role-based access. `profiles` extends `auth.users` with
a `portal_role` and an `organization_id`:

```
auth.users ──1:1──> profiles ──> organizations
                      role: admin | recruiter | client | candidate
```

`handle_new_user()` fires on `auth.users` insert and creates the matching
profile, reading the role from the sign-up metadata (the login lane the user
picked) and defaulting to `recruiter`. Post-login routing is driven by
`ROLE_HOME` in `lib/auth/roles.ts`:

- `admin` / `recruiter` → `/dashboard`
- `client` → `/client`
- `candidate` → `/candidate`

## Tenancy & RLS

Every domain table carries `organization_id` and has row-level security enabled.
Policies are scoped through two `SECURITY DEFINER` helpers — `current_profile_org()`
and `current_profile_role()` — which read the caller's profile without recursing
into `profiles`' own RLS.

`EXECUTE` on all `SECURITY DEFINER` functions is revoked from `anon`, `authenticated`
and `public`, so none of them are reachable as PostgREST RPC endpoints
(`/rest/v1/rpc/...`). They are only callable from the policies and triggers that
own them.

Verified after applying: an anonymous client reads **0 rows** from `intel_jobs`
and `companies`. The server-side service-role key bypasses RLS by design and must
never reach the browser.

### Known advisory

The `vector` (pgvector) extension is installed in the `public` schema — a
pre-existing condition of the project, flagged by Supabase's linter as
[`extension_in_public`](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public).
Relocating it is a separate migration that must be coordinated with any code
referencing `vector` types.

## Applying changes

Migrations are applied in filename order. When adding one, write the file first
so the repo stays the source of truth, then apply the identical SQL to the
project — never apply ad-hoc SQL that is not captured in a migration file.
