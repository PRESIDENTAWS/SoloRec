# ADR-005: Drizzle ORM over Prisma

**Status:** Accepted

## Context

The master prompt requires choosing one ORM (Prisma or Drizzle) and explaining the tradeoff. The
schema (Section 39/E) is large — 25+ MVP tables, custom Postgres enums, `jsonb` columns, composite
and partial indexes, and `pgvector` columns — and must support Row-Level Security policies (ADR-002)
without fighting the ORM's query layer.

## Decision

**Drizzle ORM.**

## Comparison

| | Drizzle | Prisma |
|---|---|---|
| Migrations | Plain SQL, generated and human-reviewable/editable | Prisma's own migration format, less direct SQL control |
| Runtime | No query-engine binary; thin TS layer over SQL | Rust query-engine binary — extra cold-start weight, awkward on some serverless/edge runtimes |
| Postgres-specific features (partial indexes, `pgvector`, RLS-friendly raw SQL) | First-class / easy escape hatch to raw SQL | Possible but historically friction-prone (custom types, partial indexes need workarounds) |
| Type inference | Inferred directly from schema definitions | Generated client from schema file |
| Tooling maturity / GUI | Drizzle Studio (newer, less polished) | Prisma Studio (more mature), larger ecosystem |
| Learning curve | Closer to SQL — more explicit query building | Higher-level, more "magic," historically faster to start with |

## Rationale

SoloRec's schema leans on exactly the Postgres features Prisma handles least comfortably: many
custom enums, `jsonb` scoring/provenance blobs, `pgvector` columns, and — most importantly —
Row-Level Security, which requires the app to run `SET LOCAL app.current_org_id` inside the same
transaction as every query. Drizzle's thinner, closer-to-SQL layer makes this pattern
straightforward; Prisma's connection/transaction handling through its query engine makes it a
recurring fight. Given ADR-002 makes RLS a load-bearing security control, not a nice-to-have, this
tradeoff decides the ORM choice.

## Consequences

- Migrations are reviewed as SQL diffs in PRs — good for a domain this compliance-sensitive, since
  reviewers can read exactly what changes (new column, new constraint, new RLS policy) without a
  Prisma-schema-to-SQL mental translation step.
- Drizzle Studio is used for local dev inspection; no separate admin GUI is built for MVP.
- If team velocity or hiring later favors Prisma's larger ecosystem enough to outweigh the RLS
  friction, this is a schema-definition-layer swap, not a data model change — the underlying SQL
  schema in [`02-data-model.md`](../architecture/02-data-model.md) is ORM-agnostic by design.
