import { Receipt } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Invoices — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={Receipt}
      title="Invoices"
      description="View and download invoices tied to your placements, with payment status."
    />
  );
}
