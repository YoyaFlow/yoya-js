/**
 * Yoya.Basic - Layout Components
 * 提供常用布局组件
 */

import { Tag, div } from './basic.js';

// ============================================
// Flex 布局容器
// ============================================

class Flex extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'flex');
  }

  // 主轴方向
  row() {
    return this.style('flexDirection', 'row');
  }

  column() {
    return this.style('flexDirection', 'column');
  }

  rowReverse() {
    return this.style('flexDirection', 'row-reverse');
  }

  columnReverse() {
    return this.style('flexDirection', 'column-reverse');
  }

  // 主轴对齐
  justifyContent(value) {
    return this.style('justifyContent', value);
  }

  justifyStart() {
    return this.justifyContent('flex-start');
  }

  justifyEnd() {
    return this.justifyContent('flex-end');
  }

  justifyCenter() {
    return this.justifyContent('center');
  }

  justifyBetween() {
    return this.justifyContent('space-between');
  }

  justifyAround() {
    return this.justifyContent('space-around');
  }

  justifyEvenly() {
    return this.justifyContent('space-evenly');
  }

  // 交叉轴对齐
  alignItems(value) {
    return this.style('alignItems', value);
  }

  alignStart() {
    return this.alignItems('flex-start');
  }

  alignEnd() {
    return this.alignItems('flex-end');
  }

  alignCenter() {
    return this.alignItems('center');
  }

  alignStretch() {
    return this.alignItems('stretch');
  }

  alignBaseline() {
    return this.alignItems('baseline');
  }

  // 换行
  wrap(value = 'wrap') {
    return this.style('flexWrap', value);
  }

  noWrap() {
    return this.style('flexWrap', 'nowrap');
  }

  // 子元素间距
  gap(value) {
    return this.style('gap', value);
  }
}

function flex(setup = null) {
  return new Flex(setup);
}

// ============================================
// Grid 布局容器
// ============================================

class Grid extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'grid');
  }

  // 定义列
  gridTemplateColumns(value) {
    return this.style('gridTemplateColumns', value);
  }

  columns(count, size = '1fr') {
    return this.gridTemplateColumns(`repeat(${count}, ${size})`);
  }

  // 定义行
  gridTemplateRows(value) {
    return this.style('gridTemplateRows', value);
  }

  rows(count, size = '1fr') {
    return this.gridTemplateRows(`repeat(${count}, ${size})`);
  }

  // 列间距
  columnGap(value) {
    return this.style('columnGap', value);
  }

  // 行间距
  rowGap(value) {
    return this.style('rowGap', value);
  }

  // 间距
  gap(value) {
    return this.style('gap', value);
  }

  // 主轴对齐
  justifyContent(value) {
    return this.style('justifyContent', value);
  }

  // 交叉轴对齐
  alignItems(value) {
    return this.style('alignItems', value);
  }

  // 网格区域
  gridArea(value) {
    return this.style('gridArea', value);
  }

  // 子元素工厂方法
  div(setup = null) {
    const el = new Tag('div', setup);
    this._children.push(el);
    return this;
  }

  responsiveGrid(setup = null) {
    const el = responsiveGrid(setup);
    this._children.push(el);
    return this;
  }
}

function grid(setup = null) {
  return new Grid(setup);
}

// ============================================
// 响应式 Grid 项
// ============================================

class ResponsiveGrid extends Grid {
  constructor(setup = null) {
    super(setup);
    this.style('gridTemplateColumns', 'repeat(auto-fit, minmax(250px, 1fr))');
  }

  minSize(value) {
    return this.style('gridTemplateColumns', `repeat(auto-fit, minmax(${value}, 1fr))`);
  }

  autoFit() {
    return this.style('gridTemplateColumns', 'repeat(auto-fit, minmax(200px, 1fr))');
  }

  autoFill() {
    return this.style('gridTemplateColumns', 'repeat(auto-fill, minmax(200px, 1fr))');
  }
}

function responsiveGrid(setup = null) {
  return new ResponsiveGrid(setup);
}

