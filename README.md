# AI 日本留学院校推荐助手

一个用于简历和作品集展示的 Next.js MVP。用户填写本科院校背景、研究方向、GPA、语言成绩和申请偏好后，系统会基于本地研究科/方向 JSON 数据与规则算法，生成「冲刺 / 匹配 / 相对稳妥」三档日本大学院推荐结果。

## 技术栈

- Next.js + TypeScript
- Tailwind CSS
- 本地 JSON 院校数据
- 规则推荐逻辑模拟 AI 推荐

## 本地运行

```bash
pnpm install
pnpm run dev
```

打开浏览器访问：

```bash
http://localhost:3000
```

## 项目结构

```text
app/
  page.tsx              首页
  recommend/page.tsx    信息输入页
  result/page.tsx       推荐结果页
components/
  Disclaimer.tsx        页面底部免责声明
  SiteShell.tsx         页面公共外壳
data/
  chinaUniversities.json 本地中国本科院校识别数据库
  facultyProfiles.json   本地教授/研究者资料库
  programs.json         本地研究科/专业方向数据库
  researchSynonyms.json 本地研究方向词典
lib/
  facultyMatching.ts     教授/研究室匹配逻辑
  recommendation.ts     推荐算法与报告生成逻辑
scripts/
  fillAdmissionInfo.mjs  批量维护院校募集要项字段的脚本
  expandProgramCoverage.mjs 批量扩展院校/研究科/方向覆盖的脚本
  importChinaUniversities.mjs 从公开高校名单页面生成本科院校识别库的脚本
  addBroadJapanProgramCoverage.mjs 扩展日本院校基础覆盖的脚本
  importUTokyoFaculty.mjs 从东京大学官方 Faculty Search 生成正教授资料的脚本
  importKyotoFaculty.mjs 从京都大学官方 Activity Database on Education and Research 生成正教授资料的脚本
  importWasedaFaculty.mjs 从早稻田官方研究者数据库生成教授资料库的脚本
types/
  recommendation.ts     推荐相关 TypeScript 类型
```

## 如何修改项目数据库

项目数据在 `data/programs.json`。每条数据代表一个「大学 + 研究科 + 专业方向」组合，包含：

- `universityName`：大学名称
- `graduateSchool`：研究科名称
- `programName`：项目或专业方向名称
- `region`：地区，可用 `东京`、`关西`、`其他`
- `rankTier`：院校基础层级，主要用于维护项目难度和展示，不直接作为录取匹配高分项
- `fieldCategory`：方向大类
- `researchFields`：页面展示用研究方向
- `keywords`：算法匹配用关键词
- `degreeOptions`：适配学位
- `englishRequirement`：英语要求说明
- `japaneseRequirement`：日语要求说明
- `difficulty`：申请难度，建议 60-100
- `notes`：项目备注
- `admissionInfo`：可选字段，用来记录官方募集要项信息，包括官网链接、申请时间、选拔方式、常见材料、语言提示、资格提示、核验日期和核验状态

添加新项目时，复制一段对象并修改字段即可。推荐算法会自动读取 JSON 并参与排序。

当前数据库包含 271 个项目方向，覆盖 65 所日本大学。除旧帝大、早稻田、庆应、Institute of Science Tokyo 外，还加入了筑波、神户、横国、东京都立、千叶、广岛、东京理科大、MARCH、关关同立、地方国公立和理工类私立等基础覆盖条目。

其中前期深度维护过的重点项目带有 `admissionInfo`，会显示官方募集要项参考；新增的广覆盖条目暂时只作为候选池和难度梯度使用，结果页会显示“募集要项待逐项核验”。后续应优先给高频推荐学校补充官方募集要项、导师列表和研究科页面。

后续扩展时，可以先从研究科官网找到最新募集要项页面，再把信息补进对应项目的 `admissionInfo`。如果需要批量重写这些字段，可以参考 `scripts/fillAdmissionInfo.mjs`；如果要继续批量增加院校项目，可以参考 `scripts/expandProgramCoverage.mjs`。

