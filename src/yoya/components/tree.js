/**
 * Yoya.Basic - Tree Components
 * 树形组件：提供 VTree 基础树和 VTreeSelect 树形选择器
 * @module Yoya.Tree
 */

import { Tag, div, span, input } from '../core/basic.js';

// ============================================
// VTreeNode 树节点数据结构
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

// ============================================
// VTree 基础树组件
// ============================================

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

    // 设置基础 CSS 类
    this.addClass('yoya-tree');
    this.style('display', 'block');

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置初始化配置（支持函数/对象配置）
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

  // ============================================
  // 数据配置方法
  // ============================================

  /**
   * 设置树形数据
   * @param {VTreeNode[]} [value] - 不传则返回当前值
   * @returns {this|VTreeNode[]}
   */
  data(value) {
    if (value === undefined) return this._data;
    this._data = value;
    return this;
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

  // ============================================
  // 节点状态方法（getter/setter 双重模式）
  // ============================================

  /**
   * 设置/获取展开的节点 keys
   * @param {string[]} [value] - 不传则返回当前值
   * @returns {this|string[]}
   */
  expandedKeys(value) {
    if (value === undefined) return [...this._expandedKeys];
    this._expandedKeys = value;
    return this;
  }

  /**
   * 设置/获取勾选的节点 keys
   * @param {string[]} [value] - 不传则返回当前值
   * @returns {this|string[]}
   */
  checkedKeys(value) {
    if (value === undefined) return [...this._checkedKeys];
    this._checkedKeys = value;
    return this;
  }

  /**
   * 设置/获取选中的节点 keys
   * @param {string[]} [value] - 不传则返回当前值
   * @returns {this|string[]}
   */
  selectedKeys(value) {
    if (value === undefined) return [...this._selectedKeys];
    this._selectedKeys = value;
    return this;
  }

  // ============================================
  // 事件绑定方法
  // ============================================

  /**
   * 节点选中事件
   * @param {Function} handler - 事件处理函数
   * @returns {this}
   */
  onSelect(handler) {
    this._onSelect = handler;
    return this;
  }

  /**
   * 节点勾选事件
   * @param {Function} handler - 事件处理函数
   * @returns {this}
   */
  onCheck(handler) {
    this._onCheck = handler;
    return this;
  }

  /**
   * 节点展开事件
   * @param {Function} handler - 事件处理函数
   * @returns {this}
   */
  onExpand(handler) {
    this._onExpand = handler;
    return this;
  }

  // ============================================
  // 操作方法
  // ============================================

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
   * @param {string[]} [keys=[]] - 累积 keys
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

  // ============================================
  // 树形渲染方法
  // ============================================

  /**
   * 设置树形数据并渲染
   * @param {VTreeNode[]} [value] - 不传则返回当前值
   * @returns {this|VTreeNode[]}
   */
  data(value) {
    if (value === undefined) return this._data;
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
    });
  }

  /**
   * 渲染单个节点
   * @param {VTreeNode} node - 节点数据
   * @param {number} level - 层级
   * @returns {Tag} 节点元素
   * @private
   */
  _renderNode(node, level) {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = this._expandedKeys.includes(node.key);
    const isDisabled = node.disabled === true;
    const isSelected = this._selectedKeys.includes(node.key);
    const isCheckable = this._checkable || node.checkable;

    // 节点容器
    const nodeEl = div(n => {
      n.addClass('yoya-tree__node');
      n.styles({
        display: 'flex',
        alignItems: 'center',
        padding: '6px 12px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
        borderRadius: '4px'
      });

      // 悬停效果（非禁用且可选中）
      if (!isDisabled && node.selectable !== false) {
        n.on('mouseenter', () => {
          if (!isSelected) n.style('background', '#f5f5f5');
        });
        n.on('mouseleave', () => {
          if (!isSelected) n.style('background', 'transparent');
        });
      }

      // 禁用状态
      if (isDisabled) {
        n.styles({ opacity: '0.5', cursor: 'not-allowed' });
      }

      // 点击事件 - 选中节点
      if (!isDisabled && node.selectable !== false) {
        n.on('click', (e) => {
          e.stopPropagation();
          this._handleNodeClick(node, e);
        });
      }
    });

    // 缩进
    const indentEl = span(i => {
      i.addClass('yoya-tree__indent');
      i.style('width', `${level * 20}px`);
      i.style('flex-shrink', '0');
    });
    nodeEl.child(indentEl);

    // 展开/收起图标
    if (hasChildren) {
      const iconEl = span(icon => {
        icon.addClass('yoya-tree__icon');
        icon.style('width', '16px');
        icon.style('height', '16px');
        icon.style('flex-shrink', '0');
        icon.style('marginRight', '4px');
        icon.style('fontSize', '12px');
        icon.style('textAlign', 'center');
        icon.style('userSelect', 'none');
        icon.text(isExpanded ? '▼' : '▶');

        // 点击展开/收起（阻止冒泡）
        icon.on('click', (e) => {
          e.stopPropagation();
          this._toggleExpand(node);
        });
      });
      nodeEl.child(iconEl);
    } else {
      // 叶子节点占位
      const placeholderEl = span(p => {
        p.addClass('yoya-tree__placeholder');
        p.style('width', '16px');
        p.style('height', '16px');
        p.style('flex-shrink', '0');
        p.style('marginRight', '4px');
      });
      nodeEl.child(placeholderEl);
    }

    // 复选框
    if (isCheckable) {
      const checkboxEl = input(cb => {
        cb.type('checkbox');
        cb.addClass('yoya-tree__checkbox');
        cb.style('marginRight', '8px');
        cb.attr('data-node-key', node.key);

        // 勾选状态
        const isChecked = this._checkedKeys.includes(node.key);
        if (isChecked) cb.attr('checked', '');

        // 半选状态
        const isIndeterminate = this._indeterminateKeys.includes(node.key);
        if (isIndeterminate) cb.prop('indeterminate', true);

        // 点击事件（阻止冒泡到节点）
        cb.on('click', (e) => {
          e.stopPropagation();
          this._toggleCheck(node);
        });
      });
      nodeEl.child(checkboxEl);
    }

    // 节点标题
    const titleEl = span(t => {
      t.addClass('yoya-tree__title');
      t.style('flex', '1');
      t.style('overflow', 'hidden');
      t.style('textOverflow', 'ellipsis');
      t.style('whiteSpace', 'nowrap');

      // title 支持字符串或 Tag
      if (typeof node.title === 'string') {
        t.text(node.title);
      } else if (node.title) {
        t.child(node.title);
      }
    });
    nodeEl.child(titleEl);

    return nodeEl;
  }

  /**
   * 切换节点展开/收起状态
   * @param {VTreeNode} node - 节点
   * @private
   */
  _toggleExpand(node) {
    const index = this._expandedKeys.indexOf(node.key);
    if (index > -1) {
      this._expandedKeys.splice(index, 1);
    } else {
      this._expandedKeys.push(node.key);
    }

    // 触发 onExpand 事件
    if (this._onExpand) {
      this._onExpand({
        event: event,
        expandedKeys: [...this._expandedKeys],
        target: this
      });
    }

    // 重新渲染
    this._renderTree();
  }

  /**
   * 切换节点勾选状态
   * @param {VTreeNode} node - 节点
   * @private
   */
  _toggleCheck(node) {
    const index = this._checkedKeys.indexOf(node.key);
    if (index > -1) {
      // 取消勾选
      this._checkedKeys.splice(index, 1);
    } else {
      // 勾选
      this._checkedKeys.push(node.key);
    }

    // TODO: 处理级联勾选和半选状态

    // 触发 onCheck 事件
    if (this._onCheck) {
      this._onCheck({
        event: event,
        node: node,
        checkedKeys: [...this._checkedKeys],
        target: this
      });
    }

    // 重新渲染
    this._renderTree();
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

    // 触发 onSelect 事件
    if (this._onSelect) {
      this._onSelect({
        event: nativeEvent,
        node: node,
        selectedKeys: [...this._selectedKeys],
        target: this
      });
    }

    // 重新渲染
    this._renderTree();
  }

  // ============================================
  // 复选框相关方法
  // ============================================

  /**
   * 设置/获取勾选的节点 keys
   * @param {string[]} [value] - keys 数组（不传则返回当前值）
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

  /**
   * 切换勾选状态
   * @param {VTreeNode} node - 节点
   * @private
   */
  _toggleCheck(node) {
    const index = this._checkedKeys.indexOf(node.key);

    if (index > -1) {
      // 取消勾选：取消自身和所有子节点
      this._checkedKeys = this._checkedKeys.filter(k => k !== node.key);
      this._uncheckChildren(node);
    } else {
      // 勾选：勾选自身和所有子节点
      this._checkedKeys.push(node.key);
      this._checkChildren(node);
    }

    // 更新父节点的半选状态
    this._updateParentIndeterminate(node.key);

    // 触发 onCheck 事件
    if (this._onCheck) {
      this._onCheck({
        event: event,
        node: node,
        checkedKeys: [...this._checkedKeys],
        target: this
      });
    }

    // 重新渲染
    this._renderTree();
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
    // 重新计算所有半选状态
    this._calculateIndeterminate(this._data);
  }

  /**
   * 计算半选状态
   * @param {VTreeNode[]} nodes - 节点数组
   * @private
   */
  _calculateIndeterminate(nodes) {
    this._indeterminateKeys = [];
    this._collectIndeterminate(nodes);
  }

  /**
   * 收集半选状态
   * @param {VTreeNode[]} nodes - 节点数组
   * @private
   */
  _collectIndeterminate(nodes) {
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

        this._collectIndeterminate(node.children);
      }
    });
  }
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
    } else if (typeof setup === 'object' && setup !== null) {
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
        backgroundColor: '#fff',
        minWidth: '200px'
      });

      const node = this._findNode(this._data, this._value);
      display.text(node ? (typeof node.title === 'string' ? node.title : '已选择') : this._placeholder);

      display.on('click', (e) => {
        e.stopPropagation();
        this._toggleDropdown();
      });

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
