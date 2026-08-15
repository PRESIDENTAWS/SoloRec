# ADR-002: Multi-Tenancy Strategy

**Status:** Accepted

## Context

SoloRec will eventually host many staffing agencies (organizations) in one deployment. Tenant data
leakage is the single most damaging class of bug this product can ship — recruiting data is
commercially sensitive (client lists, candidate PII, fee terms) and a leak destroys trust
irrecoverably.

## Decision

Shared database, shared schema, row-level tenant isolation via `organization_id`, enforced at two
independent layers:

1. Application-layer scoping — every domain service call requires an authenticated `ctx.organizationId`, never a client-supplied one.
2. Postgres Row-Level Security policies on every tenant-scoped table, keyed off a `SET LOCAL app.current_org_id` set per request transaction.

Full design in [`03-security-and-tenancy.md`](../architecture/03-security-and-tenancy.md).

## Alternatives considered

- **Database-per-tenant** — strongest isolation, but the wrong cost/benefit for SoloRec's target
  segment (solo recruiters to boutique agencies, small data volumes); multiplies migration and
  connection-pooling operational complexity for isolation the target segment doesn't need, and
  makes cross-tenant platform features (future benchmarking, aggregate analytics) much harder.
  Revisit only if a specific enterprise customer contractually requires physical isolation — at
  that point it's an opt-in exception for one tenant, not a platform-wide redesign.
- **Schema-per-tenant** — middle ground, rejected: still multiplies migration complexity (N schemas
  to migrate) without RLS's benefit of being enforced *even when application code has a bug*.
- **App-layer scoping only, no RLS** — rejected as insufficient: a single missing `WHERE
  organization_id = ...` in a new service method becomes a cross-tenant data leak with no second
  line of defense. RLS costs one migration; the risk it closes is the worst-case failure mode for
  this product category.

## Consequences

- Every new tenant-scoped table's migration must include the RLS policy — this is a checklist item
  in the migration review process, not optional.
- Connection pooling must correctly scope `SET LOCAL` per transaction (not per connection) to avoid
  a pooled connection leaking one request's org context into another's.
- Global/shared taxonomy tables (`skills`, etc.) are the explicit exception and must be reviewed
  case-by-case before adding `organization_id is null` rows.
