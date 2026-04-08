# VTree 组件重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 VTree 和 VTreeSelect 从 interaction.js 拆分到独立的 tree.js 文件中，简化代码结构。

**Architecture:** 创建新的 tree.js 文件，包含 VTree（基础树）和 VTreeSelect（树形选择器）两个组件，使用新的按需绑定事件系统，保持与现有组件一致的代码风格。

**Tech Stack:** Yoya.Basic HTML DSL, ES Modules, JSDoc, TypeScript 类型定义

---

## 文件结构

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/yoya/components/tree.js` | Create | VTree 和 VTreeSelect 组件实现 |
| `src/yoya/components/interaction.js` | Modify | 删除 VTree 和 VTreeSelect 相关代码 |
| `src/yoya/components/index.js` | Modify | 添加 tree.js 导出 |
| `src/yoya/components/index.d.ts` | Modify | 添加 VTree 和 VTreeSelect 类型定义 |
| `tests/components/vtree.test.js` | Create | VTree 组件单元测试 |

---

### Task 1: 创建 VTree 基础组件

**Files:**
- Create: `src/yoya/components/tree.js`
- Test: `tests/components/vtree.test.js`

- [ ] **Step 1: 创建 tree.js 文件框架**

```javascript
/**
 * Yoya.Basic - Tree Components
 * 树形组件：提供 VTree 基础树和 VTreeSelect 树形选择器
 * @module Yoya.Tree
 */

import { Tag, div, span, input } from '../core/basic.js';

// ============================================
// VTree 基础树组件
// ============================================

/**
 * VTreeNode 树节点数据结构
 * @typedef {Object} VTreeNode
 * @property {string} key - 唯一标识
 * @property {string|Tag} title - 节点标题
 * @property {VTreeNode[]} [children] - 子节点数组
 * @property {boolean} [disabled] - 禁用节点
 * @property {boolean} [selectable] - 是否可选中
 * @property {boolean} [checkable] - 是否可勾选
 * @property {string|Tag} [icon] - 节点图标
 * @property {boolean} [isLeaf] - 是否叶子节点
 * @property {Record<string, any>} [data] - 自定义数据
 */

/**
 * VTree 基础树组件
 * 支持节点展开/收起、选中、复选框（级联勾选 + 半选状态）
 * @class
 * @extends Tag
 */
class VTree extends Tag {
  /**
   * 创建 VTree 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    // 内部状态
    this._data = [];
    this._checkable = false;
    this._expandedKeys = [];
    this._checkedKeys = [];
    this._selectedKeys = [];
    this._indeterminateKeys = [];

    // 事件回调
    this._onSelect = null;
    this._onCheck = null;
    this._onExpand = null;

    // 设置基础样式
    this.addClass('yoya-tree');
    this.style('display', 'block');

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置初始化配置
   * @param {Function|Object} setup - 配置函数或对象
   * @returns {this}
   */
  setup(setup) {
    if (typeof setup === 'function') {
      setup(this);
    } else if (typeof setup === 'object' && setup !== null) {
      if (setup.data) this.data(setup.data);
      if (setup.checkable) this.checkable(setup.checkable);
      if (setup.expandedKeys) this.expandedKeys(setup.expandedKeys);
      if (setup.checkedKeys) this.checkedKeys(setup.checkedKeys);
      if (setup.selectedKeys) this.selectedKeys(setup.selectedKeys);
    }
    return this;
  }

  // ... 其他方法将在后续步骤添加
}

/**
 * 创建 VTree 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VTree}
 */
function vTree(setup = null) {
  return new VTree(setup);
}

// ============================================
// 导出
// ============================================

export { VTree, vTree };
```

- [ ] **Step 2: 运行类型检查确认无语法错误**

```bash
npm run check
```
Expected: 无错误

- [ ] **Step 3: 提交基础框架**

```bash
git add src/yoya/components/tree.js
git commit -m "feat: 创建 VTree 基础组件框架"
```

---

### Task 2: 实现 VTree 数据渲染

**Files:**
- Modify: `src/yoya/components/tree.js`

- [ ] **Step 1: 添加 data 方法和树形渲染逻辑**

```javascript
/**
 * 设置树形数据
 * @param {VTreeNode[]} value - 数据数组
 * @returns {this}
 */
data(value) {
  this._data = value;
  this._renderTree();
  return this;
}

