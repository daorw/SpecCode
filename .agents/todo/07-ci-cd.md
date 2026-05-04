# TODO: CI/CD 配置

## 状态
pending

## 描述
项目缺少 CI/CD 配置，需要自动化：

1. **TypeScript 类型检查** — `tsc --noEmit`
2. **单元测试** — `vitest run`
3. **Lint** — ESLint / Biome
4. **构建验证** — `next build`

## 方案
添加 `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
```

## 注意事项
- better-sqlite3 在 CI 中也需要 native 编译
- pi-mono 包需要在 GitHub Actions 中从 npm registry 安装
- Node.js 版本建议 >= 20
