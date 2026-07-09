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
  programs.json         本地研究科/专业方向数据库
lib/
  recommendation.ts     推荐算法与报告生成逻辑
types/
  recommendation.ts     推荐相关 TypeScript 类型
```

## 如何修改项目数据库

项目数据在 `data/programs.json`。每条数据代表一个「大学 + 研究科 + 专业方向」组合，包含：

- `universityName`：大学名称
- `graduateSchool`：研究科名称
- `programName`：项目或专业方向名称
- `region`：地区，可用 `东京`、`关西`、`其他`
- `rankTier`：排名层级，数字越小代表声誉越高
- `fieldCategory`：方向大类
- `researchFields`：页面展示用研究方向
- `keywords`：算法匹配用关键词
- `degreeOptions`：适配学位
- `englishRequirement`：英语要求说明
- `japaneseRequirement`：日语要求说明
- `difficulty`：申请难度，建议 60-100
- `notes`：项目备注

添加新项目时，复制一段对象并修改字段即可。推荐算法会自动读取 JSON 并参与排序。

## 推荐逻辑说明

当前版本不调用真实大模型 API，而是用规则模拟「AI 咨询结果」：

1. 解析 GPA，兼容 4.0 制和百分制。
2. 根据 IELTS / TOEFL / TOEIC 文本估算英语分。
3. 根据 JLPT N1 / N2 / N3 / 无估算日语分。
4. 根据本科院校层次估算背景竞争力。
5. 匹配用户填写的目标研究方向与项目 `researchFields` / `keywords`。
6. 加入地区偏好、排名偏好、目标学位和项目难度。
7. 输出冲刺、匹配、相对稳妥三档推荐，并生成自然语言理由和提升建议。

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
