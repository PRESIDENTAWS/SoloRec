# Product Architecture — SoloRec AI Staffing HQ (MVP Scaffold)

This document describes what's actually built in this starter. For the full pre-code architecture
(data model, tenancy, RBAC, AI governance, ADRs, roadmap) that this scaffold is grounded in, see
[`/docs/architecture`](./architecture) and [`/docs/adr`](./adr) — that package remains the
authoritative design reference; this document is the "what exists today" layer on top of it.

## What this is

A frontend scaffold for SoloRec: real navigation, real routes, real typed data models, a working
3D AI-agent office visualization — all running on clearly-labeled mock data, with service-layer
seams designed so a real Supabase/Postgres backend can replace the mocks without UI rewrites.

## Layering

```
UI (app/, components/)
   ↓ calls
Services (services/agents, services/recruiting, services/memory, services/events)
   ↓ currently backed by
Mock data (lib/agents, lib/data, lib/recruiting)
   ↓ future: same service interfaces, backed by
Supabase / PostgreSQL (see docs/database-schema.md)
```

The load-bearing rule carried over from the full architecture: **UI components never import mock
data directly except through a service.** `services/agents/agentService.ts` exports an
`AgentService` interface and a `MockAgentService` implementation; every page calls
`agentService.listAgents()`, not `MOCK_AGENTS` directly. This is what makes "swap in Supabase
later" a real, small change rather than a rewrite.

**Three.js components hold no business logic.** `components/office/*` receive `agents` and a
selection callback as props and render them — they never fetch data, compute scores, or decide
what an agent's status means beyond picking a display color.

## Domain map (what's actually implemented vs. placeholder)

| Domain | Status in this scaffold |
|---|---|
| Navigation / IA | Full sidebar, all routes exist |
| AI HQ (Command Center, Agents, Agent detail, Agent memory, Approvals, Activity) | Fully built on mock data |
| CRM (Clients, Contacts) | Types defined; route is a placeholder |
| Recruiting (Jobs, Candidates, Pipeline) | Types defined; routes are placeholders |
| Operations (Tasks, Calendar) | Types defined; routes are placeholders |
| Finance (Finance, Reports) | Types defined; routes are placeholders |
| Settings | Placeholder |

Placeholders are explicit — `components/ui/PlaceholderPage.tsx` — not silently-empty pages or fake
data pretending to be real.

## Route map

```
/                              → redirects to /dashboard
/dashboard                     → KPI overview, AI workforce snapshot, recent activity
/jobs /candidates /pipeline
/companies /contacts /search   → placeholders (typed, not built)
/tasks /calendar /finance
/reports /settings             → placeholders (typed, not built)

/ai-hq                         → Command Center: KPI row + 3D office + agent detail panel
/ai-hq/agents                  → agent directory grid
/ai-hq/agents/new              → agent builder (local/mock create only)
/ai-hq/agents/[agentId]        → agent workspace (AVA has a full sourcing-funnel workspace;
                                  other agents show the generic detail panel)
/ai-hq/agents/[agentId]/memory → 5-section memory placeholder (company/client/candidate/market/performance)
/ai-hq/approvals               → approval queue (client-side approve/reject/edit, not persisted)
/ai-hq/activity                → live activity feed (static mock events)
```

## Data flow this scaffold is designed for (not yet wired)

```
Agent task executes
  → backend records task (agent_tasks)
  → AgentEvent created (agent_events)
  → realtime event emitted (Supabase Realtime or equivalent)
  → frontend receives event
  → 3D workstation status changes
```

`services/events/eventService.ts` and the `AgentEvent` type already model this shape; only the
realtime transport and the backend that produces real events are missing.

## Design system

Near-black background, navy/slate cards, electric blue primary accent, restrained purple for
AI-specific accents, green/amber/red reserved for health/review/blocked states only — see
`tailwind.config.ts` for the exact token values. Deliberately understated for the 3D office: solid
low-poly geometry, no particle effects, no neon — this is enterprise recruiting software, not a
game.

