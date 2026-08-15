export type InterviewStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type InterviewRecommendation = "advance" | "reject" | "hold";

export interface Interview {
  id: string;
  organizationId: string;
  submissionId: string;
  interviewType: string;
  scheduledAt: string;
  status: InterviewStatus;
  recommendation?: InterviewRecommendation;
}
