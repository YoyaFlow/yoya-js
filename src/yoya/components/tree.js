/**
 * Yoya.Basic - Tree Components
 * 树形组件：提供 VTree 基础树和 VTreeSelect 树形选择器
 * 基于虚拟元素架构，遵循状态集中存储、回调解耦原则
 * @module Yoya.Tree
 */

import { Tag, div, span, input } from '../core/basic.js';

// ============================================
// VTreeNode 树节点组件
// ============================================

/**
 * VTreeNode 树节点组件
 * 作为展示层，状态由 VTree 容器同步，事件通过 handlers 上报
 * @class
 * @extends Tag
 */
class VTreeNode extends Tag {
  /**
   * 创建 VTreeNode 实例
   * @param {Object} options - 配置选项
   * @param {Object} options.data - 节点数据
   * @param {number} options.level - 节点层级
   * @param {Object} options.handlers - 回调函数集合
   * @param {boolean} options.checkable - 是否显示复选框
   * @param {boolean} options.singleSelectMode - 是否单选模式
   */
  constructor({
    data,
    level,
    handlers,
    checkable = false,
    singleSelectMode = true
  }) {
    super('div', null);

    // 存储配置参数
    this._data = data;
    this._level = level;
    this._handlers = handlers;
    this._checkable = checkable;
    this._singleSelectMode = singleSelectMode;

    // 展示状态（仅用于 UI 渲染，由容器同步）
    this._expanded = false;
    this._checked = false;
    this._selected = false;
    this._indeterminate = false;
    this._disabled = data.disabled === true;

    // 子元素缓存容器
    this._nodeContentBox = null;
    this._subNodesBox = null;
    this._expandIconBox = null;
    this._placeholderBox = null;
    this._checkboxBox = null;
    this._titleBox = null;

    // 设置根元素类名和布局
    this.addClass('yoya-tree__node');
    this.styles({
      display: 'flex',
      flexDirection: 'column'
    });

    // 初始化内部结构
    this._initialize();
  }

