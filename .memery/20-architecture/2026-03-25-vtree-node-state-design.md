# VTree 组件重构设计 - 基于虚拟元素的状态管理

**日期**: 2026-03-25
**状态**: 设计中
**作者**: Claude Code

---

## 设计原则

### 1. 单一元素与复杂元素的创建过程一致

```
单一元素（如 div）:
  创建 Tag → 同时创建 _el (DOM) → 通过 child() 添加子元素

复杂元素（如 VTreeNode）:
  创建 VTreeNode → 同时创建 _el (DOM) → 创建特定子元素 (_nodeContentEl/_subNodesEl)
  → 通过 child() 按顺序添加这些子元素到 _children
```

### 2. 虚拟元素是 DOM 的操作面板

- 组件只能操作虚拟元素（`_attrs`、`_styles`、`_events`、`_children`）
- 虚拟元素负责同步到 `_el`
- 无论多复杂的组件，都由虚拟元素组成

### 3. `_children` 是基石，不应清空重建

- 删除时先打标记（`_deleted = true`）
- 在 `renderDom()` 时跳过已标记的元素
- 在合适的时机（如数据变更完成）才真正删除

---

## 问题分析

### 当前实现的问题

| 问题 | 描述 | 影响 |
|------|------|------|
| _children 被清空重建 | `_renderTree()` 中 `this._children = []` | 信息丢失，需要重新构建 |
| 直接操作 DOM | 部分代码使用 `document.createElement` | 违背虚拟元素原则 |
| 节点耦合 | VTreeNode 持有 `this._parent` 引用 | 增加内存开销，节点无法独立测试 |
| 级联调用 | 子节点直接调用 `this._parent._updateIndeterminate()` | 调用链不清晰，难以追踪状态变更 |
| 职责不清 | 状态管理分散在节点和容器之间 | 单一职责原则被违反 |

### 核心设计原则

1. **_children 是基石** - 不轻易清空，使用标记删除
2. **虚拟元素是操作面板** - 组件只操作虚拟元素，不直接操作 DOM
3. **VTreeNode 不持有父节点引用** - 节点是纯粹的状态展示层
4. **状态变更通过回调函数上报** - 所有状态变更由 VTree 容器统一管理
5. **状态存储在容器** - `_expandedKeys`、`_checkedKeys`、`_selectedKeys` 集中存储在 VTree

---

## 设计方案

### 架构设计

```
VTree (容器/状态中心)
│
├── _expandedKeys: Set       # 展开的节点 keys
├── _checkedKeys: Set        # 勾选的节点 keys
├── _selectedKeys: Set       # 选中的节点 keys
├── _indeterminateKeys: Set  # 半选的节点 keys
│
├── _handlers: {             # 回调函数集合 (传递给子节点)
│     onToggleExpand: (key) => ...
│     onToggleCheck: (key, checked) => ...
│     onToggleSelect: (key) => ...
│   }
│
└── _nodes: VTreeNode[]      # 根节点数组
    └── VTreeNode (纯展示层)
        ├── _data: NodeData
        ├── _level: number
        ├── _handlers: { ... }  # 引用容器的 handlers
        └── (无父节点引用)
```

### 状态变更流程

```
用户点击复选框
    ↓
VTreeNode 触发 handlers.onToggleCheck(key, checked)
    ↓
VTree._handleToggleCheck(key, checked)  ← 回调函数处理
    ↓
1. 更新 _checkedKeys
2. 级联添加/删除子节点 keys
3. 重新计算 _indeterminateKeys
4. _syncNodesState() 同步所有节点
5. 触发 onCheck 事件回调
```

---

## VTreeNode 设计

### 构造函数

```javascript
class VTreeNode extends Tag {
  constructor({
    data,
    level,
    handlers,        // 回调函数集合
    checkable = false,
    singleSelectMode = true
  }) {
    super('div');

    this._data = data;
    this._level = level;
    this._handlers = handlers;  // 关键：引用容器的 handlers
    this._checkable = checkable;
    this._singleSelectMode = singleSelectMode;

    // 状态 (仅用于展示，变更通过回调上报)
    this._expanded = false;
    this._checked = false;
    this._selected = false;
    this._indeterminate = false;

    this._initialize();
  }
}
```

### 回调函数集合（统一事件结构）

