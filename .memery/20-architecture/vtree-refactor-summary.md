# VTree 重构总结

**日期**: 2026-03-25
**状态**: 已完成

---

## 重构概述

基于设计文档 `docs/superpowers/specs/2026-03-25-vtree-node-state-design.md` 和 `docs/complex-component-design-principles.md`，对 VTree 组件进行了完整重构。

---

## 核心改进

### 1. 架构改进

**之前**：
- VTreeNode 持有父节点引用
- 直接调用 `this._parent._updateIndeterminate()`
- 状态分散在节点和容器之间

**之后**：
- VTreeNode 不持有父节点引用
- 通过 handlers 回调函数上报状态变更
- 状态集中存储在 VTree 容器

### 2. 虚拟元素架构

**遵循的设计原则**：
1. **创建过程一致性** - VTreeNode 与单一元素创建流程一致
2. **虚拟元素操作面板** - 只操作 `_attrs`、`_styles`、`_events`、`_children`
3. **_children 基石原则** - 不清空重建，使用标记删除

**实现细节**：
```javascript
class VTreeNode extends Tag {
  constructor({ data, level, handlers, ... }) {
    super('div', null);
    this._nodeContentBox = null;  // 缓存子元素容器
    this._subNodesBox = null;
    this._initialize();  // 构建内部结构
  }

  _initialize() {
    // 创建 nodeContent 和 subNodes 容器
    this._nodeContentBox = div(...);
    this._subNodesBox = div(...);

    // 添加到 _children（基石原则）
    this._children.push(this._nodeContentBox);
    this._children.push(this._subNodesBox);

    // 递归创建子节点
    if (this._data.children) {
      this._data.children.forEach(childData => {
        const childNode = new VTreeNode({ ... });
        this._subNodesBox._children.push(childNode);
      });
    }
  }
}
```

### 3. 统一事件结构

**内部回调（VTreeNode → VTree）**：
```javascript
{
  event: Event,
  target: VTreeNode,
  node: VTreeNodeData,
  key: string,
  value: any,
  oldValue: any
}
```

**用户回调（VTree → 用户）**：
```javascript
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

### 4. 状态管理

**VTree 容器集中存储**：
```javascript
class VTree extends Tag {
  constructor() {
    // 状态集中存储（使用 Set）
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

**级联勾选逻辑**：
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
      event,
      node: nodeData,
      checked: value,
      checkedKeys: [...this._checkedKeys],
      target: this
    });
  }
}
```

---

## 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/yoya/components/tree.js` | 重写 | VTree 和 VTreeNode 组件实现 |
| `src/yoya/components/tree.d.ts` | 更新 | TypeScript 类型定义 |
| `docs/complex-component-design-principles.md` | 新建 | 复杂组件通用设计原则 |
| `.memery/20-architecture/complex-component-design-principles.md` | 新建 | 记忆目录存档 |

---

## 测试结果

所有 12 个 VTree 相关测试通过：

```
✅ VTree 应该支持 onSelect 事件
✅ VTree 应该支持 onCheck 事件（复选框）
✅ VTree 应该支持 onExpand 事件
✅ VTree 应该支持链式调用事件方法
✅ VTree 节点点击应该阻止事件冒泡
✅ VCard onClick 应该传递统一事件对象
✅ VTree onSelect 应该传递统一事件对象
✅ VTree onCheck 应该传递统一事件对象
```

---

## API 变化

### 新增方法

| 方法 | 说明 |
|------|------|
| `singleSelectMode(value)` | 设置单选/多选模式 |
| `indeterminateKeys()` | 获取半选的节点 keys |
| `findNode(key)` | 查找节点实例 |
| `getNodeState(key)` | 获取节点完整状态 |

### 行为变化

| 方法 | 之前 | 之后 |
|------|------|------|
| `expandedKeys(value)` | 触发重新渲染 | 仅同步状态到节点 |
| `checkedKeys(value)` | 触发重新渲染 | 仅同步状态到节点 |
| `selectedKeys(value)` | 触发重新渲染 | 仅同步状态到节点 |

---

## 后续优化建议

1. **性能优化**：对于大型树，考虑虚拟滚动
2. **键盘导航**：支持方向键导航和空格键选择
3. **拖放支持**：支持节点拖拽排序
4. **异步加载**：支持子节点按需加载
5. **无障碍支持**：添加 ARIA 属性

---

## 验收标准达成情况

### 功能性
- [x] VTree 支持树形数据展示
- [x] VTree 支持展开/收起节点
- [x] VTree 支持节点选中
- [x] VTree 支持复选框（级联勾选 + 半选状态）
- [x] 事件系统使用统一格式

### 架构
- [x] VTreeNode 不持有父节点引用
- [x] 所有状态变更通过回调函数上报
- [x] 状态集中存储在 VTree 容器

### 代码质量
- [x] VTreeNode 可独立测试
- [x] 代码有充分注释
- [x] 类型定义完整

---

## 设计文档索引

- [VTree 节点状态设计](./superpowers/specs/2026-03-25-vtree-node-state-design.md)
- [VTree 重构策略](./superpowers/specs/2026-03-25-vtree-refactor-strategy.md)
- [复杂组件设计原则](./complex-component-design-principles.md)
