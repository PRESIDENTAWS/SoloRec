export type SubmissionStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "sent"
  | "client_review"
  | "interview"
  | "rejected"
  | "offer"
  | "placed"
  | "withdrawn";

export interface Submission {
  id: string;
  organizationId: string;
  candidateId: string;
  jobId: string;
  status: SubmissionStatus;
  aiGeneratedDraft?: string;
  finalContent?: string;
  submittedByUserId: string;
  approvedByUserId?: string;
  createdAt: string;
}
