"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { OFFICE_THEME } from "@/lib/ai-hq/officeTheme";
import { SCENE_CONFIG } from "@/lib/ai-hq/sceneConfig";

/**
 * The room shell — floor, command rings, walls, and perimeter trim.
 *
 * Presentation only. Every dimension comes from lib/ai-hq/sceneConfig.ts and
 * every color from lib/ai-hq/officeTheme.ts; nothing here reads agent state.
 */

/** Glowing floor grid, built once as line segments. */
function FloorGrid() {
  const { size, gridDivisions } = SCENE_CONFIG.floor;

  const positions = useMemo(() => {
    const half = size / 2;
    const step = size / gridDivisions;
    const points: number[] = [];
    for (let i = 0; i <= gridDivisions; i++) {
      const p = -half + i * step;
      points.push(-half, 0, p, half, 0, p);
      points.push(p, 0, -half, p, 0, half);
    }
    return new Float32Array(points);
  }, [size, gridDivisions]);

  return (
    <lineSegments position={[0, 0.02, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={OFFICE_THEME.floor.gridColor}
        transparent
        opacity={OFFICE_THEME.floor.gridOpacity}
      />
    </lineSegments>
  );
}

/** Concentric command rings around the ORION platform, slowly pulsing. */
function CommandRings() {
  const ringsRef = useRef<Mesh[]>([]);
  const { ringCenter, ringRadii } = SCENE_CONFIG.floor;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      const material = ring.material as { opacity: number };
      material.opacity = 0.16 + 0.12 * Math.sin(t * 0.8 - i * 0.7);
    });
  });

  return (
    <group position={[ringCenter[0], 0.03, ringCenter[1]]} rotation={[-Math.PI / 2, 0, 0]}>
      {ringRadii.map((radius, i) => (
        <mesh
          key={radius}
          ref={(node) => {
            if (node) ringsRef.current[i] = node;
          }}
        >
          <ringGeometry args={[radius, radius + 0.07, 96]} />
          <meshBasicMaterial color={OFFICE_THEME.floor.ringColor} transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/** Directional runway strips embedded in the walkways. */
function RunwayLighting() {
  const lanes: Array<[number, number, number]> = [
    [-9.5, 0.025, 0],
    [9.5, 0.025, 0]
  ];

  return (
    <>
      {lanes.map((position) => (
        <mesh key={position[0]} position={position} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.35, 30]} />
          <meshBasicMaterial
            color={OFFICE_THEME.floor.runwayColor}
            transparent
            opacity={0.18}
          />
        </mesh>
      ))}
    </>
  );
}

/** A wall plane with a glowing accent strip along its base. */
function Wall({
  position,
  rotation,
  width
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
}) {
  const { height } = SCENE_CONFIG.room;

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={OFFICE_THEME.walls.color}
          roughness={0.85}
          metalness={0.25}
        />
      </mesh>
      {/* Branded accent strip near the floor. */}
      <mesh position={[0, -height / 2 + 0.5, 0.06]}>
        <planeGeometry args={[width, 0.1]} />
        <meshBasicMaterial
          color={OFFICE_THEME.walls.panelGlow}
          transparent
          opacity={0.45}
        />
      </mesh>
      {/* Upper trim line. */}
      <mesh position={[0, height / 2 - 1.2, 0.06]}>
        <planeGeometry args={[width, 0.05]} />
        <meshBasicMaterial
          color={OFFICE_THEME.walls.trimColor}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

/** Frosted glass partitions that separate the side zones. */
function GlassPartitions() {
  const partitions: Array<{ position: [number, number, number]; rotation: [number, number, number] }> = [
    { position: [-11.2, 1.6, -2], rotation: [0, Math.PI / 2, 0] },
    { position: [11.2, 1.6, -2], rotation: [0, -Math.PI / 2, 0] },
    { position: [-11.2, 1.6, 8], rotation: [0, Math.PI / 2, 0] },
    { position: [11.2, 1.6, 8], rotation: [0, -Math.PI / 2, 0] }
  ];

  return (
    <>
      {partitions.map((partition) => (
        <mesh
          key={`${partition.position[0]}-${partition.position[2]}`}
          position={partition.position}
          rotation={partition.rotation}
        >
          <planeGeometry args={[7, 3.2]} />
          <meshStandardMaterial
            color={OFFICE_THEME.walls.glassColor}
            transparent
            opacity={0.08}
            roughness={0.1}
            metalness={0.6}
          />
        </mesh>
      ))}
    </>
  );
}

export function OfficeEnvironment() {
  const { size } = SCENE_CONFIG.floor;
  const { backZ, frontZ, sideX, height } = SCENE_CONFIG.room;
  const wallY = height / 2;

  return (
    <group>
      {/* Matte graphite floor. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color={OFFICE_THEME.floor.color}
          roughness={0.92}
          metalness={0.2}
        />
      </mesh>

      <FloorGrid />
      <CommandRings />
      <RunwayLighting />

      {/* Rear wall (behind the Talent Lab). */}
      <Wall position={[0, wallY, backZ]} rotation={[0, 0, 0]} width={sideX * 2} />
      {/* Front wall (behind the secure zone). */}
      <Wall position={[0, wallY, frontZ]} rotation={[0, Math.PI, 0]} width={sideX * 2} />
      {/* Side walls. */}
      <Wall position={[-sideX, wallY, -1]} rotation={[0, Math.PI / 2, 0]} width={frontZ - backZ} />
      <Wall position={[sideX, wallY, -1]} rotation={[0, -Math.PI / 2, 0]} width={frontZ - backZ} />

      <GlassPartitions />
    </group>
  );
}
