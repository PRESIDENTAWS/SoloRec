import Link from "next/link";
import { Sparkles } from "lucide-react";

const NAV_LINKS = ["Product", "Agents", "Solutions", "Resources", "Pricing", "Company"];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-base-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple text-white">
            <Sparkles size={16} aria-hidden="true" />
          </span>
          <span className="text-lg font-bold text-slate-50">SoloRec</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((label) => (
            <span key={label} className="cursor-default transition hover:text-white">
              {label}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-200 transition hover:text-white">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
