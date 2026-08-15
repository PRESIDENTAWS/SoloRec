import { ServiceError } from "@/lib/errors";

/**
 * Shared catch-block helper for Server Actions: turns a known ServiceError
 * into a safe client-facing message, and re-throws anything else (a raw
 * Postgres error, a bug, or — critically — Next's internal redirect/notFound
 * signal, which is also thrown and must keep propagating).
 */
export function toActionError(err: unknown): string {
  if (err instanceof ServiceError) return err.message;
  throw err;
}
