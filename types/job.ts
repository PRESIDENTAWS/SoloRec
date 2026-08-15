export type JobStatus =
  | "draft"
  | "intake"
  | "approval"
  | "open"
  | "sourcing"
  | "interviewing"
  | "offer"
  | "filled"
  | "on_hold"
  | "cancelled"
  | "closed";

export type JobPriority = "low" | "medium" | "high";
export type EmploymentType = "direct_hire" | "contract" | "contract_to_hire";

export interface Job {
  id: string;
  organizationId: string;
  clientId: string;
  recruiterOwnerId: string;
  title: string;
  department?: string;
  employmentType: EmploymentType;
  location: string;
  workplaceType: "onsite" | "hybrid" | "remote";
  minCompensation?: number;
  maxCompensation?: number;
  currency: string;
  feePercentage?: number;
  priority: JobPriority;
  status: JobStatus;
  candidatesInPipeline: number;
  createdAt: string;
}
