# 元素初始化与渲染流程分析报告

## 一、当前架构概述

### 1.1 核心类层次结构

```
Tag (基类)
├── 基础元素 (div, span, button, input 等)
└── 组件类
    ├── VButton
    ├── VInput
    ├── VSelect
    ├── VTextarea
    ├── VCheckbox
    ├── VSwitch
    └── VField
```

### 1.2 Tag 基类的标准流程

```javascript
class Tag {
  constructor(tagName, setup = null) {
    // 1. 初始化实例属性
    this._tagName = tagName;
    this._attrs = {};
    this._styles = {};
    this._classes = new Set();
    this._events = {};
    this._children = [];
    this._boundElement = null;
    this._rendered = false;
    this._deleted = false;

    // 2. 立即执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  renderDom() {
    // 创建真实 DOM
    const element = this._boundElement || document.createElement(this._tagName);

    // 按顺序应用
    this._applyAttrs(element);      // 属性
    this._applyClasses(element);    // 类名
    this._applyStyles(element);     // 样式
    this._applyEvents(element);     // 事件
    this._applyContent(element);    // 内容
    this._applyChildren(element);   // 子元素

    this._boundElement = element;
    this._rendered = true;
    return element;
  }
}
```

---

## 二、发现的问题

### 2.1 问题总览

| 问题编号 | 问题描述 | 严重程度 | 影响组件 |
|---------|---------|---------|---------|
| P1 | setup 调用时机不一致 | 高 | 所有组件 |
| P2 | 状态初始化与事件绑定顺序混乱 | 高 | VButton, VField |
| P3 | 内部元素创建时机不明确 | 高 | 表单组件 |
| P4 | 虚拟样式到 DOM 的同步延迟 | 中 | 按钮点击特效 |
| P5 | renderDom 中子元素应用逻辑问题 | 中 | 所有组件 |
| P6 | 事件处理函数 this 指向混淆 | 低 | 事件相关 |

---

### 2.2 问题 P1: setup 调用时机不一致

**现象：**

不同组件中 setup 的调用位置不统一：

```javascript
// Tag 基类 / VInput / VTextarea - setup 在 constructor 开始
class Tag {
  constructor(tagName, setup = null) {
    // ... 初始化属性
    if (setup !== null) {
      this.setup(setup);  // ← 立即调用
    }
  }
}

// VButton - setup 在状态初始化之前
class VButton extends Tag {
  constructor(content = '', setup = null) {
    super('button', null);
    this._setupBaseStyles();
    this._registerStateHandlers();
    this.saveStateSnapshot('base');

    if (setup !== null) {
      this.setup(setup);  // ← 在状态处理器之后
    }

    this.initializeStates({...});  // ← setup 在 initializeStates 之前！
  }
}

// VField - setup 在状态初始化之前
class VField extends Tag {
  constructor(setup = null) {
    super('div', null);
    this._setupBaseStyles();
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);  // ← 在状态初始化之前
    }

    this.initializeStates({...});
  }
}
```

**问题分析：**

```
Tag 基类：     属性初始化 → setup()
VButton:      属性初始化 → 样式 → 状态处理器 → setup() → initializeStates()
VField:       属性初始化 → 样式 → 状态处理器 → setup() → initializeStates()
表单组件：    属性初始化 → 样式 → 状态处理器 → initializeStates() → setup() → _updateContent()
```

**影响：**
1. `setup` 中如果依赖状态（如 `hasState('disabled')`），在 VButton/VField 中会失败
2. `setup` 中如果依赖样式快照，在 VButton 中可能获取错误的快照
3. 代码维护困难，开发者需要记住每个组件的特殊行为

**修复建议：**

统一所有组件的初始化顺序为：

```
1. super() - 调用父类 constructor（不传 setup）
2. 注册状态属性 - registerStateAttrs()
3. 设置基础样式 - _setupBaseStyles()
4. 注册状态处理器 - _registerStateHandlers()
5. 初始化状态 - initializeStates()
6. 执行 setup - setup()
7. 创建内部元素 - _updateContent() / _buildContent()
```

---

### 2.3 问题 P2: 状态初始化与事件绑定顺序混乱

**现象：**

