import Link from "next/link";
import { Rocket } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { LOGIN_LANES, type PortalRole } from "@/lib/auth/roles";

export const metadata = { title: "Log in — SoloRec" };

function resolveRole(param?: string): PortalRole {
  const match = LOGIN_LANES.find((lane) => lane.role === param);
  return match?.role ?? "recruiter";
}

export default function LoginPage({
  searchParams
}: {
  searchParams?: { role?: string };
}) {
  const initialRole = resolveRole(searchParams?.role);

  return (
    <div className="flex min-h-screen flex-col bg-base-bg text-slate-100">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <Link href="/" className="mx-auto flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple text-white">
            <Rocket size={20} aria-hidden="true" />
          </span>
          <span className="text-base font-bold text-slate-50">SoloRec</span>
        </Link>

        <div className="mt-8 rounded-2xl border border-base-line bg-gradient-to-b from-base-panel2 to-base-panel p-6 shadow-panel sm:p-8">
          <h1 className="text-center text-xl font-semibold text-slate-50">Welcome back</h1>
          <p className="mt-1 text-center text-sm text-slate-400">Choose your portal to continue.</p>
          <div className="mt-6">
            <LoginForm initialRole={initialRole} />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to SoloRec?{" "}
          <Link href="/get-started" className="font-semibold text-accent-blue-soft hover:text-white">
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
}
