import fs from "node:fs";

const outputPath = "data/facultyProfiles.json";
const lastChecked = "2026-07-11";
const sourceDatabase = "Tohoku University official faculty/laboratory pages";

const sources = {
  engineering: "https://www.eng.tohoku.ac.jp/english/",
  materialsStaff: "https://www.material.tohoku.ac.jp/english/labs/",
  materialsScience: "https://www.material.tohoku.ac.jp/english/labs/mts/",
  materialsProcessing: "https://www.material.tohoku.ac.jp/english/labs/mtp/",
  civilFaculty: "https://www.civil.tohoku.ac.jp/english/faculty/index.html",
  gsisLabs: "https://www.is.tohoku.ac.jp/en/laboratory/list_dept/"
};

const commonKeywords = {
  materials: ["材料", "材料科学", "金属", "金属材料", "合金", "轻合金", "materials science", "metallurgy", "metal", "alloy", "light alloy"],
  corrosion: ["腐蚀", "电化学", "corrosion", "electrochemistry", "stainless steel", "localized corrosion"],
  processing: ["材料加工", "材料成形", "制造", "materials processing", "forming", "joining", "powder processing", "additive manufacturing"],
  ai: ["人工智能", "机器学习", "深度学习", "数据科学", "AI", "machine learning", "deep learning", "data science", "artificial intelligence"],
  vision: ["计算机视觉", "图像处理", "图像识别", "三维重建", "computer vision", "image processing", "visual recognition", "3D data processing"],
  robotics: ["机器人", "控制", "自动化", "robotics", "robot", "control", "visual servo", "haptics"],
  civil: ["土木", "结构", "基础设施", "交通", "城市", "防灾", "civil engineering", "infrastructure", "transportation", "urban planning", "disaster"],
  environment: ["环境", "水环境", "生态", "可持续", "environment", "water quality", "ecological engineering", "sustainability"],
  biomedical: ["生物医学", "医工", "生命科学", "biomedical", "bioinformatics", "medical", "health informatics"]
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
    university: "Tohoku University",
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

function engineeringMaterials({ professorName, labName, keywords, summary, sourceUrl = sources.materialsStaff, fieldCategory = "材料/化学" }) {
  return profile({
    sourceAffiliation: "Graduate School of Engineering",
    graduateSchoolHints: ["Graduate School of Engineering"],
    department: "Graduate School of Engineering, Department of Materials Science and Engineering",
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl
  });
}

function civil({ sourceAffiliation = "Graduate School of Engineering", graduateSchoolHints = ["Graduate School of Engineering"], department, professorName, labName, keywords, summary, fieldCategory = "防灾" }) {
  return profile({
    sourceAffiliation,
    graduateSchoolHints,
    department,
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl: sources.civilFaculty
  });
}

function gsis({ department, professorName, labName, keywords, summary, fieldCategory = "信息/AI" }) {
  return profile({
    sourceAffiliation: "Graduate School of Information Sciences",
    graduateSchoolHints: ["Graduate School of Information Sciences"],
    department: `Graduate School of Information Sciences, ${department}`,
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl: sources.gsisLabs
  });
}

const tohokuProfiles = [
  engineeringMaterials({
    professorName: "Makoto Kohda",
    labName: "Opto-electronic Materials",
    keywords: [...commonKeywords.materials, "opto-electronic materials", "spintronics", "semiconductor", "quantum materials"],
    summary: "Researches opto-electronic materials, semiconductor-related materials and spintronic/quantum material systems."
  }),
  engineeringMaterials({
    professorName: "Takahiro Miki",
    labName: "Metallurgical Process Engineering",
    keywords: [...commonKeywords.materials, ...commonKeywords.processing, "metallurgical process", "steelmaking", "thermodynamics"],
    summary: "Works on metallurgical process engineering, steelmaking processes, materials thermodynamics and resource utilization."
  }),
  engineeringMaterials({
    professorName: "Taichi Murakami",
    labName: "Process Engineering for Resources Utilization",
    keywords: [...commonKeywords.materials, ...commonKeywords.processing, "resource utilization", "metallurgical process", "high temperature process"],
    summary: "Studies process engineering for resource utilization, high-temperature processes and metallurgical materials production."
  }),
  engineeringMaterials({
    professorName: "Izumi Muto",
    labName: "Materials Electrochemistry",
    keywords: [...commonKeywords.materials, ...commonKeywords.corrosion, "surface analysis", "metal corrosion"],
    summary: "Researches materials electrochemistry, corrosion of metallic materials and surface/interface reactions in steels and alloys.",
    sourceUrl: sources.materialsScience
  }),
  engineeringMaterials({
    professorName: "Fumio Narita",
    labName: "Mechanics and Design of Composite Materials",
    keywords: [...commonKeywords.materials, "composite materials", "materials mechanics", "smart materials", "piezoelectric materials", "mechanical design"],
    summary: "Studies mechanics and design of composite, smart and functional materials, including mechanical reliability and material performance."
  }),
  engineeringMaterials({
    professorName: "Takayuki Narushima",
    labName: "Biomedical Materials",
    keywords: [...commonKeywords.materials, ...commonKeywords.biomedical, "biomaterials", "titanium alloy", "surface modification", "implant materials"],
    summary: "Researches biomedical materials, titanium alloys, surface modification and implant-related material design.",
    sourceUrl: sources.materialsProcessing,
    fieldCategory: "生命/医工"
  }),
  engineeringMaterials({
    professorName: "Naoyuki Nomura",
    labName: "Micro-powder Processing and Systems",
    keywords: [...commonKeywords.materials, ...commonKeywords.processing, "powder metallurgy", "micro-powder", "additive manufacturing", "biomaterials"],
    summary: "Works on micro-powder processing, powder metallurgy, additive manufacturing and materials systems.",
    sourceUrl: sources.materialsProcessing
  }),
  engineeringMaterials({
    professorName: "Yoshikazu Ohara",
    labName: "Materials Evaluation and Sensing",
    keywords: [...commonKeywords.materials, "nondestructive evaluation", "ultrasonic testing", "sensing", "defect detection", "structural health monitoring"],
    summary: "Studies materials evaluation, sensing, nondestructive testing and defect detection for reliable materials and structures.",
    sourceUrl: sources.materialsProcessing
  }),
  engineeringMaterials({
    professorName: "Katsunari Oikawa",
    labName: "Forming Process Technology",
    keywords: [...commonKeywords.materials, ...commonKeywords.processing, "forming process", "phase transformation", "alloy design", "metal forming"],
    summary: "Researches forming process technology, alloy design, phase transformations and metal forming processes."
  }),
  engineeringMaterials({
    professorName: "Toshihiro Omori",
    labName: "Computational Materials Design",
    keywords: [...commonKeywords.materials, ...commonKeywords.ai, "computational materials design", "shape memory alloys", "alloy design", "materials informatics"],
    summary: "Researches computational materials design, alloy design, shape memory alloys and data-informed materials development."
  }),
  engineeringMaterials({
    professorName: "Yuta Saito",
    labName: "Functional Electronic Materials",
    keywords: [...commonKeywords.materials, "functional electronic materials", "electronic devices", "thin films", "semiconductors"],
    summary: "Studies functional electronic materials, electronic devices, thin films and semiconductor-related materials."
  }),
  engineeringMaterials({
    professorName: "Yutaka Sato",
    labName: "Interface Science and Engineering of Joining",
    keywords: [...commonKeywords.materials, ...commonKeywords.processing, "joining", "welding", "friction stir welding", "interface science"],
    summary: "Works on interface science and joining engineering, including welding, friction stir welding and materials joining.",
    sourceUrl: sources.materialsProcessing
  }),
  engineeringMaterials({
    professorName: "Yuji Suto",
    labName: "Device Reliability Science and Engineering",
    keywords: [...commonKeywords.materials, "device reliability", "materials reliability", "mechanical properties", "functional materials"],
    summary: "Researches device reliability science, mechanical reliability and performance of functional materials.",
    sourceUrl: sources.materialsScience
  }),
  engineeringMaterials({
    professorName: "Hitoshi Takamura",
    labName: "Energy Materials",
    keywords: [...commonKeywords.materials, "energy materials", "solid oxide fuel cells", "ionic conductor", "ceramics", "battery materials"],
    summary: "Studies energy materials, ionic conductors, ceramics, fuel cells and battery-related materials.",
    sourceUrl: sources.materialsScience,
    fieldCategory: "能源环境"
  }),
  engineeringMaterials({
    professorName: "Osamu Takeda",
    labName: "Materials Physical Chemistry",
    keywords: [...commonKeywords.materials, "physical chemistry", "recycling", "metallurgy", "resource circulation", "rare metals"],
    summary: "Researches materials physical chemistry, metal refining/recycling and resource circulation."
  }),
  engineeringMaterials({
    professorName: "Nobuki Tezuka",
    labName: "Advanced Magneto-Materials",
    keywords: [...commonKeywords.materials, "magnetic materials", "spintronics", "magneto-materials", "thin films"],
    summary: "Studies advanced magnetic materials, spintronic materials and thin-film magneto-materials.",
    sourceUrl: sources.materialsScience
  }),
  engineeringMaterials({
    professorName: "Naoto Todoroki",
    labName: "Solid Surface Science",
    keywords: [...commonKeywords.materials, "surface science", "electrocatalysis", "solid surface", "interface chemistry"],
    summary: "Researches solid surface science, electrocatalysis and interface chemistry of functional materials."
  }),
  engineeringMaterials({
    professorName: "Chao-Nan Xu",
    labName: "Multi Conversion System Field",
    keywords: [...commonKeywords.materials, "mechanoluminescence", "smart materials", "stress sensing", "multi conversion system"],
    summary: "Works on multi-conversion materials, mechanoluminescent smart materials and stress/strain sensing.",
    sourceUrl: sources.materialsProcessing
  }),
  engineeringMaterials({
    professorName: "Masaya Yamamoto",
    labName: "Biofunctional Materials",
    keywords: [...commonKeywords.materials, ...commonKeywords.biomedical, "biofunctional materials", "biomaterials", "tissue engineering", "regenerative medicine"],
    summary: "Researches biofunctional materials, biomaterials, tissue engineering and regenerative medicine-related materials.",
    sourceUrl: sources.materialsProcessing,
    fieldCategory: "生命/医工"
  }),
  engineeringMaterials({
    professorName: "Kyosuke Yoshimi",
    labName: "High Temperature Materials",
    keywords: [...commonKeywords.materials, "high temperature materials", "intermetallics", "heat resistant alloys", "mechanical properties"],
    summary: "Studies high-temperature materials, heat-resistant alloys, intermetallic compounds and mechanical properties.",
    sourceUrl: sources.materialsScience
  }),
  engineeringMaterials({
    professorName: "Hongmin Zhu",
    labName: "Materials Process Design",
    keywords: [...commonKeywords.materials, ...commonKeywords.processing, "materials process design", "metallurgical thermodynamics", "resource processing"],
    summary: "Researches materials process design, metallurgical thermodynamics and resource/materials processing."
  }),

  civil({
    department: "Graduate School of Engineering, Department of Civil and Environmental Engineering",
    professorName: "Makoto Hisada",
    labName: "Sustainable Infrastructure Materials Engineering",
    keywords: [...commonKeywords.civil, ...commonKeywords.materials, "concrete", "infrastructure materials", "durability", "maintenance"],
    summary: "Researches sustainable infrastructure materials, concrete durability, maintenance and long-life civil infrastructure."
  }),
  civil({
    sourceAffiliation: "International Research Institute of Disaster Science",
    graduateSchoolHints: ["International Research Institute of Disaster Science"],
    department: "International Research Institute of Disaster Science",
    professorName: "Fumihiko Imamura",
    labName: "Tsunami Engineering",
    keywords: [...commonKeywords.civil, "tsunami", "disaster science", "risk assessment", "coastal disaster"],
    summary: "Researches tsunami engineering, disaster science, coastal disaster risk and disaster mitigation.",
    fieldCategory: "防灾"
  }),
  civil({
    department: "Graduate School of Engineering, Department of Civil and Environmental Engineering",
    professorName: "So Kazama",
    labName: "Hydro-Environment System",
    keywords: [...commonKeywords.environment, ...commonKeywords.civil, "hydrology", "water resources", "climate change", "flood risk"],
    summary: "Studies hydro-environmental systems, hydrology, water resources, flood risk and climate impacts.",
    fieldCategory: "能源环境"
  }),
  civil({
    sourceAffiliation: "Graduate School of Information Sciences",
    graduateSchoolHints: ["Graduate School of Information Sciences"],
    department: "Graduate School of Information Sciences, Department of Human-Social Information Sciences",
    professorName: "Tatsuhito Kono",
    labName: "Regional and Urban Planning",
    keywords: [...commonKeywords.civil, "urban planning", "regional planning", "transport planning", "project evaluation"],
    summary: "Researches regional and urban planning, project evaluation and transport/urban policy.",
    fieldCategory: "商科社科"
  }),
  civil({
    sourceAffiliation: "International Research Institute of Disaster Science",
    graduateSchoolHints: ["International Research Institute of Disaster Science"],
    department: "International Research Institute of Disaster Science",
    professorName: "Shunichi Koshimura",
    labName: "Disaster Geo-informatics",
    keywords: [...commonKeywords.civil, ...commonKeywords.ai, "disaster geoinformatics", "remote sensing", "tsunami damage", "GIS"],
    summary: "Researches disaster geoinformatics, remote sensing, tsunami damage assessment and GIS-based disaster analysis.",
    fieldCategory: "防灾"
  }),
  civil({
    department: "Graduate School of Engineering, Department of Civil and Environmental Engineering",
    professorName: "Yu-You Li",
    labName: "Environmental Protection Engineering",
    keywords: [...commonKeywords.environment, "wastewater treatment", "water quality", "environmental biotechnology", "resource recovery"],
    summary: "Studies environmental protection engineering, wastewater treatment, water quality and resource recovery.",
    fieldCategory: "能源环境"
  }),
  civil({
    sourceAffiliation: "International Research Institute of Disaster Science",
    graduateSchoolHints: ["International Research Institute of Disaster Science"],
    department: "International Research Institute of Disaster Science",
    professorName: "Shuji Moriguchi",
    labName: "Computational Safety Engineering",
    keywords: [...commonKeywords.civil, ...commonKeywords.ai, "computational safety", "geotechnical engineering", "disaster simulation", "numerical analysis"],
    summary: "Researches computational safety engineering, geotechnical disaster simulation and numerical analysis for disaster mitigation.",
    fieldCategory: "防灾"
  }),
  civil({
    sourceAffiliation: "International Research Institute of Disaster Science",
    graduateSchoolHints: ["International Research Institute of Disaster Science"],
    department: "International Research Institute of Disaster Science",
    professorName: "Makoto Okumura",
    labName: "Disaster Area Support",
    keywords: [...commonKeywords.civil, "disaster area support", "infrastructure recovery", "transportation", "regional resilience"],
    summary: "Works on disaster area support, regional recovery, transportation and infrastructure resilience.",
    fieldCategory: "防灾"
  }),
  civil({
    department: "Graduate School of Engineering, Department of Civil and Environmental Engineering",
    professorName: "Yu Otake",
    labName: "Advanced Infrastructure Systems",
    keywords: [...commonKeywords.civil, ...commonKeywords.ai, "infrastructure systems", "geotechnical engineering", "data-driven geotechnics", "reliability"],
    summary: "Researches advanced infrastructure systems, geotechnical engineering, reliability and data-driven infrastructure analysis."
  }),
  civil({
    department: "Graduate School of Engineering, Department of Civil and Environmental Engineering",
    professorName: "Takashi Sakamaki",
    labName: "Ecological Engineering",
    keywords: [...commonKeywords.environment, "ecological engineering", "river environment", "ecosystem", "environmental restoration"],
    summary: "Studies ecological engineering, river/coastal environments, ecosystem functions and environmental restoration.",
    fieldCategory: "能源环境"
  }),
  civil({
    department: "Graduate School of Engineering, Department of Civil and Environmental Engineering",
    professorName: "Daisuke Sano",
    labName: "Environmental Water Quality Engineering",
    keywords: [...commonKeywords.environment, ...commonKeywords.biomedical, "water quality", "environmental microbiology", "waterborne virus", "public health"],
    summary: "Researches environmental water quality engineering, environmental microbiology and waterborne public health risks.",
    fieldCategory: "能源环境"
  }),
  civil({
    department: "Graduate School of Engineering, Department of Civil and Environmental Engineering",
    professorName: "Kenjiro Terada",
    labName: "Advanced Computational Mechanics",
    keywords: [...commonKeywords.civil, "computational mechanics", "finite element method", "structural analysis", "multiscale modeling"],
    summary: "Researches advanced computational mechanics, finite element analysis, structural systems and multiscale modeling."
  }),
  civil({
    department: "Graduate School of Engineering, Department of Civil and Environmental Engineering",
    professorName: "Keiko Udo",
    labName: "Hydro-Environmental Informatics",
    keywords: [...commonKeywords.environment, ...commonKeywords.civil, "coastal engineering", "climate change", "flood risk", "hydro-environmental informatics"],
    summary: "Studies hydro-environmental informatics, coastal engineering, climate change impacts and flood/coastal risk.",
    fieldCategory: "能源环境"
  }),
  civil({
    department: "Graduate School of Engineering, Department of Civil and Environmental Engineering",
    professorName: "Shotaro Yamada",
    labName: "Geosphere and Geotechnical Engineering",
    keywords: [...commonKeywords.civil, "geotechnical engineering", "geosphere", "soil mechanics", "ground engineering"],
    summary: "Researches geosphere and geotechnical engineering, soil mechanics and ground/infrastructure safety."
  }),
  civil({
    department: "Graduate School of Engineering, Department of Civil and Environmental Engineering",
    professorName: "Yuki Yamakawa",
    labName: "Mathematical System Design",
    keywords: [...commonKeywords.civil, "mathematical system design", "optimization", "systems engineering", "infrastructure planning"],
    summary: "Works on mathematical system design, optimization and systems approaches to civil infrastructure and planning.",
    fieldCategory: "商科社科"
  }),

  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Gen Kimura",
    labName: "Mathematical Structures I",
    keywords: ["quantum mechanics", "quantum information science", "general probabilistic theories", "knot theory", "low-dimensional topology"],
    summary: "Studies foundations of quantum mechanics, quantum information science and mathematical structures.",
    fieldCategory: "信息/AI"
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Toshiyuki Sugawa",
    labName: "Mathematical Structures II",
    keywords: ["complex analysis", "geometric function theory", "quasiconformal mappings", "special functions", "algebraic analysis"],
    summary: "Researches complex analysis, geometric function theory, quasiconformal mappings and algebraic analysis.",
    fieldCategory: "其他"
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Hajime Tanaka",
    labName: "Mathematical Structures III",
    keywords: ["algebraic graph theory", "algebraic combinatorics", "discrete mathematics", "graph theory"],
    summary: "Researches algebraic graph theory, algebraic combinatorics and discrete mathematics.",
    fieldCategory: "信息/AI"
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Shinya Miyajima",
    labName: "Mathematical Structures IV",
    keywords: ["numerical analysis", "matrix analysis", "scientific computing"],
    summary: "Studies numerical analysis, matrix analysis and scientific computing.",
    fieldCategory: "信息/AI"
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Masayuki Ohzeki",
    labName: "Mathematical Informatics",
    keywords: [...commonKeywords.ai, "quantum computing", "quantum annealing", "sparse modeling", "quantum machine learning"],
    summary: "Researches mathematical informatics, quantum computing, quantum annealing, sparse modeling and machine learning."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Chia-Ho Ou",
    labName: "Mathematical Informatics",
    keywords: [...commonKeywords.ai, "mathematical informatics", "optimization", "applied mathematics"],
    summary: "Works in mathematical informatics, optimization and applied mathematics."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Takafumi Aoki",
    labName: "Computer Structures",
    keywords: [...commonKeywords.vision, ...commonKeywords.ai, "biometrics", "medical image processing", "signal processing"],
    summary: "Studies image/signal processing, data science, deep learning, computer vision, biometrics and medical image processing."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Masanori Hariyama",
    labName: "Intelligent Integrated Systems",
    keywords: [...commonKeywords.ai, "intelligent systems", "big data", "high-performance computing", "reconfigurable VLSI", "FPGA"],
    summary: "Researches intelligent integrated systems, big-data applications, high-performance computing, FPGA and VLSI computing."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Yuichi Kawamoto",
    labName: "Firmware Science",
    keywords: [...commonKeywords.ai, "wireless communication", "satellite", "HAPS", "WLAN", "protocol"],
    summary: "Researches firmware science, wireless communication, satellite/HAPS networks, WLAN and AI-assisted protocols."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Eijiro Sumii",
    labName: "Foundations of Software Science",
    keywords: ["programming language theory", "computation models", "information security", "software science", "formal methods"],
    summary: "Works on programming language theory, computation models, formal methods and software science."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Kaoru Ota",
    labName: "Wireless Network Engineering",
    keywords: [...commonKeywords.ai, "next-gen networks", "wireless communications", "edge computing", "cyber-physical systems"],
    summary: "Researches next-generation networks, wireless communications, edge computing, AI and cyber-physical systems."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Keisuke Nakano",
    labName: "Logic for Information Science",
    keywords: ["programming language theory", "formal language theory", "theorem proving", "logic", "formal methods"],
    summary: "Researches logic for information science, programming languages, formal languages and theorem proving."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Go Hasegawa",
    labName: "Communication Theory",
    keywords: ["information network architecture", "IoT", "mobile network", "network system optimization", "communication theory"],
    summary: "Studies communication theory, network architecture, IoT, mobile networks and network optimization."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Hiroyuki Takizawa",
    labName: "High Performance Computing",
    keywords: [...commonKeywords.ai, "high performance computing", "system software", "performance-aware programming", "HPC"],
    summary: "Works on high-performance computing, system software, performance-aware programming and machine learning."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Minoru Kuribayashi",
    labName: "Information Security",
    keywords: [...commonKeywords.ai, "information security", "forensic technology", "AI security", "blockchain", "public-key cryptosystem"],
    summary: "Researches information security, forensic technology, AI security, blockchain and public-key cryptosystems."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Kentaro Sano",
    labName: "Advanced Computing Systems",
    keywords: [...commonKeywords.ai, "computing systems", "high-performance computing", "AI for science", "quantum computer", "system software"],
    summary: "Studies advanced computing systems, HPC, AI for science, quantum computing and system software."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Kento Sato",
    labName: "Advanced Computing Systems",
    keywords: [...commonKeywords.ai, "computing systems", "high-performance computing", "AI for science", "computer architecture"],
    summary: "Researches advanced computing systems, high-performance computing, computer architectures and AI for science."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Hiroki Nakahara",
    labName: "Reconfigurable System",
    keywords: [...commonKeywords.ai, "reconfigurable system", "FPGA", "VLSI", "computer architecture", "machine learning"],
    summary: "Studies reconfigurable systems, FPGA, VLSI computing, computer architecture and machine learning."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Akira Suzuki",
    labName: "Mathematical Optimization for Large-Scale Data",
    keywords: ["graph algorithms", "computational complexity", "combinatorial reconfiguration", "optimization", "large-scale data"],
    summary: "Researches graph algorithms, computational complexity, combinatorial reconfiguration and large-scale data optimization."
  }),
  gsis({
    department: "Department of Computer and Mathematical Sciences",
    professorName: "Hiroaki Kobayashi",
    labName: "Joint Research Laboratory for High-Performance",
    keywords: ["photonic quantum computing", "coherent Ising machine", "combinatorial optimization", "hybrid quantum-classical computing", "disaster informatics"],
    summary: "Researches photonic quantum computing, coherent Ising machines, combinatorial optimization and disaster informatics."
  }),

  gsis({
    department: "Department of System Information Sciences",
    professorName: "Masaaki Harada",
    labName: "Mathematical System Analysis I",
    keywords: ["coding theory", "combinatorial design theory", "global analysis", "homogenization theory"],
    summary: "Studies mathematical system analysis, coding theory, combinatorial design theory and global analysis."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Kanta Naito",
    labName: "Mathematical System Analysis II",
    keywords: [...commonKeywords.ai, "function estimation", "multivariate analysis", "mathematical logic", "constructive mathematics"],
    summary: "Researches function estimation, multivariate analysis, machine learning and mathematical logic."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Yuko Araki",
    labName: "Statistical Mathematics",
    keywords: [...commonKeywords.ai, ...commonKeywords.vision, "statistical science", "functional data analysis", "biostatistics", "optimization"],
    summary: "Works on statistical mathematics, functional data analysis, high-dimensional data, machine learning and image reconstruction."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Xiao Zhou",
    labName: "Algorithm Theory",
    keywords: ["algorithm", "graph theory", "combinatorial reconfiguration", "computational complexity"],
    summary: "Researches algorithm theory, graph theory and combinatorial reconfiguration."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Ayumi Shinohara",
    labName: "Intelligent Systems Science",
    keywords: [...commonKeywords.ai, "string processing", "data compression", "machine learning"],
    summary: "Studies intelligent systems science, string processing, machine learning and data compression."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Kentaro Inui",
    labName: "Natural Language Processing",
    keywords: [...commonKeywords.ai, "natural language processing", "communication science", "language AI"],
    summary: "Researches natural language processing, artificial intelligence and communication science."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Keisuke Sakaguchi",
    labName: "Natural Language Processing",
    keywords: [...commonKeywords.ai, "natural language processing", "language AI", "communication science"],
    summary: "Works on natural language processing, language AI and artificial intelligence."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Takeshi Obayashi",
    labName: "Information Biology",
    keywords: [...commonKeywords.biomedical, ...commonKeywords.ai, "bioinformatics", "gene coexpression network", "database development", "metagenomics"],
    summary: "Researches information biology, bioinformatics, gene coexpression networks, database development and genomics.",
    fieldCategory: "生命/医工"
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Takehiro Ito",
    labName: "Design and Analysis of Information Systems",
    keywords: ["algorithm theory", "combinatorial reconfiguration", "computational geometry", "information systems"],
    summary: "Studies design and analysis of information systems, algorithm theory and computational geometry."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Takayuki Okatani",
    labName: "Image Analysis",
    keywords: [...commonKeywords.vision, ...commonKeywords.ai, "multi-view geometry", "deep learning"],
    summary: "Researches image analysis, computer vision, visual recognition, multi-view geometry, deep learning and AI."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Koichi Hashimoto",
    labName: "Intelligent Control Systems",
    keywords: [...commonKeywords.robotics, ...commonKeywords.vision, "visual servo", "high-speed vision", "system biology"],
    summary: "Studies intelligent control systems, visual servoing, high-speed vision, robotics, image processing and 3D data processing.",
    fieldCategory: "机器人/控制"
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Asako Kanezaki",
    labName: "Intelligent Robotics and AI",
    keywords: [...commonKeywords.robotics, ...commonKeywords.vision, ...commonKeywords.ai, "embodied AI", "humanoid robots"],
    summary: "Researches 3D data processing, robotics, machine learning, embodied AI, image processing and humanoid robots.",
    fieldCategory: "机器人/控制"
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Shuichi Sakamoto",
    labName: "Acoustic Information",
    keywords: ["sound localization", "multi-modality", "auditory display", "sound space", "acoustic information"],
    summary: "Researches acoustic information, sound localization, multimodality, auditory displays and sound-space systems."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Kowa Koida",
    labName: "Visual Cognition and Systems",
    keywords: [...commonKeywords.vision, "human vision", "attention", "visual motion", "color", "brain imaging"],
    summary: "Studies human vision, attention, visual motion, color perception and visual cognition systems."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Chia-Huei Tseng",
    labName: "Visual Cognition and Systems",
    keywords: [...commonKeywords.vision, "human vision", "attention", "implicit learning", "visual cognition", "brain imaging"],
    summary: "Researches visual cognition, human vision, attention, implicit learning and brain imaging."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Yoshifumi Kitamura",
    labName: "Interactive Content Design",
    keywords: ["interactive content", "human-content interaction", "human-computer interaction", "VR", "user interface"],
    summary: "Works on interactive content design, human-content interaction and user interface technologies."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Jun Ishimoto",
    labName: "Integrated Fluid Informatics",
    keywords: ["multiphase flow", "hydrogen energy", "atomization", "spray", "fluid informatics"],
    summary: "Researches integrated fluid informatics, multiphase flow, hydrogen energy and atomization/spray systems.",
    fieldCategory: "能源环境"
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Hiroshi Unno",
    labName: "Software Construction",
    keywords: [...commonKeywords.ai, "program verification", "program synthesis", "programming languages", "type systems", "automated theorem proving"],
    summary: "Studies software construction, program verification, program synthesis, type systems and automated theorem proving."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Jun Suzuki",
    labName: "Fundamental Artificial Intelligence",
    keywords: [...commonKeywords.ai, "language AI", "generative AI", "AI foundation models", "learning systems"],
    summary: "Researches fundamental artificial intelligence, language AI, generative AI, foundation models and deep learning."
  }),
  gsis({
    department: "Department of System Information Sciences",
    professorName: "Shingo Kagami",
    labName: "Real-time Computing Systems",
    keywords: [...commonKeywords.robotics, ...commonKeywords.vision, "robot vision", "high-speed camera", "augmented reality", "real-time systems"],
    summary: "Studies real-time computing systems, robot vision, high-speed cameras, low-latency display and augmented reality.",
    fieldCategory: "机器人/控制"
  }),

  gsis({
    department: "Department of Human-Social Information Sciences",
    professorName: "Yoshiki Ogawa",
    labName: "Text Structure and Linguistic Information",
    keywords: ["linguistics", "morphosyntax", "lexical semantics", "psycholinguistics", "corpus-based linguistics"],
    summary: "Researches text structure, linguistic information, morphosyntax, lexical semantics and corpus-based linguistics.",
    fieldCategory: "商科社科"
  }),
  gsis({
    department: "Department of Human-Social Information Sciences",
    professorName: "Hitoshi Omori",
    labName: "Philosophy of Logical Analysis",
    keywords: ["dialetheism", "non-classical logic", "paraconsistent logic", "many-valued logic", "modal logic"],
    summary: "Studies philosophy of logical analysis, non-classical logic, paraconsistent logic and modal logic.",
    fieldCategory: "商科社科"
  }),
  gsis({
    department: "Department of Human-Social Information Sciences",
    professorName: "Naohito Tokugawa",
    labName: "Sociology of Communication",
    keywords: ["communication", "interaction", "civil society", "social theory", "fieldwork"],
    summary: "Researches sociology of communication, social theory, civil society, interaction and fieldwork.",
    fieldCategory: "商科社科"
  }),
  gsis({
    department: "Department of Human-Social Information Sciences",
    professorName: "Aya Okada",
    labName: "Sociology of Communication",
    keywords: ["communication", "interaction", "civil society", "social theory", "fieldwork"],
    summary: "Works on sociology of communication, interaction, civil society, social theory and fieldwork.",
    fieldCategory: "商科社科"
  }),
  gsis({
    department: "Department of Human-Social Information Sciences",
    professorName: "Naoya Fujiwara",
    labName: "Regional Econometric Analysis",
    keywords: [...commonKeywords.ai, "complex networks", "nonlinear science", "spatial information science", "mathematical engineering"],
    summary: "Researches regional econometric analysis, complex networks, nonlinear science and spatial information science.",
    fieldCategory: "商科社科"
  }),
  gsis({
    department: "Department of Human-Social Information Sciences",
    professorName: "Tatsuhito Kono",
    labName: "Regional and Urban Planning",
    keywords: [...commonKeywords.civil, "project evaluation", "urban planning", "regional planning", "transport planning"],
    summary: "Researches project evaluation, urban and regional planning processes and transportation planning.",
    fieldCategory: "商科社科"
  }),
  gsis({
    department: "Department of Human-Social Information Sciences",
    professorName: "Takashi Akamatsu",
    labName: "Road Transportation and Traffic",
    keywords: [...commonKeywords.civil, "transportation planning", "system optimization", "mathematical programming", "dynamic traffic control"],
    summary: "Studies road transportation, traffic systems, transportation planning, system optimization and dynamic traffic control.",
    fieldCategory: "商科社科"
  }),

  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Kazuyuki Tanaka",
    labName: "Physical Fluctuomatics",
    keywords: [...commonKeywords.ai, "sparse modeling", "Bayesian optimization", "quantum annealing", "quantum computation"],
    summary: "Researches sparse modeling, machine learning, Bayesian optimization, quantum annealing and quantum computation."
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Nei Kato",
    labName: "AI-based Communication Technology",
    keywords: [...commonKeywords.ai, "information communication network", "network design", "satellite", "wireless", "cloud computing"],
    summary: "Studies AI-based communication technology, network design, satellite/wireless systems, cloud computing and IoT."
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Masashi Konyo",
    labName: "Embodied Intelligence and Robotics",
    keywords: [...commonKeywords.robotics, "haptics", "tactile sensors", "tele-robotics", "rescue robots", "VR interfaces"],
    summary: "Researches embodied intelligence, haptics, tactile sensing, tele-robotics, rescue robots and VR interfaces.",
    fieldCategory: "机器人/控制"
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Kengo Kinoshita",
    labName: "Systems Bioinformatics",
    keywords: [...commonKeywords.biomedical, ...commonKeywords.ai, "genome", "protein", "brain science", "personalized medicine", "bioinformatics"],
    summary: "Researches systems bioinformatics, genomes, proteins, brain science, personalized medicine and life-science data.",
    fieldCategory: "生命/医工"
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Kazumichi Matsumiya",
    labName: "Cognitive Psychology",
    keywords: ["human behavior", "psychophysics", "embodied cognition", "visual cognition", "cognitive psychology"],
    summary: "Studies cognitive psychology, human behavior, psychophysics and embodied cognition.",
    fieldCategory: "商科社科"
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Takaki Nakamura",
    labName: "Applied Intelligence Software",
    keywords: [...commonKeywords.ai, ...commonKeywords.vision, "data platforms", "storage systems", "cyber-physical system", "intelligent image processing"],
    summary: "Researches applied intelligence software, data platforms, cyber-physical systems and intelligent image processing."
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Takuo Suganuma",
    labName: "Information Network Systems",
    keywords: ["information network systems", "information security", "network management", "distributed systems"],
    summary: "Studies information network systems, information security and distributed network management."
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Yuji Hattori",
    labName: "Flow System Informatics",
    keywords: ["computational fluid dynamics", "turbulence", "vortex dynamics", "hydrodynamic stability", "magnetohydrodynamics"],
    summary: "Researches flow system informatics, computational fluid dynamics, turbulence and hydrodynamic stability.",
    fieldCategory: "能源环境"
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Hideaki Yamamoto",
    labName: "Brain Function Integration",
    keywords: [...commonKeywords.biomedical, ...commonKeywords.ai, "neuroengineering", "neural networks", "neuromorphic computing", "biological AI"],
    summary: "Studies brain function integration, neuroengineering, neural networks, neuromorphic computing and biological AI.",
    fieldCategory: "生命/医工"
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Chihiro Ito",
    labName: "Health Informatics",
    keywords: [...commonKeywords.biomedical, ...commonKeywords.ai, "health informatics", "biomarker", "metabolomic analysis", "epigenetics"],
    summary: "Researches health informatics, biomarkers, metabolomics, epigenetics and medical data analysis.",
    fieldCategory: "生命/医工"
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Takehiro Suzuki",
    labName: "Health Informatics",
    keywords: [...commonKeywords.biomedical, ...commonKeywords.ai, "health informatics", "chronic disease", "medical data", "biomarker"],
    summary: "Works on health informatics, chronic disease data, medical biomarkers and healthcare information analysis.",
    fieldCategory: "生命/医工"
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Atsushi Yoshimoto",
    labName: "Statistical Science of Complex Systems",
    keywords: [...commonKeywords.ai, "spatio-temporal analysis", "time series analysis", "stochastic control", "resource growth analysis"],
    summary: "Researches statistical science for complex systems, spatio-temporal analysis, time series and stochastic control."
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Motoki Shiga",
    labName: "Advanced Applied Data Science",
    keywords: [...commonKeywords.ai, ...commonKeywords.materials, ...commonKeywords.biomedical, "materials informatics", "bioinformatics"],
    summary: "Researches advanced applied data science, machine learning, AI, materials informatics and bioinformatics."
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Kazunori Yamada",
    labName: "Advanced Applied Data Science",
    keywords: [...commonKeywords.ai, "data science", "machine learning", "artificial intelligence", "materials informatics"],
    summary: "Works on advanced applied data science, machine learning, AI and materials informatics."
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Kazunori Ohno",
    labName: "Tough Cyberphysical AI",
    keywords: [...commonKeywords.robotics, ...commonKeywords.ai, "tough robotics", "cyber physical", "tough AI", "disaster robotics"],
    summary: "Researches tough robotics, cyber-physical AI and robust robotics for challenging real-world environments.",
    fieldCategory: "机器人/控制"
  }),
  gsis({
    department: "Department of Applied Information Sciences",
    professorName: "Takaaki Mizuki",
    labName: "Cryptographic Protocols",
    keywords: ["card-based cryptography", "cryptology", "information security", "cryptographic protocols"],
    summary: "Researches cryptographic protocols, card-based cryptography, cryptology and information security."
  })
];

const existingProfiles = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const preservedProfiles = existingProfiles.filter(
  (profile) => !(profile.university === "Tohoku University" && profile.sourceDatabase === sourceDatabase)
);
const nextProfiles = [...preservedProfiles, ...tohokuProfiles].sort((a, b) =>
  `${a.university} ${a.professorName} ${a.labName}`.localeCompare(`${b.university} ${b.professorName} ${b.labName}`)
);

fs.writeFileSync(outputPath, `${JSON.stringify(nextProfiles, null, 2)}\n`, "utf8");
console.log(`Added ${tohokuProfiles.length} curated Tohoku University professor/lab profiles. Total: ${nextProfiles.length}.`);
