import { Eye } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function WatchlistsPage() {
  return (
    <PlaceholderPage
      icon={Eye}
      title="Watchlists"
      description="Track companies and markets over time and get alerted when they move into High Priority. Backed by the job_watchlists / job_watchlist_items tables in the Job Intelligence schema."
    />
  );
}
