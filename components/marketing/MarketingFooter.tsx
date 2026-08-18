import Link from "next/link";

const FOOTER_COLUMNS: Array<{ heading: string; links: Array<{ label: string; href: string }> }> = [
  {
    heading: "Platform",
    links: [
      { label: "Products", href: "/products" },
      { label: "Solutions", href: "/solutions" },
      { label: "Pricing", href: "/pricing" },
      { label: "Job Intelligence", href: "/products" }
    ]
  },
  {
    heading: "Portals",
    links: [
      { label: "Recruiter / Agency", href: "/login" },
      { label: "Client", href: "/login" },
      { label: "Candidate", href: "/login" }
    ]
  },
  {
    heading: "Company",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "Book a Demo", href: "/demo" },
      { label: "Get Started", href: "/get-started" }
    ]
  }
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-base-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="text-sm font-bold text-slate-50">SoloRec</div>
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            The AI operating system for full-desk staffing and recruiting.
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {column.heading}
            </div>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={`${column.heading}-${link.label}`}>
                  <Link href={link.href} className="text-sm text-slate-400 transition hover:text-slate-100">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-base-line px-6 py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} SoloRec. All rights reserved.
      </div>
    </footer>
  );
}
