# VBox 组件文档

## 概述

VBox 是一个通用容器组件，用于代替 div，提供圆角、背景色、透明度、阴影等样式配置。

## 特性

- **默认透明** - 默认完全透明，继承父元素字体颜色
- **宽高 100%** - 默认宽度和高度均为 100%
- **链式 API** - 所有方法支持链式调用
- **主题集成** - 支持使用主题变量（如 `var(--yoya-primary)`）
- **预设值** - 圆角、间距、阴影支持预设等级（sm/md/lg/xl）

## 基础用法

```javascript
import { vBox } from '../yoya/index.js';

// 基础透明容器
vBox(b => {
  b.text('内容');
});

// 带背景色
vBox(b => {
  b.background('var(--yoya-primary)');
  b.color('#fff');
  b.padding('md');
  b.radius('md');
  b.text('带样式的容器');
});

// 带阴影
vBox(b => {
  b.shadow('md');
  b.padding('lg');
  b.text('带阴影的容器');
});
```

## API 方法

### 样式方法

| 方法 | 参数 | 说明 | 示例 |
|------|------|------|------|
| `background(color)` | `string` | 设置背景颜色 | `b.background('var(--yoya-primary)')` |
| `opacity(value)` | `number` (0-1) | 设置透明度 | `b.opacity(0.5)` |
| `radius(value)` | `string\|number` | 设置圆角 | `b.radius('md')` 或 `b.radius('8px')` |
| `shadow(value)` | `string\|boolean` | 设置阴影 | `b.shadow('md')` 或 `b.shadow()` |
| `border(value)` | `string\|boolean` | 设置边框 | `b.border('1px solid #ccc')` 或 `b.border()` |
| `color(color)` | `string` | 设置字体颜色 | `b.color('#333')` |
| `padding(value)` | `string` | 设置内边距 | `b.padding('md')` |
| `margin(value)` | `string` | 设置外边距 | `b.margin('lg')` |
| `width(value)` | `string` | 设置宽度 | `b.width('200px')` |
| `height(value)` | `string` | 设置高度 | `b.height('100px')` |

### 预设值

#### 圆角 (radius)
- `'sm'` → `4px`
- `'md'` → `6px`
- `'lg'` → `8px`
- `'xl'` → `12px`

#### 内边距 (padding)
- `'xs'` → `4px`
- `'sm'` → `6px`
- `'md'` → `8px`
- `'lg'` → `10px`
- `'xl'` → `16px`

#### 外边距 (margin)
- `'xs'` → `4px`
- `'sm'` → `6px`
- `'md'` → `8px`
- `'lg'` → `10px`
- `'xl'` → `16px`

#### 阴影 (shadow)
- `'sm'` → `0 2px 8px rgba(0,0,0,0.08)`
- `'md'` → `0 4px 12px rgba(0,0,0,0.08)`
- `'lg'` → `0 6px 16px rgba(0,0,0,0.15)`
- `'xl'` → `0 8px 24px rgba(0,0,0,0.12)`

### 快捷方法

| 方法 | 说明 | 等价于 |
|------|------|--------|
| `withShadow()` | 启用阴影 | `b.shadow(true)` |
| `withBorder()` | 启用边框 | `b.border(true)` |

## CSS 类

VBox 组件使用以下 CSS 类：

- `.yoya-box` - 基础类
- `.yoya-box--shadowed` - 阴影状态
- `.yoya-box--bordered` - 边框状态

### 辅助类

```css
/* 背景色辅助类 */
.yoya-box--bg-primary
.yoya-box--bg-secondary
.yoya-box--bg-tertiary
.yoya-box--bg-success
.yoya-box--bg-warning
.yoya-box--bg-error
.yoya-box--bg-info

/* 圆角辅助类 */
.yoya-box--radius-sm
.yoya-box--radius-md
.yoya-box--radius-lg
.yoya-box--radius-xl
.yoya-box--radius-full

/* 间距辅助类 */
.yoya-box--padding-xs/sm/md/lg/xl
.yoya-box--margin-xs/sm/md/lg/xl
```

## 使用示例

### 1. 卡片式布局

```javascript
vBox(b => {
  b.background('#ffffff');
  b.shadow('md');
  b.radius('lg');
  b.padding('xl');
  b.text('卡片内容');
});
```

### 2. 半透明遮罩

```javascript
vBox(b => {
  b.background('#000000');
  b.opacity(0.5);
  b.width('100%');
  b.height('100%');
});
```

### 3. 彩色标签

```javascript
vBox(b => {
  b.background('var(--yoya-success-bg)');
  b.color('var(--yoya-success)');
  b.padding('sm');
  b.radius('sm');
  b.text('成功标签');
});
```

### 4. 组合使用

```javascript
vBox(container => {
  container.padding('xl');

  // 子容器 1
  container.vBox(box1 => {
    box1.background('var(--yoya-primary-alpha)');
    box1.radius('md');
    box1.padding('lg');
    box1.margin('md');
    box1.text('内容区域 1');
  });

  // 子容器 2
  container.vBox(box2 => {
    box2.background('var(--yoya-success-bg)');
    box2.color('var(--yoya-success)');
    box2.radius('md');
    box2.padding('lg');
    box2.margin('md');
    box2.text('内容区域 2');
  });
});
```

### 5. 作为布局容器

```javascript
vBox(layout => {
  layout.styles({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  });

  // 网格项目
  for (let i = 1; i <= 3; i++) {
    layout.vBox(item => {
      item.background('#fff');
      item.shadow();
      item.radius('md');
      item.padding('lg');
      item.text(`项目 ${i}`);
    });
  }
});
```

## 作为 Tag 子元素

```javascript
import { vCard } from '../yoya/index.js';

vCard(card => {
  card.vCardHeader('标题');

  // 在卡片内部使用 VBox
  card.vBox(content => {
    content.background('var(--yoya-bg-tertiary)');
    content.padding('lg');
    content.text('内容');
  });
});
```

## 注意事项

1. **默认透明** - VBox 默认背景透明，如需背景色请显式调用 `background()` 方法
2. **字体颜色继承** - 默认 `color: inherit`，会继承父元素的字体颜色
3. **宽高 100%** - 默认宽高均为 100%，可根据需要覆盖
4. **主题变量** - 推荐使用主题变量（如 `var(--yoya-primary)`）以保持主题一致性
