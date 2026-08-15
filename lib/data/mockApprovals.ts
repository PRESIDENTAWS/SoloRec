import type { Approval } from "@/types";

/** MOCK DATA — approval queue seed content for the AI HQ starter. */
export const MOCK_APPROVALS: Approval[] = [
  {
    id: "appr-1",
    agentId: "ava",
    agentName: "AVA",
    action: "Send outreach to 17 candidates for Senior DevOps Engineer",
    reason: "Outbound candidate communication requires human sign-off before send.",
    riskLevel: "medium",
    status: "pending",
    requestedAt: "2026-08-15T13:10:00.000Z"
  },
  {
    id: "appr-2",
    agentId: "milo",
    agentName: "MILO",
    action: "Submit candidate summary for Danielle Brooks to ABC Manufacturing",
    reason: "Client-facing submission requires recruiter review before send.",
    riskLevel: "medium",
    status: "pending",
    requestedAt: "2026-08-15T12:42:00.000Z"
  },
  {
    id: "appr-3",
    agentId: "echo",
    agentName: "ECHO",
    action: "Flag Marcus Reed for missing certification renewal",
    reason: "Compliance exception detected — candidate certification expires in 7 days.",
    riskLevel: "high",
    status: "pending",
    requestedAt: "2026-08-15T11:55:00.000Z"
  },
  {
    id: "appr-4",
    agentId: "guard",
    agentName: "GUARD",
    action: "Escalate non-standard indemnification clause in Vertex Systems MSA",
    reason: "Contract term falls outside pre-approved agreement templates.",
    riskLevel: "high",
    status: "pending",
    requestedAt: "2026-08-15T10:20:00.000Z"
  }
];
