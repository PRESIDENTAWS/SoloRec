import type { Config } from "drizzle-kit";

/**
 * `drizzle-kit generate` only introspects server/db/schema.ts and diffs it
 * against /drizzle — it does not need a live DATABASE_URL. `drizzle-kit
 * migrate`/`studio` do, and read it from the environment at run time.
 */
export default {
  schema: "./server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? ""
  }
} satisfies Config;
