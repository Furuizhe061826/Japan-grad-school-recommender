import fs from "node:fs";

const synonymGroups = JSON.parse(fs.readFileSync("data/researchSynonyms.json", "utf8"));

function expandKeywords(input) {
  const text = input.toLowerCase();
  return new Set(
    synonymGroups
      .filter((group) => group.triggers.some((trigger) => text.includes(trigger.toLowerCase())))
      .flatMap((group) => group.expandedKeywords.map((keyword) => keyword.toLowerCase()))
  );
}

const cases = [
  { input: "抗震", expected: ["seismic engineering", "earthquake engineering", "structural engineering"] },
  { input: "土木工程", expected: ["structural engineering", "geotechnical engineering"] },
  { input: "图像", expected: ["computer vision", "image processing"] },
  { input: "软件工程", expected: ["software engineering", "computer science"] },
  { input: "机械工程", expected: ["mechanical engineering"] },
  { input: "轻合金", expected: ["light alloy", "materials science"] },
  { input: "城市规划", expected: ["urban planning"] },
  { input: "环境工程", expected: ["environmental engineering"] },
  { input: "经营学", expected: ["business administration"] },
  { input: "生命科学", expected: ["life science"] }
];

const failures = cases.flatMap((item) => {
  const expanded = expandKeywords(item.input);
  return item.expected
    .filter((keyword) => !expanded.has(keyword.toLowerCase()))
    .map((keyword) => `${item.input} should expand to ${keyword}`);
});

if (failures.length > 0) {
  console.error("Research synonym checks failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Research synonym checks passed: ${cases.length} cases.`);
