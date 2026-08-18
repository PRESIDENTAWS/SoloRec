/**
 * Seeds a demo organization ("SoloRec Demo Agency") with companies, one
 * open job, 11 realistic candidates with varying skills/location/
 * experience/salary, and the standard 9-agent registry.
 *
 * Deliberately does NOT import anything from lib/supabase/admin.ts or
 * other "server-only"-guarded modules: the `server-only` package throws
 * unconditionally outside Next's bundler (only Next's webpack/turbopack
 * understand its `react-server` export condition), so this plain Node
 * script builds its own Supabase admin client directly.
 *
 * Usage (env vars must already be exported in your shell):
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run db:seed
 *
 * Idempotent — safe to re-run; finds the existing demo org/company/
 * candidate rows by name rather than duplicating them.
 *
 * Known limitation: this seeds organization-level data only. It does not
 * create a Supabase Auth user or an organization_memberships row, since
 * auth users must go through the real signup flow (or the Supabase Admin
 * API) — see docs/PRODUCT_ARCHITECTURE.md. To explore this seeded data as
 * a real user, sign up normally, then add yourself to this organization's
 * organization_memberships (via SQL or the Supabase dashboard) instead of
 * relying on the one-org-per-signup bootstrap.
 */
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_AGENTS } from "../lib/agents/defaultAgents";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment.");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const DEMO_ORG_SLUG = "solorec-demo-agency";

const COMPANIES = [
  { name: "Acme Technologies", industry: "Manufacturing", headquarters: "Atlanta, GA", employee_count: 850 },
  { name: "Northstar Group", industry: "Financial Services", headquarters: "Atlanta, GA", employee_count: 1200 },
  { name: "Vertex Systems", industry: "Software", headquarters: "Remote", employee_count: 340 }
];

