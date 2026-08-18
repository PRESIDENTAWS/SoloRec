import { Rocket } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

export function AuthCard({
  title,
  subtitle,
  children,
  footer
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple text-white">
            <Rocket size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-50">SoloRec AI</div>
            <div className="text-[11px] text-slate-500">Staffing Agency OS</div>
          </div>
        </div>

        <Card>
          <CardBody className="space-y-5">
            <div>
              <h1 className="text-xl font-semibold text-slate-50">{title}</h1>
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            </div>
            {children}
          </CardBody>
        </Card>

        {footer && <div className="mt-5 text-center text-sm text-slate-400">{footer}</div>}
      </div>
    </div>
  );
}
