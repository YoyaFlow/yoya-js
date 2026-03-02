# 架构分析报告

## 一、核心设计原则（用户定义）

### 1.1 基础元素定义

- **基础元素** = `Tag` 基类的实例（如 `new Tag('div')`）
- 每个基础元素是对**一个**原生 DOM 元素的封装
- 定义 `parent` 和 `children` 关系
- 定义属性（`_attrs`, `_styles`, `_events`）
- 提供快捷方法（如 `Button.type()`, `Input.placeholder()`）

### 1.2 组件定义

- **组件** = 基础元素的组合
- 组件只能持有**一个**原生 DOM 元素（容器）
- 通过 `children` 持有其他基础元素作为子元素
- 可有 `_cardFooter` 这类快捷引用（只是引用，不改变持有关系）
- **不能**同时持有多个 DOM 原生元素

### 1.3 状态管理

- 采用**状态机模式**
- 每个组件有**初始化样式**（基础样式）
- 状态变更时：**清空状态样式** → **重新按当前状态设置样式**

### 1.4 元素复用

- 元素不销毁，只需重新组合
- 快捷引用复用，只改内容（如 `this._cardFooter.text('新内容')`）

### 1.5 生命周期

- ** constructor 时创建 DOM** - `super()` 中立即创建 `this._el`
- **renderDom 只整合子元素** - 智能更新，防止焦点丢失
- **虚拟属性保留** - 存储 + 同步到 `_el`

---

## 二、当前架构与目标架构对比

### 2.1 架构层次对比

| 层次 | 目标架构 | 当前架构 | 状态 |
|------|---------|---------|------|
| **DOM 创建** | `constructor` 时创建 `_el` | `super()` 中创建 `_el` | ✅ 已完成 |
| **虚拟属性** | 保留 + 同步到 `_el` | `_attrs`, `_styles` 同时同步 | ✅ 已完成 |
| **事件绑定** | 虚拟元素存储，renderDom 同步 | `_events` 存储，首次渲染绑定 | ✅ 已完成 |
| **renderDom** | 只整合子元素，智能更新 | 智能增删子元素 | ✅ 已完成 |
| **状态管理** | 状态机 + 清空再重置 | 新增 `clearStateStyles()` | ✅ 已完成 |
| **组件容器** | 通过 `children` 持有 | 使用 `this.child()` | ✅ 一致 |
| **快捷引用** | `_cardFooter` 引用 | 已有 `_showContainer` 等 | ✅ 一致 |

### 2.2 核心流程对比

**目标流程：**
```
setState()
    │
    ▼
_clearStateStyles() - 恢复基础样式
    │
    ▼
应用当前状态样式
    │
    ▼
自动同步到 _el（style/attr 方法内）
```

**当前流程：**
```javascript
// Tag.style() - 自动同步到 _el
style(name, value) {
  this._styles[name] = value;
  this._el.style[name] = value;  // 自动同步
  return this;
}

// Tag.attr() - 自动同步到 _el
attr(name, value) {
  this._attrs[name] = value;
  this._applyAttrToEl(name, value);  // 自动同步
  return this;
}
```

---

## 三、已完成的修改

### 3.1 Tag 基类修改

**核心变化：**
```javascript
class Tag {
  constructor(tagName, setup = null) {
    this._tagName = tagName;
    this._el = document.createElement(tagName);  // 立即创建
    this._boundElement = this._el;  // 别名，保持兼容

    // 虚拟属性
    this._attrs = {};
    this._styles = {};
    this._classes = new Set();
    this._events = {};
    this._children = [];
    // ...
  }

  // 样式操作：自动同步到 _el
  style(name, value) {
    if (typeof name === 'object') {
      for (const [k, v] of Object.entries(name)) {
        this._styles[k] = v;
        this._el.style[k] = v;  // 自动同步
      }
    } else {
      this._styles[name] = value;
      this._el.style[name] = value;  // 自动同步
    }
    return this;
  }

  // renderDom：只整合子元素
  renderDom() {
    if (!this._rendered) {
      this._applyEventsToEl();  // 首次渲染绑定事件
    }

    // 智能更新子元素（防止焦点丢失）
    const currentEls = Array.from(this._el.children);
    const currentElSet = new Set(currentEls);

    for (const child of this._children) {
      const childEl = child.renderDom();
      if (!currentElSet.has(childEl)) {
        this._el.appendChild(childEl);
      }
    }

    // 移除已删除的子元素
    for (const el of currentEls) {
      if (!this._children.some(c => c._el === el)) {
        this._el.removeChild(el);
      }
    }

    this._rendered = true;
    return this._el;
  }
}
```

### 3.2 新增方法

