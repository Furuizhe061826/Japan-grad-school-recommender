"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";
import { buildRecommendationReport, generateRecommendations } from "@/lib/recommendation";
import type { RecommendationBand, RecommendationResult, RecommendedProgram, StudentProfile } from "@/types/recommendation";

const bandStyles: Record<RecommendationBand, string> = {
  冲刺: "border-sakura/30 bg-sakura/10 text-sakura",
  匹配: "border-ocean/30 bg-ocean/10 text-ocean",
  相对稳妥: "border-matcha/30 bg-matcha/10 text-matcha"
};

export default function ResultPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("studentProfile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const result = useMemo<RecommendationResult | null>(() => {
    if (!profile) return null;
    return generateRecommendations(profile);
  }, [profile]);

  async function copyReport() {
    if (!result) return;
    await navigator.clipboard.writeText(buildRecommendationReport(result));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (!result) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-3xl py-24 text-center">
          <h1 className="text-3xl font-bold text-ink">还没有可用的推荐信息</h1>
          <p className="mt-4 text-slate-600">请先填写申请背景，再生成推荐结果。</p>
          <Link href="/recommend" className="mt-8 inline-flex rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white">
            去填写信息
          </Link>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl py-12">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold text-sakura">Step 2 / 推荐结果</p>
            <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">你的日本大学院申请组合</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{result.summary}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyReport}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800"
            >
              {copied ? "已复制" : "复制推荐报告"}
            </button>
            <Link
              href="/recommend"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              重新填写
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {(["冲刺", "匹配", "相对稳妥"] as RecommendationBand[]).map((band) => (
            <section key={band} className="space-y-4">
              <div className={`rounded-2xl border px-5 py-4 ${bandStyles[band]}`}>
                <h2 className="text-xl font-bold">{band}项目</h2>
                <p className="mt-1 text-sm opacity-80">
                  {band === "冲刺" ? "适合大胆尝试，需强化亮点。" : band === "匹配" ? "综合条件较接近，建议重点准备。" : "在当前高关注院校池中相对更稳。"}
                </p>
              </div>

              {result.programs[band].map((program) => (
                <article
                  key={`${band}-${program.universityName}-${program.graduateSchool}-${program.programName}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-ink">{program.universityName}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{program.graduateSchool}</p>
                      <p className="mt-1 text-sm text-slate-500">{program.programName}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {program.score}
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <Info label="地区" value={program.region} />
                    <Info label="推荐档位" value={program.band} />
                    <Info label="方向匹配" value={`${program.researchMatchScore} 分`} />
                    <Info label="研究方向" value={program.researchFields.slice(0, 3).join(" / ")} />
                    <Info label="命中关键词" value={program.matchedKeywords.length > 0 ? program.matchedKeywords.join(" / ") : "暂无明确命中"} />
                    <Info label="适配学位" value={program.degreeOptions.join(" / ")} />
                    <Info label="英语要求" value={program.englishRequirement} />
                    <Info label="日语要求" value={program.japaneseRequirement} />
                  </dl>

                  <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                    <div>
                      <p className="font-semibold text-ink">推荐理由</p>
                      <p className="mt-1">{program.reasons.join(" ")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-ink">需要提升的地方</p>
                      <p className="mt-1">{program.improvements.join(" ")}</p>
                    </div>
                    <ScoreBreakdown program={program} />
                    <p className="rounded-xl bg-mist p-3 text-xs text-slate-500">{program.notes}</p>
                    <AdmissionInfoBlock program={program} />
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>
      </section>
      <Disclaimer />
    </SiteShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-mist p-3">
      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-700">{value}</dd>
    </div>
  );
}

function AdmissionInfoBlock({ program }: { program: RecommendedProgram }) {
  if (!program.admissionInfo) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-3 text-xs leading-5 text-slate-500">
        该项目募集要项待逐项核验，当前申请条件请以研究科官网最新信息为准。
      </div>
    );
  }

  const info = program.admissionInfo;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-ink">募集要项参考</p>
        <span className="rounded-full bg-matcha/10 px-2 py-1 font-semibold text-matcha">{info.verificationStatus}</span>
      </div>
      <dl className="mt-3 space-y-2">
        <AdmissionRow label="申请时间" value={info.applicationPeriod} />
        <AdmissionRow label="选拔方式" value={info.examMethod} />
        <AdmissionRow label="常见材料" value={info.requiredDocuments.join(" / ")} />
        <AdmissionRow label="导师联系" value={info.supervisorContact} />
        <AdmissionRow label="语言提示" value={info.languageNotes} />
        <AdmissionRow label="资格提示" value={info.eligibilityNotes} />
      </dl>
      <a
        href={info.guideUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex font-semibold text-ocean underline-offset-4 hover:underline"
      >
        查看官方页面：{info.sourceLabel}
      </a>
      <p className="mt-2 text-[11px] text-slate-400">核验日期：{info.lastChecked}</p>
    </div>
  );
}

function ScoreBreakdown({ program }: { program: RecommendedProgram }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-ink">评分拆解</p>
        <p className="text-xs text-slate-500">分数 x 权重</p>
      </div>
      <div className="mt-3 space-y-2">
        {program.scoreBreakdown.map((item) => (
          <div key={item.key}>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-600">{item.label}</span>
              <span className="tabular-nums text-slate-500">
                {item.score} x {Math.round(item.weight * 100)}% = {item.contribution}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist">
              <div className="h-full rounded-full bg-ocean" style={{ width: `${Math.max(4, Math.min(100, item.score))}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdmissionRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-600">{value}</dd>
    </div>
  );
}
