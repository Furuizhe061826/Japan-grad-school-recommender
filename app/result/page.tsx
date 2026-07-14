"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";
import { buildRecommendationReport, generateRecommendations } from "@/lib/recommendation";
import type {
  RecommendationBand,
  RecommendationResult,
  RecommendedProgram,
  StudentProfile,
  TargetUniversityAssessment
} from "@/types/recommendation";

const bandStyles: Record<RecommendationBand, string> = {
  冲刺: "border-sakura/30 bg-sakura/10 text-sakura",
  匹配: "border-ocean/30 bg-ocean/10 text-ocean",
  相对稳妥: "border-matcha/30 bg-matcha/10 text-matcha"
};

const assessmentStyles: Record<TargetUniversityAssessment["probabilityLabel"], string> = {
  较高: "border-matcha/30 bg-matcha/10 text-matcha",
  中等: "border-ocean/30 bg-ocean/10 text-ocean",
  偏低: "border-amber-200 bg-amber-50 text-amber-700",
  高风险: "border-sakura/30 bg-sakura/10 text-sakura",
  暂无法判断: "border-slate-200 bg-slate-50 text-slate-600"
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

        <div className="mb-8 rounded-2xl border border-academy/15 bg-parchment/70 px-5 py-4 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-academy">评分口径说明</p>
          <p className="mt-1">
            页面分数表示申请材料与项目的综合适配度，不是录取概率。语言、学位资格和教授证据会作为前置条件检查；未满足时即使研究方向相近，也会扣分、限制分数上限或调整到冲刺档。
          </p>
        </div>

        {result.targetAssessment && <TargetAssessmentBlock assessment={result.targetAssessment} />}

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
                      <h3 className="text-lg font-bold text-ink">{program.universityDisplayName}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{program.graduateSchool}</p>
                      <p className="mt-1 text-sm text-slate-500">{program.programName}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                        适配度 {program.score}
                      </span>
                      <span className={riskBadgeClass(program.riskLevel)}>{program.riskLevel}</span>
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <Info label="地区" value={program.region} />
                    <Info label="推荐档位" value={program.band} />
                    <Info label="申请风险" value={program.riskLevel} />
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
                    <ApplicationChecksBlock program={program} />
                    <ReliabilityBlock program={program} />
                    <ScoreInsightsBlock program={program} />
                    <ScoreBreakdown program={program} />
                    <FacultyMatchesBlock program={program} />
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

function TargetAssessmentBlock({ assessment }: { assessment: TargetUniversityAssessment }) {
  const scoreText = assessment.probabilityScore > 0 ? `${assessment.probabilityScore} 分` : "暂无分数";
  const hasBestPrograms = assessment.bestPrograms.length > 0;
  const hasFacultyMatches = assessment.facultyMatches.length > 0;

  return (
    <section className="mb-8 rounded-2xl border border-ocean/15 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-ocean">意向院校评估</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">针对目标学校的申请可行性判断</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">{assessment.summary}</p>
        </div>
        <div className={`min-w-40 rounded-2xl border px-5 py-4 ${assessmentStyles[assessment.probabilityLabel]}`}>
          <p className="text-xs font-semibold opacity-80">申请适配判断</p>
          <p className="mt-1 text-3xl font-bold">{assessment.probabilityLabel}</p>
          <p className="mt-1 text-sm font-semibold">{scoreText}</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <Info label="输入院校" value={assessment.requestedUniversity} />
        <Info label="识别院校" value={assessment.resolvedUniversityDisplayName ?? assessment.resolvedUniversityName ?? "当前数据库暂未识别"} />
      </dl>

      {assessment.alternativeUniversityNames.length > 0 && (
        <p className="mt-3 rounded-xl bg-mist p-3 text-sm leading-6 text-slate-600">
          你也可以对比这些已收录院校：{assessment.alternativeUniversityNames.join(" / ")}
        </p>
      )}

      {hasBestPrograms && (
        <div className="mt-6">
          <h3 className="text-base font-bold text-ink">校内更匹配的项目方向</h3>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {assessment.bestPrograms.slice(0, 3).map((program) => (
              <div
                key={`${program.universityName}-${program.graduateSchool}-${program.programName}`}
                className="rounded-xl border border-slate-200 bg-mist p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{program.graduateSchool}</p>
                    <p className="mt-1 text-sm text-slate-600">{program.programName}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-ocean">适配度 {program.score}</span>
                    <span className={riskBadgeClass(program.riskLevel)}>{program.riskLevel}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  方向匹配 {program.researchMatchScore} 分，档位为{program.band}。
                  {program.facultyMatches.length > 0 ? ` 已命中 ${program.facultyMatches.length} 个潜在研究室。` : " 当前教授库暂无明确研究室命中。"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasBestPrograms && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-mist p-4">
          <h3 className="text-base font-bold text-ink">为什么是这个可行性判断</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {assessment.bestPrograms[0].scoreInsights.slice(0, 6).map((insight) => (
              <div key={insight.label} className="rounded-lg bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700">{insight.label}</p>
                  <span className={insightBadgeClass(insight.level)}>{insight.level} · {insight.score}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600">{insight.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasFacultyMatches && (
        <div className="mt-6">
          <h3 className="text-base font-bold text-ink">可优先查看的教授/研究室</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {assessment.facultyMatches.slice(0, 4).map((faculty) => (
              <div key={faculty.facultyUrl} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{faculty.professorName}</p>
                    <p className="mt-1 text-xs text-slate-500">{faculty.title}</p>
                    {faculty.labName && <p className="mt-1 text-sm font-medium text-slate-700">{faculty.labName}</p>}
                  </div>
                  <span className="rounded-full bg-mist px-2 py-1 text-xs font-semibold text-ocean">{faculty.matchScore}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600">{faculty.department}</p>
                {faculty.matchedKeywords.length > 0 && (
                  <p className="mt-2 text-xs leading-5 text-slate-600">命中：{faculty.matchedKeywords.join(" / ")}</p>
                )}
                <a
                  href={faculty.facultyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex text-xs font-semibold text-ocean underline-offset-4 hover:underline"
                >
                  查看官方研究者页面
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <InsightList title="可利用优势" items={assessment.strengths} emptyText="当前没有明显优势信号。" />
        <InsightList title="主要风险" items={assessment.risks} emptyText="当前没有明显高风险项。" />
        <InsightList title="准备建议" items={assessment.suggestions} emptyText="建议先补充研究方向、语言成绩和目标学位。" />
      </div>
    </section>
  );
}

function InsightList({ title, items, emptyText }: { title: string; items: string[]; emptyText: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="font-semibold text-ink">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {(items.length > 0 ? items : [emptyText]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
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

function riskBadgeClass(level: RecommendedProgram["riskLevel"]) {
  const base = "rounded-full px-2.5 py-1 text-[11px] font-semibold";
  if (level === "风险较低") return `${base} bg-matcha/10 text-matcha`;
  if (level === "需要关注") return `${base} bg-amber-100 text-amber-700`;
  return `${base} bg-sakura/10 text-sakura`;
}

function applicationCheckClass(status: RecommendedProgram["applicationChecks"][number]["status"]) {
  if (status === "满足") return "border-matcha/20 bg-matcha/5 text-matcha";
  if (status === "有风险") return "border-sakura/20 bg-sakura/5 text-sakura";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function ApplicationChecksBlock({ program }: { program: RecommendedProgram }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-ink">申请前置条件</p>
        <span className={riskBadgeClass(program.riskLevel)}>{program.riskLevel}</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {program.applicationChecks.map((check) => (
          <div key={check.key} className={`rounded-lg border p-3 ${applicationCheckClass(check.status)}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold">{check.label}</p>
              <span className="text-[11px] font-bold">{check.status}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">{check.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReliabilityBlock({ program }: { program: RecommendedProgram }) {
  const reliability = program.reliability;
  const statusItems = [
    { label: "项目数据", value: reliability.programDataStatus },
    { label: "募集要项", value: reliability.admissionStatus },
    { label: "教授库覆盖", value: `${reliability.facultyCoverage}${reliability.facultyProfessorCount > 0 ? `（${reliability.facultyProfessorCount} 位）` : ""}` },
    { label: "导师命中", value: reliability.facultyMatchStatus }
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-ink">数据可信度</p>
        <p className="text-xs text-slate-500">用于判断结果可靠范围</p>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2">
        {statusItems.map((item) => (
          <div key={item.label} className="rounded-lg bg-mist p-2">
            <dt className="text-[11px] font-semibold text-slate-500">{item.label}</dt>
            <dd className="mt-1 text-xs font-semibold text-slate-700">{item.value}</dd>
          </div>
        ))}
      </dl>
      {reliability.reviewNotes.length > 0 && (
        <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          <p className="font-semibold">需要人工复核</p>
          <ul className="mt-1 space-y-1">
            {reliability.reviewNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScoreInsightsBlock({ program }: { program: RecommendedProgram }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-ink">为什么是这个分</p>
        <p className="text-xs text-slate-500">高 / 中 / 低</p>
      </div>
      <div className="mt-3 space-y-2">
        {program.scoreInsights.map((insight) => (
          <div key={insight.label} className="rounded-lg bg-mist p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-slate-700">{insight.label}</p>
              <span className={insightBadgeClass(insight.level)}>{insight.level} · {insight.score}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">{insight.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function insightBadgeClass(level: RecommendedProgram["scoreInsights"][number]["level"]) {
  const base = "rounded-full px-2 py-1 text-[11px] font-semibold";
  if (level === "高") return `${base} bg-matcha/10 text-matcha`;
  if (level === "中") return `${base} bg-ocean/10 text-ocean`;
  if (level === "低") return `${base} bg-sakura/10 text-sakura`;
  return `${base} bg-amber-100 text-amber-700`;
}

function ScoreBreakdown({ program }: { program: RecommendedProgram }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-ink">评分拆解</p>
        <p className="text-xs text-slate-500">原始 {program.scoreBeforeAdjustments} → 最终 {program.score}</p>
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
      {program.scoreAdjustments.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          <p className="font-semibold">风险修正</p>
          <ul className="mt-1 space-y-1">
            {program.scoreAdjustments.map((adjustment) => (
              <li key={adjustment}>{adjustment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FacultyMatchesBlock({ program }: { program: RecommendedProgram }) {
  if (program.facultyMatches.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-ink">潜在导师/研究室</p>
          <p className="text-xs text-slate-500">暂无强命中</p>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          当前没有显示具体教授，不等于该校没有合适导师，而是数据库或关键词证据还不够强。
        </p>
        {program.noFacultyReasons.length > 0 && (
          <ul className="mt-3 space-y-2 rounded-lg bg-mist p-3 text-xs leading-5 text-slate-600">
            {program.noFacultyReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-ink">潜在导师/研究室</p>
        <p className="text-xs text-slate-500">官方研究者数据库</p>
      </div>
      <div className="mt-3 space-y-3">
        {program.facultyMatches.map((faculty) => (
          <div key={faculty.facultyUrl} className="rounded-lg bg-mist p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{faculty.professorName}</p>
                <p className="mt-0.5 text-xs text-slate-500">{faculty.title}</p>
                {faculty.labName && <p className="mt-1 text-xs font-medium text-slate-700">{faculty.labName}</p>}
              </div>
              <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-ocean">{faculty.matchScore}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">{faculty.department}</p>
            {faculty.matchedKeywords.length > 0 && (
              <p className="mt-2 text-xs leading-5 text-slate-600">命中：{faculty.matchedKeywords.join(" / ")}</p>
            )}
            <p className="mt-2 text-xs leading-5 text-slate-500">{faculty.matchReason}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={faculty.facultyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-xs font-semibold text-ocean underline-offset-4 hover:underline"
              >
                查看官方研究者页面
              </a>
              {faculty.labUrl && (
                <a
                  href={faculty.labUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-xs font-semibold text-ocean underline-offset-4 hover:underline"
                >
                  查看实验室主页
                </a>
              )}
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
