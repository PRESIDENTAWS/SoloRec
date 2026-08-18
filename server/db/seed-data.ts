/**
 * System role/permission catalog — the fixed data every organization needs
 * to exist before its first membership can be created. Not agency-specific
 * data (that's created per-org at signup time), so it lives as static data
 * here rather than a migration, and is applied by scripts/seed.ts.
 *
 * Six system roles per docs/architecture/03-security-and-tenancy.md#g-rbac-model.
 * Permission keys are the resource:action strings domain services check via
 * requirePermission(ctx, "...") — this list will grow as each domain
 * service lands; it is not meant to be exhaustive yet.
 */

export const SYSTEM_ROLES = [
  { key: "owner", name: "Owner" },
  { key: "admin", name: "Admin" },
  { key: "recruiter", name: "Recruiter" },
  { key: "sales", name: "Sales" },
  { key: "coordinator", name: "Coordinator" },
  { key: "finance", name: "Finance" }
] as const;

export const PERMISSIONS = [
  { key: "client:read", description: "View client and contact records" },
  { key: "client:write", description: "Create and edit client and contact records" },
  { key: "job:read", description: "View job requisitions" },
  { key: "job:write", description: "Create and edit job requisitions" },
  { key: "job:approve", description: "Approve a job for sourcing" },
  { key: "candidate:read", description: "View candidate records" },
  { key: "candidate:read_pii", description: "View candidate contact info and other sensitive fields" },
  { key: "candidate:write", description: "Create and edit candidate records" },
  { key: "submission:approve", description: "Approve an AI-drafted or recruiter-drafted submission" },
  { key: "invoice:read", description: "View invoices and payments" },
  { key: "invoice:write", description: "Create and edit invoices and payments" },
  { key: "approval_request:decide", description: "Approve or reject a pending AI approval request" },
  { key: "org:manage_members", description: "Invite, remove, and change the role of organization members" }
] as const;

/**
 * Role -> permission key grants for the six system roles. FINANCE and
 * COORDINATOR are intentionally narrow per the RBAC design; OWNER/ADMIN get
 * everything current-permission-catalog has to offer.
 */
export const ROLE_PERMISSION_GRANTS: Record<(typeof SYSTEM_ROLES)[number]["key"], string[]> = {
  owner: PERMISSIONS.map((p) => p.key),
  admin: PERMISSIONS.map((p) => p.key).filter((key) => key !== "org:manage_members"),
  recruiter: [
    "client:read",
    "job:read",
    "job:write",
    "candidate:read",
    "candidate:read_pii",
    "candidate:write",
    "submission:approve"
  ],
  sales: ["client:read", "client:write", "job:read", "candidate:read"],
  coordinator: ["client:read", "job:read", "candidate:read", "submission:approve"],
  finance: ["invoice:read", "invoice:write", "client:read"]
};
