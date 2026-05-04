# TODO: pi-web-ui 端到端集成验证

## 状态
pending

## 描述
当前 ChatPanel 的 React 包装器 (`src/components/chat/chat-panel.tsx`) 已编写完成，但尚未在真实浏览器环境中验证：

1. pi-web-ui 的 Web Components (mini-lit) 在 Next.js 中的渲染是否正常
2. IndexedDB 存储初始化是否成功
3. ChatPanel.setAgent() 是否能正确连接 Agent 实例
4. Agent 的 system prompt + 4 个工具是否在对话中正常工作
5. API Key 管理对话框是否正常弹出

## 验证步骤
1. `bun run dev` 启动开发服务器
2. 设置 ANTHROPIC_API_KEY 环境变量
3. 浏览器打开 http://localhost:3000
4. 输入一条 Grill-me 测试消息，观察 Agent 响应
5. 检查左侧需求文档编辑器能否正常显示/编辑

## 依赖
- ANTHROPIC_API_KEY 环境变量已配置
- 浏览器支持 IndexedDB 和 Web Components
