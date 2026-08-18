import { BadgeCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Offers — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={BadgeCheck}
      title="Offers"
      description="Review offers extended to you, with compensation, start date and next steps."
    />
  );
}
