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
- [VSelect/VForm/VSwitch 修复](./10-fixes/2026-03-04-vselect-vform-fix.md)
- [Button hover 状态修复](./10-fixes/2026-03-06-button-hover-state.md)
- [Toast setPosition 修复](./10-fixes/2026-03-06-toast-setPosition.md)
- [Toast API 重构](./10-fixes/2026-03-06-toast-api-refactor.md)

### 架构文档
- [状态机系统](./20-architecture/tag-state-system.md)
- [主题系统分析](./theme-system-analysis.md)
- [主题系统修复](./theme-system-fix.md)

### 组件规范
- [表单组件](./30-components/form-components.md)
- [布局组件](./30-components/layout-components.md)
- [UI 组件](./30-components/ui-components.md)
- [VBox 组件](./vbox-component.md)
- [Switchers 组件](./switchers-component.md)
- [Icons](./icons.md)

### 开发模式
- [链式 API 模式](./40-patterns/chain-api-pattern.md)
- [状态处理器模式](./40-patterns/state-handler-pattern.md)
- [工厂函数 Setup 优先级](./40-patterns/factory-setup-preference.md)
- [事件处理规范](./40-patterns/event-handler-pattern.md)
- [事件回调统一规范 - 实施总结](./40-patterns/event-handler-summary.md)
- [动态加载模式](./40-patterns/dynamic-loader.md)

## 当前开发进度

### 组件开发计划 (2026-03-18)

详细设计文档：`docs/superpowers/specs/2026-03-18-component-development-plan-design.md`

| 阶段 | 文件 | 组件 | 状态 |
|------|------|------|------|
| P0 | components/grid.js | VRow, VCol | ✅ 已完成 |
| P1 | components/ui.js | Avatar, Badge, Progress, Skeleton, Tag, Alert, Breadcrumb | 待开发 |
| P1 | components/interaction.js | Tooltip, Popover, Dropdown, Collapse, Tree, TreeSelect | 待开发 |
| P2 | components/data-display.js | Timeline, Calendar, Carousel, Statistic, Descriptions | 待开发 |
| P2 | components/navigation.js | Pagination, Steps, Anchor, Affix, BackTop | 待开发 |

**VGrid 进度**:
- ✅ 组件实现（grid.js）
- ✅ CSS 样式（theme/css/components/grid.css）
- ✅ 导出配置（components/index.js, index.js）
- ⏳ 测试用例（待编写）
- ⏳ 使用示例（待编写）

### 现有组件总览

**18 个组件类别**（按文件组织）：
- `box.js` - VBox 通用容器
- `card.js` - VCard, VCardHeader, VCardBody, VCardFooter
- `menu.js` - VMenu, VMenuItem, VDropdownMenu, VContextMenu, VSidebar, VTopNavbar 等 9 个
- `message.js` - VMessage, VMessageContainer, toast
- `button.js` - VButton, VButtons
- `code.js` - VCode, CodeBlock
- `form.js` - VInput, VSelect, VTextarea, VCheckboxes, VSwitch, VForm, VTimer, VTimer2 等 9 个
- `detail.js` - VDetail, VDetailItem
- `field.js` - VField
- `switchers.js` - VSwitchers
- `body.js` - VBody
- `table.js` - VTable, VThead, VTbody, VTfoot, VTr, VTh, VTd
- `echart.js` - VEchart
- `router.js` - VRouter, VRoute, VLink, VRouterView
- `tabs.js` - VTabs
- `pager.js` - VPager
- `modal.js` - VModal, VConfirm

### 布局组件（core/layout.js）
- Flex, Grid, ResponsiveGrid, VStack, HStack, Center, Spacer, Container, Divider

## 检索技巧

1. **按日期查找修复**：在 `10-fixes/` 中按 `YYYY-MM-DD` 前缀搜索
2. **按组件查找**：在 `30-components/` 中按组件名搜索
3. **按模式查找**：在 `40-patterns/` 中按模式名搜索
