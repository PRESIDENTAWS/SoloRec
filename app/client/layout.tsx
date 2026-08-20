import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/PortalShell";

/**
 * Client portal. Turns SoloRec from internal agency software into a
 * customer-facing platform: a client tracks requisitions, reviews submittals,
 * advances or rejects candidates, schedules interviews, approves offers and
 * sees invoices — all self-serve.
 */
export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <PortalShell
      brand="SoloRec — Client"
      subtitle="Client Portal"
      variant="client"
      user={{ name: "Jordan Blake", contextLabel: "Meridian Robotics · Talent Acquisition" }}
    >
      {children}
    </PortalShell>
  );
}
