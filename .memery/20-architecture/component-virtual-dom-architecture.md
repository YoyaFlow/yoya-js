# 组件、虚拟元素与 DOM 关系架构文档

## 一、三层架构概述

Yoya.Basic 库采用**三层架构**设计：

```
┌─────────────────────────────────────────────────────────────┐
│                    组件层 (Component Layer)                  │
│  VButton, VInput, VField, ...                               │
│  - 封装复杂交互逻辑                                          │
│  - 管理内部子元素                                             │
│  - 提供高级 API                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  虚拟元素层 (Virtual Element Layer)          │
│  Tag 类实例，构成虚拟 DOM 树                                    │
│  - _attrs: 属性集合                                          │
│  - _styles: 样式集合                                          │
│  - _events: 事件集合                                          │
│  - _children: 子元素虚拟树                                   │
│  - _boundElement: 绑定的真实 DOM 引用                         │
└─────────────────────────────────────────────────────────────┘
                            │
                    renderDom()
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   DOM 层 (Real DOM Layer)                    │
│  浏览器原生 DOM 元素                                            │
│  - 用户可见和交互                                            │
│  - 参与浏览器渲染流水线                                      │
│  - 触发真实事件                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 二、虚拟元素 (Tag) 详解

### 2.1 Tag 类核心属性

```javascript
class Tag {
  constructor(tagName, setup = null) {
    // === 虚拟状态（不直接操作 DOM）===
    this._tagName = tagName;       // 元素类型
    this._attrs = {};              // 属性集合
    this._styles = {};             // 样式集合
    this._classes = new Set();     // 类名集合
    this._events = {};             // 事件处理器集合
    this._children = [];           // 子虚拟元素数组
    this._states = new Set();      // 状态集合
    this._stateStyles = {};        // 状态样式

    // === DOM 绑定状态 ===
    this._boundElement = null;     // 绑定的真实 DOM 元素
    this._rendered = false;        // 是否已渲染
    this._deleted = false;         // 是否已删除（虚拟标记）
  }
}
```

### 2.2 虚拟元素的生命周期

```
创建 (constructor)
    │
    ├─ 初始化所有虚拟属性 (_attrs, _styles, _events, _children)
    │
    ▼
配置 (setup / 链式调用)
    │
    ├─ 修改虚拟属性（不触碰 DOM）
    │  div().id('foo').style('color', 'red').child(span())
    │
    ▼
渲染 (renderDom)
    │
    ├─ 创建真实 DOM 元素
    ├─ 应用虚拟属性到 DOM
    ├─ 递归渲染子元素
    ├─ 绑定事件处理器
    │
    ▼
绑定 (bindTo)
    │
    ├─ 将真实 DOM 插入页面
    │
    ▼
更新 (setState / style / attr)
    │
    ├─ 更新虚拟属性
    ├─ 同步到真实 DOM（可选）
    │
    ▼
删除 (destroy)
    │
    ├─ 设置 _deleted = true
    ├─ 从父元素移除
    └─ 从 DOM 移除（如已渲染）
```

### 2.3 虚拟元素的关键特性

**特性 1：惰性渲染**

```javascript
// 创建虚拟元素树时，不创建任何 DOM
const virtualTree = div(d => {
  d.style('color', 'red');
  d.child(span(s => {
    s.text('Hello');
  }));
});

// 此时 virtualTree._boundElement === null
// 整个树只存在于内存中

// 只有在 renderDom() 时才创建真实 DOM
const realDOM = virtualTree.renderDom();
// 此时 virtualTree._boundElement === realDOM
```

**特性 2：虚拟属性累积**

```javascript
const el = div();
el.style('color', 'red');      // _styles.color = 'red'
el.style('font-size', '14px'); // _styles.fontSize = '14px'
el.attr('id', 'foo');          // _attrs.id = 'foo'

// 此时没有任何 DOM 操作
// 所有修改累积在 _styles 和 _attrs 中
```

**特性 3：单向数据流**

```
用户操作 → setup/链式方法 → 虚拟属性变更 → renderDom → DOM 变更
            ↓
        事件回调 ← DOM 事件触发 ← 用户交互
```

---

## 三、组件层详解

### 3.1 组件的本质

组件是**特殊虚拟元素**，通过组合多个子虚拟元素实现复杂功能：

```javascript
class VInput extends Tag {
  constructor(setup = null) {
    super('div', null);  // ← 本身是 div 虚拟元素

    this._inputEl = null;  // ← 内部子元素引用

    this._setupBaseStyles();
    this._registerStateHandlers();
    this.initializeStates({...});
    this.setup(setup);
    this._updateContent();  // ← 创建内部 input 虚拟元素
  }

