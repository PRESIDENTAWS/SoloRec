# R/S/T/U — Repository Structure, ADRs, Backlog, Roadmap, Risks, Open Questions, First Sprint

## R. Repository Structure

**Single Next.js app, not a monorepo, for MVP.** Section 48 sketches a `/apps` + `/packages`
monorepo, but also warns against creating dozens of empty packages disproportionate to current
scope — with one deployable app and no second consumer of shared code yet, a Turborepo/pnpm
workspace split buys build-orchestration complexity with no payoff. The internal boundaries that
matter (domain services, AI layer, agents, events) are enforced by directory structure and import
conventions inside one app, not by package boundaries:

```
/app                        Next.js App Router
  /(marketing)
  /(app)                    org-scoped authenticated routes
  /api                      route handlers (webhooks, non-server-action endpoints)

/components                 UI components (no business logic, no direct DB access)

/server
  /db                       Drizzle schema, migrations, client, RLS policy SQL
  /domain                   ClientService, JobService, CandidateService, MatchService,
                             SubmissionService, InterviewService, PlacementService,
                             RevenueService, TaskService, DocumentService,
                             ApprovalService, AuditService, EventService
  /auth                     Clerk integration, session → ctx resolution
  /ai                       AIProvider + adapters, model-routing.ts, prompt templates
  /agents                   AgentDefinition registry, per-agent workflow functions
  /tools                    Tool implementations (Section J)
  /events                   Outbox writer, dispatcher, Inngest function definitions
  /integrations             Provider interfaces + adapters (empty stubs until a provider ships)

/lib                        Shared types, zod schemas, utils (no DB/AI imports)

/docs
  /architecture              this package
  /adr
  /product

/evals                      Section 51 — resume_extraction, candidate_matching,
                             interview_summary, candidate_submission, chief_of_staff

/tests                       unit, integration, authorization, tenant-isolation
```

**Migration trigger to a monorepo:** the day a second deployable is genuinely needed (e.g., a
standalone worker process outgrowing Inngest, or a public marketing site with a different deploy
cadence) — at that point `/server/*` becomes `/packages/*` and the app moves under `/apps/web`.
Not before.

### The AI Office prototype {#the-ai-office-prototype}

The uploaded `ai-staffing-hq` starter (3D office scene, `lib/agents.ts` hardcoded array of 9
fictional agents) is **not incorporated into the repository at this stage.** Reasons, concretely:

- Its `Agent` type and mock data have no relationship to the real `AgentDefinition`/`agent_runs`
  model in [`04-ai-and-agents.md`](./04-ai-and-agents.md) — merging it now would create a second,
  fake "agent registry" sitting next to the real one, exactly the kind of premature, disconnected
  file this whole document exists to prevent (Section 1).
- It has no auth, no org scoping, no data layer — none of Phase 1/2's actual requirements.
- It's a legitimate future asset: once `agent_runs` exists (Phase 7+, Chief of Staff) and there are
  real statuses/tasks to visualize, the Command Center can grow a visualization layer, and this
  prototype's Three.js/`@react-three/fiber` approach is a reasonable starting point *for the
  rendering layer only* — driven by real query data, not the static array.
- The flat, KPI-bar-plus-panel dashboard layout in the reference screenshot (Weighted Pipeline,
  Active Jobs, Placements, A/R, Agency Health Score, Recommended Actions, Client Health Summary)
  is a better match for the actual Command Center MVP requirement (Section 34.G) than the 3D scene
  is, and doesn't depend on any of the above being built first — that's the UI target for Phase 7,
  built against real `RevenueForecastService`/`ApprovalService`/`ClientService` reads.

## S. ADR Index

See [`/docs/adr`](../adr). Ten ADRs cover every stack decision the master prompt asked to be
evaluated rather than assumed:

