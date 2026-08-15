import type { MemoryItem } from "@/types";
import { MOCK_MEMORY } from "@/lib/data/mockMemory";

/**
 * Memory retrieval seam. Every MemoryItem already carries an `embedding`
 * field (currently always null) so swapping this mock for a pgvector-backed
 * implementation — per docs/architecture/04-ai-and-agents.md#m-memory-architecture —
 * is a data/query change, not a type change.
 */
export interface MemoryService {
  getMemoryForAgent(agentId: string): Promise<Record<string, MemoryItem[]>>;
}

class MockMemoryService implements MemoryService {
  async getMemoryForAgent(_agentId: string): Promise<Record<string, MemoryItem[]>> {
    // Mock: every agent currently sees the same placeholder memory set.
    // A real implementation scopes retrieval by agentId + organizationId.
    return MOCK_MEMORY;
  }
}

export const memoryService: MemoryService = new MockMemoryService();
