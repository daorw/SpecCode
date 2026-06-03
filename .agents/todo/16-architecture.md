# TODO: 架构优化

## 状态
pending

## 描述
当前架构存在状态管理分散、API 层缺乏统一抽象、数据库无版本迁移等问题。需要优化以下方面：

1. **状态管理** — 考虑 Zustand 替代分散的 useState
2. **API 层抽象** — 统一 fetch 封装，错误处理
3. **数据库迁移** — 引入版本化 schema 迁移
4. **WebSocket** — 实时推送 Agent 状态变化

## 技术选项

### 状态管理
- Zustand：轻量级，API 简洁
- Redux Toolkit：功能全面，学习曲线陡
- 或保持 useState + Context（当前简单场景够用）

### API 层抽象
- 创建 `src/lib/api/client.ts` 封装 fetch
- 统一错误处理和响应解析
- 支持请求/响应拦截

### 数据库迁移
- 使用 `knex` 或 `sqlite3-migrate`
- 迁移文件版本化管理
- 启动时自动执行迁移

### WebSocket
- Next.js 支持 WebSocket（需自定义 server）
- 或使用 Server-Sent Events (SSE) 更简单
- 用于 Agent 状态实时推送

## 实施优先级

| 优先级 | 项目 | 复杂度 |
|--------|------|--------|
| P0 | API 层抽象 | 低 |
| P1 | 数据库迁移 | 中 |
| P2 | 状态管理 | 中 |
| P2 | WebSocket | 高 |

## 文件
- `src/lib/api/` (新增目录)
- `src/lib/db/connection.ts`
- `src/lib/db/schema.ts`
- `src/app/page.tsx`

## 参考
- Zustand: https://github.com/pmndrs/zustand
- knex: https://knexjs.org/
- Next.js WebSocket: https://nextjs.org/docs/app/building-your-application/configuring/web-sockets
