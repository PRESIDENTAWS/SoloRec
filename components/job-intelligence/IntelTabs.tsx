"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Sub-navigation for the Job Intelligence workspace. Mirrors the recommended
 * IA: Overview, Search Jobs, Hiring Signals, Ghost Risk, Reposted Jobs, New
 * Jobs, Companies Hiring, Watchlists, Saved Searches.
 */
const TABS = [
  { label: "Overview", href: "/job-intelligence" },
  { label: "Search Jobs", href: "/job-intelligence/search" },
  { label: "Hiring Signals", href: "/job-intelligence/hiring-signals" },
  { label: "Ghost Risk", href: "/job-intelligence/ghost-risk" },
  { label: "Reposted Jobs", href: "/job-intelligence/reposted" },
  { label: "New Jobs", href: "/job-intelligence/new" },
  { label: "Companies Hiring", href: "/job-intelligence/companies" },
  { label: "Watchlists", href: "/job-intelligence/watchlists" },
  { label: "Saved Searches", href: "/job-intelligence/saved-searches" }
];

export function IntelTabs() {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto border-b border-base-line">
      <nav className="flex min-w-max gap-1" aria-label="Job Intelligence sections">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "border-accent-blue text-accent-blue-soft"
                  : "border-transparent text-slate-400 hover:text-slate-100"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
