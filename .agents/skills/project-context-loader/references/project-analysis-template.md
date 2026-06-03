# 项目分析模板

用于分析项目结构并生成 AGENTS.md。

## 1. 项目类型识别

### 前端项目特征
- 包含 `package.json`
- 有 `src/` 或 `app/` 目录
- 使用 React/Vue/Angular/Svelte 等框架
- 有构建配置：`vite.config.*`、`webpack.config.*` 等

### 后端项目特征
- Python: `requirements.txt`、`pyproject.toml`、`setup.py`
- Node.js: `package.json` 含服务端依赖
- Go: `go.mod`
- Rust: `Cargo.toml`
- Java: `pom.xml`、`build.gradle`

### 全栈项目特征
- 同时包含前后端特征
- 可能有 `frontend/`、`backend/` 分离目录
- 或有 `client/`、`server/` 分离目录

### 库/工具特征
- 开源项目通常有 `LICENSE`
- 发布配置
- 示例代码目录

## 2. 关键文件检查清单

### 配置文件
- [ ] `package.json` - Node.js 项目
- [ ] `pyproject.toml` / `requirements.txt` - Python 项目
- [ ] `Cargo.toml` - Rust 项目
- [ ] `go.mod` - Go 项目
- [ ] `pom.xml` / `build.gradle` - Java 项目
- [ ] `Dockerfile` / `docker-compose.yml` - 容器化配置
- [ ] `.github/workflows/` - CI/CD 配置

### 文档文件
- [ ] `README.md` - 项目概述
- [ ] `ARCHITECTURE.md` - 架构文档
- [ ] `CONTRIBUTING.md` - 贡献指南
- [ ] `CHANGELOG.md` - 变更日志
- [ ] `docs/` - 文档目录

### 源码目录
- [ ] `src/` - 主要源码
- [ ] `lib/` - 库代码
- [ ] `app/` - 应用代码
- [ ] `bin/` - 可执行文件
- [ ] `cmd/` - Go 命令目录

### 测试目录
- [ ] `tests/` - Python 测试
- [ ] `__tests__/` - Jest 测试
- [ ] `test/` - Go/Java 测试
- [ ] `spec/` - Ruby/JavaScript 测试
- [ ] `*.test.*` / `*.spec.*` - 测试文件

## 3. 架构分析要点

### 分层架构识别
- 是否有明确的分层（Controller/Service/Repository）
- 模块间的依赖关系
- 数据流向

### 设计模式识别
- 使用了哪些设计模式
- 框架特定的模式（如 React 的 Hooks、Vue 的 Composition API）

### 状态管理
- 全局状态管理方案
- 数据持久化方式
- 缓存策略

### 外部依赖
- 第三方 API 调用
- 数据库类型
- 消息队列等中间件

## 4. 代码规范分析

### 风格检查
- 缩进方式（空格/Tab）
- 引号风格（单引号/双引号）
- 分号使用
- 命名约定（camelCase/snake_case/PascalCase）

### 工具配置
- Linter 配置（`.eslintrc`、`.pylintrc` 等）
- Formatter 配置（`.prettierrc`、`black.toml` 等）
- TypeScript 配置（`tsconfig.json`）

## 5. 测试规范分析

### 测试框架
- 单元测试框架
- 集成测试框架
- E2E 测试工具

### 测试组织
- 测试文件位置
- 测试命名规范
- Mock/Stub 使用方式

### 测试命令
- 运行测试的命令
- 覆盖率检查命令