import type { ReactNode } from "react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

/**
 * Public website chrome — the commercial front door. No recruiter sidebar; a
 * marketing header and footer wrap the homepage and the Products / Solutions /
 * Pricing / Resources / Demo / Get Started pages.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-base-bg text-slate-100">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