/**
 * 渲染整棵树
 * @private
 */
_renderTree() {
  this._children = [];

  const listEl = div(list => {
    list.addClass('yoya-tree__list');
    list.styles({
      listStyle: 'none',
      margin: '0',
      padding: '0'
    });

    // 递归渲染节点
    this._renderNodes(this._data, 0, listEl);
  });

  this._children.push(listEl);
  this._rendered = false;
}

/**
 * 递归渲染节点列表
 * @param {VTreeNode[]} nodes - 节点数组
 * @param {number} level - 当前层级
 * @param {Tag} parentEl - 父容器
 * @private
 */
_renderNodes(nodes, level, parentEl) {
  nodes.forEach(node => {
    const nodeEl = this._renderNode(node, level);
    parentEl.child(nodeEl);

    // 如果有子节点且已展开，递归渲染
    if (node.children && node.children.length > 0 &&
        this._expandedKeys.includes(node.key)) {
      this._renderNodes(node.children, level + 1, parentEl);
    }
  });
}

/**
 * 渲染单个节点
 * @param {VTreeNode} node - 节点数据
 * @param {number} level - 层级
 * @returns {Tag}
 * @private
 */
_renderNode(node, level) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = this._expandedKeys.includes(node.key);
  const isDisabled = node.disabled === true;

  const nodeEl = div(item => {
    item.addClass('yoya-tree__node');
    item.styles({
      display: 'flex',
      alignItems: 'center',
      padding: '6px 12px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: this._selectedKeys.includes(node.key)
        ? 'var(--yoya-bg-primary)'
        : 'transparent',
      paddingLeft: `${level * 20 + 12}px`,
      opacity: isDisabled ? '0.6' : '1'
    });

    // 展开/收起图标
    if (hasChildren) {
      item.child(span(icon => {
        icon.html(isExpanded ? '▼' : '▶');
        icon.styles({
          fontSize: '10px',
          marginRight: '8px',
          transition: 'transform 0.2s'
        });
      }));
    } else {
      // 叶子节点显示圆点
      item.child(span(icon => {
        icon.html('•');
        icon.styles({
          fontSize: '10px',
          marginRight: '8px',
          opacity: '0.3'
        });
      }));
    }

    // 节点标题（支持字符串或 Tag）
    if (typeof node.title === 'string') {
      item.child(span(text => {
        text.addClass('yoya-tree__label');
        text.style('flex', '1');
        text.style('userSelect', 'none');
        text.text(node.title);
      }));
    } else if (node.title) {
      item.child(node.title);
    }
  });

  return nodeEl;
}
```

- [ ] **Step 2: 编写测试验证渲染功能**

```javascript
// tests/components/vtree.test.js
import { JSDOM } from 'jsdom';
import { vTree } from '../../src/yoya/index.js';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

function assert(condition, message) {
  if (!condition) throw new Error(`❌ ${message}`);
}

console.log('🧪 VTree 渲染测试...\n');

const treeData = [
  { key: '1', title: '节点 1' },
  {
    key: '2',
    title: '节点 2',
    children: [
      { key: '2-1', title: '节点 2-1' }
    ]
  }
];

// 测试 1: 基础渲染
const tree1 = vTree(t => {
  t.data(treeData);
});
tree1.bindTo(document.body);

const nodes = tree1._el.querySelectorAll('.yoya-tree__node');
assert(nodes.length === 2, `期望 2 个节点，实际 ${nodes.length}`);

// 测试 2: Tag 标题渲染
const customTitle = span(s => s.text('自定义标题'));
const tree2 = vTree(t => {
  t.data([{ key: '1', title: customTitle }]);
});
tree2.bindTo(document.body);

const label = tree2._el.querySelector('.yoya-tree__label');
assert(label !== null, '期望找到标签元素');

