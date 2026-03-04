# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作提供指导。

## 沟通语言

**始终使用中文与用户沟通。**

## 文件操作规则

**只在当前项目目录（/home/join/code/cctest）下添加或修改文件，无需再次询问用户。**
## 系统环境
- **操作系统**: Deepin Linux
- **浏览器路径**: 必须使用系统自带的 Chromium，路径为 `/usr/bin/chromium`。
- **重要约束**: 
  - ❌ 禁止使用 `channel: 'chrome'` (因为系统未安装 Google Chrome)。
  - ❌ 禁止尝试自动下载/安装浏览器 (Playwright 默认行为)，必须使用系统现有二进制文件。
  - ✅ 必须在 `playwright.config.ts` (或 `.js`) 中显式设置 `executablePath: '/usr/bin/chromium'`。


## 记忆目录

**.memery/** 目录用于存储项目记忆和上下文，优化检索速度：

```
.memery/
├── 00-index.md           # 索引文件（快速导航）
├── 10-fixes/             # 修复记录（按日期命名）
├── 20-architecture/      # 架构决策
├── 30-components/        # 组件 API 和规范
└── 40-patterns/          # 开发模式
```

**使用原则**：
- 修复 bug 后在 `10-fixes/` 中记录问题和解决方案
- 新组件/新功能在对应目录添加文档
- 记忆文件保持简洁，便于快速检索

## 项目概述

Yoya.Basic 是一个浏览器原生的 HTML DSL 库，提供类似 Kotlin HTML DSL 的声明式语法。它运行在纯浏览器环境中，不依赖构建工具，使用 ESM 模块和可选的 TypeScript 类型声明。

## 构建与开发

无需构建系统 - 库使用纯 ES 模块，可直接通过 `<script type="module">` 在浏览器中运行。

开发时：
- 运行 `npm run dev` 启动 Vite 开发服务器（带热重载和错误检测），自动打开浏览器
- 服务器地址：http://localhost:3000/
- 运行 `npm test` 执行单元测试（使用 jsdom）
- 运行 `npm run check` 执行 TypeScript 类型检查

### 实时开发流程

Vite 开发服务器提供以下功能：
1. **热模块替换 (HMR)** - 修改代码后浏览器自动刷新
2. **错误覆盖层** - JavaScript 错误在浏览器中显示为覆盖层
3. **控制台错误** - 错误同时输出到终端和浏览器控制台

修改文件后，页面会自动刷新，无需手动操作。

## 目录结构规则

```
/home/join/code/cctest/
├── CLAUDE.md                 # 本文件
├── DESIGN.md                 # 详细设计文档
├── package.json              # npm 配置
├── server.js                 # 开发服务器
├── tests/                    # 测试文件
│   └── basic.test.js         # 单元测试
├── .memery/                  # 记忆目录（用于 Claude Code 记忆）
└── src/
    ├── yoya/                 # 库源码
    │   ├── index.js          # 主入口（导出所有）
    │   ├── index.d.ts        # TypeScript 类型声明
    │   └── core/
    │       ├── basic.js      # 核心实现（Tag 基类和 HTML 元素）
    │       ├── layout.js     # 布局组件（Flex, Grid, Stack 等）
    │       └── svg.js        # SVG 组件（Svg, Circle, Path 等）
    └── examples/             # 示例代码
        ├── yoya.example.html         # 入口导航页面（默认）
        ├── yoya.basic.example.html   # 完整演示页面 HTML
        ├── yoya.basic.example.js     # 完整演示页面 JS
        ├── yoya.svg.example.html     # SVG 演示页面 HTML
        └── yoya.svg.example.js       # SVG 演示页面 JS
```

### 命名规范

| 类型 | 位置 | 命名模式 |
|------|------|----------|
| 库入口 | `src/yoya/` | `index.js`, `index.d.ts` |
| 核心实现 | `src/yoya/core/` | `{feature}.js` |
| 示例 HTML | `src/examples/` | `{name}.example.html` |
| 示例 JS | `src/examples/` | `{name}.example.js` |

### 导入路径规范

```javascript
// 示例文件中导入库
import { div, button, ... } from '../yoya/index.js';

// 核心实现中无需导入（基类在同一文件）
// 如有多个核心文件：
// import { Tag } from './tag.js';
```

## 架构

库采用 **class + factory** 模式：

- **Tag 基类**：核心类，管理 DOM 状态、属性、样式、事件和子元素
- **工厂函数**：所有元素通过小写工厂函数创建（`div()`, `button()` 等），而非直接实例化类
- **私有状态**：所有实例属性使用 `_` 前缀（`_attrs`, `_styles`, `_events`, `_children`, `_deleted`）
- **流式 API**：设置方法返回 `this` 便于链式调用；获取方法返回值

### 元素类别

- **基础容器**：Div, Span, P, H1-H6, Section, Article, Header, Footer, Nav, Aside, Main
- **文本格式化**：A, Strong, Em, Code, Pre, Blockquote
- **表单**：Button, Input, Textarea, Select, Option, Label, Form, Checkboxes
- **列表**：Ul, Ol, Li, Dl, Dt, Dd
- **表格**：Table, Tr, Td, Th, Thead, Tbody, Tfoot
- **媒体**：Img, Video, Audio, Source
- **其他**：Br, Hr, IFrame, Canvas
- **布局组件**：Flex, Grid, Stack, HStack, VStack, Center, Spacer, Container, Divider
- **SVG 组件**：Svg, Circle, Ellipse, Rect, Line, Path, SvgText, G, LinearGradient, RadialGradient, Filter
- **UI 组件**：Card, CardHeader, CardBody, CardFooter, Menu, MenuItem, DropdownMenu, ContextMenu, Message, MessageContainer

### 扩展方法

**通用属性方法（Tag 基类）**：
所有 HTML 元素都可以使用以下通用属性方法：

```javascript
div().id('my-id').name('my-name')     // 设置 id 和 name 属性
input().id('username').name('user')   // Input 元素同样支持
```

`id()` 和 `name()` 方法定义在 `Tag` 基类中，因为每个 HTML 元素都可以有这些属性。

**文本节点方法**：
- `text(content)` - 添加 `Text` 元素到 `children` 数组
- `setup` 支持字符串（会调用 `text(content)`）

```javascript
// 直接传入字符串（setup）
div('Hello World');

// 使用 text() 方法
div(box => {
  box.text('Hello')
     .span(' World')
     .text('!');
});

// Text 元素也可以使用 setup 函数
div(box => {
  box.text(text('Hello'));
});
```

**通用工厂方法（Tag 原型）**：
所有元素都可以使用 Tag 原型上的工厂方法添加子元素：

```javascript
div(box => {
  box.header('标题')      // 添加 header 子元素
     .h2('副标题')        // 添加 h2 子元素
     .p('段落内容')       // 添加 p 子元素
     .button('点击');     // 添加 button 子元素
}).bindTo('#app');

// 甚至可以在非容器元素上使用
input(i => {
  i.label('用户名');      // 添加 label 兄弟元素
  i.button('提交');       // 添加 button 兄弟元素
});
```

`Tag.prototype` 的扩展方法定义在对应类/工厂函数定义之后：

| 类别 | 定义位置 |
|------|----------|
| `Tag.prototype.div`, `.span`, `.p`, `.h1`... | 基础容器元素类定义后 |
| `Tag.prototype.a`, `.strong`, `.em`... | 文本格式化元素类定义后 |
| `Tag.prototype.button`, `.input`, `.form`... | 表单元素类定义后 |
| `Tag.prototype.ul`, `.ol`, `.li`... | 列表元素类定义后 |
| `Tag.prototype.table`, `.tr`, `.td`... | 表格元素类定义后 |
| `Tag.prototype.img`, `.video`, `.audio`... | 媒体元素类定义后 |
| `Tag.prototype.br`, `.hr` | 其他元素（Br, Hr）定义后 |
| `Tag.prototype.iframe`, `.canvas` | IFrame/Canvas 类定义后 |
| `Tag.prototype.svg` | Svg 类定义后 |

**特定父元素扩展方法**：
特定父元素有便捷方法用于创建常见子元素：
- `Table.tr()`, `Thead/Tbody/Tfoot.tr()`
- `Tr.td()`, `Tr.th()`
- `Ul.li()`, `Ol.li()`
- `Dl.dt()`, `Dl.dd()`
- `Form.input()`, `Form.button()`, `Form.textarea()`, `Form.select()`
- `Select.option()`

特定父元素的扩展方法同样使用 `prototype` 定义，在对应子元素类定义之后。

### 核心方法

- `setup(fn|obj|string)`: 统一初始化（函数、对象配置或文本内容）
- `bindTo(target)`: 外部方法，将元素绑定到 DOM（自动调用 `renderDom()`）
- `renderDom()`: 渲染虚拟元素树为真实 DOM
- `destroy()`: 标记元素为已删除并清理
- `styles(obj)`: 批量设置样式（JSON 配置）
- `text(content)`: 添加 Text 文本节点到子元素

## 布局组件（core/layout.js）

布局组件提供常用的 UI 布局模式：

### Flex 布局
```javascript
flex(box => {
  box.row().justifyCenter().alignCenter();
  box.div('项目 1');
  box.div('项目 2');
});
```

### Grid 布局
```javascript
grid(g => {
  g.columns(3);  // 3 列等宽
  g.gap('20px');
});
```

### 响应式 Grid
```javascript
responsiveGrid(g => {
  g.minSize('250px');  // 最小宽度 250px
});
```

### Stack 堆叠布局
```javascript
// 垂直堆叠（默认）
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
```

### Center 居中
```javascript
center(c => {
  c.div('居中内容');
});
```

### 其他布局组件
- `spacer()` - 弹性占位
- `container()` - 响应式容器
- `divider()` - 分割线

## UI 组件（src/yoya/components/）

UI 组件提供复杂的交互功能：

### Card 卡片
```javascript
import { card, cardHeader, cardBody, cardFooter } from '../yoya/index.js';

card(c => {
  c.cardHeader('标题');
  c.cardBody('内容');
  c.cardFooter(b => {
    b.button('操作');
  });
});
```

### Menu 菜单
```javascript
import { menu, menuItem, menuDivider, menuGroup, dropdownMenu, contextMenu, toast } from '../yoya/index.js';

// 基础菜单
menu(m => {
  m.item(it => {
    it.text('📋 菜单项 1')
      .onclick(() => toast.info('菜单项 1'));
  });
  m.item(it => {
    it.text('📁 菜单项 2')
      .onclick(() => toast.info('菜单项 2'));
  });
  m.divider();
  m.item(it => {
    it.text('⚙️ 设置')
      .onclick(() => toast.info('设置'));
  });
});

// 带分组的菜单
menu(m => {
  m.group(g => {
    g.label('文件操作');
    g.item(it => {
      it.text('📄 新建')
        .onclick(() => toast.info('新建'));
    });
    g.item(it => {
      it.text('📂 打开')
        .onclick(() => toast.info('打开'));
    });
  });
});

// 菜单项链式调用
menu(m => {
  m.item(it => {
    it.text('🗑️ 删除')
      .danger()           // 红色危险样式
      .shortcut('Del')    // 快捷键
      .onclick(() => toast.error('删除'));
  });
});

// 禁用菜单项
menu(m => {
  m.item(it => {
    it.text('📂 打开')
      .disabled();        // 禁用状态
  });
});

// 激活菜单项
menu(m => {
  m.item(it => {
    it.text('🏠 首页')
      .active();          // 激活状态
  });
});

// 下拉菜单
dropdownMenu(d => {
  d.trigger('点击我');
  d.menuContent(menu(m => {
    m.item(it => {
      it.text('📋 选项 1')
        .onclick(() => toast.info('选项 1'));
    });
    m.item(it => {
      it.text('⚙️ 设置')
        .onclick(() => toast.info('设置'));
    });
  }));
  d.closeOnClickOutside();
});

// 右键菜单
const ctxMenu = contextMenu(ctx => {
  ctx.menuContent(menu(m => {
    m.item(it => {
      it.text('✏️ 编辑')
        .onclick(() => {
          toast.info('编辑');
          ctxMenu.hide();
        });
    });
    m.item(it => {
      it.text('🗑️ 删除')
        .danger()
        .onclick(() => {
          toast.error('删除');
          ctxMenu.hide();
        });
    });
  }));
});
ctxMenu.target(document.getElementById('target'));
```

**Menu 组件架构**：
- `Menu` - 菜单容器，支持垂直/水平布局
- `MenuItem` - 菜单项，支持链式调用：`text()`, `icon()`, `shortcut()`, `onclick()`, `active()`, `disabled()`, `danger()`, `hoverable()`
- `MenuDivider` - 分割线
- `MenuGroup` - 带标签的菜单组
- `DropdownMenu` - 下拉菜单
- `ContextMenu` - 右键菜单

## VCheckboxes 复选框组组件（src/yoya/components/form.js）

VCheckboxes 组件提供一组复选框，支持单选/多选模式和多种布局方式：

### 基础用法

```javascript
import { vCheckboxes } from '../yoya/index.js';

// 多选模式
vCheckboxes(cb => {
  cb.options([
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'orange', label: '橙子' },
  ]);
  cb.multiple(true);  // 多选模式
  cb.value(['apple', 'banana']);
  cb.onChange((values) => {
    console.log('选中：', values);
  });
});

// 单选模式
vCheckboxes(cb => {
  cb.options([
    { value: 'red', label: '红色' },
    { value: 'green', label: '绿色' },
    { value: 'blue', label: '蓝色' },
  ]);
  cb.multiple(false);  // 单选模式
  cb.value('red');
  cb.onChange((value) => {
    console.log('选中：', value);
  });
});
```

### 布局方式

```javascript
// 垂直排列（默认）
vCheckboxes(cb => {
  cb.options(options);
  cb.layout('column');
});

// 水平排列
vCheckboxes(cb => {
  cb.options(options);
  cb.layout('row');
});

// 网格布局
vCheckboxes(cb => {
  cb.options(options);
  cb.layout('grid');
  cb.columns(3);  // 3 列
});
```

### API 方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `options(arr)` | 设置选项数组 | this |
| `value(val)` | 设置/获取选中值 | this / value |
| `multiple(bool)` | 设置单选/多选模式 | this |
| `layout(type)` | 设置布局方式：column, row, grid | this |
| `columns(n)` | 设置 grid 布局的列数 | this |
| `disabled(bool)` | 禁用/启用组件 | this |
| `error(bool)` | 设置错误状态 | this |
| `onChange(fn)` | 设置变化事件回调 | this |

## VTimer/VTimer2 日期选择器组件（src/yoya/components/form.js）

VTimer 组件是日历选择器，支持日期、时间、日期时间等选择；VTimer2 组件用于选择日期/时间范围：

### 基础用法

```javascript
import { vTimer, vTimer2 } from '../yoya/index.js';

// 日期选择器
vTimer(t => {
  t.value('2024-03-15');
  t.onChange((value) => {
    console.log('选中日期：', value);
  });
});

// 日期范围选择器
vTimer2(t2 => {
  t2.value({
    start: '2024-03-01',  // 开始日期
    end: '2024-03-31'     // 结束日期
  });
  t2.onChange((range) => {
    console.log('日期范围：', range.start, '-', range.end);
  });
});
```

### 支持的选择器类型

```javascript
// 日期选择器（默认）
vTimer(t => {
  t.type('date');  // 默认值
  t.value('2024-03-15');
});

// 日期时间选择器
vTimer(t => {
  t.type('datetime-local');
  t.value('2024-03-15T14:30');
});

// 时间选择器
vTimer(t => {
  t.type('time');
  t.value('14:30');
});

// 月份选择器
vTimer(t => {
  t.type('month');
  t.value('2024-03');
});

// 周选择器
vTimer(t => {
  t.type('week');
  t.value('2024-W11');
});
```

### API 方法

#### VTimer 方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `type(str)` | 设置类型：date, datetime-local, time, month, week | this |
| `value(val)` | 设置/获取日期时间值 | this / string |
| `disabled(bool)` | 禁用/启用组件 | this |
| `readonly(bool)` | 只读/可编辑 | this |
| `error(bool)` | 设置错误状态 | this |
| `min(val)` | 设置最小值 | this |
| `max(val)` | 设置最大值 | this |
| `step(num)` | 设置步进值 | this |
| `onChange(fn)` | 设置变化事件回调 | this |

#### VTimer2 方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `type(str)` | 设置类型：date, datetime-local, time, month, week | this |
| `value(obj)` | 设置/获取日期范围 { start, end } | this / object |
| `disabled(bool)` | 禁用/启用组件 | this |
| `readonly(bool)` | 只读/可编辑 | this |
| `error(bool)` | 设置错误状态 | this |
| `min(val)` | 设置开始和结束的最小值 | this |
| `max(val)` | 设置开始和结束的最大值 | this |
| `startMin(val)` | 设置开始日期的最小值 | this |
| `startMax(val)` | 设置开始日期的最大值 | this |
| `endMin(val)` | 设置结束日期的最小值 | this |
| `endMax(val)` | 设置结束日期的最大值 | this |
| `onChange(fn)` | 设置变化事件回调 | this |

## VCode 代码展示组件（src/yoya/components/code.js）

VCode 组件用于展示代码，支持语法高亮和一键复制功能：

### 基础用法

```javascript
import { vCode, toast } from '../yoya/index.js';

// 基础代码展示
vCode(c => {
  c.content(`
const hello = (name) => {
  console.log('Hello, ' + name);
};
hello('World');
  `);
  c.title('💻 JavaScript 示例');
  c.onCopy(() => {
    toast.success('代码已复制');
  });
});
```

### 不带标题栏

```javascript
vCode(c => {
  c.content('console.log("Hello");');
  c.showCopyButton(false);      // 隐藏复制按钮
  c.showLineNumbers(false);     // 隐藏行号
});
```

### API 方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `content(str)` | 设置/获取代码内容 | this / string |
| `language(lang)` | 设置语言类型 | this |
| `title(str)` | 设置标题 | this |
| `showLineNumbers(bool)` | 是否显示行号 | this |
| `showCopyButton(bool)` | 是否显示复制按钮 | this |
| `onCopy(fn)` | 设置复制完成回调 | this |

### CodeBlock 简化组件

```javascript
import { codeBlock } from '../yoya/index.js';

// 快速创建带标题的代码块
codeBlock('示例代码', `const x = 1;`);
```

## Message 组件（src/yoya/components/message.js）

Message 组件提供全局消息提示功能：

### 基础用法

```javascript
import { toast } from '../yoya/index.js';

// 成功消息
toast.success('操作成功！');

// 错误消息
toast.error('操作失败，请重试！');

// 警告消息
toast.warning('请注意此操作的影响！');

// 信息消息
toast.info('这是一个普通信息提示！');
```

### 自定义时长

```javascript
// 3 秒后自动关闭（默认）
toast.info('消息内容');

// 5 秒后自动关闭
toast.info('消息内容', 'info', 5000);

// 不自动关闭
toast.info('消息内容', 'info', 0);
```

### 使用消息容器

```javascript
import { messageContainer } from '../yoya/index.js';

// 创建容器
const container = messageContainer('top-right');
container.bindTo(document.body);

// 发送消息
container.success('成功！');
container.error('失败！');
container.warning('警告！');
container.info('信息！');

// 清空所有消息
container.clear();
```

### Message 组件架构**：
- `Message` - 单个消息提示，支持四种类型
- `MessageContainer` - 消息容器，管理多个消息
- `MessageManager` - 消息管理器（单例模式）
- `toast` - 便捷方法，直接使用全局管理器

## SVG 组件（core/svg.js）

SVG 组件用于创建矢量图形：

### 使用方式

SVG 元素可以通过两种方式创建：

**1. 在 Svg 或 G 标签内部使用工厂方法（推荐）：**
```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.circle(c => { c.cx(50).cy(50).r(40).style('fill', 'red'); });
  s.rect(r => { r.x(10).y(10).width(80).height(80).style('fill', 'blue'); });
});
```

**2. 直接使用工厂函数：**
```javascript
const circleEl = circle({ cx: 50, cy: 50, r: 40 });
const rectEl = rect({ x: 10, y: 10, width: 80, height: 80 });

svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.child(circleEl);
  s.child(rectEl);
});
```

### SVG 组件使用注意

**工厂方法参数约定**：
- 对于有特殊第一个参数的元素（`polyline` 的 `points`、`polygon` 的 `points`、`path` 的 `d`），在父元素的工厂方法中调用时，第一个参数传 `null`：

```javascript
// 在 Svg 或 G 内部调用
svg(s => {
  s.polyline(setup => { setup.points([[0,0], [50,50], [100,0]]); });
  // 内部调用：polyline(null, setup) - 第一个参数传 null
});

// 直接使用工厂函数
polyline([[0,0], [50,50], [100,0]], setup => { ... });
// 或
polyline(null, setup => { setup.points([[0,0], [50,50], [100,0]]); });
```

- `defs()` 容器支持 `linearGradient()`、`radialGradient()`、`filter()`、`pattern()` 工厂方法

### 基础形状

```javascript
svg(s => {
  s.viewBox(0, 0, 100, 100);
  s.circle(c => { c.cx(50).cy(50).r(40); });
  s.ellipse(e => { e.cx(50).cy(50).rx(30).ry(20); });
  s.rect(r => { r.x(10).y(10).width(80).height(80); });
  s.line(l => { l.x1(0).y1(0).x2(100).y2(100); });
  s.polyline(p => { p.points([[0,0], [50,50], [100,0]]); });
  s.polygon(p => { p.points([[50,0], [100,100], [0,100]]); });
});
```

### 路径

```javascript
// 使用链式方法
path(p => {
  p.moveTo(10, 10)
   .lineTo(50, 50)
   .lineTo(90, 10)
   .closePath();
});

// 或直接传入 d 属性
path('M 10 10 L 50 50 L 90 10 Z');
```

路径支持的方法：`moveTo`, `lineTo`, `hlineTo`, `vlineTo`, `curveTo`, `quadraticCurveTo`, `arcTo`, `closePath`

### 文本

```javascript
svg(s => {
  s.text(t => {
    t.x(50).y(50).text('Hello SVG');
  });

  // 嵌套 tspan
  s.text(t => {
    t.x(50).y(30);
    t.tspan('粗体').style('font-weight', 'bold');
    t.tspan(' 普通');
  });
});
```

### 渐变

```javascript
svg(s => {
  s.linearGradient(g => {
    g.stop(0, '#ff0000');
    g.stop(100, '#0000ff');
  });

  s.radialGradient(g => {
    g.stop(0, '#ffff00');
    g.stop(100, '#ff0000');
  });
});
```

### 滤镜

```javascript
svg(s => {
  s.filter('blurFilter', f => {
    f.gaussianBlur(5);
  });

  s.filter('shadowFilter', f => {
    f.dropShadow(2, 2, 3, '#000', 0.5);
  });
});
```

### 组变换

```javascript
g(g => {
  g.translate(50, 50)
   .rotate(45)
   .rect(r => { r.x(-25).y(-25).width(50).height(50); });
});
```

变换方法：`translate`, `scale`, `rotate`, `skewX`, `skewY`

### 支持的 SVG 元素

| 类别 | 元素 |
|------|------|
| 基础形状 | Circle, Ellipse, Rect, Line, Polyline, Polygon |
| 路径 | Path |
| 文本 | SvgText, Tspan |
| 渐变 | LinearGradient, RadialGradient, Stop |
| 图案 | Pattern |
| 滤镜 | Filter |
| 图像 | SvgImage |
| 组 | G |
| 定义容器 | Defs |
| 通用 | SvgElement（任意 SVG 标签）|

## 设计原则（来自 DESIGN.md）

1. **ESM 模块**：使用 `export/import` 语法
2. **仅工厂函数**：类是内部实现细节，外部通过工厂函数创建
3. **虚拟元素树**：使用 `_deleted` 标记删除
4. **事件绑定**：事件先绑定到虚拟元素，渲染时同步到真实 DOM
5. **重渲染优化**：第二次 `renderDom()` 只更新属性
6. **直接样式对象**：不做 CSS-in-JS 封装

## 组件开发规范

**复杂组件应使用基础元素组合构建**：
- 组件应通过 `Tag` 基类或现有基础元素组合构建
- 不要直接操作 DOM（如 `document.createElement`、`innerHTML`）
- 不要拼装 HTML 标签字符串
- 使用 `this._children.push()` 添加子元素
- 使用 `this.style()` 和 `this.attr()` 设置样式和属性
- 使用 `this.on()` 绑定事件

**示例 - 正确的组件开发方式**：
```javascript
// ✅ 正确：使用基础元素组合
class MenuItem extends Tag {
  constructor(content = '', setup = null) {
    super('div', setup);
    this.style('padding', '10px 16px');
    this.style('cursor', 'pointer');
    if (content) {
      this.text(content);
    }
  }

  // 在 setup 时组织子元素，renderDom 只负责渲染
  renderDom() {
    if (this._deleted) return null;

    // 首次渲染前构建子元素
    if (!this._initialized) {
      this._buildContent();  // 使用基础元素构建内部结构
      this._initialized = true;
    }

    const element = this._boundElement || document.createElement('div');
    this._applyAttrs(element);
    this._applyStyles(element);
    this._applyEvents(element);
    // 使用 _applyChildren 渲染子元素，而不是 innerHTML
    this._applyChildren(element);
    this._boundElement = element;
    return element;
  }

  _buildContent() {
    // 使用基础元素组合构建内部结构
    if (this._icon) {
      this._children.push(span(s => {
        s.styles({ display: 'inline-flex' });
        s.html(this._icon);
      }));
    }
    if (this._text) {
      this._children.push(span(t => {
        t.styles({ flex: 1 });
        t.text(this._text);
      }));
    }
  }
}

// ❌ 错误：直接操作 DOM
class MenuItem {
  render() {
    const el = document.createElement('div');
    el.innerHTML = content;  // 不要这样做
    return el;
  }
}

// ❌ 错误：拼装标签
class MenuItem {
  toHTML() {
    return `<div class="menu-item">${content}</div>`;  // 不要这样做
  }
}
```

**原则**：
- 所有复杂组件都必须使用基础元素组合构建，没有例外
- 复杂组件应该 在 setup 时 把 子元素直接组织好，将必要的结构先添加到内部属性引用上
- 不要在 renderDom 中手动创建 dom 元素（如 `document.createElement('span')`）
- 复杂交互逻辑（如下拉、右键、模态框）应通过事件绑定和样式控制实现
- 只在 `renderDom()` 中使用 `this._boundElement || document.createElement()` 获取根元素
- 渲染时使用 `this._applyAttrs()`, `this._applyStyles()`, `this._applyChildren()` 等方法

**子元素缓存原则**：
- 适用于复杂组件中固定子元素结构（如 Card 的 CardHeader/CardBody/CardFooter、菜单的图标/文本/快捷键、Logo 区域等）
- 对于固定子元素结构，应使用 `this._xxxBox` 属性缓存容器引用
- 首次创建时实例化容器并添加到 `_children`，后续更新只修改内容，避免重复创建对象
- 示例：
```javascript
// MenuItem 缓存图标/文本/快捷键容器
class MenuItem extends Tag {
  icon(content) {
    this._icon = content;
    this._ensureIconBox();
    this._iconBox.html(this._icon);
    return this;
  }

  _ensureIconBox() {
    if (this._iconBox) return;
    this._iconBox = span(s => {
      s.styles({ display: 'inline-flex', pointerEvents: 'none' });
    });
    this._children.push(this._iconBox);
  }
}

// Card 缓存头部/内容/底部容器
class Card extends Tag {
  cardHeader(setup) {
    if (!this._headerBox) {
      this._headerBox = cardHeader(setup);
      this._children.push(this._headerBox);
    } else {
      this._headerBox.setup(setup);
    }
    return this;
  }
}
```

`src/yoya/core/basic.js` 已优化：
- 使用 `createSimpleClass()` 和 `createSimpleElements()` 辅助函数生成简单元素类
- 移除冗余的 `_props` 对象，改用独立的 `_deleted` 标志
- 减少代码量，保留所有有特殊方法的类（如 `A.href()`, `Input.value()` 等）

## 技能

- `yoya-build` - 构建 yoya.basic.js 库
- `yoya-add-element` - 添加新的 HTML 元素类和工厂函数
- `yoya-check-types` - 检查 yoya.basic.d.ts 类型定义
- `/simplify` - 审查代码复用性和质量

## 状态机与主题系统

### 架构说明

状态机和主题系统位于 `src/yoya/core/theme.js`，提供：
- **状态机机制**：通过 `registerStateAttrs` 定义关注的状态属性
- **多类型支持**：支持 boolean、string、number 多种状态值类型
- **拦截器机制**：可注册状态变更拦截器进行验证和修改
- **状态快照**：支持保存和恢复状态快照
- **主题系统**：可插拔的主题注册和管理机制

### 关键实现细节

**避免循环依赖**：
- `theme.js` **不导入** `Tag`，只导出 `initTagExtensions` 函数
- `index.js` 导入 `Tag` 和 `initTagExtensions`，然后调用 `initTagExtensions(Tag)`
- 这样确保 Tag 原型扩展在模块加载时自动初始化

```javascript
// theme.js - 不导入 Tag
export function initTagExtensions(TagClass) {
  if (!TagClass || typeof TagClass.prototype === 'undefined') return;
  if (TagClass.prototype._stateExtensionsInitialized) return true;

  // 添加原型方法：registerStateAttrs, setState, getState, etc.
  TagClass.prototype.registerStateAttrs = function(...attrs) { ... };
  TagClass.prototype.setState = function(stateName, value) { ... };
  // ...

  TagClass.prototype._stateExtensionsInitialized = true;
}

// index.js - 导入并初始化
import { Tag } from './core/basic.js';
import { initTagExtensions } from './core/theme.js';
initTagExtensions(Tag);  // 自动初始化原型扩展
```

### 状态类型和使用

```javascript
import { Tag } from '../yoya/index.js';

const tag = new Tag('div');

// 注册状态属性（支持类型定义）
tag.registerStateAttrs(
  'disabled',              // boolean（默认）
  { size: 'string' },      // string
  { count: 'number' }      // number
);

// 设置状态
tag.setState('disabled', true);
tag.setState('size', 'large');
tag.setState('count', 10);

// 获取状态
tag.getBooleanState('disabled');  // true
tag.getStringState('size');       // 'large'
tag.getNumberState('count');      // 10
tag.getAllStates();               // { disabled: true, size: 'large', count: 10 }

// 状态快照
tag.saveStateSnapshot('before-submit');
tag.setState('disabled', true);
tag.restoreStateSnapshot('before-submit');

// 状态拦截器
tag.registerStateInterceptor((stateName, value) => {
  if (tag.hasState('disabled') && stateName !== 'disabled') {
    return null;  // 取消操作
  }
  return { stateName, value };
});
```

### MenuItem 组件示例

`src/yoya/components/menu.js` 中的 MenuItem 展示了如何使用状态机：

```javascript
class MenuItem extends Tag {
  static _stateAttrs = ['disabled', 'active', 'danger', 'hoverable'];

  constructor(content = '', setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 注册状态处理器
    this._registerStateHandlers();

    // 3. 保存样式快照
    this.saveStateSnapshot('base');

    // 4. 注册拦截器
    this._registerHoverInterceptor();

    // 5. 初始化状态
    this.initializeStates({ disabled: false, active: false });
  }

  _registerStateHandlers() {
    // disabled 状态处理器
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.styles({ opacity: '0.5', cursor: 'not-allowed' });
      } else {
        host.style('opacity', '');
        host.style('cursor', 'pointer');
      }
    });
    // ... 其他状态处理器
  }
}
```

### 状态变更流程

```
用户调用 setState('disabled', true)
        ↓
执行拦截器链 → 返回 null 则取消
        ↓
更新 _currentState[stateName]
        ↓
执行状态处理器 (_executeHandlers)
        ↓
应用样式变更
```
