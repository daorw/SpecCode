# feature-develop

标准化功能开发流程。Agent 在收到"新增功能"、"实现需求"、"扩展模块"等请求时，必须先加载本工作流。

---

## 步骤

### 1. 分析
- 读取 `REQUIREMENTS.md` 确认需求边界和验收标准
- 读取 `AGENTS.md` 确认当前技术栈、项目结构和开发规范
- 搜索相关源文件，理解现有实现模式和接口

### 2. 设计
- 确定最小实现路径，不引入不必要的抽象或新依赖
- 遵循现有代码模式：参考同类文件的结构、命名、导入方式
- 如涉及新依赖，检查 `package.json` 是否已有类似库

### 3. 实现
- 文件命名：kebab-case（如 `doc-editor.tsx`）
- 组件命名：PascalCase（如 `DocEditor`）
- 函数/变量：camelCase（如 `parseRequirements`）
- API 路由：目录 + `route.ts`（如 `src/app/api/agent/route.ts`）
- TypeScript strict 模式，不添加 `// @ts-ignore` 或 `any`
- Tailwind CSS 工具类优先，不写内联 style

### 4. 测试
- 测试文件：`src/__tests__/<module>/<module>.test.ts`
- 覆盖核心路径和边界情况
- DB 测试用 `getInMemoryDb()`，Git 测试用临时目录
- 详见 `.agents/workflows/feature-test.md`

### 5. 验证
- `npx tsc --noEmit` 必须 0 错误
- `npx vitest run` 全部测试通过
- 如构建脚本可用，运行 `npm run build`

### 6. 文档同步
- 如有需求变更，更新 `REQUIREMENTS.md` 对应章节
- 如有规范变更，更新 `AGENTS.md`
- 详见 `.agents/workflows/documents-update.md`

---

## 自检清单

- [ ] 是否改动了无关文件？
- [ ] 是否遵循了现有代码风格（对比同类文件）？
- [ ] 是否引入了未在 `package.json` 中的新依赖？
- [ ] TypeScript 类型检查是否 0 错误？
- [ ] 所有现有测试是否仍然通过？
- [ ] 新功能是否有对应的测试？
