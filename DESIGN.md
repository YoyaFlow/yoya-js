# YoyaJS 开发文档

## 一、项目定位

YoyaJS 是一个运行在浏览器原生环境下的 HTML DSL 基础库。

### 1.1 目标
- 提供类似 Kotlin HTML DSL 的声明式语法
- 运行在纯浏览器环境，不依赖构建工具
- 支持 TypeScript 类型声明，但运行时为纯 JS
- 采用 ESM 模块格式

### 1.2 范围
- ✅ 基础 HTML 元素类及工厂函数
- ✅ 元素属性、样式、事件管理
- ✅ DOM 渲染与绑定
- ❌ 状态管理（单独模块）
- ❌ 组件系统（后续考虑）
- ❌ 条件渲染指令

---

## 二、核心设计原则

### 2.1 模块化
- **ESM 格式**：使用 `export/import` 语法
- **纯浏览器环境**：可直接在浏览器中通过 `<script type="module">` 使用
- **TypeScript 支持**：提供 `.d.ts` 类型声明文件

### 2.2 Class 与工厂函数共举
- 每个元素 Class 和对应的 factory function 放在同一文件中
- 外部只能通过工厂函数创建元素
- 命名直观：`div()`, `button()`, `table()`, `tr()`, `td()`

### 2.3 基础元素自治
- 每个元素管理自己的子元素列表
- 元素维护独立的属性、样式、事件状态
- 元素维护自己的 DOM 引用

### 2.4 bindTo 外部调用
- `bindTo` 是外部调用方法，用于将基础元素绑定到指定 DOM 位置
- `bindTo()` 内部自动调用 `renderDom()`
- 支持选择器字符串和 DOM 元素作为参数

### 2.5 事件绑定机制
- 事件优先绑定到基础元素
- `renderDom` 时将事件同步到真实 DOM
- 重新渲染时事件不会丢失

### 2.6 虚拟元素树
- 整个虚拟元素保持树状结构
- 使用 `props` 对象维护元素标签属性和状态
- 删除标记：`props.deleted = true`

### 2.7 属性封装
- 所有属性私有化：`_attrs`, `_styles`, `_classes`, `_events`, `_children`, `_props`
- 通过方法访问，防止与快捷函数冲突
- 快捷函数：设置时返回 `this`，取值时返回值

### 2.8 子元素管理
- 子元素各自维护自己的 DOM
- 父元素只在子元素数量变化时清理并重新组织子 DOM
- `child()` 方法只接受 `Tag` 及其子类

### 2.9 扩展方法定义
- 扩展方法在**子元素类**下方定义
- 使用 `prototype` 方式添加
- 返回父元素本身（便于链式调用）

### 2.10 渲染优化
- 第二次调用 `renderDom()` 只更新属性，不重新构建
- 只添加/删除子元素时重新组织 DOM
- 根据元素类型执行不同清理策略

---

## 三、API 设计

### 3.1 Tag 基类

```javascript
class Tag {
  // 私有属性
  _tagName          // 标签名
  _attrs            // 属性对象 { name: value }
  _styles           // 样式对象 { property: value }
  _classes          // Set<string>
  _events           // 事件对象 { event: [handlers] }
  _children         // 子元素数组
  _boundElement     // 绑定的真实 DOM
  _rendered         // 是否已渲染
  _props            // 元素属性集合 { id, name, deleted, ... }

  // 核心方法
  setup(setup)           // 统一初始化
  attr(name, value)      // 属性操作
  className(...classes)  // 添加类
  style(name, value)     // 样式操作
  on(event, handler)     // 绑定事件
  text(content)          // 添加文本
  html(content)          // 添加 HTML
  child(...children)     // 添加子元素
  clear()                // 清空心元素
  bindTo(target)         // 绑定到 DOM（自动 renderDom）
  renderDom()            // 渲染为真实 DOM
  destroy()              // 销毁元素
  toHTML()               // 转换为 HTML 字符串
}
```

### 3.2 工厂函数