  /**
   * 初始化内部虚拟元素结构
   * 遵循创建过程一致性原则：创建特定子元素并通过 _children.push() 添加
   */
  _initialize() {
    // 1. 创建 nodeContent 容器（操作区域）
    this._nodeContentBox = div(nodeContent => {
      nodeContent.addClass('yoya-tree__node-content');
      nodeContent.styles({
        display: 'flex',
        alignItems: 'center',
        flex: '1',
        minWidth: 0,
        overflow: 'hidden',
        // 根据层级添加缩进
        paddingLeft: `${this._level * 20}px`
      });

      // 按顺序添加子元素
      this._buildExpandIcon(nodeContent);
      this._buildCheckbox(nodeContent);
      this._buildTitle(nodeContent);
    });

    // 2. 创建 subNodes 容器（子节点容器 + 缩进）
    this._subNodesBox = div(subNodes => {
      subNodes.addClass('yoya-tree__subnodes');
      // 缩进在 subNodes 上通过 padding-left 处理
      subNodes.style('padding-left', `${this._level * 20}px`);
    });

    // 3. 将两个容器按顺序添加到 _children（基石原则）
    this._children.push(this._nodeContentBox);
    this._children.push(this._subNodesBox);

    // 4. 在根元素上绑定点击事件（用于选中节点）
    if (!this._disabled) {
      this.onClick((context) => {
        // 阻止事件冒泡
        context.event.stopPropagation();

        this._handlers.onToggleSelect({
          event: context.event,
          target: this,
          node: this._data,
          key: this._data.key,
          value: !this._selected,
          oldValue: this._selected
        });
      });
    }

    // 5. 如果有子节点数据，创建子 VTreeNode 实例
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

  /**
   * 构建展开/收起图标
   * @param {Tag} parent - 父容器
   */
  _buildExpandIcon(parent) {
    const hasChildren = this._data.children && this._data.children.length > 0;

    if (hasChildren) {
      this._expandIconBox = span(icon => {
        icon.addClass('yoya-tree__icon');
        icon.styles({
          width: '16px',
          height: '16px',
          flexShrink: '0',
          marginRight: '4px',
          fontSize: '10px',
          lineHeight: '16px',
          textAlign: 'center',
          userSelect: 'none',
          cursor: 'pointer',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        });
        icon.textContent(this._expanded ? '▼' : '▶');

        // 点击展开/收起 - 使用 onClick 获得统一事件格式
        icon.onClick((context) => {
          context.event.stopPropagation();

          this._handlers.onToggleExpand({
            event: context.event,
            target: this,
            node: this._data,
            key: this._data.key,
            value: !this._expanded,
            oldValue: this._expanded
          });
        });
      });
    } else {
      // 叶子节点占位
      this._placeholderBox = span(placeholder => {
        placeholder.addClass('yoya-tree__placeholder');
        placeholder.styles({
          width: '16px',
          height: '16px',
          flexShrink: '0',
          marginRight: '4px'
        });
      });
    }

    parent.child(this._expandIconBox || this._placeholderBox);
  }

  /**
   * 构建复选框
   * @param {Tag} parent - 父容器
   */
  _buildCheckbox(parent) {
    if (!this._checkable) return;

    this._checkboxBox = input(checkbox => {
      checkbox.type('checkbox');
      checkbox.addClass('yoya-tree__checkbox');
      checkbox.style('marginRight', '8px');
      checkbox.prop('checked', this._checked);
      checkbox.prop('indeterminate', this._indeterminate);

      if (this._disabled) {
        checkbox.prop('disabled', true);
      }

      // 点击复选框 - 使用 onClick 获得统一事件格式
      checkbox.onClick((context) => {
        context.event.stopPropagation();

        this._handlers.onToggleCheck({
          event: context.event,
          target: this,
          node: this._data,
          key: this._data.key,
          value: !this._checked,
          oldValue: this._checked
        });
      });
    });

    parent.child(this._checkboxBox);
  }

  /**
   * 构建节点标题
   * @param {Tag} parent - 父容器
   */
  _buildTitle(parent) {
    this._titleBox = span(title => {
      title.addClass('yoya-tree__title');
      title.styles({
        flex: '1',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        cursor: this._disabled ? 'not-allowed' : 'pointer'
      });

      // title 支持字符串或 Tag
      if (typeof this._data.title === 'string') {
        title.text(this._data.title);
      } else if (this._data.title) {
        title.child(this._data.title);
      }
    });

    parent.child(this._titleBox);
  }

  /**
   * 设置展开状态（由容器同步时调用，不触发回调）
   * @param {boolean} expanded - 是否展开
   */
  setExpanded(expanded) {
    // 总是同步状态和 UI，即使值相同（确保初始状态正确）
    this._expanded = expanded;

    // 更新图标 - 使用 textContent() 替换而不是追加
    if (this._expandIconBox) {
      this._expandIconBox.textContent(expanded ? '▼' : '▶');
    }

    // 控制子节点容器的显示/隐藏
    if (this._subNodesBox) {
      if (expanded) {
        this._subNodesBox.style('display', '');
      } else {
        this._subNodesBox.style('display', 'none');
      }
    }
  }

  /**
   * 设置勾选状态（由容器同步时调用，不触发回调）
   * @param {boolean} checked - 是否勾选
   */
  setChecked(checked) {
    if (this._checked === checked) return;
    this._checked = checked;

    // 更新复选框
    if (this._checkboxBox) {
      this._checkboxBox.prop('checked', checked);
    }
  }

  /**
   * 设置半选状态（由容器同步时调用，不触发回调）
   * @param {boolean} indeterminate - 是否半选
   */
  setIndeterminate(indeterminate) {
    if (this._indeterminate === indeterminate) return;
    this._indeterminate = indeterminate;

    // 更新复选框
    if (this._checkboxBox) {
      this._checkboxBox.prop('indeterminate', indeterminate);
    }
  }

  /**
   * 设置选中状态（由容器同步时调用，不触发回调）
   * @param {boolean} selected - 是否选中
   */
  setSelected(selected) {
    if (this._selected === selected) return;
    this._selected = selected;

    // 更新选中状态类名，使用CSS变量控制样式
    if (this._nodeContentBox) {
      if (selected) {
        this._nodeContentBox.addClass('yoya-tree__node-content--selected');
      } else {
        this._nodeContentBox.removeClass('yoya-tree__node-content--selected');
      }
    }
  }

  /**
   * 设置禁用状态
   * @param {boolean} disabled - 是否禁用
   */
  setDisabled(disabled) {
    if (this._disabled === disabled) return;
    this._disabled = disabled;

    // 更新样式
    if (this._titleBox) {
      this._titleBox.style('cursor', disabled ? 'not-allowed' : 'pointer');
    }
    if (this._checkboxBox) {
      this._checkboxBox.prop('disabled', disabled);
    }
  }

  /**
   * 获取节点 key
   * @returns {string}
   */
  getKey() {
    return this._data.key;
  }

  /**
   * 获取节点数据
   * @returns {Object}
   */
  getData() {
    return this._data;
  }

  /**
   * 获取节点层级
   * @returns {number}
   */
  getLevel() {
    return this._level;
  }

  /**
   * 销毁节点（标记删除）
   */
  destroy() {
    this._deleted = true;

    // 递归标记子节点
    if (this._subNodesBox && this._subNodesBox._children) {
      this._subNodesBox._children.forEach(childNode => {
        if (childNode instanceof VTreeNode) {
          childNode.destroy();
        }
      });
    }
  }
}

// ============================================
// VTree 容器组件
// ============================================

/**
 * VTree 容器组件
 * 负责状态管理（集中存储）和事件处理
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

    // 状态集中存储（使用 Set 便于快速查找）
    this._expandedKeys = new Set();
    this._checkedKeys = new Set();
    this._selectedKeys = new Set();
    this._indeterminateKeys = new Set();

    // 配置
    this._data = [];
    this._checkable = false;
    this._singleSelectMode = true;

    // 事件回调
    this._onSelect = null;
    this._onCheck = null;
    this._onExpand = null;

    // 节点缓存
    this._nodes = [];

    // 回调函数集合 - 传递给子节点
    this._handlers = {
      onToggleExpand: (context) => this._handleToggleExpand(context),
      onToggleCheck: (context) => this._handleToggleCheck(context),
      onToggleSelect: (context) => this._handleToggleSelect(context)
    };

    // 设置基础 CSS 类
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
      // 先设置状态相关的配置，再设置 data
      if (setup.expandedKeys) this.expandedKeys(setup.expandedKeys);
      if (setup.checkedKeys) this.checkedKeys(setup.checkedKeys);
      if (setup.selectedKeys) this.selectedKeys(setup.selectedKeys);
      if (setup.data) this.data(setup.data);
      if (setup.checkable) this.checkable(setup.checkable);
    }
    return this;
  }

  // ============================================
  // 数据配置方法
  // ============================================

  /**
   * 设置树形数据并渲染
   * @param {Object[]} [value] - 不传则返回当前值
   * @returns {this|Object[]}
   */
  data(value) {
    if (value === undefined) return this._data;
    this._data = value;
    this._buildTree();
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
    if (this._nodes.length > 0) {
      this._buildTree();
    }
    return this;
  }

