import { Search } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function SearchPage() {
  return (
    <PlaceholderPage
      icon={Search}
      title="Search"
      description="Hybrid structured + semantic candidate/job search will live here — see docs/architecture/04-ai-and-agents.md#o-candidate-matching-architecture."
    />
  );
}
