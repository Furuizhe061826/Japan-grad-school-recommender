import fs from "node:fs";

const dataPath = "data/programs.json";
const programs = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const degreeOptions = ["硕士", "博士", "研究生"];

const fieldTemplates = {
  info: {
    graduateSchool: "Graduate School of Science and Engineering",
    programName: "Computer Science / Data Science / AI",
    fieldCategory: "信息",
    researchFields: ["计算机科学", "数据科学", "人工智能"],
    keywords: ["计算机", "数据", "人工智能", "机器学习", "算法", "系统", "图像处理", "信息"],
    englishRequirement: "建议 TOEFL 70-80+ / IELTS 6.0+，具体以研究科募集要项为准",
    japaneseRequirement: "日语项目建议 JLPT N2+；英文研究需确认导师沟通语言"
  },
  engineering: {
    graduateSchool: "Graduate School of Science and Engineering",
    programName: "Mechanical / Electrical / Systems Engineering",
    fieldCategory: "工学",
    researchFields: ["机械工程", "电气电子", "系统工程"],
    keywords: ["机械", "电气", "电子", "控制", "机器人", "系统", "制造", "能源"],
    englishRequirement: "建议 TOEFL 70-80+ / IELTS 6.0+，具体以研究科募集要项为准",
    japaneseRequirement: "日语项目建议 JLPT N2+，实验室沟通语言需逐项确认"
  },
  civil: {
    graduateSchool: "Graduate School of Science and Engineering",
    programName: "Civil Engineering / Architecture / Urban Systems",
    fieldCategory: "工学",
    researchFields: ["土木工程", "建筑", "都市系统"],
    keywords: ["土木", "建筑", "结构", "抗震", "混凝土", "城市", "环境", "基础设施"],
    englishRequirement: "建议 TOEFL 70-80+ / IELTS 6.0+，具体以研究科募集要项为准",
    japaneseRequirement: "日语授课和设计/规划类方向通常建议 JLPT N2+"
  },
  materials: {
    graduateSchool: "Graduate School of Science and Engineering",
    programName: "Materials Science / Applied Chemistry",
    fieldCategory: "理学",
    researchFields: ["材料科学", "应用化学", "能源材料"],
    keywords: ["材料", "金属", "合金", "化学", "能源", "纳米", "半导体", "实验"],
    englishRequirement: "建议 TOEFL 70-80+ / IELTS 6.0+，具体以研究科募集要项为准",
    japaneseRequirement: "研究室不同，建议 JLPT N2+ 或较强英语科研沟通能力"
  },
  lifeEnv: {
    graduateSchool: "Graduate School of Life and Environmental Sciences",
    programName: "Life Science / Environmental Science / Food Systems",
    fieldCategory: "生命农业",
    researchFields: ["生命科学", "环境科学", "食品资源"],
    keywords: ["生命", "生物", "环境", "食品", "农业", "资源", "生态", "可持续"],
    englishRequirement: "建议 TOEFL 70-80+ / IELTS 6.0+，具体以研究科募集要项为准",
    japaneseRequirement: "日语项目建议 JLPT N2+，英文项目需单独确认"
  },
  business: {
    graduateSchool: "Graduate School of Business / Economics / Social Sciences",
    programName: "Economics / Business / Policy Studies",
    fieldCategory: "商科社科",
    researchFields: ["经济学", "经营管理", "政策研究"],
    keywords: ["经济", "经营", "管理", "金融", "政策", "社会", "数据分析", "统计"],
    englishRequirement: "建议 TOEFL 70-80+ / IELTS 6.0+，英文项目以募集要项为准",
    japaneseRequirement: "日语项目通常建议 JLPT N1-N2，社科研究计划书表达很重要"
  },
  design: {
    graduateSchool: "Graduate School of Design / Media / Human Sciences",
    programName: "Design / Media / Human-Computer Interaction",
    fieldCategory: "设计",
    researchFields: ["设计学", "媒体", "人机交互"],
    keywords: ["设计", "媒体", "用户体验", "交互", "人机交互", "认知", "产品", "创新"],
    englishRequirement: "建议 TOEFL 70-80+ / IELTS 6.0+，作品集或研究计划要求需确认",
    japaneseRequirement: "日语项目建议 JLPT N2+；设计类需确认作品集和面试语言"
  }
};

