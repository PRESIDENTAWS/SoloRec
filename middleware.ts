import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Every application route requires auth except the marketing/auth pages
 * themselves. Listed explicitly (not inferred) so a new route is
 * protected-by-default only if added here — the safer failure mode for a
 * multi-tenant product is an accidentally-protected page, not an
 * accidentally-public one, so this list is deliberately broad.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/jobs",
  "/candidates",
  "/pipeline",
  "/companies",
  "/contacts",
  "/clients",
  "/tasks",
  "/calendar",
  "/finance",
  "/reports",
  "/settings",
  "/search",
  "/ai-hq",
  "/portal"
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  if (isProtectedPath(request.nextUrl.pathname) && !user) {
    // Send portal visitors to the matching portal login; everyone else to
    // the recruiter login.
    const pathname = request.nextUrl.pathname;
    let loginPath = "/login";
    if (pathname.startsWith("/portal/client")) loginPath = "/login/client";
    else if (pathname.startsWith("/portal/candidate")) loginPath = "/login/candidate";

    const redirectUrl = new URL(loginPath, request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
