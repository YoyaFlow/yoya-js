# 复杂组件设计原则

**日期**: 2026-03-25
**适用范围**: 所有基于 Yoya.Basic 的复杂组件开发

---

## 一、核心设计原则

### 1. 创建过程一致性原则

**单一元素与复杂元素的创建过程必须一致**

```
单一元素（如 div）创建流程:
  创建 Tag → 同时创建 _el (DOM) → 通过 child() 添加子元素

复杂元素（如 VTreeNode、Card、MenuItem）创建流程:
  创建组件类 → 同时创建 _el (DOM) → 创建特定子元素 → 通过 child() 按顺序添加到 _children
```

**示例**：
```javascript
// ✅ 正确：复杂组件遵循单一元素创建流程
class VTreeNode extends Tag {
  constructor(setup) {
    super('div');  // 1. 创建 Tag → _el
    this._initialize();  // 2. 创建特定子元素 → 通过 child() 添加
  }

  _initialize() {
    // 创建内部结构
    this._nodeContentBox = div(...);
    this._subNodesBox = div(...);

    // 通过 _children.push() 添加（等同于 child()）
    this._children.push(this._nodeContentBox);
    this._children.push(this._subNodesBox);
  }
}

// ❌ 错误：在 renderDom 中直接创建 DOM
class VTreeNode extends Tag {
  renderDom() {
    const el = document.createElement('div');  // 违背一致性原则
    el.innerHTML = '...';  // 直接操作 DOM
    return el;
  }
}
```

---

### 2. 虚拟元素操作面板原则

**组件只能操作虚拟元素，不直接操作 DOM**

- 所有状态存储在虚拟元素属性中（`_attrs`、`_styles`、`_events`、`_children`）
- 虚拟元素负责同步到真实 DOM（通过 `renderDom()`）
- 无论多复杂的组件，都由虚拟元素组合而成

**示例**：
```javascript
// ✅ 正确：使用虚拟元素组合
class MenuItem extends Tag {
  _buildContent() {
    // 使用基础元素组合构建内部结构
    this._iconBox = span(s => {
      s.styles({ display: 'inline-flex' });
      s.html(this._icon);
    });

    this._textBox = span(t => {
      t.styles({ flex: 1 });
      t.text(this._text);
    });

    this._children.push(this._iconBox);
    this._children.push(this._textBox);
  }
}

// ❌ 错误：直接操作 DOM
class MenuItem {
  render() {
    const el = document.createElement('div');
    el.innerHTML = `<span>${icon}</span><span>${text}</span>`;
    return el;
  }
}
```

---

### 3. _children 基石原则

**_children 是基石，不应清空重建**

- 删除时先打标记（`_deleted = true`）
- 在 `renderDom()` 时跳过已标记的元素
- 在合适的时机（如数据变更完成）才真正删除

**示例**：
```javascript
// ✅ 正确：使用标记删除
class VTree extends Tag {
  _renderTree() {
    // 1. 标记旧节点为删除（而非清空 _children）
    this._markAllDeleted(this._listBox._children);

    // 2. 构建新节点
    this._buildNodes(this._data, 0, this._listBox);

    // 3. 在合适时机真正清理
    this._cleanupDeleted();
  }

  _markAllDeleted(children) {
    children.forEach(child => {
      if (child instanceof VTreeNode) {
        child.destroy();  // 设置 _deleted = true
      }
    });
  }

  _cleanupDeleted() {
    this._listBox._children = this._listBox._children.filter(
      child => !child._deleted
    );
  }
}

// ❌ 错误：清空重建
_renderTree() {
  this._children = [];  // 信息丢失，需要重新构建
  // ...
}
```

---

## 二、状态管理原则

### 4. 状态集中存储原则

**容器组件集中存储状态，子组件作为展示层**

- 容器组件（如 VTree、Checkboxes）持有状态（`_checkedKeys`、`_selectedKeys` 等）
- 子组件（如 VTreeNode、CheckboxItem）作为展示层，状态由容器同步
- 避免状态分散在多个组件中导致不一致

**示例**：
```javascript
// ✅ 正确：状态集中在容器
class VTree extends Tag {
  constructor() {
    super('div');
    // 状态集中存储
    this._expandedKeys = new Set();
    this._checkedKeys = new Set();
    this._selectedKeys = new Set();
    this._indeterminateKeys = new Set();
  }
}

class VTreeNode extends Tag {
  // 状态仅用于展示，变更通过回调上报
  _expanded = false;
  _checked = false;
  _selected = false;
  _indeterminate = false;

  setExpanded(expanded) {
    this._expanded = expanded;  // 仅更新展示
  }
}

// ❌ 错误：状态分散
class VTreeNode extends Tag {
  _updateParentIndeterminate() {
    this._parent._indeterminateKeys.add(this.key);  // 直接操作父节点状态
  }
}
```

---

### 5. 回调解耦原则

**子组件通过回调函数上报状态变更，不持有父组件引用**

- 子组件不持有 `this._parent` 引用
- 所有状态变更通过 `handlers` 回调函数上报
- 减少内存开销，支持组件独立测试

