# TODO: 需求文档体验增强

## 状态
pending

## 描述
当前需求文档编辑器功能基础，用户体验有较大提升空间。需要增强以下方面：

1. **实时 Markdown 预览** — 编辑时同步渲染预览（当前仅保存后渲染）
2. **版本对比可视化** — 可视化 diff 展示需求变更
3. **模板系统** — 预置常见需求模板，加速确认流程
4. **导出功能** — 支持导出 PDF/HTML 格式

## 技术选项

### 实时预览
- 使用 `react-markdown` 实时渲染编辑内容
- 左右分栏：左侧编辑，右侧预览
- 防抖处理避免频繁渲染

### 版本对比
- 使用 `diff` 库计算文本差异
- 或引入 `react-diff-viewer` 组件
- 支持行级/词级对比

### 模板系统
- 新增 `templates/` 目录存放模板
- 模板格式：YAML frontmatter + Markdown body
- UI 添加模板选择下拉框

### 导出功能
- HTML：直接序列化 DOM
- PDF：使用 `html2pdf.js` 或 `puppeteer`
- 或提供打印友好样式

## 实施优先级

| 优先级 | 项目 | 复杂度 |
|--------|------|--------|
| P0 | 实时预览 | 低 |
| P1 | 版本对比 | 中 |
| P1 | 模板系统 | 低 |
| P2 | 导出功能 | 中 |

## 文件
- `src/components/doc/doc-editor.tsx`
- `src/components/doc/version-bar.tsx`
- `src/app/api/doc/route.ts`

## 参考
- react-markdown: https://github.com/remarkjs/react-markdown
- react-diff-viewer: https://github.com/praneshravind/react-diff-viewer