  /**
   * 设置单选/多选模式
   * @param {boolean} [value] - true 为单选，false 为多选
   * @returns {this|boolean}
   */
  singleSelectMode(value) {
    if (value === undefined) return this._singleSelectMode;
    this._singleSelectMode = value;
    return this;
  }

  /**
   * 设置多选模式（保留向后兼容）
   * @param {boolean} [value] - 不传则返回当前值
   * @returns {this|boolean}
   */
  multiple(value) {
    if (value === undefined) return !this._singleSelectMode;
    this._singleSelectMode = !value;
    return this;
  }

  // ============================================
  // 节点状态方法（getter/setter 双重模式）
  // ============================================

  /**
   * 设置/获取展开的节点 keys
   * @param {string[]} [value] - keys 数组（不传则返回当前值）
   * @returns {this|string[]}
   */
  expandedKeys(value) {
    if (value === undefined) return [...this._expandedKeys];
    this._expandedKeys = new Set(value);
    // 如果已经有节点，同步状态；否则等待 data() 构建树后同步
    if (this._nodes.length > 0) {
      this._syncNodesState();
    }
    return this;
  }

  /**
   * 设置/获取勾选的节点 keys
   * @param {string[]} [value] - keys 数组（不传则返回当前值）
   * @returns {this|string[]}
   */
  checkedKeys(value) {
    if (value === undefined) return [...this._checkedKeys];
    this._checkedKeys = new Set(value);
    // 计算级联勾选（包括父节点）
    this._calculateCheckedKeys();
    this._calculateIndeterminateKeys();
    // 如果已经有节点，同步状态；否则等待 data() 构建树后同步
    if (this._nodes.length > 0) {
      this._syncNodesState();
    }
    return this;
  }

