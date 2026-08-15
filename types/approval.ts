export type ApprovalRiskLevel = "low" | "medium" | "high";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Approval {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  reason: string;
  riskLevel: ApprovalRiskLevel;
  status: ApprovalStatus;
  requestedAt: string;
}
