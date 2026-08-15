export type OrganizationPlanTier = "starter" | "growth" | "agency" | "enterprise";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  planTier: OrganizationPlanTier;
  createdAt: string;
}
