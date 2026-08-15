import Link from "next/link";
import type { ComponentProps } from "react";
import { BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS, type ButtonVariant } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
}

export function LinkButton({ variant = "secondary", className, ...props }: LinkButtonProps) {
  return <Link className={cn(BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS[variant], className)} {...props} />;
}
