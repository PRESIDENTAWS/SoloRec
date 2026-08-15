/**
 * Frontend-facing Agent type for the AI HQ UI. This is deliberately a
 * different shape from the backend `AgentDefinition` registry described in
 * docs/architecture/04-ai-and-agents.md (which is config-as-code: slug,
 * allowedTools, allowedDataScopes, permissionLevel). This type is what the
 * command center, office visualization, and detail panels render — a future
 * API layer maps AgentDefinition + AgentRun history onto this shape rather
 * than the UI depending on the backend registry's internal structure.
 */
export type AgentStatus = "working" | "review_required" | "idle" | "blocked" | "offline";

export type AutonomyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const AUTONOMY_LEVEL_LABELS: Record<AutonomyLevel, string> = {
  0: "Observe",
  1: "Recommend",
  2: "Draft",
  3: "Execute Approved Actions",
  4: "Autonomous Workflow (Escalation)",
  5: "Management Agent"
};

export const AGENT_STATUS_LABELS: Record<AgentStatus, string> = {
  working: "Working",
  review_required: "Review Required",
  idle: "Idle",
  blocked: "Blocked",
  offline: "Offline"
};

export interface AgentKpi {
  label: string;
  value: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  status: AgentStatus;
  /** Icon/initials key for avatar rendering — no image assets in this starter. */
  avatar: string;
  currentTask: string;
  currentJob?: string;
  autonomyLevel: AutonomyLevel;
  /** 0-100 synthetic health score, mock only. */
  health: number;
  lastAction: string;
  taskCount: number;
  approvalCount: number;
  kpis: AgentKpi[];
  tools: string[];
  permissions: string[];
}
