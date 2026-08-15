export type TaskStatus = "open" | "in_progress" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high";
export type TaskCreatedBy = "user" | "system" | "agent";

export interface Task {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  entityType?: string;
  entityId?: string;
  assignedToUserId?: string;
  dueAt?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: TaskCreatedBy;
}
