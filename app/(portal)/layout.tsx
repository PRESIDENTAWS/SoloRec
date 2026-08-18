import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/SignOutButton";

/**
 * Portal shell for external users (clients, candidates). Deliberately does
 * NOT use getRequestContext()/AppShell — those are for recruiters/agency
 * members and would auto-create an organization. Portal users only need a
 * valid Supabase Auth session; middleware.ts guards the /portal prefix, and
 * this re-verifies as defense-in-depth.
 */
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login/candidate");
  }

  return (
    <div className="min-h-screen bg-base-bg text-slate-100">
      <header className="border-b border-white/5 bg-base-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple text-white">
              <Sparkles size={16} aria-hidden="true" />
            </span>
            <span className="text-lg font-bold text-slate-50">SoloRec</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:inline">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
