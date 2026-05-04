# speccode 需求文档 V1.0

> 基于 Grill-me 共识驱动，增量确认后生成。最后更新：2026-05-04。
> 
> **实现状态**: 核心框架已完成（TypeScript 0 错误，24 测试通过）。Next.js 14 + pi-agent-core 0.72.1 + SQLite。

---

## 1. 产品概述

### 1.1 产品定位

speccode 是一款以**需求文档为唯一开发入口**的智能编程工具。用户编写 Markdown 需求文档，Agent 自动完成项目代码生成与版本迭代。

核心价值：将"代码开发"转变为"需求文档开发"，实现开发过程的自动化与版本化。

### 1.2 V1 功能边界

V1 仅包含三项核心功能：

1. **Grill-me 需求确认** — 递进式对话辅助用户澄清并结构化需求
2. **Agent 代码生成** — 基于确认的需求文档自动生成完整项目代码
3. **版本迭代管理** — 需求版本与代码版本强绑定，支持增量更新

---

## 2. 核心功能

### 2.1 Grill-me 需求确认系统

#### 2.1.1 对话引擎

- 基于 `@mariozechner/pi-agent-core` agent loop 驱动
- 递进式确认流程：
  1. 需求意图捕获（What）
  2. 功能边界界定（How）
  3. 技术方案协商（Tech）
  4. 验收标准定义（QC）
- 单用户确认即生效，无多角色审批

#### 2.1.2 确认规则

| 场景 | 规则 |
|------|------|
| 审批 | 单用户确认即生效 |
| 专家介入 | 不支持 |
| 用户-Agent 分歧 | 用户最终决策，Agent 记录风险提示 |
| 响应时间 | 不设硬限制，质量优先 |
| 写入策略 | 每个确认点实时增量写入需求文档 |

#### 2.1.3 对话上下文

- Agent 维护对话树，记录每个需求点的确认路径
- 保留未确认需求节点队列
- 支持在任意确认点回退和重新确认

### 2.2 需求文档管理

#### 2.2.1 文档格式

- **Markdown** 格式，Agent 自动生成和更新
- 状态标识：`draft` → `confirmed` → `done`
- 用户输入初步需求想法，Grill-me 对话中 Agent 逐步构建结构化文档

#### 2.2.2 版本孪生管理

- 需求文档版本与项目代码版本强绑定
- 版本映射：**需求文档版本号 ↔ Git tag ↔ 代码提交哈希**
- 映射信息通过 Git tag 记录，需求文档内 version 号自动同步

### 2.3 Agent 代码生成

#### 2.3.1 生成机制

- 基于 `@mariozechner/pi-agent-core` + `@mariozechner/pi-ai` 驱动 LLM Agent
- Agent 读取需求文档，在用户指定目录生成完整项目代码
- 生成项目技术栈不限，由 Agent 按需求自主选择

#### 2.3.2 代码质量

- 本工具自身代码要求：单元测试覆盖率 ≥ 90%，API 响应 ≤ 500ms，支持 500 并发
- 生成的项目代码不做硬性质量要求

### 2.4 版本迭代

```
用户修改需求文档 → 更新版本号
                 → Agent 创建新 Git 分支
                 → diff 新旧需求文档
                 → 仅修改受影响代码文件
                 → 用户确认后 merge 到主分支
                 → 保留分支
                 → 打 git tag
                 → tag 回写需求文档
```

---

## 3. UI 设计

### 3.1 Web 界面

- 框架：Next.js 单 package
- 布局：**左右分栏**
  - 左侧：Markdown 需求文档编辑器（实时预览）
  - 右侧：Grill-me 对话面板（基于 `@mariozechner/pi-web-ui`）
- 聊天组件：pi-web-ui ChatPanel / AgentInterface
- 文档面板：自建 React Markdown 编辑器 + 渲染组件

### 3.2 不包含的功能

- 实时协同编辑
- 多角色权限管理
- 开发看板可视化

---

## 4. 技术架构

### 4.1 技术栈

| 模块 | 方案 |
|------|------|
| 语言 | TypeScript |
| 全栈框架 | Next.js |
| 数据库 | SQLite |
| Agent 引擎 | `@mariozechner/pi-agent-core` |
| LLM 接口 | `@mariozechner/pi-ai` |
| 聊天 UI | `@mariozechner/pi-web-ui` |
| 样式 | Tailwind CSS |
| 部署 | `bun run dev` / `npm run dev` |

### 4.2 项目结构

