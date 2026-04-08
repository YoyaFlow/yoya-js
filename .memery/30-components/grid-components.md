# VGrid 24 栅格系统组件

## 概述

VGrid 组件提供 24 等分栅格布局系统，支持响应式断点、列间距、偏移等常用布局功能。

**文件位置**: `src/yoya/components/grid.js`
**CSS 文件**: `src/yoya/theme/css/components/grid.css`

## 组件列表

| 组件名 | 工厂函数 | 说明 |
|--------|----------|------|
| VRow | vRow | 栅格行容器，支持 gutter 响应式 |
| VCol | vCol | 栅格列，支持 span/offset/响应式断点 |

## 基础用法

### 均分列

```javascript
import { vRow, vCol } from '../yoya/index.js';

vRow(r => {
  r.col(c => c.span(12)).text('左');
  r.col(c => c.span(12)).text('右');
});
```

### 带间距

```javascript
vRow(r => {
  r.gutter(16);  // 16px 间距
  r.col(c => c.span(8)).text('左');
  r.col(c => c.span(16)).text('右');
});
```

### 偏移

```javascript
vRow(r => {
  r.col(c => c.span(8).offset(8)).text('偏移 8 列');
});
```

### 响应式

```javascript
vRow(r => {
  r.col(c => {
    c.span(24).xsSpan(12).mdSpan(8).lgSpan(6);
  }).text('响应式列');
});
```

### 垂直对齐

```javascript
vRow(r => {
  r.align('top');     // top | middle | bottom | stretch
  r.justify('start'); // start | center | end | between | around
  r.col(c => c.span(12)).text('左');
  r.col(c => c.span(12)).text('右');
});
```

## API 参考

### VRow

| 方法 | 参数 | 说明 | 返回值 |
|------|------|------|--------|
| `gutter(value)` | number\|string\|object | 列间距（支持响应式对象） | this |
| `align(type)` | string | 垂直对齐：top/middle/bottom/stretch | this |
| `justify(type)` | string | 水平对齐：start/center/end/between/around | this |
| `wrap(bool)` | boolean | 是否换行 | this |
| `col(setup)` | function | 添加子列 | this |

### VCol

| 方法 | 参数 | 说明 | 返回值 |
|------|------|------|--------|
| `span(n)` | number (1-24) | 占位格数 | this |
| `offset(n)` | number (0-24) | 偏移格数 | this |
| `order(n)` | number | 布局顺序 | this |
| `xsSpan(n)` | number | <576px 断点占位 | this |
| `smSpan(n)` | number | ≥576px 断点占位 | this |
| `mdSpan(n)` | number | ≥768px 断点占位 | this |
| `lgSpan(n)` | number | ≥992px 断点占位 | this |
| `xlSpan(n)` | number | ≥1200px 断点占位 | this |
| `xxlSpan(n)` | number | ≥1600px 断点占位 | this |
| `xsOffset(n)` | number | <576px 断点偏移 | this |
| `smOffset(n)` | number | ≥576px 断点偏移 | this |
| `mdOffset(n)` | number | ≥768px 断点偏移 | this |
| `lgOffset(n)` | number | ≥992px 断点偏移 | this |
| `xlOffset(n)` | number | ≥1200px 断点偏移 | this |
| `xxlOffset(n)` | number | ≥1600px 断点偏移 | this |

## 响应式断点

| 断点 | 媒体查询 | 说明 |
|------|----------|------|
| xs | < 576px | 超小屏幕（手机） |
| sm | ≥ 576px | 小屏幕（平板） |
| md | ≥ 768px | 中屏幕（桌面） |
| lg | ≥ 992px | 大屏幕（宽屏桌面） |
| xl | ≥ 1200px | 超大屏幕（大宽屏） |
| xxl | ≥ 1600px | 特大屏幕 |

## CSS 类名

### VRow

- `.yoya-row` - 基础类名

### VCol

- `.yoya-col` - 基础类名
- `.yoya-col--span-{n}` - 占位类名（1-24）
- `.yoya-col--offset-{n}` - 偏移类名（0-24）
- `.yoya-col--order-{n}` - 顺序类名（1-24）
- `.yoya-col--{bp}-span-{n}` - 响应式占位
- `.yoya-col--{bp}-offset-{n}` - 响应式偏移
- `.yoya-col--{bp}-order-{n}` - 响应式顺序

## 与 Grid 组件的区别

| 特性 | Grid (现有) | VGrid (新增) |
|------|-----------|-------------|
| 底层技术 | CSS Grid Layout | Flexbox + 百分比宽度 |
| 布局方式 | 显式/隐式轨道 | 24 等分栅格 |
| 响应式 | 手动媒体查询 | 内置断点系统 |
| 使用场景 | 通用网格布局 | 标准化页面布局 |
| 类比 | CSS Grid 原生封装 | Ant Design Row/Col |

## 使用示例

### 响应式布局

```javascript
// 手机端单列，平板端双列，桌面端四列
vRow(r => {
  r.gutter(16);
  r.col(c => {
    c.span(24).smSpan(12).lgSpan(6);
  }).text('项目 1');

  r.col(c => {
    c.span(24).smSpan(12).lgSpan(6);
  }).text('项目 2');

  r.col(c => {
    c.span(24).smSpan(12).lgSpan(6);
  }).text('项目 3');

  r.col(c => {
    c.span(24).smSpan(12).lgSpan(6);
  }).text('项目 4');
});
```

### 偏移居中

```javascript
// 中间 12 列，两侧各偏移 6 列
vRow(r => {
  r.col(c => {
    c.span(12).offset(6);
  }).text('居中内容');
});
```

### 混合布局

```javascript
// 复杂页面布局
vRow(r => {
  r.gutter(20);

  // 左侧边栏
  r.col(c => {
    c.span(6).lgSpan(4);
  }).text('侧边栏');

  // 主内容区
  r.col(c => {
    c.span(18).lgSpan(16);
  }).text('主内容');
});
```

## 相关文件

- `src/yoya/components/grid.js` - 组件实现
- `src/yoya/theme/css/components/grid.css` - CSS 样式
- `docs/superpowers/specs/2026-03-18-component-development-plan-design.md` - 开发计划
