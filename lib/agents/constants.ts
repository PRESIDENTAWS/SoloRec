import type { AgentStatus } from "@/types";

/**
 * Status color mapping shared by the office visualization, agent cards, and
 * detail panels — one source of truth so the 3D scene and the 2D UI never
 * drift out of sync on what a color means.
 */
export const AGENT_STATUS_COLOR: Record<AgentStatus, string> = {
  working: "#3b82f6",
  review_required: "#8b5cf6",
  idle: "#94a3b8",
  blocked: "#f87171",
  offline: "#475569"
};

export const AGENT_STATUS_BADGE_CLASS: Record<AgentStatus, string> = {
  working: "bg-accent-blue/15 text-accent-blue-soft border-accent-blue/30",
  review_required: "bg-accent-purple/15 text-accent-purple-soft border-accent-purple/30",
  idle: "bg-status-idle/10 text-status-idle border-status-idle/25",
  blocked: "bg-status-blocked/15 text-status-blocked border-status-blocked/30",
  offline: "bg-slate-700/20 text-slate-500 border-slate-700/40"
};
