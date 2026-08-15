# F/G/Q — Multi-Tenant Security, RBAC, Audit & PII

## F. Multi-Tenant Isolation

Single Postgres database, shared schema, row-level isolation — not database-per-tenant. Chosen
because SoloRec's tenants (solo recruiters up to boutique agencies) are small-to-medium in data
volume; database-per-tenant buys isolation at the cost of migration/ops complexity this product
doesn't need yet, and it's a much harder retrofit *away from* than shared-schema is a retrofit
*toward*, if a single enterprise tenant later needs physical isolation. See ADR-002.

Isolation is enforced at **two independent layers**, deliberately redundant:

**Layer 1 — Application scoping.** No route handler, server action, or tool ever accepts an
`organization_id` from client input for the purpose of scoping a query. The authenticated session
resolves `organization_id` server-side (from the active `organization_memberships` row for the
request), and every domain service method takes it as a required first argument, not an optional
filter:

```ts
// every domain service method shape:
JobService.list(ctx: { organizationId: string; actorId: string }, filters: JobFilters)
```

There is no `JobService.list(filters)` overload without `ctx`. This is a lint-enforced convention
(see [`05-delivery.md`](./05-delivery.md)), not just a code review habit.

**Layer 2 — Postgres Row-Level Security (defense in depth).** Every tenant-scoped table has RLS
enabled with a policy against a session-local setting:

```sql
alter table jobs enable row level security;
create policy tenant_isolation on jobs
  using (organization_id = current_setting('app.current_org_id')::uuid);
```

The app sets `app.current_org_id` at the start of each request's DB transaction (via
`SET LOCAL`, scoped to the transaction, never leaking across pooled connections). The point of RLS
here is not "the primary access control" — Layer 1 is — it's that a bug in Layer 1 (a missing
`WHERE organization_id = ...`, a service method called with the wrong `ctx`) still cannot leak
cross-tenant rows, because the database itself refuses to return them. This is the single highest-
leverage security control in the whole system given how much of the codebase touches
`organization_id`-scoped tables, and it costs one migration + one Postgres feature, not a new
service.

**Vector search inherits the same rule.** pgvector similarity queries always include
`WHERE organization_id = $1` in addition to the ORDER BY on cosine distance — ranking happens
*within* the tenant-filtered set, never across it. RLS covers this too since it's the same table.

**What does NOT get an `organization_id` column:** global taxonomy rows (`skills`, `job_titles`,
etc., where `organization_id is null`), and `users` (a user is not owned by one org — membership is
the join).

## G. RBAC Model

Two-level model: coarse **Roles** for MVP speed, a **Permission** catalog underneath so
fine-grained checks and future custom roles don't require a schema change later.

```
organization_memberships.role_id -> roles.id -> role_permissions -> permissions
```

MVP ships six system roles (`roles.organization_id is null`, `is_system = true`):

| Role | Summary |
|---|---|
| `OWNER` | Full access, billing, org settings, can't be removed if last owner |
| `ADMIN` | Full access except billing/org deletion |
| `RECRUITER` | Full CRUD on jobs/candidates/submissions they own or are shared with; read on clients |
| `SALES` | Full CRUD on clients/contacts; read-only on candidates |
| `COORDINATOR` | Interview scheduling, task management; no financial fields |
| `FINANCE` | Read on placements/invoices, write on invoice/payment records only |

Custom per-org roles (`roles.organization_id` set) are schema-supported but not exposed in MVP UI —
this is the "anticipate configuration without making everything dynamic in MVP" call from Section
53.

Permission keys are `resource:action` strings (`candidate:read_pii`, `job:approve`,
`submission:approve`, `invoice:create`, `approval_request:decide`). Domain services check
permissions, not roles, directly:

```ts
requirePermission(ctx, "submission:approve")
```

so a role's permission set can change without touching service code. `candidate:read_pii` is
called out specifically because it's the gate between "can see this candidate exists" and "can see
SSN/DOB/full contact info" — see PII section below.

**Agents are a third actor type, not a role.** An `Agent` (see
[`04-ai-and-agents.md`](./04-ai-and-agents.md#agent-registry)) never authenticates as a user or
inherits a user's role. Each tool call carries `actor_type = 'AGENT'` and is checked against the
Agent's own `allowed_data_scopes`/`permission_level`, which is always a subset of what any human
role could do, and which the approval engine gates further for anything beyond `READ`/`ANALYZE`.
This is enforced by construction: the `ToolContext` type has no code path that grants an agent a
user's permission set.

## Q (partial) — Audit, PII, Secrets

*(Q is split across this file and the AI doc — audit logging and PII redaction-for-prompts live
together with the security model; AI execution logging specifics live in
[`04-ai-and-agents.md`](./04-ai-and-agents.md#ai-execution-logging).)*

**Audit log.** `audit_logs` is insert-only at the Postgres grant level — the application's DB role
has `INSERT` but not `UPDATE`/`DELETE` on that table (enforced via `REVOKE`, not just "we don't
write code that does that"). Every domain service mutation that changes a persisted business
record writes one row: `actor_type` (`USER|SYSTEM|AGENT|INTEGRATION`), `actor_id`, `action`,
`entity_type`/`entity_id`, `before`/`after` (jsonb diffs, not full-row dumps where rows contain
PII — see below), `source`, `ip_address`. This happens inside the same domain service call, same
transaction as the mutation — audit logging is not a downstream event consumer that could silently
fail to run.

**PII classification.** Candidate fields are classified at the column level:

| Class | Fields | Rule |
|---|---|---|
| `PUBLIC` | name, current title, normalized skills | Freely used in prompts, search, matching |
| `CONTACT` | email, phone | Requires `candidate:read_pii`; excluded from AI prompt context unless the specific tool call needs it (e.g., "draft outreach email") |
| `SENSITIVE` | SSN/tax ID (future compliance fields), DOB, exact address | Never sent to an AI prompt under any circumstance; access requires `candidate:read_pii` + audit-logged read |

A single `assemblePromptContext(entityType, entityId, purpose)` helper is the only sanctioned way
a workflow builds candidate/client context for a prompt — it applies the classification table
and strips anything above `PUBLIC` unless `purpose` explicitly whitelists `CONTACT`. No workflow
concatenates raw row data into a prompt string directly. This is a code-organization decision, not
just a policy: it means there's exactly one place to audit for PII-in-prompts risk.

**Secrets.** AI provider keys, DB credentials, storage credentials, and integration OAuth tokens
live in host-managed encrypted environment variables (see ADR-010), never in the database, never
returned in any API response, and never referenced in client-side bundles. Route handlers and
server actions are the only code that reads `process.env` for secrets; nothing under `/app`'s
client components does.

**Retention & deletion.** Candidate PII deletion (a candidate or org requesting removal) is a
service-layer operation (`CandidateService.purge`), not a raw `DELETE` — it must also purge
`candidate_documents` from object storage, cascade to `document_chunks`/`document_embeddings`, and
write a final audit log row *before* the data is gone (the audit trail records that a deletion
happened and by whom, even though the deleted data itself is gone). Retention windows are an
`organization_settings` value, checked by a scheduled job — not built in MVP, but the service
boundary (`purge`) exists from Sprint 3 so it isn't a bolt-on later.
