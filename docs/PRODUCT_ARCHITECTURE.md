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

## Current MVP

See the route map above — this is the "Interactive Office + AI HQ shell" milestone. It is a
frontend scaffold, not the Phase 0–90-day MVP defined in
[`/docs/product/roadmap.md`](./product/roadmap.md), which requires the real data model, tenancy,
and AI pipeline from [`/docs/architecture`](./architecture) to actually be built.

## Database layer (added post-scaffold)

Sprint 1's Identity & Tenancy schema is implemented for real — not just documented — in
`server/db/`: Drizzle ORM schema (`schema.ts`), a lazy Postgres client (`client.ts`), a
`withOrgContext` transaction helper that sets `app.current_org_id` per request
(`context.ts`), and the system role/permission seed data (`seed-data.ts` + `scripts/seed.ts`).
`drizzle/0000_sprint1_platform_foundation.sql` is the generated migration — organizations, users,
organization_memberships, roles, permissions, role_permissions, with RLS policies matching
[`docs/adr/ADR-002-multi-tenancy-strategy.md`](./adr/ADR-002-multi-tenancy-strategy.md).
Nothing in `app/`/`services/` uses this yet — it's provisioned and ready for the first real service
to swap onto it. Apply it with `npm run db:migrate` (needs `DATABASE_URL` set), then `npm run db:seed`.

## Roadmap

1. Wire Supabase: swap `MockAgentService`/`MockCandidateService`/etc. for real implementations
   against the schema in [`database-schema.md`](./database-schema.md) and `server/db/schema.ts` —
   interfaces don't change.
2. Auth + multi-tenancy per [`docs/architecture/03-security-and-tenancy.md`](./architecture/03-security-and-tenancy.md).
3. Build out the placeholder routes (Jobs, Candidates, Pipeline, Companies, Contacts) against real
   data, per the epics in [`docs/product/backlog.md`](./product/backlog.md).
4. Realtime agent events (Supabase Realtime) driving live workstation status changes in the 3D
   office, replacing the static mock feed.
5. Connect the Approval Center to a real `ApprovalService` so Approve/Reject actually executes the
   underlying action, per [`docs/architecture/04-ai-and-agents.md#k-human-approval-engine`](./architecture/04-ai-and-agents.md).
6. pgvector-backed Agent Memory, replacing the placeholder `MemoryService`.