**示例**：
```javascript
// ✅ 正确：使用回调解耦
class VTree extends Tag {
  constructor() {
    super('div');
    // 创建 handlers 并传递给子节点
    this._handlers = {
      onToggleExpand: (context) => this._handleToggleExpand(context),
      onToggleCheck: (context) => this._handleToggleCheck(context),
      onToggleSelect: (context) => this._handleToggleSelect(context)
    };
  }

  _renderNode(nodeData, level) {
    return new VTreeNode({
      data: nodeData,
      level,
      handlers: this._handlers,  // 传递 handlers 引用
      checkable: this._checkable
    });
  }
}

class VTreeNode extends Tag {
  _buildCheckbox(parent) {
    const checkbox = input(cb => {
      cb.onToggle((context) => {
        // 通过 handlers 回调上报，不直接调用父节点
        this._handlers.onToggleCheck({
          event: context.event,
          target: this,
          node: this._data,
          key: this._data.key,
          value: context.value
        });
      });
    });
    parent.child(checkbox);
  }
}

// ❌ 错误：直接持有父引用
class VTreeNode extends Tag {
  constructor(parent) {
    this._parent = parent;  // 增加内存开销，无法独立测试
  }

  _onCheck() {
    this._parent._updateIndeterminate();  // 直接调用父节点方法
  }
}
```

---

### 6. 统一事件结构原则

**所有回调函数使用统一的事件对象格式**

- 内部回调（子组件 → 容器）：`{event, target, node, key, value, oldValue}`
- 用户回调（容器 → 用户）：`{event, node, xxxKeys, target}`
- 避免多参数位置依赖，提高代码可读性

**示例**：
```javascript
// ✅ 正确：统一事件结构
// 容器创建 handlers
this._handlers = {
  onToggleCheck: (context) => this._handleToggleCheck(context)
};

// 子组件调用 handlers
this._handlers.onToggleCheck({
  event: context.event,
  target: this,
  node: this._data,
  key: this._data.key,
  value: context.value,
  oldValue: this._checked
});

// 容器处理方法
_handleToggleCheck(context) {
  const { event, key, value, node: nodeData } = context;
  // ...
}

// ❌ 错误：多参数格式
_handleToggleCheck(key, checked, event, node) {
  // 参数位置依赖，难以阅读
}
```

---

## 三、生命周期原则

### 7. 生命周期阶段清晰原则

**复杂组件的生命周期应分为清晰的五个阶段**

| 阶段 | 方法 | 职责 |
|------|------|------|
| 创建 | `constructor` | 调用 `super()` 创建 _el，存储配置参数 |
| 初始化 | `_initialize()` | 创建内部子元素结构并添加到 `_children` |
| 渲染 | `renderDom()` | 应用属性/样式/事件到真实 DOM |
| 同步 | `_syncFromContainer()` | 由容器调用，更新展示状态（不触发回调） |
| 销毁 | `destroy()` | 设置 `_deleted = true` |

**示例**：
```javascript
class VTreeNode extends Tag {
  // 1. 创建阶段
  constructor({ data, level, handlers }) {
    super('div');  // 创建 _el
    this._data = data;
    this._level = level;
    this._handlers = handlers;
    this._initialize();  // 2. 初始化阶段
  }

  // 2. 初始化阶段
  _initialize() {
    this._nodeContentBox = div(...);
    this._subNodesBox = div(...);
    this._children.push(this._nodeContentBox);
    this._children.push(this._subNodesBox);
  }

  // 3. 渲染阶段
  renderDom() {
    if (this._deleted) return null;
    // 应用状态到 DOM
    const el = this._el;
    this._applyAttrs(el);
    this._applyStyles(el);
    this._applyEvents(el);
    this._applyChildren(el);
    return el;
  }

  // 4. 同步阶段
  _syncFromContainer(states) {
    // 更新内部状态（不触发回调）
    this._checked = states.checked;
    this._updateCheckbox();
  }

  // 5. 销毁阶段
  destroy() {
    this._deleted = true;
    // 递归标记子节点
  }
}
```

---

### 8. 子元素缓存原则

**固定子元素结构应使用属性缓存容器引用**

- 适用于复杂组件中固定子元素结构（如 Card 的头部/内容/底部）
- 首次创建时实例化容器并添加到 `_children`
- 后续更新只修改内容，避免重复创建对象

**示例**：
```javascript
// ✅ 正确：缓存子元素容器
class MenuItem extends Tag {
  icon(content) {
    this._icon = content;
    this._ensureIconBox();
    this._iconBox.html(this._icon);  // 只更新内容
    return this;
  }

  _ensureIconBox() {
    if (this._iconBox) return;  // 已存在，跳过
    // 首次创建
    this._iconBox = span(s => {
      s.styles({ display: 'inline-flex' });
    });
    this._children.push(this._iconBox);
  }
}

class Card extends Tag {
  cardHeader(setup) {
    if (!this._headerBox) {
      // 首次创建
      this._headerBox = cardHeader(setup);
      this._children.push(this._headerBox);
    } else {
      // 更新现有内容
      this._headerBox.setup(setup);
    }
    return this;
  }
}

// ❌ 错误：每次调用都重新创建
cardHeader(setup) {
  // 找到旧的 _headerBox 并从 _children 移除
  const oldIndex = this._children.findIndex(c => c === this._headerBox);
  if (oldIndex > -1) this._children.splice(oldIndex, 1);

  // 创建新的
  this._headerBox = cardHeader(setup);
  this._children.push(this._headerBox);
}
```

