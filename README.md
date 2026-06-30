# 牛马检测器 · Job Beast Test

> 隐私优先、娱乐向的岗位含金量评级实验项目。
>
> 通过收入、时间、边界、成长、稳定、自由和福利七个维度，给一份岗位生成一个娱乐向的含金量评级——从 Shareholder、Enjoyer，一直到 Volunteer 和 Loser。
>
> 所有岗位输入默认在浏览器本地计算，服务器只接收最终评级（可选）。

## 特性

- **本地优先**：岗位输入、分数、维度明细全部在浏览器内计算，不上传原始答案
- **隐私优先**：服务器只接收最终评级（如用户同意），不收集金额、公司、IP、设备标识
- **零运行时框架**：Vite + Preact + 原生 CSS，无 UI 库依赖
- **独立统计 API**：Node 原生 `http`，无 Next.js / Express，无需编译
- **可分享**：结果页可生成分享图片（含二维码）和分享链接

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vite 6 · Preact 10 · TypeScript 5 · 原生 CSS |
| 测试 | Vitest 3 · happy-dom |
| 统计 API | Node 原生 `http`（`api/server.js`，端口 6670） |
| 进程管理 | PM2（`ecosystem.config.cjs`） |
| 反向代理 | Nginx（`beex-work.conf`） |

## 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装

```bash
npm install
```

### 开发

启动前端 dev server（默认 http://127.0.0.1:5173）：

```bash
npm run dev
```

启动统计 API（默认 http://127.0.0.1:6670，前端 dev 会自动反代 `/api`）：

```bash
npm run api
```

两者同时跑起来后，访问 http://127.0.0.1:5173 即可。

### 测试

```bash
npm test          # 单次运行
npm run test:watch
npm run typecheck # 类型检查
```

浏览器内测试页：dev 模式访问 `/tests`（生产构建 `IS_DEV=false`，该页返回 404）。

## 构建

```bash
npm run build     # 输出到 dist/
npm run preview   # 本地预览构建产物
```

## 项目结构

```
.
├── api/server.js              # 独立统计 API（POST /api/ratings/first, GET /api/ratings/summary）
├── src/
│   ├── main.tsx               # 入口
│   ├── app/                   # 路由、App 容器
│   ├── pages/                 # 首页 / 鉴定 / 结果 / 分布 / 关于 / 隐私 / 测试
│   ├── components/            # AppHeader、ScoreBars、RiskCard、ConsentSheet 等
│   ├── core/                  # 评分核心（types/score/rating/explain/modifiers/score-config）
│   ├── data/                  # 字段定义、文案、评级文案、主题
│   ├── infra/                 # 存储、分享码、评级提交客户端、统计仓储
│   ├── lib/                   # 站点常量、空输入、浏览器内测试
│   └── styles/                # 原生 CSS（tokens/themes/controls/pages/base）
├── public/                    # favicon、logo、robots
├── beex-work.conf.example     # Nginx 配置模板
└── ecosystem.config.cjs.example  # PM2 配置模板
```

## 评分模型

七个维度按固定权重加权（`src/core/score-config.ts`）：

| 维度 | 权重 | 说明 |
|---|---|---|
| reward | 30% | 现金达标 50% + 时薪 35% + 确定性 15% |
| time | 18% | 日负荷惩罚 + 加班天惩罚 + 周末惩罚 - 年假加成 |
| boundary | 14% | 职责清晰度、下班联系、紧急任务、请假难度 |
| growth | 12% | 可迁移技能、反馈质量、晋升清晰度、履历价值 |
| stability | 10% | 发薪准时、合同清晰、业务前景、团队稳定 |
| freedom | 8% | 时间、方法、远程、决策自主度 |
| benefit | 8% | 五险一金、补贴、加班补偿等福利项 |

高风险项（欠薪、极端工时、无书面合同）会触发 `RISK_CAPS` 硬性封顶。

最终评级（Shareholder / Enjoyer / Offer / Worker / Beast of Burden / Joker / Volunteer / Loser）由总分阈值决定，详见 `src/core/rating.ts`。

## 部署

本项目模板已去除所有硬编码的域名、服务器路径、SSL 证书路径。

### 1. 构建前端

```bash
VITE_SITE_URL=https://你的域名 \
VITE_REPO_URL=https://github.com/你的用户名/你的仓库名 \
npm run build
```

- `VITE_SITE_URL`：站点 canonical origin，用于分享链接
- `VITE_REPO_URL`：页脚 GitHub 链接指向的仓库地址

不设时分别回退为空字符串和占位符 `https://github.com/your-name/your-repo`。

### 2. 配置 Nginx

```bash
cp beex-work.conf.example beex-work.conf
# 编辑 beex-work.conf，替换 <YOUR_DOMAIN>、<PATH_TO_...>、<API_PORT> 等占位符
```

### 3. 配置 PM2

```bash
cp ecosystem.config.cjs.example ecosystem.config.cjs
# 编辑 ecosystem.config.cjs，替换 <PATH_TO_APP_ROOT>、<API_PORT>
pm2 start ecosystem.config.cjs
```

### 4. 部署静态资源

将 `dist/` 内容放到 Nginx 配置中 `root` 指向的目录，Nginx 会直接提供静态资源并把 `/api/*` 反代到 Node API。

> `beex-work.conf` 和 `ecosystem.config.cjs` 已被 `.gitignore` 排除，不会进入版本库。公开仓库只会看到 `.example` 模板。

## 隐私设计

- 岗位输入（薪资、工时、答案）只在本机计算，绝不离开浏览器
- 分享链接只编码评级结果和分数，不包含原始输入
- 统计 API 请求体只允许 `{ rating }` 一个字段，服务端会拒绝任何附带 score/维度/金额/答案/IP/设备标识的请求
- 防重提交靠前端 localStorage 标记 + 会话级内存锁，服务端不记录浏览器身份
- 完整说明见 `/privacy` 页面

## 开源协议

[MIT License](LICENSE) © 2026 BeeX Labs