  /**
   * 设置/获取选中的节点 keys
   * @param {string[]} [value] - keys 数组（不传则返回当前值）
   * @returns {this|string[]}
   */
  selectedKeys(value) {
    if (value === undefined) return [...this._selectedKeys];
    this._selectedKeys = new Set(value);
    this._syncNodesState();
    return this;
  }

  /**
   * 获取半选的节点 keys
   * @returns {string[]}
   */
  indeterminateKeys() {
    return [...this._indeterminateKeys];
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
    this._expandedKeys = new Set(this._getAllKeys(this._data));
    this._syncNodesState();
    return this;
  }

  /**
   * 收起所有节点
   * @returns {this}
   */
  collapseAll() {
    this._expandedKeys.clear();
    this._syncNodesState();
    return this;
  }

  /**
   * 获取所有节点的 keys
   * @param {Object[]} nodes - 节点数组
   * @returns {string[]}
   * @private
   */
  _getAllKeys(nodes) {
    const keys = [];
    const traverse = (nodeList) => {
      nodeList.forEach(node => {
        keys.push(node.key);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return keys;
  }

  /**
   * 查找节点
   * @param {string} key - 节点 key
   * @returns {VTreeNode|null}
   */
  findNode(key) {
    return this._findNode(this._nodes, key);
  }

  /**
   * 获取节点状态
   * @param {string} key - 节点 key
   * @returns {Object|null}
   */
  getNodeState(key) {
    const node = this.findNode(key);
    if (!node) return null;

    return {
      key,
      data: node.getData(),
      expanded: this._expandedKeys.has(key),
      checked: this._checkedKeys.has(key),
      selected: this._selectedKeys.has(key),
      indeterminate: this._indeterminateKeys.has(key)
    };
  }

  // ============================================
  // 树形构建方法（遵循 _children 基石原则）
  // ============================================

  /**
   * 构建树形结构
   * 遵循 _children 基石原则：不清空重建，使用标记删除
   * @private
   */
  _buildTree() {
    // 1. 标记旧节点为删除
    this._markAllDeleted(this._nodes);

    // 2. 创建或更新 list 容器
    if (!this._listBox) {
      this._listBox = div(list => {
        list.addClass('yoya-tree__list');
        list.styles({
          listStyle: 'none',
          margin: '0',
          padding: '0'
        });
      });
      this._children.push(this._listBox);
    }

    // 3. 构建新节点
    this._nodes = this._buildNodes(this._data, 0);

    // 4. 清空 list 的 _children 并添加新节点
    this._listBox._children = [];
    this._nodes.forEach(node => {
      this._listBox._children.push(node);
    });

    // 5. 同步状态到节点
    this._syncNodesState();

    // 6. 如果已渲染，触发更新
    if (this._el && this._el.isConnected) {
      this.renderDom();
    }
  }

  /**
   * 标记所有节点为删除
   * @param {VTreeNode[]} nodes - 节点数组
   * @private
   */
  _markAllDeleted(nodes) {
    nodes.forEach(node => {
      if (node instanceof VTreeNode) {
        node.destroy();
      }
    });
  }

  /**
   * 递归构建节点
   * @param {Object[]} nodesData - 节点数据数组
   * @param {number} level - 当前层级
   * @returns {VTreeNode[]}
   * @private
   */
  _buildNodes(nodesData, level) {
    return nodesData.map(nodeData => {
      return new VTreeNode({
        data: nodeData,
        level,
        handlers: this._handlers,
        checkable: this._checkable || nodeData.checkable,
        singleSelectMode: this._singleSelectMode
      });
    });
  }

  // ============================================
  // 状态同步方法
  // ============================================

  /**
   * 同步所有节点的状态
   */
  _syncNodesState() {
    this._traverseNodes(this._nodes, node => {
      const key = node.getKey();
      node.setExpanded(this._expandedKeys.has(key));
      node.setChecked(this._checkedKeys.has(key));
      node.setIndeterminate(this._indeterminateKeys.has(key));
      node.setSelected(this._selectedKeys.has(key));
    });
  }

  /**
   * 遍历节点
   * @param {VTreeNode[]} nodes - 节点数组
   * @param {Function} fn - 遍历函数
   * @private
   */
  _traverseNodes(nodes, fn) {
    nodes.forEach(node => {
      fn(node);
      if (node._subNodesBox && node._subNodesBox._children) {
        this._traverseNodes(node._subNodesBox._children, fn);
      }
    });
  }

  // ============================================
  // 事件处理方法（统一事件结构）
  // ============================================

  /**
   * 处理切换展开状态
   * @param {Object} context - 统一事件对象
   */
  _handleToggleExpand(context) {
    const { event, key, value } = context;

    if (value) {
      this._expandedKeys.add(key);
    } else {
      this._expandedKeys.delete(key);
    }

    // 同步到节点
    const node = this._findNode(this._nodes, key);
    if (node) {
      node.setExpanded(value);
    }

    // 触发用户回调 - 使用统一事件格式
    if (this._onExpand) {
      // 创建包装后的事件对象，确保 target 是 VTree 实例
      const wrappedEvent = {
        ...event,
        target: this,
        _originalTarget: event.target
      };

      this._onExpand({
        event: wrappedEvent,
        node: this._getNodeData(key),
        expandedKeys: [...this._expandedKeys],
        target: this
      });
    }
  }

  /**
   * 处理切换勾选状态
   * @param {Object} context - 统一事件对象
   */
  _handleToggleCheck(context) {
    const { event, key, value, node: nodeData } = context;

    if (value) {
      // 勾选：添加自身和所有子节点
      this._checkedKeys.add(key);
      this._addAllChildren(nodeData);
    } else {
      // 取消勾选：移除自身和所有子节点
      this._checkedKeys.delete(key);
      this._removeAllChildren(nodeData);
    }

    // 计算级联勾选（包括父节点）
    this._calculateCheckedKeys();
    // 重新计算半选状态
    this._calculateIndeterminateKeys();

    // 同步所有节点状态
    this._syncNodesState();

    // 触发用户回调 - 使用统一事件格式
    if (this._onCheck) {
      // 创建包装后的事件对象，确保 target 是 VTree 实例
      const wrappedEvent = {
        ...event,
        target: this,
        _originalTarget: event.target
      };

      this._onCheck({
        event: wrappedEvent,
        node: nodeData,
        checked: value,
        checkedKeys: [...this._checkedKeys],
        target: this
      });
    }
  }

  /**
   * 处理切换选中状态
   * @param {Object} context - 统一事件对象
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
      // 创建包装后的事件对象，确保 target 是 VTree 实例
      const wrappedEvent = {
        ...event,
        target: this,
        _originalTarget: event.target
      };

      this._onSelect({
        event: wrappedEvent,
        node: this._getNodeData(key),
        selectedKeys: [...this._selectedKeys],
        target: this
      });
    }
  }

  // ============================================
  // 级联勾选辅助方法
  // ============================================

  /**
   * 添加所有子节点到 checkedKeys
   * @param {Object} nodeData - 节点数据
   * @private
   */
  _addAllChildren(nodeData) {
    if (nodeData.children) {
      nodeData.children.forEach(child => {
        this._checkedKeys.add(child.key);
        this._addAllChildren(child);
      });
    }
  }

  /**
   * 移除所有子节点从 checkedKeys
   * @param {Object} nodeData - 节点数据
   * @private
   */
  _removeAllChildren(nodeData) {
    if (nodeData.children) {
      nodeData.children.forEach(child => {
        this._checkedKeys.delete(child.key);
        this._removeAllChildren(child);
      });
    }
  }

  /**
   * 计算半选状态
   */
  _calculateIndeterminateKeys() {
    this._indeterminateKeys.clear();
    this._collectIndeterminateKeys(this._data);
  }

  /**
   * 计算级联勾选（当所有子节点被勾选时，自动勾选父节点）
   */
  _calculateCheckedKeys() {
    const newCheckedKeys = new Set();
    this._collectCheckedKeys(this._data, newCheckedKeys);
    this._checkedKeys = newCheckedKeys;
  }

  /**
   * 递归收集勾选状态（包括自动勾选的父节点）
   * @param {Object[]} nodes - 节点数组
   * @param {Set} result - 结果集合
   * @private
   */
  _collectCheckedKeys(nodes, result) {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        // 先处理子节点
        this._collectCheckedKeys(node.children, result);

        // 检查所有子节点是否都被勾选（使用 this._checkedKeys 检查）
        const allChildrenChecked = node.children.length > 0 &&
          node.children.every(c => this._checkedKeys.has(c.key));

        // 如果所有子节点都被勾选，自动勾选父节点
        if (allChildrenChecked) {
          result.add(node.key);
        } else if (this._checkedKeys.has(node.key)) {
          // 如果父节点本身在 checkedKeys 中，保留
          result.add(node.key);
        }
      } else if (this._checkedKeys.has(node.key)) {
        // 叶子节点，如果在 checkedKeys 中，保留
        result.add(node.key);
      }
    });
  }

