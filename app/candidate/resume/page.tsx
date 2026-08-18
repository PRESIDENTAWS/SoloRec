import { FileText } from "lucide-react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const metadata = { title: "Resume — SoloRec" };

export default function Page() {
  return (
    <PlaceholderPage
      icon={FileText}
      title="Resume"
      description="Upload and manage your resume. The recruiter uses the latest version for submittals."
    />
  );
}
