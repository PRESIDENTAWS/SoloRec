import Link from "next/link";
import { ArrowRight, Building2, UserRound, Users, ChevronRight } from "lucide-react";
import { PRODUCT_MODULES } from "@/lib/marketing/products";

const PORTALS = [
  {
    icon: Users,
    title: "Recruiters & Agencies",
    body: "Run the full desk — sourcing, pipeline, BD, compliance and an AI workforce — in one operating system.",
    cta: "Enter the OS",
    href: "/login"
  },
  {
    icon: Building2,
    title: "Clients",
    body: "Submit hiring needs, review candidate packets, approve offers and see invoices without emailing for updates.",
    cta: "Client login",
    href: "/login"
  },
  {
    icon: UserRound,
    title: "Candidates",
    body: "See job matches, application status, interviews, messages and documents in one private place.",
    cta: "Candidate login",
    href: "/login"
  }
];

const FEATURES = [
  {
    title: "One record, every source",
    body: "A canonical job model folds LinkedIn, Indeed, ATS and career-site listings into a single opportunity with history."
  },
  {
    title: "Revenue intelligence, not just search",
    body: "Ghost Risk, Hiring Probability and Staffing Opportunity scores tell you which accounts are worth a call today."
  },
  {
    title: "An AI workforce with guardrails",
    body: "Named agents draft, recommend and — only with human approval — execute across the entire recruiting lifecycle."
  },
  {
    title: "Client & candidate portals",
    body: "Turn internal agency software into a customer-facing platform with self-serve portals for both sides of the desk."
  }
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-base-line bg-base-panel2 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-blue-soft">
            SoloRec Platform
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-tight text-slate-50 sm:text-5xl">
            The All-in-One Staffing &amp; Recruiting Operating System
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Source, screen, engage, place and bill — powered by job intelligence and an AI
            workforce. One platform for recruiters, clients and candidates.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Get Started <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border border-base-line bg-base-panel2 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-accent-blue-soft/40"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Product pipeline */}
      <section className="border-y border-base-line bg-base-panel/40">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            One continuous workflow
          </div>
          <div className="mt-6 flex flex-wrap items-stretch justify-center gap-2">
            {PRODUCT_MODULES.map((module, i) => {
              const Icon = module.icon;
              return (
                <div key={module.name} className="flex items-center gap-2">
                  <div className="w-32 rounded-xl border border-base-line bg-base-panel2 p-3 text-center">
                    <Icon
                      size={18}
                      className="mx-auto text-accent-blue-soft"
                      aria-hidden="true"
                    />
                    <div className="mt-2 text-sm font-semibold text-slate-100">{module.name}</div>
                    <div className="mt-1 text-[11px] leading-snug text-slate-500">
                      {module.tagline}
                    </div>
                  </div>
                  {i < PRODUCT_MODULES.length - 1 ? (
                    <ChevronRight
                      size={16}
                      className="hidden shrink-0 text-slate-600 lg:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portals */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl">One platform, three experiences</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            One identity system with role-based access — recruiters, clients and candidates each get
            their own portal.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.title}
                className="flex flex-col rounded-2xl border border-base-line bg-gradient-to-b from-base-panel2 to-base-panel p-6 shadow-panel"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue-soft">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-50">{portal.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-400">{portal.body}</p>
                <Link
                  href={portal.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue-soft transition hover:text-white"
                >
                  {portal.cta} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-base-line bg-base-panel/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl">
            Built to take a staffing business from signal to revenue
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-base-line bg-base-panel2 p-6">
                <h3 className="text-base font-semibold text-slate-50">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-base-line bg-gradient-to-r from-accent-blue/15 to-accent-purple/15 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl">
            Run your whole desk on SoloRec
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Replace the stack of point tools with one AI-native operating system.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Get Started <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-base-line bg-base-panel2 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-accent-blue-soft/40"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