  /**
   * 收集半选状态
   * @param {Object[]} nodes - 节点数组
   * @private
   */
  _collectIndeterminateKeys(nodes) {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        // 先递归处理子节点，确保子节点的半选状态已经计算
        this._collectIndeterminateKeys(node.children);

        // 再检查当前节点
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
      }
    });
  }

  // ============================================
  // 辅助方法
  // ============================================

  /**
   * 查找节点
   * @param {VTreeNode[]} nodes - 节点数组
   * @param {string} key - 节点 key
   * @returns {VTreeNode|null}
   * @private
   */
  _findNode(nodes, key) {
    for (const node of nodes) {
      if (node.getKey() === key) return node;
      if (node._subNodesBox && node._subNodesBox._children) {
        const found = this._findNode(node._subNodesBox._children, key);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * 获取节点数据
   * @param {string} key - 节点 key
   * @returns {Object|null}
   * @private
   */
  _getNodeData(key) {
    const findData = (nodes) => {
      for (const node of nodes) {
        if (node.key === key) return node;
        if (node.children) {
          const found = findData(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findData(this._data);
  }

  /**
   * 清理已删除的节点
   */
  _cleanupDeleted() {
    if (this._listBox) {
      this._listBox._children = this._listBox._children.filter(
        child => !child._deleted
      );
    }
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
    this._triggerEl = null;

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
   * @param {Object[]} value
   * @returns {this}
   */
  data(value) {
    this._data = value;
    if (this._treeEl) {
      this._treeEl.data(value);
    }
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
    if (this._treeEl) {
      this._treeEl.selectedKeys([this._value]);
    }
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
   * 设置/获取宽度
   * @param {number|string} [value]
   * @returns {this|number|string}
   */
  width(value) {
    if (value === undefined) return this._width;
    this._width = value;
    this.style('width', typeof value === 'number' ? `${value}px` : value);
    return this;
  }

  /**
   * 设置自定义触发元素
   * @param {Tag} [value]
   * @returns {this}
   */
  trigger(value) {
    this._triggerEl = value;
    return this;
  }

  /**
   * 渲染选择器
   * @private
   */
  _renderSelect() {
    // 使用标记删除策略
    this._children.forEach(child => child.destroy());
    this._children = [];

    // 显示框（支持自定义触发元素）
    const displayEl = this._triggerEl || div(display => {
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
    });

    displayEl.on('click', (e) => {
      e.stopPropagation();
      this._toggleDropdown();
    });

    this._children.push(displayEl);

    // 下拉面板
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
      });

      // 创建或复用 VTree 实例
      if (!this._treeEl) {
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
      } else {
        this._treeEl.selectedKeys([this._value]);
      }

      dropdownEl.child(this._treeEl);
      this._children.push(dropdownEl);
    }
  }

  /**
   * 查找节点
   * @param {Object[]} nodes
   * @param {string} key
   * @returns {Object|null}
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
