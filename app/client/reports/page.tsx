import { BarChart3 } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Reports — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={BarChart3}
      title="Reports"
      description="Time-to-fill, submittal-to-interview ratios and hiring activity across your account."
    />
  );
}
