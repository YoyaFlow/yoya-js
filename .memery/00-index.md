# 记忆索引

快速导航到各类记忆文件。

## 目录结构

| 目录 | 用途 | 命名规则 |
|------|------|----------|
| `10-fixes/` | 问题修复记录 | `YYYY-MM-DD-component-name.md` |
| `20-architecture/` | 架构决策和设计 | `topic.md` |
| `30-components/` | 组件 API 和规范 | `component-type.md` |
| `40-patterns/` | 开发模式和最佳实践 | `pattern-name.md` |

## 快速链接

### 修复记录
- [VSelect/VForm/VSwitch 修复](./10-fixes/2026-03-04-vselect-vform-fix.md) - 2026-03-04

### 架构文档
- [状态机系统](./20-architecture/tag-state-system.md)

### 组件规范
- [表单组件](./30-components/form-components.md)
- [布局组件](./30-components/layout-components.md)
- [UI 组件](./30-components/ui-components.md)

### 开发模式
- [链式 API 模式](./40-patterns/chain-api-pattern.md)
- [状态处理器模式](./40-patterns/state-handler-pattern.md)
- [工厂函数 Setup 优先级](./40-patterns/factory-setup-preference.md)
- [事件处理规范](./40-patterns/event-handler-pattern.md)
- [事件回调统一规范 - 实施总结](./40-patterns/event-handler-summary.md)

## 检索技巧

1. **按日期查找修复**：在 `10-fixes/` 中按 `YYYY-MM-DD` 前缀搜索
2. **按组件查找**：在 `30-components/` 中按组件名搜索
3. **按模式查找**：在 `40-patterns/` 中按模式名搜索
