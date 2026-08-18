"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";
import { SIDEBAR_SECTIONS } from "@/lib/nav/sidebar-config";
import { cn } from "@/lib/utils/cn";

function isActive(pathname: string, href: string): boolean {
  if (href === "/ai-hq") return pathname === "/ai-hq";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ orgName }: { orgName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-base-line bg-base-panel/60 lg:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple text-white">
          <Rocket size={18} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-slate-50">{orgName}</div>
          <div className="text-[11px] text-slate-500">SoloRec AI</div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6" aria-label="Primary">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
              {section.label}
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
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
          </div>
        ))}
      </nav>
    </aside>
  );
}
