import programs from "@/data/programs.json";
import type {
  GraduateProgram,
  RecommendationBand,
  RecommendationResult,
  RecommendedProgram,
  StudentProfile,
  UndergraduateTier
} from "@/types/recommendation";

const bands: RecommendationBand[] = ["冲刺", "匹配", "相对稳妥"];

const defaultTier: UndergraduateTier = "其他 / 不确定";

function getProfile(profile: StudentProfile): StudentProfile {
  // 兼容用户浏览器里旧版 localStorage 数据，避免升级后结果页空白。
  return {
    undergraduateSchool: profile.undergraduateSchool ?? "",
    undergraduateTier: profile.undergraduateTier ?? defaultTier,
    undergraduateMajor: profile.undergraduateMajor ?? "",
    researchDirection: profile.researchDirection ?? "",
    gpa: profile.gpa ?? "",
    englishScore: profile.englishScore ?? "",
    japaneseScore: profile.japaneseScore ?? "JLPT N2",
    degreeGoal: profile.degreeGoal ?? "硕士",
    regionPreference: profile.regionPreference ?? "不限",
    applicationPreference: profile.applicationPreference ?? "研究方向匹配优先",
    additionalBackground: profile.additionalBackground ?? ""
  };
}

function parseGpa(gpa: string) {
  const value = Number.parseFloat(gpa);
  if (Number.isNaN(value)) return 0;

  // 兼容 4.0 制和百分制输入。
  if (value <= 4.3) return Math.min(100, (value / 4) * 100);
  return Math.min(100, value);
}

function scoreEnglish(score: string) {
  const text = score.toLowerCase();
  const number = Number.parseFloat(text.match(/\d+(\.\d+)?/)?.[0] ?? "0");

  if (text.includes("ielts")) {
    if (number >= 7) return 100;
    if (number >= 6.5) return 88;
    if (number >= 6) return 76;
    if (number >= 5.5) return 62;
  }

  if (text.includes("toefl")) {
    if (number >= 95) return 100;
    if (number >= 85) return 88;
    if (number >= 79) return 76;
    if (number >= 70) return 62;
  }

  if (text.includes("toeic")) {
    if (number >= 900) return 92;
    if (number >= 800) return 82;
    if (number >= 700) return 68;
  }

  return number > 0 ? 55 : 35;
}

function scoreJapanese(score: string) {
  const text = score.toUpperCase();
  if (text.includes("N1")) return 100;
  if (text.includes("N2")) return 82;
  if (text.includes("N3")) return 58;
  if (text.includes("无") || text.includes("NONE")) return 30;
  return 48;
}

function scoreUndergraduateTier(tier: UndergraduateTier) {
  const tierScores: Record<UndergraduateTier, number> = {
    "C9 / 顶尖985": 100,
    "985": 94,
    "211": 86,
    "双一流非985/211": 80,
    "普通一本 / 普通本科": 70,
    "民办 / 独立学院": 60,
    "大专": 48,
    "海外本科": 84,
    "日本本科": 86,
    "其他 / 不确定": 66
  };

  return tierScores[tier] ?? tierScores[defaultTier];
}

