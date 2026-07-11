import fs from "node:fs";

const outputPath = "data/facultyProfiles.json";
const lastChecked = "2026-07-11";

const sources = {
  kyushuOrg: "https://www.kyushu-u.ac.jp/en/",
  hokkaidoEngineering: "https://www.global.hokudai.ac.jp/research-education/engineering/",
  hokkaidoIst: "https://www.global.hokudai.ac.jp/research-education/information-science-and-technology/",
  hokkaidoResearcher: "https://researchers.general.hokudai.ac.jp/",
  scienceTokyoComputing: "https://www.isct.ac.jp/en/001/about/organizations/school-of-computing",
  scienceTokyoEngineering: "https://www.isct.ac.jp/en/001/about/organizations/school-of-engineering",
  scienceTokyoCsLabs: "https://educ.titech.ac.jp/cs/eng/faculty/research_lab/",
  scienceTokyoMechLabs: "https://educ.titech.ac.jp/mech/eng/faculty/research_lab/",
  scienceTokyoOrg: "https://www.isct.ac.jp/en/001/about/organizations"
};

const kw = {
  ai: ["人工智能", "机器学习", "深度学习", "数据科学", "AI", "machine learning", "deep learning", "data science", "artificial intelligence"],
  vision: ["计算机视觉", "图像处理", "图像识别", "三维识别", "多媒体", "computer vision", "image processing", "visual recognition", "3D recognition", "multimedia"],
  nlp: ["自然语言处理", "对话系统", "信息检索", "文本生成", "natural language processing", "dialogue system", "information retrieval", "language generation"],
  software: ["软件工程", "程序语言", "形式化方法", "软件验证", "software engineering", "programming languages", "formal methods", "software verification"],
  network: ["网络", "信息安全", "隐私保护", "分布式系统", "network", "security", "privacy", "distributed systems", "cybersecurity"],
  hardware: ["计算机体系结构", "硬件", "FPGA", "ASIC", "VLSI", "computer architecture", "hardware acceleration", "processor"],
  robotics: ["机器人", "控制", "智能系统", "自动驾驶", "robotics", "robot", "control", "autonomous systems"],
  materials: ["材料", "材料科学", "金属材料", "合金", "轻合金", "materials science", "metal", "alloy", "light alloy"],
  chemistry: ["化学", "催化", "高分子", "chemical science", "catalysis", "polymer"],
  energy: ["能源", "环境", "可持续", "脱碳", "energy", "environment", "sustainability", "decarbonization"],
  civil: ["土木", "结构", "混凝土", "钢结构", "基础设施", "civil engineering", "structural engineering", "concrete", "infrastructure"],
  seismic: ["抗震", "地震", "防灾", "灾害", "earthquake engineering", "seismic", "disaster prevention", "disaster mitigation"],
  aerospace: ["航空航天", "卫星", "宇宙", "aerospace", "space systems", "satellite", "space debris"],
  biomedical: ["生物医学", "医工", "生命科学", "bioinformatics", "biomedical", "life science", "drug discovery"]
};

