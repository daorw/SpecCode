# speccode

以**需求文档为唯一开发入口**的智能编程工具。用户编写 Markdown 需求文档，Agent 自动完成项目代码生成与版本迭代。

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 或
bun run dev

# 运行测试
npm run test

# 类型检查
npm run typecheck
```

浏览器打开 `http://localhost:3000`，左侧编写需求文档，右侧通过 Grill-me 对话与 Agent 确认需求。

---

## V1 功能

| 功能 | 说明 |
|------|------|
| **Grill-me 需求确认** | 递进式对话辅助用户澄清并结构化需求，实时写入 Markdown 需求文档 |
| **Agent 代码生成** | 基于确认的需求文档，LLM Agent 自动在指定目录生成完整项目代码 |
| **版本迭代管理** | 需求版本与代码版本强绑定（Git tag ↔ 需求文档版本号），支持增量更新 |

---

## 架构

```
浏览器 (Next.js)
  ├── 左侧: Markdown 需求文档编辑器
  └── 右侧: pi-web-ui 聊天面板 (Agent 对话)

服务端 (Next.js API Routes)
  ├── /api/doc             需求文档 CRUD
  ├── /api/version          版本记录管理
  └── /api/agent/execute    工具执行代理

核心引擎
  ├── pi-agent-core         Agent 运行时 (事件驱动 + 工具调用)
  ├── pi-ai                 统一 LLM API (Anthropic / OpenAI / 等)
  └── pi-web-ui             聊天 UI 组件 (ChatPanel / AgentInterface)

存储
  └── SQLite (better-sqlite3)  需求文档 + 版本映射持久化
```

---

## 技术栈

| 层 | 技术 |
|----|------|
| 语言 | TypeScript (strict) |
| 全栈框架 | Next.js 14 (App Router) |
| 数据库 | SQLite (better-sqlite3) |
| Agent 引擎 | `@mariozechner/pi-agent-core` |
| LLM 接口 | `@mariozechner/pi-ai` |
| 聊天 UI | `@mariozechner/pi-web-ui` |
| 样式 | Tailwind CSS |
| 测试 | Vitest |
| Git | simple-git |

---

## 项目结构

```
speccode/
├── .agents/                  # Agent 内置资源
│   ├── skills/               #   内置技能 (grill-me)
│   ├── tools/                #   内置工具定义
│   ├── workflows/            #   工作流 (develop/debug/test/docs)
│   └── todo/                 #   待完善清单
├── src/
│   ├── __tests__/            # 测试 (24 tests)
│   ├── app/
│   │   ├── api/              #   API Routes
│   │   ├── layout.tsx        #   Root Layout
│   │   ├── page.tsx          #   主页 (左右分栏)
│   │   └── globals.css       #   全局样式
│   ├── components/
│   │   ├── chat/             #   pi-web-ui 聊天面板封装
│   │   └── doc/              #   需求文档编辑器 + 版本状态栏
│   └── lib/
│       ├── agent/            #   Agent 编排 (system prompt + tools)
│       ├── db/               #   SQLite 数据访问层
│       └── git/              #   Git 操作封装
├── REQUIREMENTS.md           # 需求文档 (开发唯一入口)
├── AGENTS.md                 # AI Agent 项目规范
└── package.json
```

---

## 命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Next.js 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run test` | 运行全部测试 (Vitest) |
| `npm run test:watch` | 测试 watch 模式 |

---

## 文档

| 文档 | 用途 |
|------|------|
| [`REQUIREMENTS.md`](REQUIREMENTS.md) | 完整需求规格和功能定义 |
| [`AGENTS.md`](AGENTS.md) | AI Agent 项目规范和工作流 |
| `.agents/workflows/` | 标准化开发/调试/测试/文档工作流 |
| `.agents/todo/` | 待完善工作清单 |

---

## 许可证

MIT
