import { OFFICE_LAYOUT } from "@/lib/agents/office-layout";

/**
 * SoloRec AI HQ — camera choreography.
 *
 * Presentation-only. Per-agent presets are derived from the spatial design
 * system (lib/agents/office-layout.ts) so a workstation only ever declares
 * its own framing once.
 */

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
}

/** Default cinematic vantage point over the whole floor. */
export const OVERVIEW_PRESET: CameraPreset = {
  position: [0, 17, 23],
  target: [0, 1, -1]
};

/** Tight framing on the ORION command table. */
export const COMMAND_TABLE_PRESET: CameraPreset = {
  position: [6.8, 5.2, 8.4],
  target: [0, 1.4, -0.8]
};

function add(
  base: readonly [number, number, number],
  offset: readonly [number, number, number]
): [number, number, number] {
  return [base[0] + offset[0], base[1] + offset[1], base[2] + offset[2]];
}

/** Camera preset for a given agent's workstation, if one is laid out. */
export function agentPreset(agentId: string): CameraPreset | null {
  const layout = OFFICE_LAYOUT[agentId];
  if (!layout) return null;
  return {
    position: add(layout.position, layout.cameraOffset),
    target: add(layout.position, layout.cameraTargetOffset)
  };
}

/** Resolve the preset for the current selection, falling back to overview. */
export function presetFor(agentId: string | null): CameraPreset {
  if (!agentId) return OVERVIEW_PRESET;
  return agentPreset(agentId) ?? OVERVIEW_PRESET;
}
