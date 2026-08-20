import Link from "next/link";
import { ArrowRight, LayoutDashboard, Radio } from "lucide-react";

export interface EntryStat {
  label: string;
  value: string;
}

/**
 * Cinematic launch screen for the AI HQ.
 *
 * Sells the environment before the user enters it: seal, live posture, a
 * summary stat row, and the single "Enter Command Center" action.
 */
export function AIHQEntryHero({
  stats,
  agentsOnline
}: {
  stats: EntryStat[];
  agentsOnline: number;
}) {
  return (
    <main className="relative min-h-[calc(100vh-8rem)] overflow-hidden rounded-3xl border border-white/5 bg-black text-white">
      {/* Layered tactical backdrop. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(55,90,170,0.28),transparent_45%),linear-gradient(180deg,#04070d_0%,#09111f_45%,#05070b_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />
      {/* Faint outline of the command floor. */}
      <div className="absolute bottom-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 translate-y-1/3 rounded-[50%] border border-cyan-300/15 bg-cyan-400/[0.03] blur-[2px]" />
      <div className="absolute bottom-0 left-1/2 h-[260px] w-[520px] -translate-x-1/2 translate-y-1/3 rounded-[50%] border border-cyan-300/20" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col justify-center px-8 py-16">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              <Radio size={12} aria-hidden="true" />
              AI Workforce Online
            </span>
            <span className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              {agentsOnline} Agents Active
            </span>
          </div>

          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-cyan-300">SoloRec AI</p>
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Staffing HQ</h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-300">
            Enter the AI-native command center for sourcing, recruiting, approvals, client
            intelligence, finance, and risk oversight.
          </p>

          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <div className="text-xs uppercase tracking-wider text-zinc-400">{stat.label}</div>
                <div className="mt-2 text-2xl font-semibold tabular-nums">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/ai-hq/command-center"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-medium text-black transition hover:bg-cyan-300"
            >
              Enter Command Center
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-white/90 transition hover:bg-white/5"
            >
              <LayoutDashboard size={16} aria-hidden="true" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
