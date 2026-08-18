import {
  Zap,
  Target,
  Users,
  ShieldCheck,
  BarChart3,
  Boxes,
  type LucideIcon
} from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  body: string;
}

export const FEATURES: Feature[] = [
  {
    icon: Zap,
    iconColor: "text-accent-purple-soft",
    title: "AI Agents That Do the Work",
    body: "Specialized AI agents handle sourcing, screening, outreach, compliance, and more."
  },
  {
    icon: Target,
    iconColor: "text-accent-blue-soft",
    title: "Smarter Matching",
    body: "LUNA analyzes skills, experience, and context to deliver the right candidates, faster."
  },
  {
    icon: Users,
    iconColor: "text-status-healthy",
    title: "Client Intelligence",
    body: "NOVA builds deep client profiles and surfaces real-time insights to strengthen relationships."
  },
  {
    icon: ShieldCheck,
    iconColor: "text-status-review",
    title: "Reduce Risk",
    body: "ECHO and GUARD keep you compliant, mitigate risk, and protect your business."
  },
  {
    icon: BarChart3,
    iconColor: "text-accent-purple-soft",
    title: "Grow Profitability",
    body: "ORION gives you executive visibility to optimize performance and drive growth."
  },
  {
    icon: Boxes,
    iconColor: "text-accent-blue-soft",
    title: "All-In-One Platform",
    body: "One system. One source of truth. Built specifically for staffing agencies."
  }
];

export interface AgentBio {
  name: string;
  role: string;
  body: string;
  accent: string;
}

/** The nine AI agents, matching the marketing "AI Leadership Team". */
export const AGENT_TEAM: AgentBio[] = [
  { name: "NOVA", role: "Client Success", body: "Understands your clients. Strengthens relationships.", accent: "from-sky-500/30 to-blue-600/10" },
  { name: "AVA", role: "Talent Acquisition", body: "Sources top talent and builds winning pipelines.", accent: "from-violet-500/30 to-purple-600/10" },
  { name: "MILO", role: "Recruiting Partner", body: "Screens, interviews, and delivers quality candidates.", accent: "from-emerald-500/30 to-green-600/10" },
  { name: "LUNA", role: "Match Intelligence", body: "Matches the right talent to the right opportunities.", accent: "from-slate-400/30 to-slate-600/10" },
  { name: "SPARK", role: "BD & Growth", body: "Finds new opps, warms outreach, drives pipeline.", accent: "from-amber-500/30 to-orange-600/10" },
  { name: "ECHO", role: "Compliance", body: "Ensures compliance and reduces operational risk.", accent: "from-cyan-500/30 to-teal-600/10" },
  { name: "FIN", role: "Finance", body: "Track financial health and maximize margins.", accent: "from-slate-300/30 to-slate-500/10" },
  { name: "GUARD", role: "Legal & Risk", body: "Protects your business and mitigates risk.", accent: "from-pink-500/30 to-rose-600/10" },
  { name: "ORION", role: "Executive OS", body: "Delivers clarity, insights, and data-driven decisions.", accent: "from-indigo-500/30 to-blue-700/10" }
];

export const TRUSTED_BY = [
  "ExecuTech Solutions",
  "Velocity Staffing",
  "Nexus Talent Partners",
  "Integra Technologies",
  "Pinnacle Group",
  "Apex Solutions"
];
