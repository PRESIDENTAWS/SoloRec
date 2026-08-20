/**
 * SoloRec AI HQ — visual theme.
 *
 * Presentation-only. The command center is a dark tactical operations
 * environment, not a generic office: matte graphite floors, steel walls,
 * cool blue accent light, and focused pools over key stations.
 *
 * No recruiting logic, permissions, or data access belongs here.
 */

export const OFFICE_THEME = {
  environment: {
    baseColor: "#060b12",
    accentColor: "#58d0ff",
    secondaryAccent: "#8b5cf6",
    warningColor: "#f59e0b",
    dangerColor: "#ef4444",
    successColor: "#22c55e"
  },
  floor: {
    color: "#0b1220",
    gridColor: "#58d0ff",
    gridOpacity: 0.16,
    ringColor: "#58d0ff",
    runwayColor: "#58d0ff"
  },
  walls: {
    color: "#0f1726",
    trimColor: "#1b2740",
    panelGlow: "#58d0ff",
    glassColor: "#8fb6d8"
  },
  ceiling: {
    barColor: "#dbeafe",
    rigColor: "#131c2e"
  },
  lighting: {
    ambientIntensity: 0.35,
    ceilingIntensity: 1.2,
    tableIntensity: 1.6,
    rimIntensity: 0.8
  },
  fog: {
    color: "#05070d",
    near: 26,
    far: 62
  }
} as const;

/** Accent color per spatial zone — gives each department its own read. */
export const ZONE_ACCENT: Record<string, string> = {
  "talent-lab": "#58d0ff",
  recruiting: "#38bdf8",
  "command-center": "#a78bfa",
  intelligence: "#22d3ee",
  "client-success": "#22c55e",
  finance: "#f59e0b",
  risk: "#ef4444"
};

export function zoneAccent(zone: string): string {
  return ZONE_ACCENT[zone] ?? OFFICE_THEME.environment.accentColor;
}
