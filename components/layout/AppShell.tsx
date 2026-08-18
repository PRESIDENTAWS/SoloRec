import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function AppShell({
  children,
  orgName,
  userName
}: {
  children: ReactNode;
  orgName: string;
  userName: string;
}) {
  return (
    <div className="flex min-h-screen bg-base-bg text-slate-100">
      <Sidebar orgName={orgName} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar userName={userName} />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
