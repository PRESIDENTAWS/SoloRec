# Implementation Backlog — Epics → Stories → Dependencies

Scoped to the MVP boundary defined in
[`/docs/architecture/01-product-architecture.md`](../architecture/01-product-architecture.md#c-mvp-boundary).
Each epic lists its dependency on prior epics; nothing here is ordered alphabetically, it's ordered
by what actually blocks what.

## Epic 1 — Platform Foundation
*Depends on: nothing. Blocks: everything.*

- 1.1 Repo scaffold, CI (lint/typecheck/test), Vercel project + preview deploys
- 1.2 `organizations`/`users`/`organization_memberships`/`roles`/`permissions`/`role_permissions`
  migrations with RLS policies
- 1.3 Clerk integration: sign-up/sign-in, org creation, invitations
- 1.4 Clerk → `organization_memberships` webhook sync + reconciliation job
- 1.5 `ctx` resolution middleware + `requirePermission` helper
- 1.6 `audit_logs` table + `AuditService`, wired into invite flow
- 1.7 Base nav shell + org switcher + empty protected route
- 1.8 Tenant-isolation test suite (seeded two-org fixture, cross-org read assertions)

## Epic 2 — CRM
*Depends on: Epic 1 (auth/org context, RBAC, audit).*

- 2.1 `clients` + `contacts` migrations, RLS
- 2.2 `ClientService` (CRUD, list/filter by status/owner)
- 2.3 Client list + detail UI
- 2.4 Contact management within client detail
- 2.5 `activities` table (generalized `entity_type`/`entity_id`) + activity log UI component,
  reused by every later entity detail page

## Epic 3 — Recruiting Core: Jobs
*Depends on: Epic 2 (Client must exist before a Job can reference it).*

- 3.1 `jobs`/`job_requirements`/`job_competencies` migrations, RLS, `job_status_enum`
- 3.2 `JobService` (CRUD, status transitions with validation)
- 3.3 Job creation + structured intake UI (requirement entry: MUST_HAVE/PREFERRED/DISQUALIFIER)
- 3.4 Job list (Command Center "priority jobs" query depends on this existing first)
- ⚠ Blocked pending **OQ-1** (manuals diff) before locking the intake field set — see
  [`/docs/architecture/05-delivery.md`](../architecture/05-delivery.md#questions-that-must-be-decided-before-coding)

## Epic 4 — Recruiting Core: Candidates
*Depends on: Epic 1. Independent of Epic 3 (a candidate can exist with no job yet).*

- 4.1 `candidates`/`candidate_documents`/`candidate_employments`/`candidate_skills`/
  `candidate_preferences` migrations, RLS, `candidate_status_enum`
- 4.2 `skills` taxonomy table (minimal, org-nullable)
- 4.3 `CandidateService` (CRUD)
- 4.4 Candidate creation + list + detail UI
- 4.5 Structured + full-text candidate search (deterministic layers only — no semantic yet)

## Epic 5 — Document Pipeline
*Depends on: Epic 4 (candidate resume upload is the first real consumer).*

- 5.1 `documents`/`document_versions`/`document_chunks`/`document_extractions`/
  `document_embeddings` migrations, RLS
- 5.2 Object storage adapter (S3-compatible), signed upload/download URLs
- 5.3 Text extraction (pdf/docx parsing)
- 5.4 Inngest pipeline: upload → extract → classify → chunk → embed
- 5.5 pgvector index + embedding generation (`AIProvider.embed`)

## Epic 6 — AI Provider Abstraction + First Agent (Candidate Intelligence)
*Depends on: Epic 5 (needs documents to extract from), Epic 3 (`ai_executions`/`approval_requests`/`events` tables — governance substrate).*

- 6.1 `ai_executions`/`ai_recommendations`/`approval_requests`/`events` migrations, RLS
- 6.2 `AIProvider` interface + `AnthropicProvider` adapter (ADR-003)
- 6.3 `model-routing.ts` + agent registry config module (ADR — Section I)
- 6.4 `candidate_intelligence` workflow: resume → structured extraction → `document_extractions`
  (PENDING_REVIEW) → recruiter confirm → `CandidateService` applies confirmed fields
- 6.5 Provenance UI: show `source`/`confidence` per field, confirm/edit/reject controls
- 6.6 `ai_executions` logging wired into every `AIProvider` call (not opt-in per workflow)
- 6.7 Resume-extraction eval suite (Section 51) — required before this epic is "done," not a
  follow-up

## Epic 7 — Candidate Matching
*Depends on: Epic 3 + Epic 4 (needs both Job and Candidate data), Epic 6 (needs embeddings for Layer 3).*

- 7.1 `candidate_job_matches` migration, RLS
- 7.2 Layer 1 hard-filter query + Layer 2 deterministic weighted scoring function (unit tested)
- 7.3 Layer 3 semantic scoring via pgvector
- 7.4 `MatchService.explain()` — AI narrates the precomputed `score_breakdown`
- 7.5 Match UI on Job detail (ranked candidate list) and Candidate detail (ranked job list)
- 7.6 Candidate-matching eval suite

## Epic 8 — Interview + Submission Intelligence
*Depends on: Epic 6 (agent pattern proven), Epic 7 (submission originates from a match).*

- 8.1 `submissions`/`interviews`/`interview_feedback`/`offers` migrations, RLS,
  `submission_status_enum`
- 8.2 `SubmissionService`/`InterviewService`
- 8.3 `submission_intelligence` workflow: match → draft → `ApprovalRequest` → recruiter
  approve/edit/reject → `SubmissionService.send()`
- 8.4 `interview_intelligence` workflow: notes/transcript → structured `interview_feedback`
- 8.5 `intake_intelligence` workflow: retrofit onto Job creation (Epic 3) once the agent pattern is
  proven here — deliberately sequenced after 8.3/8.4, not before, since intake has the least
  time-pressure of the three
- 8.6 Approval Queue UI (reads `approval_requests` directly)
- 8.7 Submission/interview eval suites

## Epic 9 — Placement & Revenue
*Depends on: Epic 8 (a placement originates from an offer).*

- 9.1 `placements` migration, RLS
- 9.2 `RevenueService` (`estimatedFee`, `expectedValue` — unit tested against fixed inputs/outputs)
- 9.3 Placement recording UI (from accepted offer)
- 9.4 Weighted pipeline calculation, surfaced on Job list and (later) Command Center

## Epic 10 — Chief of Staff + Command Center
*Depends on: Epic 9 (revenue), Epic 8 (approvals/submissions), Epic 3 (jobs), Epic 1 (tasks —
add `tasks` migration here if not pulled earlier).*

- 10.1 `tasks` migration, RLS, `TaskService`
- 10.2 `AgencyHealthService`, `RevenueForecastService`, `PriorityJobService`,
  `OwnerActionService` — each a narrow, independently testable aggregation service
- 10.3 `chief_of_staff` workflow: consumes the above services' structured output, narrates it
  (never recomputes it — Section 19)
- 10.4 Command Center UI: KPI row, priority jobs, pending tasks/submissions/approvals, Chief of
  Staff brief — matches the reference screenshot's information architecture, without the 3D scene
  (see [`05-delivery.md`](../architecture/05-delivery.md#the-ai-office-prototype))
- 10.5 Chief of Staff eval suite (recommendation acceptance rate — needs real usage data to be
  meaningful, so this eval matures post-launch, not pre-launch)

## Cross-cutting (ongoing, not a single epic)

- Tenant-isolation tests for every new domain service (Epic 1's suite is the template)
- Audit logging for every new mutation
- `ai_executions` logging for every new `AIProvider` call
- ADR written for any decision that changes the architecture package, not just implements it
