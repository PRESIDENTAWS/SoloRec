"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function GlobalSearchForm() {
  const router = useRouter();

  return (
    <form
      className="flex min-w-0 items-center gap-2 rounded-xl border border-base-line bg-base-panel px-3 py-2 text-sm text-slate-300 lg:w-96"
      onSubmit={(event) => {
        event.preventDefault();
        const query = new FormData(event.currentTarget).get("q");
        if (typeof query === "string" && query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
      }}
    >
      <Search size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
      <input
        type="search"
        name="q"
        placeholder="Search anything…"
        className="w-full bg-transparent placeholder:text-slate-500 focus:outline-none"
      />
    </form>
  );
}
