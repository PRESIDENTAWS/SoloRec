import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export function Field({ label, name, ...props }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="w-full rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-blue-soft focus:outline-none focus:ring-1 focus:ring-accent-blue-soft"
        {...props}
      />
    </div>
  );
}
