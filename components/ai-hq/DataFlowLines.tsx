"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { OFFICE_LAYOUT } from "@/lib/agents/office-layout";
import { DATA_FLOWS, type DataFlowConfig } from "@/lib/ai-hq/sceneConfig";

/**
 * Animated data lanes between agents.
 *
 * Purely visual motion language — it expresses that the workforce is
 * operating, not any real message routing. Lane endpoints come from the
 * spatial design system; nothing here reads agent state or business data.
 */

interface Lane {
  config: DataFlowConfig;
  from: [number, number, number];
  to: [number, number, number];
}

/** A single particle travelling one lane, on a shallow arc. */
function FlowParticle({ lane, offset }: { lane: Lane; offset: number }) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = ((state.clock.elapsedTime / lane.config.duration + offset) % 1 + 1) % 1;

    const [x0, y0, z0] = lane.from;
    const [x1, y1, z1] = lane.to;

    ref.current.position.x = x0 + (x1 - x0) * t;
    ref.current.position.z = z0 + (z1 - z0) * t;
    // Arc upward through the middle of the lane.
    ref.current.position.y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 1.5;

    // Fade in and out at the ends of the run.
    const material = ref.current.material as { opacity: number };
    material.opacity = Math.sin(t * Math.PI) * 0.9;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.075, 8, 8]} />
      <meshBasicMaterial color={lane.config.color} transparent opacity={0.8} />
    </mesh>
  );
}

export function DataFlowLines() {
  const lanes = useMemo<Lane[]>(() => {
    return DATA_FLOWS.flatMap((config) => {
      const from = OFFICE_LAYOUT[config.from];
      const to = OFFICE_LAYOUT[config.to];
      if (!from || !to) return [];
      return [
        {
          config,
          from: [from.position[0], from.position[1] + 1.1, from.position[2]],
          to: [to.position[0], to.position[1] + 1.1, to.position[2]]
        }
      ];
    });
  }, []);

  return (
    <group>
      {lanes.map((lane) => (
        <group key={`${lane.config.from}-${lane.config.to}`}>
          {/* Three staggered particles per lane keeps the flow continuous. */}
          <FlowParticle lane={lane} offset={0} />
          <FlowParticle lane={lane} offset={0.33} />
          <FlowParticle lane={lane} offset={0.66} />
        </group>
      ))}
    </group>
  );
}
