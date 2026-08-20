/**
 * SoloRec AI HQ — HUD configuration.
 *
 * Labels and layout constants for the tactical overlay. The values shown in
 * the HUD are passed in as props from the page; nothing is computed here.
 */

export const HUD_LABELS = {
  organization: "SOLOREC STAFFING HQ",
  environment: "AI WORKFORCE COMMAND CENTER",
  missionNominal: "ALL SYSTEMS NOMINAL",
  missionReview: "HUMAN REVIEW REQUIRED",
  missionBlocked: "ESCALATION ACTIVE"
} as const;

export interface HudStat {
  label: string;
  value: string;
  tone?: "default" | "accent" | "warning" | "danger" | "success";
}

export const HUD_TONE_CLASS: Record<NonNullable<HudStat["tone"]>, string> = {
  default: "text-slate-200",
  accent: "text-cyan-300",
  warning: "text-amber-300",
  danger: "text-red-400",
  success: "text-emerald-400"
};

/** Camera control hints rendered bottom-left. */
export const CAMERA_HINTS: string[] = [
  "DRAG · ORBIT",
  "SCROLL · ZOOM",
  "CLICK STATION · FOCUS",
  "ESC · RESET VIEW"
];
