"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Genuinely reflects whether the browser has a live Supabase Realtime
 * connection — not a hardcoded "Live" dot. Opens (and immediately closes on
 * unmount) a lightweight channel purely to observe SUBSCRIBED status; the
 * actual data subscriptions live in useAgentActivity.
 */
export function LiveBadge() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      // NEXT_PUBLIC_SUPABASE_URL/ANON_KEY not configured — stay in Demo state.
      return;
    }

    const channel = supabase.channel("connection-status").subscribe((status) => {
      if (mounted) setConnected(status === "SUBSCRIBED");
    });

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <span
      className={
        connected
          ? "inline-flex items-center gap-1.5 rounded-full border border-status-healthy/30 bg-status-healthy/10 px-3 py-1 text-xs font-semibold text-status-healthy"
          : "inline-flex items-center gap-1.5 rounded-full border border-base-line bg-base-panel2 px-3 py-1 text-xs font-semibold text-slate-500"
      }
    >
      <span
        className={connected ? "h-1.5 w-1.5 rounded-full bg-status-healthy" : "h-1.5 w-1.5 rounded-full bg-slate-500"}
        aria-hidden="true"
      />
      {connected ? "Live" : "Demo"}
    </span>
  );
}