// ============================================
// Stack 堆叠布局
// ============================================

class Stack extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'flex');
    this.style('flexDirection', 'column');
  }

  // 水平堆叠
  horizontal() {
    return this.style('flexDirection', 'row');
  }

  // 间距
  gap(value) {
    return this.style('gap', value);
  }

  // 对齐
  align(value) {
    return this.style('alignItems', value);
  }

  alignItems(value) {
    return this.style('alignItems', value);
  }

  justify(value) {
    return this.style('justifyContent', value);
  }
}

function stack(setup = null) {
  return new Stack(setup);
}

// ============================================
// HStack 水平堆叠
// ============================================

class HStack extends Stack {
  constructor(setup = null) {
    super(setup);
    this.style('flexDirection', 'row');
  }
}

function hstack(setup = null) {
  return new HStack(setup);
}

// ============================================
// VStack 垂直堆叠
// ============================================

class VStack extends Stack {
  constructor(setup = null) {
    super(setup);
    this.style('flexDirection', 'column');
  }
}

function vstack(setup = null) {
  return new VStack(setup);
}

// ============================================
// Center 居中布局
// ============================================

class Center extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'flex');
    this.style('justifyContent', 'center');
    this.style('alignItems', 'center');
  }

  // 水平居中
  horizontal() {
    return this.style('justifyContent', 'center');
  }

  // 垂直居中
  vertical() {
    return this.style('alignItems', 'center');
  }

  // 完全居中（默认）
  center() {
    return this.style('justifyContent', 'center').style('alignItems', 'center');
  }
}

function center(setup = null) {
  return new Center(setup);
}

// ============================================
// Spacer 弹性 spacer
// ============================================

class Spacer extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.style('flex', '1');
  }

  size(value) {
    return this.style('flex', value);
  }

  width(value) {
    return this.style('width', value);
  }

  height(value) {
    return this.style('height', value);
  }
}

function spacer(setup = null) {
  return new Spacer(setup);
}

// ============================================
// Container 响应式容器
// ============================================

class Container extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.style('maxWidth', '1200px');
    this.style('margin', '0 auto');
    this.style('padding', '0 16px');
  }

  maxWidth(value) {
    return this.style('maxWidth', value);
  }

  padding(value) {
    return this.style('padding', value);
  }

  fluid() {
    return this.style('maxWidth', '100%');
  }
}

function container(setup = null) {
  return new Container(setup);
}

// ============================================
// Divider 分割线
// ============================================

class Divider extends Tag {
  constructor(setup = null) {
    super('hr', setup);
    this.style('border', 'none');
    this.style('height', '1px');
    this.style('background', '#e0e0e0');
    this.style('margin', '0');
  }

  color(value) {
    return this.style('background', value);
  }

  vertical() {
    return this.style('width', '1px')
      .style('height', 'auto')
      .style('border-right', '1px solid currentColor');
  }

  margin(value) {
    return this.style('margin', value);
  }
}

function divider(setup = null) {
  return new Divider(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

Tag.prototype.flex = function(setup = null) {
  const el = flex(setup);
  this.child(el);
  return this;
};

Tag.prototype.grid = function(setup = null) {
  const el = grid(setup);
  this.child(el);
  return this;
};

Tag.prototype.responsiveGrid = function(setup = null) {
  const el = responsiveGrid(setup);
  this.child(el);
  return this;
};

Tag.prototype.stack = function(setup = null) {
  const el = stack(setup);
  this.child(el);
  return this;
};

Tag.prototype.hstack = function(setup = null) {
  const el = hstack(setup);
  this.child(el);
  return this;
};

Tag.prototype.vstack = function(setup = null) {
  const el = vstack(setup);
  this.child(el);
  return this;
};

Tag.prototype.center = function(setup = null) {
  const el = center(setup);
  this.child(el);
  return this;
};

Tag.prototype.spacer = function(setup = null) {
  const el = spacer(setup);
  this.child(el);
  return this;
};

Tag.prototype.container = function(setup = null) {
  const el = container(setup);
  this.child(el);
  return this;
};

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
