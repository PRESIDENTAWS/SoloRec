import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PortalPageHeader } from "@/components/portal/PortalPageHeader";
import { StatGrid } from "@/components/portal/StatCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Client Dashboard — SoloRec" };

// MOCK DATA — representative client-portal content for the shell.
const STATS = [
  { label: "Open Requisitions", value: 4, hint: "2 filled this quarter" },
  { label: "Candidates in Review", value: 9, hint: "awaiting your feedback" },
  { label: "Interviews This Week", value: 3 },
  { label: "Pending Offers", value: 1, hint: "needs approval" }
];

const REQUISITIONS = [
  { title: "Senior DevOps Engineer", location: "Atlanta, GA", submittals: 5, stage: "Interviewing" },
  { title: "Security Analyst", location: "Remote (US)", submittals: 3, stage: "Sourcing" },
  { title: "Product Designer", location: "Austin, TX", submittals: 1, stage: "Submittals" },
  { title: "Data Engineer", location: "Atlanta, GA", submittals: 0, stage: "Intake" }
];

const ACTIONS = [
  { text: "Review 2 new candidate submittals for Senior DevOps Engineer", href: "/client/submittals" },
  { text: "Provide feedback on Priya N. (interviewed Tue)", href: "/client/feedback" },
  { text: "Approve offer for Marcus R. — Security Analyst", href: "/client/offers" }
];

export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Client Portal"
        title="Welcome back, Jordan"
        description="Track your requisitions, review candidates and approve offers — no email required."
      />

      <StatGrid stats={STATS} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-50">Open requisitions</h2>
            <Link href="/client/requisitions" className="text-xs font-semibold text-accent-blue-soft hover:text-white">
              View all
            </Link>
          </CardHeader>
          <ul className="divide-y divide-base-line">
            {REQUISITIONS.map((req) => (
              <li key={req.title} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-100">{req.title}</div>
                  <div className="truncate text-xs text-slate-500">{req.location}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-slate-400">{req.submittals} submittals</span>
                  <Badge className="border-accent-blue/30 bg-accent-blue/10 text-accent-blue-soft">
                    {req.stage}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-50">Awaiting your action</h2>
          </CardHeader>
          <CardBody className="space-y-2">
            {ACTIONS.map((action) => (
              <Link
                key={action.text}
                href={action.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-base-line bg-base-panel2 px-4 py-3 text-sm text-slate-200 transition hover:border-accent-blue-soft/40"
              >
                <span className="min-w-0 truncate">{action.text}</span>
                <ArrowRight size={15} className="shrink-0 text-accent-blue-soft" aria-hidden="true" />
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
