import type { LucideIcon } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Generic stub for routes that exist to establish navigation/IA now and
 * will be built out in a later sprint (see docs/product/backlog.md). This
 * is intentionally not mock data dressed up as a feature — it says clearly
 * that nothing is wired up yet.
 */
export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center p-6">
      <Card className="max-w-md text-center">
        <CardBody className="flex flex-col items-center gap-4 py-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue-soft">
            <Icon size={28} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-50">{title}</h1>
            <p className="mt-2 text-sm text-slate-400">{description}</p>
          </div>
          <span className="rounded-full border border-base-line bg-base-panel2 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Coming soon — not yet built
          </span>
        </CardBody>
      </Card>
    </div>
  );
}