在 VButton 中，事件绑定发生在 `initializeStates()` 之前：

```javascript
class VButton extends Tag {
  constructor() {
    super('button', null);
    this._setupBaseStyles();  // ← 在这里绑定 mouseenter/mouseleave/mousedown/mouseup

    this._registerStateHandlers();

    // ...

    this.initializeStates({...});  // ← 事件绑定后才初始化状态
  }

  _setupBaseStyles() {
    this.on('mouseenter', () => {
      if (!this.hasState('disabled') && !this.hasState('loading')) {
        // ... hasState 在 initializeStates 之前调用！
      }
    });
  }
}
```

**问题分析：**

`hasState()` 方法依赖于 `_states` Set，而 `_states` 在 `initializeStates()` 之前是空的：

```javascript
// theme.js 中的实现
initializeStates(defaultStates = {}) {
  for (const [state, value] of Object.entries(defaultStates)) {
    if (value) {
      this._states.add(state);
    }
  }
}

hasState(stateName) {
  return this._states.has(stateName);  // ← 在 initializeStates 之前永远返回 false
}
```

**影响：**
1. 在 `initializeStates()` 之前绑定的事件中调用 `hasState()` 始终返回 `false`
2. 虽然最终状态是正确的（因为事件在实际交互时才触发），但逻辑上不严谨
3. 如果某个事件在构造时就触发，会得到错误的状态

**修复建议：**

将 `initializeStates()` 移到事件绑定之前：

```javascript
class VButton extends Tag {
  constructor() {
    super('button', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({...});  // ← 先初始化状态

    this._setupBaseStyles();       // ← 再绑定事件（此时 hasState 可用）
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }

    if (content) {
      this._updateContent();
    }
  }
}
```

---

### 2.4 问题 P3: 内部元素创建时机不明确

**现象：**

表单组件使用 `_updateContent()` 创建内部元素，但调用时机不一致：

```javascript
// VInput - 修复后在 constructor 末尾调用
constructor(setup = null) {
  // ...
  this.setup(setup);
  this._updateContent();  // ← 创建内部 input 元素
}

// _updateContent 是幂等的
_updateContent() {
  if (this._inputEl) return;  // ← 只创建一次
  // ... 创建 input 元素
}
```

**问题分析：**

1. **命名误导**：`_updateContent()` 暗示"更新"内容，实际是"创建"内容
2. **职责不清**：`_updateContent` 同时负责创建和可能的更新
3. **同步问题**：内部元素的属性在 setup 时可能还未设置

**修复建议：**

拆分创建和更新逻辑：

```javascript
class VInput extends Tag {
  constructor(setup = null) {
    super('div', null);
    this._setupBaseStyles();
    this._registerStateHandlers();
    this.initializeStates({...});
    this.setup(setup);
    this._createInternalElements();  // ← 明确是创建
  }

  _createInternalElements() {
    if (this._inputEl) return;

    this._inputEl = input(i => {
      i.styles({...});
    });

    this._syncAttrsToInternal();  // ← 单独的同步方法
    this.child(this._inputEl);
  }

  _syncAttrsToInternal() {
    if (!this._inputEl) return;
    if (this._placeholder) this._inputEl.attr('placeholder', this._placeholder);
    if (this._value !== undefined) this._inputEl.attr('value', this._value);
  }
}
```

---

### 2.5 问题 P4: 虚拟样式到 DOM 的同步延迟

**现象：**

按钮点击特效中，`this.style('transform', 'scale(0.98)')` 只更新虚拟样式，不立即反映到 DOM：

```javascript
// VButton._setupBaseStyles()
this.on('mousedown', () => {
  this.style('transform', 'scale(0.98)');  // ← 只更新 this._styles
  // 没有立即同步到 this._boundElement.style
});

// Tag.style() 方法
style(name, value) {
  this._styles[name] = value;  // ← 只更新虚拟样式对象
  return this;
}

// Tag._applyStyles() - 只在 renderDom 时调用
_applyStyles(element) {
  for (const [name, value] of Object.entries(this._styles)) {
    element.style[name] = value;
  }
}
```

**问题分析：**

