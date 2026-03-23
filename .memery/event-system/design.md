# 事件系统重构设计

**日期**: 2026-03-23
**状态**: 已批准
**作者**: Claude Code

---

## 概述

重构 Yoya.Basic 事件系统，解决当前实现中的绑定时机问题和虚拟/真实 DOM 事件同步问题。

---

## 问题陈述

### 当前实现的问题

| 问题 | 描述 | 影响 |
|------|------|------|
| 事件绑定时机 | `shouldApplyEvents` 判断逻辑复杂 | 可能导致事件丢失或重复绑定 |
| 虚拟/真实 DOM 同步 | 后续添加的事件不会自动同步 | 动态添加的事件处理器可能不生效 |
| oldValue 捕获 | `onChangeValue` 在绑定时捕获旧值 | 多次触发时旧值不会更新 |
| 组件事件不统一 | 交互组件直接使用原生事件 | 违背统一事件包装器设计 |
| 状态机/事件耦合 | 状态处理器和事件处理器职责不清 | 增加维护复杂度 |

### 核心设计原则

1. **所有应用事件绑定在虚拟元素上** - `_events` 对象始终存储在 Tag 实例上
2. **DOM 事件委托调用** - DOM 元素上的监听器函数内部动态读取并调用虚拟元素的事件处理器
3. **按需绑定** - 只有当某个事件类型第一次被注册时，才在 DOM 上绑定对应的监听器

---

## 设计方案

### 数据结构

```javascript
class Tag {
  constructor(tagName, setup = null) {
    this._events = {};       // 事件处理器数组 { click: [handler1, handler2], ... }
    this._boundEvents = {};  // 记录已绑定到 DOM 的事件类型 { click: true, mouseenter: true }
    // ... 其他属性
  }
}
```

### 核心 API 改动

#### 1. `on()` 方法 - 按需绑定

