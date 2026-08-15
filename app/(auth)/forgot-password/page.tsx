"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { requestPasswordReset, type AuthFormState } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field } from "@/components/auth/Field";
import { FormError, FormInfo } from "@/components/ui/FormMessages";
import { SubmitButton } from "@/components/auth/SubmitButton";

const initialState: AuthFormState = { error: null };

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(requestPasswordReset, initialState);

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link href="/login" className="text-accent-blue-soft hover:underline">
          Back to sign in
        </Link>
      }
    >
      {state.info ? (
        <FormInfo message={state.info} />
      ) : (
        <form action={formAction} className="space-y-4">
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <FormError message={state.error} />
          <SubmitButton>Send reset link</SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}
