import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getClientEnv, getServerEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Service-role Supabase client — bypasses RLS entirely. The `server-only`
 * import above makes bundling this into a client component a Next.js BUILD
 * ERROR, not just a code-review convention.
 *
 * Use only for operations that must legitimately cross tenant boundaries
 * (e.g. the invite-acceptance flow looking up a pending invite before the
 * invitee has an organization_memberships row yet) or admin/background
 * jobs. Domain services scoped to one organization should use
 * lib/supabase/server.ts instead, so RLS stays the enforced boundary.
 */
let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createAdminClient() {
  if (cached) return cached;
  const clientEnv = getClientEnv();
  const serverEnv = getServerEnv();
  cached = createSupabaseClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  return cached;
}
