import fs from "node:fs";

const outputPath = "data/facultyProfiles.json";
const baseUrl = "https://kdb.iimc.kyoto-u.ac.jp";
const resultUrl = `${baseUrl}/search/result.html`;
const lastChecked = "2026-07-10";
const detailConcurrency = 6;
const requestDelayMs = 80;
const retryDelayMs = 500;
const maxPages = Number(process.env.KYOTO_MAX_PAGES ?? 320);
const maxDetailProfiles = Number(process.env.KYOTO_MAX_DETAIL_PROFILES ?? 0);

function decodeHtml(value) {
  return value
    .replace(/<script[^>]*>.*?<\/script>/gis, "")
    .replace(/<style[^>]*>.*?<\/style>/gis, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function toAbsoluteUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return new URL(path, `${baseUrl}/search/`).toString();
}

function normalizeKeywords(text) {
  return Array.from(
    new Set(
      decodeHtml(text)
        .split(/\s*\|\s*|,|;|\/|、|。|・|\n/)
        .map((keyword) => keyword.replace(/^Research Topics\s*/i, "").replace(/^Research Interests\s*/i, "").trim())
        .filter((keyword) => keyword.length > 2)
        .filter((keyword) => !/^\d+$/.test(keyword))
    )
  ).slice(0, 48);
}

function inferFieldCategory(text) {
  const lowerText = text.toLowerCase();

  if (/architecture|civil|seismic|earthquake|concrete|urban|infrastructure|disaster|structural/.test(lowerText)) {
    return "工学/建筑土木";
  }
  if (/\b(computer|informatics|algorithm|software|database|network|image|vision)\b|artificial intelligence|machine learning|data science/.test(lowerText)) {
    return "信息/AI";
  }
  if (/\b(robot|control|mechatronics|mechanic|manufacturing|electrical|electronics|automation)\b/.test(lowerText)) {
    return "机器人/控制";
  }
  if (/material|metal|alloy|chemistry|polymer|nano|semiconductor|crystal|microscopy|composite/.test(lowerText)) {
    return "材料/化学";
  }
  if (/biology|life|medical|medicine|genome|neuroscience|health|agricultural|food|pharma/.test(lowerText)) {
    return "生命/医工";
  }
  if (/humanities|social sciences|philosophy|ethics|economics|management|finance|policy|law|politic|sociology|education|business/.test(lowerText)) {
    return "商科社科";
  }
  if (/\b(environment|energy|climate|sustainable|ocean|atmosphere|ecology|carbon)\b/.test(lowerText)) {
    return "能源环境";
  }

  return "其他";
}

function buildSearchUrl(page = 1) {
  const params = new URLSearchParams({
    lang: "en",
    name: "",
    ps: "Professor",
    affiliation2: ""
  });
  if (page > 1) params.set("page", String(page));
  return `${resultUrl}?${params.toString()}`;
}

function extractTableRows(html) {
  const bodyMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
  if (!bodyMatch) return [];
  return bodyMatch[1].match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
}

function extractCells(rowHtml) {
  return Array.from(rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map((match) => match[1]);
}

function parseListPage(html) {
  return extractTableRows(html)
    .map((rowHtml) => {
      const cells = extractCells(rowHtml);
      if (cells.length < 4) return null;

      const profileMatch = cells[1].match(/href="([^"]*profile\/[^"]+)"/i);
      const professorName = decodeHtml(cells[1]);
      const department = decodeHtml(cells[2]);
      const title = decodeHtml(cells[3]);
      const researchText = decodeHtml(cells[4] ?? "");

      if (!profileMatch || !professorName || title !== "Professor") return null;

      return {
        university: "Kyoto University",
        sourceAffiliation: department,
        graduateSchoolHints: department ? [department] : [],
        department,
        professorName,
        title,
        labName: "",
        researchKeywords: normalizeKeywords(researchText),
        researchSummary: researchText.slice(0, 3200),
        facultyUrl: toAbsoluteUrl(profileMatch[1]),
        labUrl: "",
        sourceUrl: toAbsoluteUrl(profileMatch[1]),
        sourceDatabase: "Kyoto University Activity Database on Education and Research",
        fieldCategory: inferFieldCategory(`${department} ${researchText}`),
        lastChecked
      };
    })
    .filter(Boolean);
}

function extractResultCount(html) {
  const match = html.match(/1\s*-\s*\d+\s*out of\s*([\d,]+)\s*results/i);
  return match ? Number(match[1].replace(/,/g, "")) : 0;
}

function extractNextPageUrl(html) {
  const match = html.match(/<a[^>]+class="[^"]*\bnext\b[^"]*"[^>]+href="([^"]+)"/i);
  return match ? toAbsoluteUrl(match[1].replace(/&amp;/g, "&")) : "";
}

function getTableValue(html, label) {
  const pattern = new RegExp(`<th[^>]*>\\s*${label}\\s*<\\/th>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`, "i");
  return decodeHtml(html.match(pattern)?.[1] ?? "");
}

function extractAfterLabel(text, label, nextLabels) {
  const start = text.indexOf(label);
  if (start === -1) return "";

  const afterLabel = start + label.length;
  const nextIndexes = nextLabels
    .map((nextLabel) => text.indexOf(nextLabel, afterLabel))
    .filter((index) => index > afterLabel);
  const end = nextIndexes.length > 0 ? Math.min(...nextIndexes) : afterLabel + 900;

  return text.slice(afterLabel, end).replace(/\s+/g, " ").trim();
}

function extractProfileSections(html) {
  const text = decodeHtml(html);
  const interests = getTableValue(html, "Research Interests") || getTableValue(html, "Research Areas");
  const keywords = getTableValue(html, "Keywords");
  const labeledResearch = [
    extractAfterLabel(text, "Main Research Interests:", ["Awards:", "ID,URL", "Research History", "list Last Updated"]),
    extractAfterLabel(text, "Research Topics", ["Overview of the research", "Research Interests", "Research Areas", "Published Papers"]),
    extractAfterLabel(text, "Overview of the research", ["Research Interests", "Research Areas", "Published Papers", "Books and Other Publications"]),
    extractAfterLabel(text, "Research Interests", ["Research Areas", "Published Papers", "Books and Other Publications", "Misc"])
  ].filter(Boolean);
  const papers = Array.from(html.matchAll(/<p[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/p>/gi))
    .map((match) => decodeHtml(match[1]))
    .filter((title) => title.length > 8)
    .slice(0, 24);
  const homepageMatch = html.match(/href="([^"]+)"[^>]*>\s*(?:Website|Homepage|URL|Researchmap)/i);
  const summaryParts = [interests, keywords, ...labeledResearch, ...papers].filter(Boolean);

  return {
    labUrl: homepageMatch ? toAbsoluteUrl(homepageMatch[1]) : "",
    keywords: normalizeKeywords([interests, keywords, ...labeledResearch].filter(Boolean).join("; ")),
    summary: summaryParts.length > 0 ? summaryParts.join("; ").slice(0, 3600) : text.slice(0, 1800)
  };
}

async function fetchText(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.text();

      if (attempt === retries) throw new Error(`Fetch failed ${response.status}: ${url}`);
    } catch (error) {
      if (attempt === retries) throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, retryDelayMs * attempt));
  }

  return "";
}

