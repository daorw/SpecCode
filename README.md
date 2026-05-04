# SpecCode

**Requirement Analysis-Driven Programming Agent** — write Markdown spec documents, let the Agent generate complete project code and manage version iterations.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Tests](https://img.shields.io/badge/tests-31%2F31-green)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> 中文文档: [`docs/README-zh.md`](docs/README-zh.md)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
bun run dev

# Run tests
npm run test

# Type check
npm run typecheck
```

Open `http://localhost:3000` — left panel is the spec document editor, right panel is the Grill-me conversation with the Agent.

---

## V1 Features

| Feature | Description |
|---------|-------------|
| **Grill-me Confirmation** | Progressive dialogue that helps users clarify and structure requirements, writing to a Markdown spec document in real time |
| **Agent Code Generation** | Based on confirmed requirements, the LLM Agent generates complete project code in the user-specified directory |
| **Version Iteration** | Spec version ↔ Git tag ↔ commit hash triple binding, with incremental updates via Git branch/diff/merge |

---

## Architecture

```
Browser (Next.js)
  ├── Left:  Markdown spec document editor
  └── Right: pi-web-ui chat panel (Agent conversation)

Server (Next.js API Routes)
  ├── /api/doc             Spec document CRUD
  ├── /api/version          Version record management
  ├── /api/projects         Project history management
  └── /api/agent/execute    Tool execution proxy

Core Engine
  ├── pi-agent-core         Agent runtime (event-driven + tool calling)
  ├── pi-ai                 Unified LLM API (Anthropic / OpenAI / etc.)
  └── pi-web-ui             Chat UI components (ChatPanel / AgentInterface)

Storage
  └── SQLite (better-sqlite3)   Spec documents + version mapping + project records
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (strict) |
| Full-stack | Next.js 14 (App Router) |
| Database | SQLite (better-sqlite3) |
| Agent Engine | `@mariozechner/pi-agent-core` |
| LLM Interface | `@mariozechner/pi-ai` |
| Chat UI | `@mariozechner/pi-web-ui` |
| Styling | Tailwind CSS v4 |
| Testing | Vitest |
| Git Ops | simple-git |

---

## Project Structure

```
speccode/
├── .agents/                  # Built-in Agent resources
│   ├── skills/               #   Skills (grill-me)
│   ├── tools/                #   Tool definitions
│   ├── workflows/            #   Workflows (dev/debug/test/docs)
│   └── todo/                 #   Pending improvement tasks
├── docs/                     # Documentation
│   └── README-zh.md          #   Chinese README
├── public/
│   ├── favicon.svg           # App icon
│   └── pi-web-ui/app.css     # pi-web-ui styles (preprocessed)
├── scripts/
│   └── prepare-pi-web-ui.mjs # CSS preprocessing script
├── src/
│   ├── __tests__/            # Tests (31 passing)
│   ├── app/
│   │   ├── api/              #   API Routes
│   │   ├── layout.tsx        #   Root Layout
│   │   ├── page.tsx          #   Main page (3-column layout)
│   │   └── globals.css       #   Global styles
│   ├── components/
│   │   ├── chat/             #   Chat panel wrapper + NavBar
│   │   └── doc/              #   Spec editor + Version bar
│   └── lib/
│       ├── agent/            #   Agent orchestration
│       ├── db/               #   SQLite data access layer
│       ├── git/              #   Git operations
│       └── mocks/            #   Webpack module mocks
├── REQUIREMENTS.md           # Full requirements specification
├── AGENTS.md                 # AI Agent conventions & workflows
├── README.md                 # This file
└── package.json
```

---

## Commands

| Command | Description |
|---------|------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type check |
| `npm run test` | Run all tests (Vitest) |
| `npm run test:watch` | Test watch mode |

---

## Documents

| Document | Purpose |
|----------|---------|
| [`REQUIREMENTS.md`](REQUIREMENTS.md) | Full requirements specification |
| [`AGENTS.md`](AGENTS.md) | AI Agent project conventions |
| `.agents/workflows/` | Standardized dev/debug/test/docs workflows |
| `.agents/todo/` | Pending improvement tasks |
| [`docs/README-zh.md`](docs/README-zh.md) | Chinese README |

---

## License

MIT
