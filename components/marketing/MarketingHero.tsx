import type { ReactNode } from "react";

/** Simple centered hero for interior marketing pages. */
export function MarketingHero({
  eyebrow,
  title,
  subtitle,
  children
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-10 pt-16 text-center sm:pt-20">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
        {eyebrow}
      </div>
      <h1 className="mt-4 text-3xl font-bold text-slate-50 sm:text-4xl">{title}</h1>
      {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">{subtitle}</p> : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}
