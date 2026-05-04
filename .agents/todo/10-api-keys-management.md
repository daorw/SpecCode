# TODO: API Keys 管理流程改进

## 状态
pending

## 描述
当前 API Key 管理依赖 pi-web-ui 的 `ApiKeyPromptDialog` 和 IndexedDB 存储。需要完善：

1. **环境变量兜底** — 如果 IndexedDB 无 key，自动从环境变量读取
2. **Key 过期处理** — Anthropic OAuth token 可能过期，需要自动刷新
3. **Key 切换逻辑** — 用户切换 provider 时自动切换对应的 key
4. **Key 状态指示** — UI 显示当前使用的 provider 和 key 状态（有效/过期/未设置）

## 当前实现
- `chat-panel.tsx` — 使用 `ApiKeyPromptDialog.prompt(provider)` 弹窗
- `create-agent.ts` — 不支持传入 apiKey

## 需要的改进
1. `create-agent.ts` 添加 `getApiKey` 选项
2. `chat-panel.tsx` 在 `onApiKeyRequired` 中先尝试环境变量
3. 在 `AgentInterface` 上显示 provider 状态

## 文件
- `src/lib/agent/create-agent.ts`
- `src/components/chat/chat-panel.tsx`
- `src/app/page.tsx`
