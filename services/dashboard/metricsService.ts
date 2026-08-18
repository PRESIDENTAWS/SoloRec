import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { RequestContext } from "@/lib/auth/context";
import type { KpiDefinition } from "@/lib/data/mockKpis";

export interface DashboardMetrics {
  activeJobs: number;
  candidatesInPipeline: number;
  totalCandidates: number;
  weightedPipeline: number;
  placementsThisMonth: number;
  agentsActive: number;
  pendingApprovals: number;
}

/**
 * Every number here is a real aggregate query — no mock fallback. Where a
 * metric from the original UI mock (e.g. "Client Health") has no real
 * computation built yet, it's omitted entirely rather than shown with a
 * fabricated value — see docs/PRODUCT_ARCHITECTURE.md's "DEMO" labeling
 * rule.
 */
export async function getDashboardMetrics(ctx: RequestContext): Promise<DashboardMetrics> {
  const supabase = createClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { count: activeJobs },
    { count: candidatesInPipeline },
    { count: totalCandidates },
    { data: openJobs },
    { count: placementsThisMonth },
    { count: agentsActive },
    { count: pendingApprovals }
  ] = await Promise.all([
    supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId)
      .eq("status", "open"),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId),
    supabase
      .from("candidates")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId),
    supabase
      .from("jobs")
      .select("salary_min, salary_max, fee_percentage")
      .eq("organization_id", ctx.organizationId)
      .eq("status", "open"),
    supabase
      .from("placements")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId)
      .gte("start_date", startOfMonth.toISOString().slice(0, 10)),
    supabase
      .from("agents")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId),
    supabase
      .from("approvals")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId)
      .eq("status", "pending")
  ]);

  const weightedPipeline = (openJobs ?? []).reduce((sum, job) => {
    if (!job.fee_percentage) return sum;
    const salaryEstimate = ((job.salary_min ?? 0) + (job.salary_max ?? job.salary_min ?? 0)) / 2;
    return sum + salaryEstimate * (job.fee_percentage / 100);
  }, 0);

  return {
    activeJobs: activeJobs ?? 0,
    candidatesInPipeline: candidatesInPipeline ?? 0,
    totalCandidates: totalCandidates ?? 0,
    weightedPipeline: Math.round(weightedPipeline),
    placementsThisMonth: placementsThisMonth ?? 0,
    agentsActive: agentsActive ?? 0,
    pendingApprovals: pendingApprovals ?? 0
  };
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export function toKpiDefinitions(metrics: DashboardMetrics): KpiDefinition[] {
  return [
    { label: "Active Jobs", value: String(metrics.activeJobs) },
    { label: "Candidates in Pipeline", value: String(metrics.candidatesInPipeline) },
    { label: "Total Candidates", value: String(metrics.totalCandidates) },
    {
      label: "Weighted Pipeline",
      value: currencyFormatter.format(metrics.weightedPipeline),
      tone: metrics.weightedPipeline > 0 ? "healthy" : "default"
    },
    {
      label: "Placements This Month",
      value: String(metrics.placementsThisMonth),
      tone: metrics.placementsThisMonth > 0 ? "healthy" : "default"
    },
    { label: "AI Agents Active", value: String(metrics.agentsActive) },
    {
      label: "Pending Approvals",
      value: String(metrics.pendingApprovals),
      tone: metrics.pendingApprovals > 0 ? "review" : "default"
    }
  ];
}
