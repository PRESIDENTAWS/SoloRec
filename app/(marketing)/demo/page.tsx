import Link from "next/link";
import { MarketingHero } from "@/components/marketing/MarketingHero";

export const metadata = { title: "Book a Demo — SoloRec" };

export default function DemoPage() {
  return (
    <div className="pb-24">
      <MarketingHero
        eyebrow="Demo"
        title="See SoloRec on your desk"
        subtitle="Walk through job intelligence, the AI workforce and the client & candidate portals with our team."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/get-started"
            className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-base-line bg-base-panel2 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-accent-blue-soft/40"
          >
            Explore the portals
          </Link>
        </div>
      </MarketingHero>
      <p className="mx-auto max-w-md px-6 text-center text-sm text-slate-500">
        A scheduling flow will live here. For now, start a workspace and explore the product
        directly.
      </p>
    </div>
  );
}