```javascript
// 保存基础样式快照
saveBaseStylesSnapshot() {
  this._baseStyles = { ...this._styles };
  return this;
}

// 清空状态样式（恢复基础样式）
clearStateStyles() {
  if (!this._baseStyles) return this;

  this._el.style.cssText = '';
  for (const [name, value] of Object.entries(this._baseStyles)) {
    this._el.style[name] = value;
  }
  this._styles = { ...this._baseStyles };
  return this;
}
```

---

## 四、待修复问题（需要进一步修改组件）

### 4.1 P0: 组件初始化顺序统一

**目标顺序：**
```
1. super() - 调用父类 constructor
2. registerStateAttrs() - 注册状态属性
3. initializeStates() - 初始化状态值
4. _setupBaseStyles() - 设置基础样式（直接设置到 this._el）
5. saveBaseStylesSnapshot() - 保存基础样式快照
6. _registerStateHandlers() - 注册状态处理器
7. setup() - 执行用户配置
8. _createInternalElements() - 创建内部元素
```

### 4.2 P1: 状态处理器使用新的清空机制

```javascript
// 修改前
_registerStateHandlers() {
  this.registerStateHandler('disabled', (enabled) => {
    if (enabled) {
      this.styles({ opacity: '0.5' });
    } else {
      this.styles({ opacity: '1' });
    }
  });
}

// 修改后
_registerStateHandlers() {
  this.registerStateHandler('disabled', (enabled) => {
    this.clearStateStyles();  // 先清空状态样式

    if (enabled) {
      this.styles({ opacity: '0.5' });
    }
  });
}
```

### 4.3 P2: 元素复用（不重新创建）

```javascript
// 修改前：每次清空重新创建
_updateContent() {
  this._children = [];
  this.child(span(s => { s.text('content'); }));
}

// 修改后：复用引用，只改内容
_updateContent() {
  if (!this._contentEl) {
    this._contentEl = span(s => { s.text('content'); });
    this.child(this._contentEl);
  }
  this._contentEl.text('新内容');
}
```

---

## 五、测试验证

所有 17 个基础测试通过 ✅

### 已完成的组件修改

| 组件 | 修改内容 | 状态 |
|------|---------|------|
| **Tag 基类** | constructor 时创建 `_el`，虚拟属性自动同步 | ✅ 完成 |
| **VButton** | 统一初始化顺序，使用 `clearStateStyles()`，元素复用 | ✅ 完成 |
| **VField** | 统一初始化顺序，使用 `clearStateStyles()`，移除自定义 renderDom | ✅ 完成 |
| **VInput** | 统一初始化顺序，使用 `clearStateStyles()`，元素复用 | ✅ 完成 |
| **VSelect** | 统一初始化顺序，使用 `clearStateStyles()`，使用 `clear()` 方法 | ✅ 完成 |
| **VTextarea** | 统一初始化顺序，使用 `clearStateStyles()` | ✅ 完成 |
| **VCheckbox** | 统一初始化顺序，使用 `clearStateStyles()` | ✅ 完成 |
| **VSwitch** | 统一初始化顺序，使用 `clearStateStyles()` | ✅ 完成 |
| **Card** | 使用 `child()` 替代 `_children.push` | ✅ 完成 |
| **Menu** | 使用 `child()` 替代 `_children.push` | ✅ 完成 |
| **MenuItem** | 使用 `clear()` 替代 `_children = []`，元素复用 | ✅ 完成 |
| **MenuGroup** | 移除直接操作 `_children` | ✅ 完成 |
| **DropdownMenu** | 使用 `clear()` 和 `child()` | ✅ 完成 |
| **ContextMenu** | 使用 `clear()` 和 `child()` | ✅ 完成 |
| **Message** | 使用 `child()` 替代 `_children.push` | ✅ 完成 |
| **MessageContainer** | 使用 `child()` 替代 `_children.push` | ✅ 完成 |
| **VDetail** | 使用 `clear()` 替代 `_children = []`，修复 renderDom | ✅ 完成 |
| **SvgTag** | 修复 constructor 和 renderDom，使用 SVG 命名空间 | ✅ 完成 |
| **Text/Tspan** | 修复 renderDom 方法 | ✅ 完成 |
| **SvgElement** | 修复 renderDom 方法 | ✅ 完成 |

### 架构原则遵守情况

