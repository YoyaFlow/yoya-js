# 记忆索引

快速导航到各类记忆文件。

## 目录结构

| 目录 | 用途 | 命名规则 |
|------|------|----------|
| `10-fixes/` | 问题修复记录 | `YYYY-MM-DD-component-name.md` |
| `20-architecture/` | 架构决策和设计 | `topic.md` |
| `30-components/` | 组件 API 和规范 | `component-type.md` |
| `40-patterns/` | 开发模式和最佳实践 | `pattern-name.md` |

---

## 10-fixes/ 修复记录

按日期排序，最近的修复在前：

| 文件 | 日期 | 主题 |
|------|------|------|
| [2026-03-18-dark-mode-field-fix.md](./10-fixes/2026-03-18-dark-mode-field-fix.md) | 2026-03-18 | Dark Mode Field 修复 |
| [2026-03-06-toast-api-refactor.md](./10-fixes/2026-03-06-toast-api-refactor.md) | 2026-03-06 | Toast API 重构 |
| [2026-03-06-button-hover-state.md](./10-fixes/2026-03-06-button-hover-state.md) | 2026-03-06 | Button hover 状态修复 |
| [2026-03-06-toast-setPosition.md](./10-fixes/2026-03-06-toast-setPosition.md) | 2026-03-06 | Toast setPosition 修复 |
| [2026-03-04-vselect-vform-fix.md](./10-fixes/2026-03-04-vselect-vform-fix.md) | 2026-03-04 | VSelect/VForm/VSwitch 修复 |

---

## 20-architecture/ 架构文档

### 核心架构

| 文件 | 主题 |
|------|------|
| [state-machine-architecture.md](./20-architecture/state-machine-architecture.md) | 状态机架构 |
| [component-virtual-dom-architecture.md](./20-architecture/component-virtual-dom-architecture.md) | 组件虚拟 DOM 架构 |
| [element-lifecycle-analysis.md](./20-architecture/element-lifecycle-analysis.md) | 元素生命周期分析 |
| [architecture-analysis.md](./20-architecture/architecture-analysis.md) | 架构分析 |

### 主题系统

| 文件 | 主题 |
|------|------|
| [theme-system-analysis.md](./20-architecture/theme-system-analysis.md) | 主题系统分析 |
| [theme-system-fix.md](./20-architecture/theme-system-fix.md) | 主题系统修复 |
| [theme-persistence.md](./20-architecture/theme-persistence.md) | 主题持久化机制 |
| [tag-state-system.md](./20-architecture/tag-state-system.md) | Tag 状态系统 |

### VTree 组件

| 文件 | 主题 |
|------|------|
| [vtree-implementation-plan.md](./20-architecture/vtree-implementation-plan.md) | VTree 实现计划 |
| [vtree-redesign.md](./20-architecture/vtree-redesign.md) | VTree 重新设计 |
| [vtree-refactor-summary.md](./20-architecture/vtree-refactor-summary.md) | VTree 重构总结 |
| [vtree-demo.md](./20-architecture/vtree-demo.md) | VTree 演示 |
| [2026-03-25-vtree-node-state-design.md](./20-architecture/2026-03-25-vtree-node-state-design.md) | VTree 节点状态设计 |
| [2026-03-25-vtree-refactor-strategy.md](./20-architecture/2026-03-25-vtree-refactor-strategy.md) | VTree 重构策略 |

### 事件系统

| 文件 | 主题 |
|------|------|
| [event-system-redesign.md](./20-architecture/event-system-redesign.md) | 事件系统重构设计 |
| [event-system-plan.md](./20-architecture/event-system-plan.md) | 事件系统计划 |
| [2026-03-23-event-system-redesign.md](./20-architecture/2026-03-23-event-system-redesign.md) | 事件系统重构 (2026-03-23) |
| [2026-03-23-event-system-refactor.md](./20-architecture/2026-03-23-event-system-refactor.md) | 事件系统重构实施 |

### 组件开发

