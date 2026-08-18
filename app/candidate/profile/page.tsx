import { UserRound } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Profile — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={UserRound}
      title="Profile"
      description="Your profile and how complete it is — the more you add, the better your job matches."
    />
  );
}
