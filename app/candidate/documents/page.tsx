import { FolderClosed } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Documents — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={FolderClosed}
      title="Documents"
      description="Compliance documents, offer letters and onboarding paperwork in one place."
    />
  );
}
