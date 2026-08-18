"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LOGIN_LANES, type PortalRole } from "@/lib/auth/roles";
import { authService } from "@/services/auth/authService";

export function LoginForm({ initialRole }: { initialRole: PortalRole }) {
  const router = useRouter();
  const [role, setRole] = useState<PortalRole>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const activeLane = LOGIN_LANES.find((lane) => lane.role === role) ?? LOGIN_LANES[0]!;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    const { redirectTo } = await authService.login({ email, password, role });
    router.push(redirectTo);
  }

  return (
    <div>
      {/* Role lanes — one identity, three destinations. */}
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-base-line bg-base-panel2 p-1">
        {LOGIN_LANES.map((lane) => {
          const active = lane.role === role;
          return (
            <button
              key={lane.role}
              type="button"
              onClick={() => setRole(lane.role)}
              aria-pressed={active}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition sm:text-sm ${
                active
                  ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              {lane.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-sm text-slate-400">{activeLane.description}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-base-line bg-base-panel2 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent-blue-soft/50 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-base-line bg-base-panel2 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent-blue-soft/50 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : `Continue as ${activeLane.label}`}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-600">
        Demo login — no credentials are checked. You'll land in the {activeLane.label} portal.
      </p>
    </div>
  );
}
