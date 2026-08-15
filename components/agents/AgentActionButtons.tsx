"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/LinkButton";
import { Button } from "@/components/ui/Button";

/**
 * Action buttons for an agent's detail panel. The navigational actions
 * (Open Workspace, Agent Memory, View Activity, Approval Queue) route to
 * real pages. Assign Task / Pause Agent / Edit Agent are explicitly
 * placeholder actions in this starter — no backend exists to fulfill them
 * yet, and the UI says so rather than pretending they did something.
 */
export function AgentActionButtons({ agentId }: { agentId: string }) {
  const [notice, setNotice] = useState<string | null>(null);

  const placeholder = (action: string) => () => setNotice(`${action} — not yet implemented in this starter.`);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <LinkButton href={`/ai-hq/agents/${agentId}`} variant="secondary">
          Open Workspace
        </LinkButton>
        <LinkButton href={`/ai-hq/agents/${agentId}/memory`} variant="secondary">
          Agent Memory
        </LinkButton>
        <LinkButton href="/ai-hq/activity" variant="secondary">
          View Activity
        </LinkButton>
        <LinkButton href="/ai-hq/approvals" variant="secondary">
          Approval Queue
        </LinkButton>
        <Button variant="ghost" onClick={placeholder("Assign Task")}>
          Assign Task
        </Button>
        <Button variant="ghost" onClick={placeholder("Pause Agent")}>
          Pause Agent
        </Button>
        <Button variant="ghost" className="col-span-2" onClick={placeholder("Edit Agent")}>
          Edit Agent
        </Button>
      </div>
      {notice && (
        <p role="status" className="mt-3 text-xs text-slate-500">
          {notice}
        </p>
      )}
    </div>
  );
}
