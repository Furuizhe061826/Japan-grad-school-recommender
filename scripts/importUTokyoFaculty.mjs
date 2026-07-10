import fs from "node:fs";

const outputPath = "data/facultyProfiles.json";
const baseUrl = "https://www.u-tokyo.ac.jp";
const listUrl = `${baseUrl}/focus/en/people/`;
const lastChecked = "2026-07-10";
const maxPages = 560;
const detailConcurrency = 8;
const listRequestDelayMs = 80;
const retryDelayMs = 500;

function decodeHtml(value) {
  return value
    .replace(/<script[^>]*>.*?<\/script>/gis, "")
    .replace(/<style[^>]*>.*?<\/style>/gis, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function toAbsoluteUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${baseUrl}${path}`;
}

function splitKeywords(text) {
  return Array.from(
    new Set(
      text
        .split(/\s*\|\s*|,|;|\/|　/)
        .map((keyword) => decodeHtml(keyword))
        .filter((keyword) => keyword.length > 2)
    )
  ).slice(0, 36);
}

function inferFieldCategory(text) {
  const lowerText = text.toLowerCase();

  if (/architecture|civil|seismic|earthquake|concrete|urban|infrastructure|disaster/.test(lowerText)) return "工学/建筑土木";
  if (/computer|informatics|algorithm|software|database|network|artificial intelligence|machine learning|data science|image/.test(lowerText)) {
    return "信息/AI";
  }
  if (/robot|control|mechanic|mechatronics|manufacturing|electrical|electronics/.test(lowerText)) return "机器人/控制";
  if (/material|metal|alloy|chemistry|polymer|nano|semiconductor|crystal|microscopy/.test(lowerText)) return "材料/化学";
  if (/environment|energy|climate|sustainable|ocean|atmosphere|ecology/.test(lowerText)) return "能源环境";
  if (/biology|life|medical|medicine|genome|neuroscience|health|agricultural|food/.test(lowerText)) return "生命/医工";
  if (/economics|management|finance|policy|law|politic|sociology|education|humanities/.test(lowerText)) return "商科社科";

  return "其他";
}

function parseListCards(html) {
  const cards = html.split('<div class="p-news-kyouin-search-results">').slice(1);

  return cards
    .map((card) => {
      const profileMatch = card.match(/<a href="([^"]+)">([\s\S]*?)<\/a>/);
      const facultyMatch = card.match(/<th[^>]*>Faculty<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/);
      const positionMatch = card.match(/<th[^>]*>Position<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/);

      if (!profileMatch || !facultyMatch || !positionMatch) return null;

      const title = decodeHtml(positionMatch[1]);
      if (title !== "Professor") return null;

      return {
        professorName: decodeHtml(profileMatch[2]),
        title,
        department: decodeHtml(facultyMatch[1]),
        facultyUrl: toAbsoluteUrl(profileMatch[1])
      };
    })
    .filter(Boolean);
}

function getTableValue(html, label) {
  const pattern = new RegExp(`<th[^>]*>${label.replace(/[()]/g, "\\$&")}<\\/th>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`, "i");
  return decodeHtml(html.match(pattern)?.[1] ?? "");
}

function getTableUrl(html, label) {
  const pattern = new RegExp(`<th[^>]*>${label.replace(/[()]/g, "\\$&")}<\\/th>\\s*<td[^>]*>[\\s\\S]*?<a href="([^"]+)"`, "i");
  return html.match(pattern)?.[1] ?? "";
}

function parseDetailPage(html, listProfile) {
  const affiliation = getTableValue(html, "Affiliation") || listProfile.department;
  const specialty = getTableValue(html, "Specialty");
  const researchTheme = getTableValue(html, "Research theme(s)");
  const researchKeywordText = getTableValue(html, "Keywords related to research themes");
  const affiliationUrl = getTableUrl(html, "Affiliation site URL");
  const keywordText = [specialty, researchTheme, researchKeywordText].filter(Boolean).join(", ");
  const researchKeywords = splitKeywords(keywordText);

  return {
    university: "University of Tokyo",
    sourceAffiliation: affiliation,
    graduateSchoolHints: [affiliation],
    department: affiliation,
    professorName: listProfile.professorName,
    title: listProfile.title,
    labName: "",
    researchKeywords,
    researchSummary: keywordText.slice(0, 2800),
    facultyUrl: listProfile.facultyUrl,
    labUrl: toAbsoluteUrl(affiliationUrl),
    sourceUrl: listProfile.facultyUrl,
    sourceDatabase: "The University of Tokyo Faculty Search",
    fieldCategory: inferFieldCategory(keywordText || affiliation),
    lastChecked
  };
}

async function fetchText(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const response = await fetch(url);
    if (response.ok) return response.text();

    if (attempt === retries) throw new Error(`Fetch failed ${response.status}: ${url}`);
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs * attempt));
  }

  return "";
}

async function fetchListProfiles() {
  const profiles = [];
  const failedPages = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const url = page === 1 ? listUrl : `${listUrl}index.php?pageID=${page}`;
    let html = "";
    try {
      html = await fetchText(url);
    } catch (error) {
      failedPages.push(page);
      console.warn(`UTokyo list page failed, skipped: ${page}`);
      continue;
    }

    const cards = parseListCards(html);
    if (cards.length === 0 && !html.includes("p-news-kyouin-search-results")) break;

    profiles.push(...cards);
    if (page % 50 === 0) console.log(`UTokyo list pages: ${page}/${maxPages}, professors so far: ${profiles.length}`);
    await new Promise((resolve) => setTimeout(resolve, listRequestDelayMs));
  }

  if (failedPages.length > 0) console.warn(`Skipped UTokyo list pages: ${failedPages.join(", ")}`);
  return profiles;
}

async function enrichProfiles(profiles) {
  const enrichedProfiles = new Array(profiles.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < profiles.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      try {
        const html = await fetchText(profiles[currentIndex].facultyUrl);
        enrichedProfiles[currentIndex] = parseDetailPage(html, profiles[currentIndex]);
      } catch (error) {
        console.warn(`UTokyo detail fetch failed: ${profiles[currentIndex].facultyUrl}`);
        enrichedProfiles[currentIndex] = parseDetailPage("", profiles[currentIndex]);
      }

      if ((currentIndex + 1) % 100 === 0) console.log(`UTokyo detail pages: ${currentIndex + 1}/${profiles.length}`);
    }
  }

  await Promise.all(Array.from({ length: detailConcurrency }, () => worker()));
  return enrichedProfiles;
}

const existingProfiles = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const preservedProfiles = existingProfiles.filter((profile) => profile.university !== "University of Tokyo");
const listProfiles = await fetchListProfiles();
const uniqueListProfiles = Array.from(new Map(listProfiles.map((profile) => [profile.facultyUrl, profile])).values());

console.log(`Found ${uniqueListProfiles.length} UTokyo Professor profiles. Fetching details...`);
const utokyoProfiles = await enrichProfiles(uniqueListProfiles);
const nextProfiles = [...preservedProfiles, ...utokyoProfiles].sort((a, b) =>
  `${a.university} ${a.professorName}`.localeCompare(`${b.university} ${b.professorName}`)
);

fs.writeFileSync(outputPath, `${JSON.stringify(nextProfiles, null, 2)}\n`, "utf8");
console.log(`Imported ${utokyoProfiles.length} University of Tokyo professor profiles to ${outputPath}. Total: ${nextProfiles.length}.`);
