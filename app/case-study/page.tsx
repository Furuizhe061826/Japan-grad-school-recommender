import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";

const overviewItems = [
  ["项目定位", "面向日本大学院申请人群的院校、研究科与导师推荐网页 MVP。"],
  ["项目目标", "基于用户背景、语言成绩、研究方向和地区偏好，输出冲刺 / 匹配 / 相对稳妥三档推荐结果。"],
  ["我的角色", "产品设计、字段设计、推荐逻辑设计、AI 辅助开发、数据结构化、部署上线。"],
  ["技术栈", "Next.js、TypeScript、Tailwind CSS、本地 JSON 数据库、规则推荐算法、Vercel。"]
];

const painPoints = [
  "日本大学院申请信息分散，学生难以快速判断院校、研究科和导师匹配度。",
  "学生背景差异大，本科院校层次、GPA、语言成绩和研究经历都需要结构化判断。",
  "研究方向与教授/研究室匹配过程复杂，传统咨询依赖人工经验，成本较高。",
  "申请人很难知道推荐结果背后的依据，也难以判断哪些信息仍需官网核验。"
];

const productFlow = ["用户背景输入", "申请画像结构化", "院校/教授库匹配", "规则评分与分档", "输出可解释报告"];

const features = [
  ["背景填写", "收集本科背景、GPA、语言成绩、目标学位、地区偏好和补充经历。"],
  ["意向院校评估", "如果用户已有目标学校，单独判断该院校申请可行性和校内更匹配方向。"],
  ["三档推荐", "生成冲刺、匹配、相对稳妥组合，避免只输出单一学校列表。"],
  ["教授/研究室匹配", "基于正教授资料和研究关键词，提示潜在研究室与核验风险。"],
  ["解释型结果", "展示推荐理由、短板、评分拆解、数据可信度和募集要项核验状态。"],
  ["报告复制", "将结果整理为自然语言咨询报告，便于二次编辑和作品集展示。"]
];

const scoringWeights = [
  ["研究课题匹配度", "25%"],
  ["教授 / 实验室匹配度", "20%"],
  ["申请难度匹配", "12%"],
  ["GPA 与学术成绩", "10%"],
  ["本科专业及院校背景", "8%"],
  ["英语竞争力", "8%"],
  ["研究经历 / 科研能力", "7%"],
  ["日语竞争力", "5%"],
  ["地区偏好", "3%"],
  ["学位及申请资格匹配", "2%"]
];

const dataSources = [
  ["programs.json", "日本大学、研究科、项目方向、申请难度、语言要求和募集要项状态。"],
  ["facultyProfiles.json", "教授/研究室样例资料，用于导师匹配和研究方向解释。"],
  ["chinaUniversities.json", "中国本科院校识别库，用于自动判断本科背景层次。"],
  ["researchSynonyms.json", "研究方向同义词库，将中文自然表达映射到中英日关键词。"]
];

const values = [
  "将真实留学咨询场景拆解成可交互产品 MVP，完成从需求到上线的闭环。",
  "把非结构化申请信息转化为可计算字段，体现数据产品设计与规则建模能力。",
  "通过可解释推荐理由、风险提示和数据可信度，降低黑箱式推荐的不确定感。",
  "适合作为 AI 产品、数据分析、项目管理和全球培训生岗位的作品集案例。"
];

const roadmap = [
  "接入真实大模型 API，实现自然语言背景解析和更自然的咨询报告生成。",
  "接入募集要项 PDF / 官网信息，通过 RAG 实现官方信息检索与引用。",
  "继续扩充日本院校、研究科、教授/研究室和招生状态数据。",
  "增加推荐报告导出、用户收藏、院校对比和申请进度管理功能。"
];

