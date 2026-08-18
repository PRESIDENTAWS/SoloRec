import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

/**
 * Recruiter / Admin operating system.
 *
 * Everything under this route group is the authenticated recruiter OS and is
 * wrapped in the full AppShell (sidebar + topbar). The route group `(os)` keeps
 * these URLs unchanged (/dashboard, /jobs, /job-intelligence, …) while letting
 * the public site, login, and the client/candidate portals live outside the
 * recruiter chrome.
 */
export default function OsLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
