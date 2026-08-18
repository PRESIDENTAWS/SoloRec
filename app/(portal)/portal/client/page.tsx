import { Briefcase, Users, CheckSquare } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

const SECTIONS = [
  { icon: Briefcase, title: "Open Roles", body: "Jobs your agency is working on your behalf." },
  { icon: Users, title: "Submitted Candidates", body: "Candidates submitted for your review." },
  { icon: CheckSquare, title: "Approvals", body: "Interview requests and offers awaiting your decision." }
];

export default function ClientPortalPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          Client Portal
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Welcome</h1>
        <p className="mt-1 max-w-xl text-sm text-slate-400">
          Review submissions, interview requests, and hiring progress for your open roles. Your
          recruiter connects your account to your client record — once linked, live data shows below.
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
          Nothing to show yet. When your recruiter links your account to your client record, your
          open roles and submitted candidates appear here automatically.
        </CardBody>
      </Card>
    </div>
  );
}
