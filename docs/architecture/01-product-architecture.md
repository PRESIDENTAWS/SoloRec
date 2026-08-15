# A/B/C — Product Architecture, Domain Map, MVP Boundary

## A. Product Architecture

SoloRec is a single Next.js application (not a microservice mesh) with a strict internal layering.
The layering is the enforcement point for the master prompt's core rule: **AI does not own
business logic.** Every layer below is described with what it is *not allowed* to do, because that
constraint is more important than what it does.

```
┌─────────────────────────────────────────────────────────────┐
│ UI (Next.js App Router, React Server + Client Components)    │  no business logic, no direct DB access
├─────────────────────────────────────────────────────────────┤
│ API / Route Handlers + Server Actions                        │  auth check, input validation (zod), thin
├─────────────────────────────────────────────────────────────┤
│ Domain Services (ClientService, JobService, CandidateService, │  ALL business rules, calculations,
│ MatchService, SubmissionService, PlacementService, ...)       │  state transitions live here
├─────────────────────────────────────────────────────────────┤
│ Workflow / Event Layer (outbox events, Inngest functions)     │  orchestrates multi-step processes,
│                                                                │  triggers async work off domain events
├─────────────────────────────────────────────────────────────┤
│ AI Orchestration Layer (AgentRegistry, AIProvider, Tools)     │  never mutates data directly —
│                                                                │  always calls back through Domain Services
├─────────────────────────────────────────────────────────────┤
│ Tool / Integration Layer (typed tools, provider adapters)     │  enforces authz + tenant scope per call
├─────────────────────────────────────────────────────────────┤
│ Data + Knowledge Layer (Postgres + pgvector, S3-compatible)   │  source of truth
└─────────────────────────────────────────────────────────────┘
```

**The load-bearing rule:** an AI tool that "creates a submission" does not run an `INSERT`. It
calls `SubmissionService.create(...)`, the same function a human-triggered API route calls. This
is what makes deterministic business rules (permissions, compliance gates, financial formulas)
apply identically whether a human or an agent initiated the action, and it's what makes the audit
log meaningful — one code path, one place to log, one place to test.

Two things are explicitly deferred, not designed around prematurely:

- **No microservices.** One Next.js deployable plus, once background AI/document work needs it, one
  worker process (see [`05-delivery.md`](./05-delivery.md)). A second service is not "phase 2 of
  infra," it's a decision made when a concrete need (long-running jobs incompatible with serverless
  function timeouts) appears.
- **No standalone agent runtime.** "Agents" in MVP are configuration + prompts + tool grants
  attached to orchestrated application workflows (Section 37 of the master prompt), not autonomous
  processes with their own event loops. See [`04-ai-and-agents.md`](./04-ai-and-agents.md#agent-registry).

## B. Domain Map

Six bounded functional areas. Each owns its own tables and a primary domain service; cross-area
reads happen through service calls, not cross-area table joins from the UI layer.

| Domain | Owns | Primary services |
|---|---|---|
| **Identity & Tenancy** | Organization, User, OrganizationMembership, Role, Permission | AuthService, MembershipService |
| **CRM** | Client, Contact, ClientAgreement, Opportunity, ClientActivity | ClientService, OpportunityService |
| **Recruiting** | Job, JobRequirement, Candidate, CandidateDocument, CandidateEmployment/Education/Skill/Preference, CandidateJobMatch, Submission, Interview, InterviewFeedback, Offer | JobService, CandidateService, MatchService, SubmissionService, InterviewService |
| **Placement & Revenue** | Placement, PlacementCheckin, Assignment, Timesheet, Invoice, Payment | PlacementService, RevenueService |
| **Operations & Compliance** | Task, Activity, Note, ComplianceRequirement, CandidateComplianceItem, Document, DocumentVersion/Chunk/Extraction/Embedding | TaskService, DocumentService, ComplianceService |
| **AI & Governance** | Agent, AgentRun, AIExecution, AIRecommendation, ApprovalRequest, Event, AuditLog | AIService, ApprovalService, EventService, AuditService |

This mapping is what the `/server` directory structure in [`05-delivery.md`](./05-delivery.md)
mirrors directly — no separate "architecture" for code organization vs. domain boundaries.

## C. MVP Boundary

This restates and locks Section 34/35/36 of the master prompt as a concrete in/out list, because
"MVP" without an explicit exclusion list is how scope creep happens.

### In scope for MVP

- **Foundation:** auth, Organization, User, Membership, coarse roles (no custom per-org roles yet).
- **CRM:** Client, Contact only. No Opportunity/prospect pipeline yet (BD/sales-intelligence agent
  is post-MVP — see Section 36 sourcing note).
- **Recruiting core:** Job + JobRequirement, Candidate + CandidateDocument/Employment/Skill/Preference,
  candidate search (structured filters + full-text; semantic search is stubbed as a fallback to
  full-text, not blocked on), CandidateJobMatch (hybrid Layers 1–3, no Layer 4 client-history signal
  yet since there's no placement history to learn from on day one).
- **AI (5 capabilities only, per Section 36):** Chief of Staff summary, Intake Intelligence,
  Candidate Intelligence (resume parsing), Interview Intelligence (notes → structured feedback),
  Submission Intelligence (draft generator).
- **Operations:** Task, Activity (both manual and AI/event-generated).
- **Revenue:** Placement, direct-hire fee calculation, weighted pipeline. **No** contract/timesheet
  GP calculations in MVP — the formulas are designed (see
  [`04-ai-and-agents.md`](./04-ai-and-agents.md#revenue-intelligence)) but Assignment/Timesheet
  tables are future-phase; direct hire is the wedge.
- **Command Center:** KPIs, priority jobs, pending tasks/submissions, Chief of Staff brief.
- **Governance substrate that everything above depends on:** AIExecution logging, ApprovalRequest,
  Event outbox, AuditLog. These are not optional "nice to have later" — every AI workflow in scope
  writes through them from day one, otherwise Sprint 4+ has to retrofit provenance onto already-shipped
  features.

### Explicitly out of scope for MVP

- Contract staffing (Assignment, Timesheet, contractor GP) — direct hire only first.
- Multi-role/custom RBAC beyond ~5 fixed roles.
- Sourcing Intelligence (external candidate discovery) — internal-data-only per Section 36.
- Client DNA derived-intelligence layer — needs placement history that doesn't exist yet; the
  *table shape* is in the schema (so Phase 6+ doesn't require a migration to bolt it on), but no
  service populates it in MVP.
- SLA engine, feature flags, agency health score, external integrations (email/calendar/job
  boards/e-sign/background-check/payroll/accounting) — adapters interfaces are named in
  [`05-delivery.md`](./05-delivery.md) but zero providers are implemented.
- Any `LIMITED_AUTONOMOUS_EXECUTION` behavior — every AI action in MVP is at most `PROPOSE`; nothing
  executes without a human approving an `ApprovalRequest`. Autonomous low-risk execution is a
  post-MVP trust-earning milestone, not a launch feature.
- The 3D "AI Agent World" visualization — Command Center ships as a standard dashboard (matches the
  screenshot's KPI/insights/activity panels) without the Three.js office scene. Revisit once there
  are real `agent_run` events to visualize; visualizing nothing is worse than not visualizing.
