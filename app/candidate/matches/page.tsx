import { Sparkles } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Job Matches — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={Sparkles}
      title="Job Matches"
      description="Roles matched to your experience and preferences, with why each one fits."
    />
  );
}
