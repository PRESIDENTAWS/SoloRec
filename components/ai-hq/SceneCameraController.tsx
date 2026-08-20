"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { presetFor } from "@/lib/ai-hq/cameraPresets";

interface SceneCameraControllerProps {
  /** Selected agent drives the fly-to target; null returns to overview. */
  selectedAgentId: string | null;
  /** Bumping this token re-triggers a fly-to (used by "reset view"). */
  resetToken: number;
}

/**
 * Hybrid camera system: a cinematic orbit by default, click-to-focus on a
 * workstation, and free user orbit once a move settles.
 *
 * Presentation only — it consumes a selection id and looks up framing from
 * lib/ai-hq/cameraPresets.ts.
 */
export function SceneCameraController({
  selectedAgentId,
  resetToken
}: SceneCameraControllerProps) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as
    | { target: Vector3; update: () => void }
    | null;

  const desiredPosition = useRef(new Vector3());
  const desiredTarget = useRef(new Vector3());
  /** While true we drive the camera; once settled the user takes over. */
  const flying = useRef(false);

  useEffect(() => {
    const preset = presetFor(selectedAgentId);
    desiredPosition.current.set(...preset.position);
    desiredTarget.current.set(...preset.target);
    flying.current = true;
  }, [selectedAgentId, resetToken]);

  useFrame((_, delta) => {
    if (!flying.current || !controls) return;

    // Frame-rate independent easing toward the preset.
    const lerp = 1 - Math.pow(0.0015, delta);
    camera.position.lerp(desiredPosition.current, lerp);
    controls.target.lerp(desiredTarget.current, lerp);
    controls.update();

    const settled =
      camera.position.distanceTo(desiredPosition.current) < 0.05 &&
      controls.target.distanceTo(desiredTarget.current) < 0.05;
    if (settled) flying.current = false;
  });

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={5}
      maxDistance={34}
      minPolarAngle={0.25}
      maxPolarAngle={1.32}
      // Slow cinematic drift only when nothing is selected.
      autoRotate={selectedAgentId === null}
      autoRotateSpeed={0.28}
    />
  );
}