| ADR | Decision |
|---|---|
| [001](../adr/ADR-001-postgresql-primary-datastore.md) | PostgreSQL as primary data store |
| [002](../adr/ADR-002-multi-tenancy-strategy.md) | Shared-schema multi-tenancy + RLS |
| [003](../adr/ADR-003-ai-provider-abstraction.md) | AI provider abstraction |
| [004](../adr/ADR-004-pgvector-semantic-search.md) | pgvector over a dedicated vector DB |
| [005](../adr/ADR-005-orm-drizzle-vs-prisma.md) | Drizzle over Prisma |
| [006](../adr/ADR-006-human-approval-architecture.md) | Reusable human approval engine |
| [007](../adr/ADR-007-domain-event-strategy.md) | Transactional outbox, not Kafka |
| [008](../adr/ADR-008-auth-provider.md) | Clerk for auth, our own tables for business RBAC |
| [009](../adr/ADR-009-background-jobs.md) | Inngest for background jobs |
| [010](../adr/ADR-010-hosting-and-deployment.md) | Vercel + managed Postgres, no Kubernetes |

## T. Implementation Backlog

Full epic → story → dependency breakdown lives in
[`/docs/product/backlog.md`](../product/backlog.md) (kept separate so it can be updated/checked off
independently of this architecture narrative).

## U. 30/60/90 Roadmap

Full roadmap with milestones and acceptance criteria lives in
[`/docs/product/roadmap.md`](../product/roadmap.md).

## Architectural Risks

Ranked by (impact × likelihood of being discovered late):

1. **Tenant isolation regression.** A new service method or tool that forgets `ctx.organizationId`
   scoping. Mitigated by RLS (ADR-002) as a hard backstop, plus a mandatory tenant-isolation test
   suite (Section 50) that runs against every new domain service.
2. **AI-invented data entering structured fields unflagged.** A `generateStructured` call whose
   schema is too permissive, or a workflow that skips the review step. Mitigated by every extracted
   field carrying `source`/`confidence` and a `PENDING_REVIEW` gate before it's treated as
   confirmed — but this only holds if every future AI workflow actually respects the pattern; it's
   a discipline risk, not just a technical one.
3. **Approval engine bypass.** A future tool implemented under time pressure that mutates state
   directly instead of calling `request_approval`. Mitigated by code review convention today; worth
   a lint rule (tools may only import read-oriented domain service methods, or `request_approval`)
   once the tool count grows past what review alone can reliably catch.
4. **Revenue formula drift.** Someone reimplements `expectedValue` math inline in a UI component
   instead of calling `RevenueService`, and the two diverge. Mitigated by keeping revenue
   calculations behind one service with unit tests as the only sanctioned source — needs
   enforcement (review discipline) since nothing stops a second implementation from being written.
5. **Vendor concentration in Clerk + Inngest + Vercel + one AI provider.** Each is individually a
   reasonable managed-service bet, but three-plus vendor dependencies at once is real platform risk
   if any one has an outage or pricing change. Mitigated architecturally (each is behind an
   interface — AIProvider, event outbox, ToolContext) but not eliminated; this is an accepted
   tradeoff for shipping speed, documented so it's a conscious choice, not an oversight.
6. **Schema churn from manuals not yet reviewed.** The Recruiting Operations Manual and Appendix
   Pack were referenced but not supplied; if their actual intake/scorecard/compliance field
   requirements differ meaningfully from `JobRequirement`/`InterviewFeedback`/
   `ComplianceRequirement` as currently shaped, Sprint 3+ tables may need rework. See Open Question
   OQ-1.
7. **pgvector at scale.** Acceptable now (ADR-004); if a customer's document volume or query
   pattern exceeds what one Postgres instance handles well, this is a real migration, not a config
   flag. Watch embedding table size and p95 query latency as the concrete trigger.
8. **Cost overrun on high-volume AI extraction.** Resume parsing runs on every candidate upload;
   without the model-routing discipline (cheap model for extraction) actually being followed as the
   agent count grows, per-org AI cost could outpace what the pricing model assumes. Mitigated by
   `ai_executions`-based cost rollups being visible from Sprint 1, not bolted on later.
9. **"Human review" fatigue undermining the approval engine's actual purpose.** If every AI draft
   requires approval and volume grows faster than trust, recruiters may start rubber-stamping
   approvals without reading them — which defeats the compliance-safety design even though the
   architecture is technically sound. This is a product/UX risk the architecture can't fully solve;
   flagged so submission/interview-intelligence UX design treats approval-queue review quality as a
   first-class metric (recruiter edit distance, per Section 51), not just approval throughput.
