# ADR-007: Transactional Outbox over a Message Broker

**Status:** Accepted

## Context

Domain events (`candidate.resume_uploaded`, `submission.approved`, etc.) need to reliably trigger
downstream work — AI workflows, notifications, task creation — without requiring Kafka-class
infrastructure that this product's scale doesn't justify (Section 18 explicitly warns against
requiring Kafka for MVP).

## Decision

Transactional outbox pattern: domain services write an `events` row in the same database
transaction as the state change they describe. A dispatcher (polling or `LISTEN/NOTIFY`) picks up
undispatched events and hands them to Inngest functions (see ADR-009) for actual processing.

## Alternatives considered

- **Kafka / dedicated message broker** — rejected for current scale; operational overhead
  (cluster, partitioning, consumer group management) is disproportionate to SoloRec's event volume
  at MVP and near-term scale, and it's a genuinely hard thing to run well. Revisit only if event
  throughput or multi-consumer fan-out becomes a measured bottleneck.
- **Fire-and-forget in-process event emission** (e.g., a plain `EventEmitter`) — rejected: no
  durability. If the process crashes between the state change and the emit, the event is lost with
  no trace, and there's no retry/replay story.
- **Direct calls from domain services to downstream workflows** (no event layer at all) — rejected:
  couples e.g. `SubmissionService.approve()` directly to knowing every consumer of that fact
  (Chief of Staff refresh, task creation, future notification), which grows into an unmanageable
  fan-out inside one service method as more consumers appear.

## Consequences

- Every domain service mutation that other parts of the system need to react to must be wrapped in
  a DB transaction that includes the `events` insert — this is a code-review checklist item.
- The dispatcher is a small, independently testable component; swapping its transport (polling →
  `LISTEN/NOTIFY` → eventually a broker) doesn't change how domain services emit events.
- `events` doubles as a partial audit trail of "what happened and when" from a system-behavior
  angle, complementary to (not a replacement for) `audit_logs`, which is actor-centric.
