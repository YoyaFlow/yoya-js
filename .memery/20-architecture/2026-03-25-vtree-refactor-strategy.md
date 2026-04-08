# VTree 重构策略 - 代码库实践指南

**日期**: 2026-03-25
**状态**: 设计中

---

## 一、代码库核心架构模式

### 1.1 虚拟元素模式 (Virtual Element Pattern)

Yoya.Basic 采用虚拟元素模式，所有 DOM 操作通过虚拟元素层进行：

```javascript
// Tag 基类核心属性
class Tag {
  constructor(tagName, setup = null) {
    this._el = null;              // 真实 DOM 元素（延迟创建）
    this._attrs = {};             // 属性存储
    this._styles = {};            // 样式存储
    this._events = {};            // 事件存储
    this._children = [];          // 子虚拟元素数组（基石）
    this._deleted = false;        // 删除标记
    this._boundElement = null;    // 绑定到的真实 DOM
  }
}
```

### 1.2 创建流程一致性

**单一元素创建流程**：
```javascript
// 1. 创建 Tag 实例 → 2. 同时创建 _el → 3. 通过 child() 添加子元素
const divEl = div(d => {
  d.className('container');
  d.span('子元素');
});
```

**复杂元素创建流程**（与单一元素一致）：
```javascript
// 1. 创建 Tag 实例 → 2. 同时创建 _el → 3. 创建特定子元素 → 4. 通过 child() 按顺序添加
class VTreeNode extends Tag {
  constructor(setup) {
    super('div', null);  // 创建 _el
    this._initialize();  // 创建 _nodeContentBox, _subNodesBox 并添加到 _children
  }
}
```

### 1.3 _children 管理策略

**❌ 错误做法**（当前 VTree 实现）：
```javascript
_renderTree() {
  this._children = [];  // 清空重建 - 信息丢失，需要重新构建
  // ...
}
```

**✅ 正确做法**（重构后）：
```javascript
// 1. 首次构建：创建容器结构
_initialize() {
  this._listBox = div(list => list.className('yoya-tree__list'));
  this._children.push(this._listBox);
}

// 2. 数据变更：使用标记删除
_renderTree() {
  // 标记旧节点为删除
  this._traverseAndMark(this._listBox._children);

  // 构建新节点
  this._buildNodes(this._data, 0, this._listBox);

  // 在合适的时机真正清理
  this._cleanupDeleted();
}

_traverseAndMark(children) {
  children.forEach(child => {
    if (child instanceof VTreeNode) {
      child.destroy();  // 设置 _deleted = true
    }
  });
}

_cleanupDeleted() {
  // 遍历 _children，真正移除已标记删除的元素
  this._listBox._children = this._listBox._children.filter(
    child => !child._deleted
  );
}
```

---

## 二、事件系统设计

### 2.1 统一事件结构

所有回调函数使用统一的事件对象格式：

```javascript
// 内部回调（VTreeNode → VTree）
{
  event: Event,          // 原生事件对象
  target: VTreeNode,     // VTreeNode 实例
  node: VTreeNodeData,   // 节点数据
  key: string,           // 节点 key
  value: any,            // 新值
  oldValue: any          // 旧值（可选）
}

// 用户回调（VTree → 用户）
{
  event: Event,
  node: VTreeNodeData,
  selectedKeys: string[],  // 或 checkedKeys / expandedKeys
  target: VTree
}
```

### 2.2 事件绑定机制

Tag 基类的事件绑定使用 `_wrapHandler` 包装器：

```javascript
// basic.js - Tag 原型方法
_wrapHandler(handler) {
  return (event) => {
    event._virtualTarget = this;  // 注入虚拟元素引用
    return handler(event);
  };
}

on(eventType, handler) {
  this._events[eventType] = this._events[eventType] || [];
  this._events[eventType].push(this._wrapHandler(handler));
  return this;
}
```

### 2.3 VTreeNode 事件处理

