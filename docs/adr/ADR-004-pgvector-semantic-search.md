# ADR-004: pgvector for Initial Semantic Search

**Status:** Accepted — revisit if scale demands it

## Context

Candidate/job matching and RAG retrieval both need semantic (embedding) search over document
chunks and profile text. A dedicated vector database (Pinecone, Weaviate, Qdrant) is the common
default for this, but introduces a second data store to keep consistent with Postgres, a second
system to secure/tenant-isolate, and a second operational dependency.

## Decision

Use the `pgvector` extension inside the same PostgreSQL instance for MVP and near-term scale. IVF
Flat (or HNSW, chosen at implementation time based on the pgvector version available on the
managed provider) index on `document_embeddings.embedding`.

## Alternatives considered

- **Dedicated vector database from day one** — rejected for MVP: SoloRec's near-term embedding
  volume (resumes + job descriptions + notes for a solo recruiter up to a small agency) is well
  within pgvector's comfortable range, and a separate store would need its own tenant-isolation
  design (Section 13's requirement that "tenant isolation must also apply to vector retrieval")
  duplicated outside of Postgres RLS, which ADR-002 already provides for free inside Postgres.
- **No semantic search in MVP, full-text only** — considered as the true minimal option; rejected
  because candidate/job semantic matching (Layer 3 of the matching architecture) is close enough to
  free once documents are already being chunked and embedded for RAG that skipping it saves little
  engineering time while cutting a meaningfully differentiating MVP feature.

## Consequences

- One database to operate, one connection pool, one backup strategy, one place RLS applies.
- Embedding dimension is fixed by the chosen embedding model at schema-definition time
  (`vector(1536)` for common OpenAI/Anthropic-compatible embedding sizes) — changing embedding
  models later requires a migration and re-embedding pass, not just a config change. This is
  accepted as a reasonable one-time cost.
- Revisit trigger: if embedding table size or query latency becomes a measured problem (not a
  hypothetical one) at real customer volume, migrate the `document_embeddings` data to a dedicated
  vector store — the data is already logically separable from the rest of the schema, so this is an
  additive migration, not a rearchitecture.
