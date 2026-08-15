import type { AgentEvent } from "@/types";
import { MOCK_EVENTS } from "@/lib/data/mockActivity";

/**
 * Event feed seam. Intended flow once a backend exists (per
 * docs/architecture/04-ai-and-agents.md#l-event-architecture):
 *   agent task executes -> backend records task -> AgentEvent created
 *   -> realtime event emitted -> frontend receives event
 *   -> 3D workstation status changes
 * This mock returns static, clearly-labeled data with no realtime channel.
 */
export interface EventService {
  listRecentEvents(): Promise<AgentEvent[]>;
}

class MockEventService implements EventService {
  async listRecentEvents(): Promise<AgentEvent[]> {
    return MOCK_EVENTS;
  }
}

export const eventService: EventService = new MockEventService();
