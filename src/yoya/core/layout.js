/**
 * Yoya.Basic - Layout Components
 * 提供常用布局组件（Flex, Grid, Stack 等）
 * @module Yoya.Layout
 */

import { Tag, div } from './basic.js';

// ============================================
// Flex 布局容器
// ============================================

/**
 * Flex 弹性布局容器
 * @class
 * @extends Tag
 * @example
 * flex(f => {
 *   f.justifyCenter().alignCenter();
 *   f.div('项目 1');
 *   f.div('项目 2');
 * });
 */
class Flex extends Tag {
  /**
   * 创建 Flex 布局容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'flex');
  }

  /**
   * 设置主轴方向为 row
   * @returns {this} 返回当前实例支持链式调用
   */
  row() {
    return this.style('flexDirection', 'row');
  }

  /**
   * 设置主轴方向为 column
   * @returns {this} 返回当前实例支持链式调用
   */
  column() {
    return this.style('flexDirection', 'column');
  }

  /**
   * 设置主轴方向为 row-reverse
   * @returns {this} 返回当前实例支持链式调用
   */
  rowReverse() {
    return this.style('flexDirection', 'row-reverse');
  }

  /**
   * 设置主轴方向为 column-reverse
   * @returns {this} 返回当前实例支持链式调用
   */
  columnReverse() {
    return this.style('flexDirection', 'column-reverse');
  }

  /**
   * 设置主轴对齐方式
   * @param {string} value - justify-content 值
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyContent(value) {
    return this.style('justifyContent', value);
  }

  /**
   * 主轴起点对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyStart() {
    return this.justifyContent('flex-start');
  }

  /**
   * 主轴终点对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyEnd() {
    return this.justifyContent('flex-end');
  }

  /**
   * 主轴居中对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyCenter() {
    return this.justifyContent('center');
  }

  /**
   * 主轴两端对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyBetween() {
    return this.justifyContent('space-between');
  }

  /**
   * 主轴环绕对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyAround() {
    return this.justifyContent('space-around');
  }

  /**
   * 主轴均匀分布
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyEvenly() {
    return this.justifyContent('space-evenly');
  }

  /**
   * 设置交叉轴对齐方式
   * @param {string} value - align-items 值
   * @returns {this} 返回当前实例支持链式调用
   */
  alignItems(value) {
    return this.style('alignItems', value);
  }

  /**
   * 交叉轴起点对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  alignStart() {
    return this.alignItems('flex-start');
  }

  /**
   * 交叉轴终点对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  alignEnd() {
    return this.alignItems('flex-end');
  }

  /**
   * 交叉轴居中对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  alignCenter() {
    return this.alignItems('center');
  }

  /**
   * 交叉轴拉伸（默认）
   * @returns {this} 返回当前实例支持链式调用
   */
  alignStretch() {
    return this.alignItems('stretch');
  }

  /**
   * 交叉轴基线对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  alignBaseline() {
    return this.alignItems('baseline');
  }

  /**
   * 设置换行行为
   * @param {string} [value='wrap'] - flex-wrap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  wrap(value = 'wrap') {
    return this.style('flexWrap', value);
  }

  /**
   * 不换行
   * @returns {this} 返回当前实例支持链式调用
   */
  noWrap() {
    return this.style('flexWrap', 'nowrap');
  }

  /**
   * 设置子元素间距
   * @param {string} value - gap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gap(value) {
    return this.style('gap', value);
  }
}

/**
 * 创建 Flex 布局容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Flex} Flex 实例
 */
function flex(setup = null) {
  return new Flex(setup);
}

// ============================================
// Grid 布局容器
// ============================================

/**
 * Grid 网格布局容器
 * @class
 * @extends Tag
 */
class Grid extends Tag {
  /**
   * 创建 Grid 布局容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'grid');
  }

  /**
   * 设置网格列模板
   * @param {string} value - grid-template-columns 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gridTemplateColumns(value) {
    return this.style('gridTemplateColumns', value);
  }

  /**
   * 设置列数和每列大小
   * @param {number} count - 列数
   * @param {string} [size='1fr'] - 每列大小
   * @returns {this} 返回当前实例支持链式调用
   */
  columns(count, size = '1fr') {
    return this.gridTemplateColumns(`repeat(${count}, ${size})`);
  }

  /**
   * 设置网格行模板
   * @param {string} value - grid-template-rows 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gridTemplateRows(value) {
    return this.style('gridTemplateRows', value);
  }

  /**
   * 设置行数和每行大小
   * @param {number} count - 行数
   * @param {string} [size='1fr'] - 每行大小
   * @returns {this} 返回当前实例支持链式调用
   */
  rows(count, size = '1fr') {
    return this.gridTemplateRows(`repeat(${count}, ${size})`);
  }