---

## 四、组件架构原则

### 9. 容器 - 展示分离原则

**容器组件负责状态管理，展示组件负责 UI 渲染**

| 职责 | 容器组件 | 展示组件 |
|------|---------|---------|
| 状态存储 | ✅ | ❌ |
| 状态计算 | ✅ | ❌ |
| UI 渲染 | ❌ | ✅ |
| 事件处理 | ✅（逻辑处理） | ✅（事件上报） |
| 回调函数 | ✅（接收上报） | ✅（调用上报） |

**示例**：
```javascript
// 容器组件 VTree
class VTree extends Tag {
  // 状态存储
  _checkedKeys = new Set();

  // 状态计算
  _handleToggleCheck(context) {
    // 更新状态
    // 级联计算
    // 同步展示层
  }

  // 同步展示层
  _syncNodesState() {
    this._traverseNodes(node => {
      node.setChecked(this._checkedKeys.has(node.getKey()));
    });
  }
}

// 展示组件 VTreeNode
class VTreeNode extends Tag {
  // UI 渲染
  _buildCheckbox(parent) {
    const checkbox = input(cb => {
      cb.prop('checked', this._checked);  // 展示状态
      cb.onToggle(context => {
        this._handlers.onToggleCheck(context);  // 事件上报
      });
    });
    parent.child(checkbox);
  }

  // 状态更新（由容器同步，不触发回调）
  setChecked(checked) {
    this._checked = checked;
    this._updateCheckbox();
  }
}
```

---

### 10. 职责单一原则

**每个组件只负责一个明确的职责**

- VTree：状态管理 + 节点容器
- VTreeNode：节点内容展示
- nodeContentBox：节点操作区域（展开图标 + 复选框 + 标题）
- subNodesBox：子节点容器 + 缩进处理

**示例**：
```javascript
// ✅ 正确：职责分离
class VTreeNode extends Tag {
  _initialize() {
    // nodeContentBox：只负责节点操作区域
    this._nodeContentBox = div(nodeContent => {
      nodeContent.className('yoya-tree__node-content');
      this._buildExpandIcon(nodeContent);   // 展开图标
      this._buildCheckbox(nodeContent);     // 复选框
      this._buildTitle(nodeContent);        // 标题
    });

    // subNodesBox：只负责子节点容器和缩进
    this._subNodesBox = div(subNodes => {
      subNodes.className('yoya-tree__subnodes');
      subNodes.style('padding-left', `${this._level * 20}px`);  // 缩进处理
    });

    this._children.push(this._nodeContentBox);
    this._children.push(this._subNodesBox);
  }
}

// ❌ 错误：职责不清
class VTreeNode extends Tag {
  _initialize() {
    // 所有内容混在一起，没有清晰的职责划分
    this._children.push(span('▼'));
    this._children.push(input(...));
    this._children.push(span('标题'));
    // 子节点直接添加到当前层级，没有 subNodes 容器
    this._children.push(div(...));  // 子节点
  }
}
```

---

## 五、检查清单

开发复杂组件时，请对照以下清单检查：

### 架构检查
- [ ] 是否遵循创建过程一致性原则？
- [ ] 是否只操作虚拟元素，不直接操作 DOM？
- [ ] 是否使用 `_children.push()` 添加子元素，而非清空重建？
- [ ] 是否有清晰的职责划分（容器 - 展示分离）？

### 状态管理检查
- [ ] 状态是否集中存储在容器组件？
- [ ] 子组件是否通过回调函数上报状态变更？
- [ ] 子组件是否不持有父组件引用？
- [ ] 回调函数是否使用统一事件对象格式？

### 生命周期检查
- [ ] 是否有清晰的五个生命周期阶段？
- [ ] 固定子元素结构是否使用属性缓存？
- [ ] 销毁时是否使用标记删除（`_deleted = true`）？

### 代码质量检查
- [ ] 组件是否可独立测试？
- [ ] 代码是否有充分注释？
- [ ] 类型定义是否完整？

---

## 六、相关文件

| 文件 | 内容 |
|------|------|
| `docs/superpowers/specs/2026-03-25-vtree-node-state-design.md` | VTree 详细设计 |
| `docs/superpowers/specs/2026-03-25-vtree-refactor-strategy.md` | VTree 重构策略 |
| `src/yoya/components/menu.js` | Menu 组件（遵循上述原则的示例） |
| `src/yoya/components/card.js` | Card 组件（遵循上述原则的示例） |
