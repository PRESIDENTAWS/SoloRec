export type CandidateStatus =
  | "active"
  | "passive"
  | "engaged"
  | "screening"
  | "submitted"
  | "interviewing"
  | "offer"
  | "placed"
  | "archived";

export interface Candidate {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  currentTitle: string;
  currentCompany?: string;
  location: string;
  yearsExperience: number;
  status: CandidateStatus;
  matchScore?: number;
  compensationExpectation?: number;
  ownerId: string;
}