  _updateContent() {
    if (this._inputEl) return;

    // 创建内部 input 虚拟元素
    this._inputEl = input(i => {
      i.styles({...});
    });

    // 将内部元素添加为子元素
    this.child(this._inputEl);
  }
}
```

### 3.2 组件的虚拟树结构

**VInput 组件的虚拟树：**

```
VInput (Tag: div)
├── _styles: { display: 'inline-flex', ... }
├── _events: { click: [...] }
├── _children: [
│   └── VInput._inputEl (Tag: input)
│       ├── _styles: { flex: 1, border: 'none', ... }
│       └── _attrs: { placeholder: '...', value: '...' }
│   ]
└── _boundElement: null → div DOM (renderDom 后)
```

**VField 组件的虚拟树：**

```
VField (Tag: div)
├── _states: { editing: false, disabled: false }
├── _children: [
│   └── VField._showContainer (Tag: div)
│       ├── _children: [
│       │   ├── span (编辑图标)
│       │   └── div (内容占位)
│       └── _events: { click: [...], mouseenter: [...] }
│   ]
└── (编辑状态下会添加)
    └── VField._editContainer (Tag: div)
        ├── _children: [
        │   ├── VInput / VSelect / ...
        │   ├── VButton (保存)
        │   └── VButton (取消)
        └── _events: { click: [...] }
```

### 3.3 组件内部元素管理

组件通过**缓存引用**管理内部子元素：

```javascript
class VField extends Tag {
  constructor() {
    super('div', null);
    this._showContainer = null;   // 缓存显示容器
    this._editContainer = null;   // 缓存编辑容器
    this._showContent = null;     // 缓存内容数据
    this._editContent = null;     // 缓存编辑数据
  }

  _buildShowContent() {
    // 首次创建并缓存
    if (!this._showContainer) {
      this._showContainer = div(s => { ... });
      this.child(this._showContainer);  // 添加为子元素
    }

    // 后续更新只修改内容
    this._updateContainerContent(this._showContainer);
  }
}
```

---

## 四、虚拟元素到 DOM 的映射

### 4.1 renderDom 流程详解

```javascript
renderDom() {
  if (this._deleted) return null;

  // 1. 创建或复用 DOM 元素
  const element = this._boundElement || document.createElement(this._tagName);

  // 2. 应用属性（虚拟 → 真实）
  this._applyAttrs(element);
  //   _attrs.id → element.id
  //   _attrs.placeholder → element.setAttribute('placeholder', ...)

  // 3. 应用类名
  this._applyClasses(element);
  //   _classes → element.classList.add(...)

  // 4. 应用样式
  this._applyStyles(element);
  //   _styles.color → element.style.color
  //   _styles.display → element.style.display

  // 5. 应用事件
  this._applyEvents(element);
  //   _events.click → element.addEventListener('click', ...)

  // 6. 应用内容（text/html）
  this._applyContent(element);

  // 7. 递归渲染子元素
  this._applyChildren(element);
  //   for child in _children:
  //     element.appendChild(child.renderDom())

  // 8. 保存绑定引用
  this._boundElement = element;
  this._rendered = true;

  return element;
}
```

### 4.2 虚拟树到 DOM 树的映射示例

**代码：**

```javascript
const page = div(d => {
  d.style('display', 'flex');
  d.child(h1(h => {
    h.text('标题');
  }));
  d.child(p(p => {
    p.text('段落');
  }));
});

document.getElementById('app').appendChild(page.renderDom());
```

**映射关系：**

```
虚拟元素树                          真实 DOM 树
─────────────                      ─────────────
page (Tag: div)                    div#app
├── _styles:                       ├── <div style="display: flex">
│   display: 'flex'                │   ├── <h1>标题</h1>
├── _children:                     │   └── <p>段落</p>
│   ├── h1 (Tag: h1)               └── </div>
│   │   └── _text: '标题'
│   └── p (Tag: p)
│       └── _text: '段落'

renderDom 后：
page._boundElement → div#app 的第一个子元素
h1._boundElement → h1 元素
p._boundElement → p 元素
```

### 4.3 组件的 DOM 结构

**VInput 渲染后的 DOM：**

```html
<!-- VInput 组件 (Tag: div) -->
<div style="display: inline-flex; align-items: center; ...">
  <!-- VInput._inputEl (Tag: input) -->
  <input style="flex: 1; border: none; ..." placeholder="..." />
</div>
```

**VField 渲染后的 DOM：**

```html
<!-- VField 组件 (Tag: div) -->
<div style="display: inline-flex; position: relative; ...">
  <!-- VField._showContainer (Tag: div) -->
  <div style="display: flex; ...">
    <!-- 编辑图标 -->
    <span style="font-size: 12px; opacity: 0;">✏️</span>
    <!-- 内容占位 -->
    <div>点击编辑</div>
  </div>

  <!-- VField._editContainer (编辑时显示) -->
  <div style="display: none; position: absolute; ...">
    <!-- VInput -->
    <div style="display: inline-flex; ...">
      <input placeholder="请输入..." />
    </div>
    <!-- 保存按钮 -->
    <button>✓</button>
    <!-- 取消按钮 -->
    <button>✕</button>
  </div>
</div>
```

---

## 五、状态同步机制

### 5.1 虚拟状态 → DOM 同步

**方式 1：renderDom 时全量同步**

```javascript
// 设置虚拟属性（不触发 DOM 更新）
el.style('color', 'red');
el.attr('id', 'foo');

// renderDom 时同步到 DOM
const dom = el.renderDom();
// dom.style.color === 'red'
// dom.id === 'foo'
```

**方式 2：运行时手动同步**

```javascript
// 组件已渲染后修改样式
button.style('transform', 'scale(0.98)');

// 手动同步到 DOM
if (button._boundElement) {
  button._boundElement.style.transform = 'scale(0.98)';
}
```

**方式 3：状态机自动同步**

```javascript
// 注册状态处理器
this.registerStateHandler('disabled', (disabled, host) => {
  if (disabled) {
    host.styles({ opacity: '0.5' });  // 更新虚拟样式
    if (host._boundElement) {
      // 同步到 DOM（可选）
      host._boundElement.style.opacity = '0.5';
    }
  }
});

// 触发状态变更
this.setState('disabled', true);
// → 自动执行状态处理器
```

### 5.2 DOM → 虚拟状态同步

**表单元素的值同步：**

```javascript
// VInput 组件
onInput(handler) {
  if (this._inputEl) {
    this._inputEl.on('input', (e) => {
      // DOM 事件触发时，同步值到虚拟状态
      if (e._boundElement) {
        this._value = e._boundElement.value;  // DOM → 虚拟
      }
      if (handler) handler(e);
    });
  }
}
```

**复选框状态同步：**

```javascript
// VCheckbox 组件
this._checkboxEl.on('change', (e) => {
  // DOM checked 状态 → 虚拟状态
  const checked = e._boundElement ? e._boundElement.checked : true;
  this.setState('checked', checked);  // DOM → 虚拟状态机
});
```

---

## 六、事件处理机制

### 6.1 事件绑定流程

```javascript
// 1. 虚拟元素上注册事件处理器
el.on('click', (e) => {
  console.log('clicked');
});
// → _events.click = [(e) => {...}]

// 2. renderDom 时绑定到 DOM
_applyEvents(element) {
  for (const [event, handlers] of Object.entries(this._events)) {
    element.addEventListener(event, (e) => {
      // this 指向 Tag 实例
      handlers.forEach(handler => handler(e));
    });
  }
}

// 3. DOM 事件触发时调用虚拟处理器
// DOM click → addEventListener → handler(e)
```

### 6.2 事件传播与委托

**组件事件处理：**

```javascript
class VField extends Tag {
  _buildShowContent() {
    this._showContainer = div(s => {
      // 子元素事件
      s.on('click', () => {
        // 这里 this 指向 VField（箭头函数捕获）
        this.setState('editing', true);
      });

      // 事件冒泡处理
      s.on('mouseenter', () => {
        // 修改子元素样式
        editIcon.style('opacity', '1');
      });
    });
  }
}
```

### 6.3 事件处理中的 this 指向

```javascript
// ✅ 正确：箭头函数，this 指向 Tag 实例
this.on('click', (e) => {
  this.style('color', 'red');  // ✓
});

// ❌ 错误：普通函数，this 指向 DOM
this.on('click', function(e) {
  this.style('color', 'red');  // ✗ this.style 不存在
});

// ✅ 正确：显式绑定
this.on('click', function(e) {
  this.style('color', 'red');
}.bind(this));
```

---

## 七、常见问题与解决方案

### 7.1 问题：虚拟样式变更未反映到 DOM

**现象：**
```javascript
const btn = vButton('点击');
btn.renderDom();
btn.style('transform', 'scale(0.98)');
// DOM 没有变化！
```

**原因：**
`style()` 只更新 `_styles`，不自动同步到已渲染的 DOM。

**解决方案：**
```javascript
// 方案 1：手动同步
btn.style('transform', 'scale(0.98)');
if (btn._boundElement) {
  btn._boundElement.style.transform = 'scale(0.98)';
}

// 方案 2：建议的 API 扩展
style(name, value, syncImmediately = false) {
  this._styles[name] = value;
  if (syncImmediately && this._boundElement) {
    this._boundElement.style[name] = value;
  }
}
```

### 7.2 问题：组件内部元素未渲染

**现象：**
```javascript
class VInput extends Tag {
  constructor() {
    super('div');
    this._setupBaseStyles();
    // 忘记调用 _updateContent()
    // 内部 input 元素从未创建！
  }
}
```

**原因：**
`_updateContent()` 未调用，内部虚拟元素未添加到 `_children`。

**解决方案：**
```javascript
constructor() {
  super('div');
  this._setupBaseStyles();
  this._registerStateHandlers();
  this.initializeStates({...});
  this.setup(setup);
  this._updateContent();  // ← 必须调用
}
```

### 7.3 问题：重复渲染导致子元素重复

**现象：**
```javascript
const el = div(d => {
  d.child(span('Hello'));
});

el.renderDom();  // 第一次渲染
el.renderDom();  // 第二次渲染 - 子元素可能重复！
```

**原因：**
`_applyChildren` 未检查子元素是否已渲染。

**解决方案：**
```javascript
renderDom() {
  // 避免重复渲染
  if (this._rendered && this._boundElement?.isConnected) {
    return this._boundElement;
  }
  // ...
}
```

---

## 八、最佳实践

### 8.1 虚拟元素使用原则

1. **构建阶段**：只操作虚拟属性，不触碰 DOM
2. **渲染阶段**：一次性同步所有虚拟属性到 DOM
3. **更新阶段**：有选择地同步变更的属性

### 8.2 组件开发原则

1. **内部元素缓存**：使用 `this._xxxEl` 缓存内部元素引用
2. **幂等创建**：`_createInternalElements()` 应是幂等的
3. **状态驱动**：优先使用状态机管理组件状态

### 8.3 事件处理原则

1. **统一箭头函数**：确保 this 指向组件实例
2. **及时清理**：组件销毁时清理事件绑定
3. **阻止冒泡**：内部事件需要时调用 `e.stopPropagation()`

---

## 九、架构图总结

```
┌────────────────────────────────────────────────────────────────┐
│                        用户代码层                               │
│  const input = vInput(i => { i.placeholder('...'); });        │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                        组件层                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   VInput    │  │   VButton   │  │    VField   │            │
│  │  extends Tag│  │  extends Tag│  │  extends Tag│            │
│  │  _inputEl   │  │  _content   │  │  _showCont  │            │
│  │  _value     │  │  _type      │  │  _editCont  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└────────────────────────────────────────────────────────────────┘
                              │
                    setup() + 链式调用
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                      虚拟元素层 (Tag)                           │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Tag Instance                                          │   │
│  │  _tagName: 'div'                                       │   │
│  │  _attrs: { id: 'foo', ... }                            │   │
│  │  _styles: { color: 'red', ... }                        │   │
│  │  _events: { click: [handler1, handler2] }              │   │
│  │  _children: [Tag, Tag, Tag] ← 递归子树                  │   │
│  │  _states: { disabled: false, ... }                     │   │
│  │  _boundElement: null → HTMLDivElement (renderDom 后)    │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
                              │
                        renderDom()
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                        DOM 层                                   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  <div id="foo" style="color: red;">                    │   │
│  │    <input placeholder="..." />                         │   │
│  │    <button>Click</button>                              │   │
│  │  </div>                                                │   │
│  │                                                         │   │
│  │  • 浏览器渲染流水线处理                                  │   │
│  │  • 用户可见和交互                                        │   │
│  │  • 触发真实 DOM 事件                                       │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## 十、核心关系总结

| 层面 | 职责 | 生命周期 | 操作成本 |
|------|------|----------|----------|
| **组件层** | 封装复杂逻辑，组合子元素 | 与虚拟元素相同 | 低 |
| **虚拟元素层** | 描述 UI 结构，累积变更 | constructor → destroy | 极低 |
| **DOM 层** | 浏览器渲染，用户交互 | createElement → remove | 高 |

**关键设计决策：**

1. **虚拟元素作为唯一真实来源 (Single Source of Truth)**
   - 所有 UI 状态先更新虚拟属性
   - DOM 是虚拟元素的投影

2. **惰性渲染**
   - 虚拟树构建时不创建 DOM
   - 只在必要时渲染

3. **单向数据流**
   - 用户操作 → 虚拟属性变更 → DOM 同步
   - DOM 事件 → 虚拟状态更新 → 重新渲染（可选）

4. **组件组合**
   - 组件通过组合子虚拟元素实现
   - 内部元素也是虚拟元素
