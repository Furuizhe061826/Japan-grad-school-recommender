import fs from "node:fs";

const outputPath = "data/facultyProfiles.json";
const lastChecked = "2026-07-11";
const sourceDatabase = "Nagoya University official faculty/laboratory pages";

const sources = {
  informaticsTop: "https://www.i.nagoya-u.ac.jp/en/",
  mathematical: "https://www.i.nagoya-u.ac.jp/en/prof/mathematical/",
  complexSystems: "https://www.i.nagoya-u.ac.jp/en/prof/study_a03/",
  computing: "https://www.i.nagoya-u.ac.jp/en/prof/study_a06/",
  intelligent: "https://www.i.nagoya-u.ac.jp/en/prof/study_a07/",
  engineeringLabo: "https://cd.engg.nagoya-u.ac.jp/link2lab/",
  mechanical: "https://cd.engg.nagoya-u.ac.jp/link2lab/mech.html",
  material: "https://cd.engg.nagoya-u.ac.jp/link2lab/material.html",
  civil: "https://cd.engg.nagoya-u.ac.jp/link2lab/civil.html",
  envFaculty: "https://www.env.nagoya-u.ac.jp/english/faculty_list/english.php"
};

const kw = {
  ai: ["人工智能", "机器学习", "深度学习", "数据科学", "AI", "machine learning", "deep learning", "data science", "artificial intelligence"],
  vision: ["计算机视觉", "图像处理", "图像识别", "多媒体", "medical image processing", "computer vision", "image processing", "pattern recognition", "multimedia"],
  nlp: ["自然语言处理", "对话系统", "信息检索", "natural language processing", "dialogue system", "information retrieval", "language information"],
  software: ["软件工程", "程序验证", "形式化方法", "software engineering", "program verification", "formal methods", "theorem proving"],
  network: ["网络", "信息安全", "数据库", "通信", "network", "cyber security", "database", "data engineering", "communication"],
  robotics: ["机器人", "控制", "自动驾驶", "移动系统", "robotics", "robot", "control", "autonomous driving", "mobility system"],
  materials: ["材料", "材料科学", "金属材料", "合金", "轻合金", "materials science", "metal", "alloy", "light alloy"],
  processing: ["材料加工", "制造", "成形", "process engineering", "materials processing", "forming", "manufacturing"],
  energy: ["能源", "环境", "可持续", "脱碳", "energy", "environment", "sustainability", "decarbonization"],
  civil: ["土木", "结构", "混凝土", "钢结构", "基础设施", "civil engineering", "structural engineering", "concrete", "infrastructure"],
  seismic: ["抗震", "地震", "防灾", "灾害", "earthquake engineering", "seismic", "disaster mitigation", "disaster prevention"],
  urban: ["城市", "交通", "规划", "建筑", "urban planning", "transportation", "architecture", "built environment"],
  biomedical: ["生物医学", "医工", "生命科学", "biomedical", "bioinformatics", "life science"]
};

function profile({
  sourceAffiliation,
  graduateSchoolHints,
  department,
  professorName,
  labName,
  researchKeywords,
  researchSummary,
  fieldCategory,
  sourceUrl,
  facultyUrl = sourceUrl,
  labUrl = sourceUrl
}) {
  return {
    university: "Nagoya University",
    sourceAffiliation,
    graduateSchoolHints,
    department,
    professorName,
    title: "Professor",
    labName,
    researchKeywords: Array.from(new Set(researchKeywords)),
    researchSummary,
    facultyUrl,
    labUrl,
    sourceUrl,
    sourceDatabase,
    fieldCategory,
    lastChecked
  };
}

function informatics({ department, professorName, labName, keywords, summary, fieldCategory = "信息/AI", sourceUrl }) {
  return profile({
    sourceAffiliation: "Graduate School of Informatics",
    graduateSchoolHints: ["Graduate School of Informatics"],
    department: `Graduate School of Informatics, ${department}`,
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl
  });
}

function engineering({ department, professorName, labName, keywords, summary, fieldCategory = "工学", sourceUrl }) {
  return profile({
    sourceAffiliation: "Graduate School of Engineering",
    graduateSchoolHints: ["Graduate School of Engineering"],
    department: `Graduate School of Engineering, ${department}`,
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl
  });
}

function environment({ department, professorName, labName, keywords, summary, fieldCategory = "能源环境", sourceUrl = sources.envFaculty }) {
  return profile({
    sourceAffiliation: "Graduate School of Environmental Studies",
    graduateSchoolHints: ["Graduate School of Environmental Studies"],
    department: `Graduate School of Environmental Studies, ${department}`,
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl
  });
}

