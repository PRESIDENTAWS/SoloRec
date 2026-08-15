export type AgentTaskStatus = "queued" | "in_progress" | "completed" | "failed" | "cancelled";

export interface AgentTask {
  id: string;
  agentId: string;
  title: string;
  status: AgentTaskStatus;
  createdAt: string;
  completedAt?: string;
}
