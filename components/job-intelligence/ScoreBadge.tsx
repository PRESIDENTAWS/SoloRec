import type { ScoreBand } from "@/types";
import { cn } from "@/lib/utils/cn";

type ScoreKind = "ghost" | "hiring" | "opportunity";

const BAND_CLASS: Record<ScoreBand, string> = {
  very_high: "bg-status-healthy/15 text-status-healthy border-status-healthy/30",
  high: "bg-status-healthy/10 text-status-healthy border-status-healthy/25",
  medium: "bg-status-review/15 text-status-review border-status-review/30",
  low: "bg-base-panel2 text-slate-400 border-base-line",
  very_low: "bg-base-panel2 text-slate-500 border-base-line"
};

/**
 * For ghost risk the color polarity is inverted — a *high* ghost score is bad,
 * so it should read red, not green. This maps the raw score to a risk band.
 */
function ghostRiskClass(score: number): string {
  if (score >= 65) return "bg-status-blocked/15 text-status-blocked border-status-blocked/30";
  if (score >= 40) return "bg-status-review/15 text-status-review border-status-review/30";
  return "bg-status-healthy/15 text-status-healthy border-status-healthy/30";
}

function band(score: number): ScoreBand {
  if (score >= 85) return "very_high";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  if (score >= 20) return "low";
  return "very_low";
}

export function ScoreBadge({ kind, score }: { kind: ScoreKind; score: number }) {
  const className = kind === "ghost" ? ghostRiskClass(score) : BAND_CLASS[band(score)];
  return (
    <span
      className={cn(
        "inline-flex min-w-[2.5rem] items-center justify-center rounded-md border px-2 py-1 text-sm font-semibold tabular-nums",
        className
      )}
    >
      {score}
    </span>
  );
}
