import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Candidate Submittals — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={Users}
      title="Candidate Submittals"
      description="Review candidate packets your recruiter has submitted — advance or reject each one without emailing back and forth."
    />
  );
}
