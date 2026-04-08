/**
 * Yoya.Basic - Tree Components Type Declarations
 * 基于虚拟元素架构，遵循状态集中存储、回分解耦原则
 */

import { Tag, Setup } from '../core/basic';

// ============================================
// VTreeNode 树节点数据结构
// ============================================

export interface VTreeNode {
  key: string;
  title?: string | Tag;
  label?: string;
  children?: VTreeNode[];
  disabled?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  icon?: string | Tag;
  isLeaf?: boolean;
  data?: Record<string, any>;
  [key: string]: any;
}

// ============================================
// VTree 基础树组件
// ============================================

/**
 * VTree 内部回调事件对象（VTreeNode → VTree）
 * 统一事件结构
 */
export interface VTreeInternalEvent {
  event: Event;
  target: any;  // VTreeNode 实例
  node: VTreeNode;
  key: string;
  value?: any;
  oldValue?: any;
}

/**
 * VTree 节点选中事件对象（VTree → 用户）
 */
export interface VTreeSelectEvent {
  event: Event;
  node: VTreeNode;
  selectedKeys: string[];
  target: VTree;
}

/**
 * VTree 节点勾选事件对象（VTree → 用户）
 */
export interface VTreeCheckEvent {
  event: Event;
  node: VTreeNode;
  checked: boolean;
  checkedKeys: string[];
  target: VTree;
}

/**
 * VTree 节点展开事件对象（VTree → 用户）
 */
export interface VTreeExpandEvent {
  event: Event;
  node: VTreeNode;
  expandedKeys: string[];
  target: VTree;
}

/**
 * VTree 节点状态
 */
export interface VTreeNodeState {
  key: string;
  data: VTreeNode;
  expanded: boolean;
  checked: boolean;
  selected: boolean;
  indeterminate: boolean;
}

declare class VTree extends Tag {
  constructor(setup?: Setup<VTree>);
  setup(setup: Setup<VTree> | Record<string, any>): this;

  // 数据配置方法
  data(value?: VTreeNode[]): this | VTreeNode[];
  checkable(value?: boolean): this | boolean;
  multiple(value?: boolean): this | boolean;  // 向后兼容，始终多选
  singleSelectMode(value?: boolean): this | boolean;

  // 节点状态方法
  expandedKeys(value?: string[]): this | string[];
  checkedKeys(value?: string[]): this | string[];
  selectedKeys(value?: string[]): this | string[];
  indeterminateKeys(): string[];

  // 事件绑定方法
  onSelect(handler: (e: VTreeSelectEvent) => void): this;
  onCheck(handler: (e: VTreeCheckEvent) => void): this;
  onExpand(handler: (e: VTreeExpandEvent) => void): this;

  // 操作方法
  expandAll(): this;
  collapseAll(): this;
  findNode(key: string): any | null;  // 返回 VTreeNode 或 null
  getNodeState(key: string): VTreeNodeState | null;
}

declare function vTree(setup?: Setup<VTree>): VTree;

// ============================================
// VTreeSelect 树形选择器
// ============================================

/**
 * VTreeSelect 选择变化事件对象
 */
export interface VTreeSelectChangeEvent {
  event: Event;
  value: string;
  node: VTreeNode;
  target: VTreeSelect;
}

declare class VTreeSelect extends Tag {
  constructor(setup?: Setup<VTreeSelect>);
  setup(setup: Setup<VTreeSelect> | Record<string, any>): this;

  // 数据配置方法
  data(value?: VTreeNode[]): this;
  placeholder(value?: string): this | string;
  value(value?: string): this | string;
  width(value?: number | string): this | number | string;
  trigger(value?: Tag): this;

  // 事件绑定方法
  onChange(handler: (e: VTreeSelectChangeEvent) => void): this;
}

declare function vTreeSelect(setup?: Setup<VTreeSelect>): VTreeSelect;

// ============================================
// 导出
// ============================================

export { VTree, vTree, VTreeSelect, vTreeSelect };
