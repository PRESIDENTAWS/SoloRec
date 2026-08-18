import { ClipboardList } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Applications — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={ClipboardList}
      title="Applications"
      description="Track the status of every role you're being considered for, stage by stage."
    />
  );
}
