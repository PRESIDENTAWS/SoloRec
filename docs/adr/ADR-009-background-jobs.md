# ADR-009: Inngest for Background Jobs and Event Dispatch

**Status:** Accepted

## Context

Document parsing, embedding generation, AI workflow execution, and the event dispatcher (ADR-007)
all need reliable background execution with retries — work that doesn't fit inside a single
synchronous HTTP request/response, especially if the app is deployed on a serverless platform with
function timeout limits (ADR-010).

## Decision

Use **Inngest** for background job execution and as the consumer side of the event outbox: the
dispatcher publishes undispatched `events` rows to Inngest, which runs the corresponding step
function (with built-in retries, backoff, and step-level observability).

## Alternatives considered

- **Self-hosted queue on Postgres (e.g., `pg-boss` or `graphile-worker`)** — no third-party
  dependency, keeps everything in the same database. Rejected as the primary choice for MVP mainly
  on operational grounds: it requires running and monitoring a long-lived worker process ourselves,
  which cuts against deploying the rest of the app as serverless (ADR-010). Recorded as the fallback
  if Inngest's pricing or vendor risk becomes a problem — the event outbox pattern (ADR-007) doesn't
  change either way, only what consumes it.
- **Vercel Cron + inline route handlers for everything** — fine for simple scheduled tasks, not
  designed for retry semantics or multi-step AI workflows (extract → validate → embed, each of
  which can independently fail and needs its own retry), so rejected as the primary mechanism.
- **A dedicated worker service (Node process, own deployment) with a self-managed queue** —
  effectively re-introduces the "second service" this architecture explicitly defers (Section 1) 
  before there's a concrete need; Inngest gives the retry/observability benefits of that without
  standing up and operating the service ourselves.

## Consequences

- AI workflow steps (extraction → schema validation → persistence → embedding) are modeled as
  Inngest step functions, giving per-step retry without re-running an entire expensive AI call on a
  transient failure downstream of it.
- Adds a vendor dependency for job execution; if this becomes undesirable, the fallback is
  `pg-boss` against the same `events` table shape — the event *producers* (domain services writing
  the outbox row) don't change.
- Cost/latency of AI calls run inside Inngest functions still route through `AIProvider` (ADR-003)
  and log to `ai_executions` — the job runner is orthogonal to the AI abstraction layer.
