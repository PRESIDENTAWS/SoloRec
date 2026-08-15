"use client";

import type { Approval } from "@/types";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const RISK_CLASS: Record<Approval["riskLevel"], string> = {
  low: "bg-status-healthy/15 text-status-healthy border-status-healthy/30",
  medium: "bg-status-review/15 text-status-review border-status-review/30",
  high: "bg-status-blocked/15 text-status-blocked border-status-blocked/30"
};

const STATUS_CLASS: Record<Approval["status"], string> = {
  pending: "bg-base-panel2 text-slate-400 border-base-line",
  approved: "bg-status-healthy/15 text-status-healthy border-status-healthy/30",
  rejected: "bg-status-blocked/15 text-status-blocked border-status-blocked/30"
};

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

interface ApprovalCardProps {
  approval: Approval;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ApprovalCard({ approval, onApprove, onReject, onEdit }: ApprovalCardProps) {
  const isDecided = approval.status !== "pending";

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-blue-soft">
              {approval.agentName}
            </div>
            <p className="mt-1 text-sm font-medium text-slate-100">{approval.action}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge className={cn(RISK_CLASS[approval.riskLevel])}>{approval.riskLevel} risk</Badge>
            <Badge className={cn(STATUS_CLASS[approval.status])}>{approval.status}</Badge>
          </div>
        </div>

        <p className="text-sm text-slate-400">{approval.reason}</p>
        <p className="text-xs text-slate-600">Requested {formatTimestamp(approval.requestedAt)}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="primary" disabled={isDecided} onClick={() => onApprove(approval.id)}>
            Approve
          </Button>
          <Button variant="danger" disabled={isDecided} onClick={() => onReject(approval.id)}>
            Reject
          </Button>
          <Button variant="ghost" disabled={isDecided} onClick={() => onEdit(approval.id)}>
            Edit
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