```javascript
// VTree 容器创建 handlers 并传递给子节点
// 所有回调接收统一的事件对象参数
this._handlers = {
  onToggleExpand: (context) => this._handleToggleExpand(context),
  onToggleCheck: (context) => this._handleToggleCheck(context),
  onToggleSelect: (context) => this._handleToggleSelect(context)
};

// 传递给子节点
const node = new VTreeNode({
  data: nodeData,
  level: 0,
  handlers: this._handlers,  // 子节点通过 handlers 调用容器方法
  checkable: this._checkable
});
```

### 节点内部事件处理（统一事件格式）

```javascript
_buildExpandIcon(parent) {
  const icon = span(icon => {
    icon.text(this._expanded ? '▼' : '▶');

    // 使用统一事件结构
    icon.onClick((context) => {
      context.event.stopPropagation();

      this._handlers.onToggleExpand({
        event: context.event,
        target: this,            // VTreeNode 实例
        node: this._data,
        key: this._data.key,
        value: !this._expanded   // 新的展开状态
      });
    });
  });
}

_buildCheckbox(parent) {
  const checkbox = input(cb => {
    cb.prop('checked', this._checked);
    cb.prop('indeterminate', this._indeterminate);

    // 使用统一事件结构
    cb.onToggle((context) => {
      this._handlers.onToggleCheck({
        event: context.event,
        target: this,
        node: this._data,
        key: this._data.key,
        value: context.value,    // 新的 checked 状态
        oldValue: this._checked  // 旧的 checked 状态
      });
    });
  });
}

_buildTitle(parent) {
  const title = span(title => {
    // ...

    title.onClick((context) => {
      this._handlers.onToggleSelect({
        event: context.event,
        target: this,
        node: this._data,
        key: this._data.key,
        value: !this._selected
      });
    });
  });
}
```

### 统一事件结构定义

```typescript
// 基础事件上下文
interface VTreeEventContext {
  event: Event;
  target: VTree;
  node: VTreeNodeData;
  key: string;
  value?: any;
  oldValue?: any;
}

// 展开事件
interface VTreeExpandEventContext extends VTreeEventContext {
  expandedKeys: string[];
}

// 勾选事件
interface VTreeCheckEventContext extends VTreeEventContext {
  checked: boolean;
  checkedKeys: string[];
}

// 选中事件
interface VTreeSelectEventContext extends VTreeEventContext {
  selectedKeys: string[];
}

// 回调类型
type VTreeExpandHandler = (context: VTreeExpandEventContext) => void;
type VTreeCheckHandler = (context: VTreeCheckEventContext) => void;
type VTreeSelectHandler = (context: VTreeSelectEventContext) => void;
```

### 公共方法（由 VTree 容器调用）

```javascript
// 设置展开状态（不触发回调，由容器同步时调用）
setExpanded(expanded) {
  if (this._expanded === expanded) return;
  this._expanded = expanded;
  // 更新图标...
}

// 设置勾选状态（不触发回调）
setChecked(checked) {
  if (this._checked === checked) return;
  this._checked = checked;
  // 更新复选框...
}

// 设置半选状态
setIndeterminate(indeterminate) {
  if (this._indeterminate === indeterminate) return;
  this._indeterminate = indeterminate;
  // 更新复选框...
}

// 设置选中状态
setSelected(selected) {
  if (this._selected === selected) return;
  this._selected = selected;
  this._updateSelectionStyle();
}
```

---

## VTree 容器设计

### 状态存储

```javascript
class VTree extends Tag {
  constructor(setup = null) {
    super('div');

    // 状态存储 (集中管理)
    this._expandedKeys = new Set();
    this._checkedKeys = new Set();
    this._selectedKeys = new Set();
    this._indeterminateKeys = new Set();

    // 回调函数集合 - 接收统一事件对象
    this._handlers = {
      onToggleExpand: (context) => this._handleToggleExpand(context),
      onToggleCheck: (context) => this._handleToggleCheck(context),
      onToggleSelect: (context) => this._handleToggleSelect(context)
    };

    // ...
  }
}
```

### 状态变更处理（统一事件格式）

