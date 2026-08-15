import type { Agent } from "@/types";
import { MOCK_AGENTS } from "@/lib/agents/registry";

/**
 * Service interface for agent data. The mock implementation below is the
 * only thing that should change when a real backend (Supabase, backed by
 * the `agents`/`agent_runs` tables described in
 * docs/architecture/04-ai-and-agents.md) replaces it — no calling code
 * should need to change.
 */
export interface AgentService {
  listAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | null>;
}

class MockAgentService implements AgentService {
  async listAgents(): Promise<Agent[]> {
    return MOCK_AGENTS;
  }

  async getAgent(id: string): Promise<Agent | null> {
    return MOCK_AGENTS.find((agent) => agent.id === id) ?? null;
  }
}

export const agentService: AgentService = new MockAgentService();
