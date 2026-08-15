import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SoloRec AI — Staffing HQ",
  description: "AI-native operating system for solo recruiters and boutique staffing agencies."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-base-bg text-slate-100">{children}</body>
    </html>
  );
}
