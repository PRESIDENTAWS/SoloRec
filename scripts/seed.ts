/**
 * Seeds the system role/permission catalog — required once, before any
 * organization's first membership can reference a role. Idempotent: safe
 * to re-run (uses onConflictDoNothing against the same unique indexes
 * defined in server/db/schema.ts).
 *
 * Usage: DATABASE_URL=... npx tsx scripts/seed.ts
 */
import { eq, isNull } from "drizzle-orm";
import { db } from "../server/db/client";
import { permissions, rolePermissions, roles } from "../server/db/schema";
import { PERMISSIONS, ROLE_PERMISSION_GRANTS, SYSTEM_ROLES } from "../server/db/seed-data";

async function main() {
  console.log("Seeding permissions...");
  await db
    .insert(permissions)
    .values(PERMISSIONS.map((p) => ({ key: p.key, description: p.description })))
    .onConflictDoNothing({ target: permissions.key });

  console.log("Seeding system roles...");
  await db
    .insert(roles)
    .values(SYSTEM_ROLES.map((role) => ({ key: role.key, name: role.name, isSystem: true })))
    // Matches the partial unique index roles_system_key_idx (key WHERE
    // organization_id IS NULL) — `where` must match a real index's
    // predicate for Postgres to accept it as the ON CONFLICT arbiter.
    .onConflictDoNothing({ target: roles.key, where: isNull(roles.organizationId) });

  const allRoles = await db.select().from(roles).where(eq(roles.isSystem, true));
  const allPermissions = await db.select().from(permissions);
  const permissionIdByKey = new Map(allPermissions.map((p) => [p.key, p.id]));

  console.log("Seeding role -> permission grants...");
  for (const role of allRoles) {
    const grantKeys = ROLE_PERMISSION_GRANTS[role.key as keyof typeof ROLE_PERMISSION_GRANTS];
    if (!grantKeys) continue;

    const grants = grantKeys
      .map((key) => permissionIdByKey.get(key))
      .filter((id): id is string => Boolean(id))
      .map((permissionId) => ({ roleId: role.id, permissionId }));

    if (grants.length > 0) {
      await db.insert(rolePermissions).values(grants).onConflictDoNothing();
    }
  }

  console.log(`Done. ${allRoles.length} system roles, ${allPermissions.length} permissions.`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
