import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_AGENTS } from "@/lib/agents/defaultAgents";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface ActiveMembership {
  organization_id: string;
  role: string;
}

/**
 * Returns the caller's active organization membership, creating a new
 * organization (+ OWNER membership + default agent registry) on first
 * login if none exists yet. Uses the service-role client deliberately: at
 * the moment a brand-new user has zero memberships, RLS's
 * user_organization_ids() returns an empty set, so the normal per-user
 * client could not create the very first organization/membership row for
 * them — this is the one legitimate cross-tenant-boundary operation in the
 * app, and it's the only thing this function does.
 *
 * MVP supports exactly one active organization per user (per the sprint
 * scope) — this returns the first active membership found, not a list.
 */
export async function ensureOrganizationForUser(
  userId: string,
  opts: { organizationName?: string } = {}
): Promise<ActiveMembership> {
  const admin = createAdminClient();

  const { data: existing, error: lookupError } = await admin
    .from("organization_memberships")
    .select("organization_id, role")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Failed to look up organization membership: ${lookupError.message}`);
  }
  if (existing) {
    return existing as ActiveMembership;
  }

  const orgName = opts.organizationName?.trim() || "My Agency";
  const slug = `${slugify(orgName)}-${userId.slice(0, 8)}`;

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: orgName, slug })
    .select("id")
    .single();
  if (orgError || !org) {
    throw new Error(`Failed to create organization: ${orgError?.message ?? "unknown error"}`);
  }

  const { error: membershipError } = await admin.from("organization_memberships").insert({
    organization_id: org.id,
    user_id: userId,
    role: "owner",
    status: "active"
  });
  if (membershipError) {
    throw new Error(`Failed to create organization membership: ${membershipError.message}`);
  }

  await seedDefaultAgentsForOrganization(org.id);

  return { organization_id: org.id, role: "owner" };
}

/** Idempotent — safe to call more than once for the same organization. */
export async function seedDefaultAgentsForOrganization(organizationId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("agents")
    .upsert(
      DEFAULT_AGENTS.map((agent) => ({
        organization_id: organizationId,
        agent_key: agent.agent_key,
        name: agent.name,
        role: agent.role,
        department: agent.department,
        status: "idle" as const,
        autonomy_level: agent.autonomy_level,
        health: 100,
        configuration: {}
      })),
      { onConflict: "organization_id,agent_key", ignoreDuplicates: true }
    );
  if (error) {
    throw new Error(`Failed to seed default agents: ${error.message}`);
  }
}
