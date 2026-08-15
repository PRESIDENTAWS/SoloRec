import { Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-base-line bg-base-bg/80 px-6 py-4 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2 rounded-xl border border-base-line bg-base-panel px-3 py-2 text-sm text-slate-500 lg:w-96">
        <Search size={16} aria-hidden="true" />
        <span className="truncate">Search anything…</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-status-healthy/30 bg-status-healthy/10 px-3 py-1 text-xs font-semibold text-status-healthy sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-status-healthy" aria-hidden="true" />
          Live
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-purple/20 text-sm font-semibold text-accent-purple-soft">
          R
        </div>
      </div>
    </header>
  );
}
