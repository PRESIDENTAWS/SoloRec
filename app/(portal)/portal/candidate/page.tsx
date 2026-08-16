import { Briefcase, CalendarCheck, FileText } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

const SECTIONS = [
  { icon: FileText, title: "My Applications", body: "Roles you've been submitted for will appear here." },
  { icon: CalendarCheck, title: "Interviews", body: "Scheduled and completed interviews will appear here." },
  { icon: Briefcase, title: "Offers", body: "Any offers extended to you will appear here." }
];

export default function CandidatePortalPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          Candidate Portal
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Welcome</h1>
        <p className="mt-1 max-w-xl text-sm text-slate-400">
          Track your applications, interviews, and offers here. Your recruiter connects your account
          to your candidate profile — once linked, your live status shows up below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardBody className="space-y-2">
                <Icon size={20} className="text-accent-blue-soft" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-slate-100">{section.title}</h2>
                <p className="text-xs text-slate-500">{section.body}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardBody className="text-sm text-slate-500">
          Nothing to show yet. When your recruiter links your account to your candidate record,
          your applications and interview schedule appear here automatically.
        </CardBody>
      </Card>
    </div>
  );
}
