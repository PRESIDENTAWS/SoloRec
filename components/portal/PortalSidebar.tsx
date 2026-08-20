"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";
import { CLIENT_NAV, CANDIDATE_NAV } from "@/lib/nav/portal-nav";
import { cn } from "@/lib/utils/cn";

export type PortalVariant = "client" | "candidate";

const NAV_BY_VARIANT = {
  client: { items: CLIENT_NAV, rootHref: "/client" },
  candidate: { items: CANDIDATE_NAV, rootHref: "/candidate" }
} as const;

function isActive(pathname: string, href: string, rootHref: string): boolean {
  if (href === rootHref) return pathname === rootHref;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Client-side portal sidebar. The nav config (with its icon *components*) is
 * imported here rather than passed in as props, so no function ever crosses the
 * server→client boundary — the same pattern the recruiter Sidebar uses. The
 * server shell selects a portal with the serializable `variant` string.
 */
export function PortalSidebar({
  brand,
  subtitle,
  variant
}: {
  brand: string;
  subtitle: string;
  variant: PortalVariant;
}) {
  const pathname = usePathname();
  const { items, rootHref } = NAV_BY_VARIANT[variant];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-base-line bg-base-panel/60 lg:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple text-white">
          <Rocket size={18} aria-hidden="true" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-50">{brand}</div>
          <div className="text-[11px] text-slate-500">{subtitle}</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6" aria-label="Portal">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = isActive(pathname, item.href, rootHref);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-accent-blue/15 text-accent-blue-soft"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  )}
                >
                  <Icon size={16} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