```
┌─────────────────┐         ┌─────────────────┐
│  this._styles   │         │ _boundElement   │
│  (虚拟样式)     │         │ (真实 DOM)      │
├─────────────────┤         ├─────────────────┤
│ transform:      │         │ transform:      │
│ scale(0.98)     │  ──✗──  │ scale(1)        │
│                 │  不同步  │                 │
└─────────────────┘         └─────────────────┘
```

**影响：**
1. 按钮点击时没有视觉反馈（缩放特效）
2. 所有运行时样式变更都需要手动同步到 DOM

**修复方案（已实施）：**

在事件处理函数中同时更新虚拟样式和真实 DOM：

```javascript
this.on('mousedown', (e) => {
  e.preventDefault();
  if (!this.hasState('disabled') && !this.hasState('loading')) {
    this.style('transform', 'scale(0.98)');
    // 立即同步到 DOM
    if (this._boundElement) {
      this._boundElement.style.transform = 'scale(0.98)';
    }
  }
});
```

**更好的修复方案（建议）：**

在 `style()` 方法中增加实时同步选项：

```javascript
style(name, value, syncImmediately = false) {
  if (typeof name === 'object') {
    for (const [k, v] of Object.entries(name)) {
      this._styles[k] = v;
    }
  } else {
    this._styles[name] = value;
  }

  // 如果要求立即同步且 DOM 已绑定
  if (syncImmediately && this._boundElement) {
    if (typeof name === 'object') {
      for (const [k, v] of Object.entries(name)) {
        this._boundElement.style[k] = v;
      }
    } else {
      this._boundElement.style[name] = value;
    }
  }
  return this;
}

// 使用
this.on('mousedown', () => {
  this.style('transform', 'scale(0.98)', true);  // ← 立即同步
});
```

---

### 2.6 问题 P5: renderDom 中子元素应用逻辑问题

**现象：**

`_applyChildren` 方法在处理子元素时的逻辑：

```javascript
_applyChildren(element) {
  const validChildren = this._children.filter(c => !c._deleted);

  for (const child of validChildren) {
    if (child._rendered && child._boundElement) {
      // 已渲染的子元素直接使用
      element.appendChild(child._boundElement);
    } else {
      // 未渲染的子元素先渲染
      const childEl = child.renderDom();
      if (childEl) {
        element.appendChild(childEl);
      }
    }
  }
}
```

**问题分析：**

1. **递归渲染时机**：父元素 renderDom 时才渲染子元素，可能导致深层嵌套元素渲染延迟
2. **重复渲染风险**：多次调用 renderDom 可能导致子元素被重复添加
3. **状态同步问题**：子元素在父元素渲染后独立变更，可能不同步

**修复建议：**

引入渲染状态管理：

```javascript
renderDom() {
  if (this._deleted) return null;

  // 避免重复渲染
  if (this._rendered && this._boundElement?.isConnected) {
    return this._boundElement;
  }

  const element = this._boundElement || document.createElement(this._tagName);

  // 标记为渲染中，防止递归
  this._isRendering = true;

  this._applyAttrs(element);
  this._applyClasses(element);
  this._applyStyles(element);
  this._applyEvents(element);
  this._applyContent(element);
  this._applyChildren(element);

  this._isRendering = false;
  this._boundElement = element;
  this._rendered = true;

  return element;
}
```

---

### 2.7 问题 P6: 事件处理函数 this 指向混淆

**现象：**

```javascript
// _applyEvents 中
element.addEventListener(event, (e) => {
  // this 指向 Tag 实例（正确）
  this._events[event]?.forEach(handler => handler(e));
});

// 但在组件中
_setupBaseStyles() {
  this.on('mousedown', () => {
    // this 指向 Tag 实例（正确，因为箭头函数）
    this.style('transform', 'scale(0.98)');
  });

  this.on('click', function(e) {
    // this 指向 DOM 元素（错误！如果用普通函数）
    this.style('transform', 'scale(1)');  // ❌ this.style 不存在
  });
}
```

**问题分析：**

1. 箭头函数：`this` 指向组件实例 ✓
2. 普通函数：`this` 指向 DOM 元素 ✗

**修复建议：**

1. **统一使用箭头函数**
2. **或者在事件处理器中绑定 this**