```javascript
class VTreeNode extends Tag {
  _buildCheckbox(parent) {
    const checkbox = input(cb => {
      cb.prop('checked', this._checked);
      cb.prop('indeterminate', this._indeterminate);

      // 使用统一事件结构上报
      cb.onToggle((context) => {
        this._handlers.onToggleCheck({
          event: context.event,
          target: this,
          node: this._data,
          key: this._data.key,
          value: context.value,
          oldValue: this._checked
        });
      });
    });
    parent.child(checkbox);
  }
}
```

---

## 三、状态管理架构

### 3.1 集中式状态存储

```javascript
class VTree extends Tag {
  constructor(setup) {
    super('div', null);

    // 状态集中存储在容器
    this._expandedKeys = new Set();
    this._checkedKeys = new Set();
    this._selectedKeys = new Set();
    this._indeterminateKeys = new Set();

    // 回调函数集合
    this._handlers = {
      onToggleExpand: (context) => this._handleToggleExpand(context),
      onToggleCheck: (context) => this._handleToggleCheck(context),
      onToggleSelect: (context) => this._handleToggleSelect(context)
    };
  }
}
```

### 3.2 状态变更流程

```
用户点击复选框
    ↓
VTreeNode._buildCheckbox 中的 cb.onToggle 触发
    ↓
VTreeNode 调用 handlers.onToggleCheck({event, target, node, key, value, oldValue})
    ↓
VTree._handleToggleCheck(context) 处理
    ├─ 更新 _checkedKeys
    ├─ 级联添加/删除子节点 keys
    ├─ 重新计算 _indeterminateKeys
    ├─ _syncNodesState() 同步所有节点
    └─ 触发用户回调 _onCheck(...)
```

### 3.3 级联勾选逻辑

```javascript
_handleToggleCheck(context) {
  const { key, value, node: nodeData } = context;

  if (value) {
    // 勾选：添加自身和所有子节点
    this._checkedKeys.add(key);
    this._addAllChildren(nodeData);
  } else {
    // 取消勾选：移除自身和所有子节点
    this._checkedKeys.delete(key);
    this._removeAllChildren(nodeData);
  }

  // 重新计算半选状态
  this._calculateIndeterminateKeys();

  // 同步所有节点状态
  this._syncNodesState();

  // 触发用户回调
  if (this._onCheck) {
    this._onCheck({
      event: context.event,
      node: nodeData,
      checked: value,
      checkedKeys: this.checkedKeys(),
      target: this
    });
  }
}

_addAllChildren(nodeData) {
  if (nodeData.children) {
    nodeData.children.forEach(child => {
      this._checkedKeys.add(child.key);
      this._addAllChildren(child);
    });
  }
}

_calculateIndeterminateKeys() {
  this._indeterminateKeys.clear();
  this._collectIndeterminateKeys(this._data);
}

_collectIndeterminateKeys(nodes) {
  nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
      const childCheckedCount = node.children.filter(
        c => this._checkedKeys.has(c.key)
      ).length;
      const childIndeterminateCount = node.children.filter(
        c => this._indeterminateKeys.has(c.key)
      ).length;
      const totalCount = node.children.length;

      // 部分勾选 或 有半选子节点 → 半选状态
      if ((childCheckedCount > 0 && childCheckedCount < totalCount) ||
          childIndeterminateCount > 0) {
        this._indeterminateKeys.add(node.key);
      }

      this._collectIndeterminateKeys(node.children);
    }
  });
}
```

---

## 四、VTreeNode 生命周期

### 4.1 生命周期阶段

```
创建阶段 → 初始化阶段 → 渲染阶段 → 状态同步阶段 → 销毁阶段
```

### 4.2 各阶段职责

