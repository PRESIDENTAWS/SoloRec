"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { signIn, type AuthFormState } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field } from "@/components/auth/Field";
import { FormError } from "@/components/ui/FormMessages";
import { SubmitButton } from "@/components/auth/SubmitButton";

const initialState: AuthFormState = { error: null };

/**
 * Login form for the client and candidate portals. Reuses the same Supabase
 * Auth `signIn` action as the recruiter login — the only difference is where
 * it lands (`redirectTo`) and the surrounding copy. Portal users are real
 * Supabase Auth users; linking an auth user to a specific candidate/client
 * record is a follow-up (see /portal pages).
 */
export function PortalLoginForm({
  title,
  subtitle,
  redirectTo,
  otherPortalHref,
  otherPortalLabel
}: {
  title: string;
  subtitle: string;
  redirectTo: string;
  otherPortalHref: string;
  otherPortalLabel: string;
}) {
  const [state, formAction] = useFormState(signIn, initialState);

  return (
    <AuthCard
      title={title}
      subtitle={subtitle}
      footer={
        <div className="space-y-1">
          <div>
            <Link href={otherPortalHref} className="text-accent-blue-soft hover:underline">
              {otherPortalLabel}
            </Link>
          </div>
          <div className="text-slate-500">
            Are you a recruiter?{" "}
            <Link href="/login" className="text-accent-blue-soft hover:underline">
              Recruiter sign in
            </Link>
          </div>
        </div>
      }
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" required />
        <FormError message={state.error} />
        <SubmitButton>Sign in</SubmitButton>
      </form>
    </AuthCard>
  );
}
