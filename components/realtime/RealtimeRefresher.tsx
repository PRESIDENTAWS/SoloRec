"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Subscribes to Postgres changes on the three tables that drive AI HQ's
 * live state (agent_tasks, agent_events, approvals) for the current org,
 * and refreshes the current Server Component tree on any change — this is
 * what makes "AI HQ updates based on real backend state" (no polling, no
 * hard-coded animation). Renders nothing; mounted once in app/(app)/layout.tsx
 * so it's active across every authenticated route.
 */
export function RealtimeRefresher({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      return; // Supabase not configured — nothing to subscribe to.
    }

    function scheduleRefresh() {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => router.refresh(), 400);
    }

    const channel = supabase
      .channel(`org-activity-${organizationId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agent_tasks", filter: `organization_id=eq.${organizationId}` },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agent_events", filter: `organization_id=eq.${organizationId}` },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "approvals", filter: `organization_id=eq.${organizationId}` },
        scheduleRefresh
      )
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [organizationId, router]);

  return null;
}
