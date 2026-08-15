import type { AgentEvent, AgentEventType } from "@/types";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

const TYPE_DOT_CLASS: Record<AgentEventType, string> = {
  info: "bg-accent-blue-soft",
  success: "bg-status-healthy",
  warning: "bg-status-review",
  action: "bg-accent-purple-soft"
};

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ActivityFeed({ events, limit }: { events: AgentEvent[]; limit?: number }) {
  const visible = limit ? events.slice(0, limit) : events;

  return (
    <Card>
      <ul className="divide-y divide-base-line">
        {visible.map((event) => (
          <li key={event.id} className="flex items-start gap-3 px-5 py-4">
            <span
              className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", TYPE_DOT_CLASS[event.type])}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-200">
                <span className="font-semibold text-slate-50">{event.agentName}</span>{" "}
                {event.message}
              </p>
            </div>
            <span className="shrink-0 text-xs text-slate-500">{formatTime(event.timestamp)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
