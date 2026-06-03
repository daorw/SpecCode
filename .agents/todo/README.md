# TODO 索引与评估

> 最后更新：2026-06-03

## 目录索引

| # | 文件 | 主题 | 状态 | 优先级 |
|---|------|------|------|--------|
| 01 | [01-pi-web-ui-e2e.md](01-pi-web-ui-e2e.md) | pi-web-ui 端到端集成验证 | pending | P0 |
| 02 | [02-better-sqlite3-build.md](02-better-sqlite3-build.md) | better-sqlite3 构建自动化 | done (partial) | P1 |
| 03 | [03-git-integration-tests.md](03-git-integration-tests.md) | Git 操作集成测试 | pending | P1 |
| 04 | [04-agent-tool-loop-test.md](04-agent-tool-loop-test.md) | Agent 工具在真实 Agent Loop 中测试 | pending | P2 |
| 05 | [05-markdown-editor.md](05-markdown-editor.md) | Markdown 编辑器增强 | pending | P2 |
| 06 | [06-version-iteration-workflow.md](06-version-iteration-workflow.md) | 版本迭代端到端工作流 | pending | P1 |
| 07 | [07-ci-cd.md](07-ci-cd.md) | CI/CD 配置 | pending | P2 |
| 08 | [08-pi-web-ui-tailwind-coexist.md](08-pi-web-ui-tailwind-coexist.md) | pi-web-ui 样式与 Tailwind 共存优化 | pending | P3 |
| 09 | [09-env-config.md](09-env-config.md) | 环境变量 & 配置管理 | pending | P0 |
| 10 | [10-api-keys-management.md](10-api-keys-management.md) | API Keys 管理流程改进 | pending | P1 |
| 11 | [11-agent-capabilities.md](11-agent-capabilities.md) | Agent 能力增强 | pending | P0 |
| 12 | [12-requirements-experience.md](12-requirements-experience.md) | 需求文档体验增强 | pending | P2 |
| 13 | [13-version-management.md](13-version-management.md) | 版本管理增强 | pending | P3 |
| 14 | [14-dev-experience.md](14-dev-experience.md) | 开发体验优化 | pending | P2 |
| 15 | [15-code-quality.md](15-code-quality.md) | 代码质量与测试 | pending | P3 |
| 16 | [16-architecture.md](16-architecture.md) | 架构优化 | pending | P3 |

---

## 优先级排序

### 立即做（P0 — 阻塞 V1 可用性）

| # | TODO | 理由 |
|---|------|------|
| 09 | 环境变量 & 配置管理 | 创建 `.env.example`，10 分钟搞定，新开发者完全不知道如何配置 ANTHROPIC_API_KEY |
| 01 | pi-web-ui 端到端集成验证 | 浏览器验证 ChatPanel + IndexedDB + Agent 连接，是 V1 可用性的基础验证 |
| 11 | Agent 能力增强 | 多模型支持（pi-ai 已支持多 provider）+ 流式响应（pi-agent-core subscribe 事件驱动已可用），是 V1 体验的关键 |

### 短期做（P1 — V1 质量保障）

| # | TODO | 理由 |
|---|------|------|
| 02 | better-sqlite3 构建自动化 | native addon 构建问题阻塞 CI 和新开发者，部分已解决（next.config.mjs 已修正） |
| 03 | Git 操作集成测试 | git-ops.ts 有 11 个真实 Git 操作函数，全部未测试，是版本迭代可靠性的保障 |
| 06 | 版本迭代端到端工作流 | V1 三大核心功能之一，当前有 5 个缺失环节，需分阶段实现 |
| 10 | API Keys 管理改进 | create-agent.ts 已有 getApiKey 回调，缺少环境变量兜底（1 行代码） |

### 中期做（P2 — 体验提升）

| # | TODO | 理由 |
|---|------|------|
| 05 + 12 | Markdown 编辑器 + 需求文档体验 | 编辑器增强（实时预览 + 快捷键），react-markdown 已安装 |
| 14 | 开发体验优化 | 错误边界防崩溃 + 暗黑模式，Tailwind 内置 dark + next-themes 成本低 |
| 04 | Agent 工具端到端测试 | 需 mock LLM，依赖 todo-01 基础验证通过 |
| 07 | CI/CD 配置 | typecheck + test + build 基础质量保障，依赖 todo-02 构建问题解决 |

### 低优先级（P3 — 增强功能）

