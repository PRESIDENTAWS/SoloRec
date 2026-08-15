import type { AgentEvent } from "@/types";

/** MOCK DATA — live activity feed seed content for the AI HQ starter. */
export const MOCK_EVENTS: AgentEvent[] = [
  {
    id: "evt-1",
    agentId: "ava",
    agentName: "AVA",
    message: "Shortlisted 12 candidates for Senior DevOps Engineer",
    type: "success",
    timestamp: "2026-08-15T13:58:00.000Z"
  },
  {
    id: "evt-2",
    agentId: "milo",
    agentName: "MILO",
    message: "Completed candidate screen for Danielle Brooks",
    type: "info",
    timestamp: "2026-08-15T13:52:00.000Z"
  },
  {
    id: "evt-3",
    agentId: "spark",
    agentName: "SPARK",
    message: "Identified 14 high-fit target accounts in Dallas metro",
    type: "success",
    timestamp: "2026-08-15T13:41:00.000Z"
  },
  {
    id: "evt-4",
    agentId: "echo",
    agentName: "ECHO",
    message: "Flagged 3 candidate documents expiring within 14 days",
    type: "warning",
    timestamp: "2026-08-15T13:30:00.000Z"
  },
  {
    id: "evt-5",
    agentId: "luna",
    agentName: "LUNA",
    message: "Recalculated match scores for Senior Controls Engineer",
    type: "info",
    timestamp: "2026-08-15T13:18:00.000Z"
  },
  {
    id: "evt-6",
    agentId: "orion",
    agentName: "ORION",
    message: "Detected pipeline slowdown for Northstar Group — feedback SLA at risk",
    type: "warning",
    timestamp: "2026-08-15T13:05:00.000Z"
  },
  {
    id: "evt-7",
    agentId: "guard",
    agentName: "GUARD",
    message: "Escalated non-standard indemnification clause in Vertex Systems MSA",
    type: "action",
    timestamp: "2026-08-15T12:50:00.000Z"
  },
  {
    id: "evt-8",
    agentId: "fin",
    agentName: "FIN",
    message: "Reconciled 4 placement invoices totaling $58.2K",
    type: "success",
    timestamp: "2026-08-15T12:30:00.000Z"
  }
];
