"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { OFFICE_THEME } from "@/lib/ai-hq/officeTheme";

export interface CommandTablePanel {
  label: string;
  value: string;
}

interface CommandTableProps {
  position: [number, number, number];
  /** Display-only figures rendered as floating objects above the table. */
  panels: CommandTablePanel[];
  /** Pulses amber when something is waiting on a human decision. */
  alert?: boolean;
  onSelect?: () => void;
}

/**
 * ORION's central war-room platform — the visual brain of SoloRec.
 *
 * This is deliberately not another desk: an elevated hexagonal command table
 * with a rotating holographic ring and floating live objects above it.
 *
 * Presentation only. Panel values arrive as formatted strings from the page;
 * nothing is computed, fetched, or decided here.
 */
export function CommandTable({ position, panels, alert = false, onSelect }: CommandTableProps) {
  const ringRef = useRef<Group>(null);
  const innerRingRef = useRef<Group>(null);
  const hologramRef = useRef<Mesh>(null);
  const panelsRef = useRef<Group>(null);

  const accent = alert ? OFFICE_THEME.environment.warningColor : OFFICE_THEME.environment.secondaryAccent;

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (ringRef.current) ringRef.current.rotation.y = t * 0.25;
    if (innerRingRef.current) innerRingRef.current.rotation.y = -t * 0.4;

    if (hologramRef.current) {
      const material = hologramRef.current.material as { opacity: number };
      material.opacity = 0.14 + 0.06 * Math.sin(t * (alert ? 3.2 : 1.4));
    }

    // Panels bob gently so the table reads as live.
    if (panelsRef.current) {
      panelsRef.current.position.y = 0.06 * Math.sin(t * 0.9);
      panelsRef.current.rotation.y = t * 0.12;
    }
  });

  return (
    <group position={position}>
      {/* Elevated platform. */}
      <mesh position={[0, -0.55, 0]} onClick={onSelect}>
        <cylinderGeometry args={[4.1, 4.35, 0.3, 6]} />
        <meshStandardMaterial color="#0d1526" roughness={0.75} metalness={0.45} />
      </mesh>

      {/* Platform edge glow. */}
      <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.05, 4.3, 6]} />
        <meshBasicMaterial color={accent} transparent opacity={0.55} />
      </mesh>

      {/* Hexagonal command table body. */}
      <mesh position={[0, 0.15, 0]} onClick={onSelect}>
        <cylinderGeometry args={[2.5, 2.7, 0.5, 6]} />
        <meshStandardMaterial color="#111c30" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Table surface. */}
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.35, 6]} />
        <meshStandardMaterial color="#060d1a" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* Holographic projection volume. */}
      <mesh ref={hologramRef} position={[0, 1.35, 0]}>
        <cylinderGeometry args={[1.9, 2.25, 1.8, 6, 1, true]} />
        <meshBasicMaterial color={accent} transparent opacity={0.16} side={2} />
      </mesh>

      {/* Rotating holo rings. */}
      <group ref={ringRef} position={[0, 1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.05, 2.16, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={0.65} />
        </mesh>
      </group>
      <group ref={innerRingRef} position={[0, 1.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[1.35, 1.44, 64]} />
          <meshBasicMaterial
            color={OFFICE_THEME.environment.accentColor}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {/* Floating live objects above the table. */}
      <group ref={panelsRef} position={[0, 2.35, 0]}>
        {panels.map((panel, i) => {
          const angle = (i / Math.max(panels.length, 1)) * Math.PI * 2;
          const radius = 2.15;
          return (
            <group
              key={panel.label}
              position={[Math.cos(angle) * radius, (i % 2) * 0.34, Math.sin(angle) * radius]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <mesh>
                <planeGeometry args={[1.5, 0.62]} />
                <meshBasicMaterial color="#08111f" transparent opacity={0.82} />
              </mesh>
              <mesh position={[0, 0.28, 0.01]}>
                <planeGeometry args={[1.5, 0.03]} />
                <meshBasicMaterial color={accent} transparent opacity={0.8} />
              </mesh>
              <Text
                position={[0, 0.13, 0.02]}
                fontSize={0.12}
                color="#94a3b8"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.08}
              >
                {panel.label.toUpperCase()}
              </Text>
              <Text
                position={[0, -0.11, 0.02]}
                fontSize={0.24}
                color="#f8fafc"
                anchorX="center"
                anchorY="middle"
              >
                {panel.value}
              </Text>
            </group>
          );
        })}
      </group>

      {/* Focused light over the table. */}
      <pointLight
        position={[0, 4.2, 0]}
        intensity={OFFICE_THEME.lighting.tableIntensity}
        distance={14}
        color={accent}
      />

      <Text
        position={[0, 0.46, 1.35]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color={accent}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.22}
      >
        ORION
      </Text>
    </group>
  );
}
