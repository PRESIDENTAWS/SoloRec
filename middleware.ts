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
  "/ai-hq"
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  if (isProtectedPath(request.nextUrl.pathname) && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
