import fs from "node:fs";

const outputPath = "data/facultyProfiles.json";
const lastChecked = "2026-07-11";

const osakaProfiles = [
  {
    university: "Osaka University",
    sourceAffiliation: "Graduate School of Engineering Science",
    graduateSchoolHints: ["Graduate School of Engineering Science"],
    department: "Graduate School of Engineering Science, Department of Systems Innovation",
    professorName: "Hiroshi Ishiguro",
    title: "Professor",
    labName: "Intelligent Robotics Laboratory / Ishiguro Laboratory",
    researchKeywords: [
      "Android robotics",
      "Humanoid robots",
      "Human-robot interaction",
      "Intelligent robotics",
      "Artificial intelligence",
      "Cognitive science",
      "Sensor networks",
      "Social robotics",
      "Geminoid",
      "ERICA",
      "Telenoid"
    ],
    researchSummary:
      "Intelligent Robotics Laboratory develops intelligent systems for future human society based on sensor engineering, robotics, artificial intelligence and cognitive science. The lab works on perceptual information infrastructure, intelligent robot information infrastructure, humanoid robots, androids, social robots and real-world social experiments.",
    facultyUrl: "https://www.irl.sys.es.osaka-u.ac.jp/members/staff",
    labUrl: "https://www.irl.sys.es.osaka-u.ac.jp/",
    sourceUrl: "https://www.irl.sys.es.osaka-u.ac.jp/",
    sourceDatabase: "Osaka University official laboratory pages",
    fieldCategory: "机器人/控制",
    lastChecked
  },
  {
    university: "Osaka University",
    sourceAffiliation: "Graduate School of Engineering",
    graduateSchoolHints: ["Graduate School of Engineering"],
    department: "Department of Applied Physics, Graduate School of Engineering",
    professorName: "Katsumasa Fujita",
    title: "Professor",
    labName: "Nanophotonics Laboratory",
    researchKeywords: [
      "Nanophotonics",
      "Optical microscopy",
      "Spectroscopic microscopy",
      "Super-resolution microscopy",
      "Raman microscopy",
      "Deep-UV microscopy",
      "Cryo-optical microscopy",
      "Biomedical imaging",
      "Material sciences",
      "Laser microfabrication"
    ],
    researchSummary:
      "Nanophotonics Laboratory in the Department of Applied Physics develops next-generation optical and spectroscopic microscopy technologies for biological, medical and material science applications. Current topics include cryo-optical microscopy, super-resolution microscopy, Raman microscopy, deep-UV microscopy and DUV laser microfabrication.",
    facultyUrl: "https://photon-ap.eng.osaka-u.ac.jp/people.html",
    labUrl: "https://photon-ap.eng.osaka-u.ac.jp/research.html",
    sourceUrl: "https://photon-ap.eng.osaka-u.ac.jp/research.html",
    sourceDatabase: "Osaka University official laboratory pages",
    fieldCategory: "材料/化学",
    lastChecked
  }
];

const existingProfiles = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const osakaKeys = new Set(osakaProfiles.map((profile) => `${profile.university}:${profile.professorName}:${profile.labName}`));

const preservedProfiles = existingProfiles.filter((profile) => !osakaKeys.has(`${profile.university}:${profile.professorName}:${profile.labName}`));
const nextProfiles = [...preservedProfiles, ...osakaProfiles].sort((a, b) =>
  `${a.university} ${a.professorName} ${a.labName}`.localeCompare(`${b.university} ${b.professorName} ${b.labName}`)
);

fs.writeFileSync(outputPath, `${JSON.stringify(nextProfiles, null, 2)}\n`, "utf8");
console.log(`Added ${osakaProfiles.length} curated Osaka University professor/lab profiles. Total: ${nextProfiles.length}.`);