## 中国本科院校识别

`data/chinaUniversities.json` 当前包含 1289 所中国本科院校，用于在信息输入页根据“本科院校名称”自动识别院校层次。识别结果会自动同步到“本科院校层次”，并继续参与推荐算法中的“本科背景”评分。

当前识别规则包括：

- C9 / 顶尖 985
- 985
- 211
- 普通一本 / 普通本科
- 民办 / 独立学院

如果没有识别到学校，页面会保留手动选择入口。专科/高职名单还没有批量导入，后续可以用同样的数据结构补充。

## 教授/研究室匹配

`data/facultyProfiles.json` 当前包含 2905 条教授/研究者资料，其中包括早稻田大学官方 Researchers Database 抓取的 2244 条资料、东京大学官方 Faculty Search 抓取的 566 位正教授资料，以及京都大学官方 Activity Database on Education and Research 抓取的 95 位正教授资料。推荐结果中如果出现已接入教授库的学校，系统会基于用户研究方向、项目关键词和教授公开研究内容，只展示正教授层面的潜在导师/研究室，避免把副教授、助教或研究员误当作独立研究室推荐。

早稻田脚本会抓取研究者列表页和详情页，合并研究领域、研究兴趣、近期论文/项目标题、研究者主页和实验室主页等公开信息。东京大学脚本会抓取正教授的 Specialty、Research theme(s)、Keywords related to research themes、所属组织和个人页面链接。京都大学脚本会从新版官方数据库逐页筛选职位严格等于 Professor 的资料，并补充 Research Topics / Research Interests 等公开研究内容。当前版本仍然不会判断教授当年是否招生、是否接受外国学生或是否适合直接套磁，这些信息需要继续结合实验室主页、募集要项、入试说明和导师个人页面逐项核验。

## 推荐逻辑说明

当前版本不调用真实大模型 API，而是用规则模拟「AI 咨询结果」：

1. 解析 GPA，兼容 4.0 制和百分制。
2. 根据 IELTS / TOEFL / TOEIC 文本估算英语分。
3. 根据 JLPT N1 / N2 / N3 / 无估算日语分。
4. 根据本科院校层次估算背景竞争力。
5. 使用 `data/researchSynonyms.json` 扩展研究方向同义词，例如「图像拼接融合」会扩展到计算机视觉、图像处理、人工智能等关键词。
6. 匹配用户填写的目标研究方向与项目 `researchFields` / `keywords`。
7. 使用固定权重计算综合分：研究课题匹配 25%、教授/实验室匹配 20%、申请难度匹配 12%、GPA 10%、本科专业及院校背景 8%、英语 8%、日语 5%、研究经历 7%、地区偏好 3%、学位及资格 2%。
8. 语言成绩按“是否达到项目门槛 + 超过门槛后的少量竞争力加分”处理，不做简单线性加分。
9. 输出冲刺、匹配、相对稳妥三档推荐，并生成自然语言理由和提升建议。

核心代码在 `lib/recommendation.ts`。

## 后续如何接入真实大模型 API

可以保留现有规则算法作为「第一轮候选召回」，再把候选项目和用户画像发送给大模型生成更自然的咨询报告。

建议步骤：

1. 新增服务端接口，例如 `app/api/recommend/route.ts`。
2. 前端表单提交到该接口，而不是直接在浏览器里调用 `generateRecommendations`。
3. 接口中先运行本地规则算法，选出候选项目。
4. 将用户背景、候选项目、免责声明和输出格式要求发送给大模型。
5. 让大模型返回结构化 JSON，前端仍复用当前结果页组件展示。
6. 把 API Key 放在 `.env.local`，不要写进前端代码或提交到仓库。

这样做的好处是：规则算法保证结果可控，大模型负责语言表达、个性化建议和咨询感。
