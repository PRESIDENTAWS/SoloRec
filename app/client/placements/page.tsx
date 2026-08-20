import { Handshake } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Placements — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={Handshake}
      title="Placements"
      description="See confirmed placements, start dates and guarantee-period status."
    />
  );
}
