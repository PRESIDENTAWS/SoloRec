import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SoloRec — The AI Operating System for Staffing & Recruiting",
  description:
    "SoloRec is the all-in-one staffing & recruiting operating system: sourcing, screening, engagement, scheduling, job intelligence, CRM, compliance, placements, analytics and AI agents."
};

/**
 * Root layout — html/body and fonts only. It deliberately renders no app
 * chrome: each surface brings its own shell (the recruiter OS via app/(os),
 * the public site via app/(marketing), and the client/candidate portals via
 * their own layouts), so one identity system can deliver three experiences.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
