import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:brightness-110 focus-visible:ring-accent-blue-soft",
  secondary:
    "bg-base-panel2 text-slate-100 border border-base-line hover:border-accent-blue-soft/50 focus-visible:ring-accent-blue-soft",
  ghost: "text-slate-300 hover:text-white hover:bg-white/5 focus-visible:ring-accent-blue-soft",
  danger:
    "bg-status-blocked/15 text-status-blocked border border-status-blocked/30 hover:bg-status-blocked/25 focus-visible:ring-status-blocked"
};

export const BUTTON_BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base-bg disabled:cursor-not-allowed disabled:opacity-50";

export function Button({ variant = "secondary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS[variant], className)}
      {...props}
    />
  );
}
