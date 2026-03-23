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
  // 操作方法（占位，后续 Task 实现）
  // ============================================

  /**
   * 展开所有节点
   * @returns {this}
   */
  expandAll() {
    // TODO: 后续实现
    return this;
  }

  /**
   * 收起所有节点
   * @returns {this}
   */
  collapseAll() {
    // TODO: 后续实现
    return this;
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
// 导出
// ============================================

export { VTree, vTree };
