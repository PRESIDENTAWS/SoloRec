import type { AutonomyLevel } from "@/types";
import { AUTONOMY_LEVEL_LABELS } from "@/types";
import { cn } from "@/lib/utils/cn";

const LEVELS: AutonomyLevel[] = [0, 1, 2, 3, 4, 5];

export function AutonomyMeter({ level }: { level: AutonomyLevel }) {
  return (
    <div>
      <div className="flex items-center gap-1" role="img" aria-label={`Autonomy level ${level} of 5: ${AUTONOMY_LEVEL_LABELS[level]}`}>
        {LEVELS.map((step) => (
          <span
            key={step}
            aria-hidden="true"
            className={cn(
              "h-1.5 flex-1 rounded-full",
              step <= level ? "bg-gradient-to-r from-accent-blue to-accent-purple" : "bg-base-line"
            )}
          />
        ))}
      </div>
      <div className="mt-1.5 text-xs text-slate-500">
        Level {level} — {AUTONOMY_LEVEL_LABELS[level]}
      </div>
    </div>
  );
}