const universities = [
  { name: "University of Tsukuba", region: "其他", rankTier: 2, difficulty: 82, fields: ["info", "engineering", "lifeEnv", "business", "design"] },
  { name: "Kobe University", region: "关西", rankTier: 2, difficulty: 82, fields: ["engineering", "info", "business", "lifeEnv"] },
  { name: "Yokohama National University", region: "东京", rankTier: 2, difficulty: 80, fields: ["engineering", "civil", "business", "info"] },
  { name: "Tokyo Metropolitan University", region: "东京", rankTier: 2, difficulty: 79, fields: ["info", "engineering", "civil", "design"] },
  { name: "Chiba University", region: "东京", rankTier: 2, difficulty: 79, fields: ["engineering", "materials", "lifeEnv", "design"] },
  { name: "Hiroshima University", region: "其他", rankTier: 2, difficulty: 78, fields: ["info", "engineering", "lifeEnv", "business"] },
  { name: "Tokyo University of Science", region: "东京", rankTier: 2, difficulty: 78, fields: ["info", "engineering", "materials", "business"] },
  { name: "Sophia University", region: "东京", rankTier: 2, difficulty: 77, fields: ["business", "info", "design"] },
  { name: "Tokyo University of Agriculture and Technology", region: "东京", rankTier: 3, difficulty: 76, fields: ["engineering", "materials", "lifeEnv", "info"] },
  { name: "The University of Electro-Communications", region: "东京", rankTier: 3, difficulty: 76, fields: ["info", "engineering", "design"] },
  { name: "Saitama University", region: "东京", rankTier: 3, difficulty: 73, fields: ["info", "engineering", "civil", "business"] },
  { name: "Shizuoka University", region: "其他", rankTier: 3, difficulty: 72, fields: ["info", "engineering", "materials", "lifeEnv"] },
  { name: "Shinshu University", region: "其他", rankTier: 3, difficulty: 72, fields: ["engineering", "materials", "lifeEnv", "business"] },
  { name: "Kanazawa University", region: "其他", rankTier: 3, difficulty: 73, fields: ["info", "engineering", "materials", "lifeEnv"] },
  { name: "Okayama University", region: "其他", rankTier: 3, difficulty: 73, fields: ["info", "engineering", "lifeEnv", "business"] },
  { name: "Kumamoto University", region: "其他", rankTier: 3, difficulty: 72, fields: ["info", "engineering", "civil", "lifeEnv"] },
  { name: "Niigata University", region: "其他", rankTier: 3, difficulty: 70, fields: ["engineering", "materials", "lifeEnv", "business"] },
  { name: "Gifu University", region: "其他", rankTier: 3, difficulty: 70, fields: ["engineering", "materials", "lifeEnv"] },
  { name: "Mie University", region: "其他", rankTier: 3, difficulty: 69, fields: ["engineering", "lifeEnv", "business"] },
  { name: "Yamagata University", region: "其他", rankTier: 3, difficulty: 69, fields: ["engineering", "materials", "lifeEnv"] },
  { name: "Nagasaki University", region: "其他", rankTier: 3, difficulty: 70, fields: ["engineering", "lifeEnv", "business"] },
  { name: "Kagoshima University", region: "其他", rankTier: 3, difficulty: 68, fields: ["engineering", "lifeEnv", "business"] },
  { name: "Tokushima University", region: "其他", rankTier: 3, difficulty: 69, fields: ["engineering", "materials", "lifeEnv"] },
  { name: "Ehime University", region: "其他", rankTier: 3, difficulty: 68, fields: ["engineering", "lifeEnv", "business"] },
  { name: "Toyama University", region: "其他", rankTier: 3, difficulty: 68, fields: ["engineering", "materials", "lifeEnv"] },
  { name: "Meiji University", region: "东京", rankTier: 3, difficulty: 74, fields: ["business", "info", "engineering", "design"] },
  { name: "Aoyama Gakuin University", region: "东京", rankTier: 3, difficulty: 73, fields: ["business", "info", "design"] },
  { name: "Rikkyo University", region: "东京", rankTier: 3, difficulty: 72, fields: ["business", "design", "lifeEnv"] },
  { name: "Chuo University", region: "东京", rankTier: 3, difficulty: 72, fields: ["business", "info", "engineering"] },
  { name: "Hosei University", region: "东京", rankTier: 3, difficulty: 71, fields: ["business", "info", "engineering", "design"] },
  { name: "Doshisha University", region: "关西", rankTier: 3, difficulty: 74, fields: ["business", "info", "engineering", "design"] },
  { name: "Ritsumeikan University", region: "关西", rankTier: 3, difficulty: 73, fields: ["info", "engineering", "business", "design"] },
  { name: "Kwansei Gakuin University", region: "关西", rankTier: 3, difficulty: 71, fields: ["business", "info", "design"] },
  { name: "Kansai University", region: "关西", rankTier: 3, difficulty: 70, fields: ["business", "info", "engineering", "civil"] },
  { name: "Shibaura Institute of Technology", region: "东京", rankTier: 3, difficulty: 72, fields: ["engineering", "info", "civil", "materials"] },
  { name: "Tokyo City University", region: "东京", rankTier: 4, difficulty: 68, fields: ["engineering", "info", "civil", "design"] },
  { name: "Tokyo Denki University", region: "东京", rankTier: 4, difficulty: 67, fields: ["info", "engineering", "materials"] },
  { name: "Kogakuin University", region: "东京", rankTier: 4, difficulty: 66, fields: ["engineering", "info", "civil", "design"] },
  { name: "Nihon University", region: "东京", rankTier: 4, difficulty: 66, fields: ["engineering", "civil", "business", "design"] },
  { name: "Toyo University", region: "东京", rankTier: 4, difficulty: 65, fields: ["business", "info", "lifeEnv", "design"] },
  { name: "Komazawa University", region: "东京", rankTier: 4, difficulty: 64, fields: ["business", "design"] },
  { name: "Senshu University", region: "东京", rankTier: 4, difficulty: 64, fields: ["business", "info"] },
  { name: "Kanagawa University", region: "东京", rankTier: 4, difficulty: 64, fields: ["engineering", "info", "business"] },
  { name: "Kindai University", region: "关西", rankTier: 4, difficulty: 66, fields: ["info", "engineering", "lifeEnv", "business"] },
  { name: "Ryukoku University", region: "关西", rankTier: 4, difficulty: 64, fields: ["business", "lifeEnv", "design"] },
  { name: "Kyoto Sangyo University", region: "关西", rankTier: 4, difficulty: 64, fields: ["business", "info", "lifeEnv"] },
  { name: "Osaka Institute of Technology", region: "关西", rankTier: 4, difficulty: 65, fields: ["engineering", "info", "civil", "design"] },
  { name: "Konan University", region: "关西", rankTier: 4, difficulty: 64, fields: ["business", "info", "lifeEnv"] },
  { name: "Meijo University", region: "其他", rankTier: 4, difficulty: 64, fields: ["engineering", "materials", "business"] },
  { name: "Chukyo University", region: "其他", rankTier: 4, difficulty: 63, fields: ["business", "info", "design"] },
  { name: "Fukuoka University", region: "其他", rankTier: 4, difficulty: 63, fields: ["engineering", "lifeEnv", "business"] },
  { name: "Chiba Institute of Technology", region: "东京", rankTier: 4, difficulty: 62, fields: ["engineering", "info", "materials"] },
  { name: "Osaka Sangyo University", region: "关西", rankTier: 5, difficulty: 60, fields: ["engineering", "business", "design"] },
  { name: "Setsunan University", region: "关西", rankTier: 5, difficulty: 60, fields: ["engineering", "lifeEnv", "business"] },
  { name: "Teikyo University", region: "东京", rankTier: 5, difficulty: 60, fields: ["business", "lifeEnv", "design"] }
];

