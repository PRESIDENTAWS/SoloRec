import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureOrganizationForUser } from "@/lib/auth/bootstrap";

export type RequestContext = {
  userId: string;
  organizationId: string;
  role: string;
};

/**
 * Resolves the authenticated request's tenant context. This is the ONLY
 * sanctioned way a domain service learns which organization it's scoped
 * to — organizationId is never accepted as a client-supplied parameter for
 * query scoping (see docs/architecture/03-security-and-tenancy.md). Every
 * Server Component page and Server Action under app/(app)/ calls this
 * first, before doing anything else.
 *
 * Re-verifies auth via supabase.auth.getUser() rather than trusting
 * middleware alone — middleware.ts already redirects unauthenticated
 * requests, but Server Components must not rely solely on that (a
 * defense-in-depth practice Supabase's own docs call out explicitly).
 */
export async function getRequestContext(): Promise<RequestContext> {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const membership = await ensureOrganizationForUser(user.id);

  return {
    userId: user.id,
    organizationId: membership.organization_id,
    role: membership.role
  };
}
