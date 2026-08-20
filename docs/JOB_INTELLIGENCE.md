# Job Intelligence

Job Intelligence is SoloRec's talent-intelligence layer: it answers **who is
actually hiring, what they are hiring for, how strong the demand is, and who to
contact** — not just "which listings look fake." Ghost-job detection is one
score inside it, not the product.

It is built as a native layer of the SoloRec application (Next.js/TypeScript),
not a standalone service and not a set of disconnected mini-apps. Real ingestion
and scoring at scale can move to a worker later; for the MVP, TypeScript keeps
deployment simple and the logic colocated with the app that consumes it.

## The one architectural decision that matters

**One universal job record.** SoloRec does not maintain `linkedin_jobs`,
`indeed_jobs`, `workday_jobs` as primary data. It maintains:

```
companies ─┬─ intel_jobs ─┬─ intel_job_sources    (one canonical job, many sources)
           │              ├─ intel_job_snapshots  (point-in-time history)
           │              ├─ intel_job_signals    (discrete evidence)
           │              └─ intel_job_reposts
           └─ intel_company_signals
```

A single opportunity — *Senior Cybersecurity Engineer, Lockheed Martin,
Orlando FL* — can be posted on LinkedIn, Indeed, the company career site and
Workday at once. SoloRec recognizes those as the **same** job (one
`intel_jobs` row) with several `intel_job_sources`. History accumulates in
`intel_job_snapshots` and `intel_job_signals`; that history is where the moat
starts.

The `intel_` prefix keeps these market-intelligence records distinct from the
internal requisitions domain, which owns the unprefixed `jobs` table.

Schema: [`supabase/migrations/0002_job_intelligence.sql`](../supabase/migrations/0002_job_intelligence.sql).

## Three scores, not one

Every job carries three scores (`lib/recruiting/ghost-score.ts`,
`lib/recruiting/hiring-signals.ts`):

| Score | Question it answers |
|---|---|
| **Ghost Risk** | Is this listing stale / questionable? (higher = worse) |
| **Hiring Probability** | Is there a real, active hiring requirement? |
| **Staffing Opportunity** | Is this company worth a recruiter calling? |

Staffing Opportunity is the score SoloRec optimizes — it turns job data into
revenue intelligence. It blends hiring probability and low ghost risk with
multi-req demand, engineering/specialist families, disclosed comp, and company
hiring velocity, then attaches a recommendation and an estimated fee range.

## Source verification hierarchy

A listing on a third-party board does not carry the same confidence as the
employer's own ATS (`lib/recruiting/source-authority.ts`):

```
Employer ATS 100 · Career site / Greenhouse / Lever / Workday / Ashby 95
iCIMS 92 · Bullhorn 90 · LinkedIn 80 · Indeed / Dice 75 · ZipRecruiter 70
Glassdoor 65 · Monster 60 · Other aggregator 40
```

When LinkedIn says OPEN but Workday says CLOSED, the deduplicator trusts
Workday: the board copy is a **stale third-party listing** (high ghost risk),
not a live opportunity.

## The pipeline

```
connectors (NormalizedJob)  →  normalize  →  deduplicate  →  score  →  canonical jobs
services/integrations/jobs      job-normalizer  job-deduplicator  ghost-score/hiring-signals
```

- **`services/integrations/jobs`** — every source (ATS or board) implements the
  same `JobSourceConnector` contract and emits the same `NormalizedJob` shape.
  Adding a board or ATS is a new file here; nothing downstream changes.
- **`lib/recruiting`** — pure, dependency-free, browser-safe engine:
  `job-normalizer`, `salary-normalizer`, `company-normalizer`, `job-fingerprint`,
  `job-deduplicator`, `source-authority`, `hiring-signals`, `ghost-score`,
  `matching`.
- **`services/recruiting`** — mock-backed service seams that run the mock
  listings through the real engine (`jobSourceService`, `jobService`,
  `jobIntelligenceService`, `ghostJobService`, `companyIntelligenceService`,
  `hiringSignalService`). Swapping in Supabase changes only the data source, not
  the engine or the UI.

## The money workflow

Job Intelligence does not live in isolation — it feeds the full-desk flywheel:

```
job signal → company → hiring need → buyer → contact → outreach →
meeting → client → job order → candidate → placement → revenue
```

The UI (`/job-intelligence`) surfaces the market pulse, an AI recommendation
banner ("N companies to contact today"), and a table ranked by Staffing
Opportunity, with the next steps of that workflow (View Company, Find Hiring
Manager, Generate Outreach, Add to BD Pipeline) attached to each job.

## Status

MVP scaffold. The engine, the canonical model, the normalized integration
contract, and the `/job-intelligence` UI are built and run against mock source
listings. Live connector fetches, persistence, watchlists/saved searches, and
the outreach/BD hand-offs are the next increments — each is an isolated change
behind a seam that already exists.
