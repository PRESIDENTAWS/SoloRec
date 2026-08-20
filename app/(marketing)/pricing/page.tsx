import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingHero } from "@/components/marketing/MarketingHero";

export const metadata = { title: "Pricing — SoloRec" };

const TIERS = [
  {
    name: "Starter",
    price: "$49",
    cadence: "/mo",
    blurb: "Solo recruiters getting off spreadsheets.",
    features: ["1 seat", "Jobs, candidates & pipeline", "Job Intelligence (basic)", "Email support"],
    featured: false
  },
  {
    name: "Growth",
    price: "$149",
    cadence: "/mo",
    blurb: "A working desk that needs automation.",
    features: ["Up to 5 seats", "Full CRM & BD", "AI agents (with approvals)", "Client portal"],
    featured: true
  },
  {
    name: "Agency",
    price: "$399",
    cadence: "/mo",
    blurb: "Multi-recruiter boutique agencies.",
    features: ["Up to 20 seats", "Candidate portal", "Compliance & documents", "Priority support"],
    featured: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "Larger firms with bespoke needs.",
    features: ["Unlimited seats", "SSO & advanced roles", "Custom integrations", "Dedicated CSM"],
    featured: false
  }
];

export default function PricingPage() {
  return (
    <div className="pb-16">
      <MarketingHero
        eyebrow="Pricing"
        title="Simple plans that scale with your desk"
        subtitle="Every plan includes the core operating system. Upgrade for automation, portals and scale."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-2xl border p-6 ${
              tier.featured
                ? "border-accent-blue/40 bg-gradient-to-b from-base-panel2 to-base-panel shadow-panel"
                : "border-base-line bg-base-panel2"
            }`}
          >
            <div className="text-sm font-semibold text-slate-100">{tier.name}</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-50">{tier.price}</span>
              <span className="text-sm text-slate-500">{tier.cadence}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{tier.blurb}</p>
            <ul className="mt-5 flex-1 space-y-2">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check size={16} className="mt-0.5 shrink-0 text-status-healthy" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/get-started"
              className={`mt-6 rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${
                tier.featured
                  ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:brightness-110"
                  : "border border-base-line bg-base-panel text-slate-200 hover:border-accent-blue-soft/40"
              }`}
            >
              {tier.price === "Custom" ? "Contact sales" : "Get started"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
