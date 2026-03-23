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

declare class VTree extends Tag {
  constructor(setup?: Setup<VTree>);
  setup(setup: Setup<VTree> | Record<string, any>): this;
  data(value: VTreeNode[]): this;
  checkable(value?: boolean): this | boolean;
}

declare function vTree(setup?: Setup<VTree>): VTree;

// ============================================
// 导出
// ============================================

export { VTree, vTree };
