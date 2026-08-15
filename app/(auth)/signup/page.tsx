"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { signUp, type AuthFormState } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field } from "@/components/auth/Field";
import { FormError, FormInfo } from "@/components/ui/FormMessages";
import { SubmitButton } from "@/components/auth/SubmitButton";

const initialState: AuthFormState = { error: null };

export default function SignupPage() {
  const [state, formAction] = useFormState(signUp, initialState);

  return (
    <AuthCard
      title="Create your agency"
      subtitle="Set up SoloRec for your team in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-accent-blue-soft hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {state.info ? (
        <FormInfo message={state.info} />
      ) : (
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" name="firstName" autoComplete="given-name" required />
            <Field label="Last name" name="lastName" autoComplete="family-name" required />
          </div>
          <Field
            label="Organization name"
            name="organizationName"
            placeholder="e.g. Acme Recruiting"
            required
          />
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <FormError message={state.error} />
          <SubmitButton>Create account</SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}
