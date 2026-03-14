# Yoya.Basic 主题覆盖检查报告

## 概述

Yoya.Basic 使用基于 CSS 变量的主题系统，支持浅色/深色两种模式。

## 主题变量定义

### Islands 浅色主题
- 背景色：`#FFFFFF`
- 主色：`#5A67D6` (JetBrains 蓝紫色)
- 文字：`#2B2D30`
- 边框：`#D3D3D6`

### Islands 深色主题
- 背景色：`#19191C` (深灰黑)
- 主色：`#7B85EE` (提亮)
- 文字：`#E8E8E8`
- 边框：`#3E3E42`

## 组件主题覆盖情况

| 组件 | 主题变量数 | 覆盖状态 | 主要使用变量 |
|------|-----------|---------|-------------|
| Button | 35 | ✅ 完全覆盖 | --yoya-button-*, --yoya-primary, --yoya-bg |
| Card | 26 | ✅ 完全覆盖 | --yoya-card-*, --yoya-bg, --yoya-shadow |
| Menu | 83 | ✅ 完全覆盖 | --yoya-menu-*, --yoya-bg, --yoya-text |
| Form | 78 | ✅ 完全覆盖 | --yoya-input-*, --yoya-select-*, --yoya-border |
| Message | 28 | ✅ 完全覆盖 | --yoya-message-*, --yoya-shadow |
| Code | 28 | ✅ 完全覆盖 | --yoya-code-*, --yoya-bg |
| Table | 21 | ✅ 完全覆盖 | --yoya-table-*, --yoya-border |
| Detail | 27 | ✅ 完全覆盖 | --yoya-descriptions-*, --yoya-text |
| Field | 42 | ✅ 完全覆盖 | --yoya-field-*, --yoya-border |
| Body | 12 | ✅ 完全覆盖 | --yoya-bg, --yoya-text |
| Sidebar | 21 | ✅ 已覆盖 | --yoya-sidebar-*, --yoya-bg, --yoya-border |
| Layout | N/A | ✅ 无需覆盖 | 纯布局组件，不使用主题变量 |

## 主题系统设计

### 变量命名规范
- 全局变量：`--yoya-{name}` (如 `--yoya-primary`, `--yoya-bg`)
- 组件变量：`--yoya-{component}-{property}` (如 `--yoya-button-padding`)
- 状态变量：`--yoya-{state}-{property}` (如 `--yoya-hover-bg`)

### 组件状态机
所有复杂组件使用状态机管理状态：
- `registerStateAttrs()` - 注册状态属性
- `setState()` / `getState()` - 状态访问
- `registerStateHandler()` - 状态变更处理器
- `saveBaseStylesSnapshot()` - 样式快照

### 支持的状态类型
- `disabled` - 禁用状态
- `loading` - 加载状态
- `error` - 错误状态
- `hovered` - 悬停状态
- `active` - 激活状态
- `focused` - 聚焦状态

## 使用方法

### 初始化主题
```javascript
import { initTheme } from 'yoya-basic';

initTheme({
  defaultTheme: 'islands',
  defaultMode: 'light',
});
```

### 切换主题
```javascript
import { setThemeMode, switchTheme } from 'yoya-basic';

// 切换到浅色
setThemeMode('light');

// 切换到深色
setThemeMode('dark');

// 跟随系统
setThemeMode('auto');
```

## 建议

1. ✅ 所有核心组件已完全覆盖主题变量
2. ✅ 主题系统设计合理，支持浅色/深色模式
3. ✅ 状态机机制完善，支持复杂交互

无需额外修改，主题系统工作正常。