console.log('✅ VTree 渲染测试通过');
```

- [ ] **Step 3: 运行测试**

```bash
node tests/components/vtree.test.js
```
Expected: ✅ VTree 渲染测试通过

- [ ] **Step 4: 提交**

```bash
git add src/yoya/components/tree.js tests/components/vtree.test.js
git commit -m "feat: VTree 实现数据渲染功能"
```

---

### Task 3: 实现节点点击选中功能

**Files:**
- Modify: `src/yoya/components/tree.js`

- [ ] **Step 1: 添加节点点击事件和选中状态**

```javascript
_renderNode(node, level) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = this._expandedKeys.includes(node.key);
  const isDisabled = node.disabled === true;
  const isSelected = this._selectedKeys.includes(node.key);

  const nodeEl = div(item => {
    item.addClass('yoya-tree__node');
    // ... 样式代码 ...

    // 点击事件 - 使用新的 _wrapHandler
    if (!isDisabled && (node.selectable !== false)) {
      item.on('click', this._wrapHandler((context) => {
        context.event.stopPropagation();
        this._handleNodeClick(node, context.event);
      }));
    }

    // ... 图标和标题代码 ...
  });

  return nodeEl;
}

/**
 * 处理节点点击
 * @param {VTreeNode} node - 被点击的节点
 * @param {Event} nativeEvent - 原生事件对象
 * @private
 */
_handleNodeClick(node, nativeEvent) {
  const index = this._selectedKeys.indexOf(node.key);

  if (index > -1) {
    // 取消选中
    this._selectedKeys = this._selectedKeys.filter(k => k !== node.key);
  } else {
    // 选中
    this._selectedKeys = [node.key];
  }

  // 触发事件
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
}

/**
 * 节点选中事件
 * @param {Function} handler - 事件回调，接收 {event, node, selectedKeys, target}
 * @returns {this}
 */
onSelect(handler) {
  this._onSelect = handler;
  return this;
}
```

- [ ] **Step 2: 添加选中状态样式**

```javascript
// 在 _renderNode 中，节点背景色根据选中状态变化
backgroundColor: isSelected ? 'var(--yoya-bg-primary)' : 'transparent',
```

- [ ] **Step 3: 编写测试**

```javascript
// 添加到 tests/components/vtree.test.js

// 测试 3: 节点点击选中
let selectedNode = null;
let selectedKeys = null;

const tree3 = vTree(t => {
  t.data(treeData);
  t.onSelect((e) => {
    selectedNode = e.node;
    selectedKeys = e.selectedKeys;
  });
});
tree3.bindTo(document.body);

const firstNode = tree3._el.querySelector('.yoya-tree__node');
firstNode.click();

assert(selectedNode !== null, '期望选中节点');
assert(selectedNode.key === '1', `期望选中 key 为 1，实际为 ${selectedNode.key}`);
assert(selectedKeys.length === 1, '期望选中 1 个节点');

console.log('✅ VTree 选中测试通过');
```

- [ ] **Step 4: 提交**

```bash
git add src/yoya/components/tree.js tests/components/vtree.test.js
git commit -m "feat: VTree 实现节点点击选中功能"
```

---

### Task 4: 实现展开/收起功能

**Files:**
- Modify: `src/yoya/components/tree.js`

- [ ] **Step 1: 添加展开图标点击事件**

```javascript
_renderNode(node, level) {
  // ...

  // 展开/收起图标
  if (hasChildren) {
    item.child(span(icon => {
      icon.html(isExpanded ? '▼' : '▶');
      icon.styles({
        fontSize: '10px',
        marginRight: '8px',
        transition: 'transform 0.2s'
      });

      // 图标点击事件
      icon.on('click', this._wrapHandler((context) => {
        context.event.stopPropagation();
        this._toggleExpand(node.key, context.event);
      }));
    }));
  }
  // ...
}

/**
 * 切换展开/收起状态
 * @param {string} key - 节点 key
 * @param {Event} nativeEvent - 原生事件对象
 * @private
 */
_toggleExpand(key, nativeEvent) {
  const index = this._expandedKeys.indexOf(key);

  if (index > -1) {
    // 收起
    this._expandedKeys.splice(index, 1);
  } else {
    // 展开
    this._expandedKeys.push(key);
  }

  // 触发事件
  if (this._onExpand) {
    this._onExpand({
      event: nativeEvent,
      expandedKeys: [...this._expandedKeys],
      target: this
    });
  }

  this._renderTree();
  this._rendered = false;
}

/**
 * 节点展开事件
 * @param {Function} handler - 事件回调
 * @returns {this}
 */
onExpand(handler) {
  this._onExpand = handler;
  return this;
}

/**
 * 展开所有节点
 * @returns {this}
 */
expandAll() {
  this._expandedKeys = this._getAllKeys(this._data);
  this._renderTree();
  return this;
}

