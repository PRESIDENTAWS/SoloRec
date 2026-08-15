# 30 / 60 / 90-Day Roadmap

Maps directly onto the epics in [`backlog.md`](./backlog.md). Each milestone lists acceptance
criteria that are testable, not aspirational — "it feels done" is not a criterion anywhere here.

## Day 0–30: Foundation, CRM, Recruiting Core (data only, no AI yet)

**Ships:** Epic 1 (Platform Foundation), Epic 2 (CRM), Epic 3 (Jobs), Epic 4 (Candidates) — Epic 5
(Document Pipeline) started but AI extraction not required to land this window; documents can be
uploaded/stored/browsed without extraction working yet.

**Acceptance criteria:**
- A user can sign up, create an organization, invite a teammate with a specific role, and that
  role's permissions are actually enforced (a `RECRUITER` cannot access `FINANCE`-only views).
- Tenant isolation test suite passes, including the "RLS catches a broken WHERE clause" test from
  the Sprint 1 acceptance criteria in `05-delivery.md`.
- A recruiter can create a Client, add Contacts, create a Job with structured MUST_HAVE/PREFERRED/
  DISQUALIFIER requirements, create a Candidate, and upload a resume file that lands in object
  storage with a `documents` row — no AI processing required to pass this milestone.
- Every mutation in the above flow has a corresponding `audit_logs` row.

**Explicit non-goal for this window:** no AI call happens anywhere in the product yet. This is
deliberate — proving the deterministic foundation (tenancy, RBAC, audit, core entities) is solid
before adding AI on top of it, per Section 1's "smallest technically sound foundation" directive.

## Day 31–60: AI Candidate Intelligence + Matching + Submission/Interview Intelligence

**Ships:** Epic 5 completed (extraction pipeline live), Epic 6 (Candidate Intelligence, first
agent), Epic 7 (Matching), Epic 8 (Submission + Interview Intelligence, Approval Queue).

**Acceptance criteria:**
- Uploading a resume produces a `document_extractions` row with structured, schema-validated
  output within an agreed latency target (define target once Epic 6 eval baseline exists — not
  guessed here), visible to the recruiter as PENDING_REVIEW with per-field source/confidence.
- Recruiter confirm/edit/reject on extracted fields correctly updates `candidates`/
  `candidate_employments`/`candidate_skills` with `source = 'USER_CONFIRMED'`.
- Given a Job and a pool of Candidates, `candidate_job_matches` produces ranked results with a
  visible score breakdown and evidence-with-provenance per requirement (including `UNKNOWN` where
  appropriate — never a fabricated match).
- A recruiter can generate an AI-drafted submission, see it land in the Approval Queue as a
  `PENDING` `ApprovalRequest`, edit it, approve it, and have `SubmissionService.send()` actually
  execute — with an `audit_logs` row and `ai_executions.user_feedback` capturing whether it was
  edited before approval.
- Interview notes pasted into the product produce structured `interview_feedback` with a
  recommendation field, reviewable before it's treated as final.
- Resume-extraction and candidate-matching eval suites (Section 51) are running in CI with a
  documented baseline score — not just "written," actually gating merges.

## Day 61–90: Placement, Revenue, Chief of Staff, Command Center

**Ships:** Epic 9 (Placement & Revenue), Epic 10 (Chief of Staff + Command Center) — this is the
Section 59 "90-day target" list end to end.

**Acceptance criteria (this is the full 90-day target from the master prompt, restated as
pass/fail):**
- An agency owner can sign in, manage org/users, create a client, create a contact, create a job,
  complete structured intake, add a candidate, upload a resume, get a structured candidate profile,
  search candidates, match a candidate to a job, record recruiter-screen notes, get interview
  intelligence, get a generated submission, review and approve/edit it, track submission stage,
  track an interview, record a placement, see the placement fee calculated correctly
  (`RevenueService`, unit-test-verified formula, not eyeballed), see essential agency KPIs on the
  Command Center, and receive at least one AI Chief of Staff recommendation that traces back to a
  real underlying aggregation service, not an invented number.
- Every AI-touched field in every one of the above steps has visible provenance (source,
  confidence, and — where applicable — a link back to the originating document/extraction).
- Every state-changing AI proposal in the entire flow went through `ApprovalRequest`; zero
  autonomous execution occurred anywhere in the flow without a human decision point.
- Weighted pipeline and Agency Health figures on the Command Center are traceable to
  `RevenueForecastService`/`AgencyHealthService` reads — a developer can point at the exact query
  behind every number the Chief of Staff narrates.

**If this window slips:** the correct response is to cut scope within Epic 9/10 (e.g., ship
Placement & Revenue without the Chief of Staff narration layer, surfacing the same KPI numbers with
plain aggregation instead of AI-generated prose) rather than compress the acceptance criteria
above — a Command Center with fabricated-sounding numbers is worse than one with fewer AI-narrated
insights and clearly correct ones.

## After Day 90

Not scheduled yet, deliberately — Section 34/38 phases beyond this point (Sourcing Intelligence,
contract staffing/Assignment+Timesheet, Client DNA, SLA engine, custom RBAC, external integrations)
are sequenced by what the first 90 days of real usage actually surfaces as the next bottleneck, not
pre-committed here.