async function fetchListProfiles() {
  const profiles = [];
  let pageUrl = buildSearchUrl();
  let expectedResults = 0;

  for (let page = 1; page <= maxPages && pageUrl; page += 1) {
    const html = await fetchText(pageUrl);
    if (page === 1) expectedResults = extractResultCount(html);

    const pageProfiles = parseListPage(html);
    profiles.push(...pageProfiles);
    console.log(`Kyoto list page ${page}: ${pageProfiles.length} exact Professor profiles, total ${profiles.length}`);

    pageUrl = extractNextPageUrl(html);
    await new Promise((resolve) => setTimeout(resolve, requestDelayMs));

    if (expectedResults > 0 && profiles.length >= expectedResults) break;
  }

  return profiles;
}

async function enrichProfiles(profiles) {
  const targetProfiles = maxDetailProfiles > 0 ? profiles.slice(0, maxDetailProfiles) : profiles;
  const enrichedProfiles = new Array(targetProfiles.length);
  let nextIndex = 0;

  async function worker(workerIndex) {
    while (nextIndex < targetProfiles.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      const profile = targetProfiles[currentIndex];

      try {
        const html = await fetchText(profile.facultyUrl);
        const detail = extractProfileSections(html);
        const mergedKeywords = Array.from(new Set([...profile.researchKeywords, ...detail.keywords]));
        const researchSummary = [profile.researchSummary, detail.summary].filter(Boolean).join("; ").slice(0, 3600);

        enrichedProfiles[currentIndex] = {
          ...profile,
          researchKeywords: mergedKeywords.slice(0, 56),
          researchSummary,
          labUrl: detail.labUrl || profile.labUrl,
          fieldCategory: inferFieldCategory(`${profile.department} ${researchSummary} ${mergedKeywords.join(" ")}`)
        };
      } catch (error) {
        console.warn(`Kyoto detail fetch failed: ${profile.facultyUrl}`);
        enrichedProfiles[currentIndex] = profile;
      }

      if ((currentIndex + 1) % 100 === 0) console.log(`Kyoto detail pages: ${currentIndex + 1}/${targetProfiles.length}`);
      await new Promise((resolve) => setTimeout(resolve, requestDelayMs + workerIndex * 10));
    }
  }

  await Promise.all(Array.from({ length: detailConcurrency }, (_, index) => worker(index)));
  return enrichedProfiles;
}

const existingProfiles = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const preservedProfiles = existingProfiles.filter((profile) => profile.university !== "Kyoto University");
const listProfiles = await fetchListProfiles();
const uniqueListProfiles = Array.from(new Map(listProfiles.map((profile) => [profile.facultyUrl, profile])).values());

console.log(`Found ${uniqueListProfiles.length} Kyoto University exact Professor profiles. Fetching details...`);
const kyotoProfiles = await enrichProfiles(uniqueListProfiles);
const nextProfiles = [...preservedProfiles, ...kyotoProfiles].sort((a, b) =>
  `${a.university} ${a.professorName}`.localeCompare(`${b.university} ${b.professorName}`)
);

fs.writeFileSync(outputPath, `${JSON.stringify(nextProfiles, null, 2)}\n`, "utf8");
console.log(`Imported ${kyotoProfiles.length} Kyoto University professor profiles to ${outputPath}. Total: ${nextProfiles.length}.`);