export default function CaseStudyPage() {
  return (
    <SiteShell>
      <section className="mx-auto mt-8 max-w-6xl rounded-[2rem] border border-academy/10 bg-white/90 px-6 py-10 shadow-soft sm:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Portfolio Case Study</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-ink sm:text-5xl">
              哲思学园 AI 日本大学院申请规划助手
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              一个面向求职展示的 AI 辅助开发产品项目：把日本大学院选校、研究科匹配、导师筛选和申请风险判断，整理成可交互、可解释、可持续扩展的网页 MVP。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/recommend" className="rounded-full bg-academy px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-umber">
                体验在线工具
              </Link>
              <a
                href="https://github.com/Furuizhe061826/Japan-grad-school-recommender"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-academy/20 bg-parchment px-6 py-3 text-sm font-semibold text-academy transition hover:bg-white"
              >
                查看 GitHub
              </a>
              <Link href="/" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-academy/30 hover:text-academy">
                返回首页
              </Link>
            </div>
          </div>
          <div className="w-full max-w-xs rounded-2xl border border-academy/10 bg-parchment p-6 text-center">
            <img src="/zhesi-logo.png" alt="哲思学园 logo" className="mx-auto h-28 w-28 rounded-full border border-academy/20 bg-white object-cover" />
            <p className="mt-5 text-sm font-semibold text-academy">Demo 链接</p>
            <p className="mt-2 break-all text-sm leading-6 text-slate-600">japan-grad-school-recommender.vercel.app</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-2">
        {overviewItems.map(([title, content]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-academy">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">{content}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-8 max-w-6xl rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-academy">User Pain Points</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">用户痛点</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {painPoints.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-academy" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ocean">Product Flow</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">产品流程</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-5">
              {productFlow.map((step, index) => (
                <div key={step} className="rounded-xl bg-mist p-4">
                  <p className="text-xs font-bold text-academy">0{index + 1}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink">{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              这个流程的重点不是替代录取判断，而是把“应该如何选校、该看哪些证据、哪些地方还需要核验”变成清晰的产品输出。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-academy">Core Features</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">核心功能</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            页面围绕“输入背景、生成推荐、解释依据、提示风险”四个环节设计，适合截图放入作品集。
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, content]) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
              <h3 className="text-base font-bold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{content}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-academy">Recommendation Logic</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">推荐逻辑与评分权重</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            MVP 阶段使用规则推荐模拟 AI 咨询结果。系统先做候选召回，再结合研究方向、教授匹配、申请难度、语言门槛和用户偏好进行综合评分。
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {scoringWeights.map(([label, weight]) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-mist px-4 py-3 text-sm">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="font-bold text-academy">{weight}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-600">
            语言成绩采用“是否达到最低门槛 + 超过门槛后的少量竞争力加分”，避免简单线性加分；院校层级不直接等同于匹配度，而是放入申请难度和背景竞争力中解释。
          </p>
        </div>

        <div className="rounded-2xl border border-academy/10 bg-parchment p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-academy">Data Structure</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">本地数据结构</h2>
          <div className="mt-5 space-y-3">
            {dataSources.map(([file, content]) => (
              <div key={file} className="rounded-xl bg-white/75 p-4">
                <p className="font-mono text-sm font-bold text-umber">{file}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-academy">Project Value</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">项目价值</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
            {values.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-ink p-6 text-white shadow-soft sm:p-8">
          <p className="text-sm font-semibold text-gold">Next Iterations</p>
          <h2 className="mt-2 text-2xl font-bold">后续迭代方向</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            {roadmap.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl rounded-2xl border border-academy/10 bg-white/85 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-academy">For Interview</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">适合面试中重点讲的能力</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              这个项目可以从产品拆解、数据结构化、推荐规则、可解释 AI、AI 辅助开发、部署上线六个角度展开。面试时可以先演示在线工具，再用本页说明项目方法论和后续规划。
            </p>
          </div>
          <Link href="/recommend" className="inline-flex shrink-0 justify-center rounded-full bg-academy px-7 py-3 text-sm font-semibold text-white transition hover:bg-umber">
            现场演示工具
          </Link>
        </div>
      </section>

      <Disclaimer />
    </SiteShell>
  );
}
