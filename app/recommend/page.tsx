"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";
import { detectChinaUniversity, getChinaUniversityCount } from "@/lib/chinaUniversities";
import type { StudentProfile } from "@/types/recommendation";

const defaultProfile: StudentProfile = {
  undergraduateSchool: "",
  undergraduateTier: "普通一本 / 普通本科",
  undergraduateMajor: "",
  researchDirection: "",
  gpa: "",
  englishScore: "",
  japaneseScore: "JLPT N2",
  degreeGoal: "硕士",
  regionPreference: "不限",
  applicationPreference: "研究方向匹配优先",
  additionalBackground: ""
};

export default function RecommendPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);
  const detectedUniversity = useMemo(
    () => detectChinaUniversity(profile.undergraduateSchool),
    [profile.undergraduateSchool]
  );

  function updateField<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function updateUndergraduateSchool(value: string) {
    const detected = detectChinaUniversity(value);
    setProfile((current) => ({
      ...current,
      undergraduateSchool: value,
      undergraduateTier: detected?.tier ?? current.undergraduateTier
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("studentProfile", JSON.stringify(profile));
    router.push("/result");
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold text-sakura">Step 1 / 填写背景信息</p>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">告诉系统你的申请画像</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            当前版本使用本地规则模拟推荐结果，适合快速展示产品思路和作品集截图。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-white bg-white/90 p-6 shadow-soft sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="本科院校名称">
              <input
                value={profile.undergraduateSchool}
                onChange={(event) => updateUndergraduateSchool(event.target.value)}
                placeholder="例如：同济大学 / 武汉理工大学 / 某某学院"
                className="form-input"
              />
              <UniversityDetectionHint schoolName={profile.undergraduateSchool} detectedUniversity={detectedUniversity} />
            </Field>

            <Field label="本科院校层次">
              <select
                value={profile.undergraduateTier}
                onChange={(event) => updateField("undergraduateTier", event.target.value as StudentProfile["undergraduateTier"])}
                className="form-input"
              >
                <option>C9 / 顶尖985</option>
                <option>985</option>
                <option>211</option>
                <option>双一流非985/211</option>
                <option>普通一本 / 普通本科</option>
                <option>民办 / 独立学院</option>
                <option>大专</option>
                <option>海外本科</option>
                <option>日本本科</option>
                <option>其他 / 不确定</option>
              </select>
            </Field>

            <Field label="本科专业">
              <input
                required
                value={profile.undergraduateMajor}
                onChange={(event) => updateField("undergraduateMajor", event.target.value)}
                placeholder="例如：计算机科学 / 经济学 / 机械工程"
                className="form-input"
              />
            </Field>

            <Field label="目标研究方向">
              <input
                required
                value={profile.researchDirection}
                onChange={(event) => updateField("researchDirection", event.target.value)}
                placeholder="例如：人工智能、抗震结构、都市环境、商学"
                className="form-input"
              />
            </Field>

            <Field label="GPA">
              <input
                required
                value={profile.gpa}
                onChange={(event) => updateField("gpa", event.target.value)}
                placeholder="例如：3.5 / 4.0 或 85"
                className="form-input"
              />
            </Field>

            <Field label="英语成绩">
              <input
                required
                value={profile.englishScore}
                onChange={(event) => updateField("englishScore", event.target.value)}
                placeholder="例如：IELTS 6.5 / TOEFL 88 / TOEIC 820"
                className="form-input"
              />
            </Field>

            <Field label="日语成绩">
              <select
                value={profile.japaneseScore}
                onChange={(event) => updateField("japaneseScore", event.target.value)}
                className="form-input"
              >
                <option>JLPT N1</option>
                <option>JLPT N2</option>
                <option>JLPT N3</option>
                <option>无</option>
              </select>
            </Field>

            <Field label="目标学位">
              <select
                value={profile.degreeGoal}
                onChange={(event) => updateField("degreeGoal", event.target.value as StudentProfile["degreeGoal"])}
                className="form-input"
              >
                <option>硕士</option>
                <option>博士</option>
                <option>研究生</option>
              </select>
            </Field>

            <Field label="目标地区">
              <select
                value={profile.regionPreference}
                onChange={(event) => updateField("regionPreference", event.target.value as StudentProfile["regionPreference"])}
                className="form-input"
              >
                <option>东京</option>
                <option>关西</option>
                <option>其他</option>
                <option>不限</option>
              </select>
            </Field>

            <Field label="申请偏好">
              <select
                value={profile.applicationPreference}
                onChange={(event) =>
                  updateField("applicationPreference", event.target.value as StudentProfile["applicationPreference"])
                }
                className="form-input"
              >
                <option>排名优先</option>
                <option>稳妥优先</option>
                <option>研究方向匹配优先</option>
              </select>
            </Field>
          </div>

          <Field label="其他补充背景" className="mt-5">
            <textarea
              value={profile.additionalBackground}
              onChange={(event) => updateField("additionalBackground", event.target.value)}
              placeholder="例如：科研经历、实习、论文、竞赛、希望申请英文项目等"
              rows={5}
              className="form-input resize-none"
            />
          </Field>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              返回首页
            </button>
            <button
              type="submit"
              className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              生成推荐结果
            </button>
          </div>
        </form>
      </section>
      <Disclaimer />
    </SiteShell>
  );
}

function UniversityDetectionHint({
  schoolName,
  detectedUniversity
}: {
  schoolName: string;
  detectedUniversity: ReturnType<typeof detectChinaUniversity>;
}) {
  if (!schoolName.trim()) {
    return <p className="mt-2 text-xs text-slate-400">当前内置 {getChinaUniversityCount()} 所中国本科院校用于自动识别。</p>;
  }

  if (!detectedUniversity) {
    return <p className="mt-2 text-xs text-slate-500">暂未识别该院校，可手动选择本科院校层次。</p>;
  }

  return (
    <p className="mt-2 text-xs text-matcha">
      已识别：{detectedUniversity.name} · {detectedUniversity.city} · {detectedUniversity.tier}
    </p>
  );
}

function Field({
  label,
  children,
  className = ""
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}
