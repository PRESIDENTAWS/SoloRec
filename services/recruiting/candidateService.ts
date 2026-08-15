import { AVA_CANDIDATES, AVA_SOURCING_FUNNEL, type AvaCandidateRow } from "@/lib/recruiting/mockCandidates";

/**
 * Recruiting data service seam. Only AVA's sourcing workspace is backed by
 * mock data in this starter; the interface anticipates a real
 * CandidateService (docs/architecture/01-product-architecture.md#domain-map)
 * covering the full candidate domain once Sprint 4 lands.
 */
export interface CandidateService {
  listCandidatesForAgent(agentId: string): Promise<AvaCandidateRow[]>;
  getSourcingFunnel(agentId: string): Promise<typeof AVA_SOURCING_FUNNEL>;
}

class MockCandidateService implements CandidateService {
  async listCandidatesForAgent(agentId: string): Promise<AvaCandidateRow[]> {
    if (agentId !== "ava") return [];
    return AVA_CANDIDATES;
  }

  async getSourcingFunnel(agentId: string): Promise<typeof AVA_SOURCING_FUNNEL> {
    if (agentId !== "ava") return [];
    return AVA_SOURCING_FUNNEL;
  }
}

export const candidateService: CandidateService = new MockCandidateService();
