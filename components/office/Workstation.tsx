"use client";

import { Html, RoundedBox, Text } from "@react-three/drei";
import type { Agent } from "@/types";
import { AGENT_STATUS_COLOR } from "@/lib/agents/constants";

interface WorkstationProps {
  agent: Agent;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: (agent: Agent) => void;
}

/**
 * Presentation only — reads agent status to pick a color and renders a
 * label. No sourcing/matching/approval logic lives here; all of that is
 * computed upstream and passed in as plain props, per the rule that
 * Three.js components must not contain business logic.
 */
export function Workstation({ agent, position, isSelected, onSelect }: WorkstationProps) {
  const color = AGENT_STATUS_COLOR[agent.status];

  return (
    <group position={position}>
      <RoundedBox
        args={[2.2, 0.3, 1.6]}
        radius={0.12}
        smoothness={4}
        onClick={() => onSelect(agent)}
      >
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} />
      </RoundedBox>

      <RoundedBox args={[1.2, 1, 0.1]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#060b14" />
      </RoundedBox>

      <Text position={[0, 0.82, 0.07]} fontSize={0.16} color="white" anchorX="center" anchorY="middle">
        {agent.name}
      </Text>
      <Text position={[0, 0.58, 0.07]} fontSize={0.1} color="#94a3b8" anchorX="center" anchorY="middle">
        {agent.department}
      </Text>

      {isSelected && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.55, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}

      <Html position={[0, 1.55, 0]} center distanceFactor={10}>
        <button
          type="button"
          onClick={() => onSelect(agent)}
          className="whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
        >
          {agent.status.replace("_", " ")}
        </button>
      </Html>
    </group>
  );
}
