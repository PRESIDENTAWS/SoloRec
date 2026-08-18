import { PortalLoginForm } from "@/components/auth/PortalLoginForm";

export default function ClientLoginPage() {
  return (
    <PortalLoginForm
      title="Client Portal"
      subtitle="Sign in to review submissions, interviews, and hiring progress."
      redirectTo="/portal/client"
      otherPortalHref="/login/candidate"
      otherPortalLabel="I'm a candidate"
    />
  );
}
