/**
 * Yoya.Basic - Tree Components Type Declarations
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
 * VTree 节点选中事件对象
 */
export interface VTreeSelectEvent {
  event: MouseEvent;
  node: VTreeNode;
  selectedKeys: string[];
  target: VTree;
}

/**
 * VTree 节点勾选事件对象
 */
export interface VTreeCheckEvent {
  event: Event;
  node: VTreeNode;
  checkedKeys: string[];
  target: VTree;
}

/**
 * VTree 节点展开事件对象
 */
export interface VTreeExpandEvent {
  event: Event;
  expandedKeys: string[];
  target: VTree;
}

declare class VTree extends Tag {
  constructor(setup?: Setup<VTree>);
  setup(setup: Setup<VTree> | Record<string, any>): this;

  // 数据配置方法
  data(value?: VTreeNode[]): this | VTreeNode[];
  checkable(value?: boolean): this | boolean;
  multiple(value?: boolean): this | boolean;  // 向后兼容，始终多选

  // 节点状态方法
  expandedKeys(value?: string[]): this | string[];
  checkedKeys(value?: string[]): this | string[];
  selectedKeys(value?: string[]): this | string[];

  // 事件绑定方法
  onSelect(handler: (e: VTreeSelectEvent) => void): this;
  onCheck(handler: (e: VTreeCheckEvent) => void): this;
  onExpand(handler: (e: VTreeExpandEvent) => void): this;

  // 操作方法
  expandAll(): this;
  collapseAll(): this;
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
