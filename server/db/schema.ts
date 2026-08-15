import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

/**
 * Sprint 1 — Platform Foundation schema. Covers Identity & Tenancy only, per
 * docs/architecture/02-data-model.md and docs/adr/ADR-002-multi-tenancy-strategy.md.
 *
 * Every tenant-scoped table enables Postgres Row-Level Security and carries a
 * policy against a session-local `app.current_org_id` setting, applied via
 * `set_config` inside the same transaction as each request — see
 * server/db/context.ts (withOrgContext). This is Layer 2 of the two-layer
 * isolation model; Layer 1 (application-scoped ctx.organizationId on every
 * domain service call) is enforced in server/domain/*, not here — see
 * docs/architecture/03-security-and-tenancy.md.
 */

export const organizationStatusEnum = pgEnum("organization_status", ["active", "suspended"]);
export const planTierEnum = pgEnum("plan_tier", ["starter", "growth", "agency", "enterprise"]);
export const membershipStatusEnum = pgEnum("membership_status", [
  "invited",
  "active",
  "suspended",
  "removed"
]);

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    status: organizationStatusEnum("status").notNull().default("active"),
    planTier: planTierEnum("plan_tier").notNull().default("starter"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("organizations_slug_idx").on(table.slug),
    pgPolicy("tenant_isolation", {
      for: "all",
      to: "public",
      using: sql`${table.id} = current_setting('app.current_org_id', true)::uuid`
    })
  ]
).enableRLS();

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    avatarUrl: text("avatar_url"),
    // Clerk user id (ADR-008) — nullable until the invite/signup sync writes it.
    authProviderId: text("auth_provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    uniqueIndex("users_auth_provider_id_idx").on(table.authProviderId)
  ]
);
// Deliberately no RLS: `users` carries no organization_id (a user can belong
// to multiple orgs via organization_memberships), and Clerk — not Supabase
// Auth — is the identity provider, so there's no auth.uid() to key a policy
// off. Cross-org row visibility is enforced at the application layer
// (Layer 1) via organization_memberships joins for now; a join-based RLS
// policy is a Sprint 2+ item once it's worth the added complexity.

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Null organizationId = system role (OWNER/ADMIN/RECRUITER/SALES/COORDINATOR/FINANCE).
    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    name: text("name").notNull(),
    isSystem: boolean("is_system").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("roles_org_key_idx").on(table.organizationId, table.key),
    // Postgres unique indexes treat NULL as distinct, so the composite
    // index above does NOT stop duplicate system roles (organization_id IS
    // NULL) with the same key — a separate partial unique index is needed
    // for that case specifically.
    uniqueIndex("roles_system_key_idx")
      .on(table.key)
      .where(sql`${table.organizationId} is null`),
    pgPolicy("system_or_own_org_roles", {
      for: "all",
      to: "public",
      using: sql`${table.organizationId} is null or ${table.organizationId} = current_setting('app.current_org_id', true)::uuid`
    })
  ]
).enableRLS();

export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    description: text("description").notNull()
  },
  (table) => [uniqueIndex("permissions_key_idx").on(table.key)]
);
// Global reference catalog — no organization_id, no RLS. See the
// global-taxonomy carve-out in docs/architecture/03-security-and-tenancy.md.

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" })
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })]
);

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    status: membershipStatusEnum("status").notNull().default("invited"),
    invitedByUserId: uuid("invited_by_user_id").references(() => users.id),
    invitedAt: timestamp("invited_at", { withTimezone: true }).notNull().defaultNow(),
    joinedAt: timestamp("joined_at", { withTimezone: true })
  },
  (table) => [
    uniqueIndex("org_memberships_org_user_idx").on(table.organizationId, table.userId),
    index("org_memberships_user_idx").on(table.userId),
    pgPolicy("tenant_isolation", {
      for: "all",
      to: "public",
      using: sql`${table.organizationId} = current_setting('app.current_org_id', true)::uuid`
    })
  ]
).enableRLS();
