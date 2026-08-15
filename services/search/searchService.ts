import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { RequestContext } from "@/lib/auth/context";

export interface SearchResult {
  entityType: "company" | "contact" | "job" | "candidate";
  id: string;
  title: string;
  subtitle: string | null;
  href: string;
}

/**
 * Keyword search only (ILIKE) — the server-side search service the sprint
 * calls for, scoped to companies/contacts/jobs/candidates. pgvector
 * semantic search is deliberately deferred (the `vector` extension is
 * enabled in migrations, but nothing is embedded yet) — see
 * docs/architecture/04-ai-and-agents.md#m-memory-architecture.
 */
export async function search(ctx: RequestContext, query: string): Promise<SearchResult[]> {
  const term = query.trim();
  if (!term) return [];

  const supabase = createClient();
  const pattern = `%${term}%`;

  const [companies, contacts, jobs, candidates] = await Promise.all([
    supabase
      .from("companies")
      .select("id, name, industry")
      .eq("organization_id", ctx.organizationId)
      .ilike("name", pattern)
      .limit(10),
    supabase
      .from("contacts")
      .select("id, first_name, last_name, title")
      .eq("organization_id", ctx.organizationId)
      .or(`first_name.ilike.${pattern},last_name.ilike.${pattern}`)
      .limit(10),
    supabase
      .from("jobs")
      .select("id, title, location")
      .eq("organization_id", ctx.organizationId)
      .ilike("title", pattern)
      .limit(10),
    supabase
      .from("candidates")
      .select("id, first_name, last_name, current_title")
      .eq("organization_id", ctx.organizationId)
      .or(`first_name.ilike.${pattern},last_name.ilike.${pattern},current_title.ilike.${pattern}`)
      .limit(10)
  ]);

  const results: SearchResult[] = [];
  for (const company of companies.data ?? []) {
    results.push({ entityType: "company", id: company.id, title: company.name, subtitle: company.industry, href: `/companies/${company.id}` });
  }
  for (const contact of contacts.data ?? []) {
    results.push({
      entityType: "contact",
      id: contact.id,
      title: `${contact.first_name} ${contact.last_name}`,
      subtitle: contact.title,
      href: `/contacts/${contact.id}`
    });
  }
  for (const job of jobs.data ?? []) {
    results.push({ entityType: "job", id: job.id, title: job.title, subtitle: job.location, href: `/jobs/${job.id}` });
  }
  for (const candidate of candidates.data ?? []) {
    results.push({
      entityType: "candidate",
      id: candidate.id,
      title: `${candidate.first_name} ${candidate.last_name}`,
      subtitle: candidate.current_title,
      href: `/candidates/${candidate.id}`
    });
  }

  return results;
}
