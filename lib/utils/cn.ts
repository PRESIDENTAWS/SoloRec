type ClassValue = string | number | null | undefined | false;

/** Minimal className joiner — avoids pulling in clsx/tailwind-merge for one helper. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