```javascript
// 方案 1：箭头函数（推荐）
this.on('click', (e) => {
  this.style('transform', 'scale(1)');  // this 指向组件
});

// 方案 2：显式绑定
this.on('click', function(e) {
  this.style('transform', 'scale(1)');
}.bind(this));
```

---

## 三、推荐的标准化流程

### 3.1 统一的生命周期流程

```
┌────────────────────────────────────────────────────────────┐
│                    Component Constructor                    │
├────────────────────────────────────────────────────────────┤
│  1. super(tagName, null)    // 调用父类，暂不执行 setup    │
│  2. registerStateAttrs()    // 注册状态属性                │
│  3. initializeStates()      // 初始化状态值                │
│  4. _setupBaseStyles()      // 设置基础样式                │
│  5. _registerStateHandlers()// 注册状态处理器              │
│  6. saveStateSnapshot()     // 保存状态快照（可选）        │
│  7. setup(setup)            // 执行用户配置                │
│  8. _createInternalElements() // 创建内部元素              │
│  9. _syncAttrsToInternal()  // 同步属性到内部元素          │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                      renderDom()                            │
├────────────────────────────────────────────────────────────┤
│  1. 检查 _deleted / _rendered 标记                          │
│  2. 创建或获取 this._boundElement                          │
│  3. _applyAttrs() - 应用属性                               │
│  4. _applyClasses() - 应用类名                             │
│  5. _applyStyles() - 应用样式                              │
│  6. _applyEvents() - 应用事件                              │
│  7. _applyContent() - 应用内容                             │
│  8. _applyChildren() - 应用子元素（递归渲染）              │
│  9. 返回 this._boundElement                                │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                  Runtime Updates                            │
├────────────────────────────────────────────────────────────┤
│  • 样式变更：style(name, value, syncImmediately=true)      │
│  • 状态变更：setState(state, value) → 触发状态处理器       │
│  • 内容变更：直接操作 this._boundElement                   │
│  • 事件触发：自动同步到 DOM                                 │
└────────────────────────────────────────────────────────────┘
```

### 3.2 标准化代码模板

```javascript
// 组件开发模板
class MyComponent extends Tag {
  static _stateAttrs = ['disabled', 'loading'];

  constructor(setup = null) {
    super('div', null);  // 1. 调用父类

    // 2. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 3. 初始化状态
    this.initializeStates({
      disabled: false,
      loading: false,
    });

    // 4. 设置基础样式
    this._setupBaseStyles();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素
    this._createInternalElements();
  }

  _setupBaseStyles() {
    this.styles({
      display: 'inline-flex',
      // ...
    });

    // 事件绑定（使用箭头函数）
    this.on('click', (e) => {
      // this 指向组件实例
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (disabled, host) => {
      if (disabled) {
        host.styles({ opacity: '0.5', pointerEvents: 'none' });
      } else {
        host.styles({ opacity: '1', pointerEvents: 'auto' });
      }
    });
  }

  _createInternalElements() {
    if (this._internalEl) return;
    // 创建逻辑
  }

  renderDom() {
    if (this._deleted) return null;
    if (this._rendered && this._boundElement?.isConnected) {
      return this._boundElement;
    }
    // ... 标准渲染流程
  }
}
```

---

## 六、修复记录

### 2026-03-01: 修复 P1 和 P2 问题

**修复内容：**

统一了 VButton 和 VField 组件的初始化流程，将 `initializeStates()` 移到事件绑定之前。

**VButton 修改：**

```javascript
// 修改前
class VButton extends Tag {
  constructor(content = '', setup = null) {
    super('button', null);
    this.registerStateAttrs(...this.constructor._stateAttrs);
    this._setupBaseStyles();           // ← 事件绑定在此
    this._registerStateHandlers();
    this.saveStateSnapshot('base');
    this.setup(setup);
    this.initializeStates({...});      // ← 状态初始化在最后！
  }
}

// 修改后
class VButton extends Tag {
  constructor(content = '', setup = null) {
    super('button', null);
    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({...});      // ← 1. 先初始化状态
    this._setupBaseStyles();           // ← 2. 再绑定事件（此时 hasState 可用）
    this._registerStateHandlers();
    this.saveStateSnapshot('base');
    this.setup(setup);                 // ← 3. setup 在状态初始化之后
    this._updateContent();
  }
}
```

