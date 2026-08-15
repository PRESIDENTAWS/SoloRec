# SoloRec AI

AI-native operating system for solo recruiters, full-desk recruiters, boutique staffing agencies,
and executive search firms — covering the full lifecycle from Prospect through Placement, Revenue,
and Retention.

## Status: Phase 0 — Architecture (pre-code)

No application code has been written yet. This is intentional: the project's build protocol
requires an approved architecture before Sprint 1 starts, so the codebase doesn't accumulate
disconnected files ahead of a settled data model, tenancy model, and AI governance model.

**Start here:** [`/docs/architecture/README.md`](./docs/architecture/README.md)

That package covers the layered application architecture, domain map, MVP boundary, full ERD and
schema proposal, multi-tenant security and RBAC design, the AI/agent/approval/event architecture,
and the delivery plan (repo structure, ADRs, backlog, 30/60/90 roadmap, risks, and open questions).

## Repository layout

```
/docs
  /architecture   the architecture package described above
  /adr            standalone architecture decision records
  /product        implementation backlog and roadmap
```

Application code (`/app`, `/server`, `/components`, `/lib`) is added starting with Sprint 1
(Platform Foundation), per [`/docs/architecture/05-delivery.md`](./docs/architecture/05-delivery.md#recommended-first-implementation-sprint).