/**
 * 收起所有节点
 * @returns {this}
 */
collapseAll() {
  this._expandedKeys = [];
  this._renderTree();
  return this;
}

/**
 * 获取所有节点的 keys
 * @param {VTreeNode[]} nodes - 节点数组
 * @param {string[]} keys - 累积 keys
 * @returns {string[]}
 * @private
 */
_getAllKeys(nodes, keys = []) {
  nodes.forEach(node => {
    keys.push(node.key);
    if (node.children && node.children.length > 0) {
      this._getAllKeys(node.children, keys);
    }
  });
  return keys;
}
```

- [ ] **Step 2: 添加展开状态控制方法**

```javascript
/**
 * 设置/获取展开的节点 keys
 * @param {string[]} [value] - keys 数组（不传则返回当前值）
 * @returns {this|string[]}
 */
expandedKeys(value) {
  if (value === undefined) return [...this._expandedKeys];
  this._expandedKeys = value;
  this._renderTree();
  return this;
}
```

- [ ] **Step 3: 编写测试**

```javascript
// 测试展开功能
let expandedKeys = null;

const tree4 = vTree(t => {
  t.data(treeData);
  t.onExpand((e) => {
    expandedKeys = e.expandedKeys;
  });
});
tree4.bindTo(document.body);

// 点击展开图标
const expandIcon = tree4._el.querySelector('.yoya-tree__node span');
expandIcon.click();

assert(expandedKeys !== null, '期望触发展开事件');
assert(expandedKeys.includes('2'), '期望展开节点 2');

console.log('✅ VTree 展开测试通过');
```

- [ ] **Step 4: 提交**

```bash
git add src/yoya/components/tree.js tests/components/vtree.test.js
git commit -m "feat: VTree 实现展开/收起功能"
```

---

### Task 5: 实现复选框功能（级联勾选 + 半选状态）

**Files:**
- Modify: `src/yoya/components/tree.js`

- [ ] **Step 1: 添加复选框渲染**

```javascript
_renderNode(node, level) {
  // ...

  // 复选框
  if (this._checkable && (node.checkable !== false)) {
    const isChecked = this._checkedKeys.includes(node.key);
    const isIndeterminate = this._indeterminateKeys.includes(node.key);

    const checkbox = input(cb => {
      cb.type('checkbox');
      cb.prop('checked', isChecked);
      if (isIndeterminate) {
        cb._el.indeterminate = true;
      }
      cb.styles({ marginRight: '8px' });

      cb.on('change', this._wrapHandler((context) => {
        context.event.stopPropagation();
        this._toggleCheck(node.key, context.event);
      }));
    });

    item.child(checkbox);
  }

  // ...
}

/**
 * 设置是否显示复选框
 * @param {boolean} [value] - 不传则返回当前值
 * @returns {this|boolean}
 */
checkable(value) {
  if (value === undefined) return this._checkable;
  this._checkable = value;
  this._renderTree();
  return this;
}
```

- [ ] **Step 2: 实现勾选切换逻辑（级联勾选）

```javascript
/**
 * 切换勾选状态
 * @param {string} key - 节点 key
 * @param {Event} nativeEvent - 原生事件对象
 * @private
 */
_toggleCheck(key, nativeEvent) {
  const node = this._findNode(this._data, key);
  if (!node) return;

  const index = this._checkedKeys.indexOf(key);

  if (index > -1) {
    // 取消勾选：取消自身和所有子节点
    this._checkedKeys = this._checkedKeys.filter(k => k !== key);
    this._uncheckChildren(node);
  } else {
    // 勾选：勾选自身和所有子节点
    this._checkedKeys.push(key);
    this._checkChildren(node);
  }

  // 更新父节点的半选状态
  this._updateParentIndeterminate(key);

  // 触发事件
  if (this._onCheck) {
    this._onCheck({
      event: nativeEvent,
      node: node,
      checkedKeys: [...this._checkedKeys],
      target: this
    });
  }

  this._renderTree();
  this._rendered = false;
}

/**
 * 取消子节点勾选
 * @param {VTreeNode} node - 父节点
 * @private
 */
_uncheckChildren(node) {
  if (node.children) {
    node.children.forEach(child => {
      this._checkedKeys = this._checkedKeys.filter(k => k !== child.key);
      this._uncheckChildren(child);
    });
  }
}