```javascript
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

#### 2. `_bindEventToEl()` 方法 - 动态读取

```javascript
_bindEventToEl(event) {
  // 每个事件类型只绑定一次，使用统一的委托处理器
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

#### 3. `_wrapHandler()` 方法 - 统一事件格式

```javascript
_wrapHandler(handler, buildContext) {
  return (e) => {
    const context = {
      event: e,
      target: this,
    };
    // 合并额外属性
    if (buildContext) {
      Object.assign(context, buildContext(e, this));
    }
    handler(context);
  };
}
```

#### 4. 标准化事件方法

```javascript
// 点击事件
onClick(handler) {
  this.on('click', this._wrapHandler(handler));
  return this;
}

// 值变化事件
onChangeValue(handler) {
  const oldValue = this.value?.();
  this.on('change', this._wrapHandler(handler, (e) => {
    const newValue = this.value?.() || e.target?.value;
    return { value: newValue, oldValue: oldValue };
  }));
  return this;
}

// 输入事件
onInputValue(handler) {
  this.on('input', this._wrapHandler(handler, (e) => {
    return { value: this.value?.() || e.target?.value };
  }));
  return this;
}

// 布尔状态切换事件
onToggle(handler) {
  const oldValue = this.checked?.();
  this.on('change', this._wrapHandler(handler, (e) => {
    const newValue = this.checked?.() || e.target?.checked;
    return { value: newValue, oldValue: oldValue };
  }));
  return this;
}

// 焦点事件
onFocus(handler) {
  this.on('focus', this._wrapHandler(handler));
  return this;
}

// 失焦事件
onBlur(handler) {
  this.on('blur', this._wrapHandler(handler));
  return this;
}

// 键盘事件
onKey(handler) {
  this.on('keydown', this._wrapHandler(handler, (e) => {
    return { key: e.key, code: e.code };
  }));
  return this;
}

// 鼠标进入/离开事件
onMouseEnter(handler) {
  this.on('mouseenter', this._wrapHandler(handler));
  return this;
}

onMouseLeave(handler) {
  this.on('mouseleave', this._wrapHandler(handler));
  return this;
}
```

### 时序图

```
用户调用                    Tag 实例                    DOM 元素
  |                           |                            |
  |--on('click', handler1)--->|                            |
  |                           |--(首次，绑定到 DOM)-------->|
  |                           |  addEventListener('click') |
  |                           |                            |
  |--on('click', handler2)--->|                            |
  |                           |--(已绑定，跳过)------------>|
  |                           |                            |
  |                           |<-------click 事件----------|
  |                           |                            |
  |                           |--动态读取 _events.click--->|
  |                           |--执行 [handler1, handler2]-|
  |                           |                            |
  |--on('mouseenter', h)----->|                            |
  |                           |--(新事件类型，绑定)-------->|
  |                           |  addEventListener('mouseenter')
  |                           |                            |
```

---

## 组件适配规范

### VCard 组件

**变更点**：
- 移除 `onclick` 支持，统一使用 `onClick`
- setup 对象配置中使用 `onClick` 而非 `onclick`

```javascript
// 旧代码
if (setup.onclick) this.on('click', setup.onclick);

// 新代码
if (setup.onClick) this.onClick(setup.onClick);
```

**使用示例**：
```javascript
// 基础用法
vCard(c => {
  c.vCardBody('可点击的卡片');
  c.onClick(({event, target}) => {
    console.log('卡片被点击', target);
  });
});

// setup 配置
vCard({
  onClick: ({event, target}) => {
    console.log('卡片被点击', target);
  }
});
```

### VTree 组件

**变更点**：
1. 内部事件处理统一使用 `_wrapHandler`
2. 事件回调 API 统一为事件对象格式
3. 复选框事件适配新格式

**新 API**：
```javascript
// 展开事件
onExpand(({event, expandedKeys, target}) => {})

// 勾选事件
onCheck(({event, checkedKeys, target}) => {})

// 选中事件
onSelect(({event, node, selectedKeys, target}) => {})
```

**内部实现改动**：

```javascript
// _renderNodeEl - 节点点击事件
_renderNodeEl(node, level) {
  const nodeEl = div(item => {
    // 使用 _wrapHandler 包装
    item.on('click', this._wrapHandler((context) => {
      this._handleNodeClick(node, context.event);
    }));
  });
  return nodeEl;
}

// _handleNodeClick - 调用用户回调
_handleNodeClick(node, nativeEvent) {
  // ... 更新选中状态 ...

  if (this._onSelect) {
    this._onSelect({
      event: nativeEvent,
      node: node,
      selectedKeys: [...this._selectedKeys],
      target: this
    });
  }

  this._renderTree();
  this._rendered = false;
  this.renderDom();
}

// _toggleCheck - 复选框变化
_toggleCheck(key, nativeEvent) {
  // ... 更新勾选状态 ...

  if (this._onCheck) {
    this._onCheck({
      event: nativeEvent,
      checkedKeys: [...this._checkedKeys],
      target: this
    });
  }

  this._renderTree();
  this._rendered = false;
  this.renderDom();
}
```

**使用示例**：
```javascript
vTree(t => {
  t.data(treeData);
  t.checkable(true);

  t.onSelect(({event, node, selectedKeys, target}) => {
    console.log('选中节点:', node);
    console.log('所有选中:', selectedKeys);
  });

  t.onExpand(({event, expandedKeys, target}) => {
    console.log('展开节点');
  });

  t.onCheck(({event, checkedKeys, target}) => {
    console.log('勾选节点');
  });
});
```

### 其他交互组件

**VTooltip, VPopover, VDropdown, VCollapse, VTreeSelect**

所有内部事件处理统一使用 `_wrapHandler`，例如：

```javascript
// VTooltip - 绑定事件
_bindEvents() {
  if (this._target) {
    if (this._trigger === 'hover') {
      this._target.on('mouseenter', this._wrapHandler(() => {
        this.setState('visible', true);
      }));
      this._target.on('mouseleave', this._wrapHandler(() => {
        this.setState('visible', false);
      }));
    }
  }
}
```

---

## 迁移指南

### 从旧代码迁移

```javascript
// VCard - 点击事件
// ❌ 旧格式
vCard({ onclick: (e) => {...} });

// ✅ 新格式
vCard({ onClick: ({event, target}) => {...} });

// VTree - 事件回调
// ❌ 旧格式
vTree(t => {
  t.onSelect((node) => {...});
  t.onCheck((keys) => {...});
  t.onExpand((keys) => {...});
});

// ✅ 新格式
vTree(t => {
  t.onSelect(({event, node, selectedKeys}) => {...});
  t.onCheck(({event, checkedKeys}) => {...});
  t.onExpand(({event, expandedKeys}) => {...});
});

// 通用事件绑定
// ❌ 旧格式：可能不生效
const card = vCard();
card.on('click', handler);  // 如果在 renderDom 之后调用

// ✅ 新格式：始终生效
const card = vCard();
card.onClick(({event, target}) => {...});
```

---

## 测试计划

### 单元测试

1. **基础事件绑定**
   - [ ] `on()` 方法登记事件处理器
   - [ ] 同一事件类型多次绑定
   - [ ] 不同事件类型绑定

2. **按需绑定**
   - [ ] 首次调用 `on()` 时绑定 DOM 监听器
   - [ ] 同一事件类型第二次调用不重复绑定
   - [ ] 新事件类型触发新的 DOM 绑定

3. **动态读取**
   - [ ] 绑定后添加的处理器能被触发
   - [ ] 移除处理器后不再触发
   - [ ] 多个处理器按顺序执行

4. **统一事件格式**
   - [ ] `onClick` 传递 `{event, target}`
   - [ ] `onChangeValue` 传递 `{event, value, oldValue, target}`
   - [ ] `onKey` 传递 `{event, key, code, target}`

5. **组件事件**
   - [ ] VCard 点击事件
   - [ ] VTree 选中/展开/勾选事件
   - [ ] VTooltip 显示/隐藏事件

### 集成测试

1. **虚拟/真实 DOM 同步**
   - [ ] 先渲染后绑定事件
   - [ ] 先绑定事件后渲染
   - [ ] 动态添加子元素事件

2. **事件冒泡**
   - [ ] 子元素事件不触发父元素
   - [ ] `stopPropagation` 正常工作

3. **内存泄漏**
   - [ ] 销毁组件后事件监听器被移除
   - [ ] 循环引用被正确清理

---

## 相关文件

### 需要修改的文件

| 文件 | 变更内容 |
|------|----------|
| `src/yoya/core/basic.js` | Tag 基类事件系统核心实现 |
| `src/yoya/components/card.js` | VCard 组件适配 onClick |
| `src/yoya/components/interaction.js` | VTree 等交互组件事件适配 |
| `src/yoya/components/form.js` | 表单组件事件适配 |
| `src/yoya/components/button.js` | 按钮组件事件适配 |
| `src/yoya/components/menu.js` | 菜单组件事件适配 |
| `src/yoya/index.d.ts` | 类型定义更新 |
| `src/yoya/components/index.d.ts` | 组件类型定义更新 |

### 新增文件

| 文件 | 内容 |
|------|------|
| `docs/superpowers/specs/2026-03-23-event-system-redesign.md` | 设计文档 |

---

## 验收标准

1. **功能性**
   - [ ] 所有事件无论何时绑定都能正常工作
   - [ ] 动态添加的事件处理器能被触发
   - [ ] 统一事件格式被所有组件采用

2. **性能**
   - [ ] 没有重复的事件监听器绑定
   - [ ] 事件触发性能不受影响

3. **兼容性**
   - [ ] 现有组件 API 向后兼容（或提供迁移方案）
   - [ ] 类型定义完整更新

4. **代码质量**
   - [ ] 代码逻辑清晰，无复杂条件判断
   - [ ] 有充分的注释说明设计意图

---

## 附录：事件对象结构

```typescript
// 基础事件上下文
interface EventContext {
  event: Event | MouseEvent | KeyboardEvent | FocusEvent;
  target: Tag;
}

// 值变化事件
interface ValueEventContext<T = any> extends EventContext {
  value: T;
  oldValue?: T;
}

// 键盘事件
interface KeyEventContext extends EventContext {
  key: string;
  code: string;
}

// VTree 事件
interface TreeSelectEventContext extends EventContext {
  node: TreeNode;
  selectedKeys: string[];
}

interface TreeExpandEventContext extends EventContext {
  expandedKeys: string[];
}

interface TreeCheckEventContext extends EventContext {
  checkedKeys: string[];
}
```
