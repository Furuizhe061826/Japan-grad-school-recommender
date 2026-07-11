import fs from "node:fs";

const outputPath = "data/programs.json";
const lastChecked = "2026-07-11";

const commonAdmissionInfo = {
  sourceLabel: "University of Osaka Graduate School of Engineering Science official pages",
  guideUrl: "https://www.es.osaka-u.ac.jp/en/",
  applicationPeriod: "以基礎工学研究科最新 Admissions / Application Guidelines 为准",
  examMethod: "不同专攻、课程和申请类别可能采用材料审查、笔试、口试或面试，需逐项核对募集要项",
  requiredDocuments: ["申请表", "成绩单", "毕业/预计毕业证明", "研究计划或志望理由", "语言成绩或研究科指定材料"],
  supervisorContact: "建议结合研究室列表确认教授方向；是否需要事前联系按研究科和专攻说明执行",
  languageNotes: "英语和日语要求需按具体专攻、课程和导师沟通语言确认",
  eligibilityNotes: "需确认目标学位、出愿资格审查、材料提交方式和研究生/硕博课程差异",
  lastChecked,
  verificationStatus: "待逐项核验"
};

const programs = [
  {
    universityName: "Osaka University",
    graduateSchool: "Graduate School of Engineering Science",
    programName: "Materials Engineering Science / Quantum Materials / Chemistry",
    region: "关西",
    rankTier: 1,
    fieldCategory: "工学",
    researchFields: ["材料科学", "金属材料", "量子材料", "化学工程"],
    keywords: [
      "材料",
      "材料科学",
      "金属",
      "金属材料",
      "合金",
      "轻合金",
      "化学",
      "催化",
      "量子",
      "凝聚态",
      "表面",
      "薄膜"
    ],
    degreeOptions: ["硕士", "博士", "研究生"],
    englishRequirement: "建议 TOEFL 80+ / IELTS 6.0+，具体以专攻募集要项为准",
    japaneseRequirement: "普通入试建议 JLPT N2+；英文研究沟通需按实验室确认",
    difficulty: 87,
    notes: "适合材料、金属、合金、化学工程、量子材料、表面/薄膜与功能材料方向。教授库已优先补充基礎工学研究科材料工程科学相关正教授。",
    admissionInfo: commonAdmissionInfo
  },
  {
    universityName: "Osaka University",
    graduateSchool: "Graduate School of Engineering Science",
    programName: "Mechanical Science / Bioengineering / Medical Robotics",
    region: "关西",
    rankTier: 1,
    fieldCategory: "工学",
    researchFields: ["机械科学", "生物工程", "医工", "医疗机器人"],
    keywords: [
      "机械",
      "机器人",
      "控制",
      "流体",
      "固体力学",
      "材料力学",
      "生物医学",
      "医工",
      "医疗机器人",
      "生物力学",
      "健康信息"
    ],
    degreeOptions: ["硕士", "博士", "研究生"],
    englishRequirement: "建议 TOEFL 80+ / IELTS 6.0+，具体以专攻募集要项为准",
    japaneseRequirement: "普通入试建议 JLPT N2+；实验室沟通语言需单独确认",
    difficulty: 86,
    notes: "适合机械、流体、固体力学、医工、生物力学、医疗机器人和健康信息方向。教授库已补充多个机械科学与生物工程相关研究室。",
    admissionInfo: commonAdmissionInfo
  },
  {
    universityName: "Osaka University",
    graduateSchool: "Graduate School of Engineering Science",
    programName: "Systems Innovation / Robotics / Quantum Information",
    region: "关西",
    rankTier: 1,
    fieldCategory: "工学",
    researchFields: ["系统创新", "机器人", "控制系统", "量子信息", "人机交互"],
    keywords: [
      "系统",
      "机器人",
      "控制",
      "人机交互",
      "社会机器人",
      "投影映射",
      "增强现实",
      "量子信息",
      "量子计算",
      "光通信",
      "优化"
    ],
    degreeOptions: ["硕士", "博士", "研究生"],
    englishRequirement: "建议 TOEFL 85+ / IELTS 6.5+，具体以专攻募集要项为准",
    japaneseRequirement: "日语项目建议 JLPT N2+；机器人/系统方向需确认导师沟通语言",
    difficulty: 88,
    notes: "适合机器人、控制、HRI、量子信息、光通信、系统优化和智能交互方向。教授库已补充 Ishiguro Lab、机器人机构、控制系统、量子信息等研究室。",
    admissionInfo: commonAdmissionInfo
  }
];

const existingPrograms = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const keys = new Set(programs.map((program) => `${program.universityName}:${program.graduateSchool}:${program.programName}`));

const preservedPrograms = existingPrograms.filter(
  (program) => !keys.has(`${program.universityName}:${program.graduateSchool}:${program.programName}`)
);
const lastOsakaIndex = preservedPrograms.reduce(
  (lastIndex, program, index) => (program.universityName === "Osaka University" ? index : lastIndex),
  -1
);
const insertIndex = lastOsakaIndex >= 0 ? lastOsakaIndex + 1 : preservedPrograms.length;
const nextPrograms = [
  ...preservedPrograms.slice(0, insertIndex),
  ...programs,
  ...preservedPrograms.slice(insertIndex)
];

fs.writeFileSync(outputPath, `${JSON.stringify(nextPrograms, null, 2)}\n`, "utf8");
console.log(`Added ${programs.length} Osaka University Engineering Science programs. Total: ${nextPrograms.length}.`);
