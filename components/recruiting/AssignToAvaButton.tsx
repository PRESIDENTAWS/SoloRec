"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { assignToAvaAction } from "@/app/(app)/jobs/[id]/actions";

export function AssignToAvaButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await assignToAvaAction(jobId);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div>
      <Button variant="primary" onClick={handleClick} disabled={isPending}>
        <Sparkles size={16} aria-hidden="true" />
        {isPending ? "AVA is working…" : "Assign to AVA"}
      </Button>
      {error && <p className="mt-2 text-xs text-status-blocked">{error}</p>}
    </div>
  );
}
