# AGENTS.md — speccode 项目规范

本文件帮助 AI Agent 快速理解项目功能、架构、规范和开发约定。

## 项目概述

speccode 是一款**需求驱动开发工具**。用户编写 Markdown 需求文档，Agent 自动完成项目代码生成与版本迭代。

- 完整需求文档：`REQUIREMENTS.md`
- V1 功能边界：需求确认 + Agent 代码生成 + 版本迭代

## 技术栈

| 项 | 选择 |
|----|------|
| 语言 | TypeScript |
| 全栈框架 | Next.js (App Router) |
| 数据库 | SQLite (better-sqlite3) |
| Agent 引擎 | `@mariozechner/pi-agent-core` |
| LLM 接口 | `@mariozechner/pi-ai` |
| 聊天 UI | `@mariozechner/pi-web-ui` |
| 样式 | Tailwind CSS |
| 运行 | `bun run dev` / `npm run dev` |

## 项目结构

```
speccode/
├── .agents/                  # 内置 Agent 资源（skill、tool、workflow、todo）
│   ├── skills/               # Agent 内置技能定义
│   ├── tools/                # Agent 内置工具定义
│   ├── workflows/            # Agent 工作流定义
│   └── todo/                 # 待完善工作清单
├── src/                      # 源代码
│   ├── app/                  # Next.js App Router（页面 + API Routes）
│   ├── components/           # React 组件
│   │   ├── chat/             # pi-web-ui 聊天面板封装
│   │   └── doc/              # 需求文档编辑器
│   ├── lib/                  # 核心业务逻辑
│   │   ├── agent/            # Agent 编排（pi-agent-core 封装）
│   │   ├── db/               # SQLite 数据访问层
│   │   └── git/              # Git 操作封装
│   └── api/                  # API Route Handlers
├── REQUIREMENTS.md           # 需求文档（开发唯一入口）
├── AGENTS.md                 # 本文件
└── package.json
```

## 核心概念

### 需求文档驱动

用户不直接写代码，而是编写 `REQUIREMENTS.md` 描述需求。Agent 根据需求文档生成代码。

### Grill-me 对话

基于 pi-agent-core agent loop 的递进式确认对话。Agent 通过提问帮助用户澄清需求，每个确认点实时写入需求文档。

### 版本孪生

需求文档版本号 ↔ Git tag ↔ 代码提交哈希，三者绑定。修改需求文档 → 新版本号 → Agent 创建 Git 分支增量修改代码 → 用户确认 merge → tag 回写。

## 工作流规范

Agent 在收到以下类型的用户请求时，必须先加载对应的工作流文件，并严格遵循其中定义的步骤顺序和规则：

| 用户意图 | 加载工作流 | 文件路径 |
|----------|-----------|----------|
| 新增功能、实现需求、扩展模块 | feature-develop | `.agents/workflows/feature-develop.md` |
| 调试 bug、定位报错、排查异常 | feature-debug | `.agents/workflows/feature-debug.md` |
| 编写测试、运行测试、覆盖率 | feature-test | `.agents/workflows/feature-test.md` |
| 任何功能变更完成后 | documents-update | `.agents/workflows/documents-update.md` |

每个工作流文件包含：适用场景、标准化步骤、自检清单、交付标准。

## 关键依赖

```json
{
  "@mariozechner/pi-agent-core": "Agent 运行时，提供事件驱动的对话 + 工具调用能力",
  "@mariozechner/pi-ai": "统一 LLM API 接口（OpenAI / Anthropic / 等）",
  "@mariozechner/pi-web-ui": "聊天 UI 组件（ChatPanel / AgentInterface / 模型选择器等）"
}
```

- `pi-agent-core` 文档：https://github.com/badlogic/pi-mono/blob/main/packages/agent/README.md
- `pi-web-ui` 文档：https://github.com/badlogic/pi-mono/blob/main/packages/web-ui/README.md
- pi-mono 主仓库：https://github.com/badlogic/pi-mono

