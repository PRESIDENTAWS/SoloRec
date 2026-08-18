/**
 * SoloRec AI HQ — Spatial Design System
 *
 * Presentation-only configuration.
 *
 * This file controls:
 * - workstation position
 * - rotation / facing direction
 * - workstation scale
 * - visual zone
 * - floor elevation
 * - camera focus offsets
 * - local accent lighting anchors
 * - desk style
 *
 * NO recruiting logic, agent logic, permissions, workflows,
 * database access, or AI execution logic belongs here.
 */

export type OfficeZone =
  | "talent-lab"
  | "recruiting"
  | "command-center"
  | "intelligence"
  | "client-success"
  | "finance"
  | "risk";

export type DeskStyle =
  | "executive"
  | "analyst"
  | "operations"
  | "creative"
  | "secure";

export interface WorkstationLayout {
  position: [number, number, number];

  /**
   * Euler rotation in radians.
   * Primarily rotate around Y so agents face the center,
   * screens, or collaboration areas.
   */
  rotation: [number, number, number];

  /**
   * Allows major workstations to visually dominate
   * without changing business importance.
   */
  scale: number;

  zone: OfficeZone;

  deskStyle: DeskStyle;

  /**
   * Offset used when the camera flies to this workstation.
   */
  cameraOffset: [number, number, number];

  /**
   * Look-at target relative to workstation position.
   */
  cameraTargetOffset: [number, number, number];

  /**
   * Anchor for local workstation lighting.
   */
  lightOffset: [number, number, number];

  /**
   * Purely visual label placement.
   */
  labelOffset: [number, number, number];

  /**
   * Optional visual platform beneath higher-importance stations.
   */
  platformHeight?: number;
}

/**
 * Layout concept:
 *
 *                      TALENT LAB
 *
 *                         AVA
 *
 *              SPARK               MILO
 *
 *
 *                    ╔═══════════╗
 *                    ║   ORION   ║
 *                    ║ COMMAND   ║
 *                    ║  CENTER   ║
 *                    ╚═══════════╝
 *
 *
 *               LUNA             ECHO
 *
 *
 *                         NOVA
 *
 *
 *                    FIN     GUARD
 *
 *                 EXECUTIVE FRONT
 *
 *
 * Rather than placing agents on a rigid grid, stations are slightly
 * staggered and rotated toward ORION. This creates a command-room feel
 * and gives the camera natural travel lanes.
 */

export const OFFICE_LAYOUT: Record<string, WorkstationLayout> = {
  ava: {
    position: [0, 0.65, -10.5],
    rotation: [0, Math.PI, 0],
    scale: 1.12,

    zone: "talent-lab",
    deskStyle: "creative",

    cameraOffset: [4.5, 3.2, 5.5],
    cameraTargetOffset: [0, 1.15, 0],

    lightOffset: [0, 3.5, 0.4],
    labelOffset: [0, 2.7, 0],

    platformHeight: 0.08
  },

  spark: {
    position: [-6.4, 0.6, -6.2],
    rotation: [0, Math.PI * 0.72, 0],
    scale: 0.98,

    zone: "talent-lab",
    deskStyle: "creative",

    cameraOffset: [4.8, 2.8, 4.4],
    cameraTargetOffset: [0, 1.1, 0],

    lightOffset: [-0.4, 3.1, 0],
    labelOffset: [0, 2.45, 0]
  },

  milo: {
    position: [6.4, 0.6, -6.2],
    rotation: [0, -Math.PI * 0.72, 0],
    scale: 0.98,

    zone: "recruiting",
    deskStyle: "operations",

    cameraOffset: [-4.8, 2.8, 4.4],
    cameraTargetOffset: [0, 1.1, 0],

    lightOffset: [0.4, 3.1, 0],
    labelOffset: [0, 2.45, 0]
  },

  /**
   * ORION is deliberately larger and slightly elevated.
   *
   * Visually this should feel less like "another desk" and more like
   * the central operating table of the entire agency.
   */
  orion: {
    position: [0, 0.9, -0.8],
    rotation: [0, Math.PI, 0],
    scale: 1.32,

    zone: "command-center",
    deskStyle: "executive",

    cameraOffset: [6.8, 4.3, 7.6],
    cameraTargetOffset: [0, 1.3, 0],

    lightOffset: [0, 4.6, 0],
    labelOffset: [0, 3.2, 0],

    platformHeight: 0.3
  },

  luna: {
    position: [-6.1, 0.62, 3.2],
    rotation: [0, Math.PI * 0.3, 0],
    scale: 1.02,

    zone: "intelligence",
    deskStyle: "analyst",

    cameraOffset: [4.7, 3, -4.2],
    cameraTargetOffset: [0, 1.15, 0],

    lightOffset: [-0.2, 3.25, 0],
    labelOffset: [0, 2.55, 0]
  },

  echo: {
    position: [6.1, 0.62, 3.2],
    rotation: [0, -Math.PI * 0.3, 0],
    scale: 1.02,

    zone: "risk",
    deskStyle: "secure",

    cameraOffset: [-4.7, 3, -4.2],
    cameraTargetOffset: [0, 1.15, 0],

    lightOffset: [0.2, 3.25, 0],
    labelOffset: [0, 2.55, 0]
  },

  nova: {
    position: [0, 0.68, 7.2],
    rotation: [0, 0, 0],
    scale: 1.06,

    zone: "client-success",
    deskStyle: "operations",

    cameraOffset: [5.2, 3.2, -5],
    cameraTargetOffset: [0, 1.15, 0],

    lightOffset: [0, 3.4, -0.2],
    labelOffset: [0, 2.65, 0],

    platformHeight: 0.05
  },

  fin: {
    position: [-3.35, 0.72, 11.1],
    rotation: [0, Math.PI * 0.08, 0],
    scale: 1.03,

    zone: "finance",
    deskStyle: "analyst",

    cameraOffset: [4.3, 2.9, -4.1],
    cameraTargetOffset: [0, 1.1, 0],

    lightOffset: [0, 3.3, 0],
    labelOffset: [0, 2.55, 0],

    platformHeight: 0.1
  },

  guard: {
    position: [3.35, 0.72, 11.1],
    rotation: [0, -Math.PI * 0.08, 0],
    scale: 1.03,

    zone: "risk",
    deskStyle: "secure",

    cameraOffset: [-4.3, 2.9, -4.1],
    cameraTargetOffset: [0, 1.1, 0],

    lightOffset: [0, 3.3, 0],
    labelOffset: [0, 2.55, 0],

    platformHeight: 0.1
  }
};

/**
 * Convenience map for components that only need coordinates.
 *
 * This preserves compatibility with your existing components while
 * the richer OFFICE_LAYOUT powers the full scene.
 */
export const OFFICE_POSITIONS: Record<
  string,
  [number, number, number]
> = Object.fromEntries(
  Object.entries(OFFICE_LAYOUT).map(([agentId, workstation]) => [
    agentId,
    workstation.position
  ])
);
