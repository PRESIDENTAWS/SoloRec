import { z } from "zod";

/**
 * Centralized, validated environment access. Two schemas, deliberately kept
 * separate: `clientEnv` covers only `NEXT_PUBLIC_*` variables Next.js
 * inlines into the browser bundle at build time; `serverEnv` covers
 * everything else and must never be imported from a "use client" module —
 * that's a convention enforced by code review here, not the compiler,
 * since Next.js will happily inline anything referenced from client code.
 *
 * Import `clientEnv` from client components. Import `serverEnv` only from
 * Server Components, Server Actions, Route Handlers, and server/services
 * code.
 */

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, "NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_APP_URL: z.string().min(1).default("http://localhost:3000")
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  AI_PROVIDER: z.enum(["anthropic", "openai"]).default("anthropic"),
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional()
});

function parseClientEnv() {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  });
  if (!parsed.success) {
    throw new Error(
      `Invalid client environment configuration:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")}\nCopy .env.example to .env.local and fill in your Supabase project values.`
    );
  }
  return parsed.data;
}

function parseServerEnv() {
  const parsed = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    AI_PROVIDER: process.env.AI_PROVIDER,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  });
  if (!parsed.success) {
    throw new Error(
      `Invalid server environment configuration:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`
    );
  }
  return parsed.data;
}

let cachedClientEnv: ReturnType<typeof parseClientEnv> | null = null;
let cachedServerEnv: ReturnType<typeof parseServerEnv> | null = null;

/** Safe to import from client components — only NEXT_PUBLIC_* values. */
export function getClientEnv() {
  if (!cachedClientEnv) cachedClientEnv = parseClientEnv();
  return cachedClientEnv;
}

/**
 * Server-only. Throws if imported/evaluated in a context missing these
 * variables — validated lazily (on first call, not on module import) so a
 * route that doesn't need them doesn't crash the build over an unrelated
 * missing var.
 */
export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must never be called from client-side code.");
  }
  if (!cachedServerEnv) cachedServerEnv = parseServerEnv();
  return cachedServerEnv;
}
