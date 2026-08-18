import { BadgeCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Offers — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={BadgeCheck}
      title="Offers"
      description="Review and approve offers, with compensation and start-date details, before they go out."
    />
  );
}
