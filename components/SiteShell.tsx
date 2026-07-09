import Link from "next/link";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-ink">
          AI Japan Study
        </Link>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">
          Portfolio MVP
        </span>
      </nav>
      {children}
    </main>
  );
}
