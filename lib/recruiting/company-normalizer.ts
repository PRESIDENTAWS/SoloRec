/**
 * Company name / domain normalization.
 *
 * Two sources rarely spell a company identically ("Lockheed Martin",
 * "Lockheed Martin Corporation", "LOCKHEED MARTIN"). Normalizing to a stable
 * key lets deduplication and company roll-ups treat them as one account.
 */

/** Legal suffixes stripped when deriving a company key. */
const COMPANY_SUFFIXES = [
  "inc",
  "incorporated",
  "corp",
  "corporation",
  "co",
  "company",
  "llc",
  "llp",
  "ltd",
  "limited",
  "plc",
  "gmbh",
  "sa",
  "ag",
  "group",
  "holdings",
  "technologies",
  "labs"
];

/** Lowercased, punctuation-free, suffix-free key for matching a company. */
export function companyKey(name: string): string {
  const cleaned = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = cleaned.split(" ").filter((t) => t.length > 0 && !COMPANY_SUFFIXES.includes(t));
  return (tokens.length > 0 ? tokens : cleaned.split(" ")).join(" ");
}

/** Normalize a raw domain: strip scheme, path, and a leading `www.`. */
export function normalizeDomain(domain?: string): string | undefined {
  if (!domain) return undefined;
  const cleaned = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
  return cleaned && cleaned.includes(".") ? cleaned : undefined;
}

/**
 * Preferred identity for a company: its normalized domain when present
 * (domains are far more stable than display names), else its name key.
 */
export function companyIdentity(name: string, domain?: string): string {
  return normalizeDomain(domain) ?? companyKey(name);
}
