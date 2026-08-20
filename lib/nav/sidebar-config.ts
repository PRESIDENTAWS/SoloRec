import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitBranch,
  Building2,
  Contact,
  Search,
  Radar,
  CheckSquare,
  Calendar,
  DollarSign,
  BarChart3,
  Bot,
  Sparkles,
  ShieldCheck,
  Activity,
  Radio,
  Settings,
  type LucideIcon
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const SIDEBAR_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]
  },
  {
    label: "Recruiting",
    items: [
      { label: "Jobs", href: "/jobs", icon: Briefcase },
      { label: "Candidates", href: "/candidates", icon: Users },
      { label: "Pipeline", href: "/pipeline", icon: GitBranch },
      { label: "Companies", href: "/companies", icon: Building2 },
      { label: "Contacts", href: "/contacts", icon: Contact },
      { label: "Search", href: "/search", icon: Search }
    ]
  },
  {
    label: "Talent Intelligence",
    items: [{ label: "Job Intelligence", href: "/job-intelligence", icon: Radar }]
  },
  {
    label: "Operations",
    items: [
      { label: "Tasks", href: "/tasks", icon: CheckSquare },
      { label: "Calendar", href: "/calendar", icon: Calendar },
      { label: "Finance", href: "/finance", icon: DollarSign },
      { label: "Reports", href: "/reports", icon: BarChart3 }
    ]
  },
  {
    label: "AI Workforce",
    items: [
      { label: "AI HQ", href: "/ai-hq", icon: Sparkles },
      { label: "Command Center", href: "/ai-hq/command-center", icon: Radio },
      { label: "Agents", href: "/ai-hq/agents", icon: Bot },
      { label: "Approvals", href: "/ai-hq/approvals", icon: ShieldCheck },
      { label: "Activity", href: "/ai-hq/activity", icon: Activity }
    ]
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/settings", icon: Settings }]
  }
];