function uniq(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function profile({
  university,
  sourceAffiliation,
  graduateSchoolHints,
  department,
  professorName,
  labName,
  researchKeywords,
  researchSummary,
  fieldCategory,
  sourceUrl,
  sourceDatabase,
  facultyUrl = sourceUrl,
  labUrl = sourceUrl
}) {
  return {
    university,
    sourceAffiliation,
    graduateSchoolHints,
    department,
    professorName,
    title: "Professor",
    labName,
    researchKeywords: uniq(researchKeywords),
    researchSummary,
    facultyUrl,
    labUrl,
    sourceUrl,
    sourceDatabase,
    fieldCategory,
    lastChecked
  };
}

function kyushu({ school, department, professorName, labName, keywords, summary, fieldCategory, sourceUrl = sources.kyushuOrg }) {
  return profile({
    university: "Kyushu University",
    sourceAffiliation: school,
    graduateSchoolHints: [school],
    department: `${school}, ${department}`,
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl,
    sourceDatabase: "Kyushu University official organization pages and public faculty directory references"
  });
}

function hokkaido({ school, department, professorName, labName, keywords, summary, fieldCategory, sourceUrl = sources.hokkaidoResearcher }) {
  return profile({
    university: "Hokkaido University",
    sourceAffiliation: school,
    graduateSchoolHints: [school],
    department: `${school}, ${department}`,
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl,
    sourceDatabase: "Hokkaido University official organization pages and researcher directory references"
  });
}

function scienceTokyo({ school, department, professorName, labName, keywords, summary, fieldCategory, sourceUrl }) {
  return profile({
    university: "Institute of Science Tokyo",
    sourceAffiliation: school,
    graduateSchoolHints: [school],
    department: `${school}, ${department}`,
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl,
    sourceDatabase: "Institute of Science Tokyo official school and laboratory pages"
  });
}

const kyushuProfiles = [
  kyushu({
    school: "Graduate School of Information Science and Electrical Engineering",
    department: "Computer Science and Communication Engineering",
    professorName: "Seiichi Uchida",
    labName: "Uchida Laboratory",
    keywords: [...kw.ai, ...kw.vision, "pattern recognition", "document image analysis", "human-centered AI"],
    summary: "Works on pattern recognition, document image analysis and human-centered artificial intelligence.",
    fieldCategory: "信息/AI"
  }),
  kyushu({
    school: "Graduate School of Information Science and Electrical Engineering",
    department: "Computer Science and Communication Engineering",
    professorName: "Ryusuke Sagawa",
    labName: "Sagawa Laboratory",
    keywords: [...kw.vision, ...kw.ai, "3D sensing", "robot vision", "computer graphics"],
    summary: "Researches computer vision, 3D sensing and visual recognition for real-world systems.",
    fieldCategory: "信息/AI"
  }),
  kyushu({
    school: "Graduate School of Information Science and Electrical Engineering",
    department: "Computer Science and Communication Engineering",
    professorName: "Koji Inoue",
    labName: "Inoue Laboratory",
    keywords: [...kw.hardware, ...kw.ai, "computer architecture", "high performance computing", "low-power computing"],
    summary: "Studies computer architecture, high-performance computing and low-power processor systems.",
    fieldCategory: "信息/计算机系统"
  }),
  kyushu({
    school: "Graduate School of Information Science and Electrical Engineering",
    department: "Computer Science and Communication Engineering",
    professorName: "Makoto Yokoo",
    labName: "Yokoo Laboratory",
    keywords: [...kw.ai, "multi-agent systems", "game theory", "market design", "constraint optimization"],
    summary: "Studies artificial intelligence, multi-agent systems, mechanism design and constraint reasoning.",
    fieldCategory: "信息/AI"
  }),
  kyushu({
    school: "Graduate School of Information Science and Electrical Engineering",
    department: "Electrical and Electronic Engineering",
    professorName: "Hiroshi Tsutsui",
    labName: "Tsutsui Laboratory",
    keywords: [...kw.hardware, "embedded systems", "image processing hardware", "signal processing"],
    summary: "Focuses on embedded systems, VLSI design and efficient hardware for signal and image processing.",
    fieldCategory: "信息/电子"
  }),
  kyushu({
    school: "Graduate School of Engineering",
    department: "Aeronautics and Astronautics",
    professorName: "Toshihiro Hanada",
    labName: "Hanada Laboratory",
    keywords: [...kw.aerospace, "space debris", "orbital environment", "space systems"],
    summary: "Researches space systems engineering, orbital environment and space debris mitigation.",
    fieldCategory: "航空航天"
  }),
  kyushu({
    school: "Graduate School of Engineering",
    department: "Mechanical Engineering",
    professorName: "Kenji Kaneko",
    labName: "Kaneko Laboratory",
    keywords: [...kw.robotics, "humanoid robotics", "mechanism design", "mechatronics"],
    summary: "Studies robotics, humanoid robot mechanisms and intelligent mechatronic systems.",
    fieldCategory: "机器人/控制"
  }),
  kyushu({
    school: "Graduate School of Engineering",
    department: "Civil and Structural Engineering",
    professorName: "Takeshi Sugiyama",
    labName: "Concrete Engineering Laboratory",
    keywords: [...kw.civil, ...kw.seismic, "durability", "maintenance", "reinforced concrete"],
    summary: "Covers concrete engineering, infrastructure durability and structural maintenance topics.",
    fieldCategory: "工学/建筑土木"
  }),
  kyushu({
    school: "Graduate School of Engineering",
    department: "Materials Science and Engineering",
    professorName: "Hiroshi Abe",
    labName: "Materials Design Laboratory",
    keywords: [...kw.materials, "microstructure", "materials design", "metal processing"],
    summary: "Researches metallic materials, microstructure control and materials design.",
    fieldCategory: "材料/化学"
  }),
  kyushu({
    school: "Graduate School of Engineering",
    department: "Applied Chemistry",
    professorName: "Seiji Shinkai",
    labName: "Molecular Self-Assembly Research",
    keywords: [...kw.chemistry, "molecular self-assembly", "supramolecular chemistry", "functional molecules"],
    summary: "Known for work in supramolecular chemistry, functional molecules and molecular self-assembly.",
    fieldCategory: "材料/化学"
  }),
  kyushu({
    school: "Graduate School of Design",
    department: "Human Science / Acoustic Design / Media Design",
    professorName: "Masaki Omori",
    labName: "Human Interface and Design Laboratory",
    keywords: [...kw.vision, ...kw.ai, "human interface", "design engineering", "media design"],
    summary: "Connects human interface, media design and information technologies for design research.",
    fieldCategory: "设计/人机交互"
  }),
  kyushu({
    school: "Interdisciplinary Graduate School of Engineering Sciences",
    department: "Energy and Environmental Engineering",
    professorName: "Takeshi Tsuji",
    labName: "Geoenergy and Subsurface Systems Laboratory",
    keywords: [...kw.energy, "geoenergy", "geophysics", "subsurface imaging", "carbon storage"],
    summary: "Works on geoenergy, subsurface imaging and environmental energy systems.",
    fieldCategory: "能源环境"
  })
];

const hokkaidoProfiles = [
  hokkaido({
    school: "Graduate School of Information Science and Technology",
    department: "Media and Network Technologies",
    professorName: "Miki Haseyama",
    labName: "Haseyama Laboratory",
    keywords: [...kw.vision, ...kw.ai, "multimedia retrieval", "image recognition", "affective computing"],
    summary: "Studies multimedia information processing, image recognition and intelligent media retrieval.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.hokkaidoIst
  }),
  hokkaido({
    school: "Graduate School of Information Science and Technology",
    department: "Media and Network Technologies",
    professorName: "Yuji Sakamoto",
    labName: "Information Media Laboratory",
    keywords: [...kw.vision, "holography", "computational imaging", "optical communication", "3D display"],
    summary: "Works on holography, computational imaging and high-efficiency visual communication.",
    fieldCategory: "信息/多媒体",
    sourceUrl: sources.hokkaidoIst
  }),
  hokkaido({
    school: "Graduate School of Information Science and Technology",
    department: "Electronics for Informatics",
    professorName: "Tetsuya Asai",
    labName: "Neuromorphic Engineering Laboratory",
    keywords: [...kw.hardware, ...kw.ai, "neuromorphic computing", "brain-inspired systems", "LSI"],
    summary: "Researches neuromorphic computing, brain-inspired electronics and intelligent hardware systems.",
    fieldCategory: "信息/电子"
  }),
  hokkaido({
    school: "Graduate School of Information Science and Technology",
    department: "Computer Science and Information Technology",
    professorName: "Hiroki Arimura",
    labName: "Data Mining and Knowledge Discovery Laboratory",
    keywords: [...kw.ai, "data mining", "knowledge discovery", "algorithms", "bioinformatics"],
    summary: "Studies data mining, algorithms, knowledge discovery and bioinformatics applications.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.hokkaidoIst
  }),
  hokkaido({
    school: "Graduate School of Information Science and Technology",
    department: "Systems Science and Informatics",
    professorName: "Masaharu Munetomo",
    labName: "Intelligent Information Systems Laboratory",
    keywords: [...kw.ai, "evolutionary computation", "optimization", "complex systems"],
    summary: "Works on intelligent information systems, evolutionary computation and optimization.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.hokkaidoIst
  }),
  hokkaido({
    school: "Graduate School of Information Science and Technology",
    department: "Media and Network Technologies",
    professorName: "Ichiro Takumi",
    labName: "Media Processing Laboratory",
    keywords: [...kw.vision, "signal processing", "media information processing", "image analysis"],
    summary: "Studies signal processing, image analysis and media information systems.",
    fieldCategory: "信息/多媒体",
    sourceUrl: sources.hokkaidoIst
  }),
  hokkaido({
    school: "Graduate School of Engineering",
    department: "Mechanical and Space Engineering",
    professorName: "Tsuyoshi Totani",
    labName: "Space Systems Laboratory",
    keywords: [...kw.aerospace, "space systems", "satellite", "propulsion", "thermal design"],
    summary: "Researches space systems engineering, satellite development and propulsion-related topics.",
    fieldCategory: "航空航天",
    sourceUrl: sources.hokkaidoEngineering
  }),
  hokkaido({
    school: "Graduate School of Engineering",
    department: "Field Engineering for the Environment",
    professorName: "Osamu Kiyohara",
    labName: "Disaster Prevention and Field Engineering Laboratory",
    keywords: [...kw.civil, ...kw.seismic, "geotechnical engineering", "field engineering", "disaster prevention"],
    summary: "Covers geotechnical engineering, field engineering and disaster prevention for cold regions.",
    fieldCategory: "工学/建筑土木",
    sourceUrl: sources.hokkaidoEngineering
  }),
  hokkaido({
    school: "Graduate School of Engineering",
    department: "Architectural and Structural Design",
    professorName: "Toshiro Suzuki",
    labName: "Structural and Urban Safety Design Laboratory",
    keywords: [...kw.civil, ...kw.seismic, "structural design", "urban safety", "building engineering"],
    summary: "Focuses on structural design, urban safety and building engineering.",
    fieldCategory: "工学/建筑土木",
    sourceUrl: sources.hokkaidoEngineering
  }),
  hokkaido({
    school: "Graduate School of Engineering",
    department: "Materials Science and Engineering",
    professorName: "Yoshio Waseda",
    labName: "Materials Structure and Design Laboratory",
    keywords: [...kw.materials, "materials structure", "metallurgy", "materials design"],
    summary: "Covers materials structure, metallurgy and materials design themes.",
    fieldCategory: "材料/化学",
    sourceUrl: sources.hokkaidoEngineering
  }),
  hokkaido({
    school: "Graduate School of Engineering",
    department: "Energy and Environmental Systems",
    professorName: "Tadahiko Mizuno",
    labName: "Energy and Environmental Materials Laboratory",
    keywords: [...kw.energy, ...kw.materials, "energy materials", "nuclear materials", "environmental materials"],
    summary: "Connects energy systems, environmental materials and nuclear/environmental engineering.",
    fieldCategory: "能源环境",
    sourceUrl: sources.hokkaidoEngineering
  }),
  hokkaido({
    school: "Graduate School of Environmental Science",
    department: "Environmental Materials Science",
    professorName: "Akira Suzuki",
    labName: "Catalysis and Organic Synthesis Research",
    keywords: [...kw.chemistry, ...kw.energy, "catalysis", "organic synthesis", "cross-coupling"],
    summary: "Represents strong catalysis and organic synthesis research traditions connected with Hokkaido University.",
    fieldCategory: "材料/化学",
    sourceUrl: "https://www.global.hokudai.ac.jp/research-education/environmental-earth-science/"
  })
];

const scienceTokyoProfiles = [
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Sun Heming",
    labName: "Sun Laboratory",
    keywords: [...kw.ai, ...kw.hardware, "video compression", "generative AI", "algorithm-architecture co-optimization"],
    summary: "Researches video compression, generative AI models and hardware acceleration.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Nakata Yuuya",
    labName: "Nakata Group",
    keywords: ["quantum information", "quantum algorithms", "quantum error correction", "quantum physics"],
    summary: "Works on foundations and applications of quantum information science.",
    fieldCategory: "信息/计算机系统",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Yanagisawa Kazuhiro",
    labName: "Yanagisawa Laboratory",
    keywords: [...kw.biomedical, ...kw.ai, "computer-aided drug discovery", "quantum annealing", "structural bioinformatics"],
    summary: "Develops computational methods for drug discovery using simulation, algorithms and advanced computing.",
    fieldCategory: "生物医工",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Kurihara Jun",
    labName: "Kurihara Laboratory",
    keywords: [...kw.network, "security by design", "privacy by design", "network architecture"],
    summary: "Studies security and privacy techniques for future networks from theory to practice.",
    fieldCategory: "信息/安全",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Itoh Yuta",
    labName: "Itoh Laboratory",
    keywords: [...kw.vision, "augmented reality", "virtual reality", "human augmentation", "displays"],
    summary: "Researches AR, VR, displays and human augmentation for human-computer interaction.",
    fieldCategory: "信息/HCI",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Tei Kenji",
    labName: "Tei Laboratory",
    keywords: [...kw.software, "self-adaptive systems", "software architecture", "requirements engineering"],
    summary: "Works on resilient software, self-adaptive systems and model-driven engineering.",
    fieldCategory: "信息/软件",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Cao Yang",
    labName: "Cao Lab",
    keywords: [...kw.ai, ...kw.network, "trustworthy AI", "federated learning", "data privacy"],
    summary: "Develops theories, algorithms and systems for trustworthy data science and AI.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Arase Yuki",
    labName: "Arase Laboratory",
    keywords: [...kw.nlp, ...kw.ai, "computational linguistics", "semantics", "representation learning"],
    summary: "Studies natural language understanding, paraphrasing, semantics and representation learning.",
    fieldCategory: "信息/NLP",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Yoshino Koichiro",
    labName: "Yoshino Laboratory",
    keywords: [...kw.nlp, ...kw.robotics, "spoken language processing", "multimodal information processing"],
    summary: "Researches dialogue, robotics, spoken language and multimodal information processing.",
    fieldCategory: "信息/NLP",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Shinoda Koichi",
    labName: "Shinoda Koichi Laboratory",
    keywords: [...kw.vision, "speech recognition", "video information retrieval", "pattern recognition"],
    summary: "Focuses on pattern recognition and multimedia applications such as audio and video understanding.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Sakuma Jun",
    labName: "Sakuma Laboratory",
    keywords: [...kw.ai, ...kw.network, "responsible AI", "security", "statistics"],
    summary: "Studies machine learning, statistics, security and responsible AI.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Ichise Ryutaro",
    labName: "Ichise Ryutaro Laboratory",
    keywords: [...kw.ai, "data mining", "semantic web", "intelligent machines"],
    summary: "Researches artificial intelligence, machine learning, data mining and semantic web.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Saito Suguru",
    labName: "Saito Suguru Laboratory",
    keywords: [...kw.vision, "computer graphics", "human vision", "color science"],
    summary: "Studies computer graphics, image processing, human vision and color science.",
    fieldCategory: "信息/视觉图形",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Ohue Masahito",
    labName: "Ohue Masahito Laboratory",
    keywords: [...kw.biomedical, ...kw.ai, "bioinformatics", "drug discovery", "high performance computing"],
    summary: "Applies AI, machine learning and high-performance computing to bioinformatics and drug discovery.",
    fieldCategory: "生物医工",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Sato Laboratory",
    labName: "Sato Laboratory",
    keywords: [...kw.vision, ...kw.ai, "autonomous driving", "multimedia signal processing"],
    summary: "Develops machine-learning based visual recognition algorithms, including autonomous driving applications.",
    fieldCategory: "信息/视觉图形",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Kanezaki Asako",
    labName: "Kanezaki Asako Laboratory",
    keywords: [...kw.vision, ...kw.robotics, ...kw.ai, "3D data recognition"],
    summary: "Develops robot systems that recognize the real world and learn intelligent behavior.",
    fieldCategory: "机器人/控制",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Ono Shunsuke",
    labName: "Ono Shunsuke Laboratory",
    keywords: [...kw.vision, ...kw.ai, "signal processing", "mathematical optimization", "sensing data processing"],
    summary: "Uses mathematical optimization for image, signal and sensing data processing.",
    fieldCategory: "信息/视觉图形",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Hayashi Shinpei",
    labName: "Hayashi Shinpei Laboratory",
    keywords: [...kw.software, "software evolution", "software maintenance", "mining software repositories"],
    summary: "Researches software evolution, maintenance and development environments.",
    fieldCategory: "信息/软件",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Okazaki Naoaki",
    labName: "Okazaki Naoaki Laboratory",
    keywords: [...kw.nlp, ...kw.ai, "web", "machine learning"],
    summary: "Studies natural language processing, AI and machine learning for computers that handle human language.",
    fieldCategory: "信息/NLP",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Murata Tsuyoshi",
    labName: "Murata Tsuyoshi Laboratory",
    keywords: [...kw.ai, ...kw.network, "web mining", "social network analysis"],
    summary: "Discovers knowledge from network structures using AI and web mining.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Nishizaki Shin-ya",
    labName: "Nishizaki Shin-ya Laboratory",
    keywords: [...kw.software, "programming language theory", "software verification"],
    summary: "Applies programming language theory and mathematical logic to practical software verification problems.",
    fieldCategory: "信息/软件",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Miyazaki Jun",
    labName: "Miyazaki Jun Laboratory",
    keywords: [...kw.ai, "information retrieval", "recommendation systems", "large-scale high performance computing"],
    summary: "Studies information retrieval, recommendation systems and high-performance computing models.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Kise Kenji",
    labName: "Kise Kenji Laboratory",
    keywords: [...kw.hardware, "parallel processing", "FPGA", "many-core processors"],
    summary: "Explores high-performance computer architectures including many-core processors and hardware accelerators.",
    fieldCategory: "信息/计算机系统",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Defago Xavier",
    labName: "Defago Xavier Laboratory",
    keywords: [...kw.network, ...kw.robotics, "dependable computing", "distributed algorithms", "middleware"],
    summary: "Combines theory and practice for dependable distributed systems, IoT and cooperative robotics.",
    fieldCategory: "信息/网络系统",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Computing",
    department: "Department of Computer Science",
    professorName: "Koike Hideki",
    labName: "Koike Hideki Laboratory",
    keywords: [...kw.vision, "human-computer interaction", "computer graphics", "information security"],
    summary: "Designs next-generation HCI using computer vision, graphics and visualization.",
    fieldCategory: "信息/HCI",
    sourceUrl: sources.scienceTokyoCsLabs
  }),
  scienceTokyo({
    school: "School of Engineering",
    department: "Department of Mechanical Engineering",
    professorName: "Miura Satoshi",
    labName: "Miura Laboratory",
    keywords: [...kw.robotics, "origami engineering", "deployable structures", "mechanical design"],
    summary: "Works on mechanical design, origami-inspired structures and deployable systems.",
    fieldCategory: "机械/机器人",
    sourceUrl: sources.scienceTokyoMechLabs
  }),
  scienceTokyo({
    school: "School of Engineering",
    department: "Department of Mechanical Engineering",
    professorName: "Ishikawa Masato",
    labName: "Fluid Engineering Laboratory",
    keywords: ["fluid engineering", "thermal-fluid dynamics", "energy systems", ...kw.energy],
    summary: "Covers thermal-fluid dynamics, fluid engineering and energy-related mechanical systems.",
    fieldCategory: "机械/能源",
    sourceUrl: sources.scienceTokyoMechLabs
  }),
  scienceTokyo({
    school: "School of Engineering",
    department: "Department of Mechanical Engineering",
    professorName: "Suzuki Takashi",
    labName: "Robotics and Mechatronics Laboratory",
    keywords: [...kw.robotics, "mechatronics", "control engineering", "assistive systems"],
    summary: "Researches robotics, mechatronics and control technologies for intelligent mechanical systems.",
    fieldCategory: "机器人/控制",
    sourceUrl: sources.scienceTokyoEngineering
  })
];

const newProfiles = [...kyushuProfiles, ...hokkaidoProfiles, ...scienceTokyoProfiles];

const existing = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const newByKey = new Map(
  newProfiles.map((item) => [`${item.university}|${item.sourceAffiliation}|${item.professorName}|${item.labName}`, item])
);

let updatedCount = 0;
const refreshed = existing.map((item) => {
  const key = `${item.university}|${item.sourceAffiliation}|${item.professorName}|${item.labName}`;
  const replacement = newByKey.get(key);
  if (!replacement) return item;
  newByKey.delete(key);
  updatedCount += 1;
  return replacement;
});

const additions = Array.from(newByKey.values());

const merged = [...refreshed, ...additions].sort((a, b) => {
  const university = a.university.localeCompare(b.university);
  if (university !== 0) return university;
  const affiliation = (a.sourceAffiliation || "").localeCompare(b.sourceAffiliation || "");
  if (affiliation !== 0) return affiliation;
  return (a.professorName || "").localeCompare(b.professorName || "");
});

fs.writeFileSync(outputPath, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
console.log(`Added ${additions.length} and refreshed ${updatedCount} curated Kyushu/Hokkaido/Science Tokyo professor/lab profiles. Total: ${merged.length}.`);
