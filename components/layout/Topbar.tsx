import { SignOutButton } from "@/components/auth/SignOutButton";
import { LiveBadge } from "@/components/realtime/LiveBadge";
import { GlobalSearchForm } from "@/components/layout/GlobalSearchForm";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function Topbar({ userName }: { userName: string }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-base-line bg-base-bg/80 px-6 py-4 backdrop-blur">
      <GlobalSearchForm />

      <div className="flex items-center gap-4">
        <LiveBadge />
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-purple/20 text-sm font-semibold text-accent-purple-soft"
            title={userName}
          >
            {initials(userName)}
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