```javascript
/**
 * 处理切换展开状态
 * @param {Object} context - 统一事件对象 {event, target, node, key, value}
 */
_handleToggleExpand(context) {
  const { event, key, value } = context;

  if (this._expandedKeys.has(key)) {
    this._expandedKeys.delete(key);
  } else {
    this._expandedKeys.add(key);
  }

  // 同步到节点
  const node = this._findNode(this._nodes, key);
  if (node) {
    node.setExpanded(value);
  }

  // 触发用户回调 - 使用统一事件格式
  if (this._onExpand) {
    this._onExpand({
      event: event,
      node: this._getNodeData(key),
      expandedKeys: this.expandedKeys(),
      target: this
    });
  }
}

/**
 * 处理切换勾选状态
 * @param {Object} context - 统一事件对象 {event, target, node, key, value, oldValue}
 */
_handleToggleCheck(context) {
  const { event, key, value, node: nodeData } = context;

  const node = this._findNode(this._nodes, key);
  if (!node) return;

  if (value) {
    // 勾选：添加自身和所有子节点
    this._checkedKeys.add(key);
    this._addAllChildren(nodeData, key);
  } else {
    // 取消勾选：移除自身和所有子节点
    this._checkedKeys.delete(key);
    this._removeAllChildren(nodeData, key);
  }

  // 重新计算半选状态
  this._calculateIndeterminateKeys();

  // 同步所有节点状态
  this._syncNodesState();

  // 触发用户回调 - 使用统一事件格式
  if (this._onCheck) {
    this._onCheck({
      event: event,
      node: nodeData,
      checked: value,
      checkedKeys: this.checkedKeys(),
      target: this
    });
  }
}

/**
 * 处理切换选中状态
 * @param {Object} context - 统一事件对象 {event, target, node, key, value}
 */
_handleToggleSelect(context) {
  const { event, key, value } = context;

  if (this._singleSelectMode) {
    // 单选模式：切换
    if (this._selectedKeys.has(key)) {
      this._selectedKeys.delete(key);
    } else {
      this._selectedKeys.clear();
      this._selectedKeys.add(key);
    }
  } else {
    // 多选模式：切换
    if (this._selectedKeys.has(key)) {
      this._selectedKeys.delete(key);
    } else {
      this._selectedKeys.add(key);
    }
  }

  // 同步节点
  this._syncNodesState();

  // 触发用户回调 - 使用统一事件格式
  if (this._onSelect) {
    this._onSelect({
      event: event,
      node: this._getNodeData(key),
      selectedKeys: this.selectedKeys(),
      target: this
    });
  }
}
```

### 级联勾选辅助方法

