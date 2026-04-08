# 主题系统修复记录

## 修复日期
2026-03-13

## 问题概述

主题系统存在以下问题：

1. **变量命名问题** - 使用 `--islands-*` 前缀，限制了多主题扩展
2. **P0: 暗色主题不完整** - `createDarkTheme()` 只覆盖了 12 个变量，大量组件变量没有暗色定义
3. **P0: 组件与主题耦合** - 担心组件直接使用 CSS 变量导致主题切换后样式不更新

## 修复内容

### 1. 变量命名重构

**文件**: `src/yoya/theme/variables.js`

将所有主题变量前缀从 `--islands-*` 改为 `--yoya-*`：

- `--islands-primary` → `--yoya-primary`
- `--islands-bg` → `--yoya-bg`
- `--islands-card-bg` → `--yoya-card-bg`
- ... (共 283 个变量)

**影响范围**:
- `src/yoya/theme/variables.js` - 变量定义
- `src/yoya/theme/islands/light.js` - 浅色主题
- `src/yoya/theme/islands/dark.js` - 深色主题
- 所有组件文件 (card.js, menu.js, button.js, etc.)

### 2. 补充完整的暗色主题变量

**文件**: `src/yoya/theme/variables.js`

`createDarkTheme()` 函数现在返回完整的暗色主题变量：

```javascript
export function createDarkTheme() {
  return {
    // 基础色
    '--yoya-bg': '#1a1a1a',
    '--yoya-bg-secondary': '#2a2a2a',
    '--yoya-text': '#e0e0e0',
    '--yoya-border': '#404040',

    // Card
    '--yoya-card-bg': '#2a2a2a',
    '--yoya-card-shadow': '0 2px 8px rgba(0,0,0,0.3)',

    // Menu
    '--yoya-menu-bg': '#2a2a2a',
    '--yoya-menu-shadow': '0 4px 12px rgba(0,0,0,0.3)',

    // Message (暗色模式使用纯色背景)
    '--yoya-message-success-bg': 'rgba(34, 197, 94, 0.15)',
    '--yoya-message-error-bg': 'rgba(239, 68, 68, 0.15)',
    '--yoya-message-warning-bg': 'rgba(245, 158, 11, 0.15)',
    '--yoya-message-info-bg': 'rgba(56, 189, 248, 0.15)',

    // ... 共 60+ 个变量
  };
}
```

**新增变量类别**:
- Card 组件变量（之前缺失）
- Menu 组件变量（之前缺失）
- Message 组件变量（之前缺失）
- Field 组件变量（之前缺失）
- Descriptions 组件变量（之前缺失）
- Code 组件变量（之前缺失）

### 3. 组件与主题解耦验证

**分析结果**: 组件已经正确使用 CSS 变量，主题切换时会自动更新

组件在 constructor 中使用 CSS 变量：
```javascript
class VMenu extends Tag {
  constructor(setup = null) {
    super('div', null);
    this.styles({
      background: 'var(--yoya-menu-bg, var(--yoya-bg))',
      borderRadius: 'var(--yoya-menu-radius, var(--yoya-radius-md))',
      // ...
    });
  }
}
```

主题切换流程：
1. `switchTheme('islands')` 被调用
2. `applyTheme(theme)` 更新 `document.documentElement` 上的 CSS 变量
3. 浏览器自动重新计算使用这些 CSS 变量的元素样式
4. 组件样式自动更新

**无需修改**：组件已经使用 CSS 变量而非硬编码值，主题切换机制正常工作。

## 验证方式

创建测试页面 `src/examples/yoya.theme.test.html`：

```html
<script type="module">
  import { initTheme, switchTheme, setThemeMode } from '../yoya/index.js';

  // 初始化主题
  initTheme({
    defaultTheme: 'islands',
    defaultMode: 'light'
  });

  // 切换浅色
  switchTheme('islands');
  setThemeMode('light');

  // 切换深色
  switchTheme('islands');
  setThemeMode('dark');
</script>
```

## 变量命名规范

**新命名规范**:
- 前缀：`--yoya-*` (通用主题变量前缀)
- 格式：`--yoya-{component}-{property}-{modifier}`
- 示例：
  - `--yoya-card-bg-hover` (卡片组件 - 背景色 - 悬停状态)
  - `--yoya-menu-item-active-color` (菜单项 - 激活状态 - 文字色)

**多主题支持**:
```javascript
// 注册新主题
registerTheme('ocean', createOceanTheme, {
  lightFactory: createOceanLight,
  darkFactory: createOceanDark
});
```

## 文件变更列表

| 文件 | 变更内容 |
|------|----------|
| `src/yoya/theme/variables.js` | 变量前缀替换，暗色主题补充 |
| `src/yoya/theme/islands/light.js` | 变量前缀替换 |
| `src/yoya/theme/islands/dark.js` | 变量前缀替换 |
| `src/yoya/components/*.js` | 变量前缀替换 |
| `src/yoya/core/helper.js` | 变量前缀替换 |

## 后续优化建议

1. **设计令牌系统** (P2) - 引入统一的设计令牌，如 `designTokens.colors.primary[500]`
2. **主题工厂模式** (P1) - 使用主题工厂函数生成变量，减少重复定义
3. **TypeScript 类型支持** (P3) - 为主题变量添加类型定义

## 参考文档

- `.memery/theme-system-analysis.md` - 主题系统问题分析
- `skills/yoyajs/SKILL.md` - Yoya.Basic 使用指南
