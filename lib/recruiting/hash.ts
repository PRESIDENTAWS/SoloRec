/**
 * Tiny, dependency-free, browser-safe string hash (FNV-1a, 32-bit, hex).
 *
 * Used for content fingerprints and snapshot description hashes. This is not a
 * cryptographic hash — it exists only to give stable, comparable identities to
 * normalized strings without pulling in `crypto` (which would tie this logic to
 * a Node runtime; lib/recruiting is imported from client components too).
 */
export function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // hash *= 16777619, kept in 32-bit range via Math.imul.
    hash = Math.imul(hash, 0x01000193);
  }
  // Coerce to unsigned and hex-encode.
  return (hash >>> 0).toString(16).padStart(8, "0");
}
