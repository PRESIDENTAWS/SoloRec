import Link from "next/link";
import { ArrowRight, Play, Star, Sparkles, Bot, Radio, Users2 } from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { CommandCenterPreview } from "@/components/landing/CommandCenterPreview";
import { FEATURES, AGENT_TEAM, TRUSTED_BY } from "@/lib/landing/content";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-bg text-slate-100">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 50% at 25% 10%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(50% 45% at 85% 20%, rgba(139,92,246,0.16), transparent 60%)"
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              <Sparkles size={13} className="text-accent-purple-soft" aria-hidden="true" />
              AI-POWERED STAFFING OS
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-50 sm:text-5xl">
              The Operating System for Modern{" "}
              <span className="bg-gradient-to-r from-accent-blue-soft to-accent-purple-soft bg-clip-text text-transparent">
                Staffing Agencies
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base text-slate-400">
              SoloRec unifies your people, processes, and AI agents so you can source faster, engage
              better, and grow revenue with less effort.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Book a Demo
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30"
              >
                <Play size={15} aria-hidden="true" />
                See It In Action
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <Bot size={16} className="text-accent-blue-soft" aria-hidden="true" /> AI Agents That Work 24/7
              </span>
              <span className="inline-flex items-center gap-2">
                <Radio size={16} className="text-accent-purple-soft" aria-hidden="true" /> Real-Time Intelligence
              </span>
              <span className="inline-flex items-center gap-2">
                <Users2 size={16} className="text-status-healthy" aria-hidden="true" /> Built for Staffing Teams
              </span>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex gap-0.5 text-amber-400" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-slate-400">Loved by staffing teams nationwide</span>
            </div>
          </div>

          <CommandCenterPreview />
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-y border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Trusted by staffing agencies of all sizes
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUSTED_BY.map((name) => (
              <span key={name} className="text-sm font-semibold tracking-wide text-slate-500">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-50">Everything You Need. Powered by AI.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            SoloRec combines intelligent automation with human expertise to deliver exceptional results.
          </p>
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Icon size={24} className={feature.iconColor} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-100">{feature.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">{feature.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI team */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-50">Meet Your AI Leadership Team</h2>
            <p className="mt-3 text-sm text-slate-400">Nine specialized AI agents. One unified mission: Your success.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {AGENT_TEAM.map((agent) => (
              <div
                key={agent.name}
                className="rounded-2xl border border-white/10 bg-base-panel/60 p-4 text-center transition hover:border-white/20"
              >
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${agent.accent} text-lg font-bold text-white`}>
                  {agent.name.slice(0, 2)}
                </div>
                <div className="mt-3 text-sm font-bold text-slate-50">{agent.name}</div>
                <div className="text-[11px] font-medium text-accent-blue-soft">{agent.role}</div>
                <p className="mt-2 text-[11px] leading-snug text-slate-500">{agent.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-accent-blue/15 to-accent-purple/15 px-8 py-10 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="text-2xl font-bold text-slate-50">Ready to Transform Your Staffing Agency?</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Join forward-thinking agencies using SoloRec to work smarter, place faster, and grow profitably.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Book a Demo
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40"
            >
              <Play size={15} aria-hidden="true" />
              See Platform Tour
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

function LandingFooter() {
  const columns = [
    { heading: "Product", links: ["Features", "Agents", "Integrations", "Security"] },
    { heading: "Solutions", links: ["For Staffing Firms", "For Recruiters", "For Sales Teams", "For Executives"] },
    { heading: "Resources", links: ["Blog", "Webinars", "Case Studies", "Help Center"] },
    { heading: "Company", links: ["About Us", "Careers", "Partners", "Contact"] }
  ];

  const portals = [
    { label: "Recruiter Sign in", href: "/login" },
    { label: "Client Portal", href: "/login/client" },
    { label: "Candidate Portal", href: "/login/candidate" }
  ];

  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple text-white">
                <Sparkles size={16} aria-hidden="true" />
              </span>
              <span className="text-lg font-bold text-slate-50">SoloRec</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              The AI-Powered Operating System for Staffing Agencies.
            </p>
            <div className="mt-5 space-y-1.5">
              {portals.map((portal) => (
                <Link key={portal.href} href={portal.href} className="block text-sm text-slate-400 transition hover:text-accent-blue-soft">
                  {portal.label}
                </Link>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <div className="text-sm font-semibold text-slate-200">{column.heading}</div>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link} className="cursor-default text-sm text-slate-500 transition hover:text-slate-300">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} SoloRec. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
