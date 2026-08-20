import { CalendarClock } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Interviews — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={CalendarClock}
      title="Interviews"
      description="Schedule and track interviews across your requisitions, with panel details and outcomes."
    />
  );
}
