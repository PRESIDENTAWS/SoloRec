import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { getRequestContext } from "@/lib/auth/context";
import { search } from "@/services/search/searchService";
import { Card } from "@/components/ui/Card";

const ENTITY_LABEL: Record<string, string> = {
  company: "Company",
  contact: "Contact",
  job: "Job",
  candidate: "Candidate"
};

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const ctx = await getRequestContext();
  const query = searchParams.q ?? "";
  const results = query ? await search(ctx, query) : [];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          Recruiting
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Search</h1>
      </div>

      <form className="max-w-lg">
        <div className="flex items-center gap-2 rounded-xl border border-base-line bg-base-panel2 px-3 py-2">
          <SearchIcon size={16} className="text-slate-500" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search companies, contacts, jobs, candidates…"
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
          />
        </div>
      </form>

      {query && (
        <Card className="overflow-hidden">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">No results for "{query}".</div>
          ) : (
            <ul className="divide-y divide-base-line">
              {results.map((result) => (
                <li key={`${result.entityType}-${result.id}`}>
                  <Link href={result.href} className="flex items-center justify-between px-5 py-3 hover:bg-white/5">
                    <div>
                      <span className="text-sm font-medium text-slate-100">{result.title}</span>
                      {result.subtitle && <span className="ml-2 text-xs text-slate-500">{result.subtitle}</span>}
                    </div>
                    <span className="text-[11px] uppercase tracking-wide text-slate-600">
                      {ENTITY_LABEL[result.entityType]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
