import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { PortalPageHeader } from "@/components/portal/PortalPageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Candidate Dashboard — SoloRec" };

// MOCK DATA — representative candidate-portal content for the shell. Nothing
// here exposes internal recruiter notes, fees, margins, scoring, or other
// candidates — only this candidate's own journey.
const PROFILE_COMPLETION = 72;

const MATCHES = [
  { title: "Senior DevOps Engineer", company: "Confidential · Atlanta, GA", fit: "Strong fit" },
  { title: "Platform Engineer", company: "Confidential · Remote (US)", fit: "Good fit" },
  { title: "Site Reliability Engineer", company: "Confidential · Marietta, GA", fit: "Good fit" }
];

const APPLICATIONS = [
  { title: "Senior DevOps Engineer", stage: "Interviewing", tone: "blue" as const },
  { title: "Cloud Infrastructure Lead", stage: "Submitted", tone: "purple" as const },
  { title: "DevOps Team Lead", stage: "Offer", tone: "healthy" as const }
];

const INTERVIEWS = [
  { title: "Senior DevOps Engineer", when: "Thu, 2:00 PM · Video", note: "Panel: 2 engineers" }
];

const TASKS = [
  { label: "Upload updated resume", done: true },
  { label: "Complete work-authorization form", done: false },
  { label: "Add two professional references", done: false }
];

const STAGE_TONE = {
  blue: "border-accent-blue/30 bg-accent-blue/10 text-accent-blue-soft",
  purple: "border-accent-purple/30 bg-accent-purple/10 text-accent-purple-soft",
  healthy: "border-status-healthy/30 bg-status-healthy/15 text-status-healthy"
};

export default function CandidateDashboardPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Candidate Portal"
        title="Hi Sam"
        description="Your matches, applications and next steps — all in one private place."
      />

      {/* Profile completion */}
      <Card>
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-100">Profile completion</div>
            <div className="text-xs text-slate-500">
              A complete profile gets you better matches and faster submittals.
            </div>
          </div>
          <div className="flex items-center gap-3 sm:w-64">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-base-panel2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple"
                style={{ width: `${PROFILE_COMPLETION}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-200">{PROFILE_COMPLETION}%</span>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Job matches */}
        <Card className="overflow-hidden">
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-50">Job matches</h2>
            <Link href="/candidate/matches" className="text-xs font-semibold text-accent-blue-soft hover:text-white">
              View all
            </Link>
          </CardHeader>
          <ul className="divide-y divide-base-line">
            {MATCHES.map((match) => (
              <li key={match.title} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-100">{match.title}</div>
                  <div className="truncate text-xs text-slate-500">{match.company}</div>
                </div>
                <span className="shrink-0 text-xs font-semibold text-accent-blue-soft">{match.fit}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Applications */}
        <Card className="overflow-hidden">
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-50">Applications</h2>
            <Link href="/candidate/applications" className="text-xs font-semibold text-accent-blue-soft hover:text-white">
              View all
            </Link>
          </CardHeader>
          <ul className="divide-y divide-base-line">
            {APPLICATIONS.map((app) => (
              <li key={app.title} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="min-w-0 truncate text-sm text-slate-200">{app.title}</span>
                <Badge className={STAGE_TONE[app.tone]}>{app.stage}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        {/* Upcoming interviews */}
        <Card className="overflow-hidden">
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-50">Upcoming interviews</h2>
          </CardHeader>
          <CardBody className="space-y-2">
            {INTERVIEWS.map((interview) => (
              <div key={interview.title} className="rounded-xl border border-base-line bg-base-panel2 px-4 py-3">
                <div className="text-sm font-semibold text-slate-100">{interview.title}</div>
                <div className="mt-0.5 text-xs text-slate-400">{interview.when}</div>
                <div className="text-xs text-slate-500">{interview.note}</div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Onboarding / compliance tasks */}
        <Card className="overflow-hidden">
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-50">Your tasks</h2>
            <Link href="/candidate/documents" className="text-xs font-semibold text-accent-blue-soft hover:text-white">
              Documents
            </Link>
          </CardHeader>
          <CardBody className="space-y-2">
            {TASKS.map((task) => (
              <div key={task.label} className="flex items-center gap-2.5 text-sm">
                {task.done ? (
                  <CheckCircle2 size={16} className="text-status-healthy" aria-hidden="true" />
                ) : (
                  <Circle size={16} className="text-slate-600" aria-hidden="true" />
                )}
                <span className={task.done ? "text-slate-500 line-through" : "text-slate-200"}>
                  {task.label}
                </span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Link
        href="/candidate/matches"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue-soft transition hover:text-white"
      >
        Explore your job matches <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}
