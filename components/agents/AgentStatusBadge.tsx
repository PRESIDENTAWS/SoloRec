import type { AgentStatus } from "@/types";
import { AGENT_STATUS_LABELS } from "@/types";
import { AGENT_STATUS_BADGE_CLASS } from "@/lib/agents/constants";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  return (
    <Badge className={cn(AGENT_STATUS_BADGE_CLASS[status])}>{AGENT_STATUS_LABELS[status]}</Badge>
  );
}
