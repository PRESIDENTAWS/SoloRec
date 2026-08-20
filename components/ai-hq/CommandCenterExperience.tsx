"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Agent } from "@/types";
import type { HudStat } from "@/lib/ai-hq/hudConfig";
import { HUD_LABELS } from "@/lib/ai-hq/hudConfig";
import { CommandCenterScene } from "@/components/ai-hq/CommandCenterScene";
import { TacticalHud } from "@/components/ai-hq/TacticalHud";
import type { CommandTablePanel } from "@/components/ai-hq/CommandTable";

interface CommandCenterExperienceProps {
  agents: Agent[];
  stats: HudStat[];
  commandPanels: CommandTablePanel[];
}

/**
 * Full-viewport immersive shell: owns selection and camera-reset state, and
 * layers the tactical HUD over the 3D scene.
 *
 * It is deliberately `fixed inset-0` — the command center takes over the
 * screen rather than sitting inside the app chrome, while still living at
 * the /ai-hq/command-center route.
 */
export function CommandCenterExperience({
  agents,
  stats,
  commandPanels
}: CommandCenterExperienceProps) {
  const [selected, setSelected] = useState<Agent | null>(null);
  const [resetToken, setResetToken] = useState(0);

  const handleReset = useCallback(() => {
    setSelected(null);
    setResetToken((token) => token + 1);
  }, []);

  // Escape returns to the overview vantage point.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleReset();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleReset]);

  // Mission status is a read of agent state, computed here in the React
  // layer and passed down as plain strings — never inside the Three.js tree.
  const { mission, missionTone, alert } = useMemo(() => {
    if (agents.some((agent) => agent.status === "blocked")) {
      return { mission: HUD_LABELS.missionBlocked, missionTone: "blocked" as const, alert: true };
    }
    if (agents.some((agent) => agent.status === "review_required")) {
      return { mission: HUD_LABELS.missionReview, missionTone: "review" as const, alert: true };
    }
    return { mission: HUD_LABELS.missionNominal, missionTone: "nominal" as const, alert: false };
  }, [agents]);

  return (
    <div className="fixed inset-0 z-50 bg-[#04070d]">
      <CommandCenterScene
        agents={agents}
        selectedAgentId={selected?.id ?? null}
        onSelect={setSelected}
        commandPanels={commandPanels}
        alert={alert}
        resetToken={resetToken}
      />
      <TacticalHud
        stats={stats}
        mission={mission}
        missionTone={missionTone}
        selected={selected}
        onResetView={handleReset}
      />
    </div>
  );
}
