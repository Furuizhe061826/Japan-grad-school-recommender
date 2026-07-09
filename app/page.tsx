import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";

export default function HomePage() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-6xl items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-sakura">Japan Graduate School Planner</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-6xl">
            AI 日本留学院校推荐助手
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            根据学生背景、研究方向、语言成绩和目标偏好，推荐日本大学院申请方案，并生成冲刺、匹配、相对稳妥三档结果。
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/recommend"
              className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              开始推荐
            </Link>
            <span className="text-sm text-slate-500">本地 JSON 数据 + 规则推荐逻辑，无需接入真实 API。</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white bg-white/80 p-5 shadow-soft backdrop-blur">
          <div className="rounded-[1.5rem] bg-mist p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">推荐概览</span>
              <span className="rounded-full bg-matcha px-3 py-1 text-xs font-semibold text-white">模拟 AI</span>
            </div>
            <div className="space-y-4">
              {[
                ["冲刺", "University of Tokyo", "匹配度 82"],
                ["匹配", "Osaka University", "匹配度 87"],
                ["相对稳妥", "Hokkaido University", "匹配度 91"]
              ].map(([band, school, score]) => (
                <div key={band} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-ocean">{band}项目</p>
                      <p className="mt-1 font-semibold text-ink">{school}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Disclaimer />
    </SiteShell>
  );
}