```
speccode/
├── .agents/                  # 内置 Agent 资源
│   ├── skills/               # 内置技能
│   │   └── grill-me.md       # 递进式需求确认对话技能
│   ├── tools/                # 内置工具
│   │   └── README.md         # 工具说明
│   └── workflows/            # 内置工作流
│       └── README.md         # 工作流说明
├── src/
│   ├── __tests__/            # 测试
│   │   ├── agent/            # Agent 相关测试
│   │   ├── db/               # 数据库测试
│   │   └── git/              # Git 操作测试
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── agent/execute/route.ts  # 工具执行代理
│   │   │   ├── doc/route.ts            # 需求文档 REST API
│   │   │   └── version/route.ts        # 版本信息 API
│   │   ├── globals.css       # 全局样式
│   │   ├── layout.tsx        # Root Layout
│   │   └── page.tsx          # 主页（左右分栏）
│   ├── components/           # React 组件
│   │   ├── chat/             # pi-web-ui 聊天面板封装
│   │   └── doc/              # 需求文档编辑器
│   ├── lib/                  # 核心逻辑
│   │   ├── agent/            # Agent 编排
│   │   │   ├── create-agent.ts     # Agent 工厂函数
│   │   │   ├── system-prompt.ts    # Grill-me 系统提示词
│   │   │   └── tools/index.ts      # 内置工具定义
│   │   ├── db/               # SQLite 数据层
│   │   │   ├── schema.ts           # 数据模型定义
│   │   │   ├── connection.ts       # 数据库连接管理
│   │   │   ├── requirements-dao.ts # 需求文档 DAO
│   │   │   └── versions-dao.ts     # 版本记录 DAO
│   │   └── git/              # Git 操作封装
│   │       └── git-ops.ts          # branch/diff/merge/tag
├── vitest.config.ts          # 测试配置
├── AGENTS.md                 # 项目规范文档
├── REQUIREMENTS.md           # 本需求文档
└── package.json
```

### 4.3 依赖关系

```
speccode
  ├── @mariozechner/pi-agent-core    (Agent 运行时)
  ├── @mariozechner/pi-ai            (LLM API 统一接口)
  ├── @mariozechner/pi-web-ui        (聊天 UI 组件)
  ├── next                            (全栈框架)
  ├── react / react-dom               (UI 框架)
  ├── tailwindcss                     (样式)
  └── better-sqlite3                  (数据库)
```

---

## 5. 开发流程

### 5.1 用户使用流程

```
用户启动 speccode
  → 输入初步需求想法
  → Grill-me 对话逐步确认需求细节
  → Agent 实时写入需求文档 (draft → confirmed)
  → 确认完成后触发代码生成
  → Agent 在用户指定目录生成项目代码
  → 自动 git init / 打 tag / 版本绑定
  → 用户修改需求文档 → 更新版本号 → 增量迭代
```

### 5.2 状态流转

```
draft → confirmed → done
          ↑
    (用户修改后可能回退)
```

---

## 6. 不包含 (Out of Scope for V1)

- TUI 界面
- 实时协同编辑（OT 算法）
- 多角色审批 & 专家介入
- 开发看板可视化
- 部署管道（Docker/云服务）
- 文档生成器 & 测试矩阵
- 安全合规（RBAC/审计/敏感信息脱敏）
- 为生成项目自动编写测试

---

## 7. 附录：Grill-me 共识记录

| # | 决策点 | 共识 |
|----|--------|------|
| 1 | 产品名 | speccode |
| 2 | V1 功能边界 | 需求确认 + 代码生成 + 版本迭代 |
| 3 | 需求文档格式 | Markdown，Agent 自动生成 |
| 4 | 文档状态流转 | draft → confirmed → done |
| 5 | UI 界面 | 纯 Web，Next.js |
| 6 | 布局 | 左右分栏 |
| 7 | UI 组件 | pi-web-ui 聊天 + 自建文档面板 |
| 8 | 协同编辑 | 不做 |
| 9 | 开发看板 | 不做 |
| 10 | 审批模式 | 单用户确认即生效 |
| 11 | 专家介入 | 不支持 |
| 12 | 分歧处理 | 用户最终决策 |
| 13 | 写入策略 | 实时增量写入 |
| 14 | 响应时间 | 不设硬限制 |
| 15 | 安全合规 | 不做 |
| 16 | 代码生成 | LLM Agent + pi-mono agent loop |
| 17 | 输出位置 | 用户指定目录 |
| 18 | 版本迭代 | Git 分支 → diff → 增量修改 → merge → tag 回写 |
| 19 | 版本映射 | Git tag + 需求文档双向 |
| 20 | 生成项目栈 | 不限 |
| 21 | 语言 | TypeScript |
| 22 | 全栈框架 | Next.js |
| 23 | 数据库 | SQLite |
| 24 | Agent 引擎 | pi-agent-core + pi-ai |
| 25 | 聊天 UI | pi-web-ui |
| 26 | 项目结构 | 单 package |
| 27 | 部署 | bun/npm 本地运行 |
| 28 | 测试指标 | 工具自身：覆盖率 90%, <500ms, 500 并发 |
| 29 | 架构模块 | 砍掉文档生成器/测试矩阵/智能解析/部署管道 |
| 30 | 内置资源目录 | `.agents/{skills,tools,workflows}` |