  /**
   * 设置列间距
   * @param {string} value - column-gap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  columnGap(value) {
    return this.style('columnGap', value);
  }

  /**
   * 设置行间距
   * @param {string} value - row-gap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  rowGap(value) {
    return this.style('rowGap', value);
  }

  /**
   * 设置间距（行列间距相同）
   * @param {string} value - gap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gap(value) {
    return this.style('gap', value);
  }

  /**
   * 设置主轴对齐方式
   * @param {string} value - justify-content 值
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyContent(value) {
    return this.style('justifyContent', value);
  }

  /**
   * 设置交叉轴对齐方式
   * @param {string} value - align-items 值
   * @returns {this} 返回当前实例支持链式调用
   */
  alignItems(value) {
    return this.style('alignItems', value);
  }

  /**
   * 设置网格区域
   * @param {string} value - grid-area 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gridArea(value) {
    return this.style('gridArea', value);
  }

  /**
   * 添加 div 子元素
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this} 返回当前实例支持链式调用
   */
  div(setup = null) {
    const el = new Tag('div', setup);
    this._children.push(el);
    return this;
  }

  /**
   * 添加响应式网格子元素
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this} 返回当前实例支持链式调用
   */
  responsiveGrid(setup = null) {
    const el = responsiveGrid(setup);
    this._children.push(el);
    return this;
  }
}

/**
 * 创建 Grid 布局容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Grid} Grid 实例
 */
function grid(setup = null) {
  return new Grid(setup);
}

// ============================================
// 响应式 Grid 项
// ============================================

/**
 * 响应式网格容器（自动适应列数）
 * @class
 * @extends Grid
 */
class ResponsiveGrid extends Grid {
  /**
   * 创建响应式网格容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super(setup);
    this.style('gridTemplateColumns', 'repeat(auto-fit, minmax(250px, 1fr))');
  }

  /**
   * 设置最小列宽
   * @param {string} value - 最小宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  minSize(value) {
    return this.style('gridTemplateColumns', `repeat(auto-fit, minmax(${value}, 1fr))`);
  }

  /**
   * 使用 auto-fit 自适应
   * @returns {this} 返回当前实例支持链式调用
   */
  autoFit() {
    return this.style('gridTemplateColumns', 'repeat(auto-fit, minmax(200px, 1fr))');
  }

  /**
   * 使用 auto-fill 填充
   * @returns {this} 返回当前实例支持链式调用
   */
  autoFill() {
    return this.style('gridTemplateColumns', 'repeat(auto-fill, minmax(200px, 1fr))');
  }
}

/**
 * 创建响应式网格容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {ResponsiveGrid} ResponsiveGrid 实例
 */
function responsiveGrid(setup = null) {
  return new ResponsiveGrid(setup);
}

// ============================================
// Stack 堆叠布局
// ============================================

/**
 * Stack 堆叠布局容器（默认垂直）
 * @class
 * @extends Tag
 */
class Stack extends Tag {
  /**
   * 创建 Stack 堆叠容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'flex');
    this.style('flexDirection', 'column');
  }

  /**
   * 设置为水平堆叠
   * @returns {this} 返回当前实例支持链式调用
   */
  horizontal() {
    return this.style('flexDirection', 'row');
  }

  /**
   * 设置子元素间距
   * @param {string} value - gap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gap(value) {
    return this.style('gap', value);
  }

  /**
   * 设置对齐方式
   * @param {string} value - align-items 值
   * @returns {this} 返回当前实例支持链式调用
   */
  align(value) {
    return this.style('alignItems', value);
  }

  /**
   * 设置交叉轴对齐方式
   * @param {string} value - align-items 值
   * @returns {this} 返回当前实例支持链式调用
   */
  alignItems(value) {
    return this.style('alignItems', value);
  }

  /**
   * 设置主轴对齐方式
   * @param {string} value - justify-content 值
   * @returns {this} 返回当前实例支持链式调用
   */
  justify(value) {
    return this.style('justifyContent', value);
  }
}

/**
 * 创建 Stack 堆叠容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Stack} Stack 实例
 */
function stack(setup = null) {
  return new Stack(setup);
}

// ============================================
// HStack 水平堆叠
// ============================================

/**
 * HStack 水平堆叠容器
 * @class
 * @extends Stack
 */
class HStack extends Stack {
  /**
   * 创建 HStack 水平堆叠容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super(setup);
    this.style('flexDirection', 'row');
  }
}

/**
 * 创建 HStack 水平堆叠容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {HStack} HStack 实例
 */
function hstack(setup = null) {
  return new HStack(setup);
}

// ============================================
// VStack 垂直堆叠
// ============================================

/**
 * VStack 垂直堆叠容器
 * @class
 * @extends Stack
 */
/**
 * VStack 垂直堆叠容器
 * @class
 * @extends Stack
 */
class VStack extends Stack {
  /**
   * 创建 VStack 垂直堆叠容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super(setup);
    this.style('flexDirection', 'column');
  }
}

/**
 * 创建 VStack 垂直堆叠容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VStack} VStack 实例
 */
function vstack(setup = null) {
  return new VStack(setup);
}

// ============================================
// Center 居中布局
// ============================================

/**
 * Center 居中布局容器（水平 + 垂直居中）
 * @class
 * @extends Tag
 */
class Center extends Tag {
  /**
   * 创建 Center 居中容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'flex');
    this.style('justifyContent', 'center');
    this.style('alignItems', 'center');
  }

  /**
   * 设置水平居中
   * @returns {this} 返回当前实例支持链式调用
   */
  horizontal() {
    return this.style('justifyContent', 'center');
  }

