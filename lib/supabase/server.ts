import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getClientEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Supabase client for Server Components, Server Actions, and Route
 * Handlers — reads the session from request cookies (anon key; RLS still
 * applies per-user via the user's JWT, this is not the admin client).
 *
 * `setAll` is wrapped in try/catch because Server Components can't write
 * cookies — the middleware (lib/supabase/middleware.ts) is what actually
 * refreshes the session cookie on each request. Ignoring the error here is
 * safe precisely because that refresh already happened upstream.
 */
export function createClient() {
  const cookieStore = cookies();
  const env = getClientEnv();

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component render — no-op, see doc comment above.
        }
      }
    }
  });
}
