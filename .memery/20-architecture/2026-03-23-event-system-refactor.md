# 事件系统重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构 Yoya.Basic 事件系统，实现按需绑定和动态读取机制，解决绑定时机和虚拟/真实 DOM 同步问题。

**Architecture:**
1. Tag 基类添加 `_boundEvents` 记录已绑定事件类型
2. `on()` 方法改为按需绑定：首次注册时绑定 DOM 监听器
3. DOM 监听器每次触发时动态读取 `_events[event]` 数组
4. 所有组件统一使用 `onClick` 等大驼峰命名的事件方法

**Tech Stack:** 原生 JavaScript ESM 模块，jsdom 测试环境

---

## 文件结构

### 需要修改的文件

| 文件 | 职责 |
|------|------|
| `src/yoya/core/basic.js` | Tag 基类事件系统核心实现 |
| `src/yoya/components/card.js` | VCard 组件适配 onClick |
| `src/yoya/components/interaction.js` | VTree 等交互组件事件适配 |
| `src/yoya/index.d.ts` | Tag 基类类型定义更新 |
| `src/yoya/components/index.d.ts` | 组件类型定义更新 |

### 需要创建的测试文件

| 文件 | 职责 |
|------|------|
| `tests/event-system.test.js` | 事件系统核心功能测试 |
| `tests/components/event-components.test.js` | 组件事件适配测试 |

---

## 实施任务

### Task 1: Tag 基类事件系统核心实现

**Files:**
- Modify: `src/yoya/core/basic.js`
- Create: `tests/event-system.test.js`

- [ ] **Step 1: 编写基础事件绑定测试**

```javascript
// tests/event-system.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { div, Tag } from '../src/yoya/index.js';

describe('事件系统核心功能', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('应该支持多次绑定同一事件类型', () => {
    const clickHandler1 = vi.fn();
    const clickHandler2 = vi.fn();

    const el = div('点击我');
    el.on('click', clickHandler1);
    el.on('click', clickHandler2);
    el.bindTo(container);

    el._el.click();

    expect(clickHandler1).toHaveBeenCalledTimes(1);
    expect(clickHandler2).toHaveBeenCalledTimes(1);
  });

  it('应该支持动态添加事件处理器', () => {
    const clickHandler1 = vi.fn();
    const clickHandler2 = vi.fn();

    const el = div('点击我');
    el.on('click', clickHandler1);
    el.bindTo(container);

    // 先触发一次
    el._el.click();
    expect(clickHandler1).toHaveBeenCalledTimes(1);

    // 动态添加第二个处理器
    el.on('click', clickHandler2);

    // 再次触发，两个处理器都应该被调用
    el._el.click();
    expect(clickHandler1).toHaveBeenCalledTimes(2);
    expect(clickHandler2).toHaveBeenCalledTimes(1);
  });

  it('应该按需绑定 DOM 事件监听器', () => {
    const el = div('测试');
    el.bindTo(container);

    // 初始时没有绑定任何事件
    expect(el._boundEvents).toEqual({});

    // 绑定 click 事件
    el.on('click', vi.fn());
    expect(el._boundEvents).toEqual({ click: true });

    // 再次绑定 click 事件，_boundEvents 不变
    el.on('click', vi.fn());
    expect(el._boundEvents).toEqual({ click: true });

    // 绑定 mouseenter 事件
    el.on('mouseenter', vi.fn());
    expect(el._boundEvents).toEqual({ click: true, mouseenter: true });
  });

  it('onClick 应该传递统一事件对象', () => {
    const handler = vi.fn();

    const el = div('点击我');
    el.onClick(handler);
    el.bindTo(container);

    el._el.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const context = handler.mock.calls[0][0];
    expect(context).toHaveProperty('event');
    expect(context).toHaveProperty('target');
    expect(context.target).toBe(el);
  });

  it('onChangeValue 应该传递 value 和 oldValue', () => {
    const handler = vi.fn();

    const input = document.createElement('input');
    input.value = 'initial';
    container.appendChild(input);

    const el = new Tag('input');
    el._el = input;
    el.onChangeValue(handler);

    input.value = 'changed';
    input.dispatchEvent(new Event('change'));

    expect(handler).toHaveBeenCalledTimes(1);
    const context = handler.mock.calls[0][0];
    expect(context.value).toBe('changed');
    expect(context.oldValue).toBe('initial');
  });
});
```

