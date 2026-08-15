import type { Approval, ApprovalStatus } from "@/types";
import { MOCK_APPROVALS } from "@/lib/data/mockApprovals";

/**
 * Mock approval queue service. `decide` mutates an in-memory copy only —
 * nothing here persists across a server restart or a new request in a
 * server-rendered environment. A real implementation swaps this for calls
 * into the ApprovalService/ApprovalRequest design in
 * docs/architecture/04-ai-and-agents.md#k-human-approval-engine.
 */
export interface ApprovalService {
  listApprovals(): Promise<Approval[]>;
  decide(id: string, status: Extract<ApprovalStatus, "approved" | "rejected">): Promise<Approval | null>;
}

class MockApprovalService implements ApprovalService {
  private approvals: Approval[] = MOCK_APPROVALS.map((approval) => ({ ...approval }));

  async listApprovals(): Promise<Approval[]> {
    return this.approvals;
  }

  async decide(
    id: string,
    status: Extract<ApprovalStatus, "approved" | "rejected">
  ): Promise<Approval | null> {
    const approval = this.approvals.find((item) => item.id === id);
    if (!approval) return null;
    approval.status = status;
    return approval;
  }
}

export const approvalService: ApprovalService = new MockApprovalService();
