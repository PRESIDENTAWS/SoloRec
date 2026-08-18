import {
  LayoutDashboard,
  FileText,
  Users,
  CalendarClock,
  MessageSquare,
  BadgeCheck,
  Handshake,
  Receipt,
  BarChart3,
  UserRound,
  Sparkles,
  FolderClosed,
  ClipboardList,
  type LucideIcon
} from "lucide-react";

export interface PortalNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Client portal navigation. A client can track requisitions, review submittals,
 * advance/reject candidates, schedule interviews, give feedback, approve offers,
 * see placement status and view invoices — without emailing the recruiter.
 */
export const CLIENT_NAV: PortalNavItem[] = [
  { label: "Dashboard", href: "/client", icon: LayoutDashboard },
  { label: "Open Requisitions", href: "/client/requisitions", icon: FileText },
  { label: "Candidate Submittals", href: "/client/submittals", icon: Users },
  { label: "Interviews", href: "/client/interviews", icon: CalendarClock },
  { label: "Feedback", href: "/client/feedback", icon: MessageSquare },
  { label: "Offers", href: "/client/offers", icon: BadgeCheck },
  { label: "Placements", href: "/client/placements", icon: Handshake },
  { label: "Invoices", href: "/client/invoices", icon: Receipt },
  { label: "Reports", href: "/client/reports", icon: BarChart3 }
];

/**
 * Candidate portal navigation. Candidates see their own journey only — never
 * internal recruiter notes, margin, client fees, BD intelligence, other
 * candidates, or internal scoring logic.
 */
export const CANDIDATE_NAV: PortalNavItem[] = [
  { label: "Dashboard", href: "/candidate", icon: LayoutDashboard },
  { label: "Profile", href: "/candidate/profile", icon: UserRound },
  { label: "Resume", href: "/candidate/resume", icon: FileText },
  { label: "Job Matches", href: "/candidate/matches", icon: Sparkles },
  { label: "Applications", href: "/candidate/applications", icon: ClipboardList },
  { label: "Interviews", href: "/candidate/interviews", icon: CalendarClock },
  { label: "Messages", href: "/candidate/messages", icon: MessageSquare },
  { label: "Documents", href: "/candidate/documents", icon: FolderClosed },
  { label: "Offers", href: "/candidate/offers", icon: BadgeCheck }
];