  /**
   * 设置垂直居中
   * @returns {this} 返回当前实例支持链式调用
   */
  vertical() {
    return this.style('alignItems', 'center');
  }

  /**
   * 设置完全居中（默认）
   * @returns {this} 返回当前实例支持链式调用
   */
  center() {
    return this.style('justifyContent', 'center').style('alignItems', 'center');
  }
}

/**
 * 创建 Center 居中容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Center} Center 实例
 */
function center(setup = null) {
  return new Center(setup);
}

// ============================================
// Spacer 弹性 spacer
// ============================================

/**
 * Spacer 弹性占位组件
 * @class
 * @extends Tag
 */
class Spacer extends Tag {
  /**
   * 创建 Spacer 弹性占位
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('flex', '1');
  }

  /**
   * 设置弹性大小
   * @param {string} value - flex 值
   * @returns {this} 返回当前实例支持链式调用
   */
  size(value) {
    return this.style('flex', value);
  }

  /**
   * 设置宽度
   * @param {string} value - 宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  width(value) {
    return this.style('width', value);
  }

  /**
   * 设置高度
   * @param {string} value - 高度值
   * @returns {this} 返回当前实例支持链式调用
   */
  height(value) {
    return this.style('height', value);
  }
}

/**
 * 创建 Spacer 弹性占位
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Spacer} Spacer 实例
 */
function spacer(setup = null) {
  return new Spacer(setup);
}

// ============================================
// Container 响应式容器
// ============================================

/**
 * Container 响应式容器（最大宽度 1200px，自动居中）
 * @class
 * @extends Tag
 */
class Container extends Tag {
  /**
   * 创建 Container 响应式容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('maxWidth', '1200px');
    this.style('margin', '0 auto');
    this.style('padding', '0 16px');
  }

  /**
   * 设置最大宽度
   * @param {string} value - 最大宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  maxWidth(value) {
    return this.style('maxWidth', value);
  }

  /**
   * 设置内边距
   * @param {string} value - 内边距值
   * @returns {this} 返回当前实例支持链式调用
   */
  padding(value) {
    return this.style('padding', value);
  }

  /**
   * 设置流体布局（100% 宽度）
   * @returns {this} 返回当前实例支持链式调用
   */
  fluid() {
    return this.style('maxWidth', '100%');
  }
}

/**
 * 创建 Container 响应式容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Container} Container 实例
 */
function container(setup = null) {
  return new Container(setup);
}

// ============================================
// Divider 分割线
// ============================================

/**
 * Divider 分割线组件
 * @class
 * @extends Tag
 */
class Divider extends Tag {
  /**
   * 创建 Divider 分割线
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('hr', setup);
    this.style('border', 'none');
    this.style('height', '1px');
    this.style('background', '#e0e0e0');
    this.style('margin', '0');
  }

  /**
   * 设置分割线颜色
   * @param {string} value - 颜色值
   * @returns {this} 返回当前实例支持链式调用
   */
  color(value) {
    return this.style('background', value);
  }

  /**
   * 设置为垂直分割线
   * @returns {this} 返回当前实例支持链式调用
   */
  vertical() {
    return this.style('width', '1px')
      .style('height', 'auto')
      .style('border-right', '1px solid currentColor');
  }

  /**
   * 设置外边距
   * @param {string} value - 外边距值
   * @returns {this} 返回当前实例支持链式调用
   */
  margin(value) {
    return this.style('margin', value);
  }
}

/**
 * 创建 Divider 分割线
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Divider} Divider 实例
 */
function divider(setup = null) {
  return new Divider(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 flex 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.flex = function(setup = null) {
  const el = flex(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 grid 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.grid = function(setup = null) {
  const el = grid(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 responsiveGrid 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.responsiveGrid = function(setup = null) {
  const el = responsiveGrid(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 stack 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.stack = function(setup = null) {
  const el = stack(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 hstack 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.hstack = function(setup = null) {
  const el = hstack(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vstack 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vstack = function(setup = null) {
  const el = vstack(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 center 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.center = function(setup = null) {
  const el = center(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 spacer 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.spacer = function(setup = null) {
  const el = spacer(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 container 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.container = function(setup = null) {
  const el = container(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 divider 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.divider = function(setup = null) {
  const el = divider(setup);
  this.child(el);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  // 类
  Flex, Grid, ResponsiveGrid,
  Stack, HStack, VStack,
  Center, Spacer, Container,
  Divider,

  // 工厂函数
  flex, grid, responsiveGrid,
  stack, hstack, vstack,
  center, spacer, container,
  divider
};
