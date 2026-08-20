"use client";

import { Canvas } from "@react-three/fiber";
import type { Agent } from "@/types";
import { OFFICE_LAYOUT } from "@/lib/agents/office-layout";
import { OFFICE_THEME } from "@/lib/ai-hq/officeTheme";
import { WALL_DISPLAYS } from "@/lib/ai-hq/sceneConfig";
import { OVERVIEW_PRESET } from "@/lib/ai-hq/cameraPresets";
import { OfficeEnvironment } from "@/components/ai-hq/OfficeEnvironment";
import { CeilingLightRig } from "@/components/ai-hq/CeilingLightRig";
import { WallDisplay } from "@/components/ai-hq/WallDisplay";
import { CommandTable, type CommandTablePanel } from "@/components/ai-hq/CommandTable";
import { TacticalWorkstation } from "@/components/ai-hq/TacticalWorkstation";
import { DataFlowLines } from "@/components/ai-hq/DataFlowLines";
import { SceneCameraController } from "@/components/ai-hq/SceneCameraController";

/** The agent that owns the central command table rather than a desk. */
const COMMAND_AGENT_ID = "orion";

interface CommandCenterSceneProps {
  agents: Agent[];
  selectedAgentId: string | null;
  onSelect: (agent: Agent | null) => void;
  /** Display-only figures floated above the command table. */
  commandPanels: CommandTablePanel[];
  /** Pulses the table amber when a human decision is outstanding. */
  alert?: boolean;
  resetToken: number;
}

/**
 * The immersive 3D command center.
 *
 * Composition only: it wires the environment, the command table, the
 * workstations and the camera together. All state (selection, figures) is
 * owned by the page above it — per the rule that the Three.js layer never
 * holds business logic.
 */
export function CommandCenterScene({
  agents,
  selectedAgentId,
  onSelect,
  commandPanels,
  alert = false,
  resetToken
}: CommandCenterSceneProps) {
  const commandAgent = agents.find((agent) => agent.id === COMMAND_AGENT_ID) ?? null;
  const commandLayout = OFFICE_LAYOUT[COMMAND_AGENT_ID];

  return (
    <Canvas
      camera={{ position: OVERVIEW_PRESET.position, fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={[OFFICE_THEME.environment.baseColor]} />
      <fog
        attach="fog"
        args={[OFFICE_THEME.fog.color, OFFICE_THEME.fog.near, OFFICE_THEME.fog.far]}
      />

      <ambientLight intensity={OFFICE_THEME.lighting.ambientIntensity} />
      {/* Cool rim light so the room reads as steel rather than flat black. */}
      <directionalLight
        position={[10, 16, 8]}
        intensity={OFFICE_THEME.lighting.rimIntensity}
        color="#9fc7ff"
      />

      <OfficeEnvironment />
      <CeilingLightRig />

      {WALL_DISPLAYS.map((config) => (
        <WallDisplay key={config.id} config={config} />
      ))}

      {/* ORION commands the central platform instead of a desk. */}
      {commandLayout ? (
        <CommandTable
          position={commandLayout.position}
          panels={commandPanels}
          alert={alert}
          onSelect={() => onSelect(commandAgent)}
        />
      ) : null}

      {agents
        .filter((agent) => agent.id !== COMMAND_AGENT_ID)
        .map((agent) => {
          const layout = OFFICE_LAYOUT[agent.id];
          if (!layout) return null;
          return (
            <TacticalWorkstation
              key={agent.id}
              agent={agent}
              layout={layout}
              isSelected={agent.id === selectedAgentId}
              onSelect={onSelect}
            />
          );
        })}

      <DataFlowLines />

      <SceneCameraController selectedAgentId={selectedAgentId} resetToken={resetToken} />
    </Canvas>
  );
}
