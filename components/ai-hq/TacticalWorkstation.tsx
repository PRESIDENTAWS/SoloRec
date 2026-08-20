"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { Agent } from "@/types";
import type { WorkstationLayout } from "@/lib/agents/office-layout";
import { AGENT_STATUS_COLOR } from "@/lib/agents/constants";
import { zoneAccent } from "@/lib/ai-hq/officeTheme";

interface TacticalWorkstationProps {
  agent: Agent;
  layout: WorkstationLayout;
  isSelected: boolean;
  onSelect: (agent: Agent) => void;
}

/**
 * A department workstation in the command center.
 *
 * Presentation only: it reads `agent.status` to choose a color and renders
 * labels. Desk silhouette varies by `deskStyle` and accent by `zone` so no
 * two departments read identically — all of that comes from the spatial
 * design system, not from business rules evaluated here.
 */
export function TacticalWorkstation({
  agent,
  layout,
  isSelected,
  onSelect
}: TacticalWorkstationProps) {
  const haloRef = useRef<Mesh>(null);
  const screenRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  const statusColor = AGENT_STATUS_COLOR[agent.status];
  const accent = zoneAccent(layout.zone);
  const isActive = agent.status === "working";
  const needsReview = agent.status === "review_required";

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Selected / active stations glow; idle ones sit dim.
    if (haloRef.current) {
      const material = haloRef.current.material as { opacity: number };
      const base = isSelected ? 0.6 : isActive ? 0.32 : 0.12;
      const pulse = isActive || isSelected ? 0.12 * Math.sin(t * 2.1) : 0;
      material.opacity = base + pulse;
    }

    // Monitors flicker faintly while the agent is working.
    if (screenRef.current) {
      const material = screenRef.current.material as { opacity: number };
      material.opacity = isActive ? 0.7 + 0.12 * Math.sin(t * 6.4) : 0.34;
    }

    // Stations awaiting review lift slightly to draw the eye.
    if (groupRef.current) {
      groupRef.current.position.y = needsReview ? 0.05 * Math.sin(t * 1.6) : 0;
    }
  });

  // Executive desks are wider; secure desks are boxier and lower.
  const deskWidth = layout.deskStyle === "executive" ? 3 : layout.deskStyle === "secure" ? 2.1 : 2.4;
  const deskDepth = layout.deskStyle === "secure" ? 1.35 : 1.6;

  return (
    <group position={layout.position} rotation={layout.rotation} scale={layout.scale}>
      {/* Optional raised platform for higher-importance stations. */}
      {layout.platformHeight ? (
        <mesh position={[0, -0.42 - layout.platformHeight / 2, 0]}>
          <cylinderGeometry args={[2.2, 2.35, layout.platformHeight, 8]} />
          <meshStandardMaterial color="#0c1424" roughness={0.8} metalness={0.4} />
        </mesh>
      ) : null}

      <group ref={groupRef}>
        {/* Desk body. */}
        <RoundedBox
          args={[deskWidth, 0.28, deskDepth]}
          radius={0.09}
          smoothness={4}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(agent);
          }}
        >
          <meshStandardMaterial color="#101a2c" roughness={0.5} metalness={0.55} />
        </RoundedBox>

        {/* Zone accent strip along the desk edge. */}
        <mesh position={[0, 0.15, deskDepth / 2 - 0.02]}>
          <planeGeometry args={[deskWidth - 0.25, 0.045]} />
          <meshBasicMaterial color={accent} transparent opacity={0.85} />
        </mesh>

        {/* Monitor. */}
        <RoundedBox args={[deskWidth * 0.62, 0.86, 0.07]} radius={0.03} position={[0, 0.75, -0.15]}>
          <meshStandardMaterial color="#050a13" roughness={0.35} metalness={0.5} />
        </RoundedBox>

        {/* Screen content wash. */}
        <mesh ref={screenRef} position={[0, 0.75, -0.1]}>
          <planeGeometry args={[deskWidth * 0.58, 0.78]} />
          <meshBasicMaterial color={statusColor} transparent opacity={0.5} />
        </mesh>

        <Text
          position={[0, 0.9, -0.08]}
          fontSize={0.17}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          {agent.name}
        </Text>
        <Text
          position={[0, 0.66, -0.08]}
          fontSize={0.093}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {agent.department.toUpperCase()}
        </Text>

        {/* Status halo on the floor. */}
        <mesh ref={haloRef} position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.72, 48]} />
          <meshBasicMaterial color={statusColor} transparent opacity={0.3} />
        </mesh>

        {/* Selection reticle. */}
        {isSelected ? (
          <mesh position={[0, -0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.82, 1.9, 4]} />
            <meshBasicMaterial color={accent} transparent opacity={0.9} />
          </mesh>
        ) : null}

        {/* Local accent light. */}
        <pointLight
          position={layout.lightOffset}
          intensity={isActive ? 0.85 : 0.35}
          distance={6}
          color={accent}
        />
      </group>
    </group>
  );
}
