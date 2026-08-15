export type ClientStatus = "prospect" | "active" | "dormant" | "churned";

export interface Client {
  id: string;
  organizationId: string;
  companyId: string;
  name: string;
  status: ClientStatus;
  lifecycleStage: string;
  accountOwnerId: string;
  lifetimeRevenue: number;
  clientHealth: number;
}
