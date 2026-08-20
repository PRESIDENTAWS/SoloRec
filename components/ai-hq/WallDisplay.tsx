"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Mesh } from "three";
import type { WallDisplayConfig } from "@/lib/ai-hq/sceneConfig";

/**
 * A large LED command panel mounted on a wall.
 *
 * Presentation only — the title and lines are decorative labels supplied by
 * lib/ai-hq/sceneConfig.ts, not live figures read from any service.
 */
export function WallDisplay({ config }: { config: WallDisplayConfig }) {
  const glowRef = useRef<Mesh>(null);
  const [width, height] = config.size;

  // Subtle flicker so the screens read as active rather than painted on.
  useFrame((state) => {
    if (!glowRef.current) return;
    const t = state.clock.elapsedTime;
    const material = glowRef.current.material as { opacity: number };
    material.opacity = 0.1 + 0.035 * Math.sin(t * 1.7) + 0.015 * Math.sin(t * 5.3);
  });

  return (
    <group position={config.position} rotation={config.rotation}>
      {/* Screen body. */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#050a13" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Backlight wash. */}
      <mesh ref={glowRef} position={[0, 0, 0.09]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={config.accent} transparent opacity={0.12} />
      </mesh>

      {/* Bezel accent. */}
      <mesh position={[0, height / 2 - 0.08, 0.1]}>
        <planeGeometry args={[width, 0.06]} />
        <meshBasicMaterial color={config.accent} transparent opacity={0.7} />
      </mesh>

      <Text
        position={[0, height / 2 - 0.85, 0.12]}
        fontSize={0.52}
        color={config.accent}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.14}
      >
        {config.title}
      </Text>

      {config.lines.map((line, i) => (
        <Text
          key={line}
          position={[0, height / 2 - 1.9 - i * 0.72, 0.12]}
          fontSize={0.34}
          color="#cbd5e1"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          {line}
        </Text>
      ))}
    </group>
  );
}
