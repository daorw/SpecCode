# SpecCode

**需求分析驱动的编程 Agent** — 编写 Markdown 需求文档，Agent 自动完成项目代码生成与版本迭代。

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Tests](https://img.shields.io/badge/tests-31%2F31-green)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> English docs: [`README.md`](../README.md)

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

浏览器打开 `http://localhost:3000`，左侧需求文档编辑器，右侧 Grill-me 对话与 Agent 确认需求。

---

## V1 功能

| 功能 | 说明 |
|------|------|
| **Grill-me 需求确认** | 递进式对话辅助用户澄清并结构化需求，实时写入 Markdown 需求文档 |
| **Agent 代码生成** | 基于确认的需求文档，LLM Agent 自动在指定目录生成完整项目代码 |
| **版本迭代管理** | 需求版本 ↔ Git tag ↔ 提交哈希三向绑定，通过 Git 分支/diff/merge 增量更新 |

---

## 架构

```
浏览器 (Next.js)
  ├── 左侧: Markdown 需求文档编辑器
  └── 右侧: pi-web-ui 聊天面板 (Agent 对话)

服务端 (Next.js API Routes)
  ├── /api/doc             需求文档 CRUD
  ├── /api/version          版本记录管理
  ├── /api/projects         项目历史管理
  └── /api/agent/execute    工具执行代理

核心引擎
  ├── pi-agent-core         Agent 运行时 (事件驱动 + 工具调用)
  ├── pi-ai                 统一 LLM API (Anthropic / OpenAI / 等)
  └── pi-web-ui             聊天 UI 组件 (ChatPanel / AgentInterface)

存储
  └── SQLite (better-sqlite3)   需求文档 + 版本映射 + 项目记录
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
| 样式 | Tailwind CSS v4 |
| 测试 | Vitest |
| Git 操作 | simple-git |

---

## 项目结构

```
speccode/
├── .agents/                  # 内置 Agent 资源
│   ├── skills/               #   内置技能 (grill-me)
│   ├── tools/                #   工具定义
│   ├── workflows/            #   工作流 (开发/调试/测试/文档)
│   └── todo/                 #   待完善清单
├── docs/                     # 文档
│   └── README-zh.md          #   中文 README
├── public/
│   ├── favicon.svg           # 应用图标
│   └── pi-web-ui/app.css     # pi-web-ui 样式 (预处理后)
├── scripts/
│   └── prepare-pi-web-ui.mjs # CSS 预处理脚本
├── src/
│   ├── __tests__/            # 测试 (31 项通过)
│   ├── app/
│   │   ├── api/              #   API Routes
│   │   ├── layout.tsx        #   Root Layout
│   │   ├── page.tsx          #   主页面 (三栏布局)
│   │   └── globals.css       #   全局样式
│   ├── components/
│   │   ├── chat/             #   聊天面板封装 + 导航栏
│   │   └── doc/              #   需求编辑器 + 版本栏
│   └── lib/
│       ├── agent/            #   Agent 编排
│       ├── db/               #   SQLite 数据访问层
│       ├── git/              #   Git 操作封装
│       └── mocks/            #   Webpack 模块 mock
├── REQUIREMENTS.md           # 完整需求规格
├── AGENTS.md                 # AI Agent 项目规范
├── README.md                 # 英文 README
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
| [`REQUIREMENTS.md`](../REQUIREMENTS.md) | 完整需求规格和功能定义 |
| [`AGENTS.md`](../AGENTS.md) | AI Agent 项目规范和工作流 |
| `.agents/workflows/` | 标准化开发/调试/测试/文档工作流 |
| `.agents/todo/` | 待完善工作清单 |
| [`README.md`](../README.md) | 英文 README |

---

## 许可证

MIT
