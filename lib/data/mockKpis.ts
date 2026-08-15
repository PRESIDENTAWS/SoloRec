export interface KpiDefinition {
  label: string;
  value: string;
  tone?: "default" | "healthy" | "review" | "blocked";
}