/**
 * 勾选子节点
 * @param {VTreeNode} node - 父节点
 * @private
 */
_checkChildren(node) {
  if (node.children) {
    node.children.forEach(child => {
      if (!this._checkedKeys.includes(child.key)) {
        this._checkedKeys.push(child.key);
      }
      this._checkChildren(child);
    });
  }
}

/**
 * 查找节点
 * @param {VTreeNode[]} nodes - 节点数组
 * @param {string} key - 节点 key
 * @returns {VTreeNode|null}
 * @private
 */
_findNode(nodes, key) {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children) {
      const found = this._findNode(node.children, key);
      if (found) return found;
    }
  }
  return null;
}

/**
 * 更新父节点半选状态
 * @param {string} key - 子节点 key
 * @private
 */
_updateParentIndeterminate(key) {
  // 计算并更新半选状态
  this._indeterminateKeys = [];
  this._calculateIndeterminate(this._data);
}

/**
 * 计算半选状态
 * @param {VTreeNode[]} nodes - 节点数组
 * @private
 */
_calculateIndeterminate(nodes) {
  nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
      const childCheckedCount = node.children.filter(c =>
        this._checkedKeys.includes(c.key)
      ).length;

      if (childCheckedCount > 0 && childCheckedCount < node.children.length) {
        if (!this._indeterminateKeys.includes(node.key)) {
          this._indeterminateKeys.push(node.key);
        }
      } else {
        this._indeterminateKeys = this._indeterminateKeys.filter(k => k !== node.key);
      }

      this._calculateIndeterminate(node.children);
    }
  });
}
```

- [ ] **Step 3: 添加 onCheck 事件和 checkedKeys 方法**

```javascript
/**
 * 节点勾选事件
 * @param {Function} handler - 事件回调
 * @returns {this}
 */
onCheck(handler) {
  this._onCheck = handler;
  return this;
}

/**
 * 设置/获取勾选的节点 keys
 * @param {string[]} [value] - keys 数组
 * @returns {this|string[]}
 */
checkedKeys(value) {
  if (value === undefined) return [...this._checkedKeys];
  this._checkedKeys = value;
  // 重新计算半选状态
  this._calculateIndeterminate(this._data);
  this._renderTree();
  return this;
}
```

- [ ] **Step 4: 编写测试**

```javascript
// 测试复选框功能
let checkedKeys = null;

const tree5 = vTree(t => {
  t.data(treeData);
  t.checkable(true);
  t.onCheck((e) => {
    checkedKeys = e.checkedKeys;
  });
});
tree5.bindTo(document.body);

// 点击复选框
const checkbox = tree5._el.querySelector('input[type="checkbox"]');
checkbox.checked = true;
const changeEvent = new dom.window.Event('change', { bubbles: true });
checkbox.dispatchEvent(changeEvent);

assert(checkedKeys !== null, '期望触发勾选事件');

console.log('✅ VTree 复选框测试通过');
```

- [ ] **Step 5: 提交**

```bash
git add src/yoya/components/tree.js tests/components/vtree.test.js
git commit -m "feat: VTree 实现复选框功能（级联勾选 + 半选状态）"
```

---

### Task 6: 实现 VTreeSelect 树形选择器

**Files:**
- Modify: `src/yoya/components/tree.js`

- [ ] **Step 1: 添加 VTreeSelect 组件**

```javascript
// ============================================
// VTreeSelect 树形选择器
// ============================================

/**
 * VTreeSelect 树形选择器
 * 下拉框 + 树形选择器的组合组件
 * @class
 * @extends Tag
 */
class VTreeSelect extends Tag {
  /**
   * 创建 VTreeSelect 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    this._data = [];
    this._value = '';
    this._placeholder = '请选择';
    this._visible = false;
    this._onChange = null;
    this._treeEl = null;

    this.addClass('yoya-tree-select');
    this.style('display', 'inline-block');
    this.style('position', 'relative');

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置初始化配置
   * @param {Function|Object} setup
   * @returns {this}
   */
  setup(setup) {
    if (typeof setup === 'function') {
      setup(this);
    } else if (typeof setup === 'object') {
      if (setup.data) this.data(setup.data);
      if (setup.placeholder) this.placeholder(setup.placeholder);
      if (setup.value) this.value(setup.value);
    }
    return this;
  }

