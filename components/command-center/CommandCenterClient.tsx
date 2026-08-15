"use client";

import { useState } from "react";
import type { Agent } from "@/types";
import { OfficeScene } from "@/components/office/OfficeScene";
import { OfficeLegend } from "@/components/office/OfficeLegend";
import { AgentDetailPanel } from "@/components/agents/AgentDetailPanel";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function CommandCenterClient({ agents }: { agents: Agent[] }) {
  const [selected, setSelected] = useState<Agent | null>(agents[0] ?? null);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="overflow-hidden">
        <SectionHeader eyebrow="Live Operations" title="AI Office" />
        <OfficeScene agents={agents} selectedAgentId={selected?.id ?? null} onSelect={setSelected} />
        <OfficeLegend />
      </Card>

      {selected ? (
        <AgentDetailPanel agent={selected} />
      ) : (
        <Card className="flex items-center justify-center p-6 text-sm text-slate-500">
          No agents available.
        </Card>
      )}
    </div>
  );
}
