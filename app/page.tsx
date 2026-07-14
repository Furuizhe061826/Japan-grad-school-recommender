import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";

const capabilities = [
  ["背景结构化", "本科院校层次、GPA、语言成绩、目标学位和地区偏好会被整理成可计算画像。"],
  ["方向词库理解", "将抗震、图像、机械、材料、经营学等自然表达映射到中英日关键词。"],
  ["院校三档推荐", "输出冲刺、匹配、相对稳妥三档方案，并保留每条推荐的评分拆解。"],
  ["导师研究室匹配", "基于正教授资料库和研究关键词，提示潜在教授/研究室及核验风险。"],
  ["数据可信度提示", "标注募集要项核验、教授库覆盖和没有命中导师时的可能原因。"],
  ["咨询报告复制", "生成自然语言推荐报告，方便继续整理成申请规划或面试展示材料。"]
];

const roleItems = ["产品定位", "字段设计", "推荐规则", "数据结构化", "前端实现", "部署上线"];

const stackItems = ["Next.js", "TypeScript", "Tailwind CSS", "Local JSON", "Rule-based recommendation", "Vercel"];

export default function HomePage() {
  return (
    <SiteShell>
      <section className="relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-[2rem] border border-academy/10 bg-parchment px-6 py-12 shadow-soft sm:px-10 lg:px-12">
        <img
          src="/zhesi-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-8 hidden w-[28rem] opacity-15 lg:block"
        />

        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-academy px-3 py-1 text-xs font-semibold text-white">哲思学院旗下工具</span>
            <span className="rounded-full border border-academy/20 bg-white/70 px-3 py-1 text-xs font-semibold text-academy">
              Portfolio MVP / Demo Project
            </span>
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-gold">Zhesi Academy Japan Graduate Planner</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-ink sm:text-6xl">
            AI 日本大学院申请规划助手
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            基于学生背景、研究方向、语言成绩和目标偏好，生成日本大学院院校、研究科与导师匹配建议。项目用于展示 AI 产品设计、数据结构化和规则推荐系统落地能力。
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/recommend"
              className="rounded-full bg-academy px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-umber"
            >
              开始 AI 初评
            </Link>
            <Link
              href="/case-study"
              className="rounded-full border border-academy/20 bg-white/80 px-7 py-3 text-sm font-semibold text-academy transition hover:bg-white"
            >
              查看项目案例
            </Link>
            <a
              href="https://github.com/Furuizhe061826/Japan-grad-school-recommender"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-academy/20 bg-white/80 px-7 py-3 text-sm font-semibold text-academy transition hover:bg-white"
            >
              查看 GitHub
            </a>
          </div>
        </div>

        <div className="relative mt-12 grid gap-3 sm:grid-cols-3">
          {[
            ["65+", "日本大学候选池"],
            ["270+", "研究科/项目方向"],
            ["3000+", "教授/研究者资料"]
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-academy/10 bg-white/75 p-4">
              <p className="text-2xl font-bold text-academy">{value}</p>
              <p className="mt-1 text-sm text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-academy">Product Capability</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">从留学咨询需求拆解出的 AI 数据产品</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            当前版本不承诺录取概率，而是用结构化数据和可解释规则帮助用户判断申请方向、数据依据和准备重点。
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
              <h3 className="text-base font-bold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="project" className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-academy/10 bg-white/85 p-6 shadow-sm">
          <p className="text-sm font-semibold text-academy">Portfolio Context</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">求职展示定位</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            本项目为个人主导设计与开发的产品 MVP，用于展示产品规划、用户流程、推荐逻辑、数据治理和 AI 辅助开发能力。它采用本地 JSON 数据和规则算法模拟 AI 咨询结果，适合在简历、作品集和面试中展示。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {roleItems.map((item) => (
              <span key={item} className="rounded-full bg-parchment px-3 py-1 text-xs font-semibold text-umber">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
          <p className="text-sm font-semibold text-ocean">Implementation</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">技术与数据结构</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {stackItems.map((item) => (
              <div key={item} className="rounded-xl bg-mist p-4 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-600">
            后续可在现有候选召回和评分规则之上接入真实大模型 API、募集要项 RAG 检索、用户收藏、院校对比和咨询预约入口。
          </p>
          <Link href="/case-study" className="mt-5 inline-flex text-sm font-semibold text-academy transition hover:text-umber">
            查看完整项目案例 →
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl rounded-2xl border border-slate-200 bg-ink p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-gold">Try the MVP</p>
            <h2 className="mt-2 text-2xl font-bold">输入背景，生成一份可解释的申请初评报告</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              结果包含三档院校推荐、意向院校可行性判断、教授/研究室匹配、评分解释和数据可信度提示。
            </p>
          </div>
          <Link
            href="/recommend"
            className="inline-flex shrink-0 justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-ink transition hover:bg-parchment"
          >
            进入推荐工具
          </Link>
        </div>
      </section>

      <Disclaimer />
    </SiteShell>
  );
}