- [ ] **Step 2: 运行测试验证失败**

```bash
npm test -- tests/event-system.test.js
```

Expected: FAIL - `_boundEvents` 未定义，`_bindEventToEl` 方法不存在

- [ ] **Step 3: 修改 Tag 构造函数添加 `_boundEvents`**

```javascript
// src/yoya/core/basic.js - Tag 构造函数内
constructor(tagName, setup = null) {
  this._tagName = tagName;

  // Q1 B: 立即创建 DOM 元素
  this._el = document.createElement(tagName);
  this._boundElement = this._el;

  // Q2 A: 保留虚拟属性
  this._attrs = {};
  this._styles = {};
  this._classes = new Set();
  this._events = {};
  this._children = [];
  this._props = {};

  // 新增：记录已绑定到 DOM 的事件类型
  this._boundEvents = {};

  // 状态管理
  this._states = new Set();
  this._stateStyles = {};
  this._baseStyles = null;

  // 渲染状态
  this._rendered = false;
  this._deleted = false;

  if (setup !== null) {
    this.setup(setup);
  }
}
```

- [ ] **Step 4: 实现 `_bindEventToEl` 方法**

```javascript
// src/yoya/core/basic.js - 在 _applyEventsToEl 方法后添加

/**
 * 将单个事件类型绑定到 DOM 元素
 * 每个事件类型只绑定一次，使用统一的委托处理器
 * @param {string} event - 事件名称
 * @private
 */
_bindEventToEl(event) {
  this._el.addEventListener(event, (nativeEvent) => {
    // 附加虚拟元素引用到原生事件
    nativeEvent._vnode = this;

    // 关键：每次触发时动态读取当前 _events
    // 这样即使 handler 是在绑定监听器之后添加的，也能被调用
    const handlers = this._events[event] || [];
    handlers.forEach(handler => handler.call(this._el, nativeEvent));
  });
}
```

- [ ] **Step 5: 修改 `on()` 方法实现按需绑定**

```javascript
// src/yoya/core/basic.js - on 方法

/**
 * 绑定事件处理器
 * @param {string} event - 事件名称
 * @param {Function} handler - 事件处理函数
 * @returns {this} 返回当前实例支持链式调用
 */
on(event, handler) {
  // 1. 登记事件处理器到虚拟元素
  if (!this._events[event]) {
    this._events[event] = [];
  }
  this._events[event].push(handler);

  // 2. 如果这个事件类型还没有绑定到 DOM，现在绑定
  if (!this._boundEvents[event] && this._el) {
    this._bindEventToEl(event);
    this._boundEvents[event] = true;
  }

  return this;
}
```

- [ ] **Step 6: 移除或废弃 `_applyEventsToEl` 方法**

```javascript
// src/yoya/core/basic.js - 保留 _applyEventsToEl 但标记为废弃
// 为了向后兼容，暂时保留但不再使用

/**
 * @deprecated 改用 _bindEventToEl 按需绑定
 * 将事件同步到 DOM 元素（仅在首次渲染时调用）
 * @private
 */
_applyEventsToEl() {
  // 保留空实现或日志提示
  // 原有的事件绑定逻辑已移到 _bindEventToEl
}
```

- [ ] **Step 7: 运行测试验证通过**

```bash
npm test -- tests/event-system.test.js
```

Expected: PASS - 所有测试通过

- [ ] **Step 8: 提交**

```bash
git add src/yoya/core/basic.js tests/event-system.test.js
git commit -m "refactor: 事件系统按需绑定机制

- 添加 _boundEvents 记录已绑定事件类型
- 新增 _bindEventToEl 方法动态绑定事件
- on() 方法改为按需绑定
- 支持动态添加事件处理器"
```

---

### Task 2: 标准化事件方法实现

**Files:**
- Modify: `src/yoya/core/basic.js`
- Test: `tests/event-system.test.js`

- [ ] **Step 1: 实现 `onClick` 方法**

```javascript
// src/yoya/core/basic.js

/**
 * 绑定标准点击事件
 * @param {Function} handler - 事件处理器，接收 {event, target} 参数
 * @returns {this} 返回当前实例支持链式调用
 */
onClick(handler) {
  this.on('click', this._wrapHandler(handler));
  return this;
}
```

