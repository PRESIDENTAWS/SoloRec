import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { eventService } from "@/services/events/eventService";

export default async function ActivityPage() {
  const events = await eventService.listRecentEvents();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          AI Workforce
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Live Activity</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Static event feed in this starter. The intended flow once a backend exists: agent task
          executes → backend records task → AgentEvent created → realtime event emitted →
          frontend receives event → 3D workstation status changes.
        </p>
      </div>

      <ActivityFeed events={events} />
    </div>
  );
}
