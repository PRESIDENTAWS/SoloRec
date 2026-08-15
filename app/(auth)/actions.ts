"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientEnv } from "@/lib/env";
import { ensureOrganizationForUser } from "@/lib/auth/bootstrap";

export type AuthFormState = { error: string | null; info?: string | null };

const emailSchema = z.string().min(1, "Email is required").email("Enter a valid email address");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

function getAppUrl(): string {
  return getClientEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
});

export async function signIn(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "Incorrect email or password." };
  }

  const redirectTo = formData.get("redirectTo");
  redirect(typeof redirectTo === "string" && redirectTo ? redirectTo : "/dashboard");
}

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  organizationName: z.string().min(1, "Organization name is required")
});

export async function signUp(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    organizationName: formData.get("organizationName")
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { first_name: parsed.data.firstName, last_name: parsed.data.lastName },
      emailRedirectTo: `${getAppUrl()}/auth/callback`
    }
  });
  if (error) {
    return { error: error.message };
  }
  if (!data.user) {
    return { error: "Sign up failed — please try again." };
  }

  // Organization creation only needs the user's id, which exists regardless
  // of whether email confirmation is required — so the org (and default
  // agent registry) is ready the moment the user actually logs in, whether
  // that's immediately or after confirming their email.
  await ensureOrganizationForUser(data.user.id, { organizationName: parsed.data.organizationName });

  if (!data.session) {
    return { error: null, info: "Check your email to confirm your account, then sign in." };
  }

  redirect("/dashboard");
}

const resetRequestSchema = z.object({ email: emailSchema });

export async function requestPasswordReset(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = resetRequestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = createClient();
  // Supabase always returns success here regardless of whether the email
  // is registered, to avoid leaking which emails have accounts — so this
  // message is accurate either way, not just optimistic.
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`
  });
  if (error) {
    return { error: error.message };
  }

  return { error: null, info: "If an account exists for that email, a reset link is on its way." };
}

const updatePasswordSchema = z.object({ password: passwordSchema });

export async function updatePassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = updatePasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