10. **Underestimating Clerk-to-business-RBAC sync correctness.** ADR-008's webhook sync between
    Clerk org/user state and `organization_memberships` is a real integration surface (webhook
    delivery failures, ordering, retries) that's easy to under-build in Sprint 1 and then have
    silently drift (a removed Clerk user still holding an active membership row). Needs an explicit
    reconciliation job, not just "the webhook handles it," tracked in the backlog.

## Questions That Must Be Decided Before Coding

Only decisions that materially change the architecture above:

- **OQ-1 — Manuals not yet available.** The Recruiting Operations Manual and Appendix Pack A–L were
  referenced but their content wasn't supplied to this session. Do the intake fields, scorecard
  structure, and compliance schedules in those documents match `JobRequirement`,
  `InterviewFeedback.structured_feedback`, and the future `ComplianceRequirement` shape closely
  enough to proceed, or should Sprint 3 (Recruiting Core intake) wait for a diff against the actual
  documents first? **Recommendation:** don't block Sprint 1–2 (Foundation/CRM, which don't touch
  these fields), but diff before Sprint 3's `job_requirements`/intake UI locks its field set.
- **OQ-2 — Managed Postgres provider: Neon vs Supabase.** Both satisfy ADR-001/004. Supabase bundles
  its own auth (redundant with ADR-008's Clerk choice) and storage (redundant with S3-compatible
  choice) — using it only for Postgres means paying for unused surface area vs. Neon's
  Postgres-only focus with comparable branching support. Needs a decision before Sprint 1's first
  migration, not an architectural blocker otherwise.
- **OQ-3 — Embedding model / dimension lock-in (ADR-004 consequence).** Which embedding model sets
  `vector(N)`'s dimension — decide before the first `document_embeddings` migration, since changing
  it later means re-embedding everything.
- **OQ-4 — Fee/compensation defaults are org-specific real business data**, not architecture.
  `organization_settings.default_fee_percentage` etc. need actual agency input before Sprint 6
  (Placement & Revenue) ships anything computing real dollar figures — flagged so it isn't assumed
  away as a "just use 20%" placeholder that ships to a real customer.
- **OQ-5 — Data residency / compliance certification requirements** (SOC 2, specific candidate-PII
  handling rules by jurisdiction) were not specified. This affects retention-window defaults
  ([`03-security-and-tenancy.md`](./03-security-and-tenancy.md)) and possibly ADR-002's
  database-per-tenant exception trigger. Needs a business-side answer, not an engineering guess,
  before any customer with such a requirement onboards.

## Recommended First Implementation Sprint

**Sprint 1 — Platform Foundation.** Nothing in Sprint 2+ is buildable without this, and it's scoped
tightly enough to ship in one sprint without spilling into CRM/recruiting features:

1. Repo scaffold per the structure above (Next.js + TS + Tailwind + Drizzle + Vercel project).
2. `organizations`, `users`, `organization_memberships`, `roles`, `permissions`, `role_permissions`
   migrations — **with RLS policies included from the first migration**, not retrofitted.
3. Clerk integration (ADR-008): sign-up, sign-in, organization creation, invitation flow, webhook →
   `organization_memberships` sync (including the reconciliation job flagged in Risk #10, even if
   minimal).
4. `ctx` resolution middleware: authenticated session → `{ organizationId, actorId, role }` on
   every server action/route handler; the `requirePermission` helper.
5. `audit_logs` table + `AuditService.record()`, wired into the membership-invite flow as the first
   real usage (prove the pattern before Sprint 2 needs it everywhere).
6. Base navigation shell (org switcher, empty Command Center placeholder route) — enough UI to prove
   the auth → org-context → protected-route path end to end, not the real Command Center yet.
7. Tenant-isolation test suite: two seeded organizations, assert every early service method refuses
   cross-org reads even when RLS is (hypothetically) disabled — this test suite is the artifact that
   proves ADR-002 is actually implemented, not just designed.

**Acceptance criteria:** a second developer can sign up, create an organization, invite a teammate,
have that teammate accept and land in the org with the correct role, and a Postgres query run as
the app's DB role against another org's `organizations` row returns zero rows even with a
deliberately broken `WHERE` clause in a test service method (proving RLS is live, not just
documented).
