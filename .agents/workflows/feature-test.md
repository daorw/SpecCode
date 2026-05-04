# feature-test

测试规范与执行流程。Agent 在"编写测试"、"运行测试"、"测试覆盖率"等场景时必须遵守本工作流。

---

## 测试框架

- 框架：Vitest（`vitest run` / `vitest` watch 模式）
- 配置：`vitest.config.ts`（`environment: 'node'`, `globals: true`）
- 目录：`src/__tests__/<module>/<module>.test.ts`

---

## 覆盖率要求

| 模块 | 覆盖率 | 说明 |
|------|--------|------|
| `src/lib/` 核心逻辑 | ≥ 90% | DB DAO、Git 操作、Agent 编排 |
| `src/app/api/` API 路由 | ≥ 70% | HTTP 请求/响应测试 |
| `src/components/` UI 组件 | 可选 | 需浏览器环境，V1 暂不强求 |

---

## 测试类型

### 单元测试
- 纯函数：版本号解析、Markdown 生成、数据转换
- DAO 操作：使用 `getInMemoryDb()` 创建 `:memory:` 数据库
- 工具逻辑：Agent 工具的参数校验和返回值

### 集成测试
- API 路由：构造 HTTP Request，验证 Response
- Git 操作：临时目录 + `git init`，测试完整 branch/diff/merge/tag 流程
- Agent 工具 loop：使用 faux model 模拟 Agent 对话

---

## Mock 策略

| 场景 | Mock 方式 |
|------|-----------|
| SQLite | `getInMemoryDb()` / `new Database(':memory:')` |
| Git | `fs.mkdtemp()` + `git init` 临时仓库 |
| LLM 调用 | `@mariozechner/pi-ai` 的 faux provider |
| File I/O | `fs.writeFile` / `fs.readFile` 临时文件 |
| IndexedDB | 不在 Node 测试中测试，依赖浏览器 e2e |

---

## 必须覆盖的测试场景

每个被测试的函数/模块至少覆盖：

1. **Happy path** — 正常输入 → 期望输出
2. **Error case** — 错误输入 → 正确的错误处理
3. **Edge case** — 空输入 / null / undefined / 边界值
4. **并发/排序** — 如涉及列表，验证排序和去重

---

## 运行命令

```bash
# 全量运行
npx vitest run

# Watch 模式（开发时）
npx vitest

# 单文件
npx vitest run src/__tests__/db/db.test.ts

# 覆盖率报告
npx vitest run --coverage
```

---

## 测试命名约定

```typescript
describe('Module Name', () => {
  it('should do X when Y', () => { /* ... */ });
  it('should return Z for empty input', () => { /* ... */ });
  it('should throw error for invalid input', () => { /* ... */ });
});
```

- `describe`：模块或函数名
- `it`：`should <expected behavior> when/for <condition>`
