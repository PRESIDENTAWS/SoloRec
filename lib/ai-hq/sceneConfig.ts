/**
 * SoloRec AI HQ — environment dimensions.
 *
 * Presentation-only geometry configuration for the command center shell:
 * floor extents, wall placement, ceiling rig, and the large wall displays
 * that give each side of the room its purpose.
 *
 * The layout this wraps around lives in lib/agents/office-layout.ts.
 */

export const SCENE_CONFIG = {
  floor: {
    size: 46,
    /** Command rings are centred on ORION's platform. */
    ringCenter: [0, -0.8] as [number, number],
    ringRadii: [4.2, 5.4, 7.1] as const,
    gridDivisions: 46
  },
  room: {
    /** Rear wall sits behind the Talent Lab (AVA). */
    backZ: -19,
    /** Front wall sits behind the secure zone (FIN / GUARD). */
    frontZ: 17,
    sideX: 15.5,
    height: 9
  },
  ceiling: {
    y: 8.4,
    /** Suspended light bars run across the room at these z positions. */
    barPositions: [-14, -8.5, -3, 2.5, 8, 13.5] as const,
    barLength: 26,
    barWidth: 0.34
  }
} as const;

export interface WallDisplayConfig {
  id: string;
  /** Headline rendered on the display. */
  title: string;
  /** Supporting lines — purely decorative labels. */
  lines: string[];
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  accent: string;
}

/**
 * The three storytelling surfaces:
 *  - rear wall behind AVA  → talent intelligence
 *  - centre behind ORION   → executive command display
 *  - front near FIN/GUARD  → secure zone monitors
 */
export const WALL_DISPLAYS: WallDisplayConfig[] = [
  {
    id: "talent-intelligence",
    title: "TALENT INTELLIGENCE",
    lines: ["SOURCING MAP · ATLANTA", "12,840 PROFILES INDEXED", "PIPELINE FLOW NOMINAL"],
    position: [0, 4.3, -18.8],
    rotation: [0, 0, 0],
    size: [15, 5.2],
    accent: "#58d0ff"
  },
  {
    id: "executive-command",
    title: "EXECUTIVE COMMAND",
    lines: ["WEIGHTED PIPELINE $428K", "OPEN REQUISITIONS 32", "APPROVALS PENDING 7"],
    position: [-15.3, 4.1, -6],
    rotation: [0, Math.PI / 2, 0],
    size: [12, 4.6],
    accent: "#a78bfa"
  },
  {
    id: "secure-operations",
    title: "SECURE OPERATIONS",
    lines: ["COMPLIANCE CLEAR", "RISK FLAGS 2", "AUDIT TRAIL LIVE"],
    position: [15.3, 4.1, 6],
    rotation: [0, -Math.PI / 2, 0],
    size: [12, 4.6],
    accent: "#f59e0b"
  }
];

/**
 * Data-flow lanes between agents. Purely visual: they express that the
 * workforce is operating, not any real message routing.
 */
export interface DataFlowConfig {
  from: string;
  to: string;
  color: string;
  /** Seconds for one particle to traverse the lane. */
  duration: number;
}

export const DATA_FLOWS: DataFlowConfig[] = [
  { from: "ava", to: "orion", color: "#58d0ff", duration: 3.2 },
  { from: "ava", to: "luna", color: "#22d3ee", duration: 4.1 },
  { from: "spark", to: "ava", color: "#58d0ff", duration: 2.6 },
  { from: "milo", to: "orion", color: "#38bdf8", duration: 3.6 },
  { from: "orion", to: "nova", color: "#a78bfa", duration: 3.9 },
  { from: "luna", to: "orion", color: "#22d3ee", duration: 3.4 },
  { from: "echo", to: "guard", color: "#ef4444", duration: 2.9 },
  { from: "nova", to: "fin", color: "#22c55e", duration: 4.4 }
];