**VField 修改：**

```javascript
// 修改前
class VField extends Tag {
  constructor(setup = null) {
    super('div', null);
    this.registerStateAttrs(...this.constructor._stateAttrs);
    this._setupBaseStyles();
    this._registerStateHandlers();
    this.setup(setup);
    this.initializeStates({...});      // ← 状态初始化在最后！
  }
}

// 修改后
class VField extends Tag {
  constructor(setup = null) {
    super('div', null);
    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({...});      // ← 1. 先初始化状态
    this._setupBaseStyles();           // ← 2. 再绑定事件
    this._registerStateHandlers();
    this.setup(setup);                 // ← 3. setup 在状态初始化之后
    this._buildShowContent();
  }
}
```

**验证结果：**
- ✅ 所有单元测试通过
- ✅ TypeScript 类型检查通过
- ✅ `hasState()` 在事件处理函数中可正确使用

---

## 四、待修复问题清单

| 优先级 | 问题 | 修复方案 | 影响范围 | 状态 |
|-------|------|---------|---------|------|
| ~~P0~~ | ~~setup 调用时机不统一~~ | ~~统一移到 initializeStates 之后~~ | ~~所有组件~~ | ✅ 已修复 (VButton, VField) |
| ~~P0~~ | ~~状态初始化在事件绑定之后~~ | ~~调整顺序，先 initializeStates~~ | ~~VButton, VField~~ | ✅ 已修复 |
| ~~P1~~ | ~~虚拟样式不同步到 DOM~~ | ~~style() 增加 syncImmediately 参数~~ | ~~所有运行时样式~~ | ✅ 已修复 (Tag 基类) |
| P1 | _updateContent 命名误导 | 重命名为_createInternalElements | 表单组件 | ⏳ 设计中 |
| P2 | renderDom 重复渲染风险 | 增加_rendering 标记 | Tag 基类 | ⏳ 设计中 |
| P2 | 事件处理函数 this 指向 | 统一使用箭头函数 | 所有组件事件 | ⏳ 已分析 |

---

## 五、设计方案详解

### 5.1 P1 修复：虚拟样式同步到 DOM

**设计决策：**
在 `style()` 和 `styles()` 方法中增加 `syncImmediately` 参数，允许在运行时立即同步样式到 DOM。

**API 设计：**
```javascript
// 单一样式
style(name, value, syncImmediately = false)

// 批量样式
styles(stylesObj, syncImmediately = false)
```

**使用场景：**
1. **事件驱动的运行时样式变更**（如按钮点击特效）
2. **动画相关的样式更新**
3. **需要根据用户交互立即反馈的场景**

**示例：**
```javascript
// VButton 点击特效
this.on('mousedown', () => {
  this.style('transform', 'scale(0.98)', true);  // 立即同步
});

// hover 效果
this.on('mouseenter', () => {
  this.styles({ background: 'red' }, true);  // 立即同步
});
```

**实现细节：**
```javascript
style(name, value, syncImmediately = false) {
  if (typeof name === 'object') {
    for (const [k, v] of Object.entries(name)) {
      this._styles[k] = v;
    }
    if (syncImmediately && this._boundElement) {
      for (const [k, v] of Object.entries(name)) {
        this._boundElement.style[k] = v;
      }
    }
  } else {
    this._styles[name] = value;
    if (syncImmediately && this._boundElement) {
      this._boundElement.style[name] = value;
    }
  }
  return this;
}
```

---

### 5.2 P3 设计：_updateContent 重命名

**问题分析：**
`_updateContent()` 方法名暗示"更新"内容，但实际职责是"创建"内部元素。

**当前使用情况：**
- `VInput._updateContent()` - 创建内部 input 元素
- `VSelect._updateContent()` - 创建内部 select 元素和选项
- `VTextarea._updateContent()` - 创建内部 textarea 元素
- `VCheckbox._updateContent()` - 创建内部 checkbox 元素
- `VButton._updateContent()` - 更新按钮内容（loading 状态）

**设计决策：**
拆分"创建"和"更新"职责：

