import { sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { db } from "./client";
import type * as schema from "./schema";

type Schema = typeof schema;
type Tx = PostgresJsDatabase<Schema>;

/**
 * Runs `fn` inside a transaction with `app.current_org_id` set for the
 * duration of that transaction, so every RLS policy in schema.ts scopes to
 * this org — see docs/adr/ADR-002-multi-tenancy-strategy.md. Domain
 * services must call mutating/reading queries through this, never a bare
 * `db.transaction` or `db.select`, so Layer 2 tenant isolation actually
 * applies (Layer 1 — passing the right organizationId in the first place —
 * is the caller's responsibility, enforced by ctx resolution middleware).
 *
 * Uses `set_config(...)` (a parameterized function call) rather than a
 * string-interpolated `SET LOCAL app.current_org_id = '...'` statement, so
 * organizationId is bound as a query parameter, not concatenated into SQL.
 */
export async function withOrgContext<T>(
  organizationId: string,
  fn: (tx: Tx) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.current_org_id', ${organizationId}, true)`);
    // The transaction callback's `tx` has a slightly different static type
    // (PgTransaction) than the top-level `db` (PostgresJsDatabase), but the
    // same query-builder surface domain services actually use (select,
    // insert, update, delete, execute) — safe to treat as `Tx` here.
    return fn(tx as unknown as Tx);
  });
}
