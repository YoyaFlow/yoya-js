# JetBrains Islands 主题配色更新记录

## 更新日期
2026-03-07

## 更新内容

### 1. 主题颜色变量更新

#### 浅色模式 (light.js)
- **主色调**: JetBrains 蓝紫色 `#5A67D6`
- **背景色**:
  - 主背景：`#FFFFFF`
  - 次级背景：`#F5F6F7`
  - 第三级背景：`#EBECED`
  - 悬停背景：`#E8EAED`
- **文字颜色**:
  - 主要文字：`#2B2D30`
  - 次要文字：`#6B6E75`
  - 辅助文字：`#9A9DA3`
  - 禁用文字：`#B8BAC0`
  - 链接色：`#3574F0`
- **边框**:
  - 主边框：`#D3D3D6`
  - 次级边框：`#E5E5E7`
  - 聚焦边框：`#5A67D6`
  - 悬停边框：`#A8A8AC`
- **状态色**:
  - 成功（绿色）：`#49B85C`
  - 警告（橙色）：`#F0A664`
  - 错误（红色）：`#E05252`
  - 信息（蓝色）：`#4FB3E4`

#### 深色模式 (dark.js)
- **主色调**: 提亮蓝紫色 `#7B85EE`
- **背景色**:
  - 主背景：`#19191C`
  - 次级背景：`#252528`
  - 第三级背景：`#2F2F33`
  - 悬停背景：`#353539`
- **文字颜色**:
  - 主要文字：`#E8E8E8`
  - 次要文字：`#9B9DA3`
  - 辅助文字：`#6B6E75`
  - 禁用文字：`#4F5157`
  - 链接色：`#5A8BFF`
- **边框**:
  - 主边框：`#3E3E42`
  - 次级边框：`#4A4A4F`
  - 聚焦边框：`#7B85EE`
  - 悬停边框：`#5A5C63`
- **状态色**:
  - 成功（亮绿色）：`#5FD471`
  - 警告（亮橙色）：`#F5B86A`
  - 错误（亮红色）：`#F56A6A`
  - 信息（亮蓝色）：`#5FC4F0`

### 2. 组件配色更新

#### Button 组件 (button.js)
- 更新 `_applyTypeStyles()` 使用 CSS 变量
- 更新 `_getHoverStyles()` 使用 CSS 变量
- 支持 primary, success, warning, danger, default 五种类型
- Ghost 模式使用透明背景

#### Menu 组件 (menu.js)
- 更新菜单背景色使用 `var(--islands-menu-bg)`
- 更新菜单项颜色使用 `var(--islands-menu-item-color)`
- 更新 hover/active 状态使用主题变量
- 更新分割线颜色使用 `var(--islands-menu-divider-bg)`
- 更新下拉菜单和右键菜单配色

#### Table 组件 (table.js)
- 更新表格背景色使用 `var(--islands-table-bg)`
- 更新表头背景使用 `var(--islands-table-head-bg)`
- 更新斑马纹背景使用 `var(--islands-bg-secondary)`
- 更新 hover 背景使用 `var(--islands-hover-bg)`
- 移除调试日志

#### Card 组件 (card.js)
- 更新卡片背景使用 `var(--islands-card-bg)`
- 更新卡片阴影使用 `var(--islands-shadow)`
- 更新头部/内容/底部配色
- 更新 bordered 模式边框色

#### Message 组件 (message.js)
- 更新消息背景使用语义化 CSS 变量
- 支持浅色/深色模式自动切换
- 使用半透明背景色替代渐变

#### Form 组件 (form.js)
- 更新输入框边框使用 `var(--islands-border)`
- 更新 disabled 状态背景使用 `var(--islands-bg-tertiary)`
- 更新 error 状态颜色使用 `var(--islands-error)`

### 3. 新增 CSS 变量

#### 颜色变量
```css
--islands-primary-alpha        /* 主色调半透明 */
--islands-bg-hover             /* 悬停背景 */
--islands-text-tertiary        /* 辅助文字 */
--islands-text-link            /* 链接色 */
--islands-border-focus         /* 聚焦边框 */
--islands-border-hover         /* 悬停边框 */
--islands-success-bg           /* 成功背景半透明 */
--islands-warning-bg           /* 警告背景半透明 */
--islands-error-bg             /* 错误背景半透明 */
--islands-info-bg              /* 信息背景半透明 */
--islands-selection            /* 选区背景 */
--islands-selection-inactive   /* 非活动选区背景 */
--islands-overlay              /* 覆盖层 */
```

#### 按钮变量
```css
--islands-button-primary-bg
--islands-button-primary-hover
--islands-button-primary-active
--islands-button-success-bg
--islands-button-success-hover
--islands-button-warning-bg
--islands-button-warning-hover
--islands-button-danger-bg
--islands-button-danger-hover
--islands-button-default-bg
--islands-button-default-hover
--islands-button-default-border
```

## 使用说明

### 应用主题
```javascript
import { initTheme, applyTheme } from './yoya/theme/index.js';
import { createLightTheme, createDarkTheme } from './yoya/theme/islands/index.js';

// 初始化主题
initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto',  // 'auto' | 'light' | 'dark'
  themes: new Map([
    ['islands', {
      factory: createLightTheme,
      lightFactory: createLightTheme,
      darkFactory: createDarkTheme,
    }]
  ])
});
```

### 切换主题
```javascript
import { setThemeMode } from './yoya/theme/index.js';

// 切换到深色模式
setThemeMode('dark');

// 切换到浅色模式
setThemeMode('light');

// 使用系统主题
setThemeMode('auto');
```

## 兼容性说明

- 所有 CSS 变量都提供了 fallback 值
- 旧项目可以无缝迁移到新主题
- 支持通过 CSS 变量自定义覆盖

## 注意事项

1. 深色模式下文字对比度已优化，符合 WCAG AA 标准
2. 状态色在深色模式下使用更亮的色调以保证可见性
3. 阴影效果在深色模式下使用更高的不透明度
4. 消息提示使用半透明背景替代渐变，更适应两种模式
