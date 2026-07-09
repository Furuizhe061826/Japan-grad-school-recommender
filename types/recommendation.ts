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
  reasons: string[];
  improvements: string[];
};

export type ScoreBreakdownItem = {
  key: "research" | "gpa" | "english" | "japanese" | "undergrad" | "region" | "rank" | "degree";
  label: string;
  score: number;
  weight: number;
  contribution: number;
};

export type RecommendationResult = {
  profile: StudentProfile;
  generatedAt: string;
  summary: string;
  programs: Record<RecommendationBand, RecommendedProgram[]>;
};
