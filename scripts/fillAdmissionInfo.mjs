import fs from "node:fs";

const path = "data/programs.json";
const programs = JSON.parse(fs.readFileSync(path, "utf8"));
const checked = "2026-07-09";
const commonDocs = ["申请表", "成绩单", "毕业/预计毕业证明", "研究计划或志望理由", "语言成绩或研究科指定材料"];

function admissionInfo({
  sourceLabel,
  guideUrl,
  applicationPeriod,
  examMethod,
  supervisorContact,
  languageNotes,
  eligibilityNotes,
  requiredDocuments = commonDocs,
  verificationStatus = "官方页面已核验"
}) {
  return {
    sourceLabel,
    guideUrl,
    applicationPeriod,
    examMethod,
    requiredDocuments,
    supervisorContact,
    languageNotes,
    eligibilityNotes,
    lastChecked: checked,
    verificationStatus
  };
}

const admissionsBySchool = {
  "University of Tokyo|Graduate School of Engineering": admissionInfo({
    sourceLabel: "UTokyo Graduate School of Engineering Admissions",
    guideUrl: "https://www.t.u-tokyo.ac.jp/en/study-at-utokyo/soe/admission",
    applicationPeriod: "以工学系研究科官网最新 Application Guidelines / Regular Admission 页面为准",
    examMethod: "Regular Admission 通常包含笔试、口试等评估；具体科目和方式依专攻募集要项确认",
    supervisorContact: "建议提前确认目标研究室和教授方向；是否必须事前联系需看具体专攻要求",
    languageNotes: "英语/日语要求依专攻和项目而定，需以最新 Application Guidelines 为准",
    eligibilityNotes: "硕士、博士、专业学位项目均可能有不同资格条件，需逐项核对",
    requiredDocuments: ["申请表", "成绩单", "毕业/预计毕业证明", "研究计划相关材料", "语言成绩或其他专攻指定材料"]
  }),
  "University of Tokyo|Graduate School of Information Science and Technology": admissionInfo({
    sourceLabel: "UTokyo IST Admissions",
    guideUrl: "https://www.i.u-tokyo.ac.jp/index_e.shtml",
    applicationPeriod: "官网已发布 AY2027 Entrance Examinations 信息；具体夏季/冬季申请窗口以 Admissions 页面为准",
    examMethod: "按 Master's and Doctoral Program 募集信息确认，通常需结合笔试、口试、材料审查等要求",
    supervisorContact: "建议结合 Computer Science / AI 相关研究室提前确认导师匹配度",
    languageNotes: "IST 有英文页面和国际项目入口，语言要求仍需按具体项目募集要项确认",
    eligibilityNotes: "需确认 Master’s / Doctoral Program 或 English Program 的具体申请资格"
  }),
  "University of Tokyo|Graduate School of Economics": admissionInfo({
    sourceLabel: "UTokyo Graduate School of Economics Master's Program Admissions",
    guideUrl: "https://www.student.e.u-tokyo.ac.jp/grad/m-nyushi-e.html",
    applicationPeriod: "官网已发布 AY2027 修士课程 Schedule A / Schedule B 申请窗口；具体日期以最新 Application Guidelines 为准",
    examMethod: "修士课程通常结合网上申请、材料审查、外部考试成绩和研究科指定选拔；博士课程需另查博士项目页面",
    supervisorContact: "官网提示申请者不要在申请前联系教员，先按募集要项完成申请流程",
    languageNotes: "经济学相关课程有较多英语授课；其他专攻多要求较高日语能力，国际申请者需注意 JLPT N1 要求",
    eligibilityNotes: "国际学生原则上参加与日本申请者相同的入学考试，需逐项核对目标专攻资格条件"
  }),
  "Kyoto University|Graduate School of Informatics": admissionInfo({
    sourceLabel: "Kyoto University Graduate School of Informatics Admissions",
    guideUrl: "https://www.i.kyoto-u.ac.jp/en/admission/guide/",
    applicationPeriod: "官网展示 2026 Academic Year entrance examination schedule；后续年度需以 Guidelines for Admission 更新为准",
    examMethod: "按 Master’s / Doctoral Program 日程和 Guidelines for Admission 确认考试方式",
    supervisorContact: "信息学研究科方向细分明显，建议提前确认目标课程、研究室和教授方向",
    languageNotes: "日语/英语要求以研究科 Guidelines for Admission 为准",
    eligibilityNotes: "Master’s 与 Doctoral Program 分别公布日程和募集信息，需按目标学位核对"
  }),
  "Kyoto University|Graduate School of Engineering": admissionInfo({
    sourceLabel: "Kyoto University Graduate School of Engineering Admissions",
    guideUrl: "https://www.t.kyoto-u.ac.jp/ja/admissions/graduate",
    applicationPeriod: "以工学研究科「大学院入試の種類・スケジュール」和最新募集要項为准",
    examMethod: "修士/博士后期课程入学考试方式需按专攻页面和募集要项确认",
    supervisorContact: "土木、地震、防灾方向建议先查研究室并确认导师研究主题",
    languageNotes: "语言要求依专攻和考试类别不同，需以最新入学试验页面为准",
    eligibilityNotes: "留学生可参考工学部・工学研究科への留学页面，并按修士/博士后期入学考试确认资格",
    requiredDocuments: ["申请表", "成绩单", "毕业/预计毕业证明", "研究计划相关材料", "专攻指定材料"]
  }),
  "Kyoto University|Graduate School of Global Environmental Studies": admissionInfo({
    sourceLabel: "Kyoto University Graduate School of Global Environmental Studies Admissions",
    guideUrl: "https://www.ges.kyoto-u.ac.jp/en/",
    applicationPeriod: "官网 Admissions 栏目发布 Summer/Winter entrance examination guidelines；申请批次按硕士、博士、IEMP 或研究生类别确认",
    examMethod: "通常按课程类别进行材料审查、考试或面试，IEMP 等国际项目需单独核对指南",
    supervisorContact: "建议先确认目标课程、研究室和导师方向；部分项目需要在申请前完成导师匹配确认",
    languageNotes: "英语项目和日语项目要求不同，环境管理方向需重点核对 TOEFL/IELTS 与日语材料要求",
    eligibilityNotes: "跨学科项目对本科专业背景有一定弹性，但需按目标学位和课程确认申请资格"
  }),
  "Osaka University|Graduate School of Engineering": admissionInfo({
    sourceLabel: "University of Osaka Graduate School of Engineering Admissions",
    guideUrl: "https://www.eng.osaka-u.ac.jp/en/topics/examination/28906/",
    applicationPeriod: "以工学研究科 International Students Admissions 和最新 Application for Graduate School Admissions 更新为准",
    examMethod: "不同专攻、英文项目和普通入试的选拔方式不同，通常需结合材料审查、笔试、口试或面试确认",
    supervisorContact: "工学项目建议提前查研究室并确认教授研究主题；是否需要事前联系按专攻募集要项执行",
    languageNotes: "英文授课项目和日语授课项目要求不同，TOEFL/IELTS 与日语要求需看具体募集要项",
    eligibilityNotes: "硕士、博士、研究生路径不同，留学生需同时确认资格审查和签证时间安排"
  }),
  "Osaka University|Graduate School of Economics": admissionInfo({
    sourceLabel: "University of Osaka Admissions",
    guideUrl: "https://www.osaka-u.ac.jp/en/admissions",
    applicationPeriod: "以大阪大学入学信息和经济学研究科最新募集要项为准",
    examMethod: "经济学/经营学方向通常需根据研究科募集要项确认材料审查、笔试、口试或面试安排",
    supervisorContact: "建议先根据研究领域确认指导教员，但正式联系节奏需以研究科说明为准",
    languageNotes: "商科社科方向日语要求通常较高，英语成绩可作为研究能力和国际项目适配度补充",
    eligibilityNotes: "需要按目标课程确认硕士/博士申请资格、出愿期间和入试类别",
    verificationStatus: "待逐项核验"
  }),
  "Tohoku University|Graduate School of Engineering": admissionInfo({
    sourceLabel: "Tohoku University School of Engineering Admissions",
    guideUrl: "https://www.eng.tohoku.ac.jp/english/admission/",
    applicationPeriod: "以 Admission 页面中 Programs and Application / Application Procedures 的最新说明为准",
    examMethod: "按 Master's Programs、Doctoral Programs 或 Research Student 类别确认材料、考试和面试要求",
    supervisorContact: "工学研究科研究室导向明显，建议先确认目标教授和研究组，再准备研究计划",
    languageNotes: "英文项目较多，但普通入试和研究室沟通可能需要日语；语言成绩需以项目说明为准",
    eligibilityNotes: "硕士、博士、研究生有不同申请流程，需核对学历、预审和出愿资格"
  }),
  "Tohoku University|International Research Institute of Disaster Science": admissionInfo({
    sourceLabel: "Tohoku University IRIDeS / Disaster Science Related Programs",
    guideUrl: "https://irides.tohoku.ac.jp/eng/",
    applicationPeriod: "IRIDeS 本身为研究所，具体入学路径需通过所属研究科或灾害科学相关研究生项目确认",
    examMethod: "通常不是独立研究科单独招生，需按目标导师所属研究科的硕士/博士募集要项申请",
    supervisorContact: "必须先确认 IRIDeS 目标导师的所属研究科、实验室和可接收学生类别",
    languageNotes: "灾害科学方向可能涉及英语研究沟通，但正式入试语言要求依所属研究科而定",
    eligibilityNotes: "申请前需确认该导师是否通过工学、信息、环境或其他研究科接收硕士/博士学生"
  }),
  "Tohoku University|Graduate School of Information Sciences": admissionInfo({
    sourceLabel: "Tohoku University Graduate School of Information Sciences Admission",
    guideUrl: "https://www.is.tohoku.ac.jp/en/",
    applicationPeriod: "以 GSIS Admission / Entrance Examination 页面和最新 Admission Guidelines 为准",
    examMethod: "根据 Computer and Mathematical Sciences、System Information Sciences 等专攻确认笔试、口试、材料审查安排",
    supervisorContact: "建议提前查看目标实验室和研究方向，研究计划需明确方法、数据或系统实现路径",
    languageNotes: "信息科学方向可有英文研究沟通，但入试说明、笔试和研究室沟通可能要求日语能力",
    eligibilityNotes: "需按硕士、博士或研究生类别确认申请资格和出愿材料"
  }),
  "Nagoya University|Graduate School of Engineering": admissionInfo({
    sourceLabel: "Nagoya University Graduate Admissions / Engineering",
    guideUrl: "https://en.nagoya-u.ac.jp/admissions/graduate/",
    applicationPeriod: "以名古屋大学大学院入学信息、工学研究科最新募集要项和 G30 国际项目说明为准",
    examMethod: "普通入试、G30 英文项目和研究生路径不同，通常需结合材料审查、考试或面试确认",
    supervisorContact: "机械、航空、汽车方向建议先查工学研究科研究室并确认导师匹配",
    languageNotes: "英文项目与日语项目语言要求不同，TOEFL/IELTS、JLPT 要求需逐项确认",
    eligibilityNotes: "需核对硕士/博士/研究生资格、出愿时间和是否需要事前资格审查",
    verificationStatus: "待逐项核验"
  }),
  "Nagoya University|Graduate School of Environmental Studies": admissionInfo({
    sourceLabel: "Nagoya University Graduate School of Environmental Studies Admissions",
    guideUrl: "https://www.env.nagoya-u.ac.jp/english/admission/index.html",
    applicationPeriod: "官网列出 2026 年 First Calling、October Admission、Second Calling 等入试日程；后续年度以最新页面为准",
    examMethod: "按 Department of Environmental Engineering and Architecture 等课程确认考试、面试和网上申请流程",
    supervisorContact: "官网说明申请前需决定申请课程并联系导师，提交前应确认指导教员",
    languageNotes: "申请者需提交指定英语考试成绩；日语要求按课程和项目类别确认",
    eligibilityNotes: "研究生项目和正式硕博课程资格不同，部分研究生路径需要预审和导师内诺"
  }),
  "Nagoya University|Graduate School of Informatics": admissionInfo({
    sourceLabel: "Nagoya University Graduate School of Informatics Admissions Information",
    guideUrl: "https://www.i.nagoya-u.ac.jp/en/gs/entranceexamination/",
    applicationPeriod: "官网列出 2026 年硕士/博士不同批次的申请期间和考试日期；后续年度以最新 Guidelines 为准",
    examMethod: "硕士课程可包含口头发表、考试、面试；博士课程按项目确认口试和材料审查",
    supervisorContact: "官网提示申请者须在提交申请前联系希望指导的教员",
    languageNotes: "部分募集要项仅日文，MEXT/数据科学等项目有单独语言和材料要求",
    eligibilityNotes: "需按 Initial Two-year Program、Final Three-year Program 或研究生类别确认资格"
  }),
  "Kyushu University|Graduate School of Design": admissionInfo({
    sourceLabel: "Kyushu University Graduate School of Design Admissions",
    guideUrl: "https://www.design.kyushu-u.ac.jp/en/admissions/",
    applicationPeriod: "以九州大学设计学院最新 Admissions / Guidelines 页面为准",
    examMethod: "设计类项目通常结合材料审查、研究计划、作品集或面试，具体按课程募集要项确认",
    supervisorContact: "建议提前确认实验室、项目主题和作品集/研究计划方向是否匹配",
    languageNotes: "设计研究可能接受英语材料，但课程和导师沟通语言需逐项确认",
    eligibilityNotes: "硕士、博士、研究生和国际项目资格不同，需核对作品集、研究计划和学历条件",
    requiredDocuments: ["申请表", "成绩单", "毕业/预计毕业证明", "研究计划或志望理由", "作品集或项目说明", "语言成绩或研究科指定材料"],
    verificationStatus: "待逐项核验"
  }),
  "Kyushu University|Interdisciplinary Graduate School of Engineering Sciences": admissionInfo({
    sourceLabel: "Kyushu University Interdisciplinary Graduate School of Engineering Sciences Admissions",
    guideUrl: "https://www.tj.kyushu-u.ac.jp/en/",
    applicationPeriod: "以综合理工学府最新 Admissions / Application Guidelines 为准",
    examMethod: "能源、环境和材料方向需按专攻确认材料审查、考试、口试或面试安排",
    supervisorContact: "建议先确认目标研究室和教授研究主题，尤其是能源环境方向的实验条件和项目匹配度",
    languageNotes: "英文项目和普通项目语言要求不同，需核对 TOEFL/IELTS、日语或面试语言",
    eligibilityNotes: "需按硕士、博士、研究生类别确认申请资格和出愿材料",
    verificationStatus: "待逐项核验"
  }),
  "Kyushu University|Graduate School of Information Science and Electrical Engineering": admissionInfo({
    sourceLabel: "Kyushu University ISEE Admissions",
    guideUrl: "https://www.isee.kyushu-u.ac.jp/e/admissions.html",
    applicationPeriod: "以 ISEE Admissions、Master’s Program 和 Doctoral Program 页面最新 Application Guidelines 为准",
    examMethod: "硕士项目区分日语授课普通入试和国际项目，通常需网上申请、材料提交和研究科指定考试",
    supervisorContact: "建议提前确认目标实验室；信息、电气、通信方向需要把研究计划写到方法和技术路线",
    languageNotes: "普通项目多为日语说明，国际项目需单独确认英语成绩和语言材料",
    eligibilityNotes: "需按硕士、博士或研究生类别确认资格、网上申请和考试费流程"
  }),
  "Hokkaido University|Graduate School of Environmental Science": admissionInfo({
    sourceLabel: "Hokkaido University Graduate School of Environmental Science Admission Guide",
    guideUrl: "https://www.ees.hokudai.ac.jp/?lang=en",
    applicationPeriod: "以 Admission Guide 中 General Application、Information of Entrance Exam 和 International Applicants 最新说明为准",
    examMethod: "不同专攻和申请类别可能包含材料审查、考试、面试或导师确认流程",
    supervisorContact: "环境科学研究室导向明显，建议提前确认导师、研究主题和野外/实验条件",
    languageNotes: "英文项目较多，但普通项目和研究室沟通语言需以募集要项为准",
    eligibilityNotes: "硕士、博士、研究生和国际申请者路径不同，需核对资格审查和出愿时间"
  }),
  "Hokkaido University|Graduate School of Agriculture": admissionInfo({
    sourceLabel: "Hokkaido University Graduate School of Agriculture",
    guideUrl: "https://www.agr.hokudai.ac.jp/en/",
    applicationPeriod: "以北海道大学农学院/农业研究院最新 admission information 和 application guidelines 为准",
    examMethod: "农业、生命科学和食品方向通常按课程确认材料审查、考试或面试安排",
    supervisorContact: "建议提前确认实验室、导师和研究主题，尤其是生命科学/食品科学方向的实验匹配",
    languageNotes: "英文项目和日语项目并存，语言成绩与研究室沟通要求需逐项确认",
    eligibilityNotes: "需按硕士、博士、研究生或英文项目确认学历、预审和出愿资格",
    verificationStatus: "待逐项核验"
  }),
  "Hokkaido University|Graduate School of Engineering": admissionInfo({
    sourceLabel: "Hokkaido University Graduate School of Engineering Admissions",
    guideUrl: "https://www.eng.hokudai.ac.jp/english/",
    applicationPeriod: "以 Admission to Graduate School 和 Information for Applicants 最新页面为准",
    examMethod: "建筑、土木、寒地工程方向需按专攻确认材料审查、考试、口试或面试要求",
    supervisorContact: "建议先查研究室和指导教员，研究计划需体现寒地、基础设施或环境工程特色",
    languageNotes: "英文项目与日语项目要求不同，TOEFL/IELTS 和日语沟通要求需按募集要项确认",
    eligibilityNotes: "硕士、博士和研究生路径不同，需核对资格审查、出愿时间和材料清单"
  }),
  "Waseda University|Graduate School of Information, Production and Systems": admissionInfo({
    sourceLabel: "Waseda IPS Admissions",
    guideUrl: "https://www.waseda.jp/fsci/gips/en/applicants/admission/",
    applicationPeriod: "官网列出 2026/2027 年 9 月与 4 月入学多个申请窗口；具体以 Admission Guidelines 为准",
    examMethod: "常见选拔包括材料审查、面试或线上面试；海外申请类别可能只进行材料审查",
    supervisorContact: "IPS 提供 Supervisors List，建议申请前确认研究领域和潜在指导教授",
    languageNotes: "官网有语言能力测试要求变更通知，英语/日语成绩需按申请批次确认",
    eligibilityNotes: "需按 Recommendation、General、Working Professionals、Partner School 等类别确认资格"
  }),
  "Waseda University|Graduate School of Commerce": admissionInfo({
    sourceLabel: "Waseda University Graduate School of Commerce Admissions",
    guideUrl: "https://www.waseda.jp/fcom/gsc/en/",
    applicationPeriod: "以早稻田大学商学研究科最新 Admissions / Application Guidelines 为准",
    examMethod: "商学、市场营销、经营战略方向通常需材料审查、研究计划、笔试或面试，具体按入试类别确认",
    supervisorContact: "建议先确认研究领域和指导教授，商科研究计划需体现问题意识、数据或案例基础",
    languageNotes: "日语项目通常要求高水平日语，英文材料和英语成绩是否可用需看具体项目",
    eligibilityNotes: "需按硕士、博士和研究生类别确认资格、出愿时间和语言要求",
    verificationStatus: "待逐项核验"
  }),
  "Waseda University|Graduate School of Political Science": admissionInfo({
    sourceLabel: "Waseda Graduate School of Political Science Admissions",
    guideUrl: "https://www.waseda.jp/fpse/gsps/en/appilicants/schedule/",
    applicationPeriod: "以 Admission Process / Information for Prospective Students 页面最新日程为准",
    examMethod: "政治学、国际关系、公共政策方向通常结合材料审查、研究计划和面试/口试确认",
    supervisorContact: "建议提前确认研究方法、导师领域和论文主题，文书需要体现明确研究问题",
    languageNotes: "英文项目和日语项目语言要求不同，需按申请类别确认 TOEFL/IELTS、日语材料和面试语言",
    eligibilityNotes: "需按硕士、博士、国际项目或一般入试确认申请资格"
  }),
  "Keio University|Graduate School of Media Design": admissionInfo({
    sourceLabel: "Keio KMD Admissions",
    guideUrl: "https://www.kmd.keio.ac.jp/admissions/",
    applicationPeriod: "以 KMD Admissions 页面中 Master’s Program / Doctoral Program 最新说明为准",
    examMethod: "KMD 强调跨学科项目，常见选拔会关注材料、研究/项目计划、作品或面试表现",
    supervisorContact: "建议提前梳理项目经历、作品集和目标 faculty/research project 的匹配关系",
    languageNotes: "KMD 国际化程度高，但英语/日语要求和面试语言需按项目说明确认",
    eligibilityNotes: "硕士、博士类别要求不同，需确认作品/项目材料、学历和申请批次",
    requiredDocuments: ["申请表", "成绩单", "毕业/预计毕业证明", "研究计划或项目计划", "作品集或项目说明", "语言成绩或研究科指定材料"]
  }),
  "Keio University|Graduate School of Business and Commerce": admissionInfo({
    sourceLabel: "Keio University Graduate Admissions / Business and Commerce",
    guideUrl: "https://www.keio.ac.jp/en/admissions/grad/",
    applicationPeriod: "以庆应义塾大学 Graduate Admissions Guide 和商学研究科最新 Application Guidebook 为准",
    examMethod: "经营、经济、组织管理方向需按研究科确认材料审查、笔试、口试或面试安排",
    supervisorContact: "建议先确认研究领域和指导教员，研究计划需体现理论框架与实证/案例路径",
    languageNotes: "日语项目通常要求较高日语能力，英语成绩作为补充需看募集要项",
    eligibilityNotes: "需按硕士、博士和 AO/一般入试等类别确认资格与出愿材料"
  }),
  "Keio University|Graduate School of Science and Technology": admissionInfo({
    sourceLabel: "Keio University Graduate Admissions / Science and Technology",
    guideUrl: "https://www.keio.ac.jp/en/admissions/grad/",
    applicationPeriod: "以庆应义塾大学 Graduate Admissions Guide 和理工学研究科最新 Application Guidebook 为准",
    examMethod: "系统设计、机械系统、智能工程方向通常需按专攻确认材料审查、考试、口试或面试要求",
    supervisorContact: "建议提前确认研究室和教授方向，研究计划应写清系统、控制、机械或智能工程方法",
    languageNotes: "英语/日语要求依专攻和入试类别不同，需以最新募集要项为准",
    eligibilityNotes: "需按硕士、博士类别确认学历、预审、出愿期间和材料清单"
  })
};

for (const program of programs) {
  const key = `${program.universityName}|${program.graduateSchool}`;
  if (admissionsBySchool[key]) {
    program.admissionInfo = admissionsBySchool[key];
  }
}

fs.writeFileSync(path, `${JSON.stringify(programs, null, 2)}\n`, "utf8");

const missing = programs.filter((program) => !program.admissionInfo);
if (missing.length > 0) {
  console.error(missing.map((program) => `${program.universityName} / ${program.graduateSchool}`).join("\n"));
  process.exit(1);
}

console.log(`Updated admissionInfo for ${programs.length} programs.`);
