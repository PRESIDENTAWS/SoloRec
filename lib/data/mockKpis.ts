export interface KpiDefinition {
  label: string;
  value: string;
  tone?: "default" | "healthy" | "review" | "blocked";
}

/** MOCK DATA — AI HQ Command Center KPI row. */
export const AI_HQ_KPIS: KpiDefinition[] = [
  { label: "Active Jobs", value: "32" },
  { label: "Candidates in Pipeline", value: "263" },
  { label: "Talent Pool", value: "12,840" },
  { label: "Revenue Pipeline", value: "$428,000", tone: "healthy" },
  { label: "Placements This Month", value: "11", tone: "healthy" },
  { label: "AI Agents Active", value: "9" },
  { label: "Approval Queue", value: "7", tone: "review" },
  { label: "Client Health", value: "94%", tone: "healthy" }
];

/** MOCK DATA — general dashboard KPI row (subset relevant outside AI HQ). */
export const DASHBOARD_KPIS: KpiDefinition[] = [
  { label: "Active Jobs", value: "32" },
  { label: "Candidates in Pipeline", value: "263" },
  { label: "Revenue Pipeline", value: "$428,000", tone: "healthy" },
  { label: "Placements This Month", value: "11", tone: "healthy" }
];