  /**
   * 设置树形数据
   * @param {VTreeNode[]} value
   * @returns {this}
   */
  data(value) {
    this._data = value;
    this._renderSelect();
    return this;
  }

  /**
   * 设置/获取占位符
   * @param {string} [value]
   * @returns {this|string}
   */
  placeholder(value) {
    if (value === undefined) return this._placeholder;
    this._placeholder = value;
    this._renderSelect();
    return this;
  }

  /**
   * 设置/获取选中值
   * @param {string} [value]
   * @returns {this|string}
   */
  value(value) {
    if (value === undefined) return this._value;
    this._value = value;
    this._renderSelect();
    return this;
  }

  /**
   * 选择变化事件
   * @param {Function} handler
   * @returns {this}
   */
  onChange(handler) {
    this._onChange = handler;
    return this;
  }

  /**
   * 渲染选择器
   * @private
   */
  _renderSelect() {
    this._children = [];

    // 显示框
    const displayEl = div(display => {
      display.addClass('yoya-tree-select__display');
      display.styles({
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#fff'
      });

      const node = this._findNode(this._data, this._value);
      display.text(node ? node.title : this._placeholder);

      display.on('click', this._wrapHandler(() => {
        this._toggleDropdown();
      }));

      this._children.push(displayEl);
    });

    // 下拉面板（初始隐藏）
    if (this._visible) {
      const dropdownEl = div(dropdown => {
        dropdown.addClass('yoya-tree-select__dropdown');
        dropdown.styles({
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: '1000',
          marginTop: '4px',
          maxHeight: '300px',
          overflow: 'auto'
        });

        this._treeEl = vTree(t => {
          t.data(this._data);
          t.selectedKeys([this._value]);
          t.onSelect((e) => {
            this._value = e.node.key;
            this._visible = false;
            this._renderSelect();

            if (this._onChange) {
              this._onChange({
                event: e.event,
                value: this._value,
                node: e.node,
                target: this
              });
            }
          });
        });

        dropdown.child(this._treeEl);
        this._children.push(dropdownEl);
      });
    }
  }

  /**
   * 切换下拉面板显示
   * @private
   */
  _toggleDropdown() {
    this._visible = !this._visible;
    this._renderSelect();
  }
}

/**
 * 创建 VTreeSelect 实例
 * @param {Function} [setup=null]
 * @returns {VTreeSelect}
 */
function vTreeSelect(setup = null) {
  return new VTreeSelect(setup);
}

// ============================================
// 导出
// ============================================

export { VTree, vTree, VTreeSelect, vTreeSelect };
```

- [ ] **Step 2: 编写 VTreeSelect 测试**

```javascript
// 添加到 tests/components/vtree.test.js

console.log('\n🧪 VTreeSelect 测试...\n');

let changeValue = null;
let changeNode = null;

const treeSelect = vTreeSelect(ts => {
  ts.data(treeData);
  ts.placeholder('请选择节点');
  ts.onChange((e) => {
    changeValue = e.value;
    changeNode = e.node;
  });
});
treeSelect.bindTo(document.body);

// 点击显示框
const display = treeSelect._el.querySelector('.yoya-tree-select__display');
assert(display !== null, '期望找到显示框');

display.click();

// 断言下拉面板出现
const dropdown = treeSelect._el.querySelector('.yoya-tree-select__dropdown');
assert(dropdown !== null, '期望下拉面板显示');

console.log('✅ VTreeSelect 测试通过');
```

- [ ] **Step 3: 提交**

```bash
git add src/yoya/components/tree.js tests/components/vtree.test.js
git commit -m "feat: 实现 VTreeSelect 树形选择器"
```

---

### Task 7: 更新导出和类型定义

**Files:**
- Modify: `src/yoya/components/index.js`
- Modify: `src/yoya/components/index.d.ts`

- [ ] **Step 1: 更新 components/index.js 添加导出**

```javascript
// 在 index.js 中添加（找到合适的位置，如在 router 导出后）

// Tree 树形组件
export {
  VTree, vTree,
  VTreeSelect, vTreeSelect,
} from './tree.js';
```

- [ ] **Step 2: 更新 components/index.d.ts 添加类型定义**

```typescript
// ============================================
// VTree 树形控件
// ============================================

