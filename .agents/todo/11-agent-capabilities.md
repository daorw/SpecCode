# TODO: Agent 能力增强

## 状态
pending

## 描述
当前 Agent 模块 (`src/lib/agent/`) 功能基础，仅支持单模型、同步响应、无会话持久化。需要增强以下能力：

1. **多模型支持** — 当前硬编码 Anthropic Claude，需扩展 OpenAI/Gemini 等
2. **流式响应** — Agent 对话支持 streaming，改善用户等待体验
3. **上下文管理** — Agent 会话历史持久化到 SQLite，支持断点续对话
4. **工具扩展** — 增加文件系统操作、代码搜索等工具

## 技术选项

### 多模型支持
- 修改 `create-agent.ts`，从配置读取 provider/model
- 利用 pi-ai 的 `getModel()` 支持多 provider
- UI 添加模型选择器（pi-web-ui 已有 AppStorage.providerKeys）

### 流式响应
- pi-agent-core 支持 `agent.subscribe()` 事件驱动
- 使用 `message_update` 事件逐字渲染
- 前端使用 ReadableStream 或 SSE

### 会话持久化
- 新增 `agent_sessions` 表存储对话历史（schema.ts 已有）
- 创建 `sessions-dao.ts` 实现 CRUD
- 页面加载时恢复最近会话

### 工具扩展
- 新增 `file_operations` 工具：读写项目文件
- 新增 `code_search` 工具：搜索代码库
- 新增 `shell_execute` 工具：执行 shell 命令（需安全沙箱）

## 实施优先级

| 优先级 | 项目 | 复杂度 |
|--------|------|--------|
| P0 | 多模型支持 | 低 |
| P0 | 流式响应 | 中 |
| P1 | 会话持久化 | 中 |
| P2 | 工具扩展 | 高 |

## 文件
- `src/lib/agent/create-agent.ts`
- `src/lib/agent/system-prompt.ts`
- `src/lib/agent/tools/index.ts`
- `src/lib/db/schema.ts`
- `src/components/chat/chat-panel.tsx`

## 参考
- pi-agent-core API: https://github.com/badlogic/pi-mono/blob/main/packages/agent/README.md
- pi-ai 支持的 provider: https://github.com/badlogic/pi-mono/blob/main/packages/ai/README.md
