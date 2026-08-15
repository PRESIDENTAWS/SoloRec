/**
 * Placeholder shape for agent memory. `embedding` is typed now so a real
 * pgvector-backed implementation is a data-population change, not a type
 * change — see docs/architecture/04-ai-and-agents.md#m-memory-architecture.
 */
export type MemoryCategory = "company" | "client" | "candidate" | "market" | "performance";

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  summary: string;
  source: string;
  confidence: number;
  createdAt: string;
  embedding: number[] | null;
}
