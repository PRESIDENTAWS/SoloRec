import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      icon={Settings}
      title="Settings"
      description="Organization, membership, role, and AI configuration will live here — see docs/architecture/03-security-and-tenancy.md."
    />
  );
}
