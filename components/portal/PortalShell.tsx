import type { ReactNode } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import type { PortalNavItem } from "@/lib/nav/portal-nav";
import { PortalSidebar } from "@/components/portal/PortalSidebar";

export interface PortalUser {
  name: string;
  contextLabel: string;
}

/**
 * Shared shell for the customer-facing portals (client & candidate). Same
 * structural chrome as the recruiter OS, but deliberately its own component so
 * the two experiences never share recruiter-only surfaces. A real build reads
 * the signed-in session here; the starter passes a mock user.
 */
export function PortalShell({
  brand,
  subtitle,
  navItems,
  rootHref,
  user,
  children
}: {
  brand: string;
  subtitle: string;
  navItems: PortalNavItem[];
  rootHref: string;
  user: PortalUser;
  children: ReactNode;
}) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-base-bg text-slate-100">
      <PortalSidebar brand={brand} subtitle={subtitle} navItems={navItems} rootHref={rootHref} />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-base-line bg-base-bg/80 px-6 py-4 backdrop-blur">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-100">{brand}</div>
            <div className="truncate text-xs text-slate-500">{user.contextLabel}</div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              <LogOut size={14} aria-hidden="true" />
              Sign out
            </Link>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-purple/20 text-sm font-semibold text-accent-purple-soft"
              aria-hidden="true"
            >
              {initial}
            </span>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
