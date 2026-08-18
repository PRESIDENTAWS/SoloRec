"use client";

import { useTransition } from "react";
import Link from "next/link";
import type { ApplicationStage, ApplicationWithCandidateAndJob } from "@/services/recruiting/applicationService";
import { updateApplicationStageAction } from "@/app/(app)/pipeline/actions";
import { Card } from "@/components/ui/Card";

const STAGE_LABELS: Record<ApplicationStage, string> = {
  sourced: "Sourced",
  contacted: "Contacted",
  responded: "Responded",
  screening: "Screening",
  qualified: "Qualified",
  submitted: "Submitted",
  client_review: "Client Review",
  interview: "Interview",
  offer: "Offer",
  placed: "Placed",
  rejected: "Rejected",
  withdrawn: "Withdrawn"
};

const ALL_STAGES = Object.keys(STAGE_LABELS) as ApplicationStage[];
const BOARD_COLUMNS: ApplicationStage[] = [
  "sourced",
  "contacted",
  "screening",
  "qualified",
  "submitted",
  "interview",
  "offer",
  "placed"
];

export function PipelineBoard({ applications }: { applications: ApplicationWithCandidateAndJob[] }) {
  const [isPending, startTransition] = useTransition();

  function handleStageChange(applicationId: string, stage: ApplicationStage) {
    startTransition(() => {
      void updateApplicationStageAction(applicationId, stage);
    });
  }

  return (
    <div className="grid grid-flow-col auto-cols-[260px] gap-4 overflow-x-auto pb-2">
      {BOARD_COLUMNS.map((stage) => {
        const items = applications.filter((a) => a.stage === stage);
        return (
          <div key={stage} className="min-w-[240px]">
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">{STAGE_LABELS[stage]}</h3>
              <span className="text-xs text-slate-600">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((application) => (
                <Card key={application.id} className="p-3">
                  <Link
                    href={`/candidates/${application.candidate.id}`}
                    className="block text-sm font-semibold text-slate-100 hover:text-accent-blue-soft"
                  >
                    {application.candidate.first_name} {application.candidate.last_name}
                  </Link>
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="mt-0.5 block text-xs text-slate-500 hover:text-accent-blue-soft"
                  >
                    {application.job.title}
                  </Link>
                  <select
                    className="mt-2 w-full rounded-md border border-base-line bg-base-panel2 px-2 py-1 text-xs text-slate-300 focus:border-accent-blue-soft focus:outline-none"
                    value={application.stage}
                    disabled={isPending}
                    onChange={(e) => handleStageChange(application.id, e.target.value as ApplicationStage)}
                  >
                    {ALL_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {STAGE_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </Card>
              ))}
              {items.length === 0 && <p className="px-1 text-xs text-slate-600">Empty</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
