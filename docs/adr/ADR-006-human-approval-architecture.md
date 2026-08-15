# ADR-006: Human Approval Engine as a Reusable Service

**Status:** Accepted

## Context

Multiple AI workflows (submission drafting now; offer negotiation, compliance exceptions, account
expansion later) all need the same pattern: an agent proposes a state-changing action, a human
authorizes it, and only then does it execute. Building this per-agent would duplicate the state
machine and, worse, create N slightly different approval UIs and audit shapes.

## Decision

One `ApprovalRequest` entity and one `ApprovalService`, used by every agent/workflow that proposes
anything beyond `READ`/`ANALYZE`. Full state machine in
[`04-ai-and-agents.md`](../architecture/04-ai-and-agents.md#k-human-approval-engine).

## Alternatives considered

- **Per-agent approval logic** (e.g., `SubmissionApprovalFlow`, `OfferApprovalFlow` as separate
  bespoke implementations) — rejected: duplicates the PENDING/APPROVED/REJECTED/EXPIRED state
  machine N times, and makes the Command Center's "pending approvals" view a union of N different
  data shapes instead of one query against `approval_requests`.
- **No approval gate — agents execute directly and log after the fact** — rejected outright; this
  violates the core compliance-safety requirement (Section 31) that AI must not independently make
  consequential hiring/financial decisions, and removes the one mechanism that keeps a human in the
  loop for legally/financially material actions.

## Consequences

- Every risky tool call (`request_approval`) is structurally incapable of skipping this path — there
  is no tool that both proposes a state change and executes it in the same call.
- The Command Center's "Recommended Actions" panel is a direct read of `approval_requests` +
  `ai_recommendations` — no separate aggregation logic needed for that UI.
- Approval expiry (`EXPIRED` status) needs a scheduled sweep — not built in MVP Sprint 1, tracked in
  the backlog for the sprint that ships the first agent whose proposals go stale (submission
  intelligence).
