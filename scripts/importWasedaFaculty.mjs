import fs from "node:fs";

const outputPath = "data/facultyProfiles.json";
const baseUrl = "https://w-rdb.waseda.jp";
const lastChecked = "2026-07-10";
const detailConcurrency = 6;
const detailRequestDelayMs = 80;
const maxPublicationTitles = 24;
const maxSummaryLength = 3200;

// High-level Waseda affiliations from the official Researchers Database.
// Using top-level affiliations avoids most duplicate entries from nested graduate school links.
const affiliations = [
  { code: "0000003", name: "Faculty of Political Science and Economics" },
  { code: "0000004", name: "Faculty of Law" },
  { code: "0000005", name: "Faculty of Letters, Arts and Sciences" },
  { code: "0000006", name: "Faculty of Education and Integrated Arts and Sciences" },
  { code: "0000007", name: "Faculty of Commerce" },
  { code: "0000008", name: "Faculty of Science and Engineering" },
  { code: "0000009", name: "Faculty of Social Sciences" },
  { code: "0000010", name: "Faculty of Human Sciences" },
  { code: "0000011", name: "Faculty of Sport Sciences" },
  { code: "0000012", name: "Faculty of International Research and Education" },
  { code: "0000013", name: "Research Organization" },
  { code: "0000014", name: "Affiliated organization" }
];

// The list pages sometimes expose only broad research areas. Keep targeted enrichments
// from official detail pages here so re-imports do not lose important matching signals.
const profileEnrichments = new Map([
  [
    `${baseUrl}/html/100001116_en.html`,
    {
      researchKeywords: [
        "Structural and seismic engineering",
        "Structure engineering and earthquake engineering",
        "Concrete",
        "Reinforced concrete",
        "Prestressed concrete bridges",
        "Structural safety",
        "Structural reliability",
        "Resilience",
        "Bridge engineering",
        "Durability",
        "Corrosion"
      ],
      researchSummary:
        "Structural and seismic engineering; life-cycle analysis, sustainability, resilience, multiple hazards, climate change, damage-free structures; concrete, reinforced concrete, prestressed concrete bridges, structural safety and reliability.",
      labUrl: "https://akiyama617.sci.waseda.ac.jp/en-home/"
    }
  ]
]);

const targetJobTitlePattern = /Professor|Associate Professor|Assistant Professor|Lecturer/i;