function buildProgram(university, fieldKey) {
  const template = fieldTemplates[fieldKey];
  return {
    universityName: university.name,
    graduateSchool: template.graduateSchool,
    programName: template.programName,
    region: university.region,
    rankTier: university.rankTier,
    fieldCategory: template.fieldCategory,
    researchFields: template.researchFields,
    keywords: template.keywords,
    degreeOptions,
    englishRequirement: template.englishRequirement,
    japaneseRequirement: template.japaneseRequirement,
    difficulty: university.difficulty + (fieldKey === "info" ? 2 : fieldKey === "business" ? 0 : 1),
    notes: "基础覆盖条目，用于扩大推荐候选池；具体研究科、导师和募集要项需后续逐项核验。"
  };
}

const existingIds = new Set(programs.map((program) => `${program.universityName}|${program.graduateSchool}|${program.programName}`));
let added = 0;

for (const university of universities) {
  for (const fieldKey of university.fields) {
    const program = buildProgram(university, fieldKey);
    const id = `${program.universityName}|${program.graduateSchool}|${program.programName}`;
    if (existingIds.has(id)) continue;

    programs.push(program);
    existingIds.add(id);
    added += 1;
  }
}

fs.writeFileSync(dataPath, `${JSON.stringify(programs, null, 2)}\n`, "utf8");
console.log(`Added ${added} broad-coverage programs. Total: ${programs.length}.`);
