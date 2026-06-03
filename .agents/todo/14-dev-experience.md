# TODO: 开发体验优化

## 状态
pending

## 描述
当前应用缺乏一些常见的开发体验优化，影响用户使用效率和应用稳定性。需要增强以下方面：

1. **错误边界** — React Error Boundary 防止应用崩溃
2. **加载骨架屏** — 替代当前 Loading 文本
3. **键盘快捷键** — 提高操作效率
4. **暗黑模式** — 支持主题切换

## 技术选项

### 错误边界
- 创建 `ErrorBoundary` 组件包裹关键区域
- 捕获渲染错误，显示友好降级 UI
- 记录错误到日志系统

### 骨架屏
- 使用 `@tailwindcss/typography` 的动画
- 或使用 `react-loading-skeleton` 库
- 为每个主要组件创建骨架变体

### 键盘快捷键
- 使用 `react-hotkeys-hook` 或自建
- 常用快捷键：Ctrl+S 保存、Ctrl+N 新建、Ctrl+Enter 确认
- 快捷键帮助面板

### 暗黑模式
- Tailwind CSS 内置 dark mode 支持
- 使用 `next-themes` 管理主题状态
- 保存用户偏好到 localStorage

## 实施优先级

| 优先级 | 项目 | 复杂度 |
|--------|------|--------|
| P0 | 错误边界 | 低 |
| P0 | 暗黑模式 | 低 |
| P1 | 骨架屏 | 低 |
| P1 | 键盘快捷键 | 中 |

## 文件
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/doc/doc-editor.tsx`
- `src/components/chat/chat-panel.tsx`

## 参考
- next-themes: https://github.com/pacocoursey/next-themes
- react-hotkeys-hook: https://github.com/JohannesKlauss/react-hotkeys-hook