- [ ] **Step 2: 实现 `onChangeValue` 方法**

```javascript
/**
 * 绑定值变化事件
 * @param {Function} handler - 事件处理器，接收 {event, value, oldValue, target} 参数
 * @returns {this} 返回当前实例支持链式调用
 */
onChangeValue(handler) {
  let oldValue = this.value?.();
  this.on('change', this._wrapHandler(handler, (e) => {
    const newValue = this.value?.() || e.target?.value;
    // 更新 oldValue 为当前值，下次触发时使用
    const result = { value: newValue, oldValue };
    oldValue = newValue;
    return result;
  }));
  return this;
}
```

- [ ] **Step 3: 实现 `onInputValue` 方法**

```javascript
/**
 * 绑定输入事件
 * @param {Function} handler - 事件处理器，接收 {event, value, target} 参数
 * @returns {this} 返回当前实例支持链式调用
 */
onInputValue(handler) {
  this.on('input', this._wrapHandler(handler, (e) => {
    return { value: this.value?.() || e.target?.value };
  }));
  return this;
}
```

- [ ] **Step 4: 实现 `onToggle` 方法**

```javascript
/**
 * 绑定布尔状态切换事件
 * @param {Function} handler - 事件处理器，接收 {event, value, oldValue, target} 参数
 * @returns {this} 返回当前实例支持链式调用
 */
onToggle(handler) {
  let oldValue = this.checked?.();
  this.on('change', this._wrapHandler(handler, (e) => {
    const newValue = this.checked?.() || e.target?.checked;
    const result = { value: newValue, oldValue };
    oldValue = newValue;
    return result;
  }));
  return this;
}
```

- [ ] **Step 5: 实现 `onFocus`, `onBlur`, `onKey` 方法**

```javascript
/**
 * 绑定焦点事件
 * @param {Function} handler - 事件处理器，接收 {event, target} 参数
 * @returns {this} 返回当前实例支持链式调用
 */
onFocus(handler) {
  this.on('focus', this._wrapHandler(handler));
  return this;
}

/**
 * 绑定失焦事件
 * @param {Function} handler - 事件处理器，接收 {event, target} 参数
 * @returns {this} 返回当前实例支持链式调用
 */
onBlur(handler) {
  this.on('blur', this._wrapHandler(handler));
  return this;
}

/**
 * 绑定键盘事件
 * @param {Function} handler - 事件处理器，接收 {event, key, code, target} 参数
 * @returns {this} 返回当前实例支持链式调用
 */
onKey(handler) {
  this.on('keydown', this._wrapHandler(handler, (e) => {
    return { key: e.key, code: e.code };
  }));
  return this;
}
```

- [ ] **Step 6: 实现 `onMouseEnter`, `onMouseLeave` 方法**

```javascript
/**
 * 绑定鼠标进入事件
 * @param {Function} handler - 事件处理器，接收 {event, target} 参数
 * @returns {this} 返回当前实例支持链式调用
 */
onMouseEnter(handler) {
  this.on('mouseenter', this._wrapHandler(handler));
  return this;
}

/**
 * 绑定鼠标离开事件
 * @param {Function} handler - 事件处理器，接收 {event, target} 参数
 * @returns {this} 返回当前实例支持链式调用
 */
onMouseLeave(handler) {
  this.on('mouseleave', this._wrapHandler(handler));
  return this;
}
```

- [ ] **Step 7: 添加测试用例**

```javascript
// tests/event-system.test.js - 添加到现有测试文件

it('onClick 应该传递统一事件对象', () => {
  const handler = vi.fn();
  const el = div('点击我');
  el.onClick(handler);
  el.bindTo(container);
  el._el.click();

  expect(handler).toHaveBeenCalledTimes(1);
  const context = handler.mock.calls[0][0];
  expect(context.event).toBeDefined();
  expect(context.target).toBe(el);
});

it('onMouseEnter 和 onMouseLeave 应该正常工作', () => {
  const enterHandler = vi.fn();
  const leaveHandler = vi.fn();

  const el = div('测试');
  el.onMouseEnter(enterHandler);
  el.onMouseLeave(leaveHandler);
  el.bindTo(container);

  el._el.dispatchEvent(new MouseEvent('mouseenter'));
  expect(enterHandler).toHaveBeenCalledTimes(1);

  el._el.dispatchEvent(new MouseEvent('mouseleave'));
  expect(leaveHandler).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 8: 运行测试验证通过**

```bash
npm test -- tests/event-system.test.js
```

Expected: PASS

- [ ] **Step 9: 提交**

```bash
git add src/yoya/core/basic.js tests/event-system.test.js
git commit -m "feat: 标准化事件方法

