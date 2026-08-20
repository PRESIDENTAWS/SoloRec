import { MessageSquare } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Messages — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={MessageSquare}
      title="Messages"
      description="Direct messages with your recruiter — questions, updates and next steps."
    />
  );
}
