export type UserRole =
  | "owner"
  | "admin"
  | "recruiter"
  | "sales"
  | "coordinator"
  | "finance";

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}
