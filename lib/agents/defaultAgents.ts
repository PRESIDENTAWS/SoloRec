/**
 * Seed content for a brand-new organization's agent registry. Deliberately
 * has no "server-only" import and no dependency on Next.js-specific code —
 * used by both lib/auth/bootstrap.ts (server-only, runs inside Next) and
 * scripts/seed.ts (a plain Node script run via tsx, outside Next's bundler,
 * where "server-only"'s unconditional throw would otherwise fire).
 */
export const DEFAULT_AGENTS = [
  { agent_key: "orion", name: "ORION", role: "AI COO / Executive Intelligence", department: "Executive Intelligence", autonomy_level: 4 },
  { agent_key: "ava", name: "AVA", role: "Lead Sourcing Agent", department: "Talent Lab", autonomy_level: 3 },
  { agent_key: "milo", name: "MILO", role: "Recruiting Agent", department: "Recruiting", autonomy_level: 2 },
  { agent_key: "luna", name: "LUNA", role: "Matching Agent", department: "Candidate Intelligence", autonomy_level: 3 },
  { agent_key: "echo", name: "ECHO", role: "Compliance Agent", department: "Compliance", autonomy_level: 2 },
  { agent_key: "spark", name: "SPARK", role: "Business Development Agent", department: "Revenue", autonomy_level: 3 },
  { agent_key: "nova", name: "NOVA", role: "Client Success Agent", department: "Client Success", autonomy_level: 2 },
  { agent_key: "fin", name: "FIN", role: "Finance Agent", department: "Finance", autonomy_level: 2 },
  { agent_key: "guard", name: "GUARD", role: "Legal & Risk Agent", department: "Legal / Risk", autonomy_level: 1 }
] as const;
