/**
 * Yoya.Basic - Layout Components Type Declarations
 */

import { Tag, Setup } from './core/basic';

// ============================================
// Flex 布局
// ============================================

declare class Flex extends Tag {
  constructor(setup?: Setup<Flex>);

  // 主轴方向
  row(): this;
  column(): this;
  rowReverse(): this;
  columnReverse(): this;

  // 主轴对齐
  justifyContent(value: string): this;
  justifyStart(): this;
  justifyEnd(): this;
  justifyCenter(): this;
  justifyBetween(): this;
  justifyAround(): this;
  justifyEvenly(): this;

  // 交叉轴对齐
  alignItems(value: string): this;
  alignStart(): this;
  alignEnd(): this;
  alignCenter(): this;
  alignStretch(): this;
  alignBaseline(): this;

  // 换行
  wrap(value?: string): this;
  noWrap(): this;

  // 间距
  gap(value: string | number): this;
}

declare function flex(setup?: Setup<Flex>): Flex;

// ============================================
// Grid 布局
// ============================================

declare class Grid extends Tag {
  constructor(setup?: Setup<Grid>);

  gridTemplateColumns(value: string): this;
  columns(count: number, size?: string): this;
  gridTemplateRows(value: string): this;
  rows(count: number, size?: string): this;
  columnGap(value: string | number): this;
  rowGap(value: string | number): this;
  gap(value: string | number): this;
  justifyContent(value: string): this;
  alignItems(value: string): this;
  gridArea(value: string): this;
}

declare function grid(setup?: Setup<Grid>): Grid;

// ============================================
// ResponsiveGrid 响应式 Grid
// ============================================

declare class ResponsiveGrid extends Grid {
  constructor(setup?: Setup<ResponsiveGrid>);
  minSize(value: string): this;
  autoFit(): this;
  autoFill(): this;
}

declare function responsiveGrid(setup?: Setup<ResponsiveGrid>): ResponsiveGrid;

// ============================================
// Stack 堆叠布局
// ============================================

declare class Stack extends Tag {
  constructor(setup?: Setup<Stack>);
  horizontal(): this;
  gap(value: string | number): this;
  align(value: string): this;
  justify(value: string): this;
}

declare function stack(setup?: Setup<Stack>): Stack;

// ============================================
// HStack 水平堆叠
// ============================================

declare class HStack extends Stack {
  constructor(setup?: Setup<HStack>);
}

declare function hstack(setup?: Setup<HStack>): HStack;

// ============================================
// VStack 垂直堆叠
// ============================================

declare class VStack extends Stack {
  constructor(setup?: Setup<VStack>);
}

declare function vstack(setup?: Setup<VStack>): VStack;

// ============================================
// Center 居中布局
// ============================================

declare class Center extends Tag {
  constructor(setup?: Setup<Center>);
  horizontal(): this;
  vertical(): this;
  center(): this;
}

declare function center(setup?: Setup<Center>): Center;

// ============================================
// Spacer 弹性 spacer
// ============================================

declare class Spacer extends Tag {
  constructor(setup?: Setup<Spacer>);
  size(value: string | number): this;
  width(value: string | number): this;
  height(value: string | number): this;
}

declare function spacer(setup?: Setup<Spacer>): Spacer;

// ============================================
// Container 响应式容器
// ============================================

declare class Container extends Tag {
  constructor(setup?: Setup<Container>);
  maxWidth(value: string | number): this;
  padding(value: string | number): this;
  fluid(): this;
}

declare function container(setup?: Setup<Container>): Container;

// ============================================
// Divider 分割线
// ============================================

declare class Divider extends Tag {
  constructor(setup?: Setup<Divider>);
  color(value: string): this;
  vertical(): this;
  margin(value: string | number): this;
}

declare function divider(setup?: Setup<Divider>): Divider;

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
