/**
 * Identity & role-based access.
 *
 * SoloRec is one identity system with role-based access — not three unrelated
 * auth systems. A single `user` row carries a `role`; the role decides which
 * portal the user lands in after login and which experience they get.
 *
 * This is distinct from the recruiter-org-internal `UserRole`
 * (owner/admin/recruiter/sales/… in types/user.ts), which scopes permissions
 * *inside* the recruiter OS. `PortalRole` is the coarser, product-level axis
 * that separates the recruiter OS, the client portal and the candidate portal.
 */

export type PortalRole = "admin" | "recruiter" | "client" | "candidate";

/** Where each role is sent after authenticating. */
export const ROLE_HOME: Record<PortalRole, string> = {
  admin: "/dashboard",
  recruiter: "/dashboard",
  client: "/client",
  candidate: "/candidate"
};

export function roleHome(role: PortalRole): string {
  return ROLE_HOME[role];
}

/** Route prefixes each role is allowed into. Admin/recruiter share the OS. */
export const ROLE_ALLOWED_PREFIXES: Record<PortalRole, string[]> = {
  admin: ["/dashboard", "/jobs", "/candidates", "/pipeline", "/companies", "/contacts", "/search", "/tasks", "/calendar", "/finance", "/reports", "/ai-hq", "/job-intelligence", "/settings"],
  recruiter: ["/dashboard", "/jobs", "/candidates", "/pipeline", "/companies", "/contacts", "/search", "/tasks", "/calendar", "/finance", "/reports", "/ai-hq", "/job-intelligence", "/settings"],
  client: ["/client"],
  candidate: ["/candidate"]
};

export interface PortalRoleMeta {
  role: PortalRole;
  label: string;
  description: string;
}

/** The three login lanes shown on /login (admin logs in as recruiter). */
export const LOGIN_LANES: PortalRoleMeta[] = [
  {
    role: "recruiter",
    label: "Recruiter / Agency",
    description: "The full staffing operating system — sourcing, pipeline, BD, AI workforce."
  },
  {
    role: "client",
    label: "Client",
    description: "Track requisitions, review candidate submittals, approve offers, view invoices."
  },
  {
    role: "candidate",
    label: "Candidate",
    description: "See job matches, application status, interviews, messages and documents."
  }
];
