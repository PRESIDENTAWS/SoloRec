"use client";

import { OFFICE_THEME } from "@/lib/ai-hq/officeTheme";
import { SCENE_CONFIG } from "@/lib/ai-hq/sceneConfig";

/**
 * Suspended light bars — the industrial military command-center read.
 *
 * Presentation only: emissive bars plus the focused pools of light they
 * imply over the floor. Intensity constants come from officeTheme.
 */
export function CeilingLightRig() {
  const { y, barPositions, barLength, barWidth } = SCENE_CONFIG.ceiling;

  return (
    <group>
      {barPositions.map((z) => (
        <group key={z} position={[0, y, z]}>
          {/* The emissive bar itself. */}
          <mesh>
            <boxGeometry args={[barLength, 0.14, barWidth]} />
            <meshBasicMaterial color={OFFICE_THEME.ceiling.barColor} />
          </mesh>
          {/* Housing above the bar. */}
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[barLength, 0.3, barWidth + 0.25]} />
            <meshStandardMaterial
              color={OFFICE_THEME.ceiling.rigColor}
              roughness={0.7}
              metalness={0.5}
            />
          </mesh>
          {/* Cool pool of light cast downward. */}
          <pointLight
            position={[0, -1.5, 0]}
            intensity={OFFICE_THEME.lighting.ceilingIntensity}
            distance={16}
            color="#cfe6ff"
          />
        </group>
      ))}
    </group>
  );
}
