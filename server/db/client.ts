import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Schema = typeof schema;

let cached: PostgresJsDatabase<Schema> | null = null;

function getDb(): PostgresJsDatabase<Schema> {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and point it at your Supabase " +
        "connection string (Supabase project settings → Database → Connection string, transaction " +
        "pooler / port 6543) before using the database layer."
    );
  }

  // prepare: false — required for Supabase's pooled (Supavisor transaction-mode)
  // connection string, which does not support server-side prepared statements.
  const client = postgres(url, { prepare: false });
  cached = drizzle(client, { schema });
  return cached;
}

/**
 * Lazy singleton — safe to import anywhere (including at module scope in a
 * page or route handler) without throwing at import/build time. The error
 * above only fires the first time a query actually runs without
 * DATABASE_URL set, not when this module is merely imported.
 */
export const db: PostgresJsDatabase<Schema> = new Proxy({} as PostgresJsDatabase<Schema>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  }
});
