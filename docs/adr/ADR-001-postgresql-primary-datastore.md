# ADR-001: PostgreSQL as Primary Data Store

**Status:** Accepted

## Context

SoloRec needs one authoritative operational database (Section 2 of the master prompt) holding
structured business records, plus eventual semantic search over resumes/documents, plus multi-
tenant isolation. The domain model (40+ entities, many foreign keys, enums, constraints) is
heavily relational.

## Decision

PostgreSQL is the single primary data store for all structured operational data, with the
`pgvector` extension for embeddings (see ADR-004) rather than a separate vector database.

## Alternatives considered

- **MySQL** — viable relationally, but weaker native support for `jsonb`, array columns, and no
  first-party vector extension equivalent to pgvector's maturity.
- **MongoDB / document store** — a poor fit given how relational the domain is (Client → Job →
  Candidate → Submission → Interview → Offer → Placement chains with strict referential integrity
  and cross-entity constraints); would push referential integrity into application code that
  Postgres foreign keys and check constraints give for free.
- **Separate vector DB (Pinecone/Weaviate/Qdrant) from day one** — rejected for MVP scale; see
  ADR-004.

## Consequences

- Enables Row-Level Security as a second tenant-isolation layer (see ADR-002) — a MySQL/Mongo
  choice would have lost this specific defense-in-depth mechanism.
- Managed Postgres providers (Neon, Supabase, RDS) all support pgvector, so no infra novelty.
- Revisit only if embedding volume/query latency at scale outgrows pgvector — that's a data
  migration, not a rearchitecture, since the vector data is logically separable.
