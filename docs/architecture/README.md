# SoloRec AI — Architecture Package

Status: **Phase 0 — Architecture (pre-code)**. No application code has been written against this
architecture yet. Per the SoloRec master build protocol, this package must be reviewed and
approved before Sprint 1 begins.

This is the second master prompt's deliverable: the technical foundation underneath the product
vision — data model, tenancy/security model, orchestration model, and MVP sequencing.

## What already exists in this repo

- `README.md` — placeholder only.
- Nothing else. The repository is unbuilt.

## What was supplied alongside this architecture request

A standalone Next.js/Three.js prototype (`ai-staffing-hq`, uploaded as a zip) renders a 3D
"AI Office" with nine hardcoded fictional agents (ORION, AVA, MILO, LUNA, ECHO, SPARK, NOVA, FIN,
GUARD) and a mock KPI bar. It has **no backend, no database, no auth, no real agent registry** —
`lib/agents.ts` is a static array. It is a visualization skin, not architecture. See
[`05-delivery.md`](./05-delivery.md#the-ai-office-prototype) for the explicit call on what to do
with it (short version: keep it as a future presentational layer for Phase 8/"AI Agent World",
rebuild it against the real `agents` / `agent_runs` tables, do not treat its mock data model as
real, and do not let 9 fictional agent personas anchor the actual Agent Registry design — the
registry in this doc starts from the 18 logical capabilities in the vision prompt, condensed to 5
for MVP per Section 36).

The two referenced operating manuals (Recruiting Operations Manual, Appendix Pack A–L) were named
but their contents were not provided to this session. This architecture anticipates their fields
(intake templates, scorecards, compliance schedules, reporting specs, compensation worksheets) via
`JobRequirement`, `InterviewFeedback`, `ComplianceRequirement`, and `Document*` — but their actual
content should be diffed against this schema once available, before Sprint 3 (Recruiting Core)
locks the intake and compliance table shapes. This is called out as Open Question OQ-1.

## Reading order

1. [`01-product-architecture.md`](./01-product-architecture.md) — layered architecture, domain map, MVP boundary (in/out)
2. [`02-data-model.md`](./02-data-model.md) — ERD, database schema, indexes, status enums
3. [`03-security-and-tenancy.md`](./03-security-and-tenancy.md) — multi-tenant isolation, RBAC, audit, PII
4. [`04-ai-and-agents.md`](./04-ai-and-agents.md) — AI provider abstraction, agent registry, tools, approvals, events, memory, document pipeline, matching, revenue intelligence
5. [`05-delivery.md`](./05-delivery.md) — repository structure, ADR index, backlog, 30/60/90 roadmap, risks, open questions, first sprint

ADRs live in [`/docs/adr`](../adr). Backlog and roadmap live in [`/docs/product`](../product).
