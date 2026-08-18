import {
  Radar,
  UserSearch,
  ClipboardCheck,
  Send,
  CalendarClock,
  Database,
  ShieldCheck,
  Handshake,
  BarChart3,
  Bot,
  type LucideIcon
} from "lucide-react";

export interface ProductModule {
  name: string;
  tagline: string;
  icon: LucideIcon;
}

/**
 * The operating pipeline shown on the homepage:
 * Source → Screen → Engage → Schedule → Job Intelligence → CRM → Compliance →
 * Placements → Analytics → AI Agents.
 */
export const PRODUCT_MODULES: ProductModule[] = [
  { name: "Source", tagline: "Find talent across every channel", icon: UserSearch },
  { name: "Screen", tagline: "Qualify candidates faster", icon: ClipboardCheck },
  { name: "Engage", tagline: "Outreach and CRM in one place", icon: Send },
  { name: "Schedule", tagline: "Coordinate interviews automatically", icon: CalendarClock },
  { name: "Job Intelligence", tagline: "See who is actually hiring", icon: Radar },
  { name: "CRM", tagline: "Clients, contacts and accounts", icon: Database },
  { name: "Compliance", tagline: "Documents, checks and audit trails", icon: ShieldCheck },
  { name: "Placements", tagline: "Offers, starts and revenue", icon: Handshake },
  { name: "Analytics", tagline: "Every metric that moves the desk", icon: BarChart3 },
  { name: "AI Agents", tagline: "An always-on recruiting workforce", icon: Bot }
];