```javascript
// 基础容器
function div(setup = null) { return new Div(setup); }
function span(setup = null) { return new Span(setup); }
function p(setup = null) { return new P(setup); }
// ... h1-h6, section, article, header, footer, nav, aside, main

// 文本格式化
function a(setup = null) { return new A(setup); }
function strong(setup = null) { return new Strong(setup); }
function em(setup = null) { return new Em(setup); }
function code(setup = null) { return new Code(setup); }
function pre(setup = null) { return new Pre(setup); }
function blockquote(setup = null) { return new Blockquote(setup); }

// 表单
function button(setup = null) { return new Button(setup); }
function input(setup = null) { return new Input(setup); }
function textarea(setup = null) { return new Textarea(setup); }
function select(setup = null) { return new Select(setup); }
function option(setup = null) { return new Option(setup); }
function label(setup = null) { return new Label(setup); }
function form(setup = null) { return new Form(setup); }

// 列表
function ul(setup = null) { return new Ul(setup); }
function ol(setup = null) { return new Ol(setup); }
function li(setup = null) { return new Li(setup); }
function dl(setup = null) { return new Dl(setup); }
function dt(setup = null) { return new Dt(setup); }
function dd(setup = null) { return new Dd(setup); }

// 表格
function table(setup = null) { return new Table(setup); }
function tr(setup = null) { return new Tr(setup); }
function td(setup = null) { return new Td(setup); }
function th(setup = null) { return new Th(setup); }
function thead(setup = null) { return new Thead(setup); }
function tbody(setup = null) { return new Tbody(setup); }
function tfoot(setup = null) { return new Tfoot(setup); }

// 媒体
function img(setup = null) { return new Img(setup); }
function video(setup = null) { return new Video(setup); }
function audio(setup = null) { return new Audio(setup); }
function source(setup = null) { return new Source(setup); }

// 其他
function br(setup = null) { return new Br(setup); }
function hr(setup = null) { return new Hr(setup); }
function iframe(setup = null) { return new IFrame(setup); }
function canvas(setup = null) { return new Canvas(setup); }

// 通用
function tag(name, setup = null) { return new Tag(name, setup); }
```

### 3.3 扩展方法

```javascript
// Table 扩展方法（写在 Tr 类下方）
Table.prototype.tr = function(setup = null) {
  const trEl = tr(setup);
  this.child(trEl);
  return this;
};

// Tr 扩展方法（写在 Td/Th 类下方）
Tr.prototype.td = function(setup = null) {
  const tdEl = td(setup);
  this.child(tdEl);
  return this;
};

Tr.prototype.th = function(setup = null) {
  const thEl = th(setup);
  this.child(thEl);
  return this;
};

// Ul 扩展方法
Ul.prototype.li = function(setup = null) {
  const liEl = li(setup);
  this.child(liEl);
  return this;
};

// Ol 扩展方法
Ol.prototype.li = function(setup = null) {
  const liEl = li(setup);
  this.child(liEl);
  return this;
};

// Thead/Tbody/Tfoot 扩展方法
Thead.prototype.tr = function(setup = null) {
  const trEl = tr(setup);
  this.child(trEl);
  return this;
};

Tbody.prototype.tr = function(setup = null) {
  const trEl = tr(setup);
  this.child(trEl);
  return this;
};

Tfoot.prototype.tr = function(setup = null) {
  const trEl = tr(setup);
  this.child(trEl);
  return this;
};

// Dl 扩展方法
Dl.prototype.dt = function(setup = null) {
  const dtEl = dt(setup);
  this.child(dtEl);
  return this;
};

Dl.prototype.dd = function(setup = null) {
  const ddEl = dd(setup);
  this.child(ddEl);
  return this;
};
```

---

## 四、使用示例

### 4.1 基础用法

```javascript
import { div, button, input } from './yoya.js';

// setupFunction（优先）
div(box => {
  box.className('container');
  box.button(btn => btn.text('test1'));
  box.button('test2');
}).bindTo('#app');

// setupObject
div({
  className: 'wrapper',
  style: { color: 'red' },
  children: [
    button('点击'),
    input({ type: 'text', placeholder: '输入' })
  ]
}).bindTo('#app');

// setupString
div('纯文本内容').bindTo('#app');
```

### 4.2 链式调用

