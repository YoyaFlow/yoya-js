# yoya-layout

Yoya.Basic 布局组件使用技能。当用户需要使用 Flex、Grid、Stack 等布局组件时触发此技能。

## 触发条件

- 用户需要创建页面布局
- 用户询问如何使用 Flex、Grid、Stack 等布局组件
- 用户需要实现响应式布局
- 用户需要居中、间距等特定布局效果

## 布局组件概览

| 组件 | 用途 | CSS 属性 |
|------|------|----------|
| `flex` | 弹性布局 | `display: flex` |
| `grid` | 网格布局 | `display: grid` |
| `responsiveGrid` | 响应式网格 | `grid-template-columns: repeat(auto-fit, minmax())` |
| `vstack` | 垂直堆叠 | `flex-direction: column` |
| `hstack` | 水平堆叠 | `flex-direction: row` |
| `center` | 居中布局 | `justify-content: center; align-items: center` |
| `container` | 响应式容器 | `max-width` + 内边距 |
| `spacer` | 弹性占位 | `flex: 1` |
| `divider` | 分割线 | `border-top` |

## Flex 布局

### 基础用法

```javascript
import { flex, div } from './yoya/index.js';

flex(f => {
  // 主轴方向
  f.row();           // 水平排列（默认）
  f.column();        // 垂直排列

  // 主轴对齐
  f.justifyStart();
  f.justifyCenter();
  f.justifyEnd();
  f.justifyBetween();
  f.justifyAround();

  // 交叉轴对齐
  f.alignStart();
  f.alignCenter();
  f.alignEnd();
  f.alignStretch();

  // 换行
  f.wrap();
  f.nowrap();

  // 添加项目
  f.div('项目 1');
  f.div('项目 2');
}).bindTo('#app');
```

### 示例：居中布局

```javascript
flex(f => {
  f.justifyCenter().alignCenter();
  f.div('居中内容');
}).style('height', '100vh').bindTo('#app');
```

## Grid 布局

### 基础用法

```javascript
import { grid, div } from './yoya/index.js';

grid(g => {
  // 定义列
  g.columns(3);              // 3 列等宽
  g.columns(4);              // 4 列等宽
  g.columns('200px 1fr 2fr'); // 自定义列宽

  // 定义行
  g.rows(2);                 // 2 行等高
  g.rows('100px auto');      // 自定义行高

  // 间距
  g.gap('16px');
  g.rowGap('10px');
  g.columnGap('20px');

  // 添加项目
  g.div('项目 1');
  g.div('项目 2');
}).bindTo('#app');
```

### 示例：3 列布局

```javascript
grid(g => {
  g.columns(3);
  g.gap('20px');

  for (let i = 1; i <= 6; i++) {
    g.div(div => {
      div.text(`项目${i}`);
      div.style('background', '#f0f0f0');
      div.style('padding', '20px');
    });
  }
}).bindTo('#app');
```

## 响应式 Grid

### 自适应列数

```javascript
import { responsiveGrid, div } from './yoya/index.js';

responsiveGrid(g => {
  // 最小宽度 250px，自动计算列数
  g.minSize('250px');
  g.gap('16px');

  for (let i = 1; i <= 12; i++) {
    g.div(`项目${i}`);
  }
}).bindTo('#app');
```

## Stack 堆叠布局

### VStack 垂直堆叠

```javascript
import { vstack, div } from './yoya/index.js';

vstack(s => {
  s.gap('16px');           // 间距
  s.div('上方内容');
  s.div('中间内容');
  s.div('下方内容');
}).bindTo('#app');
```

### HStack 水平堆叠

```javascript
import { hstack, div } from './yoya/index.js';

hstack(s => {
  s.gap('12px');
  s.div('左侧');
  s.div('中间');
  s.div('右侧');
}).bindTo('#app');
```

## Center 居中布局

```javascript
import { center, div } from './yoya/index.js';

center(c => {
  c.div('水平垂直居中');
}).style('height', '100vh').bindTo('#app');
```

## Container 响应式容器

```javascript
import { container, div } from './yoya/index.js';

container(c => {
  c.h1('页面标题');
  c.p('页面内容...');
}).bindTo('#app');

// 可选：自定义最大宽度
container(c => {
  c.h1('标题');
}).maxWidth('1200px').bindTo('#app');
```

## Spacer 弹性占位

```javascript
import { flex, spacer, div } from './yoya/index.js';

flex(f => {
  f.div('左侧');
  f.spacer();              // 自动填充剩余空间
  f.div('右侧');
}).bindTo('#app');
```

## Divider 分割线

```javascript
import { vstack, divider } from './yoya/index.js';

vstack(s => {
  s.div('上方内容');
  s.divider();             // 分割线
  s.div('下方内容');
}).bindTo('#app');
```

## 组合布局示例

### 典型页面布局

```javascript
import { vstack, hstack, flex, grid, container, divider } from './yoya/index.js';

// 整体页面
vstack(page => {
  // 页头
  page.header(h => {
    h.h1('网站标题');
  }).style('background', '#333').style('color', '#fff').style('padding', '20px');

  page.divider();

  // 主体内容
  flex(main => {
    // 侧边栏
    main.aside(s => {
      s.style('width', '200px');
      s.style('background', '#f5f5f5');
      s.style('padding', '20px');
      s.div('导航 1');
      s.div('导航 2');
    });

    // 主内容区
    main.section(c => {
      c.style('flex', '1');
      c.style('padding', '20px');
      c.h2('主内容');
      c.p('这里是主要内容区域...');
    });
  });

  page.divider();

  // 页脚
  page.footer(f => {
    f.justifyCenter();
    f.div('© 2024 版权所有');
  }).style('background', '#333').style('color', '#fff').style('padding', '10px');

}).bindTo('#app');
```

### 卡片网格布局

```javascript
import { responsiveGrid, vCard } from './yoya/index.js';

responsiveGrid(g => {
  g.minSize('280px');
  g.gap('24px');

  // 创建多个卡片
  const cards = [
    { title: '卡片 1', content: '内容 1' },
    { title: '卡片 2', content: '内容 2' },
    { title: '卡片 3', content: '内容 3' },
  ];

  cards.forEach(card => {
    g.div(vCard(c => {
      c.cardHeader(card.title);
      c.cardBody(card.content);
    }));
  });
}).bindTo('#app');
```

## 常用样式方法

所有布局组件都支持链式样式设置：

```javascript
flex(f => {
  f.justifyCenter();
  f.style('background', '#f0f0f0');
  f.style('padding', '20px');
  f.style('border-radius', '8px');
  f.styles({
    margin: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });
}).bindTo('#app');
```

## 注意事项

1. **布局组件默认返回实例**，需要调用 `.bindTo()` 绑定到 DOM
2. **setup 函数中可以使用所有子元素方法**，如 `.div()`, `.span()`, `.button()` 等
3. **响应式 Grid 自动根据最小宽度计算列数**，无需手动设置断点
4. **Flex 布局支持链式调用**，可以连续设置多个属性
