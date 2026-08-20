import type { NormalizedJob } from "@/types";
import { fnv1a } from "@/lib/recruiting/hash";
import { normalizeJob } from "@/lib/recruiting/job-normalizer";

/**
 * Job fingerprinting — the identity function behind "these listings are the
 * same opportunity". A LinkedIn post, an Indeed post and a Greenhouse req for
 * the same Senior Cybersecurity Engineer role at the same company in the same
 * metro collapse to one fingerprint, and therefore one canonical job.
 *
 * The fingerprint deliberately excludes the source and external id (those vary
 * per listing) and normalizes the location to its metro token so "Orlando, FL"
 * and "Orlando" match.
 */

function locationKey(location?: string): string {
  if (!location) return "";
  // First segment before a comma is the city/metro; drop state/country noise.
  const primary = location.split(",")[0] ?? location;
  return primary
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/** Stable content fingerprint for a raw source job. */
export function fingerprintJob(job: NormalizedJob): string {
  const core = normalizeJob(job);
  const material = [core.companyIdentity, core.normalizedTitle, locationKey(core.location)].join("|");
  return fnv1a(material);
}

/** Hash of a job description, for snapshot diffing / repost detection. */
export function descriptionHash(description: string): string {
  const normalized = description.toLowerCase().replace(/\s+/g, " ").trim();
  return fnv1a(normalized);
}
