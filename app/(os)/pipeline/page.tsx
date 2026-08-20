import { GitBranch } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function PipelinePage() {
  return (
    <PlaceholderPage
      icon={GitBranch}
      title="Pipeline"
      description="A kanban view across submission → interview → offer → placement stages will live here — see Epic 8 in docs/product/backlog.md."
    />
  );
}
