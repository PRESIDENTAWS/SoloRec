import type { Agent } from "@/types";

/**
 * MOCK DATA — the nine seed agents for the AI HQ starter. Backed by
 * services/agents/agentService.ts, which is the seam a real Supabase-backed
 * implementation replaces. Nothing downstream should import this file
 * directly except that service.
 */
export const MOCK_AGENTS: Agent[] = [
  {
    id: "orion",
    name: "ORION",
    role: "AI COO / Executive Intelligence",
    department: "Executive Intelligence",
    status: "working",
    avatar: "OR",
    currentTask: "Analyze agency performance and pipeline risks",
    autonomyLevel: 4,
    health: 97,
    lastAction: "Flagged Vertex Systems offer at risk due to $7K comp gap",
    taskCount: 12,
    approvalCount: 1,
    kpis: [
      { label: "Weighted Pipeline", value: "$428K" },
      { label: "Actions Prioritized", value: "7" }
    ],
    tools: ["search_jobs", "search_clients", "calculate_job_expected_value", "create_recommendation"],
    permissions: ["read:all", "analyze:all"]
  },
  {
    id: "ava",
    name: "AVA",
    role: "Lead Sourcing Agent",
    department: "Talent Lab",
    status: "working",
    avatar: "AV",
    currentTask: "Build Atlanta DevOps Talent Map",
    currentJob: "Senior DevOps Engineer — Acme Technologies",
    autonomyLevel: 3,
    health: 94,
    lastAction: "Shortlisted 12 candidates for Senior DevOps Engineer",
    taskCount: 9,
    approvalCount: 1,
    kpis: [
      { label: "Qualified", value: "263" },
      { label: "Response Rate", value: "41%" }
    ],
    tools: ["search_candidates", "read_candidate", "draft_email", "search_knowledge"],
    permissions: ["read:candidates", "draft:outreach"]
  },
  {
    id: "milo",
    name: "MILO",
    role: "Recruiting Agent",
    department: "Recruiting",
    status: "review_required",
    avatar: "MI",
    currentTask: "Prepare candidate screen summaries",
    autonomyLevel: 2,
    health: 88,
    lastAction: "Completed candidate screen for Danielle Brooks",
    taskCount: 6,
    approvalCount: 1,
    kpis: [
      { label: "Screens Completed", value: "18" },
      { label: "Avg Screen Time", value: "22 min" }
    ],
    tools: ["read_candidate", "read_job", "create_task"],
    permissions: ["read:candidates", "read:jobs", "draft:summary"]
  },
  {
    id: "luna",
    name: "LUNA",
    role: "Matching Agent",
    department: "Candidate Intelligence",
    status: "working",
    avatar: "LU",
    currentTask: "Score shortlisted candidates",
    autonomyLevel: 3,
    health: 96,
    lastAction: "Recalculated match scores for Senior Controls Engineer",
    taskCount: 14,
    approvalCount: 0,
    kpis: [
      { label: "Avg Match Score", value: "91%" },
      { label: "Matches Scored", value: "84" }
    ],
    tools: ["search_candidates", "read_job", "calculate_job_expected_value"],
    permissions: ["read:candidates", "read:jobs"]
  },
  {
    id: "echo",
    name: "ECHO",
    role: "Compliance Agent",
    department: "Compliance",
    status: "review_required",
    avatar: "EC",
    currentTask: "Review expiring candidate documents",
    autonomyLevel: 2,
    health: 82,
    lastAction: "Flagged document expiring in 7 days",
    taskCount: 5,
    approvalCount: 1,
    kpis: [
      { label: "Open Alerts", value: "7" },
      { label: "Items Reviewed", value: "31" }
    ],
    tools: ["read_candidate", "create_task", "create_recommendation"],
    permissions: ["read:candidates", "read:compliance"]
  },
  {
    id: "spark",
    name: "SPARK",
    role: "Business Development Agent",
    department: "Revenue",
    status: "working",
    avatar: "SP",
    currentTask: "Research high-fit target accounts",
    autonomyLevel: 3,
    health: 90,
    lastAction: "Identified 14 high-fit target accounts",
    taskCount: 8,
    approvalCount: 0,
    kpis: [
      { label: "Meetings Booked", value: "7" },
      { label: "Accounts Identified", value: "14" }
    ],
    tools: ["search_clients", "read_client", "create_recommendation"],
    permissions: ["read:clients"]
  },
  {
    id: "nova",
    name: "NOVA",
    role: "Client Success Agent",
    department: "Client Success",
    status: "idle",
    avatar: "NO",
    currentTask: "Awaiting client feedback",
    autonomyLevel: 2,
    health: 91,
    lastAction: "Sent quarterly account review to Northstar Group",
    taskCount: 3,
    approvalCount: 0,
    kpis: [
      { label: "Client Health", value: "94%" },
      { label: "Accounts Managed", value: "12" }
    ],
    tools: ["read_client", "retrieve_client_history"],
    permissions: ["read:clients"]
  },
  {
    id: "fin",
    name: "FIN",
    role: "Finance Agent",
    department: "Finance",
    status: "working",
    avatar: "FI",
    currentTask: "Reconcile placement fees",
    autonomyLevel: 2,
    health: 93,
    lastAction: "Reconciled 4 placement invoices",
    taskCount: 6,
    approvalCount: 0,
    kpis: [
      { label: "A/R Outstanding", value: "$37.8K" },
      { label: "Invoices Reconciled", value: "4" }
    ],
    tools: ["calculate_job_expected_value", "read_client"],
    permissions: ["read:finance"]
  },
  {
    id: "guard",
    name: "GUARD",
    role: "Legal & Risk Agent",
    department: "Legal / Risk",
    status: "review_required",
    avatar: "GU",
    currentTask: "Review contract exceptions",
    autonomyLevel: 1,
    health: 85,
    lastAction: "Escalated a non-standard client contract clause",
    taskCount: 4,
    approvalCount: 1,
    kpis: [
      { label: "Escalations", value: "3" },
      { label: "Contracts Reviewed", value: "9" }
    ],
    tools: ["read_client", "search_knowledge", "create_recommendation"],
    permissions: ["read:agreements"]
  }
];
