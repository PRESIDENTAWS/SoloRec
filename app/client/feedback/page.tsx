import { MessageSquare } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Feedback — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={MessageSquare}
      title="Feedback"
      description="Leave structured feedback on interviewed candidates so the recruiter can move quickly."
    />
  );
}
