import { z } from "zod";

/** Shared input validation schemas — Server Actions and domain services both import these. */

export const companyInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  website: z.string().max(300).optional().or(z.literal("")),
  industry: z.string().max(200).optional().or(z.literal("")),
  employeeCount: z.coerce.number().int().nonnegative().optional().nullable(),
  headquarters: z.string().max(200).optional().or(z.literal("")),
  description: z.string().max(4000).optional().or(z.literal(""))
});
export type CompanyInput = z.infer<typeof companyInputSchema>;

export const contactInputSchema = z.object({
  companyId: z.string().uuid().optional().or(z.literal("")),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  title: z.string().max(200).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email").max(320).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  linkedinUrl: z.string().max(300).optional().or(z.literal("")),
  notes: z.string().max(4000).optional().or(z.literal(""))
});
export type ContactInput = z.infer<typeof contactInputSchema>;

export const jobInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  companyId: z.string().uuid().optional().or(z.literal("")),
  department: z.string().max(200).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  workplaceType: z.enum(["onsite", "hybrid", "remote"]).default("onsite"),
  employmentType: z.enum(["direct_hire", "contract", "contract_to_hire"]).default("direct_hire"),
  description: z.string().max(8000).optional().or(z.literal("")),
  requirements: z.string().max(8000).optional().or(z.literal("")),
  preferredQualifications: z.string().max(8000).optional().or(z.literal("")),
  salaryMin: z.coerce.number().nonnegative().optional().nullable(),
  salaryMax: z.coerce.number().nonnegative().optional().nullable(),
  currency: z.string().length(3).default("USD"),
  feePercentage: z.coerce.number().min(0).max(100).optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z
    .enum(["draft", "open", "on_hold", "filled", "closed", "cancelled"])
    .default("draft")
    .optional()
});
export type JobInput = z.infer<typeof jobInputSchema>;

export const candidateInputSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Enter a valid email").max(320).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  currentTitle: z.string().max(200).optional().or(z.literal("")),
  currentCompany: z.string().max(200).optional().or(z.literal("")),
  linkedinUrl: z.string().max(300).optional().or(z.literal("")),
  yearsExperience: z.coerce.number().min(0).max(60).optional().nullable(),
  salaryExpectation: z.coerce.number().nonnegative().optional().nullable(),
  currency: z.string().length(3).default("USD"),
  summary: z.string().max(4000).optional().or(z.literal("")),
  skills: z.array(z.string().min(1).max(60)).max(50).default([]),
  source: z.string().max(200).optional().or(z.literal(""))
});
export type CandidateInput = z.infer<typeof candidateInputSchema>;

export const applicationStageSchema = z.enum([
  "sourced",
  "contacted",
  "responded",
  "screening",
  "qualified",
  "submitted",
  "client_review",
  "interview",
  "offer",
  "placed",
  "rejected",
  "withdrawn"
]);

export const applicationInputSchema = z.object({
  jobId: z.string().uuid(),
  candidateId: z.string().uuid(),
  stage: applicationStageSchema.default("sourced"),
  source: z.string().max(200).optional().or(z.literal(""))
});
export type ApplicationInput = z.infer<typeof applicationInputSchema>;

export const approvalDecisionSchema = z.object({
  approvalId: z.string().uuid(),
  decision: z.enum(["approved", "rejected"]),
  notes: z.string().max(2000).optional().or(z.literal(""))
});
export type ApprovalDecisionInput = z.infer<typeof approvalDecisionSchema>;

export const agentTaskInputSchema = z.object({
  agentKey: z.string().min(1),
  taskType: z.enum(["candidate_matching", "outreach_draft"]),
  relatedEntityType: z.string().min(1),
  relatedEntityId: z.string().uuid()
});
export type AgentTaskInput = z.infer<typeof agentTaskInputSchema>;

/** Turns "" into undefined for optional free-text fields coming from HTML forms. */
export function emptyToUndefined<T extends string | undefined | null>(value: T): T | undefined {
  return value === "" ? undefined : (value ?? undefined);
}
