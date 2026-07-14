import Link from "next/link";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold text-ink">
          <img src="/zhesi-logo.png" alt="哲思学院 logo" className="h-10 w-10 rounded-full border border-academy/20 bg-parchment object-cover" />
          <span>
            <span className="block text-base font-bold text-academy">哲思学院</span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">Zhesi Academy</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/case-study" className="hidden text-sm font-semibold text-slate-600 transition hover:text-academy sm:inline-flex">
            项目案例
          </Link>
          <Link href="/recommend" className="hidden text-sm font-semibold text-slate-600 transition hover:text-academy sm:inline-flex">
            AI 初评
          </Link>
          <span className="rounded-full border border-academy/15 bg-white/80 px-3 py-1 text-xs font-semibold text-academy shadow-sm">
            Portfolio MVP
          </span>
        </div>
      </nav>
      {children}
    </main>
  );
}