- 实现 onClick, onChangeValue, onInputValue
- 实现 onToggle, onFocus, onBlur, onKey
- 实现 onMouseEnter, onMouseLeave
- 统一事件对象格式"
```

---

### Task 3: VCard 组件适配

**Files:**
- Modify: `src/yoya/components/card.js`

- [ ] **Step 1: 修改 setup 方法支持 onClick**

```javascript
// src/yoya/components/card.js - setup 方法内

/**
 * 设置卡片内容（支持函数/字符串/对象配置）
 * @param {Function|string|Object} setup - 初始化配置
 * @returns {this}
 */
setup(setup) {
  if (typeof setup === 'function') {
    setup(this);
  } else if (typeof setup === 'string') {
    // 字符串作为卡片内容
    this.vCardBody(setup);
  } else if (typeof setup === 'object' && setup !== null) {
    // 对象配置：支持 header, body, footer 等属性
    if (setup.header !== undefined) {
      if (typeof setup.header === 'function') {
        this.vCardHeader(setup.header);
      } else if (typeof setup.header === 'string') {
        this.vCardHeader(setup.header);
      } else {
        this.vCardHeader(c => c.child(setup.header));
      }
    }
    if (setup.body !== undefined) {
      if (typeof setup.body === 'function') {
        this.vCardBody(setup.body);
      } else if (typeof setup.body === 'string') {
        this.vCardBody(setup.body);
      } else {
        this.vCardBody(c => c.child(setup.body));
      }
    }
    if (setup.footer !== undefined) {
      if (typeof setup.footer === 'function') {
        this.vCardFooter(setup.footer);
      } else if (typeof setup.footer === 'string') {
        this.vCardFooter(setup.footer);
      } else {
        this.vCardFooter(c => c.child(setup.footer));
      }
    }
    // 处理其他配置（class, style 等）
    if (setup.class) this.className(setup.class);
    if (setup.style) this.styles(setup.style);
    // 统一使用 onClick 而非 onclick
    if (setup.onClick) this.onClick(setup.onClick);
  }
  return this;
}
```

- [ ] **Step 2: 运行类型检查**

```bash
npm run check
```

- [ ] **Step 3: 提交**

```bash
git add src/yoya/components/card.js
git commit -m "refactor: VCard 适配统一事件格式

- setup 方法支持 onClick 配置
- 移除 onclick 支持"
```

---

### Task 4: VTree 组件适配

**Files:**
- Modify: `src/yoya/components/interaction.js`

- [ ] **Step 1: 修改 _renderNodeEl 使用 _wrapHandler**

```javascript
// src/yoya/components/interaction.js - _renderNodeEl 方法内

_renderNodeEl(node, level) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = this._expandedKeys.includes(node.key);
  const isChecked = this._checkedKeys.includes(node.key);
  const isSelected = this._selectedKeys.includes(node.key);

  const nodeEl = div(item => {
    item.addClass('yoya-tree__node');
    item.styles({
      display: 'flex',
      alignItems: 'center',
      padding: '6px 12px',
      cursor: 'pointer',
      backgroundColor: isSelected ? 'var(--yoya-bg-primary)' : 'transparent',
      paddingLeft: `${level * 20 + 12}px`,
    });

    // 使用 _wrapHandler 包装点击事件
    item.on('click', this._wrapHandler((context) => {
      this._handleNodeClick(node, context.event);
    }));

    // 展开/收起图标
    if (hasChildren) {
      item.child(span(icon => {
        icon.html(isExpanded ? '▼' : '▶');
        icon.styles({
          fontSize: '10px',
          marginRight: '8px',
          transition: 'transform 0.2s',
        });
        icon.on('click', this._wrapHandler((context) => {
          context.event.stopPropagation();
          this._toggleExpand(node.key, context.event);
        }));
      }));
    } else {
      item.child(span(icon => {
        icon.html('•');
        icon.styles({
          fontSize: '10px',
          marginRight: '8px',
          opacity: '0.3',
        });
      }));
    }

    // 复选框
    if (this._checkable) {
      const checkbox = input(cb => {
        cb.type('checkbox');
        cb.prop('checked', isChecked);
        cb.styles({ marginRight: '8px' });
        cb.on('change', this._wrapHandler((context) => {
          context.event.stopPropagation();
          this._toggleCheck(node.key, context.event);
        }));
      });
      item.child(checkbox);
    }

    // 节点文本
    item.child(span(text => {
      text.addClass('yoya-tree__label');
      text.style('flex', '1');
      text.style('userSelect', 'none');
      text.text(node.title || node.label);
    }));
  });

  return nodeEl;
}
```

- [ ] **Step 2: 修改 _handleNodeClick 传递统一事件对象**

```javascript
// src/yoya/components/interaction.js