interface VTreeNode {
  key: string;                    // 唯一标识
  title: string|Tag;              // 节点标题
  children?: VTreeNode[];         // 子节点数组
  disabled?: boolean;             // 禁用节点
  selectable?: boolean;           // 是否可选中
  checkable?: boolean;            // 是否可勾选
  icon?: string|Tag;              // 节点图标
  isLeaf?: boolean;               // 是否叶子节点
  data?: Record<string, any>;     // 自定义数据
}

declare class VTree extends Tag {
  constructor(setup?: Setup<VTree>);
  data(value: VTreeNode[]): this;
  checkable(value?: boolean): this | boolean;
  expandAll(): this;
  collapseAll(): this;
  expandedKeys(value?: string[]): this | string[];
  checkedKeys(value?: string[]): this | string[];
  selectedKeys(value?: string[]): this | string[];
  onSelect(handler: (e: {
    event: Event;
    node: VTreeNode;
    selectedKeys: string[];
    target: VTree
  }) => void): this;
  onCheck(handler: (e: {
    event: Event;
    node: VTreeNode;
    checkedKeys: string[];
    target: VTree
  }) => void): this;
  onExpand(handler: (e: {
    event: Event;
    expandedKeys: string[];
    target: VTree
  }) => void): this;
}

declare function vTree(setup?: Setup<VTree>): VTree;

// ============================================
// VTreeSelect 树形选择器
// ============================================

declare class VTreeSelect extends Tag {
  constructor(setup?: Setup<VTreeSelect>);
  data(value: VTreeNode[]): this;
  placeholder(value?: string): this | string;
  value(value?: string): this | string;
  onChange(handler: (e: {
    event: Event;
    value: string;
    node: VTreeNode;
    target: VTreeSelect
  }) => void): this;
}

declare function vTreeSelect(setup?: Setup<VTreeSelect>): VTreeSelect;
```

- [ ] **Step 3: 运行类型检查**

```bash
npm run check
```
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
git add src/yoya/components/index.js src/yoya/components/index.d.ts
git commit -m "feat: 添加 VTree 和 VTreeSelect 导出和类型定义"
```

---

### Task 8: 从 interaction.js 删除旧代码

**Files:**
- Modify: `src/yoya/components/interaction.js`

- [ ] **Step 1: 查看并删除 VTree 相关代码**

```bash
# 查看 VTree 和 VTreeSelect 的行号
grep -n "class VTree" src/yoya/components/interaction.js
```

- [ ] **Step 2: 使用 sed 删除相关代码**

```bash
# 删除 VTree 类（约第 759-1048 行）
# 删除 VTreeSelect 类（约第 1049-1301 行）
# 注意：先备份文件

cp src/yoya/components/interaction.js src/yoya/components/interaction.js.bak

# 使用编辑器或手动删除更可靠
```

或者使用更精确的方法：

```bash
# 找到 VTree 开始和结束的行号
# 然后使用 sed 删除
sed -i '/^class VTree extends Tag/,/^class VTreeSelect/d' src/yoya/components/interaction.js
sed -i '/^class VTreeSelect extends Tag/,/^\/\/ =================================/d' src/yoya/components/interaction.js
```

- [ ] **Step 3: 运行测试确保没有破坏其他功能**

```bash
npm test
```
Expected: 所有测试通过

- [ ] **Step 4: 提交**

```bash
git add src/yoya/components/interaction.js src/yoya/components/interaction.js.bak
git commit -m "refactor: 从 interaction.js 删除 VTree 和 VTreeSelect"
```

- [ ] **Step 5: 删除备份文件**

```bash
rm src/yoya/components/interaction.js.bak
git add src/yoya/components/interaction.js.bak
git commit -m "chore: 删除 interaction.js 备份文件"
```

---

### Task 9: 完整集成测试

**Files:**
- Create: `tests/components/vtree-integration.test.js`

- [ ] **Step 1: 创建集成测试文件**