## Setup

```bash
npm install
npm run dev       # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

Copy `.env.example` to `.env.local` when a real Supabase project and AI provider key exist. No
backend is wired up in this starter — the app runs entirely on mock data without any environment
variables set.

## Current state (branch `feature/backend-foundation`)

The scaffold described above has been made **operational** on this branch: Supabase Auth, real
multi-tenant CRM/recruiting CRUD, the AVA candidate-matching workflow, a persisted approval engine,
and Supabase Realtime driving AI HQ. See the repository `README.md` for the feature list and the
one end-to-end workflow this proves.

## Schema reconciliation (blocker before production)

This branch ships **its own additive migrations** in `supabase/migrations/` and a hand-written
`lib/supabase/database.types.ts` matching them. Those migrations use the table names
`approvals`, `agent_tasks`, `agent_events`, `candidate_matches`, and a Supabase-Auth-based
identity model (`auth.users` + `profiles` + `organization_memberships`).

The **pre-existing production Supabase project** uses a different, broader schema — table names
`approval_requests`, `agent_runs`, `events`, `candidate_job_matches`, plus `sales_opportunities`,
`job_requirements`, `candidate_skills`, `candidate_preferences`, `interview_feedback`, `offers`,
`compliance_requirements`, `assignments`, `timesheets`, `invoices`, `payments`, `ai_executions`,
`ai_recommendations`, `communications`, `documents`, `audit_logs`, etc. — and (in the project
inspected) a `public.users` table rather than `profiles`.

**These two schemas are not compatible as-is.** Before this branch runs against production, a
decision is required:

- **Option A (recommended): adopt the production schema as canonical.** Rename this branch's
  service queries and `database.types.ts` to the production table/column names, drop the
  branch's migrations in favor of the existing schema, and add only *additive* migrations for
  anything genuinely missing (e.g. RLS `user_organization_ids()` helper if absent). This preserves
  the richer production model and its RLS.
- **Option B: apply this branch's migrations to a fresh project.** Only viable if the production
  project can be discarded — it cannot, per the "do not run destructive statements blindly" rule.

Do **not** run this branch's `CREATE TABLE` migrations against the existing production project —
they will collide with existing tables. This reconciliation is the first task of the next session.

## Roadmap (after reconciliation)

1. Reconcile schema (above) — align service-layer queries to the canonical production schema.
2. Deploy to a Vercel preview with the env vars listed in `README.md`; verify the end-to-end
   workflow against real Supabase.
3. Extend CRUD to the WIN stage (prospects/opportunities) and OPERATE stage
   (compliance/assignments/finance) per the sprint plan in the product brief.
4. Activate the next agents (NOVA client intelligence, ORION executive recommendations) on the
   same governed pattern AVA established (execution record → recommendation → approval → audit).
5. pgvector-backed agent memory and client/candidate DNA learning.

## Roadmap

1. Wire Supabase: swap `MockAgentService`/`MockCandidateService`/etc. for real implementations
   against the schema in [`database-schema.md`](./database-schema.md) — interfaces don't change.
2. Auth + multi-tenancy per [`docs/architecture/03-security-and-tenancy.md`](./architecture/03-security-and-tenancy.md).
3. Build out the placeholder routes (Jobs, Candidates, Pipeline, Companies, Contacts) against real
   data, per the epics in [`docs/product/backlog.md`](./product/backlog.md).
4. Realtime agent events (Supabase Realtime) driving live workstation status changes in the 3D
   office, replacing the static mock feed.
5. Connect the Approval Center to a real `ApprovalService` so Approve/Reject actually executes the
   underlying action, per [`docs/architecture/04-ai-and-agents.md#k-human-approval-engine`](./architecture/04-ai-and-agents.md).
6. pgvector-backed Agent Memory, replacing the placeholder `MemoryService`.
