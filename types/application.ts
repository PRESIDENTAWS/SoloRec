export type ApplicationStage =
  | "sourced"
  | "contacted"
  | "responded"
  | "screened"
  | "qualified"
  | "submitted"
  | "interviewing"
  | "offered"
  | "placed"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: string;
  organizationId: string;
  candidateId: string;
  jobId: string;
  stage: ApplicationStage;
  createdAt: string;
  updatedAt: string;
}