```javascript
class VInput extends Tag {
  // 创建内部元素（只调用一次）
  _createInternalElements() {
    if (this._inputEl) return;  // 幂等性保护

    this._inputEl = input(i => { ... });
    this._syncAttrsToInternal();
    this.child(this._inputEl);
  }

  // 同步属性到内部元素（可多次调用）
  _syncAttrsToInternal() {
    if (!this._inputEl) return;
    if (this._placeholder) this._inputEl.attr('placeholder', this._placeholder);
    if (this._value !== undefined) this._inputEl.attr('value', this._value);
  }

  // 更新内容（供外部调用）
  _updateContent() {
    this._createInternalElements();
    this._syncAttrsToInternal();
  }
}
```

**命名规范：**
| 方法名 | 职责 | 调用时机 |
|-------|------|---------|
| `_createInternalElements()` | 创建内部元素 | constructor |
| `_syncAttrsToInternal()` | 同步属性 | setup 后/属性变更时 |
| `_updateContent()` | 统一入口（创建 + 同步） | 组件外部调用 |

---

### 5.3 P5 设计：renderDom 重复渲染防护

**问题分析：**
多次调用 `renderDom()` 可能导致：
1. 子元素重复添加
2. 事件重复绑定
3. 性能浪费

**设计决策：**
增加渲染状态标记和防护机制：

```javascript
renderDom() {
  if (this._deleted) return null;

  // 已渲染且仍在 DOM 中，直接复用
  if (this._rendered && this._boundElement?.isConnected) {
    return this._boundElement;
  }

  // 渲染中保护（防止递归）
  if (this._isRendering) {
    return this._boundElement;
  }

  this._isRendering = true;

  try {
    const element = this._boundElement || document.createElement(this._tagName);

    this._applyAttrs(element);
    this._applyClasses(element);
    this._applyStyles(element);
    this._applyEvents(element);
    this._applyContent(element);
    this._applyChildren(element);

    this._boundElement = element;
    this._rendered = true;

    return element;
  } finally {
    this._isRendering = false;
  }
}
```

**状态流转：**
```
未渲染 (_rendered=false)
    │
    ▼ renderDom() 调用
渲染中 (_isRendering=true)
    │
    ▼ 渲染完成
已渲染 (_rendered=true, _boundElement.isConnected=true)
    │
    ├─ renderDom() → 直接返回 _boundElement
    └─ 从 DOM 移除 → isConnected=false → 可重新渲染
```

---

### 5.4 P6 设计：事件处理 this 指向规范

**问题分析：**
- 箭头函数：`this` 指向组件实例 ✓
- 普通函数：`this` 指向 DOM 元素 ✗

**设计规范：**

```javascript
// ✅ 推荐：统一使用箭头函数
_setupBaseStyles() {
  this.on('click', (e) => {
    this.style('color', 'red');  // this 指向组件
  });
}

// ✅ 可接受：显式绑定
_setupBaseStyles() {
  this.on('click', function(e) {
    this.style('color', 'red');
  }.bind(this));
}

// ❌ 禁止：普通函数
_setupBaseStyles() {
  this.on('click', function(e) {
    this.style('color', 'red');  // this 指向 DOM！
  });
}
```

**代码审查检查点：**
- [ ] 所有事件处理函数使用箭头函数
- [ ] 如需使用 `this` 访问 DOM，通过 `e.target` 或 `this._boundElement`
- [ ] 组件销毁时清理事件绑定

---

## 六、总结

当前 Yoya.Basic 库的元素初始化和渲染流程已有以下改进：

**已修复：**
1. ✅ VButton 和 VField 组件的 setup 调用时机统一
2. ✅ VButton 和 VField 的状态初始化移到事件绑定之前
3. ✅ Tag 基类 `style()` 和 `styles()` 方法支持 `syncImmediately` 参数

**待修复：**
1. ⏳ 表单组件 `_updateContent()` 重命名为 `_createInternalElements()`
2. ⏳ Tag 基类 `renderDom()` 增加重复渲染防护
3. ⏳ 统一所有组件事件处理函数使用箭头函数

**架构改进建议：**
- 所有组件遵循相同的生命周期顺序
- 提供可选的实时 DOM 同步机制（`syncImmediately`）
- 明确方法命名和职责边界
- 增加渲染状态管理防止重复渲染
