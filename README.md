# SoloRec AI — Staffing HQ

**Stay boutique. Operate enterprise.** An AI-native staffing operating system for solo recruiters
and 1–5 person boutique agencies.

## Status (branch `feature/backend-foundation`)

This branch turns the mock-data scaffold into a **real, operational vertical slice**:

- **Auth active** — Supabase Auth (email/password), signup/login/logout, password reset, protected
  routes via middleware.
- **Multi-tenancy active** — every user belongs to an organization; org context resolved
  server-side (never from client input), enforced by Postgres RLS.
- **Core recruiting CRUD active** — companies, contacts, jobs, candidates, pipeline (applications)
  are real Supabase-backed create/read/update, not mock data.
- **AVA candidate matching active** — "Assign to AVA" on a job runs deterministic scoring +
  optional AI qualitative analysis, writes `candidate_matches`, emits `agent_events`, and raises a
  human `approval` for outreach.
- **Approval engine active** — approve/reject persists, records events + audit log, and (on
  approve) creates a follow-up draft task. No autonomous outreach.
- **Realtime AI HQ** — agent status, activity, and approvals update live via Supabase Realtime.
- **Live/Demo indicator** — reflects the actual realtime connection state, not a hardcoded "Live".
- Other 8 agents remain visualized but simulated/disabled — only AVA executes real work this sprint.

## ⚠️ Schema reconciliation required before this ships to production

This branch defines its own additive schema in `supabase/migrations/` using table names
`approvals`, `agent_tasks`, `agent_events`, `candidate_matches`. The **pre-existing production
Supabase schema uses different names** (`approval_requests`, `agent_runs`, `events`,
`candidate_job_matches`, plus `sales_opportunities`, `job_requirements`, etc.). These migrations
must be reconciled with production — **do not run them blindly against the existing project.** See
`docs/PRODUCT_ARCHITECTURE.md` → "Schema reconciliation".

## Stack

Next.js 14 (App Router) · React 18 · TypeScript (strict) · Tailwind · Supabase (Auth + Postgres +
RLS + Realtime) · React Three Fiber (AI office visualization) · Zod (validation) · Vitest (tests).

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase + AI provider values
npm run dev                  # http://localhost:3000
```

Scripts: `npm run build`, `npm run typecheck`, `npm run test`, `npm run db:seed`.

### Required environment variables

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Never exposed to browser |
| `AI_PROVIDER` | server | `anthropic` (default) or `openai` |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | server | Only the selected provider's key is needed |
| `NEXT_PUBLIC_APP_URL` | client | Base URL for auth redirect links |

## Architecture

```
UI (app/, components/)  — Server Components read, Server Actions mutate
        ↓
Domain services (services/*)  — every method takes ctx {organizationId, userId, role};
        ↓                        requirePermission() + Zod validation + audit logging
Supabase (lib/supabase/*)  — RLS enforces tenant isolation as defense-in-depth
```

Docs: `docs/PRODUCT_ARCHITECTURE.md` · `docs/AI_AGENT_ARCHITECTURE.md` ·
`docs/database-schema.md` · `docs/architecture/*` · `docs/adr/*` (ADR-011 = Supabase Auth,
superseding ADR-008/Clerk).

## The one real workflow this proves

Sign up → organization auto-created → create company → create job → create candidates → add to job
pipeline → **Assign to AVA** → real candidate scoring + reasoning → shortlist → human approves/
rejects → event stored + audit logged → AI HQ updates live → refresh, data persists → another org
cannot see any of it (RLS).
