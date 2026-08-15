import type { MemoryCategory, MemoryItem } from "@/types";

/**
 * MOCK DATA — placeholder memory items per category. `embedding` is null
 * throughout; populated once a pgvector-backed MemoryService replaces the
 * mock implementation (see services/memory/memoryService.ts).
 */
const build = (category: MemoryCategory, items: Array<Omit<MemoryItem, "category" | "embedding">>): MemoryItem[] =>
  items.map((item) => ({ ...item, category, embedding: null }));

export const MOCK_MEMORY: Record<MemoryCategory, MemoryItem[]> = {
  company: build("company", [
    {
      id: "mem-company-1",
      summary: "Agency prioritizes direct-hire placements in manufacturing and industrial automation.",
      source: "organization_settings",
      confidence: 0.95,
      createdAt: "2026-06-01T00:00:00.000Z"
    }
  ]),
  client: build("client", [
    {
      id: "mem-client-1",
      summary: "ABC Manufacturing typically extends offers within 5 business days of final interview.",
      source: "client_activity_history",
      confidence: 0.81,
      createdAt: "2026-07-20T00:00:00.000Z"
    }
  ]),
  candidate: build("candidate", [
    {
      id: "mem-candidate-1",
      summary: "Marcus Reed has declined fully-remote roles twice; prefers hybrid within Atlanta metro.",
      source: "candidate_interaction_log",
      confidence: 0.74,
      createdAt: "2026-08-01T00:00:00.000Z"
    }
  ]),
  market: build("market", [
    {
      id: "mem-market-1",
      summary: "Controls engineer supply in Atlanta metro has tightened ~12% quarter over quarter.",
      source: "approved_market_data_provider",
      confidence: 0.66,
      createdAt: "2026-08-10T00:00:00.000Z"
    }
  ]),
  performance: build("performance", [
    {
      id: "mem-performance-1",
      summary: "Submissions with a structured fit-score explanation convert to interview 1.4x more often.",
      source: "outcome_history",
      confidence: 0.7,
      createdAt: "2026-08-12T00:00:00.000Z"
    }
  ])
};
