export type CommissionStatus = "accrued" | "approved" | "paid";

export interface Commission {
  id: string;
  organizationId: string;
  userId: string;
  placementId: string;
  amount: number;
  status: CommissionStatus;
  periodLabel: string;
}
