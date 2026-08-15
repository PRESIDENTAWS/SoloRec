# AI Agent Architecture — MVP Scaffold

Covers the `Agent` model, autonomy levels, and agent-related UI/services actually implemented in
this starter. For the backend agent registry, tool architecture, and approval engine design this
scaffold is meant to grow into, see
[`docs/architecture/04-ai-and-agents.md`](./architecture/04-ai-and-agents.md) — that document is
authoritative on how agents should eventually be *implemented*; this one documents what's
*displayed* today.

## The Agent type

`types/agent.ts` defines the frontend-facing shape every AI HQ page renders:

```ts
interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  status: AgentStatus;         // working | review_required | idle | blocked | offline
  avatar: string;
  currentTask: string;
  currentJob?: string;
  autonomyLevel: AutonomyLevel; // 0-5
  health: number;               // 0-100, mock only
  lastAction: string;
  taskCount: number;
  approvalCount: number;
  kpis: AgentKpi[];
  tools: string[];
  permissions: string[];
}
```

This is deliberately a *different, simpler* shape than the backend `AgentDefinition` in the deeper
architecture doc (slug, `allowedTools`, `allowedDataScopes`, `permissionLevel`,
`requiresApproval`). The relationship: a future API layer reads `AgentDefinition` config plus
`AgentRun`/event history and projects it into this `Agent` shape for the UI. The UI should never
need to know about `AgentDefinition`'s internal structure.

## Autonomy levels

```
0 — Observe                          (agent reads/analyzes only, proposes nothing)
1 — Recommend                        (agent suggests actions for a human to take)
2 — Draft                            (agent prepares content for human review)
3 — Execute Approved Actions         (agent executes only after explicit approval)
4 — Autonomous Workflow (Escalation) (agent runs a workflow, escalates exceptions)
5 — Management Agent                 (coordinates/oversees other agents)
```

This scale is a UI-facing simplification of the deeper architecture's `PermissionLevel`
(`READ | ANALYZE | DRAFT | PROPOSE | EXECUTE_WITH_APPROVAL | LIMITED_AUTONOMOUS_EXECUTION`) plus a
notion of hierarchy the backend design doesn't yet need (level 5, "management agent," has no
backend equivalent — it's reserved for a future ORION-coordinates-other-agents capability, not
implemented here). None of the seed agents in this starter are above level 4, and **no tool or
service in this codebase actually executes anything autonomously** — every mutating action in the
Approval Center starts as `pending` and requires an explicit human decision, matching the
architecture package's rule that AI actions requiring approval by default include: candidate
outreach, client communication, candidate rejection, offer decisions, contracts, and financial
transactions.

## The nine seed agents

Defined in `lib/agents/registry.ts`, served through `services/agents/agentService.ts`:

| Agent | Department | Role | Autonomy |
|---|---|---|---|
| ORION | Executive Intelligence | AI COO / Executive Intelligence | 4 |
| AVA | Talent Lab | Lead Sourcing Agent | 3 |
| MILO | Recruiting | Recruiting Agent | 2 |
| LUNA | Candidate Intelligence | Matching Agent | 3 |
| ECHO | Compliance | Compliance Agent | 2 |
| SPARK | Revenue | Business Development Agent | 3 |
| NOVA | Client Success | Client Success Agent | 2 |
| FIN | Finance | Finance Agent | 2 |
| GUARD | Legal / Risk | Legal & Risk Agent | 1 |

These map directly onto 9 of the 18 logical capabilities in the vision prompt's full agent roster,
and onto 5 of them (AVA→candidate_intelligence, MILO→interview/submission intelligence,
ORION→chief_of_staff) at the level of the MVP-scoped 5-agent backend registry in
[`docs/architecture/04-ai-and-agents.md#i-agent-registry`](./architecture/04-ai-and-agents.md#i-agent-registry).
The other four seed agents (LUNA, ECHO, SPARK, NOVA, FIN, GUARD) exist in this UI scaffold ahead of
their backend workflows — that's intentional for demonstrating the full office visualization, but
means their "current task" and KPI values are illustrative mock content, not backed by any running
process.

## The office visualization

`components/office/OfficeScene.tsx` renders each agent as a `Workstation` positioned per
`lib/agents/office-layout.ts`, colored by `AGENT_STATUS_COLOR` (blue = working, purple = review
required, gray = idle, red = blocked, dim = offline — one source of truth shared with the 2D
status badges via `lib/agents/constants.ts`, so the 3D scene and the rest of the UI can't drift
out of sync on what a color means). Clicking a workstation updates `selectedAgentId`, which is
owned by `CommandCenterClient` (a client component) — the scene itself holds no state and no
business logic, per the constraint carried over from the master build prompt.

## Approval Center

`app/ai-hq/approvals/page.tsx` is a client component with local React state seeded from
`lib/data/mockApprovals.ts`. Approve/Reject mutate that local state only — nothing is sent to a
backend, and reloading the page resets to the seed data. This mirrors, at UI scale, the real
`ApprovalRequest` state machine designed in
[`docs/architecture/04-ai-and-agents.md#k-human-approval-engine`](./architecture/04-ai-and-agents.md#k-human-approval-engine):
`pending → approved | rejected`, with `EXECUTED`/`EXPIRED`/`CANCELLED` states from the full design
not modeled here since there's no backend action to execute yet.

## Agent Memory

`app/ai-hq/agents/[agentId]/memory/page.tsx` renders five categories (company, client, candidate,
market, performance) from `services/memory/memoryService.ts`. Every `MemoryItem` already carries
an `embedding: number[] | null` field — currently always `null` — so a pgvector-backed
implementation is a data-population change, not a type change, matching the seam described in
[`docs/architecture/04-ai-and-agents.md#m-memory-architecture`](./architecture/04-ai-and-agents.md#m-memory-architecture).

## What is explicitly not built here

- No AI provider calls anywhere in this codebase — `AI_PROVIDER_API_KEY` in `.env.example` is
  unused. Everything labeled as an agent "action" is static mock content.
- No tool-calling / function-calling infrastructure — the `tools` field on `Agent` is display-only.
- No realtime event delivery — `EventService` returns a static list.
- No agent-to-agent orchestration of any kind.

Building these is Phase 6+ work per [`docs/product/roadmap.md`](./product/roadmap.md), gated on the
platform foundation (auth, tenancy, audit) landing first.
