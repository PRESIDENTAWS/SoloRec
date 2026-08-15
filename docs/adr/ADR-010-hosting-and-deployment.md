# ADR-010: Vercel + Managed Postgres, No Kubernetes

**Status:** Accepted

## Context

Section 4 directs avoiding Kubernetes for MVP unless technically necessary, and choosing a simple
managed environment. The app is a single Next.js deployable (per
[`01-product-architecture.md`](../architecture/01-product-architecture.md)) plus managed dependencies
(Postgres, object storage, background jobs).

## Decision

- **App hosting:** Vercel (Next.js origin platform — zero-config previews per branch/PR, which
  fits this project's branch-per-task GitHub workflow well).
- **Database:** managed Postgres with branching support (Neon or Supabase — either satisfies
  ADR-001/ADR-004; final pick is an implementation-time detail, not an architectural one, since
  both give pgvector + standard Postgres).
- **Object storage:** S3-compatible (Cloudflare R2 preferred for lower egress cost; AWS S3 as
  the fallback if a customer/compliance requirement specifically needs it).
- **Background jobs:** Inngest (ADR-009).

## Alternatives considered

- **Kubernetes on a cloud provider** — rejected outright for MVP: SoloRec is one deployable app,
  and K8s' operational overhead (cluster management, manifests, scaling policies) buys flexibility
  this product doesn't need yet. Revisit only if a second, genuinely different runtime requirement
  emerges (e.g., a long-running stateful worker that serverless functions can't express well) and
  even then, a single managed container platform (e.g., Fly.io, Render) is the next step before K8s.
- **Self-managed VPS/EC2** — rejected: trades a manageable amount of Vercel's opinionated
  convenience for infrastructure ownership (TLS, scaling, zero-downtime deploys) with no benefit at
  this stage.

## Consequences

- Serverless function timeout limits are why background/multi-step AI work goes through Inngest
  (ADR-009) rather than running inline in a route handler.
- Preview deployments per branch give free environment separation (Section 29) for review — each
  PR gets its own Postgres branch (Neon/Supabase branching) + Vercel preview URL, so testing against
  production data never happens by default.
- If a background worker process is later needed that doesn't fit the serverless model, it deploys
  as a second small service (not a full microservices split) — consistent with the "no
  microservices prematurely" stance in [`01-product-architecture.md`](../architecture/01-product-architecture.md).