function decodeHtml(value) {
  return value
    .replace(/<script[^>]*>.*?<\/script>/gis, "")
    .replace(/<style[^>]*>.*?<\/style>/gis, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/▼display all/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKeywords(text) {
  return Array.from(
    new Set(
      text
        .split(/\s*\|\s*|,|;|\//)
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 1)
    )
  ).slice(0, 16);
}

function normalizeDetailKeywords(text) {
  return Array.from(
    new Set(
      text
        .split(/\s*\|\s*|,|;|\/|&nbsp;|　/)
        .map((keyword) => decodeHtml(keyword))
        .filter((keyword) => keyword.length > 2)
        .filter((keyword) => !/^\d{4}/.test(keyword))
    )
  ).slice(0, 30);
}

function extractSectionHtml(html, divId, fallbackLength = 20000) {
  const marker = `<div id="${divId}"`;
  const start = html.indexOf(marker);
  if (start === -1) return "";

  const nextTextBlock = html.indexOf('<div class="text">', start + marker.length);
  return html.slice(start, nextTextBlock === -1 ? start + fallbackLength : nextTextBlock);
}

function extractSectionText(html, divId) {
  return decodeHtml(extractSectionHtml(html, divId));
}

function extractTitles(html) {
  const titles = [];
  const titlePattern = /<p class="title">([\s\S]*?)<\/p>/g;
  let match;

  while ((match = titlePattern.exec(html)) && titles.length < maxPublicationTitles) {
    const title = decodeHtml(match[1]);
    if (title.length < 8) continue;
    titles.push(title);
  }

  return Array.from(new Set(titles));
}

function extractHomepageUrl(html) {
  const homepageLabelIndex = html.indexOf("Homepage URL");
  if (homepageLabelIndex === -1) return "";

  const homepageBlock = html.slice(homepageLabelIndex, homepageLabelIndex + 1200);
  const urlMatch = homepageBlock.match(/<a href="([^"]+)"/);
  return urlMatch?.[1] ?? "";
}

function parseDetailPage(html) {
  const areasText = extractSectionText(html, "kaknh_bnrui");
  const interestsText = extractSectionText(html, "kenkyu_keyword");
  const paperTitles = extractTitles(extractSectionHtml(html, "ronbn", 100000));
  const projectTitles = extractTitles(extractSectionHtml(html, "kaknh_get", 60000));
  const titleTexts = [...paperTitles, ...projectTitles].slice(0, maxPublicationTitles);
  const detailText = [areasText, interestsText, ...titleTexts].filter(Boolean).join("; ");

  return {
    labUrl: extractHomepageUrl(html),
    detailKeywords: normalizeDetailKeywords(`${areasText}; ${interestsText}`),
    detailSummary: detailText.slice(0, maxSummaryLength)
  };
}

function inferFieldCategory(keywords, affiliation) {
  const text = `${keywords.join(" ")} ${affiliation}`.toLowerCase();

  if (/architecture|civil|seismic|earthquake|building|urban|disaster/.test(text)) return "工学/建筑土木";
  if (/robot|control|mechatronics|mechanic/.test(text)) return "机器人/控制";
  if (/metal|material|polymer|chemistry|nano|semiconductor|surface|composite/.test(text)) return "材料/化学";
  if (/informatics|computer|software|database|network|intelligent|ai|human interface|perceptual/.test(text)) return "信息/AI";
  if (/environment|energy|sustainable|recycle/.test(text)) return "能源环境";
  if (/business|commerce|management|accounting|finance|economics/.test(text)) return "商科/经济";
  if (/politic|policy|international relation|law|sociology|social/.test(text)) return "社科/政策";
  if (/psychology|cognitive|human sciences|education|welfare/.test(text)) return "人间科学/教育";
  if (/bio|life|medical|health|neuroscience|genome/.test(text)) return "生命/医工";

  return "其他";
}

function matchProgramHints(affiliation, keywords) {
  const text = `${affiliation} ${keywords.join(" ")}`.toLowerCase();
  const hints = [];

  if (text.includes("science and engineering")) {
    hints.push("Graduate School of Fundamental Science and Engineering");
    hints.push("Graduate School of Creative Science and Engineering");
    hints.push("Graduate School of Advanced Science and Engineering");
  }
  if (text.includes("information, production")) hints.push("Graduate School of Information, Production and Systems");
  if (text.includes("environment and energy")) hints.push("Graduate School of Environment and Energy Engineering");
  if (text.includes("commerce")) hints.push("Graduate School of Commerce");
  if (text.includes("political")) hints.push("Graduate School of Political Science");
  if (text.includes("social sciences")) hints.push("Graduate School of Social Sciences");
  if (text.includes("human sciences")) hints.push("Graduate School of Human Sciences");
  if (text.includes("asia") || text.includes("international")) hints.push("Graduate School of Asia-Pacific Studies");

  return Array.from(new Set(hints)).slice(0, 4);
}

function parseCards(html, sourceAffiliation) {
  const cards = html.split('<div class="card h-100">').slice(1);

  return cards
    .map((card) => {
      const profileMatch = card.match(/<a href="(\/html\/[^"]+_en\.html)">([^<]+)<\/a>/);
      const titleMatch = card.match(/<div class="name-title">([\s\S]*?)<\/div>/);
      const affiliationMatch = card.match(/<p class="h6 org-cd">([\s\S]*?)<\/p>/);
      const fieldsMatch = card.match(/<p class="kaknh-bnrui">([\s\S]*?)<\/p>/);

      if (!profileMatch || !titleMatch || !affiliationMatch) return null;

      const professorName = decodeHtml(profileMatch[2]);
      const title = decodeHtml(titleMatch[1]);
      if (!targetJobTitlePattern.test(title)) return null;

      const affiliation = decodeHtml(affiliationMatch[1]);
      const researchText = fieldsMatch ? decodeHtml(fieldsMatch[1]) : "";
      const researchKeywords = normalizeKeywords(researchText);

      return {
        university: "Waseda University",
        sourceAffiliation,
        graduateSchoolHints: matchProgramHints(affiliation, researchKeywords),
        department: affiliation,
        professorName,
        title,
        labName: "",
        researchKeywords,
        researchSummary: researchText,
        facultyUrl: `${baseUrl}${profileMatch[1]}`,
        labUrl: "",
        sourceUrl: `${baseUrl}${profileMatch[1]}`,
        sourceDatabase: "Waseda University Researchers Database",
        fieldCategory: inferFieldCategory(researchKeywords, affiliation),
        lastChecked
      };
    })
    .filter(Boolean);
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed ${response.status}: ${url}`);
  return response.text();
}

async function enrichProfileFromDetail(profile) {
  try {
    const html = await fetchText(profile.facultyUrl);
    const detail = parseDetailPage(html);
    const mergedKeywords = Array.from(new Set([...profile.researchKeywords, ...detail.detailKeywords]));

    return {
      ...profile,
      researchKeywords: mergedKeywords.slice(0, 44),
      researchSummary: [profile.researchSummary, detail.detailSummary].filter(Boolean).join("; ").slice(0, maxSummaryLength),
      labUrl: detail.labUrl || profile.labUrl,
      fieldCategory: inferFieldCategory(mergedKeywords, `${profile.department} ${detail.detailSummary}`)
    };
  } catch (error) {
    console.warn(`Detail fetch failed for ${profile.professorName}: ${profile.facultyUrl}`);
    return profile;
  }
}

async function enrichProfilesFromDetails(profiles) {
  const enrichedProfiles = new Array(profiles.length);
  let nextIndex = 0;

  async function worker(workerIndex) {
    while (nextIndex < profiles.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      enrichedProfiles[currentIndex] = await enrichProfileFromDetail(profiles[currentIndex]);
      if ((currentIndex + 1) % 100 === 0) {
        console.log(`Detail pages: ${currentIndex + 1}/${profiles.length}`);
      }

      await new Promise((resolve) => setTimeout(resolve, detailRequestDelayMs + workerIndex * 10));
    }
  }

  await Promise.all(Array.from({ length: detailConcurrency }, (_, index) => worker(index)));
  return enrichedProfiles;
}

async function importAffiliation(affiliation) {
  const profiles = [];

  for (let page = 1; page <= 80; page += 1) {
    const url = `${baseUrl}/search?a2=${affiliation.code}&l=en&m=affiliation&o=shokumei&pp=100&p=${page}&s=1`;
    const html = await fetchText(url);
    const cards = parseCards(html, affiliation.name);
    if (cards.length === 0) break;

    profiles.push(...cards);
    if (cards.length < 100) break;

    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  console.log(`${affiliation.name}: ${profiles.length}`);
  return profiles;
}

const importedProfiles = [];

for (const affiliation of affiliations) {
  importedProfiles.push(...(await importAffiliation(affiliation)));
}

const byUrl = new Map();
for (const profile of importedProfiles) {
  const existing = byUrl.get(profile.facultyUrl);
  if (!existing) {
    byUrl.set(profile.facultyUrl, profile);
    continue;
  }

  byUrl.set(profile.facultyUrl, {
    ...existing,
    sourceAffiliation: Array.from(new Set([existing.sourceAffiliation, profile.sourceAffiliation])).join(" / "),
    graduateSchoolHints: Array.from(new Set([...existing.graduateSchoolHints, ...profile.graduateSchoolHints]))
  });
}

let facultyProfiles = Array.from(byUrl.values()).sort((a, b) => a.professorName.localeCompare(b.professorName));
console.log(`Fetching ${facultyProfiles.length} detail pages from Waseda Researchers Database...`);
facultyProfiles = await enrichProfilesFromDetails(facultyProfiles);
for (const profile of facultyProfiles) {
  const enrichment = profileEnrichments.get(profile.facultyUrl);
  if (!enrichment) continue;

  profile.researchKeywords = Array.from(new Set([...profile.researchKeywords, ...enrichment.researchKeywords]));
  profile.researchSummary = `${profile.researchSummary}; ${enrichment.researchSummary}`;
  profile.labUrl = enrichment.labUrl;
}

fs.writeFileSync(outputPath, `${JSON.stringify(facultyProfiles, null, 2)}\n`, "utf8");
console.log(`Imported ${facultyProfiles.length} Waseda faculty profiles to ${outputPath}`);
