"use client";

import { useFormState } from "react-dom";
import { updatePassword, type AuthFormState } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field } from "@/components/auth/Field";
import { FormError } from "@/components/ui/FormMessages";
import { SubmitButton } from "@/components/auth/SubmitButton";

const initialState: AuthFormState = { error: null };

/** Landed on after clicking the email reset link — /auth/callback exchanges
 * the link's code for a session before redirecting here, so the user is
 * already authenticated by the time this form submits. */
export default function ResetPasswordPage() {
  const [state, formAction] = useFormState(updatePassword, initialState);

  return (
    <AuthCard title="Set a new password" subtitle="Choose a new password for your account.">
      <form action={formAction} className="space-y-4">
        <Field
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <FormError message={state.error} />
        <SubmitButton>Update password</SubmitButton>
      </form>
    </AuthCard>
  );
}
