# SoloRec AI — Staffing HQ

AI-native operating system for solo recruiters, full-desk recruiters, and boutique staffing
agencies — combining an ATS, a CRM, AI "employees" with human approval gates, and an executive
command center into one product.

## Status

This branch (`feature/ai-hq`) is a **frontend MVP scaffold**: real navigation, real routes, real
typed domain models, and a working 3D AI-agent office visualization, running entirely on
clearly-labeled mock data. No backend is connected yet. See
[`docs/PRODUCT_ARCHITECTURE.md`](./docs/PRODUCT_ARCHITECTURE.md) for exactly what's built vs.
placeholder.

The full pre-code architecture this scaffold is grounded in — data model, multi-tenant security,
RBAC, AI/agent governance, ADRs, and a 30/60/90 roadmap — lives in
[`/docs/architecture`](./docs/architecture) and was approved before this scaffold was built. Start
there for the system's actual target design; this README covers what's runnable today.

## Product vision

SoloRec combines, in one product:

- **ATS/CRM** — clients, contacts, jobs, candidates, pipeline
- **Recruiting workflows** — sourcing, screening, submissions, interviews, offers, placements
- **AI employees** — named agents (sourcing, matching, compliance, finance, BD, client success,
  legal/risk, executive intelligence) that draft, recommend, and — only with human approval —
  execute
- **Approval workflows** — every consequential AI action (outreach, client communication,
  candidate rejection, offer decisions, contracts, financial transactions) requires a human
  decision by default
- **Real-time activity** — a live event feed of what the AI workforce is doing
- **Executive command center** — agency-wide KPIs, priority actions, and an AI-narrated brief
- **3D AI workplace visualization** — a control-layer view of the AI workforce; presentation only,
  never a home for business logic

## Stack

- Next.js (App Router) + React + TypeScript (strict mode) + Tailwind CSS
- React Three Fiber + Three.js + drei — the 3D office visualization
- lucide-react — icons
- Supabase-ready / PostgreSQL-ready service interfaces (`services/*`) — no live backend yet
- pgvector-ready memory model (`types/memory.ts`, `services/memory/memoryService.ts`)

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run typecheck`, `npm run lint`.

Copy `.env.example` to `.env.local` only once a real Supabase project and AI provider key exist —
the app runs fully on mock data with no environment variables set.

## Architecture

```
UI (app/, components/)
   ↓
Services (services/*)  — interfaces + mock implementations, the seam a real backend replaces
   ↓
Mock data (lib/*)       — clearly labeled, not disguised as real records
```

Three.js components (`components/office/*`) hold no business logic — they render agents and a
selection callback passed in as props. Full details:
[`docs/PRODUCT_ARCHITECTURE.md`](./docs/PRODUCT_ARCHITECTURE.md) ·
[`docs/AI_AGENT_ARCHITECTURE.md`](./docs/AI_AGENT_ARCHITECTURE.md) ·
[`docs/database-schema.md`](./docs/database-schema.md).

## Current MVP

- Full sidebar navigation across Overview / Recruiting / Operations / AI Workforce / System
- AI HQ Command Center: KPI row, interactive 3D office, agent detail panel
- Agent directory, agent workspace (AVA's sourcing funnel + candidate table is fully built out),
  agent memory placeholder, agent builder (local/mock create)
- Approval Center with working (client-side, non-persisted) approve/reject
- Live Activity feed
- Placeholder routes for Jobs, Candidates, Pipeline, Companies, Contacts, Search, Tasks, Calendar,
  Finance, Reports, Settings — typed, navigable, explicitly marked "coming soon," not faked

## Roadmap

See [`docs/PRODUCT_ARCHITECTURE.md`](./docs/PRODUCT_ARCHITECTURE.md#roadmap) for the scaffold's
immediate next steps, and [`/docs/product/roadmap.md`](./docs/product/roadmap.md) for the full
30/60/90-day plan (platform foundation, tenancy/auth, real recruiting data, AI candidate
intelligence, matching, revenue, Chief of Staff) this scaffold is the first visible slice of.

## Repository layout

```
/app          Next.js App Router routes
/components   UI components (layout, ui, dashboard, agents, office, recruiting, approvals, memory)
/lib          Mock data + shared utilities/config, clearly labeled as mock
/services     Interface + mock-implementation seams for a future Supabase backend
/types        Shared TypeScript domain types
/docs         Architecture package, ADRs, backlog/roadmap, and this scaffold's own docs
```
