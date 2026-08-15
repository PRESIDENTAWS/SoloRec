"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Agent } from "@/types";
import { OFFICE_POSITIONS } from "@/lib/agents/office-layout";
import { Workstation } from "@/components/office/Workstation";

interface OfficeSceneProps {
  agents: Agent[];
  selectedAgentId: string | null;
  onSelect: (agent: Agent) => void;
}

/**
 * Low-poly isometric-style office visualization. Purely a rendering layer
 * over `agents` — selection state and agent data both live in the parent
 * page, not here. See docs/architecture/05-delivery.md#the-ai-office-prototype
 * for why this stays a thin visualization layer rather than owning logic.
 */
export function OfficeScene({ agents, selectedAgentId, onSelect }: OfficeSceneProps) {
  return (
    <div className="h-[560px] w-full">
      <Canvas camera={{ position: [0, 13, 15], fov: 45 }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[8, 14, 6]} intensity={1.8} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 1]}>
          <planeGeometry args={[24, 24]} />
          <meshStandardMaterial color="#070d18" roughness={0.9} metalness={0.1} />
        </mesh>

        {agents.map((agent) => {
          const position = OFFICE_POSITIONS[agent.id] ?? [0, 0.6, 0];
          return (
            <Workstation
              key={agent.id}
              agent={agent}
              position={position}
              isSelected={agent.id === selectedAgentId}
              onSelect={onSelect}
            />
          );
        })}

        <OrbitControls
          enablePan={false}
          minDistance={10}
          maxDistance={24}
          minPolarAngle={0.6}
          maxPolarAngle={1.15}
        />
      </Canvas>
    </div>
  );
}
