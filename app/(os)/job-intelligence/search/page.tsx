import { SearchCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function SearchJobsPage() {
  return (
    <PlaceholderPage
      icon={SearchCheck}
      title="Search Jobs"
      description="Query and import jobs across every connected source (services/integrations/jobs) into the canonical model. The normalized-import pipeline is built; the search UI lands next."
    />
  );
}
