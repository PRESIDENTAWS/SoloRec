import "server-only";
import { createClient } from "@/lib/supabase/server";
import { ForbiddenError } from "@/lib/errors";
import type { RequestContext } from "@/lib/auth/context";

/**
 * Mirrors the permission catalog seeded in
 * supabase/migrations/20260815000005_system_role_permission_seed.sql —
 * kept here as a type so callers get autocomplete/typos-as-compile-errors,
 * while the actual grants (which role has which permission) live in the
 * database as the source of truth, not duplicated in this file.
 */
export type PermissionKey =
  | "candidate:read"
  | "candidate:create"
  | "candidate:update"
  | "candidate:read_pii"
  | "job:read"
  | "job:create"
  | "job:update"
  | "job:close"
  | "client:read"
  | "client:create"
  | "client:update"
  | "submission:create"
  | "submission:approve"
  | "approval:decide"
  | "finance:read"
  | "invoice:create"
  | "org:manage_members";

export async function hasPermission(ctx: RequestContext, permission: PermissionKey): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("role_permissions")
    .select("permissions!inner(key)")
    .eq("role_key", ctx.role)
    .eq("permissions.key", permission)
    .limit(1);

  if (error) {
    throw new Error(`Failed to check permission '${permission}': ${error.message}`);
  }
  return (data?.length ?? 0) > 0;
}

/**
 * Centralized authorization gate — every domain service mutation (and any
 * read of sensitive fields, e.g. candidate:read_pii) calls this before
 * doing anything else. Throws ForbiddenError rather than returning a
 * boolean so a forgotten check fails loudly instead of silently proceeding.
 */
export async function requirePermission(ctx: RequestContext, permission: PermissionKey): Promise<void> {
  const granted = await hasPermission(ctx, permission);
  if (!granted) {
    throw new ForbiddenError(`Your role ('${ctx.role}') doesn't include '${permission}'.`);
  }
}
