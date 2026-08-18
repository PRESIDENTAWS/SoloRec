"use client";

import { Suspense } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, type AuthFormState } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field } from "@/components/auth/Field";
import { FormError } from "@/components/ui/FormMessages";
import { SubmitButton } from "@/components/auth/SubmitButton";

const initialState: AuthFormState = { error: null };

function LoginForm() {
  const [state, formAction] = useFormState(signIn, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back to your agency's command center."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent-blue-soft hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" required />
        <div className="text-right text-sm">
          <Link href="/forgot-password" className="text-slate-400 hover:text-accent-blue-soft">
            Forgot password?
          </Link>
        </div>
        <FormError message={state.error} />
        <SubmitButton>Sign in</SubmitButton>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