_handleNodeClick(node, nativeEvent) {
  // 切换选中状态
  if (this._selectedKeys.includes(node.key)) {
    this._selectedKeys = this._selectedKeys.filter(k => k !== node.key);
  } else {
    this._selectedKeys = [node.key];
  }

  // 如果有用户注册的回调，使用统一格式调用
  if (this._onSelect) {
    this._onSelect({
      event: nativeEvent,
      node: node,
      selectedKeys: [...this._selectedKeys],
      target: this
    });
  }

  this._renderTree();

  // 重新渲染 - 强制重新渲染整个树
  this._rendered = false;
  this.renderDom();
}
```

- [ ] **Step 3: 修改 _toggleExpand 传递统一事件对象**

```javascript
// src/yoya/components/interaction.js

_toggleExpand(key, nativeEvent) {
  const index = this._expandedKeys.indexOf(key);
  if (index > -1) {
    this._expandedKeys.splice(index, 1);
  } else {
    this._expandedKeys.push(key);
  }

  // 如果有用户注册的回调，使用统一格式调用
  if (this._onExpand) {
    this._onExpand({
      event: nativeEvent,
      expandedKeys: [...this._expandedKeys],
      target: this
    });
  }

  this._renderTree();

  // 重新渲染 - 强制重新渲染整个树
  this._rendered = false;
  this.renderDom();
}
```

- [ ] **Step 4: 修改 _toggleCheck 传递统一事件对象**

```javascript
// src/yoya/components/interaction.js

_toggleCheck(key, nativeEvent) {
  const index = this._checkedKeys.indexOf(key);
  if (index > -1) {
    this._checkedKeys.splice(index, 1);
  } else {
    if (!this._multiple) {
      this._checkedKeys = [];
    }
    this._checkedKeys.push(key);
  }

  // 如果有用户注册的回调，使用统一格式调用
  if (this._onCheck) {
    this._onCheck({
      event: nativeEvent,
      checkedKeys: [...this._checkedKeys],
      target: this
    });
  }

  this._renderTree();

  // 重新渲染 - 强制重新渲染整个树
  this._rendered = false;
  this.renderDom();
}
```

- [ ] **Step 5: 修改 onExpand, onCheck, onSelect 方法签名说明**

```javascript
// src/yoya/components/interaction.js

/**
 * 设置展开事件回调
 * @param {Function} fn - 回调函数，接收 {event, expandedKeys, target} 参数
 * @returns {this}
 */
onExpand(fn) {
  this._onExpand = fn;
  return this;
}

/**
 * 设置勾选事件回调
 * @param {Function} fn - 回调函数，接收 {event, checkedKeys, target} 参数
 * @returns {this}
 */
onCheck(fn) {
  this._onCheck = fn;
  return this;
}

/**
 * 设置选中事件回调
 * @param {Function} fn - 回调函数，接收 {event, node, selectedKeys, target} 参数
 * @returns {this}
 */
onSelect(fn) {
  this._onSelect = fn;
  return this;
}
```

- [ ] **Step 6: 提交**

```bash
git add src/yoya/components/interaction.js
git commit -m "refactor: VTree 适配统一事件格式

- 内部事件使用 _wrapHandler 包装
- _handleNodeClick, _toggleExpand, _toggleCheck 传递统一事件对象
- onExpand, onCheck, onSelect 回调使用事件对象格式"
```

---

### Task 5: 类型定义更新

**Files:**
- Modify: `src/yoya/index.d.ts`
- Modify: `src/yoya/components/index.d.ts`

- [ ] **Step 1: 更新 Tag 基类类型定义**

```typescript
// src/yoya/index.d.ts