function normalizeKeywords(text: string) {
  return text
    .toLowerCase()
    .replace(/[，。；、/|,.;]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreResearchMatch(profile: StudentProfile, program: GraduateProgram) {
  const profileText = `${profile.undergraduateMajor} ${profile.researchDirection} ${profile.additionalBackground}`.toLowerCase();
  const userKeywords = normalizeKeywords(profileText);
  const programText = [...program.researchFields, ...program.keywords, program.fieldCategory].join(" ").toLowerCase();

  const directFieldMatch = program.researchFields.some((field) => profileText.includes(field.toLowerCase()));
  const directKeywordMatch = program.keywords.some((keyword) => profileText.includes(keyword.toLowerCase()));
  const keywordHits = userKeywords.filter((keyword) => programText.includes(keyword)).length;

  if (directFieldMatch) return 100;
  if (directKeywordMatch && keywordHits >= 2) return 94;
  if (directKeywordMatch) return 86;
  if (keywordHits >= 2) return 78;
  if (keywordHits === 1) return 66;
  return 42;
}

function scoreRegion(profile: StudentProfile, program: GraduateProgram) {
  if (profile.regionPreference === "不限") return 84;
  return profile.regionPreference === program.region ? 100 : 55;
}

function scoreDegree(profile: StudentProfile, program: GraduateProgram) {
  return program.degreeOptions.includes(profile.degreeGoal) ? 100 : 62;
}

function calculateScore(profile: StudentProfile, program: GraduateProgram) {
  const gpaScore = parseGpa(profile.gpa);
  const englishScore = scoreEnglish(profile.englishScore);
  const japaneseScore = scoreJapanese(profile.japaneseScore);
  const researchScore = scoreResearchMatch(profile, program);
  const regionScore = scoreRegion(profile, program);
  const degreeScore = scoreDegree(profile, program);
  const undergradScore = scoreUndergraduateTier(profile.undergraduateTier);
  const rankScore = program.rankTier === 1 ? 100 : 86;

  const preferenceWeights = {
    排名优先: {
      gpa: 0.16,
      english: 0.14,
      japanese: 0.08,
      research: 0.26,
      region: 0.04,
      rank: 0.14,
      undergrad: 0.14,
      degree: 0.04
    },
    稳妥优先: {
      gpa: 0.19,
      english: 0.14,
      japanese: 0.11,
      research: 0.25,
      region: 0.07,
      rank: 0.04,
      undergrad: 0.16,
      degree: 0.04
    },
    研究方向匹配优先: {
      gpa: 0.14,
      english: 0.12,
      japanese: 0.08,
      research: 0.42,
      region: 0.05,
      rank: 0.05,
      undergrad: 0.1,
      degree: 0.04
    }
  }[profile.applicationPreference];

  const rawScore =
    gpaScore * preferenceWeights.gpa +
    englishScore * preferenceWeights.english +
    japaneseScore * preferenceWeights.japanese +
    researchScore * preferenceWeights.research +
    regionScore * preferenceWeights.region +
    rankScore * preferenceWeights.rank +
    undergradScore * preferenceWeights.undergrad +
    degreeScore * preferenceWeights.degree;

  return Math.round(Math.max(30, Math.min(99, rawScore)));
}

function chooseBand(score: number, difficulty: number, preference: StudentProfile["applicationPreference"]): RecommendationBand {
  const gap = score - difficulty;

  if (preference === "稳妥优先" && gap >= 10) return "相对稳妥";
  if (gap >= 7) return "相对稳妥";
  if (gap >= -10) return "匹配";
  return "冲刺";
}

function buildReasons(profile: StudentProfile, program: GraduateProgram, score: number) {
  const researchScore = scoreResearchMatch(profile, program);
  const reasons = [
    `${program.universityName} 的 ${program.graduateSchool} / ${program.programName} 覆盖 ${program.researchFields.join("、")}，与「${profile.researchDirection || "目标方向"}」的匹配度为 ${researchScore} 分。`,
    `系统同时参考了你的本科院校层次「${profile.undergraduateTier}」、GPA、语言成绩和目标地区，综合匹配度为 ${score} 分。`
  ];

  if (profile.undergraduateSchool) {
    reasons.push(`本科院校「${profile.undergraduateSchool}」会作为背景竞争力参考，但最终仍要看研究计划书、导师匹配和语言材料。`);
  }

  if (profile.regionPreference !== "不限") {
    reasons.push(
      program.region === profile.regionPreference
        ? `该项目位于${program.region}，符合你的地区偏好。`
        : `该项目不在你的首选地区，但方向匹配或院校层次使它仍值得纳入方案。`
    );
  }

  return reasons;
}

function buildImprovements(profile: StudentProfile, program: GraduateProgram) {
  const improvements: string[] = [];
  const undergradScore = scoreUndergraduateTier(profile.undergraduateTier);

  if (undergradScore < 70 && program.difficulty >= 84) {
    improvements.push("本科院校层次在高难度项目中不占优势，建议用科研经历、课程项目、推荐信和套磁反馈补强。");
  }

  if (parseGpa(profile.gpa) < program.difficulty - 8) {
    improvements.push("GPA 与项目难度相比偏紧，需要在研究计划书中突出专业基础和可验证的研究能力。");
  }

  if (scoreEnglish(profile.englishScore) < 76) {
    improvements.push(`建议继续提升英语成绩，目标可参考：${program.englishRequirement}。`);
  }

  if (scoreJapanese(profile.japaneseScore) < 82 && program.japaneseRequirement.includes("N2")) {
    improvements.push(`建议补充日语能力证明，尤其是日语授课或需要面试的项目通常看重：${program.japaneseRequirement}。`);
  }

  if (scoreResearchMatch(profile, program) < 78) {
    improvements.push("研究方向还需要更具体，建议把目标教授、研究室关键词、方法和过往经历连接起来。");
  }

  if (!program.degreeOptions.includes(profile.degreeGoal)) {
    improvements.push(`该条目当前更适合 ${program.degreeOptions.join(" / ")}，目标学位需要进一步核对募集要项。`);
  }

  if (improvements.length === 0) {
    improvements.push("重点打磨研究计划书、套磁邮件和教授匹配度，进一步提高申请确定性。");
  }

  return improvements;
}

function makeRecommendedProgram(profile: StudentProfile, program: GraduateProgram): RecommendedProgram {
  const score = calculateScore(profile, program);
  const band = chooseBand(score, program.difficulty, profile.applicationPreference);

  return {
    ...program,
    band,
    score,
    reasons: buildReasons(profile, program, score),
    improvements: buildImprovements(profile, program)
  };
}

function pickUniquePrograms(
  band: RecommendationBand,
  candidates: RecommendedProgram[],
  selectedPrograms: Set<string>,
  selectedUniversities: Set<string>
) {
  const picked: RecommendedProgram[] = [];

  for (const program of candidates) {
    const id = `${program.universityName}-${program.graduateSchool}-${program.programName}`;
    if (picked.length >= 3) break;
    if (selectedPrograms.has(id)) continue;
    if (picked.length < 2 && selectedUniversities.has(program.universityName)) continue;

    selectedPrograms.add(id);
    selectedUniversities.add(program.universityName);
    picked.push({ ...program, band });
  }

  for (const program of candidates) {
    const id = `${program.universityName}-${program.graduateSchool}-${program.programName}`;
    if (picked.length >= 3) break;
    if (selectedPrograms.has(id)) continue;

    selectedPrograms.add(id);
    selectedUniversities.add(program.universityName);
    picked.push({ ...program, band });
  }

  return picked;
}

function rebalanceBands(programs: RecommendedProgram[]) {
  const selectedPrograms = new Set<string>();
  const selectedUniversities = new Set<string>();
  const byMatch = [...programs].sort((a, b) => b.score - b.difficulty - (a.score - a.difficulty));

  const challengeCandidates = [...programs].sort((a, b) => b.difficulty - a.difficulty || b.score - a.score);
  const matchCandidates = byMatch.sort(
    (a, b) => Math.abs(a.score - a.difficulty) - Math.abs(b.score - b.difficulty)
  );
  const safetyCandidates = [...programs].sort((a, b) => a.difficulty - b.difficulty || b.score - a.score);

  return {
    冲刺: pickUniquePrograms("冲刺", challengeCandidates, selectedPrograms, selectedUniversities),
    匹配: pickUniquePrograms("匹配", matchCandidates, selectedPrograms, selectedUniversities),
    相对稳妥: pickUniquePrograms("相对稳妥", safetyCandidates, selectedPrograms, selectedUniversities)
  };
}

export function generateRecommendations(rawProfile: StudentProfile): RecommendationResult {
  const profile = getProfile(rawProfile);
  const scoredPrograms = (programs as GraduateProgram[])
    .map((program) => makeRecommendedProgram(profile, program))
    .sort((a, b) => b.score - a.score);

  const recommendedPrograms = rebalanceBands(scoredPrograms);

  return {
    profile,
    generatedAt: new Date().toISOString(),
    summary: `基于你的本科院校层次「${profile.undergraduateTier}」、${profile.undergraduateMajor || "本科专业"} 背景、${profile.researchDirection || "目标研究方向"}、GPA 和语言成绩，系统从旧帝大 + 早庆的研究科/方向库中生成了冲刺、匹配、相对稳妥三档申请组合。`,
    programs: recommendedPrograms
  };
}

export function buildRecommendationReport(result: RecommendationResult) {
  const lines = [
    "AI 日本留学院校推荐报告",
    "",
    result.summary,
    "",
    `本科院校：${result.profile.undergraduateSchool || "未填写"}`,
    `本科院校层次：${result.profile.undergraduateTier}`,
    `目标学位：${result.profile.degreeGoal}`,
    `目标地区：${result.profile.regionPreference}`,
    `申请偏好：${result.profile.applicationPreference}`,
    ""
  ];

  for (const band of bands) {
    lines.push(`${band}项目`);
    result.programs[band].forEach((program, index) => {
      lines.push(`${index + 1}. ${program.universityName}｜${program.graduateSchool}｜${program.programName}`);
      lines.push(`方向：${program.researchFields.join(" / ")}｜地区：${program.region}`);
      lines.push(`匹配度：${program.score} 分`);
      lines.push(`推荐理由：${program.reasons.join(" ")}`);
      lines.push(`需要提升：${program.improvements.join(" ")}`);
      lines.push("");
    });
  }

  lines.push("免责声明：推荐结果仅供申请规划参考，具体录取结果取决于导师、研究计划书、套磁、语言成绩和当年招生情况。");

  return lines.join("\n");
}
