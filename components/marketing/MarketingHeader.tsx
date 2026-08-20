import Link from "next/link";
import { Rocket } from "lucide-react";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Demo", href: "/demo" }
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-line bg-base-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple text-white">
            <Rocket size={18} aria-hidden="true" />
          </span>
          <span className="text-sm font-bold text-slate-50">SoloRec</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Marketing">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-400 transition hover:text-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/get-started"
            className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
