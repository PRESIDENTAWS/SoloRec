import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getClientEnv } from "@/lib/env";

/**
 * Refreshes the Supabase auth session cookie on every request (access
 * tokens are short-lived; this is what keeps a logged-in user logged in
 * across requests without the client ever having to notice). Called from
 * the root middleware.ts, which also uses the returned `user` to decide
 * whether to redirect unauthenticated requests away from protected routes.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = getClientEnv();

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  // Must call getUser() (not getSession()) — it validates the token against
  // Supabase's server rather than trusting whatever is in the cookie.
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { response, user };
}