declare class Tag {
  // 事件相关属性
  _events: Record<string, Function[]>;
  _boundEvents: Record<string, boolean>;

  // 事件绑定方法
  on(event: string, handler: (e: Event) => void): this;

  // 标准化事件方法
  onClick(handler: (e: { event: MouseEvent; target: Tag }) => void): this;
  onChangeValue(handler: (e: { event: Event; value: any; oldValue?: any; target: Tag }) => void): this;
  onInputValue(handler: (e: { event: Event; value: any; target: Tag }) => void): this;
  onToggle(handler: (e: { event: Event; value: boolean; oldValue?: boolean; target: Tag }) => void): this;
  onFocus(handler: (e: { event: FocusEvent; target: Tag }) => void): this;
  onBlur(handler: (e: { event: FocusEvent; target: Tag }) => void): this;
  onKey(handler: (e: { event: KeyboardEvent; key: string; code: string; target: Tag }) => void): this;
  onMouseEnter(handler: (e: { event: MouseEvent; target: Tag }) => void): this;
  onMouseLeave(handler: (e: { event: MouseEvent; target: Tag }) => void): this;

  // ... 其他现有类型定义
}
```

- [ ] **Step 2: 更新 VTree 类型定义**

```typescript
// src/yoya/components/index.d.ts

interface VTree extends Tag {
  onExpand(handler: (e: { event: Event; expandedKeys: string[]; target: VTree }) => void): this;
  onCheck(handler: (e: { event: Event; checkedKeys: string[]; target: VTree }) => void): this;
  onSelect(handler: (e: { event: Event; node: TreeNode; selectedKeys: string[]; target: VTree }) => void): this;
}

interface VCard extends Tag {
  onClick(handler: (e: { event: MouseEvent; target: VCard }) => void): this;
}
```

- [ ] **Step 3: 运行类型检查**

```bash
npm run check
```

Expected: PASS

- [ ] **Step 4: 提交**

```bash
git add src/yoya/index.d.ts src/yoya/components/index.d.ts
git commit -m "types: 更新事件系统类型定义

- Tag 基类添加标准化事件方法类型
- VTree, VCard 组件类型更新"
```

---

### Task 6: 集成测试和验证

**Files:**
- Create: `tests/components/event-components.test.js`

- [ ] **Step 1: 创建组件事件测试文件**

```javascript
// tests/components/event-components.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { vCard, vCardBody } from '../../src/yoya/index.js';

describe('组件事件适配', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('VCard', () => {
    it('应该支持 onClick 事件', () => {
      const handler = vi.fn();
      const card = vCard({ onClick: handler });
      card.vCardBody('内容');
      card.bindTo(container);

      card._el.click();

      expect(handler).toHaveBeenCalledTimes(1);
      const context = handler.mock.calls[0][0];
      expect(context.target).toBe(card);
    });

    it('setup 对象配置 onClick 应该生效', () => {
      const handler = vi.fn();
      const card = vCard(c => {
        c.onClick(handler);
        c.vCardBody('内容');
      });
      card.bindTo(container);

      card._el.click();

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});
```

- [ ] **Step 2: 运行所有测试**

```bash
npm test
```

Expected: PASS - 所有测试通过

- [ ] **Step 3: 提交**

```bash
git add tests/components/event-components.test.js
git commit -m "test: 添加组件事件集成测试

- VCard onClick 事件测试
- setup 配置事件测试"
```

---

## 验收标准

- [ ] 所有单元测试通过
- [ ] 类型检查通过
- [ ] 动态添加事件处理器能正常工作
- [ ] 组件事件 API 统一使用大驼峰命名
- [ ] 提交历史清晰，每个提交有明确目的

---

## 执行选择

计划完成并保存到 `docs/superpowers/plans/2026-03-23-event-system-refactor.md`。

两个执行选项：

**1. Subagent-Driven (推荐)** - 每个任务分派给独立的子代理执行，任务间进行审查，快速迭代

**2. Inline Execution** - 在当前会话中使用 executing-plans 执行任务

您选择哪种方式？
