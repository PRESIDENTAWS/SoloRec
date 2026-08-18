import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { LOGIN_LANES } from "@/lib/auth/roles";

export const metadata = { title: "Get Started — SoloRec" };

export default function GetStartedPage() {
  return (
    <div className="pb-24">
      <MarketingHero
        eyebrow="Get Started"
        title="Start on SoloRec today"
        subtitle="Choose how you'll use the platform. This starter runs on demo data — pick a portal to explore it."
      />
      <div className="mx-auto grid max-w-4xl gap-4 px-6 sm:grid-cols-3">
        {LOGIN_LANES.map((lane) => (
          <Link
            key={lane.role}
            href={`/login?role=${lane.role}`}
            className="flex flex-col rounded-2xl border border-base-line bg-base-panel2 p-6 transition hover:border-accent-blue-soft/40"
          >
            <h2 className="text-lg font-semibold text-slate-50">{lane.label}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-400">{lane.description}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue-soft">
              Continue <ArrowRight size={15} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
