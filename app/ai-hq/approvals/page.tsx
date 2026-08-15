"use client";

import { useState } from "react";
import type { Approval } from "@/types";
import { MOCK_APPROVALS } from "@/lib/data/mockApprovals";
import { ApprovalCard } from "@/components/approvals/ApprovalCard";
import { Card, CardBody } from "@/components/ui/Card";

/**
 * Approval Center. State is local-only (client-side), seeded from mock
 * data — Approve/Reject/Edit update this page's state, not a backend. A
 * real implementation calls ApprovalService against the ApprovalRequest
 * design in docs/architecture/04-ai-and-agents.md#k-human-approval-engine.
 */
export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>(MOCK_APPROVALS);
  const [notice, setNotice] = useState<string | null>(null);

  function decide(id: string, status: "approved" | "rejected") {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  function edit(id: string) {
    const approval = approvals.find((a) => a.id === id);
    setNotice(`Editing "${approval?.action ?? id}" is not yet implemented in this starter.`);
  }

  const pending = approvals.filter((a) => a.status === "pending");
  const decided = approvals.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          AI Workforce
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Approval Center</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Every consequential AI action — outreach, client communication, compliance flags,
          contract exceptions — routes here before it executes.
        </p>
      </div>

      {notice && (
        <Card>
          <CardBody className="text-sm text-slate-400">{notice}</CardBody>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <Card>
            <CardBody className="text-sm text-slate-500">No pending approvals.</CardBody>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {pending.map((approval) => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                onApprove={(id) => decide(id, "approved")}
                onReject={(id) => decide(id, "rejected")}
                onEdit={edit}
              />
            ))}
          </div>
        )}
      </div>

      {decided.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Decided ({decided.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {decided.map((approval) => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                onApprove={(id) => decide(id, "approved")}
                onReject={(id) => decide(id, "rejected")}
                onEdit={edit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
