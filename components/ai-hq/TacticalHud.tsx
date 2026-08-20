"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { Agent } from "@/types";
import { AGENT_STATUS_LABELS, AUTONOMY_LEVEL_LABELS } from "@/types";
import { AGENT_STATUS_COLOR } from "@/lib/agents/constants";
import { CAMERA_HINTS, HUD_LABELS, HUD_TONE_CLASS, type HudStat } from "@/lib/ai-hq/hudConfig";

interface TacticalHudProps {
  stats: HudStat[];
  mission: string;
  missionTone: "nominal" | "review" | "blocked";
  selected: Agent | null;
  onResetView: () => void;
}

const MISSION_TONE_CLASS: Record<TacticalHudProps["missionTone"], string> = {
  nominal: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  review: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  blocked: "border-red-400/40 bg-red-400/10 text-red-300"
};

/** Live clock, mounted client-side so server and client markup agree. */
function HudClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        })
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ?? "--:--:--"}</span>;
}

/**
 * Layered tactical overlay above the 3D scene.
 *
 * All figures are passed in; the HUD renders, it does not compute.
 */
export function TacticalHud({
  stats,
  mission,
  missionTone,
  selected,
  onResetView
}: TacticalHudProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Vignette so HUD text stays legible over the scene. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(2,5,12,0.72)_100%)]" />

      {/* Top left — identity. */}
      <div className="absolute left-5 top-5 flex flex-col gap-1">
        <Link
          href="/ai-hq"
          className="pointer-events-auto inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 backdrop-blur transition hover:border-cyan-300/40 hover:text-white"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          EXIT
        </Link>
        <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300">
          {HUD_LABELS.organization}
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
          {HUD_LABELS.environment}
        </div>
        <div className="text-[11px] text-slate-400">
          <HudClock />
        </div>
      </div>

      {/* Top center — mission status. */}
      <div className="absolute left-1/2 top-5 -translate-x-1/2">
        <span
          className={`rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur ${MISSION_TONE_CLASS[missionTone]}`}
        >
          {mission}
        </span>
      </div>

      {/* Top right — operational figures. */}
      <div className="absolute right-5 top-5 flex gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="min-w-[104px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 backdrop-blur"
          >
            <div className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
              {stat.label}
            </div>
            <div
              className={`mt-0.5 text-lg font-semibold tabular-nums ${HUD_TONE_CLASS[stat.tone ?? "default"]}`}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom left — camera controls. */}
      <div className="absolute bottom-5 left-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={onResetView}
          className="pointer-events-auto inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-semibold text-slate-300 backdrop-blur transition hover:border-cyan-300/40 hover:text-white"
        >
          <RotateCcw size={13} aria-hidden="true" />
          RESET VIEW
        </button>
        <ul className="space-y-0.5">
          {CAMERA_HINTS.map((hint) => (
            <li key={hint} className="text-[10px] tracking-[0.12em] text-slate-600">
              {hint}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom right — selected agent. */}
      {selected ? (
        <div className="pointer-events-auto absolute bottom-5 right-5 w-[300px] rounded-2xl border border-white/10 bg-black/55 p-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-bold tracking-wide text-slate-50">
                {selected.name}
              </div>
              <div className="truncate text-[11px] text-slate-400">{selected.role}</div>
            </div>
            <span
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: AGENT_STATUS_COLOR[selected.status] }}
              aria-hidden="true"
            />
          </div>

          <div className="mt-3 space-y-1.5 text-[11px]">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">STATUS</span>
              <span className="text-slate-200">{AGENT_STATUS_LABELS[selected.status]}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">AUTONOMY</span>
              <span className="truncate text-slate-200">
                {AUTONOMY_LEVEL_LABELS[selected.autonomyLevel]}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">HEALTH</span>
              <span className="text-slate-200">{selected.health}%</span>
            </div>
          </div>

          <div className="mt-3 border-t border-white/10 pt-2.5">
            <div className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
              Current task
            </div>
            <div className="mt-1 text-[11px] leading-snug text-slate-300">
              {selected.currentTask}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            {selected.kpis.slice(0, 2).map((kpi) => (
              <div
                key={kpi.label}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5"
              >
                <div className="text-[9px] uppercase tracking-wide text-slate-500">
                  {kpi.label}
                </div>
                <div className="text-xs font-semibold text-slate-100">{kpi.value}</div>
              </div>
            ))}
          </div>

          <Link
            href={`/ai-hq/agents/${selected.id}`}
            className="mt-3 block rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-center text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
          >
            OPEN AGENT DETAIL
          </Link>
        </div>
      ) : (
        <div className="absolute bottom-5 right-5 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[11px] text-slate-500 backdrop-blur">
          Select a workstation to inspect an agent
        </div>
      )}
    </div>
  );
}
