export type AgentEventType = "info" | "success" | "warning" | "action";

export interface AgentEvent {
  id: string;
  agentId: string;
  agentName: string;
  message: string;
  type: AgentEventType;
  timestamp: string;
}
