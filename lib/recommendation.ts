import programs from "@/data/programs.json";
import researchSynonyms from "@/data/researchSynonyms.json";
import { detectChinaUniversity } from "@/lib/chinaUniversities";
import { findFacultyMatches, hasFacultyProfilesForProgram } from "@/lib/facultyMatching";
import type {
  FacultyMatch,
  GraduateProgram,
  RecommendationBand,
  RecommendationResult,
  RecommendedProgram,
  ScoreBreakdownItem,
  StudentProfile,
  UndergraduateTier
} from "@/types/recommendation";

const bands: RecommendationBand[] = ["冲刺", "匹配", "相对稳妥"];

const defaultTier: UndergraduateTier = "其他 / 不确定";
const genericResearchKeywords = new Set(["工程", "科学", "研究", "系统"]);

type ResearchSynonymGroup = {
  category: string;
  triggers: string[];
  expandedKeywords: string[];
};

function getProfile(profile: StudentProfile): StudentProfile {
  const detectedUniversity = detectChinaUniversity(profile.undergraduateSchool ?? "");

  // 兼容用户浏览器里旧版 localStorage 数据，避免升级后结果页空白。
  return {
    undergraduateSchool: profile.undergraduateSchool ?? "",
    undergraduateTier: detectedUniversity?.tier ?? profile.undergraduateTier ?? defaultTier,
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

function ieltsToToeflScale(ielts: number) {
  if (ielts >= 7.5) return 102;
  if (ielts >= 7) return 95;
  if (ielts >= 6.5) return 85;
  if (ielts >= 6) return 78;
  if (ielts >= 5.5) return 70;
  return 60;
}

function toeicToToeflScale(toeic: number) {
  if (toeic >= 900) return 95;
  if (toeic >= 800) return 85;
  if (toeic >= 700) return 76;
  if (toeic >= 600) return 68;
  return 58;
}

function parseEnglishToToeflScale(score: string) {
  const text = score.toLowerCase();
  const number = Number.parseFloat(text.match(/\d+(\.\d+)?/)?.[0] ?? "0");

  if (number <= 0) return 0;
  if (text.includes("ielts")) return ieltsToToeflScale(number);
  if (text.includes("toeic")) return toeicToToeflScale(number);
  return number;
}

function parseRequiredEnglishToToeflScale(program?: GraduateProgram) {
  if (!program) return 79;

  const requirement = program.englishRequirement.toLowerCase();
  const toeflNumbers = Array.from(requirement.matchAll(/toefl[^\d]*(\d{2,3})/g)).map((match) => Number(match[1]));
  const ieltsNumbers = Array.from(requirement.matchAll(/ielts[^\d]*(\d(?:\.\d)?)/g)).map((match) =>
    ieltsToToeflScale(Number(match[1]))
  );
  const thresholds = [...toeflNumbers, ...ieltsNumbers].filter((value) => Number.isFinite(value));

  return thresholds.length > 0 ? Math.min(...thresholds) : 79;
}

function scoreEnglish(score: string, program?: GraduateProgram) {
  const toeflScale = parseEnglishToToeflScale(score);
  if (toeflScale <= 0) return 28;

  const requiredToefl = parseRequiredEnglishToToeflScale(program);
  const gap = toeflScale - requiredToefl;

  if (gap < -8) return 25;
  if (gap < 0) return 45;
  if (gap < 8) return 76;
  if (gap < 15) return 86;
  if (gap < 25) return 94;
  return 100;
}

function parseJapaneseLevel(score: string) {
  const text = score.toUpperCase();
  if (text.includes("N1")) return 1;
  if (text.includes("N2")) return 2;
  if (text.includes("N3")) return 3;
  if (text.includes("N4")) return 4;
  if (text.includes("无") || text.includes("NONE")) return 0;
  return 0;
}

function parseRequiredJapaneseLevel(program?: GraduateProgram) {
  if (!program) return 2;

  const requirement = program.japaneseRequirement.toUpperCase();
  if (requirement.includes("不是硬性") || requirement.includes("不是硬性前提") || requirement.includes("英文项目较多")) return 0;
  if (requirement.includes("N1")) return 1;
  if (requirement.includes("N2")) return 2;
  if (requirement.includes("N3")) return 3;
  return 0;
}

function scoreJapanese(score: string, program?: GraduateProgram) {
  const level = parseJapaneseLevel(score);
  const requiredLevel = parseRequiredJapaneseLevel(program);

  if (requiredLevel === 0) {
    if (level === 1) return 90;
    if (level === 2) return 80;
    if (level === 3) return 68;
    return 62;
  }

  if (level === 0) return 25;
  if (level > requiredLevel) return level - requiredLevel >= 2 ? 35 : 48;
  if (level === requiredLevel) return 76;
  if (level === 1 && requiredLevel >= 2) return 92;
  return 86;
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

function getExpandedResearchKeywords(profileText: string) {
  const lowerProfileText = profileText.toLowerCase();
  const matchedGroups = (researchSynonyms as ResearchSynonymGroup[]).filter((group) =>
    group.triggers.some((trigger) => lowerProfileText.includes(trigger.toLowerCase()))
  );
  const expandedKeywords = matchedGroups.flatMap((group) => group.expandedKeywords);

  return {
    matchedCategories: matchedGroups.map((group) => group.category),
    expandedKeywords: Array.from(new Set(expandedKeywords))
  };
}

function getResearchMatch(profile: StudentProfile, program: GraduateProgram) {
  const targetText = `${profile.researchDirection} ${profile.additionalBackground}`.toLowerCase();
  const backgroundText = profile.undergraduateMajor.toLowerCase();
  const expandedResearch = getExpandedResearchKeywords(targetText);
  const targetKeywords = Array.from(new Set([...normalizeKeywords(targetText), ...expandedResearch.expandedKeywords]));
  const programText = [...program.researchFields, ...program.keywords, program.fieldCategory].join(" ").toLowerCase();

  const directFieldMatch = program.researchFields.some((field) => targetText.includes(field.toLowerCase()));
  const matchedTargetKeywords = program.keywords.filter(
    (keyword) => targetText.includes(keyword.toLowerCase()) && !genericResearchKeywords.has(keyword)
  );
  const targetKeywordHits = targetKeywords.filter(
    (keyword) => programText.includes(keyword.toLowerCase()) && !genericResearchKeywords.has(keyword)
  );
  const backgroundKeywordHits = program.keywords.filter(
    (keyword) => backgroundText.includes(keyword.toLowerCase()) && !genericResearchKeywords.has(keyword)
  );
  const uniqueTargetMatches = Array.from(new Set([...matchedTargetKeywords, ...targetKeywordHits]));
  const uniqueBackgroundMatches = Array.from(new Set(backgroundKeywordHits));
  const directKeywordMatch = matchedTargetKeywords.length > 0;
  const keywordHits = uniqueTargetMatches.length;

  let score = 42;

  if (directFieldMatch) score = 100;
  else if (directKeywordMatch && keywordHits >= 2) score = 94;
  else if (directKeywordMatch) score = 86;
  else if (keywordHits >= 2) score = 78;
  else if (keywordHits === 1) score = 66;
  else if (uniqueBackgroundMatches.length >= 2) score = 60;
  else if (uniqueBackgroundMatches.length === 1) score = 54;

  if (keywordHits > 0 && uniqueBackgroundMatches.length > 0) {
    score = Math.min(100, score + 4);
  }

  return {
    score,
    matchedKeywords: Array.from(new Set([...uniqueTargetMatches, ...uniqueBackgroundMatches])),
    matchedCategories: expandedResearch.matchedCategories
  };
}

function scoreResearchMatch(profile: StudentProfile, program: GraduateProgram) {
  return getResearchMatch(profile, program).score;
}

function scoreRegion(profile: StudentProfile, program: GraduateProgram) {
  if (profile.regionPreference === "不限") return 84;
  return profile.regionPreference === program.region ? 100 : 55;
}

function scoreDegree(profile: StudentProfile, program: GraduateProgram) {
  return program.degreeOptions.includes(profile.degreeGoal) ? 100 : 62;
}

function scoreFacultyFit(program: GraduateProgram, facultyMatches: FacultyMatch[]) {
  if (facultyMatches.length > 0) return facultyMatches[0].matchScore;

  // If this exact graduate school is covered but no faculty match is found, treat it as a real weakness.
  // If the faculty database has not covered this program yet, keep the score neutral.
  return hasFacultyProfilesForProgram(program) ? 38 : 68;
}

function scoreDifficultyFit(profile: StudentProfile, program: GraduateProgram) {
  const applicantStrength =
    parseGpa(profile.gpa) * 0.35 +
    scoreUndergraduateTier(profile.undergraduateTier) * 0.28 +
    scoreEnglish(profile.englishScore, program) * 0.22 +
    scoreJapanese(profile.japaneseScore, program) * 0.1 +
    scoreResearchMatch(profile, program) * 0.05;
  const gap = applicantStrength - program.difficulty;

  if (gap >= 12) return 100;
  if (gap >= 5) return 90;
  if (gap >= -3) return 80;
  if (gap >= -10) return 66;
  if (gap >= -18) return 50;
  return 36;
}

function scoreAcademicBackground(profile: StudentProfile, program: GraduateProgram) {
  const undergradScore = scoreUndergraduateTier(profile.undergraduateTier);
  const majorText = profile.undergraduateMajor.toLowerCase();
  const programText = [...program.researchFields, ...program.keywords, program.fieldCategory].join(" ").toLowerCase();
  const majorMatch = normalizeKeywords(majorText).some((keyword) => keyword.length > 1 && programText.includes(keyword));

  return Math.min(100, undergradScore + (majorMatch ? 6 : 0));
}

function scoreResearchExperience(profile: StudentProfile) {
  const text = `${profile.additionalBackground} ${profile.undergraduateMajor}`.toLowerCase();
  const strongSignals = [
    "论文",
    "发表",
    "期刊",
    "会议",
    "科研",
    "课题",
    "实验室",
    "研究室",
    "项目",
    "竞赛",
    "专利",
    "实习",
    "publication",
    "paper",
    "conference",
    "research",
    "laboratory",
    "project",
    "patent",
    "internship"
  ];
  const matchedSignals = strongSignals.filter((signal) => text.includes(signal));

  if (matchedSignals.length >= 4) return 95;
  if (matchedSignals.length >= 2) return 82;
  if (matchedSignals.length === 1) return 68;
  return 55;
}

function buildScoreBreakdown(profile: StudentProfile, program: GraduateProgram, facultyMatches: FacultyMatch[]): ScoreBreakdownItem[] {
  const gpaScore = parseGpa(profile.gpa);
  const englishScore = scoreEnglish(profile.englishScore, program);
  const japaneseScore = scoreJapanese(profile.japaneseScore, program);
  const researchScore = scoreResearchMatch(profile, program);
  const facultyScore = scoreFacultyFit(program, facultyMatches);
  const difficultyScore = scoreDifficultyFit(profile, program);
  const regionScore = scoreRegion(profile, program);
  const degreeScore = scoreDegree(profile, program);
  const academicBackgroundScore = scoreAcademicBackground(profile, program);
  const experienceScore = scoreResearchExperience(profile);

  const items: Array<Omit<ScoreBreakdownItem, "contribution">> = [
    { key: "research", label: "研究课题匹配度", score: researchScore, weight: 0.25 },
    { key: "faculty", label: "教授/实验室匹配度", score: facultyScore, weight: 0.2 },
    { key: "difficulty", label: "申请难度匹配", score: difficultyScore, weight: 0.12 },
    { key: "gpa", label: "GPA与学术成绩", score: gpaScore, weight: 0.1 },
    { key: "undergrad", label: "本科专业及院校背景", score: academicBackgroundScore, weight: 0.08 },
    { key: "english", label: "英语竞争力", score: englishScore, weight: 0.08 },
    { key: "japanese", label: "日语竞争力", score: japaneseScore, weight: 0.05 },
    { key: "experience", label: "研究经历/科研能力", score: experienceScore, weight: 0.07 },
    { key: "region", label: "地区偏好", score: regionScore, weight: 0.03 },
    { key: "degree", label: "学位及申请资格匹配", score: degreeScore, weight: 0.02 }
  ];

  return items.map((item) => ({
    ...item,
    contribution: Math.round(item.score * item.weight * 10) / 10
  }));
}

function calculateScore(scoreBreakdown: ScoreBreakdownItem[]) {
  const rawScore = scoreBreakdown.reduce((sum, item) => sum + item.contribution, 0);
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
  const researchMatch = getResearchMatch(profile, program);
  const categoryText =
    researchMatch.matchedCategories.length > 0 ? `系统识别为「${researchMatch.matchedCategories.join(" / ")}」方向。` : "";
  const matchedKeywordText =
    researchMatch.matchedKeywords.length > 0 ? `命中的关键词包括：${researchMatch.matchedKeywords.join("、")}。` : "暂未命中明确关键词。";
  const reasons = [
    `${program.universityName} 的 ${program.graduateSchool} / ${program.programName} 覆盖 ${program.researchFields.join("、")}，与「${profile.researchDirection || "目标方向"}」的方向匹配分为 ${researchMatch.score} 分。${categoryText}${matchedKeywordText}`,
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
  const researchScore = scoreResearchMatch(profile, program);

  if (undergradScore < 70 && program.difficulty >= 84) {
    improvements.push("本科院校层次在高难度项目中不占优势，建议用科研经历、课程项目、推荐信和套磁反馈补强。");
  }

  if (parseGpa(profile.gpa) < program.difficulty - 8) {
    improvements.push("GPA 与项目难度相比偏紧，需要在研究计划书中突出专业基础和可验证的研究能力。");
  }

  if (scoreEnglish(profile.englishScore, program) < 76) {
    improvements.push(`建议继续提升英语成绩，目标可参考：${program.englishRequirement}。`);
  }

  if (scoreJapanese(profile.japaneseScore, program) < 76 && /N1|N2|N3/.test(program.japaneseRequirement)) {
    improvements.push(`建议补充日语能力证明，尤其是日语授课或需要面试的项目通常看重：${program.japaneseRequirement}。`);
  }

  if (researchScore < 78) {
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
  const researchMatch = getResearchMatch(profile, program);
  const facultyMatches = findFacultyMatches(profile, program);
  const scoreBreakdown = buildScoreBreakdown(profile, program, facultyMatches);
  const score = calculateScore(scoreBreakdown);
  const band = chooseBand(score, program.difficulty, profile.applicationPreference);

  return {
    ...program,
    band,
    score,
    researchMatchScore: researchMatch.score,
    matchedKeywords: researchMatch.matchedKeywords,
    scoreBreakdown,
    facultyMatches,
    reasons: buildReasons(profile, program, score),
    improvements: buildImprovements(profile, program)
  };
}

function relevanceWeight(program: RecommendedProgram) {
  if (program.researchMatchScore >= 86) return 3;
  if (program.researchMatchScore >= 78) return 2;
  if (program.researchMatchScore >= 66) return 1;
  return 0;
}

function prioritizeRelevantPrograms(
  programs: RecommendedProgram[],
  compare: (a: RecommendedProgram, b: RecommendedProgram) => number
) {
  const relevantPrograms = programs.filter((program) => program.researchMatchScore >= 66).sort(compare);
  const weakPrograms = programs.filter((program) => program.researchMatchScore < 66).sort(compare);

  return [...relevantPrograms, ...weakPrograms];
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
  const challengeCandidates = prioritizeRelevantPrograms(
    programs,
    (a, b) =>
      relevanceWeight(b) - relevanceWeight(a) ||
      b.difficulty - a.difficulty ||
      b.researchMatchScore - a.researchMatchScore ||
      b.score - a.score
  );
  const matchCandidates = prioritizeRelevantPrograms(
    programs,
    (a, b) =>
      relevanceWeight(b) - relevanceWeight(a) ||
      Math.abs(a.score - a.difficulty) - Math.abs(b.score - b.difficulty) ||
      b.researchMatchScore - a.researchMatchScore
  );
  const safetyCandidates = prioritizeRelevantPrograms(
    programs,
    (a, b) =>
      relevanceWeight(b) - relevanceWeight(a) ||
      a.difficulty - b.difficulty ||
      b.score - a.score
  );

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
    summary: `基于你的本科院校层次「${profile.undergraduateTier}」、${profile.undergraduateMajor || "本科专业"} 背景、${profile.researchDirection || "目标研究方向"}、GPA 和语言成绩，系统从日本大学院广覆盖项目库中生成了冲刺、匹配、相对稳妥三档申请组合。`,
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
      lines.push(
        `评分拆解：${program.scoreBreakdown
          .map((item) => `${item.label}${item.score}分 x ${Math.round(item.weight * 100)}% = ${item.contribution}`)
          .join("；")}`
      );
      lines.push(`推荐理由：${program.reasons.join(" ")}`);
      lines.push(`需要提升：${program.improvements.join(" ")}`);
      if (program.facultyMatches.length > 0) {
        lines.push("潜在导师/研究室：");
        program.facultyMatches.forEach((faculty) => {
          lines.push(
            `- ${faculty.professorName}${faculty.labName ? `｜${faculty.labName}` : ""}（${faculty.title}，匹配 ${faculty.matchScore}）：${faculty.matchReason} ${faculty.facultyUrl}`
          );
        });
      }
      if (program.admissionInfo) {
        lines.push(`募集要项参考：${program.admissionInfo.sourceLabel}`);
        lines.push(`官方链接：${program.admissionInfo.guideUrl}`);
        lines.push(`申请时间：${program.admissionInfo.applicationPeriod}`);
        lines.push(`选拔方式：${program.admissionInfo.examMethod}`);
        lines.push(`常见材料：${program.admissionInfo.requiredDocuments.join(" / ")}`);
        lines.push(`语言提示：${program.admissionInfo.languageNotes}`);
        lines.push(`核验状态：${program.admissionInfo.verificationStatus}（${program.admissionInfo.lastChecked}）`);
      } else {
        lines.push("募集要项参考：待逐项核验，请以研究科官网最新信息为准。");
      }
      lines.push("");
    });
  }

  lines.push("免责声明：推荐结果仅供申请规划参考，具体录取结果取决于导师、研究计划书、套磁、语言成绩和当年招生情况。");

  return lines.join("\n");
}
