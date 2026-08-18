import { CheckSquare } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function TasksPage() {
  return (
    <PlaceholderPage
      icon={CheckSquare}
      title="Tasks"
      description="Human and AI-generated tasks will live here — see Epic 10 in docs/product/backlog.md."
    />
  );
}