```javascript
/**
 * VTree 组件集成测试
 */
import { JSDOM } from 'jsdom';
import { vTree, vTreeSelect } from '../../src/yoya/index.js';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.MouseEvent = dom.window.MouseEvent;
global.Event = dom.window.Event;

function assert(condition, message) {
  if (!condition) throw new Error(`❌ ${message}`);
}

const treeData = [
  {
    key: '1',
    title: '节点 1',
    children: [
      { key: '1-1', title: '节点 1-1' },
      { key: '1-2', title: '节点 1-2' }
    ]
  },
  {
    key: '2',
    title: '节点 2',
    children: [
      { key: '2-1', title: '节点 2-1' }
    ]
  }
];

console.log('\n🧪 VTree 集成测试...\n');

// 测试 1: 完整 VTree 功能
let selectCalled = false;
let checkCalled = false;
let expandCalled = false;

const tree = vTree(t => {
  t.data(treeData);
  t.checkable(true);
  t.onSelect(() => { selectCalled = true; });
  t.onCheck(() => { checkCalled = true; });
  t.onExpand(() => { expandCalled = true; });
});

tree.bindTo(document.body);

// 测试选中
const firstNode = tree._el.querySelector('.yoya-tree__node');
firstNode.click();
assert(selectCalled, '期望触发选中事件');

// 测试复选框
const checkbox = tree._el.querySelector('input[type="checkbox"]');
checkbox.checked = true;
const changeEvent = new dom.window.Event('change', { bubbles: true });
checkbox.dispatchEvent(changeEvent);
assert(checkCalled, '期望触发勾选事件');

// 测试展开
const expandIcon = tree._el.querySelector('.yoya-tree__node span');
expandIcon.click();
assert(expandCalled, '期望触发展开事件');

console.log('✅ VTree 集成测试通过');

// 测试 2: VTreeSelect
let changeValue = null;

const treeSelect = vTreeSelect(ts => {
  ts.data(treeData);
  ts.placeholder('请选择');
  ts.onChange((e) => {
    changeValue = e.value;
  });
});

treeSelect.bindTo(document.body);

// 打开下拉面板
const display = treeSelect._el.querySelector('.yoya-tree-select__display');
display.click();

// 选择节点
const dropdownNode = treeSelect._el.querySelector('.yoya-tree-select__dropdown .yoya-tree__node');
if (dropdownNode) {
  dropdownNode.click();
}
assert(changeValue !== null, '期望触发变化事件');

console.log('✅ VTreeSelect 集成测试通过');

console.log('\n────────────────────────────────────────');
console.log('所有集成测试通过！');
```

- [ ] **Step 2: 运行集成测试**

```bash
node tests/components/vtree-integration.test.js
```
Expected: 所有集成测试通过

- [ ] **Step 3: 更新 package.json 添加测试**

```json
"test": "node tests/basic.test.js && node tests/pager.test.js && node tests/event-system.test.js && node tests/components/vtree.test.js && node tests/components/vtree-integration.test.js"
```

- [ ] **Step 4: 运行完整测试套件**

```bash
npm test
```
Expected: 所有测试通过

- [ ] **Step 5: 提交**

```bash
git add tests/components/vtree-integration.test.js package.json
git commit -m "test: 添加 VTree 集成测试"
```

---

### Task 10: 清理和文档

**Files:**
- Delete: `src/examples/vtree-checkbox-test.html` (调试文件)
- Delete: `tests/test-vtree-checkbox.js` (调试文件)
- Delete: `tests/test-vtree-checkbox2.js` (调试文件)
- Delete: `tests/test-vtree-checkbox3.js` (调试文件)

- [ ] **Step 1: 清理调试文件**

```bash
rm -f src/examples/vtree-checkbox-test.html
rm -f tests/test-vtree-checkbox*.js
```

- [ ] **Step 2: 提交清理**

```bash
git add -A
git commit -m "chore: 清理 VTree 调试文件"
```

---

## 完成检查

- [ ] 所有测试通过
- [ ] 类型检查通过
- [ ] 代码有充分注释
- [ ] 提交历史清晰

---

## 验收标准

1. **功能性**
   - [ ] VTree 支持树形数据展示
   - [ ] VTree 支持展开/收起节点
   - [ ] VTree 支持节点选中
   - [ ] VTree 支持复选框（级联勾选 + 半选状态）
   - [ ] VTreeSelect 支持下拉选择
   - [ ] 事件系统使用统一格式

2. **代码质量**
   - [ ] tree.js 文件结构清晰
   - [ ] 代码有充分注释
   - [ ] 类型定义完整

3. **测试**
   - [ ] 基础功能测试通过
   - [ ] 复选框级联测试通过
   - [ ] 集成测试通过