### Agent 核心 API 速查

```typescript
import { Agent } from '@mariozechner/pi-agent-core';
import { getModel } from '@mariozechner/pi-ai';

const agent = new Agent({
  initialState: {
    systemPrompt: '...',
    model: getModel('anthropic', 'claude-sonnet-4-20250514'),
    tools: [],
    messages: [],
  },
  convertToLlm: (msgs) => msgs.filter(...),
});

// 事件订阅
agent.subscribe((event) => { /* agent_start, message_update, tool_execution_*, agent_end */ });

// 发送消息
await agent.prompt('Hello');

// 状态操作
agent.state.tools = [...];
agent.state.systemPrompt = '...';
agent.abort();
await agent.waitForIdle();
```

### Web UI 组件速查

```typescript
import { ChatPanel, AgentInterface, AppStorage } from '@mariozechner/pi-web-ui';
import '@mariozechner/pi-web-ui/app.css';

// 初始化存储
const chatPanel = new ChatPanel();
await chatPanel.setAgent(agent, { onApiKeyRequired: ... });
document.body.appendChild(chatPanel);
```

## 开发规范

### 代码风格

- TypeScript strict 模式
- React 函数组件 + Hooks
- Next.js App Router 约定（`page.tsx`、`layout.tsx`、`route.ts`）
- Tailwind CSS 工具类优先

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件 | kebab-case | `doc-editor.tsx` |
| 组件 | PascalCase | `DocEditor` |
| 函数/变量 | camelCase | `parseRequirements` |
| API 路由 | 目录 + route.ts | `src/app/api/agent/route.ts` |

### 数据库

- SQLite 通过 `better-sqlite3` 同步访问
- 数据模型定义在 `src/lib/db/schema.ts`
- 不要在 API Routes 中使用重量 ORM

### Git 操作

- 通过 `src/lib/git/` 封装 simple-git 或 nodegit
- 版本迭代的完整流程见 REQUIREMENTS.md §2.4

## .agents 目录

`.agents/` 存放 speccode Agent 的内置资源，是 Agent 能力扩展的核心目录：

- `skills/` — Agent 内置技能。每个技能一个文件，定义 Agent 可执行的特定任务：
  - `grill-me.md` — 递进式需求确认对话技能
- `tools/` — Agent 内置工具。Agent 可调用的工具函数定义（对应 pi-agent-core 的 `AgentTool`）：
  - `read_requirements` — 读取需求文档
  - `update_requirements` — 增量写入需求点
  - `generate_code` — 触发代码生成
  - `version_control` — Git 版本管理
- `workflows/` — Agent 工作流。定义多步骤编排流程：
  - `feature-develop.md` — 新增功能、实现需求的标准流程
  - `feature-debug.md` — 缺陷定位与修复的系统化流程
  - `feature-test.md` — 测试规范、覆盖率要求与 mock 策略
  - `documents-update.md` — 文档同步更新规则（REQUIREMENTS.md / AGENTS.md / todo/）
- `todo/` — 待完善工作清单。每个 todo 一个 Markdown 文件，描述待解决的问题和方案。

开发新能力时，优先考虑写入 `.agents/` 而非硬编码到 `src/lib/agent/`。

## 命令

```bash
# 开发
bun run dev          # 启动 Next.js 开发服务器

# 质量检查
bun run typecheck    # tsc --noEmit
bun run test         # Vitest (24 tests)

# 构建
bun run build        # next build
bun start            # 生产启动
```

## 参考文档

- 完整需求规格：`REQUIREMENTS.md`
- Agent 内置资源：`.agents/skills/`、`.agents/tools/`、`.agents/workflows/`
- pi-agent-core 完整 API：https://github.com/badlogic/pi-mono/blob/main/packages/agent/README.md
- pi-web-ui 完整 API：https://github.com/badlogic/pi-mono/blob/main/packages/web-ui/README.md