| 阶段 | 方法 | 职责 |
|------|------|------|
| 创建 | `constructor` | 调用 `super('div')` 创建 _el，存储配置参数 |
| 初始化 | `_initialize()` | 创建 `_nodeContentBox`、`_subNodesBox` 并添加到 `_children` |
| 渲染 | `renderDom()` | 应用属性/样式/事件到真实 DOM，递归渲染子元素 |
| 同步 | `_syncFromContainer()` | 由容器调用，更新内部状态（不触发回调） |
| 销毁 | `destroy()` | 设置 `_deleted = true`，递归标记子节点 |

### 4.3 初始化阶段详解

```javascript
_initialize() {
  // 1. 创建 nodeContent 容器
  this._nodeContentBox = div(nodeContent => {
    nodeContent.className('yoya-tree__node-content');
    this._buildExpandIcon(nodeContent);
    this._buildCheckbox(nodeContent);
    this._buildTitle(nodeContent);
  });

  // 2. 创建 subNodes 容器
  this._subNodesBox = div(subNodes => {
    subNodes.className('yoya-tree__subnodes');
    subNodes.style('padding-left', `${this._level * 20}px`);
  });

  // 3. 将两个容器按顺序添加到 _children（关键：_children 是基石）
  this._children.push(this._nodeContentBox);
  this._children.push(this._subNodesBox);

  // 4. 如果有子节点数据，创建子 VTreeNode 实例
  if (this._data.children && this._data.children.length > 0) {
    this._data.children.forEach(childData => {
      const childNode = new VTreeNode({
        data: childData,
        level: this._level + 1,
        handlers: this._handlers,
        checkable: this._checkable,
        singleSelectMode: this._singleSelectMode
      });
      // 子节点添加到 subNodes 的 _children
      this._subNodesBox._children.push(childNode);
    });
  }
}
```

---

## 五、重构检查清单

### 5.1 架构检查

- [ ] VTreeNode 不持有 `this._parent` 引用
- [ ] 所有状态变更通过 `handlers` 回调函数上报
- [ ] 状态集中存储在 VTree 容器（`_expandedKeys`、`_checkedKeys`、`_selectedKeys`、`_indeterminateKeys`）
- [ ] `_children` 不被清空重建，使用标记删除策略

### 5.2 虚拟元素检查

- [ ] 不直接操作 DOM（不使用 `document.createElement`、`innerHTML`）
- [ ] 只操作虚拟元素（`_attrs`、`_styles`、`_events`、`_children`）
- [ ] 复杂组件由虚拟元素组成（`_nodeContentBox`、`_subNodesBox`）
- [ ] 子元素通过 `this._children.push()` 添加

### 5.3 事件系统检查

- [ ] 回调函数使用统一事件对象格式
- [ ] 内部回调：`{event, target, node, key, value, oldValue}`
- [ ] 用户回调：`{event, node, xxxKeys, target}`

### 5.4 生命周期检查

- [ ] 创建阶段：`constructor` 调用 `super('div')`
- [ ] 初始化阶段：`_initialize()` 构建内部结构
- [ ] 渲染阶段：`renderDom()` 应用状态到 DOM
- [ ] 同步阶段：`_syncFromContainer()` 更新展示状态
- [ ] 销毁阶段：`destroy()` 标记删除

---

## 六、相关文件

| 文件 | 操作 | 内容 |
|------|------|------|
| `src/yoya/components/tree.js` | 重构 | VTree 和 VTreeNode 组件实现 |
| `src/yoya/components/tree.d.ts` | 更新 | 类型定义 |
| `docs/superpowers/specs/2026-03-25-vtree-node-state-design.md` | 已创建 | 详细设计文档 |
| `docs/superpowers/specs/2026-03-25-vtree-refactor-strategy.md` | 本文档 | 重构策略指南 |

---

## 七、后续步骤

1. ✅ 设计文档已完善
2. ✅ 重构策略已梳理
3. ⏳ 用户审查设计文档和策略文档
4. ⏳ 创建实施计划（writing-plans skill）
5. ⏳ 执行实施
