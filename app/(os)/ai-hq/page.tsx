import { AIHQEntryHero, type EntryStat } from "@/components/ai-hq/AIHQEntryHero";
import { agentService } from "@/services/agents/agentService";

export const metadata = { title: "Staffing HQ — SoloRec" };

/**
 * AI HQ launch screen.
 *
 * The command center is a control layer, not a dashboard widget, so this
 * route is a cinematic entry shell: live posture plus a single way in.
 * The immersive environment itself lives at /ai-hq/command-center.
 */
export default async function AiHqEntryPage() {
  const agents = await agentService.listAgents();

  const agentsOnline = agents.filter((agent) => agent.status !== "offline").length;
  const approvals = agents.reduce((total, agent) => total + agent.approvalCount, 0);
  const openSearches = agents.reduce((total, agent) => total + agent.taskCount, 0);

  const stats: EntryStat[] = [
    { label: "Agents Online", value: String(agentsOnline) },
    { label: "Open Searches", value: String(openSearches) },
    { label: "Pending Approvals", value: String(approvals) },
    { label: "Pipeline", value: "$428K" }
  ];

  return <AIHQEntryHero stats={stats} agentsOnline={agentsOnline} />;
}