| # | TODO | 理由 |
|---|------|------|
| 08 | pi-web-ui 样式与 Tailwind 共存 | 当前和平共存（globals.css 仅 11 行），扩展样式时再处理 |
| 13 | 版本管理增强 | 回滚/变更日志/可视化分支图，基础版本管理已够用 |
| 15 | 代码质量与测试 | 24 个单元测试已覆盖核心功能，E2E/性能监控在 V1 可选 |
| 16 | 架构优化 | useState 在 V1 够用，Zustand/WebSocket/数据库迁移增加复杂度 |

---

## 详细评估

### 01-pi-web-ui-e2e — pi-web-ui 端到端集成验证

**合理性** ⭐⭐⭐⭐⭐ — ChatPanel 已接入（`src/components/chat/chat-panel.tsx`），但 Web Components + IndexedDB + Agent 连接从未在浏览器验证过。
**可行性** 高 — 只需 `npm install && npm run dev` + ANTHROPIC_API_KEY 即可验证。
**依赖** — ANTHROPIC_API_KEY 环境变量 + 浏览器支持 IndexedDB 和 Web Components。

### 02-better-sqlite3-build — better-sqlite3 构建自动化

**合理性** ⭐⭐⭐⭐ — native addon 构建问题确实阻塞新开发者和 CI。`next.config.mjs` 已从 .ts 迁移，`serverComponentsExternalPackages` 已配置。
**可行性** 中 — 当前方案（postinstall 脚本）可行；备选方案 `bun:sqlite` 或 `sql.js` 也值得考虑。
**建议** — 优先尝试方案 4（文档记录构建步骤），成本最低。

### 03-git-integration-tests — Git 操作集成测试

**合理性** ⭐⭐⭐⭐⭐ — `src/lib/git/git-ops.ts` 有 11 个真实 Git 操作函数（initRepo, createVersionBranch, getDiff, mergeToMain, createTag 等），全部未测试。当前仅测试 parseVersion、bumpVersion、readRequirementsVersion 三个纯函数。
**可行性** 中高 — 创建临时目录 + git init 的方案成熟，但需注意 CI 中 git 权限和并行测试隔离。

### 04-agent-tool-loop-test — Agent 工具在真实 Agent Loop 中测试

**合理性** ⭐⭐⭐⭐ — 4 个工具（read/update/generate/version）全部通过 API 代理执行，未验证端到端流程。当前仅有 system-prompt.test.ts 验证 prompt 内容。
**可行性** 中 — 需要 mock LLM（faux provider），pi-agent-core 支持但文档有限。
**建议** — 先完成 todo-01 验证基础可用性，再做此测试。

### 05-markdown-editor — Markdown 编辑器增强

**合理性** ⭐⭐⭐⭐ — 需求文档编辑是核心交互，当前 doc-editor.tsx 使用基础 textarea + select，体验简陋。
**可行性** 高 — V1 简化方案（实时预览 + Ctrl+S + Ctrl+B/I）完全可行，`react-markdown` 已安装。
**建议** — V1 简化方案足够，复杂编辑器（CodeMirror/Monaco）可延后。

### 06-version-iteration-workflow — 版本迭代端到端工作流

**合理性** ⭐⭐⭐⭐⭐ — REQUIREMENTS.md §2.4 定义了完整流程，但代码仅覆盖基础 Git 操作。当前有 5 个缺失环节：需求变更检测、受影响代码分析、增量修改、冲突处理、tag 回写。
**可行性** 中低 — 受影响代码分析和增量修改是 LLM 驱动的复杂逻辑，需要 Agent 能力增强（todo-11）配合。
**建议** — 先实现需求变更检测 + tag 回写（可行性高），增量修改等 Agent 能力成熟后再做。

### 07-ci-cd — CI/CD 配置

**合理性** ⭐⭐⭐⭐ — 无 `.github/workflows/` 目录，typecheck + test + build 是基础质量保障。
**可行性** 高 — GitHub Actions YAML 模板成熟，但需解决 better-sqlite3 在 CI 中的 native 编译问题（与 todo-02 关联）。

### 08-pi-web-ui-tailwind-coexist — pi-web-ui 样式与 Tailwind 共存优化

**合理性** ⭐⭐⭐ — 当前 globals.css 使用 Tailwind v4 语法，pi-web-ui 也用 Tailwind v4。当前 globals.css 极简（仅 11 行），冲突风险有限，但扩展样式时会暴露。
**可行性** 高 — CSS layers / `important` 配置 / `:host` 隔离都是成熟方案。

