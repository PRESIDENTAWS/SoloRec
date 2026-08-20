import type { ReactNode } from "react";
import { Radar, Search } from "lucide-react";
import { IntelTabs } from "@/components/job-intelligence/IntelTabs";

export default function JobIntelligenceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
            <Radar size={14} aria-hidden="true" />
            Talent Intelligence
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Job Intelligence</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Who is actually hiring, what they are hiring for, how strong the demand is, and who to
            contact — one canonical job record across every source.
          </p>
        </div>
        <label className="relative block w-full sm:w-80">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="search"
            placeholder="Search jobs, companies, skills or markets…"
            className="w-full rounded-xl border border-base-line bg-base-panel2 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent-blue-soft/50 focus:outline-none"
          />
        </label>
      </div>

      <IntelTabs />

      {children}
    </div>
  );
}
