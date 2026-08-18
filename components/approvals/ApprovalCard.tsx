"use client";

import { useState, useTransition } from "react";
import type { Approval } from "@/services/agents/approvalDecisionService";
import { decideApprovalAction } from "@/app/(app)/ai-hq/approvals/actions";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const RISK_CLASS: Record<string, string> = {
  low: "bg-status-healthy/15 text-status-healthy border-status-healthy/30",
  medium: "bg-status-review/15 text-status-review border-status-review/30",
  high: "bg-status-blocked/15 text-status-blocked border-status-blocked/30",
  critical: "bg-status-blocked/25 text-status-blocked border-status-blocked/40"
};

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-base-panel2 text-slate-400 border-base-line",
  approved: "bg-status-healthy/15 text-status-healthy border-status-healthy/30",
  rejected: "bg-status-blocked/15 text-status-blocked border-status-blocked/30"
};

const ACTION_LABEL: Record<string, string> = {
  candidate_outreach: "Candidate Outreach",
  candidate_rejection: "Candidate Rejection",
  offer_change: "Offer Change",
  contract_exception: "Contract Exception"
};

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function ApprovalCard({ approval, agentName }: { approval: Approval; agentName: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isDecided = approval.status !== "pending";

  function decide(decision: "approved" | "rejected") {
    setError(null);
    startTransition(async () => {
      const result = await decideApprovalAction(approval.id, decision);
      if (result.error) setError(result.error);
    });
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-blue-soft">
              {agentName} · {ACTION_LABEL[approval.action_type] ?? approval.action_type}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge className={cn(RISK_CLASS[approval.risk_level])}>{approval.risk_level} risk</Badge>
            <Badge className={cn(STATUS_CLASS[approval.status])}>{approval.status}</Badge>
          </div>
        </div>

        <p className="text-sm text-slate-400">{approval.reason}</p>
        <p className="text-xs text-slate-600">Requested {formatTimestamp(approval.requested_at)}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="primary" disabled={isDecided || isPending} onClick={() => decide("approved")}>
            Approve
          </Button>
          <Button variant="danger" disabled={isDecided || isPending} onClick={() => decide("rejected")}>
            Reject
          </Button>
        </div>
        {error && <p className="text-xs text-status-blocked">{error}</p>}
      </CardBody>
    </Card>
  );
}