const nagoyaProfiles = [
  informatics({
    department: "Department of Mathematical Informatics",
    professorName: "Yasuo Yoshinobu",
    labName: "Theoretical Informatics and Mathematics",
    keywords: ["mathematical logic", "axiomatic set theory", "theoretical informatics", "mathematics"],
    summary: "Researches mathematical logic, axiomatic set theory and theoretical foundations of informatics.",
    sourceUrl: sources.mathematical
  }),
  informatics({
    department: "Department of Mathematical Informatics",
    professorName: "Hirotaka Ono",
    labName: "Theoretical Informatics and Mathematics",
    keywords: ["algorithm theory", "computational complexity", "approximation algorithm", "parameterized algorithm"],
    summary: "Researches algorithm theory, computational complexity, approximation algorithms and parameterized algorithms.",
    sourceUrl: sources.mathematical
  }),
  informatics({
    department: "Department of Mathematical Informatics",
    professorName: "Mutsunori Yagiura",
    labName: "Mathematical Modeling and Informatics",
    keywords: ["combinatorial optimization", "metaheuristics", "general problem solver", "operations research"],
    summary: "Works on combinatorial optimization, metaheuristics and general-purpose problem-solving methods.",
    sourceUrl: sources.mathematical
  }),
  informatics({
    department: "Department of Mathematical Informatics",
    professorName: "Harumichi Nishimura",
    labName: "Mathematical Modeling and Informatics",
    keywords: ["quantum computing", "computational complexity", "quantum information", "algorithm"],
    summary: "Studies quantum computing and computational complexity in mathematical informatics.",
    sourceUrl: sources.mathematical
  }),
  informatics({
    department: "Department of Mathematical Informatics",
    professorName: "Francesco Buscemi",
    labName: "Mathematical Modeling and Informatics",
    keywords: ["quantum foundations", "quantum measurements", "quantum communication", "quantum computing"],
    summary: "Researches quantum foundations, quantum measurement, quantum communication and quantum computing.",
    sourceUrl: sources.mathematical
  }),

  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Shogo Tanimura",
    labName: "Many-Body Systems Science",
    keywords: ["quantum mechanics", "geometric methods in physics", "many-body systems", "mathematical physics"],
    summary: "Researches quantum mechanics, geometric methods in physics and many-body systems science.",
    sourceUrl: sources.complexSystems,
    fieldCategory: "其他"
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Keiichiro Tokita",
    labName: "Many-Body Systems Science",
    keywords: ["statistical physics", "mathematical biology", "science of diversity", "complex systems"],
    summary: "Studies statistical physics, mathematical biology and diversity in complex systems.",
    sourceUrl: sources.complexSystems,
    fieldCategory: "其他"
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Yasuyuki Nakamura",
    labName: "Many-Body Systems Science",
    keywords: [...kw.ai, "e-learning", "learning analytics", "statistical physics"],
    summary: "Researches e-learning, learning analytics and statistical physics approaches to education data.",
    sourceUrl: sources.complexSystems
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Motonori Ota",
    labName: "Life-Science Informatics",
    keywords: [...kw.biomedical, ...kw.ai, "systems biology", "protein structures", "protein complexes", "interaction network"],
    summary: "Researches systems biology, protein structures, interaction networks and life-science informatics.",
    sourceUrl: sources.complexSystems,
    fieldCategory: "生命/医工"
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Yoshihiro Yamanishi",
    labName: "Life-Science Informatics",
    keywords: [...kw.biomedical, ...kw.ai, "bioinformatics", "chemoinformatics", "deep generative model"],
    summary: "Studies bioinformatics, chemoinformatics, AI, machine learning and deep generative models.",
    sourceUrl: sources.complexSystems,
    fieldCategory: "生命/医工"
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Norio Yoshida",
    labName: "Materials Informatics",
    keywords: [...kw.materials, "theoretical chemistry", "solution chemistry", "computational chemistry", "materials informatics"],
    summary: "Researches theoretical chemistry, solution chemistry and materials informatics.",
    sourceUrl: sources.complexSystems,
    fieldCategory: "材料/化学"
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Masahiro Higashi",
    labName: "Materials Informatics",
    keywords: [...kw.materials, "theoretical chemistry", "molecular science", "computational chemistry"],
    summary: "Studies theoretical chemistry, molecular science and computational approaches to materials.",
    sourceUrl: sources.complexSystems,
    fieldCategory: "材料/化学"
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Eisuke Kita",
    labName: "Emergent Systems",
    keywords: [...kw.ai, "multi-agent system", "social system", "Bayesian network"],
    summary: "Researches multi-agent systems, social systems, Bayesian networks and emergent complex systems.",
    sourceUrl: sources.complexSystems
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Reiji Suzuki",
    labName: "Emergent Systems",
    keywords: [...kw.ai, "artificial life", "agent-based modeling", "evolutionary computation"],
    summary: "Studies artificial life, agent-based modeling and evolutionary computation.",
    sourceUrl: sources.complexSystems
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Hedong Zhang",
    labName: "Complex Systems Computation",
    keywords: [...kw.materials, "nano physical phenomena", "nano-metrology", "nano-tribology", "simulation"],
    summary: "Researches simulation of nano physical phenomena, nano-metrology and nano-tribology.",
    sourceUrl: sources.complexSystems,
    fieldCategory: "材料/化学"
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Keigo Matsuda",
    labName: "Complex Systems Computation",
    keywords: [...kw.processing, "process engineering", "computational science", "thermodynamics"],
    summary: "Works on process engineering, computational science and thermodynamics for complex systems.",
    sourceUrl: sources.complexSystems,
    fieldCategory: "材料/化学"
  }),
  informatics({
    department: "Department of Complex Systems Science",
    professorName: "Tomomi Uchiyama",
    labName: "Information Visualization Unit",
    keywords: ["computational fluid dynamics", "multiphase flow engineering", "fluid simulation", "visualization"],
    summary: "Researches computational fluid dynamics and multiphase flow engineering.",
    sourceUrl: sources.complexSystems,
    fieldCategory: "能源环境"
  }),

  informatics({
    department: "Department of Computing and Software Systems",
    professorName: "Masahiko Sakai",
    labName: "Theory of Computation Unit",
    keywords: [...kw.software, "term rewriting systems", "program transformation", "automatic theorem proving"],
    summary: "Researches term rewriting systems, program transformation and automatic theorem proving.",
    sourceUrl: sources.computing
  }),
  informatics({
    department: "Department of Computing and Software Systems",
    professorName: "Mutsunori Banbara",
    labName: "Theory of Computation Unit",
    keywords: [...kw.software, "SAT", "constraint programming", "answer-set programming"],
    summary: "Studies SAT, constraint programming and answer-set programming.",
    sourceUrl: sources.computing
  }),
  informatics({
    department: "Department of Computing and Software Systems",
    professorName: "Naoki Nishida",
    labName: "Theory of Computation Unit",
    keywords: [...kw.software, "term rewriting system", "program transformation", "automated theorem proving"],
    summary: "Researches term rewriting systems, program transformation and automated theorem proving.",
    sourceUrl: sources.computing
  }),
  informatics({
    department: "Department of Computing and Software Systems",
    professorName: "Hiroaki Takada",
    labName: "Information System Platform Unit",
    keywords: ["embedded computing system", "real-time computing", "operating system", "automotive systems"],
    summary: "Researches embedded computing systems, real-time computing and operating systems.",
    sourceUrl: sources.computing
  }),
  informatics({
    department: "Department of Computing and Software Systems",
    professorName: "Tohru Ishihara",
    labName: "Information System Platform Unit",
    keywords: ["embedded system", "low power system design", "energy efficient computing", "hardware"],
    summary: "Studies embedded systems, low-power system design and energy-efficient computing.",
    sourceUrl: sources.computing
  }),
  informatics({
    department: "Department of Computing and Software Systems",
    professorName: "Shinya Honda",
    labName: "Information System Platform Unit",
    keywords: ["embedded system", "virtualization", "hardware software co-design", "system platform"],
    summary: "Works on embedded systems, virtualization and hardware/software co-design.",
    sourceUrl: sources.computing
  }),
  informatics({
    department: "Department of Computing and Software Systems",
    professorName: "Shoji Yuen",
    labName: "Software Science and Technology Unit",
    keywords: [...kw.software, "concurrency", "communicating processes", "program verification"],
    summary: "Researches concurrency, communicating processes and program verification.",
    sourceUrl: sources.computing
  }),
  informatics({
    department: "Department of Computing and Software Systems",
    professorName: "Yuichi Kaji",
    labName: "Software Science and Technology Unit",
    keywords: [...kw.software, "software science", "programming", "information systems"],
    summary: "Works in software science and software systems.",
    sourceUrl: sources.computing
  }),
  informatics({
    department: "Department of Computing and Software Systems",
    professorName: "Tutomu Murase",
    labName: "Information Network Systems Unit",
    keywords: [...kw.network, "quality of service", "congestion control", "mobile network", "traffic control"],
    summary: "Researches information network systems, QoS control, congestion control, mobile networks and cyber security.",
    sourceUrl: sources.computing
  }),
  informatics({
    department: "Department of Computing and Software Systems",
    professorName: "Takahiro Katagiri",
    labName: "Information Network Systems Unit",
    keywords: [...kw.ai, "high performance computing", "software auto-tuning", "massively parallel algorithms"],
    summary: "Researches high-performance computing, software auto-tuning and massively parallel algorithms.",
    sourceUrl: sources.computing
  }),

  informatics({
    department: "Department of Intelligent Systems",
    professorName: "Ichiro Ide",
    labName: "Media Informatics Unit",
    keywords: [...kw.vision, "multimedia contents processing"],
    summary: "Researches multimedia content processing, media informatics, image and video understanding.",
    sourceUrl: sources.intelligent
  }),
  informatics({
    department: "Department of Intelligent Systems",
    professorName: "Tomoki Toda",
    labName: "Media Informatics Unit",
    keywords: [...kw.ai, "speech processing", "sound signal processing", "speech communication enhancement"],
    summary: "Studies speech processing, sound signal processing and speech communication enhancement.",
    sourceUrl: sources.intelligent
  }),
  informatics({
    department: "Department of Intelligent Systems",
    professorName: "Yoshiharu Ishikawa",
    labName: "System Informatics Unit",
    keywords: [...kw.network, "databases", "data engineering", "web information systems"],
    summary: "Researches databases, data engineering and web information systems.",
    sourceUrl: sources.intelligent
  }),
  informatics({
    department: "Department of Intelligent Systems",
    professorName: "Kensaku Mori",
    labName: "System Informatics Unit",
    keywords: [...kw.vision, ...kw.biomedical, "visualization", "medical image processing"],
    summary: "Researches image processing, visualization and medical image processing.",
    sourceUrl: sources.intelligent,
    fieldCategory: "生命/医工"
  }),
  informatics({
    department: "Department of Intelligent Systems",
    professorName: "Katsuhiko Toyama",
    labName: "System Informatics Unit",
    keywords: [...kw.nlp, "knowledge information processing", "e-legislation"],
    summary: "Works on knowledge and language information processing, natural language processing and e-legislation.",
    sourceUrl: sources.intelligent
  }),
  informatics({
    department: "Department of Intelligent Systems",
    professorName: "Koji Zettsu",
    labName: "System Informatics Unit",
    keywords: [...kw.ai, ...kw.network, "data engineering", "AI orchestration"],
    summary: "Researches data engineering, machine learning and AI orchestration.",
    sourceUrl: sources.intelligent
  }),
  informatics({
    department: "Department of Intelligent Systems",
    professorName: "Katashi Nagao",
    labName: "Field Informatics Unit",
    keywords: [...kw.robotics, ...kw.ai, "intelligent agents", "contents", "personal robots", "vehicles"],
    summary: "Researches intelligent agents, content systems, personal robots and intelligent vehicles.",
    sourceUrl: sources.intelligent,
    fieldCategory: "机器人/控制"
  }),
  informatics({
    department: "Department of Intelligent Systems",
    professorName: "Ryuichiro Higashinaka",
    labName: "Field Informatics Unit",
    keywords: [...kw.nlp, ...kw.ai, "dialogue system"],
    summary: "Studies dialogue systems and natural language processing.",
    sourceUrl: sources.intelligent
  }),
  informatics({
    department: "Department of Intelligent Systems",
    professorName: "Shigeki Matsubara",
    labName: "Field Informatics Unit",
    keywords: [...kw.nlp, "information retrieval", "digital library"],
    summary: "Researches natural language processing, information retrieval and digital libraries.",
    sourceUrl: sources.intelligent
  }),

  engineering({
    department: "Mechanical Systems Engineering",
    professorName: "方星 長野",
    labName: "Thermal Control Engineering Group",
    keywords: [...kw.energy, "thermal control", "heat transfer", "thermal engineering"],
    summary: "Researches thermal control, heat transfer and energy-related mechanical systems.",
    sourceUrl: sources.mechanical,
    fieldCategory: "能源环境"
  }),
  engineering({
    department: "Mechanical Systems Engineering",
    professorName: "一郎 成瀬",
    labName: "Environment and Energy Engineering Group",
    keywords: [...kw.energy, "combustion", "environmental energy engineering", "thermal system"],
    summary: "Works on environmental and energy engineering for mechanical/thermal systems.",
    sourceUrl: sources.mechanical,
    fieldCategory: "能源环境"
  }),
  engineering({
    department: "Mechanical Systems Engineering",
    professorName: "るり 日出間",
    labName: "Complex Fluid Engineering Group",
    keywords: ["complex fluids", "fluid mechanics", "rheology", "soft matter"],
    summary: "Researches complex fluids, rheology and fluid mechanics.",
    sourceUrl: sources.mechanical,
    fieldCategory: "能源环境"
  }),
  engineering({
    department: "Mechanical Systems Engineering",
    professorName: "英次郎 前田",
    labName: "Biomechanics Group",
    keywords: [...kw.biomedical, "biomechanics", "mechanobiology", "bioengineering"],
    summary: "Researches biomechanics, bioengineering and mechanical analysis of biological systems.",
    sourceUrl: sources.mechanical,
    fieldCategory: "生命/医工"
  }),
  engineering({
    department: "Mechanical Systems Engineering",
    professorName: "大 奥村",
    labName: "Solid Mechanics Group",
    keywords: [...kw.materials, "solid mechanics", "materials mechanics", "fracture", "deformation"],
    summary: "Studies solid mechanics, deformation, fracture and materials mechanics.",
    sourceUrl: sources.mechanical,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Mechanical Systems Engineering",
    professorName: "剛志 井上",
    labName: "Machine Dynamics Group",
    keywords: ["machine dynamics", "vibration", "rotor dynamics", "mechanical systems"],
    summary: "Researches machine dynamics, vibration and mechanical system behavior.",
    sourceUrl: sources.mechanical
  }),
  engineering({
    department: "Mechanical Systems Engineering",
    professorName: "幸治 水野",
    labName: "Automotive Safety Engineering Group",
    keywords: ["automotive safety", "vehicle engineering", "crash safety", "mobility"],
    summary: "Works on automotive safety engineering, vehicle engineering and crash safety.",
    sourceUrl: sources.mechanical
  }),
  engineering({
    department: "Mechanical Systems Engineering",
    professorName: "忠義 青山",
    labName: "Cyber Robotics Group",
    keywords: [...kw.robotics, "cyber robotics", "robot control"],
    summary: "Researches cyber robotics, robotic systems and robot control.",
    sourceUrl: sources.mechanical,
    fieldCategory: "机器人/控制"
  }),
  engineering({
    department: "Mechanical Systems Engineering",
    professorName: "一郎 竹内",
    labName: "Data-Driven Systems Group",
    keywords: [...kw.ai, "data-driven systems", "machine learning", "optimization"],
    summary: "Studies data-driven systems, machine learning and optimization for mechanical systems.",
    sourceUrl: sources.mechanical,
    fieldCategory: "信息/AI"
  }),
  engineering({
    department: "Mechanical Systems Engineering",
    professorName: "達也 鈴木",
    labName: "Mobility Systems Group",
    keywords: [...kw.robotics, "mobility systems", "autonomous driving", "vehicle control"],
    summary: "Researches mobility systems, vehicle control and autonomous driving technologies.",
    sourceUrl: sources.mechanical,
    fieldCategory: "机器人/控制"
  }),
  engineering({
    department: "Micro-Nano Mechanical Science and Engineering",
    professorName: "伸太郎 伊藤",
    labName: "Fluid Systems Engineering Group",
    keywords: ["fluid systems", "micro/nano mechanical engineering", "fluid mechanics"],
    summary: "Researches fluid systems engineering in micro/nano mechanical systems.",
    sourceUrl: sources.mechanical
  }),
  engineering({
    department: "Micro-Nano Mechanical Science and Engineering",
    professorName: "健二 福澤",
    labName: "Sensing Engineering Group",
    keywords: ["sensing engineering", "nano measurement", "tribology", "micro/nano systems"],
    summary: "Works on sensing engineering, nano measurement and tribology.",
    sourceUrl: sources.mechanical
  }),
  engineering({
    department: "Micro-Nano Mechanical Science and Engineering",
    professorName: "隆行 星野",
    labName: "Biocybernetics Group",
    keywords: [...kw.biomedical, "biocybernetics", "bioMEMS", "micro systems"],
    summary: "Researches biocybernetics, bioMEMS and micro/nano systems for biological applications.",
    sourceUrl: sources.mechanical,
    fieldCategory: "生命/医工"
  }),
  engineering({
    department: "Micro-Nano Mechanical Science and Engineering",
    professorName: "泰久 長谷川",
    labName: "Intelligent Robotics Group",
    keywords: [...kw.robotics, "intelligent robotics", "robot control", "assistive robot"],
    summary: "Studies intelligent robotics and robot control.",
    sourceUrl: sources.mechanical,
    fieldCategory: "机器人/控制"
  }),
  engineering({
    department: "Micro-Nano Mechanical Science and Engineering",
    professorName: "誠一 秦",
    labName: "Micro-Nano Process Engineering Group",
    keywords: [...kw.processing, "micro/nano process", "MEMS", "manufacturing"],
    summary: "Researches micro/nano process engineering, MEMS and manufacturing processes.",
    sourceUrl: sources.mechanical
  }),
  engineering({
    department: "Aerospace Engineering",
    professorName: "拓 野々村",
    labName: "Fluid Dynamics Group",
    keywords: ["aerodynamics", "fluid dynamics", "aerospace engineering", "flow simulation"],
    summary: "Researches aerospace fluid dynamics, aerodynamics and flow simulation.",
    sourceUrl: sources.mechanical
  }),
  engineering({
    department: "Aerospace Engineering",
    professorName: "次郎 笠原",
    labName: "Propulsion and Energy Systems Engineering Group",
    keywords: ["space propulsion", "propulsion energy systems", "combustion", "aerospace engineering"],
    summary: "Researches propulsion, combustion and aerospace energy systems.",
    sourceUrl: sources.mechanical
  }),
  engineering({
    department: "Aerospace Engineering",
    professorName: "政大 荒井",
    labName: "Structural Mechanics Group",
    keywords: [...kw.materials, "structural mechanics", "aerospace structures", "composite structures"],
    summary: "Studies structural mechanics and aerospace structures.",
    sourceUrl: sources.mechanical,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Aerospace Engineering",
    professorName: "英二 社本",
    labName: "Production Engineering Group",
    keywords: [...kw.processing, "production engineering", "precision machining", "manufacturing"],
    summary: "Researches production engineering, precision machining and manufacturing systems.",
    sourceUrl: sources.mechanical
  }),
  engineering({
    department: "Aerospace Engineering",
    professorName: "彰記 吉村",
    labName: "Advanced Composite Materials Group",
    keywords: [...kw.materials, "advanced composite materials", "composite structures", "aerospace materials"],
    summary: "Works on advanced composite materials and aerospace composite structures.",
    sourceUrl: sources.mechanical,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Aerospace Engineering",
    professorName: "茂 砂田",
    labName: "Aerospace Vehicle Motion Systems Engineering Group",
    keywords: ["aerospace vehicle", "flight dynamics", "spacecraft systems", "control"],
    summary: "Researches aerospace vehicle motion systems, flight dynamics and control.",
    sourceUrl: sources.mechanical
  }),
  engineering({
    department: "Aerospace Engineering",
    professorName: "進 原",
    labName: "Control Systems Engineering Group",
    keywords: [...kw.robotics, "control systems", "aerospace control", "dynamic systems"],
    summary: "Studies control systems engineering for aerospace and dynamic systems.",
    sourceUrl: sources.mechanical,
    fieldCategory: "机器人/控制"
  }),

  engineering({
    department: "Materials Design Engineering",
    professorName: "肇 君塚",
    labName: "Computational Materials Properties Group",
    keywords: [...kw.materials, ...kw.ai, "computational materials", "materials design"],
    summary: "Researches computational materials properties and materials design.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Materials Design Engineering",
    professorName: "吉隆 足立",
    labName: "Materials Control Engineering Group",
    keywords: [...kw.materials, "microstructure control", "steel", "metallic materials"],
    summary: "Studies materials control engineering, microstructure and metallic materials.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Materials Design Engineering",
    professorName: "剛久 山本",
    labName: "Nanostructure Control Group",
    keywords: [...kw.materials, "nanostructure control", "electron microscopy", "ceramics", "interface"],
    summary: "Researches nanostructure control, interfaces and advanced materials characterization.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Materials Design Engineering",
    professorName: "尚記 高田",
    labName: "Structural Materials Design Group",
    keywords: [...kw.materials, "structural materials", "alloy design", "metallic microstructure", "mechanical properties"],
    summary: "Works on structural materials design, alloy design and mechanical properties of metallic materials.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Materials Design Engineering",
    professorName: "崇司 中村",
    labName: "Energy Functional Design Engineering Group",
    keywords: [...kw.materials, ...kw.energy, "energy functional materials", "battery", "fuel cell"],
    summary: "Researches energy functional materials and design engineering for energy devices.",
    sourceUrl: sources.material,
    fieldCategory: "能源环境"
  }),
  engineering({
    department: "Materials Design Engineering",
    professorName: "恭寿 入山",
    labName: "Nanoionics Design Engineering Group",
    keywords: [...kw.materials, ...kw.energy, "nanoionics", "solid-state battery", "ion conductor"],
    summary: "Studies nanoionics, solid-state batteries and ion-conducting materials.",
    sourceUrl: sources.material,
    fieldCategory: "能源环境"
  }),
  engineering({
    department: "Materials Design Engineering",
    professorName: "寛 原田",
    labName: "Materials Processing Engineering Group",
    keywords: [...kw.materials, ...kw.processing, "materials forming", "metal processing"],
    summary: "Researches materials processing engineering, materials forming and metal processing.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Materials Process Engineering",
    professorName: "喜章 川尻",
    labName: "Process Informatics Engineering Group",
    keywords: [...kw.ai, ...kw.processing, "process informatics", "process systems engineering"],
    summary: "Works on process informatics, process systems engineering and data-driven process design.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Materials Process Engineering",
    professorName: "誠一 髙見",
    labName: "Rate Process Engineering Group",
    keywords: [...kw.processing, "rate process", "reaction process", "nanomaterials synthesis"],
    summary: "Researches rate process engineering and materials synthesis processes.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Materials Process Engineering",
    professorName: "眞 小橋",
    labName: "Composite Materials Process Engineering Group",
    keywords: [...kw.materials, ...kw.processing, "composite materials", "porous metals", "lightweight materials"],
    summary: "Researches composite materials processes, porous metals and lightweight materials.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Materials Process Engineering",
    professorName: "徹 宇治原",
    labName: "Crystal Growth Informatics Engineering Group",
    keywords: [...kw.materials, ...kw.ai, "crystal growth", "semiconductor", "process informatics"],
    summary: "Studies crystal growth informatics, semiconductor materials and process optimization.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Materials Process Engineering",
    professorName: "徳隆 宇佐美",
    labName: "Energy and Environmental Materials Creation Group",
    keywords: [...kw.materials, ...kw.energy, "solar cells", "semiconductor materials", "energy materials"],
    summary: "Works on energy and environmental materials, semiconductor materials and solar-cell-related materials.",
    sourceUrl: sources.material,
    fieldCategory: "能源环境"
  }),
  engineering({
    department: "Materials Process Engineering",
    professorName: "悠輔 山内",
    labName: "Nanotectonics Materials Creation Group",
    keywords: [...kw.materials, "nanomaterials", "porous materials", "inorganic nanomaterials"],
    summary: "Researches functional inorganic nanomaterials, porous materials and nanotectonics materials creation.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Materials Process Engineering",
    professorName: "謙 王",
    labName: "Energy Conversion and Catalytic Materials Group",
    keywords: [...kw.materials, ...kw.energy, "catalytic materials", "energy conversion", "electrocatalysis"],
    summary: "Studies catalytic materials, energy conversion and electrochemical/catalytic material systems.",
    sourceUrl: sources.material,
    fieldCategory: "能源环境"
  }),
  engineering({
    department: "Chemical Systems Engineering",
    professorName: "行庸 則永",
    labName: "Circulation Systems Engineering Group",
    keywords: [...kw.energy, "circulation systems", "chemical systems engineering", "resource circulation"],
    summary: "Researches circulation systems, chemical systems engineering and resource/energy processes.",
    sourceUrl: sources.material,
    fieldCategory: "能源环境"
  }),
  engineering({
    department: "Chemical Systems Engineering",
    professorName: "彰 井藤",
    labName: "Nano Biomedical Engineering Group",
    keywords: [...kw.biomedical, "nano biomedical engineering", "biomaterials", "medical engineering"],
    summary: "Researches nano biomedical engineering, biomaterials and medical engineering systems.",
    sourceUrl: sources.material,
    fieldCategory: "生命/医工"
  }),
  engineering({
    department: "Chemical Systems Engineering",
    professorName: "勝俊 永岡",
    labName: "Catalyst Reaction Systems Engineering Group",
    keywords: [...kw.energy, "catalyst", "reaction systems", "chemical reaction engineering"],
    summary: "Studies catalyst reaction systems and chemical reaction engineering.",
    sourceUrl: sources.material,
    fieldCategory: "能源环境"
  }),
  engineering({
    department: "Chemical Systems Engineering",
    professorName: "豊 松尾",
    labName: "Organic Optoelectronic Materials Chemistry Group",
    keywords: [...kw.materials, "organic optoelectronic materials", "organic electronics", "functional materials"],
    summary: "Researches organic optoelectronic materials chemistry and functional organic materials.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Chemical Systems Engineering",
    professorName: "良一 市野",
    labName: "Materials Electrochemistry Group",
    keywords: [...kw.materials, "materials electrochemistry", "surface treatment", "electrochemical process"],
    summary: "Studies materials electrochemistry, surface treatment and electrochemical materials processes.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),
  engineering({
    department: "Chemical Systems Engineering",
    professorName: "永宏 齋藤",
    labName: "Interface and Reaction Dynamics Group",
    keywords: [...kw.materials, "plasma", "interface reaction", "reaction dynamics", "nanomaterials"],
    summary: "Researches interface/reaction dynamics, plasma processes and nanomaterials.",
    sourceUrl: sources.material,
    fieldCategory: "材料/化学"
  }),

  engineering({
    department: "Civil Engineering",
    professorName: "準治 加藤",
    labName: "Structural Analysis and Steel Structures Group",
    keywords: [...kw.civil, "steel structure", "structural analysis", "structural optimization"],
    summary: "Studies structural analysis, steel structures and structural optimization.",
    sourceUrl: sources.civil,
    fieldCategory: "防灾"
  }),
  engineering({
    department: "Civil Engineering",
    professorName: "光 中村",
    labName: "Materials and Morphology Group",
    keywords: [...kw.civil, "concrete", "reinforced concrete", "structural materials"],
    summary: "Researches concrete, reinforced concrete, structural materials and morphology of civil structures.",
    sourceUrl: sources.civil,
    fieldCategory: "防灾"
  }),
  engineering({
    department: "Civil Engineering",
    professorName: "祐嗣 戸田",
    labName: "River Engineering and Watershed Management Group",
    keywords: [...kw.civil, kw.energy[1], "river engineering", "watershed management", "flood"],
    summary: "Researches river engineering, watershed management and flood-related water systems.",
    sourceUrl: sources.civil,
    fieldCategory: "能源环境"
  }),
  engineering({
    department: "Civil Engineering",
    professorName: "正樹 中野",
    labName: "Geotechnical Materials Group",
    keywords: [...kw.civil, ...kw.seismic, "geotechnical materials", "soil mechanics"],
    summary: "Studies geotechnical materials, soil mechanics and ground engineering.",
    sourceUrl: sources.civil,
    fieldCategory: "防灾"
  }),
  engineering({
    department: "Civil Engineering",
    professorName: "利弘 野田",
    labName: "Geomechanics and Geotechnical Disaster Prevention Group",
    keywords: [...kw.civil, ...kw.seismic, "geomechanics", "geotechnical disaster prevention"],
    summary: "Researches geomechanics, earthquake/geotechnical disaster prevention and soil behavior.",
    sourceUrl: sources.civil,
    fieldCategory: "防灾"
  }),
  engineering({
    department: "Civil Engineering",
    professorName: "和雄 舘石",
    labName: "Infrastructure Design Group",
    keywords: [...kw.civil, "infrastructure design", "bridge engineering", "steel structure"],
    summary: "Works on infrastructure design, bridge engineering and structural maintenance.",
    sourceUrl: sources.civil,
    fieldCategory: "防灾"
  }),
  engineering({
    department: "Civil Engineering",
    professorName: "俊行 山本",
    labName: "Network Systems Group",
    keywords: [...kw.urban, "transportation network", "travel behavior", "traffic systems"],
    summary: "Researches transportation network systems, travel behavior and traffic systems.",
    sourceUrl: sources.civil,
    fieldCategory: "商科社科"
  }),

  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Hideki Nakamura",
    labName: "Sustainable Urban Development",
    keywords: [...kw.urban, "traffic flow", "highway planning", "traffic safety", "automated driving"],
    summary: "Researches traffic flow, highway planning, traffic safety and automated driving impacts.",
    fieldCategory: "商科社科"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Tomoaki Nakamura",
    labName: "Sustainable Urban Development",
    keywords: [...kw.civil, ...kw.seismic, "coastal engineering", "coastal disaster prevention", "wave power generation"],
    summary: "Researches coastal engineering, coastal disaster prevention, coastal erosion and wave energy.",
    fieldCategory: "防灾"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Hirokazu Kato",
    labName: "Decarbonization Urban and Transport Strategy",
    keywords: [...kw.urban, ...kw.energy, "life cycle assessment", "transport strategy", "sustainable region"],
    summary: "Works on decarbonization urban/transport strategy, LCA and sustainable regional planning.",
    fieldCategory: "商科社科"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Takashi Hibino",
    labName: "Material-Systems Science in Environment",
    keywords: [...kw.materials, ...kw.energy, "fuel cell", "hydrogen generation", "biomass", "carbon resources"],
    summary: "Researches energy materials, fuel cells, hydrogen generation and biomass/plastic resource utilization.",
    fieldCategory: "能源环境"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Hiroki Tanikawa",
    labName: "Risk Management for Natural and Built Environment",
    keywords: [...kw.urban, ...kw.energy, ...kw.ai, "material stock flow analysis", "urban sustainability", "city-scale assessment"],
    summary: "Studies material stock/flow analysis, city-scale sustainability and AI-assisted stock quantification.",
    fieldCategory: "能源环境"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Miho Iryo",
    labName: "Land, Infrastructure and Transportation Management",
    keywords: [...kw.urban, "personal mobility", "traffic simulation", "traffic safety", "pedestrian traffic"],
    summary: "Researches mobility, traffic simulation, traffic safety and urban/infrastructure transportation management.",
    fieldCategory: "商科社科"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Nobuhiro Toya",
    labName: "Environmental and Safety Management",
    keywords: [...kw.urban, "architectural history", "historic buildings", "castle towns", "temple and shrine architecture"],
    summary: "Researches architectural history, historic buildings and urban/architectural heritage.",
    fieldCategory: "商科社科"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Satoru Iizuka",
    labName: "Environmental Engineering and Building Services",
    keywords: [...kw.urban, ...kw.energy, "thermal environment", "airflow", "building fire CFD", "computer simulation"],
    summary: "Studies thermal, airflow and wind environments, urban/building environments and building fire CFD.",
    fieldCategory: "能源环境"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Fuminobu Ozaki",
    labName: "Structural Engineering, Materials Engineering and Disaster Prevention",
    keywords: [...kw.civil, ...kw.seismic, "structural fire resistance", "steel structure", "fire engineering", "reliability engineering"],
    summary: "Researches structural fire resistance, steel structures, fire engineering and reliability engineering.",
    fieldCategory: "防灾"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Jun Tobita",
    labName: "Structural Engineering, Materials Engineering and Disaster Prevention",
    keywords: [...kw.civil, ...kw.seismic, "experimental structural dynamics", "disaster information system"],
    summary: "Works on structural engineering, earthquake engineering, disaster mitigation and experimental structural dynamics.",
    fieldCategory: "防灾"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Masafumi Mori",
    labName: "Structural Engineering, Materials Engineering and Disaster Prevention",
    keywords: [...kw.civil, ...kw.seismic, "pile foundation", "soil-structure interaction"],
    summary: "Researches earthquake engineering, pile foundations, soil-structure interaction and disaster mitigation.",
    fieldCategory: "防灾"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Toshiki Kimura",
    labName: "Building Structure and Construction Systems",
    keywords: [...kw.civil, "architectural structures", "structural design", "structural optimization", "shell structures"],
    summary: "Studies architectural structures, structural design, optimization and shell/spatial structures.",
    fieldCategory: "防灾"
  }),
  environment({
    department: "Department of Environmental Engineering and Architecture",
    professorName: "Teruyuki Saito",
    labName: "Architectural and Environmental Design",
    keywords: [...kw.urban, ...kw.energy, "environmental psychology", "thermal environment", "air-conditioning", "energy conservation"],
    summary: "Researches environmental psychology/physiology, thermal comfort, HVAC and building energy conservation.",
    fieldCategory: "能源环境"
  }),

  environment({
    department: "Department of Social and Human Environment",
    professorName: "Naoyuki Mikami",
    labName: "Environmental Policies",
    keywords: [...kw.energy, "public participation", "climate assembly", "science communication", "technology assessment"],
    summary: "Researches public participation, climate democracy, science communication and environmental sociology.",
    fieldCategory: "商科社科"
  }),
  environment({
    department: "Department of Social and Human Environment",
    professorName: "Yasushi Maruyama",
    labName: "Environmental Sociology",
    keywords: [...kw.energy, "renewable energy", "social acceptance", "environmental sociology", "science technology society"],
    summary: "Studies renewable energy, sustainability, environmental sociology and social acceptance.",
    fieldCategory: "商科社科"
  }),
  environment({
    department: "Department of Social and Human Environment",
    professorName: "Makiko Nakano",
    labName: "Economic Environment",
    keywords: [...kw.energy, "environmental economics", "sustainable consumption", "environmental innovation", "productivity analysis"],
    summary: "Researches environmental economics, sustainable consumption, environmental innovation and productivity analysis.",
    fieldCategory: "商科社科"
  }),
  environment({
    department: "Department of Social and Human Environment",
    professorName: "Makoto Takahashi",
    labName: "Geography / Disaster and Risk Governance",
    keywords: [...kw.seismic, ...kw.urban, "risk governance", "community development", "rural regions"],
    summary: "Works on natural disaster and risk governance, community development and changing rural/urban regions.",
    fieldCategory: "防灾"
  }),
  environment({
    department: "Department of Social and Human Environment",
    professorName: "Kenji Muroi",
    labName: "Sociology / Development and Disaster",
    keywords: [...kw.seismic, ...kw.urban, "development and disaster", "urbanization", "community", "climate adaptation"],
    summary: "Researches development and disaster, urbanization, community and adaptation to climate change.",
    fieldCategory: "防灾"
  })
];

const existingProfiles = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const preservedProfiles = existingProfiles.filter(
  (profile) => !(profile.university === "Nagoya University" && profile.sourceDatabase === sourceDatabase)
);
const nextProfiles = [...preservedProfiles, ...nagoyaProfiles].sort((a, b) =>
  `${a.university} ${a.professorName} ${a.labName}`.localeCompare(`${b.university} ${b.professorName} ${b.labName}`)
);

fs.writeFileSync(outputPath, `${JSON.stringify(nextProfiles, null, 2)}\n`, "utf8");
console.log(`Added ${nagoyaProfiles.length} curated Nagoya University professor/lab profiles. Total: ${nextProfiles.length}.`);