| 文件 | 主题 |
|------|------|
| [complex-component-design-principles.md](./20-architecture/complex-component-design-principles.md) | 复杂组件设计原则 |
| [2026-03-18-component-development-plan-design.md](./20-architecture/2026-03-18-component-development-plan-design.md) | 组件开发计划设计 |
| [2026-03-18-component-development-implementation.md](./20-architecture/2026-03-18-component-development-implementation.md) | 组件开发实现 |

### V2 架构

| 文件 | 主题 |
|------|------|
| [v2-toc-component.md](./20-architecture/v2-toc-component.md) | V2 TOC 组件架构 |
| [v2-vrouterviews-toc-system.md](./20-architecture/v2-vrouterviews-toc-system.md) | V2 VRouterViews TOC 系统 |
| [vrouterviews-demo-page.md](./20-architecture/vrouterviews-demo-page.md) | VRouterViews 演示页面 |

---

## 30-components/ 组件规范

### 表单组件

| 文件 | 主题 |
|------|------|
| [form-components.md](./30-components/form-components.md) | 表单组件 API |
| [grid-components.md](./30-components/grid-components.md) | Grid 组件 API |

### 布局组件

| 文件 | 主题 |
|------|------|
| [layout-components.md](./30-components/layout-components.md) | 布局组件 API |

### UI 组件

| 文件 | 主题 |
|------|------|
| [ui-components.md](./30-components/ui-components.md) | UI 组件 API |
| [vbox-component.md](./30-components/vbox-component.md) | VBox 组件 |
| [switchers-component.md](./30-components/switchers-component.md) | Switchers 组件 |
| [icons.md](./30-components/icons.md) | Icons 图标 |

---

## 40-patterns/ 开发模式

### 核心模式

| 文件 | 主题 |
|------|------|
| [chain-api-pattern.md](./40-patterns/chain-api-pattern.md) | 链式 API 模式 |
| [factory-setup-preference.md](./40-patterns/factory-setup-preference.md) | 工厂函数 Setup 优先级 |
| [state-handler-pattern.md](./40-patterns/state-handler-pattern.md) | 状态处理器模式 |

### 事件处理

| 文件 | 主题 |
|------|------|
| [event-handler-pattern.md](./40-patterns/event-handler-pattern.md) | 事件处理规范 |
| [event-handler-summary.md](./40-patterns/event-handler-summary.md) | 事件回调统一规范 - 实施总结 |
| [event-system-redesign.md](./40-patterns/event-system-redesign.md) | 事件系统重构设计 |

### 主题与样式

| 文件 | 主题 |
|------|------|
| [jetbrains-islands-theme-update.md](./40-patterns/jetbrains-islands-theme-update.md) | JetBrains Islands 主题更新 |

### 其他模式

| 文件 | 主题 |
|------|------|
| [dynamic-loader.md](./40-patterns/dynamic-loader.md) | 动态加载模式 |
| [dashboard-demo-page.md](./40-patterns/dashboard-demo-page.md) | Dashboard 演示页面 |

---

## 50-skills/ 技能文档

技能文档位于 `../skills/` 目录：

| 技能 | 用途 |
|------|------|
| [yoya-basic](../skills/yoya-basic.md) | 库的核心用法 |
| [yoya-layout](../skills/yoya-layout.md) | 布局组件 |
| [yoya-form](../skills/yoya-form.md) | 表单组件 |
| [yoya-components](../skills/yoya-components.md) | UI 组件 |
| [yoya-svg](../skills/yoya-svg.md) | SVG 组件 |
| [component-priority](../skills/component-priority.md) | 组件优先使用原则 |

---

## 快速检索

### 按组件名检索
在 `30-components/` 中查找组件 API 和使用规范。

### 按模式名检索
在 `40-patterns/` 中查找开发模式和最佳实践。

### 按日期检索修复
在 `10-fixes/` 中按 `YYYY-MM-DD` 前缀查找修复记录。

### 按架构主题检索
在 `20-architecture/` 中查找架构设计和决策文档。

---

## 最后更新

**更新日期**: 2026-04-08  
**更新内容**: 整理散落文件，统一分类到 10/20/30/40 目录
