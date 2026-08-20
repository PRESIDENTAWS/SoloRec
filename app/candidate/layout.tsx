import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/PortalShell";

/**
 * Candidate portal. A completely different experience from the recruiter OS and
 * client portal: candidates see their own job matches, applications, interviews,
 * messages, documents and offers — never internal recruiter notes, margin,
 * client fees, BD intelligence, other candidates, or internal scoring logic.
 */
export default function CandidateLayout({ children }: { children: ReactNode }) {
  return (
    <PortalShell
      brand="SoloRec — Candidate"
      subtitle="Candidate Portal"
      variant="candidate"
      user={{ name: "Sam Rivera", contextLabel: "Senior DevOps Engineer · Atlanta, GA" }}
    >
      {children}
    </PortalShell>
  );
}
