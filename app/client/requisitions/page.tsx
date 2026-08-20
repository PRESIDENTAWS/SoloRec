import { FileText } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Open Requisitions — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={FileText}
      title="Open Requisitions"
      description="Every requisition you've opened, its stage and submittal count. Submit a new hiring need and approve intake here."
    />
  );
}
