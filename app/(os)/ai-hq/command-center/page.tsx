import { CommandCenterExperience } from "@/components/ai-hq/CommandCenterExperience";
import type { CommandTablePanel } from "@/components/ai-hq/CommandTable";
import type { HudStat } from "@/lib/ai-hq/hudConfig";
import { agentService } from "@/services/agents/agentService";

export const metadata = { title: "Command Center — SoloRec Staffing HQ" };

/**
 * The immersive AI HQ command center.
 *
 * Data is resolved here (server side) and handed to the experience as plain
 * display values, keeping the Three.js layer free of business logic. The
 * experience renders full-viewport, so the room takes over the screen.
 */
export default async function CommandCenterPage() {
  const agents = await agentService.listAgents();

  const approvals = agents.reduce((total, agent) => total + agent.approvalCount, 0);
  const activeTasks = agents.reduce((total, agent) => total + agent.taskCount, 0);
  const agentsOnline = agents.filter((agent) => agent.status !== "offline").length;

  const stats: HudStat[] = [
    { label: "Agents", value: String(agentsOnline), tone: "accent" },
    { label: "Active Tasks", value: String(activeTasks) },
    { label: "Approvals", value: String(approvals), tone: approvals > 0 ? "warning" : "success" },
    { label: "Pipeline", value: "$428K", tone: "success" }
  ];

  const commandPanels: CommandTablePanel[] = [
    { label: "Weighted Pipeline", value: "$428K" },
    { label: "Open Jobs", value: "32" },
    { label: "Candidate Flow", value: "263" },
    { label: "Approvals", value: String(approvals) },
    { label: "Placements", value: "11" },
    { label: "Risk Flags", value: "2" }
  ];

  return (
    <CommandCenterExperience agents={agents} stats={stats} commandPanels={commandPanels} />
  );
}
