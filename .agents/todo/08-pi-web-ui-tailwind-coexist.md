# TODO: pi-web-ui 样式与 Tailwind 共存优化

## 状态
pending

## 描述
pi-web-ui 使用自己的 Tailwind CSS v4 样式（`@mariozechner/pi-web-ui/app.css`），speccode 使用 Tailwind CSS v3。两者可能产生样式冲突：

1. CSS 自定义属性 (CSS variables) 冲突
2. 全局样式覆盖（body/html 字体、边距等）
3. 组件级样式优先级问题
4. Web Components Shadow DOM 样式穿透

## 当前做法
在 `src/app/globals.css` 中导入 Tailwind v3，在 `chat-panel.tsx` 中导入 pi-web-ui 的 app.css。需要验证两者是否和平共存。

## 可能需要的调整
1. 使用 Tailwind `important` 配置提高 speccode 样式优先级
2. 为 pi-web-ui 的 ChatPanel 添加 `:host` 样式隔离
3. 统一升级到 Tailwind v4（当 pi-web-ui 升级后）
4. 或使用 CSS layers (`@layer`) 管理优先级

## 文件
- `src/app/globals.css`
- `src/components/chat/chat-panel.tsx`
- `tailwind.config.ts`
