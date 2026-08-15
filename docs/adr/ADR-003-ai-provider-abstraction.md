# ADR-003: AI Provider Abstraction

**Status:** Accepted

## Context

SoloRec's differentiation is workflow + data model, not any single model vendor. Model quality,
pricing, and availability shift quickly; a hard dependency on one provider's SDK throughout the
codebase would make switching or multi-provider routing (cheap model for extraction, strong model
for reasoning) expensive to change later.

## Decision

An internal `AIProvider` interface (`generate`, `generateStructured<T>`, `embed`) with
provider-specific adapters (`AnthropicProvider` first, `OpenAIProvider` second). All AI-calling
code goes through this interface and a per-task model-routing config
(`server/ai/model-routing.ts`) — no workflow imports a vendor SDK directly. Full design in
[`04-ai-and-agents.md`](../architecture/04-ai-and-agents.md#h-ai-architecture).

## Alternatives considered

- **Call Anthropic's SDK directly everywhere** — fastest to ship, rejected because it embeds
  vendor-specific request/response shapes into every workflow, making later multi-provider routing
  or a vendor switch a full-codebase change instead of a new adapter.
- **A general-purpose LLM framework (LangChain/LlamaIndex) as the abstraction** — rejected for MVP;
  these frameworks bring significant surface area (chains, agents, retrievers) that duplicates
  what this document already designs explicitly (tools, approval engine, RAG scoping), and their
  abstractions tend to fight a codebase that wants deterministic business logic outside the prompt
  layer. A thin internal interface is easier to reason about and test.

## Consequences

- Structured output (`generateStructured`) is the default call shape for anything that persists to
  the database — this is what makes provenance (Section 2) and the "AI explains, doesn't compute"
  rule (matching, revenue) enforceable in code rather than by convention.
- Adding OpenAI as a fallback/comparison provider is a new adapter class, not a workflow rewrite.
- Model-routing config is the single file to audit for cost/quality tradeoffs — see AI cost
  controls in the AI architecture doc.
