# TODO: 代码质量与测试

## 状态
pending

## 描述
当前测试覆盖基础功能，但缺乏端到端测试、API 文档和性能监控。需要增强以下方面：

1. **E2E 测试** — Playwright 覆盖核心流程
2. **API 文档** — Swagger/OpenAPI 自动生成
3. **性能监控** — 添加 API 响应时间追踪
4. **日志系统** — 结构化日志便于调试

## 技术选项

### E2E 测试
- 使用 Playwright 或 Cypress
- 覆盖：需求创建 → 确认 → 代码生成 → 版本迭代
- CI 集成自动运行

### API 文档
- 使用 `swagger-ui-express` 或 `next-swagger-doc`
- 在 route.ts 添加 JSDoc 注释
- 自动生成 OpenAPI spec

### 性能监控
- 中间件记录 API 响应时间
- 使用 `perf_hooks` 测量关键操作
- 可选集成 Sentry 或 DataDog

### 日志系统
- 使用 `pino` 或 `winston`
- 结构化 JSON 格式
- 支持不同日志级别

## 实施优先级

| 优先级 | 项目 | 复杂度 |
|--------|------|--------|
| P0 | 日志系统 | 低 |
| P1 | E2E 测试 | 高 |
| P2 | 性能监控 | 中 |
| P2 | API 文档 | 中 |

## 文件
- `src/__tests__/` (新增 E2E 目录)
- `src/app/api/**/*.ts`
- `src/lib/` (新增 logger 模块)

## 参考
- Playwright: https://playwright.dev/
- pino: https://github.com/pinojs/pino
- next-swagger-doc: https://github.com/jlalmes/next-swagger-doc
