import fs from "node:fs";

const outputPath = "data/facultyProfiles.json";
const lastChecked = "2026-07-11";
const sourceDatabase = "The University of Osaka official faculty/laboratory pages";

const sources = {
  engineeringScienceStaff: "https://www.es.osaka-u.ac.jp/en/faculty-research/academic-staff/index.html",
  istComputerScience: "https://www.ist.osaka-u.ac.jp/english/researcher/list.php?id=3",
  istInformationSystems: "https://www.ist.osaka-u.ac.jp/english/researcher/list.php?id=4",
  istMultimedia: "https://www.ist.osaka-u.ac.jp/english/researcher/list.php?id=6",
  ishiguroLab: "https://www.irl.sys.es.osaka-u.ac.jp/",
  ishiguroStaff: "https://www.irl.sys.es.osaka-u.ac.jp/members/staff",
  nanophotonicsResearch: "https://photon-ap.eng.osaka-u.ac.jp/research.html",
  nanophotonicsPeople: "https://photon-ap.eng.osaka-u.ac.jp/people.html"
};

const commonKeywords = {
  materials: ["材料", "材料科学", "材料工程", "金属", "金属材料", "合金", "轻合金", "materials science", "materials engineering", "metal", "metallic materials", "alloy", "light alloy"],
  ai: ["人工智能", "机器学习", "深度学习", "数据科学", "AI", "machine learning", "deep learning", "data science", "artificial intelligence"],
  vision: ["计算机视觉", "图像处理", "图像识别", "三维重建", "computer vision", "image processing", "image recognition", "3d reconstruction"],
  robotics: ["机器人", "控制", "自动化", "智能机器人", "robotics", "robot", "control", "automation", "human-robot interaction"],
  biomedical: ["生物医学", "医工", "医疗", "生命科学", "biomedical", "bioengineering", "medical", "life science"],
  chemistry: ["化学", "催化", "有机合成", "材料化学", "chemistry", "catalysis", "organic synthesis", "chemical engineering"],
  physics: ["物理", "量子", "凝聚态", "光学", "physics", "quantum", "condensed matter", "optics"]
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
    university: "Osaka University",
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

function engineeringScience({ department, professorName, labName, keywords, summary, fieldCategory }) {
  return profile({
    sourceAffiliation: "Graduate School of Engineering Science",
    graduateSchoolHints: ["Graduate School of Engineering Science"],
    department: `Graduate School of Engineering Science, ${department}`,
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl: sources.engineeringScienceStaff
  });
}

function ist({ major, professorName, labName, keywords, summary, fieldCategory, sourceUrl }) {
  return profile({
    sourceAffiliation: "Graduate School of Information Science and Technology",
    graduateSchoolHints: ["Graduate School of Information Science and Technology"],
    department: `Graduate School of Information Science and Technology, ${major}`,
    professorName,
    labName,
    researchKeywords: keywords,
    researchSummary: summary,
    fieldCategory,
    sourceUrl
  });
}

const osakaProfiles = [
  profile({
    sourceAffiliation: "Graduate School of Engineering Science",
    graduateSchoolHints: ["Graduate School of Engineering Science"],
    department: "Graduate School of Engineering Science, Department of Systems Innovation",
    professorName: "Hiroshi Ishiguro",
    labName: "Intelligent Robotics Laboratory / Ishiguro Laboratory",
    researchKeywords: [
      ...commonKeywords.robotics,
      ...commonKeywords.ai,
      "android robotics",
      "humanoid robots",
      "cognitive science",
      "sensor networks",
      "social robotics",
      "Geminoid",
      "ERICA",
      "Telenoid"
    ],
    researchSummary:
      "Intelligent Robotics Laboratory develops intelligent systems for future human society based on sensor engineering, robotics, artificial intelligence and cognitive science. Topics include humanoid robots, androids, human-robot interaction and social experiments.",
    fieldCategory: "机器人/控制",
    sourceUrl: sources.ishiguroLab,
    facultyUrl: sources.ishiguroStaff,
    labUrl: sources.ishiguroLab
  }),
  profile({
    sourceAffiliation: "Graduate School of Engineering",
    graduateSchoolHints: ["Graduate School of Engineering"],
    department: "Department of Applied Physics, Graduate School of Engineering",
    professorName: "Katsumasa Fujita",
    labName: "Nanophotonics Laboratory",
    researchKeywords: [
      ...commonKeywords.physics,
      ...commonKeywords.vision,
      "nanophotonics",
      "optical microscopy",
      "spectroscopic microscopy",
      "super-resolution microscopy",
      "Raman microscopy",
      "Deep-UV microscopy",
      "biomedical imaging",
      "laser microfabrication"
    ],
    researchSummary:
      "Nanophotonics Laboratory develops next-generation optical and spectroscopic microscopy technologies for biological, medical and material science applications, including super-resolution microscopy, Raman microscopy, deep-UV microscopy and laser microfabrication.",
    fieldCategory: "材料/化学",
    sourceUrl: sources.nanophotonicsResearch,
    facultyUrl: sources.nanophotonicsPeople,
    labUrl: sources.nanophotonicsResearch
  }),

  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Satoshi Fujimoto",
    labName: "Theory Group of Strongly Correlated Systems",
    keywords: [...commonKeywords.physics, "topological insulators", "topological superconductors", "strongly correlated electron systems", "condensed matter theory"],
    summary: "Researches theoretical condensed matter physics, including topological insulators, topological superconductors and strongly correlated electron systems.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Akira Sekiyama",
    labName: "Electronic Spectroscopy Group of Correlated Materials",
    keywords: [...commonKeywords.materials, ...commonKeywords.physics, "photoelectron spectroscopy", "x-ray spectroscopy", "hard x-ray photoemission", "correlated materials"],
    summary: "Studies electronic structures of correlated materials through photoelectron spectroscopy and x-ray spectroscopic methods.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Koichi Izawa",
    labName: "Quantum Condensed Phases Group",
    keywords: [...commonKeywords.physics, ...commonKeywords.materials, "superconductors", "thermal conductivity", "low-temperature physics", "quantum materials"],
    summary: "Works on quantum condensed phases and superconducting materials using thermal transport and low-temperature measurement approaches.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Shintaro Ishiwata",
    labName: "Emergent Functional Material Science Group",
    keywords: [...commonKeywords.materials, ...commonKeywords.physics, "topological materials", "high pressure synthesis", "magnetic properties", "dielectric properties", "electronic properties"],
    summary: "Explores emergent functional materials, topological materials and high-pressure synthesis with attention to magnetic, dielectric and electronic properties.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Takashi Yamamoto",
    labName: "Quantum Information and Quantum Optics Group",
    keywords: [...commonKeywords.physics, "quantum information", "quantum optics", "quantum communication", "quantum computer"],
    summary: "Researches quantum information and quantum optics, including quantum communication and quantum computing-related technologies.",
    fieldCategory: "信息/AI"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Masakazu Matsubara",
    labName: "Optical Meta Quantum Materials Group",
    keywords: [...commonKeywords.physics, ...commonKeywords.materials, "opto-spintronics", "metamaterials", "ultrafast optics", "THz spectroscopy"],
    summary: "Studies optical meta quantum materials, opto-spintronics, metamaterials and ultrafast optical spectroscopy.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Daichi Chiba",
    labName: "Interface Quantum Science Group",
    keywords: [...commonKeywords.materials, ...commonKeywords.physics, "spintronics", "magnetic materials", "thin films", "interface engineering", "semiconductor devices"],
    summary: "Researches interface quantum science, spintronics, magnetic materials and thin-film device physics.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Emi Minamitani",
    labName: "Theoretical Nanotechnology Group",
    keywords: [...commonKeywords.materials, ...commonKeywords.ai, "computational materials science", "materials informatics", "surface science", "nanoscale simulation", "machine learning for materials"],
    summary: "Uses theoretical and computational approaches for nanotechnology, surface science and materials informatics, including machine learning for materials.",
    fieldCategory: "材料/化学"
  }),

  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Jun Takaya",
    labName: "Catalyst Design Group",
    keywords: [...commonKeywords.chemistry, "organometallic chemistry", "homogeneous catalysis", "molecular catalyst", "organic synthesis"],
    summary: "Works on catalyst design, organometallic chemistry and molecular catalysis for organic synthesis.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Ryo Shintani",
    labName: "Organic Chemistry Group",
    keywords: [...commonKeywords.chemistry, "organic chemistry", "organic synthesis", "catalytic reaction", "functional molecules"],
    summary: "Studies organic chemistry, catalytic reactions and synthesis of functional molecules.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Ichiro Hisaki",
    labName: "Supra-Functional Molecular Chemistry Group",
    keywords: [...commonKeywords.chemistry, ...commonKeywords.materials, "porous molecular crystals", "supramolecular chemistry", "crystal engineering", "functional materials"],
    summary: "Researches supramolecular chemistry, porous molecular crystals, crystal engineering and supra-functional molecular materials.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Kenichi Fukui",
    labName: "Surface Chemistry Group",
    keywords: [...commonKeywords.chemistry, ...commonKeywords.materials, "surface chemistry", "interface chemistry", "scanning probe microscopy", "reaction dynamics"],
    summary: "Studies surface and interface chemistry using microscopy and spectroscopy for reaction and material analysis.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Yoshiyuki Manabe",
    labName: "Analytical Chemistry Group",
    keywords: [...commonKeywords.chemistry, "analytical chemistry", "bioanalysis", "chemical biology", "molecular recognition"],
    summary: "Works on analytical chemistry, bioanalysis, molecular recognition and chemical biology.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Shuji Nakanishi",
    labName: "Photo-Bioelectrochemistry Group",
    keywords: [...commonKeywords.chemistry, "electrochemistry", "photoelectrochemistry", "bioelectrochemistry", "energy conversion", "artificial photosynthesis"],
    summary: "Researches photo-bioelectrochemistry, electrochemical energy conversion and artificial photosynthesis-related systems.",
    fieldCategory: "能源环境"
  }),

  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Norikazu Nishiyama",
    labName: "Reaction and Separation Engineering Group",
    keywords: [...commonKeywords.chemistry, "chemical engineering", "reaction engineering", "separation engineering", "nanoporous materials", "zeolite"],
    summary: "Studies chemical reaction and separation engineering, including nanoporous materials and zeolite-based processes.",
    fieldCategory: "能源环境"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Yasutaka Kitagawa",
    labName: "Computational Quantum Chemistry Group",
    keywords: [...commonKeywords.chemistry, ...commonKeywords.ai, "computational chemistry", "quantum chemistry", "molecular simulation", "theoretical chemistry"],
    summary: "Uses computational and quantum chemistry to analyze molecules, reactions and materials.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Tomoo Mizugaki",
    labName: "Green Reaction Engineering Group",
    keywords: [...commonKeywords.chemistry, "green chemistry", "catalysis", "reaction engineering", "sustainable chemistry", "biomass conversion"],
    summary: "Researches green reaction engineering, catalysis and sustainable chemical conversion processes.",
    fieldCategory: "能源环境"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Nobuyuki Matsubayashi",
    labName: "Molecular Solution Science Group",
    keywords: [...commonKeywords.chemistry, "molecular simulation", "solution chemistry", "statistical mechanics", "soft matter"],
    summary: "Studies molecular solution science through simulation, statistical mechanics and soft matter approaches.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Hiroshi Umakoshi",
    labName: "Bio-inspired Chemical Engineering Group",
    keywords: [...commonKeywords.chemistry, ...commonKeywords.biomedical, "bio-inspired materials", "membrane engineering", "drug delivery", "biochemical engineering"],
    summary: "Works on bio-inspired chemical engineering, membranes, biochemical systems and drug delivery-related materials.",
    fieldCategory: "生命/医工"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Shinji Sakai",
    labName: "Bioengineering Materials Group",
    keywords: [...commonKeywords.biomedical, ...commonKeywords.materials, "biomaterials", "tissue engineering", "cell engineering", "hydrogel", "regenerative medicine"],
    summary: "Researches biomaterials, tissue engineering, cell engineering and hydrogels for biomedical applications.",
    fieldCategory: "生命/医工"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Takayuki Hirai",
    labName: "Photochemical Process Engineering Group",
    keywords: [...commonKeywords.chemistry, "photochemistry", "photocatalysis", "process engineering", "nanomaterials", "environmental chemistry"],
    summary: "Studies photochemical process engineering, photocatalysis, nanomaterials and environmental chemical processes.",
    fieldCategory: "能源环境"
  }),

  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Hirokazu Tada",
    labName: "Nanochemical Materials Group",
    keywords: [...commonKeywords.materials, ...commonKeywords.chemistry, "nanomaterials", "photocatalysis", "solar energy conversion", "surface chemistry"],
    summary: "Researches nanochemical materials, surface chemistry and photocatalytic solar energy conversion.",
    fieldCategory: "能源环境"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Tetsuro Kusamoto",
    labName: "Functional Molecular Materials Group",
    keywords: [...commonKeywords.materials, ...commonKeywords.chemistry, "functional molecular materials", "luminescent materials", "radicals", "molecular magnetism"],
    summary: "Studies functional molecular materials such as luminescent materials, radicals and molecular magnetic materials.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Masaaki Ashida",
    labName: "Extreme Photonics Group",
    keywords: [...commonKeywords.physics, ...commonKeywords.materials, "photonics", "laser spectroscopy", "ultrafast optics", "nanophotonics"],
    summary: "Works on extreme photonics, laser spectroscopy, ultrafast optics and optical properties of advanced materials.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Hikaru Kuramochi",
    labName: "Ultrafast Spectroscopy Group",
    keywords: [...commonKeywords.physics, ...commonKeywords.chemistry, "ultrafast spectroscopy", "molecular dynamics", "laser spectroscopy", "photochemistry"],
    summary: "Uses ultrafast spectroscopy to study molecular dynamics, photochemistry and light-matter interactions.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Katsuya Shimizu",
    labName: "High Pressure Materials Science Group",
    keywords: [...commonKeywords.materials, ...commonKeywords.physics, "high pressure", "superconductivity", "extreme conditions", "quantum materials"],
    summary: "Studies high-pressure materials science, superconductivity and quantum materials under extreme conditions.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Materials Engineering Science",
    professorName: "Hidekazu Tanaka",
    labName: "Bioorganic and Molecular Materials Group",
    keywords: [...commonKeywords.chemistry, ...commonKeywords.biomedical, "bioorganic chemistry", "molecular materials", "chemical biology", "functional molecules"],
    summary: "Researches bioorganic chemistry, molecular materials, chemical biology and functional molecules.",
    fieldCategory: "生命/医工"
  }),

  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Genta Kawahara",
    labName: "Fluid Dynamics Group",
    keywords: ["流体", "湍流", "流体力学", "fluid dynamics", "turbulence", "computational fluid dynamics", "flow control", "mixing"],
    summary: "Researches fluid dynamics, turbulence, mixing and flow control in mechanical science.",
    fieldCategory: "机器人/控制"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Susumu Goto",
    labName: "Turbulence and Mixing Group",
    keywords: ["流体", "湍流", "混合", "fluid dynamics", "turbulence", "mixing", "vortex", "computational fluid dynamics"],
    summary: "Studies turbulence, vortical structures, mixing and computational fluid dynamics.",
    fieldCategory: "机器人/控制"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Atsutomo Nakamura",
    labName: "Nanomechanics and Solid Mechanics Group",
    keywords: [...commonKeywords.materials, "力学", "固体力学", "断裂", "疲劳", "nanomechanics", "solid mechanics", "fracture", "fatigue", "dislocation"],
    summary: "Researches nanomechanics, solid mechanics, fracture, fatigue and mechanical behavior of materials.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Ryuichi Tarumi",
    labName: "Computational Solid Mechanics Group",
    keywords: [...commonKeywords.materials, "计算力学", "固体力学", "材料力学", "computational mechanics", "solid mechanics", "elasticity", "materials mechanics"],
    summary: "Works on computational solid mechanics, elasticity and mechanical properties of materials.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Satoyuki Kawano",
    labName: "Molecular Fluid Dynamics Group",
    keywords: ["流体", "分子模拟", "微纳流体", "molecular fluid dynamics", "molecular simulation", "microfluidics", "nanofluidics"],
    summary: "Studies molecular fluid dynamics, micro/nano-scale flows and simulation-based fluid mechanics.",
    fieldCategory: "生命/医工"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Kazuyasu Sugiyama",
    labName: "Multiphase Flow Group",
    keywords: ["流体", "多相流", "气液两相流", "fluid dynamics", "multiphase flow", "bubble", "computational fluid dynamics"],
    summary: "Researches multiphase flows, bubble dynamics and computational fluid dynamics.",
    fieldCategory: "能源环境"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Atsushi Nishikawa",
    labName: "Medical Robotics Group",
    keywords: [...commonKeywords.robotics, ...commonKeywords.biomedical, "medical robotics", "surgical robot", "robot-assisted surgery", "biomechanics"],
    summary: "Develops medical robotics and robot-assisted surgical technologies for biomedical applications.",
    fieldCategory: "机器人/控制"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Shigenobu Ogata",
    labName: "Materials Simulation and Data Science Group",
    keywords: [...commonKeywords.materials, ...commonKeywords.ai, "molecular dynamics", "materials simulation", "multiscale simulation", "AI for materials"],
    summary: "Uses simulation, data science and AI for materials mechanics, materials design and multiscale modeling.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Shigeo Wada",
    labName: "Biomechanics Group",
    keywords: [...commonKeywords.biomedical, "biomechanics", "biofluid mechanics", "cell mechanics", "computational biomechanics"],
    summary: "Researches biomechanics, biofluid mechanics and computational modeling of biological systems.",
    fieldCategory: "生命/医工"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Shinya Aoi",
    labName: "Neuro-robotics and Locomotion Group",
    keywords: [...commonKeywords.robotics, ...commonKeywords.biomedical, "locomotion", "neuro-robotics", "motor control", "biomechanics", "walking robot"],
    summary: "Studies neuro-robotics, locomotion, motor control and biomechanics for understanding animal and robot movement.",
    fieldCategory: "机器人/控制"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Toru Nakamura",
    labName: "Biosystems Measurement Group",
    keywords: [...commonKeywords.biomedical, "biosignal", "measurement", "health informatics", "biomedical engineering"],
    summary: "Works on measurement and analysis of biological systems and health-related signals.",
    fieldCategory: "生命/医工"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Ken Kiyono",
    labName: "Health Informatics and Biological Signals Group",
    keywords: [...commonKeywords.biomedical, ...commonKeywords.ai, "health informatics", "biological signals", "time series analysis", "complex systems"],
    summary: "Researches health informatics, biological signal analysis, time series analysis and complex systems.",
    fieldCategory: "生命/医工"
  }),
  engineeringScience({
    department: "Department of Mechanical Science and Bioengineering",
    professorName: "Shinji Deguchi",
    labName: "Cellular Biomechanics Group",
    keywords: [...commonKeywords.biomedical, ...commonKeywords.materials, "cell mechanics", "tissue engineering", "mechanobiology", "biomaterials"],
    summary: "Studies cellular biomechanics, mechanobiology, tissue engineering and biomaterials.",
    fieldCategory: "生命/医工"
  }),

  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Akira Sakai",
    labName: "Applied Physics and Electron Systems Group",
    keywords: [...commonKeywords.physics, ...commonKeywords.materials, "electron systems", "semiconductor", "surface physics", "nanostructure"],
    summary: "Researches applied physics, electron systems, surfaces and nanostructures.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Yoshiaki Nakamura",
    labName: "Quantum Material Systems Group",
    keywords: [...commonKeywords.materials, ...commonKeywords.physics, "semiconductor", "nanostructure", "quantum materials", "thin films"],
    summary: "Works on semiconductor nanostructures, thin films and quantum material systems.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Kohei Hamaya",
    labName: "Spintronics Device Group",
    keywords: [...commonKeywords.materials, ...commonKeywords.physics, "spintronics", "semiconductor spintronics", "magnetic devices", "quantum devices"],
    summary: "Studies spintronics, semiconductor spin devices and magnetic device physics.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Keisuke Fujii",
    labName: "Quantum Information Systems Group",
    keywords: [...commonKeywords.ai, ...commonKeywords.physics, "quantum computing", "quantum information", "quantum algorithm", "quantum software"],
    summary: "Researches quantum computing, quantum information systems, quantum algorithms and quantum software.",
    fieldCategory: "信息/AI"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Atsushi Sanada",
    labName: "Electromagnetic and Metamaterial Systems Group",
    keywords: [...commonKeywords.physics, "metamaterials", "microwave engineering", "electromagnetic waves", "antenna"],
    summary: "Works on electromagnetic systems, metamaterials, microwave engineering and antenna-related technologies.",
    fieldCategory: "信息/AI"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Koji Igarashi",
    labName: "Optical Network Systems Group",
    keywords: ["光通信", "通信网络", "optical communication", "optical networks", "signal processing", "network systems"],
    summary: "Researches optical communication, optical network systems and signal processing for communication technologies.",
    fieldCategory: "信息/AI"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Takeo Minamikawa",
    labName: "Biomedical Photonics Group",
    keywords: [...commonKeywords.biomedical, ...commonKeywords.vision, "biophotonics", "optical imaging", "Raman spectroscopy", "medical imaging"],
    summary: "Studies biomedical photonics, optical imaging and spectroscopic methods for biomedical measurement.",
    fieldCategory: "生命/医工"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Masayuki Abe",
    labName: "Surface and Interface Measurement Group",
    keywords: [...commonKeywords.materials, ...commonKeywords.physics, "surface science", "scanning probe microscopy", "interface", "nanotechnology"],
    summary: "Researches surface and interface science, scanning probe microscopy and nanotechnology.",
    fieldCategory: "材料/化学"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Koichiro Yoshino",
    labName: "Adaptive Robotics and Intelligence Group",
    keywords: [...commonKeywords.robotics, ...commonKeywords.ai, "adaptive systems", "intelligent systems", "machine learning"],
    summary: "Works on adaptive robotic systems, intelligent systems and machine learning-based control.",
    fieldCategory: "机器人/控制"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Kenjiro Tadakuma",
    labName: "Robot Mechanism and Soft Robotics Group",
    keywords: [...commonKeywords.robotics, "robot mechanism", "soft robotics", "mobile robot", "actuator", "gripper"],
    summary: "Develops robot mechanisms, soft robotics, actuators, grippers and mobile robot systems.",
    fieldCategory: "机器人/控制"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Yuichiro Yoshikawa",
    labName: "Social Robotics and Human Interaction Group",
    keywords: [...commonKeywords.robotics, ...commonKeywords.ai, "social robotics", "human-robot interaction", "cognitive science", "communication robot"],
    summary: "Studies social robotics, human-robot interaction, communication robots and cognitive science.",
    fieldCategory: "机器人/控制"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Daisuke Iwai",
    labName: "Projection Mapping and Human Interface Group",
    keywords: [...commonKeywords.vision, "投影映射", "增强现实", "human interface", "projection mapping", "augmented reality", "computer graphics"],
    summary: "Researches projection mapping, human interface, augmented reality, computer graphics and visual display systems.",
    fieldCategory: "信息/AI"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Kensuke Harada",
    labName: "Robot Manipulation Group",
    keywords: [...commonKeywords.robotics, ...commonKeywords.ai, "robot manipulation", "grasping", "motion planning", "industrial robot"],
    summary: "Researches robot manipulation, grasping, motion planning and industrial robot systems.",
    fieldCategory: "机器人/控制"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Kazunori Sakurama",
    labName: "Control Systems Group",
    keywords: [...commonKeywords.robotics, "control theory", "networked control", "multi-agent systems", "systems control"],
    summary: "Works on control theory, networked control systems and multi-agent systems.",
    fieldCategory: "机器人/控制"
  }),
  engineeringScience({
    department: "Department of Systems Innovation",
    professorName: "Masahiro Inuiguchi",
    labName: "Decision and Knowledge Systems Group",
    keywords: [...commonKeywords.ai, "decision systems", "knowledge systems", "fuzzy systems", "optimization", "operations research"],
    summary: "Researches decision systems, knowledge systems, fuzzy systems, optimization and operations research.",
    fieldCategory: "信息/AI"
  }),

  ist({
    major: "Department of Computer Science",
    professorName: "Taisuke Izumi",
    labName: "Algorithm Engineering Laboratory",
    keywords: ["算法", "分布式算法", "algorithm", "algorithm engineering", "distributed algorithm", "graph algorithm", "theoretical computer science"],
    summary: "Researches algorithm engineering, distributed algorithms, graph algorithms and theoretical computer science.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istComputerScience
  }),
  ist({
    major: "Department of Computer Science",
    professorName: "Shinji Kusumoto",
    labName: "Software Design Laboratory",
    keywords: ["软件工程", "软件设计", "software engineering", "software design", "software quality", "program analysis", "software maintenance"],
    summary: "Works on software design, software engineering, software quality, program analysis and software maintenance.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istComputerScience
  }),
  ist({
    major: "Department of Computer Science",
    professorName: "Yoshiki Higo",
    labName: "Software Engineering Laboratory",
    keywords: ["软件工程", "软件测试", "代码分析", "software engineering", "software testing", "program analysis", "code clone"],
    summary: "Researches software engineering, software testing, program analysis and code analysis.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istComputerScience
  }),
  ist({
    major: "Department of Computer Science",
    professorName: "Raula Gaikovina Kula",
    labName: "Software Engineering Laboratory",
    keywords: ["软件工程", "开源软件", "software engineering", "software ecosystem", "open source software", "mining software repositories"],
    summary: "Studies software ecosystems, open source software, software repository mining and empirical software engineering.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istComputerScience
  }),
  ist({
    major: "Department of Computer Science",
    professorName: "Fumihiko Ino",
    labName: "Supercomputing Engineering Laboratory",
    keywords: ["高性能计算", "并行计算", "GPU", "supercomputing", "high performance computing", "parallel computing", "GPU computing"],
    summary: "Researches supercomputing engineering, high-performance computing, parallel computing and GPU computing.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istComputerScience
  }),
  ist({
    major: "Department of Computer Science",
    professorName: "Yuta Nakashima",
    labName: "Intelligent Media Systems Laboratory",
    keywords: [...commonKeywords.vision, ...commonKeywords.ai, "multimedia", "media intelligence", "pattern recognition"],
    summary: "Studies intelligent media systems, computer vision, multimedia analysis and machine learning-based media intelligence.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istComputerScience
  }),
  ist({
    major: "Department of Computer Science",
    professorName: "Hajime Nagahara",
    labName: "Intelligence and Sensing Laboratory",
    keywords: [...commonKeywords.vision, ...commonKeywords.ai, "computational imaging", "sensing", "camera systems", "image reconstruction"],
    summary: "Researches intelligence and sensing, computational imaging, camera systems, computer vision and image reconstruction.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istComputerScience
  }),
  ist({
    major: "Department of Computer Science",
    professorName: "Toru Yarimizu",
    labName: "Business Platform Laboratory",
    keywords: ["商业平台", "信息系统", "business platform", "information systems", "enterprise systems", "data platform"],
    summary: "Works on business platforms, information systems, enterprise systems and data platforms.",
    fieldCategory: "商科社科",
    sourceUrl: sources.istComputerScience
  }),
  ist({
    major: "Department of Computer Science",
    professorName: "Kaname Harumoto",
    labName: "Business Platform Laboratory",
    keywords: ["信息系统", "移动计算", "business platform", "information systems", "mobile computing", "ubiquitous computing"],
    summary: "Researches information systems, mobile computing, ubiquitous computing and business platform technologies.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istComputerScience
  }),

  ist({
    major: "Department of Information Systems Engineering",
    professorName: "Yoshinobu Kawahara",
    labName: "Machine Learning and Systems Laboratory",
    keywords: [...commonKeywords.ai, "statistical learning", "data mining", "mathematical informatics", "machine learning systems"],
    summary: "Researches machine learning, statistical learning, data mining and mathematical informatics.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istInformationSystems
  }),
  ist({
    major: "Department of Information Systems Engineering",
    professorName: "Takao Onoye",
    labName: "Information Systems Synthesis Laboratory",
    keywords: ["集成电路", "嵌入式系统", "system design", "VLSI", "integrated circuits", "embedded systems", "hardware architecture"],
    summary: "Works on information systems synthesis, VLSI, embedded systems and hardware architecture.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istInformationSystems
  }),
  ist({
    major: "Department of Information Systems Engineering",
    professorName: "Noriyuki Miura",
    labName: "Intelligent Integrated Systems Laboratory",
    keywords: ["集成系统", "智能硬件", "integrated systems", "sensor systems", "hardware security", "edge computing"],
    summary: "Researches intelligent integrated systems, sensor systems, hardware security and edge computing.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istInformationSystems
  }),
  ist({
    major: "Department of Information Systems Engineering",
    professorName: "Tatsuhiro Tsuchiya",
    labName: "Dependability Engineering Laboratory",
    keywords: ["可信系统", "软件可靠性", "dependability engineering", "software reliability", "formal methods", "fault tolerance"],
    summary: "Studies dependability engineering, software reliability, formal methods and fault-tolerant systems.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istInformationSystems
  }),
  ist({
    major: "Department of Information Systems Engineering",
    professorName: "Yuki Uranishi",
    labName: "Integrated Media Environment Laboratory",
    keywords: [...commonKeywords.vision, "media environment", "virtual reality", "augmented reality", "human interface"],
    summary: "Researches integrated media environments, computer vision, virtual reality, augmented reality and human interfaces.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istInformationSystems
  }),
  ist({
    major: "Department of Information Systems Engineering",
    professorName: "Yasushi Sakurai",
    labName: "Intelligence Data Science Laboratory",
    keywords: [...commonKeywords.ai, "大数据", "data mining", "big data", "time series data", "database systems", "graph mining"],
    summary: "Researches intelligence data science, data mining, big data, time-series data and graph mining.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istInformationSystems
  }),
  ist({
    major: "Department of Information Systems Engineering",
    professorName: "Takafumi Uemura",
    labName: "Advanced Thin-Film Functional Properties Laboratory",
    keywords: [...commonKeywords.materials, "thin film", "functional materials", "electronic devices", "organic electronics"],
    summary: "Studies advanced thin-film functional properties, electronic devices and organic electronics.",
    fieldCategory: "材料/化学",
    sourceUrl: sources.istInformationSystems
  }),
  ist({
    major: "Department of Information Systems Engineering",
    professorName: "Makoto Negoro",
    labName: "Quantum Information Systems Laboratory",
    keywords: [...commonKeywords.physics, ...commonKeywords.ai, "quantum information", "quantum computing", "quantum control", "quantum systems"],
    summary: "Researches quantum information systems, quantum computing and quantum control.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istInformationSystems
  }),

  ist({
    major: "Department of Multimedia Engineering",
    professorName: "Takahiro Hara",
    labName: "Intelligent Information Systems Laboratory",
    keywords: [...commonKeywords.ai, "database", "mobile computing", "distributed systems", "information systems"],
    summary: "Works on intelligent information systems, databases, mobile computing and distributed systems.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istMultimedia
  }),
  ist({
    major: "Department of Multimedia Engineering",
    professorName: "Takanori Isobe",
    labName: "Cryptography Engineering Laboratory",
    keywords: ["密码学", "信息安全", "cryptography", "information security", "block cipher", "security engineering"],
    summary: "Researches cryptography engineering, information security and block cipher analysis/design.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istMultimedia
  }),
  ist({
    major: "Department of Multimedia Engineering",
    professorName: "Makoto Onizuka",
    labName: "Big Data Engineering Laboratory",
    keywords: [...commonKeywords.ai, "大数据", "big data", "data engineering", "database", "graph data", "data mining"],
    summary: "Studies big data engineering, databases, graph data, data mining and data management.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istMultimedia
  }),
  ist({
    major: "Department of Multimedia Engineering",
    professorName: "Takuya Maekawa",
    labName: "Real-world Intelligence Laboratory",
    keywords: [...commonKeywords.ai, "ubiquitous computing", "wearable sensing", "activity recognition", "sensor data"],
    summary: "Researches real-world intelligence, ubiquitous computing, wearable sensing, activity recognition and sensor data analysis.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istMultimedia
  }),
  ist({
    major: "Department of Multimedia Engineering",
    professorName: "Tamami Nakano",
    labName: "Cognitive Neuroinformatics Laboratory",
    keywords: [...commonKeywords.biomedical, ...commonKeywords.ai, "cognitive science", "neuroinformatics", "brain science", "human behavior"],
    summary: "Studies cognitive neuroinformatics, brain science, human behavior and computational approaches to cognition.",
    fieldCategory: "生命/医工",
    sourceUrl: sources.istMultimedia
  }),
  ist({
    major: "Department of Multimedia Engineering",
    professorName: "Tadahiko Murata",
    labName: "Synthetic Data Engineering Laboratory",
    keywords: [...commonKeywords.ai, "synthetic data", "agent-based simulation", "social simulation", "data engineering"],
    summary: "Researches synthetic data engineering, agent-based simulation, social simulation and data engineering.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istMultimedia
  }),
  ist({
    major: "Department of Multimedia Engineering",
    professorName: "Susumu Date",
    labName: "Advanced HPC Infrastructure Systems Laboratory",
    keywords: ["高性能计算", "HPC", "supercomputing", "cloud computing", "research infrastructure", "distributed computing"],
    summary: "Works on advanced HPC infrastructure, supercomputing, cloud computing and distributed research infrastructure.",
    fieldCategory: "信息/AI",
    sourceUrl: sources.istMultimedia
  }),
  ist({
    major: "Department of Multimedia Engineering",
    professorName: "Norihiro Hagita",
    labName: "Multimedia Agent Systems Laboratory",
    keywords: [...commonKeywords.robotics, ...commonKeywords.ai, "multimedia agent", "human-robot interaction", "ambient intelligence"],
    summary: "Researches multimedia agent systems, human-robot interaction, ambient intelligence and intelligent environments.",
    fieldCategory: "机器人/控制",
    sourceUrl: sources.istMultimedia
  }),
  ist({
    major: "Department of Multimedia Engineering",
    professorName: "Takahiro Miyashita",
    labName: "Multimedia Agent Systems Laboratory",
    keywords: [...commonKeywords.robotics, ...commonKeywords.ai, "multimedia agent", "interaction robot", "human sensing", "intelligent environment"],
    summary: "Studies multimedia agent systems, interaction robots, human sensing and intelligent environments.",
    fieldCategory: "机器人/控制",
    sourceUrl: sources.istMultimedia
  })
];

const existingProfiles = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const curatedOsakaSources = new Set([sourceDatabase, "Osaka University official laboratory pages"]);

const preservedProfiles = existingProfiles.filter(
  (profile) => !(profile.university === "Osaka University" && curatedOsakaSources.has(profile.sourceDatabase))
);
const nextProfiles = [...preservedProfiles, ...osakaProfiles].sort((a, b) =>
  `${a.university} ${a.professorName} ${a.labName}`.localeCompare(`${b.university} ${b.professorName} ${b.labName}`)
);

fs.writeFileSync(outputPath, `${JSON.stringify(nextProfiles, null, 2)}\n`, "utf8");
console.log(`Added ${osakaProfiles.length} curated Osaka University professor/lab profiles. Total: ${nextProfiles.length}.`);
