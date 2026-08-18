import { Bookmark } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function SavedSearchesPage() {
  return (
    <PlaceholderPage
      icon={Bookmark}
      title="Saved Searches"
      description="Persist a query — keywords, location, source and score filters — and re-run it on a schedule. Backed by the saved_job_searches table in the Job Intelligence schema."
    />
  );
}
