import fs from "node:fs";

const dataPath = "data/programs.json";
const programs = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const materialKeywords = ["材料", "材料科学", "金属", "金属材料", "合金", "轻合金", "材料加工", "材料成形"];
const materialProgramIds = new Set([
  "Tohoku University|Graduate School of Engineering|Materials Science / Mechanical Systems",
  "Waseda University|Graduate School of Advanced Science and Engineering|Life Science / Materials / Applied Chemistry",
  "Institute of Science Tokyo|School of Materials and Chemical Technology|Materials Science / Chemical Science",
  "Hokkaido University|Graduate School of Chemical Sciences and Engineering|Chemical Science / Materials Chemistry"
]);

for (const program of programs) {
  const id = `${program.universityName}|${program.graduateSchool}|${program.programName}`;
  if (!materialProgramIds.has(id)) continue;

  program.keywords = Array.from(new Set([...program.keywords, ...materialKeywords]));
}

fs.writeFileSync(dataPath, `${JSON.stringify(programs, null, 2)}\n`, "utf8");
console.log(`Updated material keywords for ${materialProgramIds.size} programs.`);