```javascript
button('提交')
  .submit()
  .large()
  .className('primary')
  .on('click', () => console.log('clicked'))
  .bindTo('#form');

input('name')
  .type('text')
  .placeholder('请输入姓名')
  .value('')
  .on('input', e => console.log(e.target.value))
  .bindTo('#form');
```

### 4.3 表格用法

```javascript
table(t => {
  t.className('data-table');
  t.tr(row => {
    row.th('姓名');
    row.th('年龄');
  });
  t.tr(row => {
    row.td('张三');
    row.td('25');
  });
}).bindTo('#table-container');
```

### 4.4 列表用法

```javascript
ul(list => {
  list.li('项目 1');
  list.li('项目 2');
  list.li('项目 3');
}).bindTo('#list');
```

### 4.5 children 支持

```javascript
// 支持字符串
div({ children: ['文本 1', '文本 2'] });

// 支持 null/undefined（忽略）
div({ children: [null, button('btn'), undefined] });

// 支持嵌套数组（扁平化）
ul({ children: [[li1, li2], li3] });
```

### 4.6 元素销毁

```javascript
const btn = button('删除');
parent.child(btn).bindTo('#app');

// 标记删除
btn.props.deleted = true;

// 父元素重新渲染时清理
parent.renderDom();
```

### 4.7 事件处理

```javascript
// setupObject 支持事件
button({
  onclick: () => alert('clicked'),
  onkeyup: (e) => console.log(e.key)
}).bindTo('#app');

// on() 方法
button(el => el.on('click', handler)).bindTo('#app');
```

---

## 五、实现细节

### 5.1 属性封装

```javascript
class Tag {
  constructor(tagName, setup = null) {
    this._tagName = tagName;
    this._attrs = {};
    this._styles = {};
    this._classes = new Set();
    this._events = {};
    this._children = [];
    this._boundElement = null;
    this._rendered = false;
    this._props = {};  // id, name, deleted 等

    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 通用属性
  attr(name, value) {
    if (value === undefined) {
      return this._attrs[name];
    }
    this._attrs[name] = value;
    this._props[name] = value;
    return this;
  }

  // 快捷函数示例（input.value）
  value(val) {
    if (val === undefined) {
      return this.attr('value');
    }
    return this.attr('value', val);
  }
}
```

### 5.2 props 管理

```javascript
// props 包含：
// - deleted: boolean（删除标记）
// - 所有标签属性：id, name, type, src, href 等
// - 自定义状态

// 设置属性时同步到 props
this.attr('id', 'my-id');  // this._props.id = 'my-id'
```

### 5.3 renderDom 流程

```javascript
renderDom() {
  // 1. 检查 deleted 标记，返回 null
  if (this._props.deleted) {
    return null;
  }

  // 2. 创建或获取 DOM 元素
  const element = this._boundElement || document.createElement(this._tagName);

  // 3. 应用属性
  this._applyAttrs(element);

  // 4. 应用 class
  this._applyClasses(element);

  // 5. 应用样式
  this._applyStyles(element);

  // 6. 应用事件
  this._applyEvents(element);

  // 7. 处理子元素
  if (this._childrenChanged) {
    this._rebuildChildren(element);
  } else {
    this._updateChildren(element);
  }

  // 8. 更新状态
  this._boundElement = element;
  this._rendered = true;

  return element;
}
```

### 5.4 子元素变化检测

```javascript
// 检测子元素数量变化
get _childrenChanged() {
  const domChildren = this._boundElement?.children.length || 0;
  const validChildren = this._children.filter(c => !c._props.deleted).length;
  return domChildren !== validChildren;
}
```

### 5.5 清理策略

```javascript
// 不同类型元素的清理策略
_cleanupElement(element) {
  // input/textarea: 清理 value
  if (this._tagName === 'input' || this._tagName === 'textarea') {
    element.value = '';
  }

  // 移除事件监听
  this._removeEventListeners(element);

  // 清空样式（可选）
  // element.removeAttribute('style');
}
```

### 5.6 bindTo 实现

```javascript
bindTo(target) {
  let element;
  if (typeof target === 'string') {
    element = document.querySelector(target);
  } else if (target instanceof HTMLElement) {
    element = target;
  }

  if (!element) {
    throw new Error(`Cannot bind to: ${target}`);
  }

  this._boundElement = element;
  this.renderDom();  // 自动调用 renderDom

  return this;
}
```

