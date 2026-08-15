import { AppShell } from "@/components/layout/AppShell";
import { RealtimeRefresher } from "@/components/realtime/RealtimeRefresher";
import { getRequestContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";

/**
 * Every route under this group requires auth — middleware.ts redirects
 * unauthenticated requests before this even renders, and getRequestContext()
 * re-verifies + resolves the tenant (creating an organization on first
 * login if needed). Domain services never run without a resolved ctx.
 */
export default async function AuthenticatedAppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getRequestContext();
  const supabase = createClient();

  const [{ data: org }, { data: profile }] = await Promise.all([
    supabase.from("organizations").select("name").eq("id", ctx.organizationId).single(),
    supabase.from("profiles").select("first_name, last_name").eq("id", ctx.userId).single()
  ]);

  const userName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Account";

  return (
    <AppShell orgName={org?.name ?? "SoloRec"} userName={userName}>
      <RealtimeRefresher organizationId={ctx.organizationId} />
      {children}
    </AppShell>
  );
}
