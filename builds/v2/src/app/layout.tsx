import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conference Scheduler",
  description: "Schedule talks into rooms and time slots.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-900 antialiased">{children}</body>
    </html>
  );
}