### 5.7 destroy 实现

```javascript
destroy() {
  // 标记删除
  this._props.deleted = true;

  // 如果有父元素，从 children 移除
  // 注意：这里不主动查找父元素，由使用者管理

  // 清理 DOM
  if (this._boundElement && this._boundElement.parentNode) {
    this._boundElement.parentNode.removeChild(this._boundElement);
  }

  return this;
}
```

---

## 六、文件结构

```
/home/join/code/cctest/
├── DESIGN.md              # 开发文档（本文件）
├── yoya.js          # 基础元素库实现
├── yoya.d.ts        # TypeScript 类型声明
└── examples/
    └── demo.html          # 使用示例
```

---

## 七、开发清单

### 7.1 基础实现
- [ ] Tag 基类
- [ ] 基础容器元素（Div, Span, P, H1-H6, Section, Article, Header, Footer, Nav, Aside, Main）
- [ ] 文本格式化元素（A, Strong, Em, Code, Pre, Blockquote）
- [ ] 表单元素（Button, Input, Textarea, Select, Option, Label, Form）
- [ ] 列表元素（Ul, Ol, Li, Dl, Dt, Dd）
- [ ] 表格元素（Table, Tr, Td, Th, Thead, Tbody, Tfoot）
- [ ] 媒体元素（Img, Video, Audio, Source）
- [ ] 其他元素（Br, Hr, IFrame, Canvas）
- [ ] 通用 tag 工厂

### 7.2 扩展方法
- [ ] Table.tr()
- [ ] Tr.td(), Tr.th()
- [ ] Ul.li(), Ol.li()
- [ ] Thead.tr(), Tbody.tr(), Tfoot.tr()
- [ ] Dl.dt(), Dl.dd()

### 7.3 类型声明
- [ ] Tag 基类类型
- [ ] 所有元素类类型
- [ ] 工厂函数类型
- [ ] 扩展方法类型

### 7.4 测试
- [ ] 基础功能测试
- [ ] 事件绑定测试
- [ ] 子元素管理测试
- [ ] 销毁机制测试

---

## 八、注意事项

1. **纯浏览器环境**：不使用 Node.js 特有 API
2. **直观命名**：API 命名直观易懂
3. **ESM 导出**：使用 `export { ... }` 语法
4. **不限制子元素类型**：Table 可以 child(div())，但提供 tr() 扩展方法
5. **bindTo 外部调用**：库内部不主动调用 bindTo
6. **样式用 style 属性**：不做额外的 CSS 封装
7. **属性私有化**：所有属性使用 `_` 前缀
8. **快捷函数**：设置返回 this，取值返回值
9. **children 支持**：字符串、null/undefined、Tag、嵌套数组
10. **空标签**：text/child 允许但无效

---

## 九、开发技能 (Skills)

开发过程中可以使用以下技能指令：

### 9.1 yoya-build
**描述**：构建 yoya.js 库

**指令**：构建 yoya.js 库，确保 ESM 格式正确，可以在浏览器环境直接使用。

### 9.2 yoya-add-element
**描述**：添加新的 HTML 元素类

**指令**：在 yoya.js 中添加新的 HTML 元素类和对应的工厂函数，遵循现有代码规范。

### 9.3 yoya-check-types
**描述**：检查 TypeScript 类型定义

**指令**：检查 yoya.d.ts 类型定义文件是否完整，确保所有导出的类和函数都有正确的类型声明。

### 9.4 yoya-simplify (内置技能)
**描述**：审查代码变更，优化复用性和质量

**指令**：使用 `/simplify` 技能审查 yoya.js 的代码，确保没有重复代码，符合设计原则。

---

## 十、开发流程

1. **阅读 DESIGN.md**：开发前先阅读本文档
2. **实现代码**：按照设计文档实现 yoya.js
3. **类型声明**：同步编写 yoya.d.ts
4. **代码审查**：使用 /simplify 技能审查代码质量
5. **测试验证**：创建示例 HTML 文件验证功能
6. **文档更新**：更新本文档中的 API 说明
