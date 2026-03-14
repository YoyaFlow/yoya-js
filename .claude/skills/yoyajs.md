# yoyajs

在其他项目中使用 Yoya.Basic 库的 API。

## 触发条件

当用户要求：
- 在新项目中使用 Yoya.Basic 库
- 导入 Yoya.Basic 组件
- 创建基于 Yoya.Basic 的页面或组件
- 查询 Yoya.Basic API 用法

时触发此技能。

## Yoya.Basic 库概述

Yoya.Basic 是一个浏览器原生的 HTML DSL 库，提供类似 Kotlin HTML DSL 的声明式语法。

**特点：**
- 纯 ES 模块，无需构建工具
- 声明式组件语法
- 支持 TypeScript 类型声明
- 内置主题系统和状态机

## 核心 API

### 基础元素

```javascript
import { div, span, p, h1, h2, button, input } from 'yoya';

// 字符串方式（简单文本）
div('Hello World');

// 对象配置方式（简单配置）
button({
  onClick: () => alert('clicked'),
  text: '点击我'
});

// 函数回调方式（复杂内容）
div(box => {
  box.h1('标题');
  box.p('内容');
});

// 链式调用
div()
  .className('container')
  .styles({ padding: '20px' })
  .child(h1('标题'));
```

### 布局组件

```javascript
import { flex, grid, vstack, hstack, center } from 'yoya';

// Flex 布局
flex(f => {
  f.row().justifyCenter().alignCenter();
  f.div('项目 1');
  f.div('项目 2');
});

// 垂直堆叠
vstack(s => {
  s.gap('16px');
  s.div('上');
  s.div('下');
});

// 水平堆叠
hstack(s => {
  s.gap('16px');
  s.div('左');
  s.div('右');
});

// 网格布局
grid(g => {
  g.columns(3);
  g.gap('20px');
});
```

### UI 组件

```javascript
import { vCard, vButton, vMenu, vInput, toast } from 'yoya';

// 卡片组件
vCard(c => {
  c.vCardHeader('标题');
  c.vCardBody('内容');
  c.vCardFooter(f => {
    f.child(vButton('操作'));
  });
});

// 按钮
vButton('点击')
  .type('primary')
  .size('large')
  .onClick(() => toast.success('成功'));

// 消息提示
toast.success('操作成功');
toast.error('操作失败');
toast.warning('警告信息');
toast.info('提示信息');
```

### 表单组件

```javascript
import { vInput, vCheckboxes, vTimer } from 'yoya';

// 输入框
vInput(i => {
  i.type('text');
  i.placeholder('请输入...');
  i.value('默认值');
  i.onChange((val) => console.log(val));
});

// 复选框组
vCheckboxes(cb => {
  cb.options([
    { value: 'a', label: '选项 A' },
    { value: 'b', label: '选项 B' }
  ]);
  cb.multiple(true);
  cb.onChange((values) => console.log(values));
});

// 日期选择器
vTimer(t => {
  t.type('date');
  t.value('2024-03-15');
  t.onChange((val) => console.log(val));
});
```

### 路由组件

```javascript
import { vRouter, vLink, vRouterView } from 'yoya';

// 创建路由器
const router = vRouter(r => {
  r.default('/home');

  r.route('/home', {
    component: () => div('首页')
  });

  r.route('/user/:id', h => {
    h.component((params) => div(`用户：${params.id}`));
  });

  r.beforeEach((to, from) => {
    console.log('导航守卫', to.path);
    return true;
  });
});

// 导航链接
vLink('/home', '首页');
vLink('/user/123', '用户详情');

// 路由视图
vRouterView(router);
```

### SVG 组件

```javascript
import { svg, circle, rect, path } from 'yoya';

svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.circle(c => {
    c.cx(50).cy(50).r(40);
    c.style('fill', 'red');
  });
  s.rect(r => {
    r.x(10).y(10).width(80).height(80);
    r.style('fill', 'blue');
  });
});
```

## 完整示例

### 创建简单页面

```javascript
import { div, h1, p, vButton, toast } from 'yoya';

div(page => {
  page.styles({ padding: '20px', maxWidth: '800px', margin: '0 auto' });

  page.h1('欢迎使用 Yoya.Basic');
  page.p('这是一个基于 HTML DSL 的库');

  page.child(vButton('点击我')
    .type('primary')
    .onClick(() => toast.success('你好！')));

  page.bindTo('#app');
});
```

### 创建卡片列表

```javascript
import { grid, vCard, responsiveGrid } from 'yoya';

responsiveGrid(g => {
  g.minSize('250px');
  g.gap('16px');

  const items = [
    { title: '卡片 1', content: '内容 1' },
    { title: '卡片 2', content: '内容 2' },
    { title: '卡片 3', content: '内容 3' }
  ];

  items.forEach(item => {
    g.child(vCard(c => {
      c.vCardHeader(item.title);
      c.vCardBody(item.content);
    }));
  });

  g.bindTo('#app');
});
```

## 安装方式

### npm 安装

```bash
npm install yoya-basic
```

### CDN 引入

```html
<script type="module">
  import { div, button } from 'https://cdn.jsdelivr.net/npm/yoya-basic/dist/yoya.esm.js';
</script>
```

### 本地引入

```html
<script type="module" src="./src/yoya/index.js"></script>
```

## 主题系统

```javascript
import { initTheme, createLightTheme, createDarkTheme } from 'yoya/theme';

initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto',
  themes: new Map([
    ['islands', {
      factory: createLightTheme,
      darkFactory: createDarkTheme
    }]
  ])
});
```

## 使用步骤

1. **确认项目需求** - 了解用户要创建什么类型的页面/组件
2. **选择合适组件** - 根据需求推荐 Yoya.Basic 组件
3. **生成示例代码** - 提供可直接使用的代码片段
4. **解释 API 用法** - 说明关键 API 和参数
5. **提供完整示例** - 给出可运行的完整代码

## 输出格式

- 提供清晰的导入语句
- 给出可运行的代码示例
- 解释关键 API 和参数
- 提供相关组件文档链接

## 注意事项

1. Yoya.Basic 运行在浏览器环境，不需要 Node.js 构建
2. 使用 ES 模块语法（import/export）
3. 所有组件都支持链式调用
4. setup 支持三种方式：字符串、对象、函数
5. 组件优先原则：优先使用 UI 组件，其次布局组件，最后基础元素