### 09-env-config — 环境变量 & 配置管理

**合理性** ⭐⭐⭐⭐⭐ — ANTHROPIC_API_KEY 是必需项，新开发者完全不知道如何配置。无 `.env.example`，无环境变量校验。
**可行性** 极高 — 创建 `.env.example` + `next.config.mjs` 中读取即可，成本极低。

### 10-api-keys-management — API Keys 管理流程改进

**合理性** ⭐⭐⭐⭐ — `create-agent.ts` 已有 `getApiKey` 回调从 IndexedDB 读取，但缺少环境变量兜底和 Key 状态指示。
**可行性** 高 — 在 `create-agent.ts` 添加 `process.env` fallback，UI 已有 model selector。
**建议** — 环境变量兜底（1 行代码）应立即做，Key 过期处理可延后。

### 11-agent-capabilities — Agent 能力增强

**合理性** ⭐⭐⭐⭐ — 当前仅支持 Anthropic Claude，单模型、无流式、无会话持久化。多模型支持是 V1 基础需求。
**可行性** 中高 — 多模型支持：pi-ai 已支持多 provider，改 create-agent.ts 即可。流式响应：pi-agent-core 的 subscribe() 事件驱动已可用。会话持久化：schema.ts 已有 agent_sessions 表。
**建议** — 多模型 + 流式响应应优先实现，是 V1 体验的关键。

### 12-requirements-experience — 需求文档体验增强

**合理性** ⭐⭐⭐ — 实时预览有价值，版本对比/模板/导出在 V1 可选。
**可行性** 高 — 实时预览：react-markdown 已安装，添加防抖即可。版本对比：diff 库成熟。模板/导出：中等复杂度。

### 13-version-management — 版本管理增强

**合理性** ⭐⭐⭐ — 回滚支持实用，可视化分支图和变更日志在 V1 可选。当前仅有基础 VersionBar（select 下拉）。
**可行性** — 回滚（P0）：高。变更日志（P1）：中。可视化分支图（P2）：高复杂度。

### 14-dev-experience — 开发体验优化

**合理性** ⭐⭐⭐⭐ — 错误边界防止崩溃是刚需，暗黑模式是常见需求，骨架屏和快捷键提升体验。
**可行性** 高 — 错误边界：React 标准方案，成本低。暗黑模式：Tailwind 内置 dark + next-themes，成本低。

### 15-code-quality — 代码质量与测试

**合理性** ⭐⭐⭐ — 当前 24 个单元测试已覆盖核心功能，E2E 测试在 V1 可选。
**可行性** — 日志系统（P0）：高。E2E 测试（P1）：高但耗时。性能监控/API 文档（P2）：中等。

### 16-architecture — 架构优化

**合理性** ⭐⭐⭐ — 当前 useState + Context 在 V1 够用，API 层抽象有价值但非紧急。
**可行性** — API 层抽象（P0）：高。数据库迁移（P1）：中。状态管理/Zustand（P2）：中。WebSocket/SSE（P2）：高复杂度。

---

## 风险提示

| 风险 | 说明 |
|------|------|
| pi-mono 依赖链 | pi-agent-core/pi-ai/pi-web-ui 是 monorepo 包，版本升级需同步，调试困难 |
| better-sqlite3 native 编译 | CI/新开发者环境可能遇到编译问题，建议准备 fallback 方案（sql.js） |
| Agent Loop 调试 | pi-agent-core 文档有限，流式响应和工具调用的端到端调试可能耗时 |
| V1 范围蔓延 | 16 个 todo 中有多个是 V2+ 功能（可视化分支图、WebSocket、性能监控），需严格控制 V1 边界 |

---

## 依赖关系图

```
09-env-config ─────────────────────────────────┐
                                                │
01-pi-web-ui-e2e ─────┐                        │
                       ├── 11-agent-capabilities ── 06-version-iteration-workflow
02-better-sqlite3 ────┤                              │
                       │                              ├── 10-api-keys-management
03-git-integration ───┘                              │
                                                     │
07-ci-cd ←── 02-better-sqlite3                       │
                                                     │
05-markdown-editor + 12-requirements-experience ◄────┘
                                                     │
14-dev-experience (独立)                              │
                                                     │
04-agent-tool-loop-test ←── 01-pi-web-ui-e2e         │
                                                     │
08-tailwind-coexist (独立)                            │
13-version-management (独立)                          │
15-code-quality (独立)                                │
16-architecture (独立)                                │
```