const CANDIDATES = [
  { first_name: "Marcus", last_name: "Reed", current_title: "Sr. Network Engineer", current_company: "ABC Manufacturing", location: "Atlanta, GA", years_experience: 9, salary_expectation: 148000, skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"], summary: "Deep infra automation background, led migration to EKS." },
  { first_name: "Priya", last_name: "Natarajan", current_title: "DevOps Team Lead", current_company: "Meridian Cloud", location: "Atlanta, GA", years_experience: 11, salary_expectation: 162000, skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"], summary: "Leads a 6-person platform team, strong Terraform module design." },
  { first_name: "Danielle", last_name: "Brooks", current_title: "Controls Engineer", current_company: "ABC Manufacturing", location: "Marietta, GA", years_experience: 7, salary_expectation: 139000, skills: ["AWS", "Kubernetes", "CI/CD"], summary: "Manufacturing automation background, moving into cloud infra." },
  { first_name: "Sarah", last_name: "Kim", current_title: "Site Reliability Engineer", current_company: "Vertex Systems", location: "Remote", years_experience: 6, salary_expectation: 145000, skills: ["AWS", "Kubernetes", "Terraform", "Docker"], summary: "SRE with on-call ownership of a 40-service mesh." },
  { first_name: "Trevor", last_name: "Nash", current_title: "Platform Engineer", current_company: "Innovatech", location: "Decatur, GA", years_experience: 8, salary_expectation: 134000, skills: ["AWS", "Kubernetes", "CI/CD"], summary: "Platform engineering, internal developer tooling." },
  { first_name: "Andre", last_name: "Collins", current_title: "Director, FP&A", current_company: "Northstar Group", location: "Atlanta, GA", years_experience: 13, salary_expectation: 171000, skills: ["Financial Modeling", "FP&A", "Excel"], summary: "Finance leader — a deliberately poor DevOps fit, to sanity-check low scores." },
  { first_name: "Jordan", last_name: "Smith", current_title: "DevOps Engineer", current_company: "CloudFirst", location: "Atlanta, GA", years_experience: 5, salary_expectation: 128000, skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Docker"], summary: "Strong hands-on Terraform and Kubernetes, early career high performer." },
  { first_name: "Ava", last_name: "Thompson", current_title: "Cloud Infrastructure Engineer", current_company: "Northstar Group", location: "Remote", years_experience: 4, salary_expectation: 118000, skills: ["AWS", "CI/CD"], summary: "Early-career, strong AWS fundamentals, less Kubernetes depth." },
  { first_name: "Michael", last_name: "Chen", current_title: "Senior DevOps Engineer", current_company: "Vertex Systems", location: "Atlanta, GA", years_experience: 10, salary_expectation: 158000, skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"], summary: "Near-perfect skill match, currently at a competitor." },
  { first_name: "Elena", last_name: "Vasquez", current_title: "Infrastructure Engineer", current_company: "DataForge", location: "Savannah, GA", years_experience: 6, salary_expectation: 205000, skills: ["AWS", "Kubernetes", "Terraform"], summary: "Strong skills but salary expectation well above typical budget." },
  { first_name: "Ben", last_name: "Okafor", current_title: "DevOps Engineer", current_company: "ScaleUp Inc", location: "Chicago, IL", years_experience: 5, salary_expectation: 130000, skills: ["AWS", "Kubernetes", "CI/CD"], summary: "Good technical fit, out of the target metro area." }
];

async function main() {
  console.log("Seeding demo organization...");
  const { data: existingOrg } = await admin.from("organizations").select("id").eq("slug", DEMO_ORG_SLUG).maybeSingle();
  let organizationId = existingOrg?.id as string | undefined;
  if (!organizationId) {
    const { data: created, error } = await admin
      .from("organizations")
      .insert({ name: "SoloRec Demo Agency", slug: DEMO_ORG_SLUG })
      .select("id")
      .single();
    if (error || !created) throw new Error(`Failed to create demo organization: ${error?.message}`);
    organizationId = created.id;
  }

  console.log("Seeding agents...");
  await admin.from("agents").upsert(
    DEFAULT_AGENTS.map((agent) => ({
      organization_id: organizationId as string,
      agent_key: agent.agent_key,
      name: agent.name,
      role: agent.role,
      department: agent.department,
      status: "idle",
      autonomy_level: agent.autonomy_level,
      health: 100,
      configuration: {}
    })),
    { onConflict: "organization_id,agent_key", ignoreDuplicates: true }
  );

  console.log("Seeding companies...");
  const companyIdByName: Record<string, string> = {};
  for (const company of COMPANIES) {
    const { data: existing } = await admin
      .from("companies")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("name", company.name)
      .maybeSingle();
    if (existing) {
      companyIdByName[company.name] = existing.id;
      continue;
    }
    const { data: created, error } = await admin
      .from("companies")
      .insert({ organization_id: organizationId as string, status: "active", ...company })
      .select("id")
      .single();
    if (error || !created) throw new Error(`Failed to create company ${company.name}: ${error?.message}`);
    companyIdByName[company.name] = created.id;
  }

  console.log("Seeding job...");
  const { data: existingJob } = await admin
    .from("jobs")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("title", "Senior DevOps Engineer")
    .maybeSingle();

  let jobId = existingJob?.id as string | undefined;
  if (!jobId) {
    const { data: job, error } = await admin
      .from("jobs")
      .insert({
        organization_id: organizationId as string,
        company_id: companyIdByName["Acme Technologies"],
        title: "Senior DevOps Engineer",
        location: "Atlanta, GA",
        workplace_type: "hybrid",
        employment_type: "direct_hire",
        requirements: "AWS\nKubernetes\nTerraform\nCI/CD",
        preferred_qualifications: "Docker\nPlatform engineering experience",
        salary_min: 130000,
        salary_max: 165000,
        currency: "USD",
        fee_percentage: 20,
        status: "open",
        priority: "high",
        opened_at: new Date().toISOString()
      })
      .select("id")
      .single();
    if (error || !job) throw new Error(`Failed to create job: ${error?.message}`);
    jobId = job.id;
  }

  console.log("Seeding candidates...");
  for (const candidate of CANDIDATES) {
    const { data: existing } = await admin
      .from("candidates")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("first_name", candidate.first_name)
      .eq("last_name", candidate.last_name)
      .maybeSingle();
    if (existing) continue;

    const { error } = await admin.from("candidates").insert({
      organization_id: organizationId as string,
      status: "active",
      currency: "USD",
      source: "seed",
      ...candidate
    });
    if (error) {
      throw new Error(`Failed to create candidate ${candidate.first_name} ${candidate.last_name}: ${error.message}`);
    }
  }

  console.log(`Done. organization_id=${organizationId} job_id=${jobId}`);
  console.log(
    "\nThis seeds organization-level data only — no auth user is created. To explore it as a real " +
      "user: sign up normally, then add yourself to this organization's organization_memberships row " +
      `(organization_id=${organizationId}) instead of relying on the default one-org-per-signup bootstrap.`
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
