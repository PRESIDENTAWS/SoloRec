export type PlacementStatus = "active" | "guarantee_period" | "confirmed" | "fell_through";
export type PlacementType = "direct_hire" | "contract";

export interface Placement {
  id: string;
  organizationId: string;
  candidateId: string;
  jobId: string;
  clientId: string;
  placementType: PlacementType;
  startDate: string;
  feeAmount: number;
  status: PlacementStatus;
}