```javascript
// 添加所有子节点到 checkedKeys
_addAllChildren(nodeData) {
  if (nodeData.children) {
    nodeData.children.forEach(child => {
      this._checkedKeys.add(child.key);
      this._addAllChildren(child);
    });
  }
}

// 移除所有子节点从 checkedKeys
_removeAllChildren(nodeData) {
  if (nodeData.children) {
    nodeData.children.forEach(child => {
      this._checkedKeys.delete(child.key);
      this._removeAllChildren(child);
    });
  }
}

// 计算半选状态
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

### 同步状态到节点

```javascript
// 同步所有节点的状态
_syncNodesState() {
  this._traverseNodes(this._nodes, node => {
    const key = node.getKey();
    node.setExpanded(this._expandedKeys.has(key));
    node.setChecked(this._checkedKeys.has(key));
    node.setIndeterminate(this._indeterminateKeys.has(key));
    node.setSelected(this._selectedKeys.has(key));
  });
}
```

---

## VTreeNode 生命周期设计

### 生命周期阶段

```
创建阶段 → 初始化阶段 → 渲染阶段 → 状态同步阶段 → 销毁阶段
```

### 1. 创建阶段 (constructor)

```javascript
class VTreeNode extends Tag {
  constructor({
    data,
    level,
    handlers,
    checkable = false,
    singleSelectMode = true
  }) {
    super('div');  // 1. 调用父类构造函数，创建 _el

    // 2. 存储传入的配置参数
    this._data = data;
    this._level = level;
    this._handlers = handlers;
    this._checkable = checkable;
    this._singleSelectMode = singleSelectMode;

    // 3. 初始化内部状态 (仅用于展示，变更通过回调上报)
    this._expanded = false;
    this._checked = false;
    this._selected = false;
    this._indeterminate = false;

    // 4. 调用初始化方法 - 构建内部虚拟元素结构
    this._initialize();
  }
}
```

### 2. 初始化阶段 (_initialize)

```javascript
_initialize() {
  // 2.1 创建 nodeContent 容器 (虚拟元素)
  this._nodeContentBox = div(nodeContent => {
    nodeContent.className('yoya-tree__node-content');

    // 按顺序添加子元素到 _nodeContentBox._children
    this._buildExpandIcon(nodeContent);
    this._buildCheckbox(nodeContent);
    this._buildTitle(nodeContent);
  });

  // 2.2 创建 subNodes 容器 (虚拟元素)
  this._subNodesBox = div(subNodes => {
    subNodes.className('yoya-tree__subnodes');
    // 缩进在 subNodes 上通过 padding-left 处理
    subNodes.style('padding-left', `${this._level * 20}px`);
  });

  // 2.3 将两个容器按顺序添加到 _children
  // 关键：_children 是基石，一旦建立就不应清空重建
  this._children.push(this._nodeContentBox);
  this._children.push(this._subNodesBox);

  // 2.4 如果有子节点数据，创建子 VTreeNode 实例
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

### 3. 渲染阶段 (renderDom)

```javascript
renderDom() {
  // 3.1 检查 _deleted 标记
  if (this._deleted) {
    return null;  // 已删除的元素不渲染
  }

  // 3.2 首次渲染：构建内部结构（如果尚未构建）
  if (!this._initialized) {
    this._initialize();
    this._initialized = true;
  }

  // 3.3 获取或创建真实 DOM 元素
  const element = this._boundElement || this._el;

  // 3.4 应用属性、样式、事件到真实 DOM
  this._applyAttrs(element);
  this._applyStyles(element);
  this._applyEvents(element);

  // 3.5 渲染子元素（递归）
  // 关键：遍历 _children，跳过已标记删除的元素
  this._applyChildren(element);

  this._boundElement = element;
  return element;
}
```

### 4. 状态同步阶段 (_syncFromContainer)

```javascript
/**
 * 由 VTree 容器调用，同步状态到节点
 * 不触发回调，仅更新展示层
 */
_syncFromContainer(states) {
  const { expanded, checked, selected, indeterminate } = states;

  // 4.1 状态变更检测（避免不必要的 DOM 操作）
  if (this._expanded !== expanded) {
    this._expanded = expanded;
    this._updateExpandIcon();  // 更新图标 ▶/▼
  }

  if (this._checked !== checked) {
    this._checked = checked;
    this._updateCheckbox();  // 更新复选框 checked 属性
  }

  if (this._indeterminate !== indeterminate) {
    this._indeterminate = indeterminate;
    this._updateCheckbox();  // 更新复选框 indeterminate 属性
  }

  if (this._selected !== selected) {
    this._selected = selected;
    this._updateSelectionStyle();  // 更新选中背景色
  }

  // 4.2 同步子节点（如果有）
  if (this._subNodesBox && this._subNodesBox._children) {
    this._subNodesBox._children.forEach(childNode => {
      if (childNode instanceof VTreeNode) {
        childNode._syncFromContainer(states);
      }
    });
  }
}
```

### 5. 销毁阶段 (destroy)

```javascript
/**
 * 标记删除策略：不立即销毁，先打标记
 */
destroy() {
  // 5.1 打标记
  this._deleted = true;

  // 5.2 递归标记所有子节点
  if (this._subNodesBox && this._subNodesBox._children) {
    this._subNodesBox._children.forEach(childNode => {
      if (childNode instanceof VTreeNode) {
        childNode.destroy();
      }
    });
  }

  // 5.3 解绑事件（可选：在下一个 renderDom 周期后真正清理）
  // 真正清理时机：由 VTree 容器在数据变更完成后统一处理
}
```

### 生命周期流程图

```
┌─────────────────────────────────────────────────────────────┐
│ VTreeNode 生命周期                                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  constructor                                                 │
│     ↓                                                        │
│  super('div') → 创建 _el                                    │
│     ↓                                                        │
│  _initialize() → 构建 _nodeContentBox, _subNodesBox         │
│     ↓                                                        │
│  this._children.push(_nodeContentBox)                        │
│  this._children.push(_subNodesBox)                           │
│     ↓                                                        │
│  renderDom()                                                 │
│     ↓                                                        │
│  if (_deleted) → return null                                │
│     ↓                                                        │
│  _applyAttrs/Styles/Events/Children                          │
│     ↓                                                        │
│  [状态同步] ← VTree 容器调用 _syncFromContainer              │
│     ↓                                                        │
│  _updateExpandIcon / _updateCheckbox / _updateSelectionStyle │
│     ↓                                                        │
│  [用户交互] → 触发 handlers.onXXX(context) → VTree 容器      │
│     ↓                                                        │
│  destroy() → _deleted = true                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 结构设计

### DOM 结构

```
VTree (容器)
└── .yoya-tree__list
    └── VTreeNode (level 0)
        ├── .yoya-tree__node-content
        │   ├── .yoya-tree__expand-icon (或 .yoya-tree__placeholder)
        │   ├── .yoya-tree__checkbox (如果 checkable)
        │   └── .yoya-tree__title
        └── .yoya-tree__subnodes (padding-left: 20px)
            └── VTreeNode (level 1)
                ├── .yoya-tree__node-content
                └── .yoya-tree__subnodes (padding-left: 40px)
                    └── VTreeNode (level 2)
```

### 缩进处理

- 缩进在 `subNodes` 容器上通过 `padding-left` 处理
- 每级缩进 `20px`
- `marginLeft: -20px` 抵消一级缩进，让子节点的 `nodeContent` 对齐

---

## API 设计

### VTree 方法

| 方法 | 参数 | 说明 | 返回值 |
|------|------|------|--------|
| `data(value)` | `VTreeNode[]` | 设置树形数据 | `this` |
| `checkable(value)` | `boolean` | 是否显示复选框 | `this / boolean` |
| `multiple(value)` | `boolean` | 多选模式 | `this / boolean` |
| `expandedKeys(value)` | `string[]` | 设置/获取展开 keys | `this / string[]` |
| `checkedKeys(value)` | `string[]` | 设置/获取勾选 keys | `this / string[]` |
| `selectedKeys(value)` | `string[]` | 设置/获取选中 keys | `this / string[]` |
| `expandAll()` | - | 展开所有节点 | `this` |
| `collapseAll()` | - | 收起所有节点 | `this` |
| `onSelect(handler)` | `Function` | 节点选中事件 | `this` |
| `onCheck(handler)` | `Function` | 节点勾选事件 | `this` |
| `onExpand(handler)` | `Function` | 节点展开事件 | `this` |
| `findNode(key)` | `string` | 查找节点 | `VTreeNode / null` |
| `getNodeState(key)` | `string` | 获取节点状态 | `Object / null` |
| `getIndeterminateKeys()` | - | 获取半选 keys | `string[]` |

### 事件对象格式

```javascript
// 内部回调（VTreeNode → VTree）
// 统一事件结构
{
  event: Event,          // 原生事件对象
  target: VTreeNode,     // VTreeNode 实例
  node: VTreeNodeData,   // 节点数据
  key: string,           // 节点 key
  value: any,            // 新值（如 checked、expanded）
  oldValue: any          // 旧值（可选）
}

// 用户回调（VTree → 用户）
// onSelect
{
  event: Event,
  node: VTreeNodeData,
  selectedKeys: string[],
  target: VTree
}

// onCheck
{
  event: Event,
  node: VTreeNodeData,
  checked: boolean,
  checkedKeys: string[],
  target: VTree
}

// onExpand
{
  event: Event,
  node: VTreeNodeData,
  expandedKeys: string[],
  target: VTree
}
```

### 用户回调事件格式

```javascript
// 用户使用时：
vTree(t => {
  // 选中事件
  t.onSelect(({event, node, selectedKeys, target}) => {
    console.log('选中节点:', node);
    console.log('所有选中:', selectedKeys);
    console.log('目标容器:', target);
  });

  // 勾选事件
  t.onCheck(({event, node, checked, checkedKeys, target}) => {
    console.log('节点:', node, '勾选:', checked);
    console.log('所有勾选:', checkedKeys);
  });

  // 展开事件
  t.onExpand(({event, node, expandedKeys, target}) => {
    console.log('展开状态变更:', expandedKeys);
  });
});
```

---

## 验收标准

1. **功能性**
   - [ ] VTree 支持树形数据展示
   - [ ] VTree 支持展开/收起节点
   - [ ] VTree 支持节点选中
   - [ ] VTree 支持复选框（级联勾选 + 半选状态）
   - [ ] 事件系统使用统一格式

2. **架构**
   - [ ] VTreeNode 不持有父节点引用
   - [ ] 所有状态变更通过回调函数上报
   - [ ] 状态集中存储在 VTree 容器

3. **代码质量**
   - [ ] VTreeNode 可独立测试
   - [ ] 代码有充分注释
   - [ ] 类型定义完整

---

## 相关文件

| 文件 | 操作 | 内容 |
|------|------|------|
| `src/yoya/components/tree.js` | 修改 | VTree 和 VTreeNode 组件实现 |
| `src/yoya/components/tree.d.ts` | 修改 | 类型定义 |

---

## 后续步骤

1. 写入设计文档（本文档）
2. 用户审查设计文档
3. 创建实施计划（writing-plans）
4. 执行实施