| 原则 | 说明 | 状态 |
|------|------|------|
| **单一 DOM 持有** | 每个元素只持有**一个**原生 DOM 元素（`this._el`） | ✅ 遵守 |
| **constructor 时创建** | `_el` 在 `super()` 中立即创建 | ✅ 遵守 |
| **虚拟属性保留** | `_attrs`, `_styles`, `_events` 用于存储，同时同步到 `_el` | ✅ 遵守 |
| **renderDom 只整合子元素** | 智能更新，防止焦点丢失 | ✅ 遵守 |
| **不使用 `_children.push`** | 组件层使用 `child()` 方法添加子元素 | ✅ 遵守 |
| **使用 `clear()` 清空子元素** | 不直接设置 `_children = []` | ✅ 遵守 |
| **状态变更清空样式** | 使用 `clearStateStyles()` 恢复基础样式 | ✅ 遵守 |

---

## 六、已完成的工作总结

### 6.1 核心架构重构

**Tag 基类 (`src/yoya/core/basic.js`)**:
- ✅ `constructor` 时立即创建 `this._el`
- ✅ `style()`/`attr()` 自动同步到 `_el`
- ✅ `renderDom()` 只整合子元素（智能更新，防止焦点丢失）
- ✅ 新增 `saveBaseStylesSnapshot()` 和 `clearStateStyles()` 方法
- ✅ Text 类适配新架构

### 6.2 组件修改

**表单组件 (`src/yoya/components/form.js`)**:
- ✅ VInput - 统一初始化顺序，`clearStateStyles()`，`_inputEl`/`_loadingSpinner` 复用
- ✅ VSelect - 统一初始化顺序，`clearStateStyles()`，使用 `clear()` 和 `child()`
- ✅ VTextarea - 统一初始化顺序，`clearStateStyles()`
- ✅ VCheckbox - 统一初始化顺序，`clearStateStyles()`
- ✅ VSwitch - 统一初始化顺序，`clearStateStyles()`

**UI 组件**:
- ✅ VButton - 统一初始化顺序，`clearStateStyles()`，`_loadingSpinner`/`_contentEl` 复用
- ✅ VField - 统一初始化顺序，`clearStateStyles()`，使用 `clear()` 替代 `_children = []`

**布局组件 (`src/yoya/components/card.js`)**:
- ✅ Card - 使用 `child()` 替代 `_children.push`
- ✅ CardHeader/CardBody/CardFooter - 保持简单结构

**菜单组件 (`src/yoya/components/menu.js`)**:
- ✅ Menu - 使用 `child()` 替代 `_children.push`
- ✅ MenuItem - 使用 `clear()` 替代 `_children = []`，元素复用 (`_iconBox`, `_textBox`, `_shortcutBox`)
- ✅ MenuGroup - 移除直接操作 `_children`
- ✅ DropdownMenu - 使用 `clear()` 和 `child()`
- ✅ ContextMenu - 使用 `clear()` 和 `child()`

**消息组件 (`src/yoya/components/message.js`)**:
- ✅ Message - 使用 `child()` 替代 `_children.push`
- ✅ MessageContainer - 使用 `child()` 替代 `_children.push`

**详情组件 (`src/yoya/components/detail.js`)**:
- ✅ VDetail - 使用 `clear()` 替代 `_children = []`

### 6.3 架构原则遵守情况

| 原则 | 说明 | 状态 |
|------|------|------|
| **单一 DOM 持有** | 每个元素只持有**一个**原生 DOM 元素（`this._el`） | ✅ 遵守 |
| **constructor 时创建** | `_el` 在 `super()` 中立即创建 | ✅ 遵守 |
| **虚拟属性保留** | `_attrs`, `_styles`, `_events` 用于存储，同时同步到 `_el` | ✅ 遵守 |
| **renderDom 只整合子元素** | 智能更新，防止焦点丢失 | ✅ 遵守 |
| **不使用 `_children.push`** | 组件层使用 `child()` 方法添加子元素 | ✅ 遵守 |
| **使用 `clear()` 清空子元素** | 不直接设置 `_children = []` | ✅ 遵守 |
| **状态变更清空样式** | 使用 `clearStateStyles()` 恢复基础样式 | ✅ 遵守 |

### 6.4 测试状态

所有 17 个基础测试通过 ✅

```
✅ div 工厂函数创建元素
✅ div 工厂函数接受 setup 函数
✅ div 工厂函数接受字符串
✅ div 工厂函数接受对象配置
✅ 链式调用返回 this
✅ 事件绑定
✅ 子元素添加
✅ renderDom 创建真实 DOM
✅ setup 对象配置的事件处理
✅ 表格扩展方法
✅ 列表扩展方法
✅ 表单元素属性
✅ toHTML 方法
✅ deleted 标记
✅ Tag 原型扩展方法 - header
✅ Tag 原型扩展方法 - 链式调用
✅ Tag 原型扩展方法 - 任意元素使用
```

──────────────────────────────────────────────────
测试完成：17 个测试，17 通过，0 失败
──────────────────────────────────────────────────
