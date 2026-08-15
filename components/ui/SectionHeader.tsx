import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-base-line px-5 py-4">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          {eyebrow}
        </div>
        <h2 className="mt-1 text-lg font-semibold text-slate-50">{title}</h2>
      </div>
      {action}
    </div>
  );
}
