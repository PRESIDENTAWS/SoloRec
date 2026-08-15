"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setJobStatusAction } from "@/app/(app)/jobs/actions";
import type { JobStatus } from "@/services/recruiting/jobService";

const STATUSES: JobStatus[] = ["draft", "open", "on_hold", "filled", "closed", "cancelled"];

export function JobStatusSelect({ jobId, currentStatus }: { jobId: string; currentStatus: JobStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      value={currentStatus}
      disabled={isPending}
      onChange={(e) => {
        const status = e.target.value as JobStatus;
        startTransition(async () => {
          await setJobStatusAction(jobId, status);
          router.refresh();
        });
      }}
      className="rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-100 capitalize focus:border-accent-blue-soft focus:outline-none focus:ring-1 focus:ring-accent-blue-soft"
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
