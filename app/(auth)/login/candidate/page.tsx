import { PortalLoginForm } from "@/components/auth/PortalLoginForm";

export default function CandidateLoginPage() {
  return (
    <PortalLoginForm
      title="Candidate Portal"
      subtitle="Sign in to track your applications, interviews, and offers."
      redirectTo="/portal/candidate"
      otherPortalHref="/login/client"
      otherPortalLabel="I'm a client"
    />
  );
}
