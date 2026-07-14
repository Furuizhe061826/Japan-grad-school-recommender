export type DegreeGoal = "硕士" | "博士" | "研究生";
export type RegionPreference = "东京" | "关西" | "其他" | "不限";
export type ApplicationPreference = "排名优先" | "稳妥优先" | "研究方向匹配优先";
export type RecommendationBand = "冲刺" | "匹配" | "相对稳妥";
export type UndergraduateTier =
  | "C9 / 顶尖985"
  | "985"
  | "211"
  | "双一流非985/211"
  | "普通一本 / 普通本科"
  | "民办 / 独立学院"
  | "大专"
  | "海外本科"
  | "日本本科"
  | "其他 / 不确定";

export type StudentProfile = {
  undergraduateSchool: string;
  undergraduateTier: UndergraduateTier;
  undergraduateMajor: string;
  researchDirection: string;
  gpa: string;
  englishScore: string;
  japaneseScore: string;
  degreeGoal: DegreeGoal;
  regionPreference: RegionPreference;
  applicationPreference: ApplicationPreference;
  targetUniversity: string;
  additionalBackground: string;
};

export type GraduateProgram = {
  universityName: string;
  graduateSchool: string;
  programName: string;
  region: string;
  rankTier: number;
  fieldCategory: string;
  researchFields: string[];
  keywords: string[];
  degreeOptions: DegreeGoal[];
  englishRequirement: string;
  japaneseRequirement: string;
  difficulty: number;
  notes: string;
  admissionGuideUrl?: string;
  lastChecked?: string;
  admissionInfo?: {
    sourceLabel: string;
    guideUrl: string;
    applicationPeriod: string;
    examMethod: string;
    requiredDocuments: string[];
    supervisorContact: string;
    languageNotes: string;
    eligibilityNotes: string;
    lastChecked: string;
    verificationStatus: "官方页面已核验" | "待逐项核验";
  };
};

export type RecommendedProgram = GraduateProgram & {
  band: RecommendationBand;
  score: number;
  researchMatchScore: number;
  matchedKeywords: string[];
  scoreBreakdown: ScoreBreakdownItem[];
  scoreInsights: ScoreInsight[];
  reliability: ProgramReliability;
  noFacultyReasons: string[];
  facultyMatches: FacultyMatch[];
  reasons: string[];
  improvements: string[];
};

export type InsightLevel = "高" | "中" | "低" | "待核验";

export type ScoreInsight = {
  label: string;
  level: InsightLevel;
  score: number;
  explanation: string;
};

export type ProgramReliability = {
  programDataStatus: "项目数据已收录" | "项目数据待补充";
  admissionStatus: "募集要项已核验" | "募集要项待核验";
  facultyCoverage: "高" | "中" | "低";
  facultyMatchStatus: "有正教授命中" | "暂无强命中" | "需核验招生归属";
  facultyProfessorCount: number;
  reviewNotes: string[];
};

export type ScoreBreakdownItem = {
  key:
    | "research"
    | "faculty"
    | "difficulty"
    | "gpa"
    | "undergrad"
    | "english"
    | "japanese"
    | "experience"
    | "region"
    | "degree";
  label: string;
  score: number;
  weight: number;
  contribution: number;
};

export type RecommendationResult = {
  profile: StudentProfile;
  generatedAt: string;
  summary: string;
  targetAssessment?: TargetUniversityAssessment;
  programs: Record<RecommendationBand, RecommendedProgram[]>;
};

export type TargetUniversityAssessment = {
  requestedUniversity: string;
  resolvedUniversityName?: string;
  probabilityLabel: "较高" | "中等" | "偏低" | "高风险" | "暂无法判断";
  probabilityScore: number;
  summary: string;
  strengths: string[];
  risks: string[];
  suggestions: string[];
  bestPrograms: RecommendedProgram[];
  facultyMatches: FacultyMatch[];
  alternativeUniversityNames: string[];
};

export type FacultyProfile = {
  university: string;
  sourceAffiliation: string;
  graduateSchoolHints: string[];
  department: string;
  professorName: string;
  title: string;
  labName: string;
  researchKeywords: string[];
  researchSummary: string;
  facultyUrl: string;
  labUrl: string;
  sourceUrl: string;
  sourceDatabase: string;
  fieldCategory: string;
  lastChecked: string;
};

export type FacultyMatch = FacultyProfile & {
  matchScore: number;
  matchedKeywords: string[];
  matchReason: string;
};
