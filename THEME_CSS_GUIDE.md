# Yoya.Theme CSS 使用指南

## 编译后的 CSS 文件

运行 `npm run build:theme` 后，会在 `dist/` 目录下生成：

- `yoya.theme.css` - 完整版（未压缩，带 source map）
- `yoya.theme.min.css` - 压缩版（生产环境使用）

## 使用方式

### 方式 1：通过 CDN 引入（推荐）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Yoya 应用</title>
  <!-- 引入主题 CSS -->
  <link rel="stylesheet" href="https://cdn.example.com/yoya-basic/dist/yoya.theme.min.css">
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { initTheme } from 'https://cdn.example.com/yoya-basic/dist/yoya.esm.min.js';

    // 初始化主题
    initTheme({ defaultTheme: 'islands', defaultMode: 'light' });
  </script>
</body>
</html>
```

### 方式 2：本地引用

```html
<head>
  <!-- 本地引用主题 CSS -->
  <link rel="stylesheet" href="./dist/yoya.theme.min.css">
</head>
```

### 方式 3：npm 包引用

```bash
npm install yoya-basic
```

```javascript
// CSS 通过 bundler 处理（需要配置 CSS loader）
import 'yoya-basic/dist/yoya.theme.min.css';
import { initTheme } from 'yoya-basic';

initTheme({ defaultTheme: 'islands', defaultMode: 'light' });
```

### 方式 4：自定义组件 CSS

只加载需要的组件 CSS，减小文件大小：

```javascript
import { getComponentCssPath, loadCssFile } from './yoya/index.js';

// 只加载 button 和 card 组件的 CSS
loadCssFile(getComponentCssPath('button'));
loadCssFile(getComponentCssPath('card'));
```

## 主题切换

```javascript
import { initTheme, switchTheme, setThemeMode } from './yoya/index.js';

// 初始化
initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto' // 'auto' | 'light' | 'dark'
});

// 切换主题
switchTheme('my-custom-theme');

// 切换模式
setThemeMode('dark');
```

## 自定义主题

### 方式 1：覆盖 CSS 变量

```css
/* 在引入 yoya.theme.css 之后添加自定义样式 */
:root {
  --yoya-primary: #your-color;
  --yoya-primary-light: #your-color-light;
  --yoya-primary-dark: #your-color-dark;
}
```

### 方式 2：创建自定义主题文件

```css
/* my-theme.css */
[data-theme="my-theme-light"] {
  --yoya-primary: #your-color;
  /* ... 其他变量 */
}

[data-theme="my-theme-dark"] {
  --yoya-primary: #your-color-dark;
  /* ... 其他变量 */
}
```

```javascript
import { initTheme, loadCssFile } from './yoya/index.js';

// 加载自定义主题
loadCssFile('./my-theme.css', { themeId: 'my-theme' });

// 初始化为自定义主题
initTheme({ defaultTheme: 'my-theme', defaultMode: 'light' });
```

## CSS 文件列表

完整组件 CSS 文件列表：

| 文件名 | 说明 |
|--------|------|
| `base.css` | 基础主题变量（主色调、状态色、间距、圆角等） |
| `button.css` | 按钮组件样式 |
| `card.css` | 卡片组件样式 |
| `menu.css` | 菜单组件样式 |
| `form.css` | 表单组件样式 |
| `tabs.css` | 标签页组件样式 |
| `pager.css` | 分页组件样式 |
| `message.css` | 消息提示组件样式 |
| `detail.css` | 详情组件样式 |
| `body.css` | 页面背景组件样式 |
| `code.css` | 代码展示组件样式 |
| `table.css` | 表格组件样式 |
| `field.css` | 可编辑字段组件样式 |
| `box.css` | 容器组件样式 |
| `switchers.css` | 分段控制器组件样式 |

## 构建命令

```bash
# 只构建主题 CSS
npm run build:theme

# 构建 JS 库 + 主题 CSS
npm run build
```

## 文件结构

```
dist/
├── yoya.esm.js          # JS 库（完整版）
├── yoya.esm.min.js      # JS 库（压缩版）
├── yoya.theme.css       # 主题 CSS（完整版）
├── yoya.theme.css.map   # 主题 CSS source map
└── yoya.theme.min.css   # 主题 CSS（压缩版）
```

## package.json exports

```json
{
  "exports": {
    ".": {
      "types": "./src/yoya/index.d.ts",
      "default": "./src/yoya/index.js"
    },
    "./theme": {
      "default": "./dist/yoya.theme.min.css"
    },
    "./theme/full": {
      "default": "./dist/yoya.theme.css"
    }
  }
}
```

使用：

```javascript
// 通过 package name 引用
import 'yoya-basic/theme';  // 压缩版
import 'yoya-basic/theme/full';  // 完整版
```
