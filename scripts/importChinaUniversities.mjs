import fs from "node:fs";

const sourceUrl = "https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E5%88%97%E8%A1%A8";
const outputPath = "data/chinaUniversities.json";

const c9 = new Set(["北京大学", "清华大学", "复旦大学", "上海交通大学", "南京大学", "浙江大学", "中国科学技术大学", "哈尔滨工业大学", "西安交通大学"]);

const project985 = new Set([
  "北京大学",
  "清华大学",
  "中国人民大学",
  "北京航空航天大学",
  "北京理工大学",
  "中国农业大学",
  "北京师范大学",
  "中央民族大学",
  "南开大学",
  "天津大学",
  "大连理工大学",
  "东北大学",
  "吉林大学",
  "哈尔滨工业大学",
  "复旦大学",
  "同济大学",
  "上海交通大学",
  "华东师范大学",
  "南京大学",
  "东南大学",
  "浙江大学",
  "中国科学技术大学",
  "厦门大学",
  "山东大学",
  "中国海洋大学",
  "武汉大学",
  "华中科技大学",
  "湖南大学",
  "中南大学",
  "国防科技大学",
  "中山大学",
  "华南理工大学",
  "四川大学",
  "电子科技大学",
  "重庆大学",
  "西安交通大学",
  "西北工业大学",
  "西北农林科技大学",
  "兰州大学"
]);

const project211 = new Set([
  ...project985,
  "北京交通大学",
  "北京工业大学",
  "北京科技大学",
  "北京化工大学",
  "北京邮电大学",
  "北京林业大学",
  "北京中医药大学",
  "北京外国语大学",
  "中国传媒大学",
  "中央财经大学",
  "对外经济贸易大学",
  "北京体育大学",
  "中央音乐学院",
  "中国政法大学",
  "华北电力大学",
  "天津医科大学",
  "河北工业大学",
  "太原理工大学",
  "内蒙古大学",
  "辽宁大学",
  "大连海事大学",
  "延边大学",
  "东北师范大学",
  "哈尔滨工程大学",
  "东北农业大学",
  "东北林业大学",
  "华东理工大学",
  "东华大学",
  "上海外国语大学",
  "上海财经大学",
  "上海大学",
  "苏州大学",
  "南京航空航天大学",
  "南京理工大学",
  "中国矿业大学",
  "河海大学",
  "江南大学",
  "南京农业大学",
  "中国药科大学",
  "南京师范大学",
  "安徽大学",
  "合肥工业大学",
  "福州大学",
  "南昌大学",
  "中国石油大学（华东）",
  "郑州大学",
  "中国地质大学（武汉）",
  "武汉理工大学",
  "华中农业大学",
  "华中师范大学",
  "中南财经政法大学",
  "湖南师范大学",
  "暨南大学",
  "华南师范大学",
  "海南大学",
  "广西大学",
  "西南交通大学",
  "四川农业大学",
  "西南财经大学",
  "贵州大学",
  "云南大学",
  "西藏大学",
  "西北大学",
  "西安电子科技大学",
  "长安大学",
  "陕西师范大学",
  "青海大学",
  "宁夏大学",
  "新疆大学",
  "石河子大学",
  "第二军医大学",
  "第四军医大学",
  "中国矿业大学（北京）",
  "中国石油大学（北京）",
  "中国地质大学（北京）"
]);

const aliases = {
  北京大学: ["北大", "Peking University", "PKU"],
  清华大学: ["清华", "Tsinghua University", "THU"],
  复旦大学: ["复旦", "Fudan University"],
  上海交通大学: ["上海交大", "上交", "SJTU"],
  浙江大学: ["浙大", "Zhejiang University", "ZJU"],
  南京大学: ["南大", "Nanjing University", "NJU"],
  中国科学技术大学: ["中科大", "USTC"],
  哈尔滨工业大学: ["哈工大", "HIT"],
  西安交通大学: ["西交", "西安交大", "XJTU"],
  同济大学: ["同济", "Tongji University"],
  武汉大学: ["武大", "Wuhan University"],
  华中科技大学: ["华科", "HUST"],
  北京航空航天大学: ["北航", "BUAA"],
  北京理工大学: ["北理", "BIT"],
  天津大学: ["天大", "TJU"],
  南开大学: ["南开", "NKU"],
  吉林大学: ["吉大", "JLU"],
  山东大学: ["山大", "SDU"],
  厦门大学: ["厦大", "XMU"],
  中山大学: ["中大", "SYSU"],
  华南理工大学: ["华工", "SCUT"],
  四川大学: ["川大", "SCU"],
  电子科技大学: ["成电", "UESTC"],
  重庆大学: ["重大", "CQU"],
  西北工业大学: ["西工大", "NPU"],
  中国人民大学: ["人大", "RUC"],
  北京师范大学: ["北师大", "BNU"],
  东南大学: ["东大", "SEU"]
};

function decodeHtml(value) {
  return value
    .replace(/<sup[^>]*>.*?<\/sup>/gis, "")
    .replace(/<style[^>]*>.*?<\/style>/gis, "")
    .replace(/<script[^>]*>.*?<\/script>/gis, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[（）()·\-\s]/g, "")
    .replace(/大学$/, "大学")
    .trim();
}

function inferTier(name, note) {
  if (c9.has(name)) return "C9 / 顶尖985";
  if (project985.has(name)) return "985";
  if (project211.has(name)) return "211";
  if (note.includes("民办")) return "民办 / 独立学院";
  return "普通一本 / 普通本科";
}

const response = await fetch(sourceUrl);
if (!response.ok) {
  throw new Error(`Failed to fetch university list: ${response.status}`);
}

const html = await response.text();
const rows = [...html.matchAll(/<tr[^>]*>(.*?)<\/tr>/gis)];
const universities = [];

for (const row of rows) {
  const cells = [...row[1].matchAll(/<t[dh][^>]*>(.*?)<\/t[dh]>/gis)].map((cell) => decodeHtml(cell[1]));
  if (cells.length < 6) continue;

  const [sequence, name, code, authority, city, level, note = ""] = cells;
  if (!/^\d+$/.test(sequence)) continue;
  if (level !== "本科") continue;
  if (!name || name === "学校名称") continue;

  universities.push({
    name,
    normalizedName: normalizeName(name),
    aliases: aliases[name] ?? [],
    code,
    authority,
    city,
    level,
    note,
    tier: inferTier(name, note),
    tags: [
      ...(c9.has(name) ? ["C9"] : []),
      ...(project985.has(name) ? ["985"] : []),
      ...(project211.has(name) ? ["211"] : []),
      ...(note.includes("民办") ? ["民办"] : [])
    ],
    source: "全国高等学校名单（教育部口径，页面汇总）"
  });
}

if (universities.length < 1000) {
  throw new Error(`Imported only ${universities.length} undergraduate universities; expected a full undergraduate list.`);
}

fs.writeFileSync(outputPath, `${JSON.stringify(universities, null, 2)}\n`, "utf8");
console.log(`Imported ${universities.length} undergraduate universities to ${outputPath}`);
