# TODO: Agent 工具在真实 Agent Loop 中测试

## 状态
pending

## 描述
当前 Agent 工具 (`src/lib/agent/tools/index.ts`) 已定义但未在 Agent loop 中验证：

1. **read_requirements** — 返回空 DB 时是否正确响应
2. **update_requirements** — 增量写入后 DB 是否正确持久化
3. **generate_code** — 返回的 prompt 是否包含完整需求文档内容
4. **version_control** — Git 操作是否正常触发、错误处理是否完整

## 方案
1. 使用 mock LLM (Faux provider) 模拟对话流程
2. 构造 AgentMessage 调用 `agentLoop()` 低级 API 测试工具执行
3. 或使用 `Agent.prompt()` 配合 faux model 进行完整对话测试

## 关键验证点
- 工具参数校验 (Typebox schema validation)
- 错误处理和异常消息
- 工具返回值格式（content + details）
- terminate 信号正确处理

## 文件
- `src/__tests__/agent/` — 新建测试文件
- `src/lib/agent/tools/index.ts`
- `src/lib/agent/create-agent.ts`
