/**
 * Yoya.Basic - SVG Components Type Declarations
 */

import { Tag, Setup } from './basic';

// ============================================
// SvgTag 基类
// ============================================

declare class SvgTag extends Tag {
  constructor(tagName: string, setup?: Setup<SvgTag>);
  renderDom(): Element | null;
  toHTML(): string;
  child(...children: (SvgTag | string | number | null | undefined | (SvgTag | string | number | null | undefined)[])[]): this;
}

// ============================================
// SVG 基类
// ============================================

declare class Svg extends SvgTag {
  constructor(setup?: Setup<Svg>);
  viewBox(value: string): this;
  viewBox(x: number, y: number, width: number, height: number): this;
  width(value: number | string): this;
  height(value: number | string): this;
  xmlns(value?: string): this;

  // SVG 子元素工厂方法
  circle(setup?: Setup<Circle>): this;
  ellipse(setup?: Setup<Ellipse>): this;
  rect(setup?: Setup<Rect>): this;
  line(setup?: Setup<Line>): this;
  polyline(points?: string | number[], setup?: Setup<Polyline>): this;
  polygon(points?: string | number[], setup?: Setup<Polygon>): this;
  path(d?: string, setup?: Setup<Path>): this;
  text(content?: string, setup?: Setup<SvgText>): this;
  tspan(content?: string, setup?: Setup<Tspan>): this;
  g(setup?: Setup<G>): this;
  linearGradient(setup?: Setup<LinearGradient>): this;
  radialGradient(setup?: Setup<RadialGradient>): this;
  pattern(setup?: Setup<Pattern>): this;
  filter(id?: string, setup?: Setup<Filter>): this;
  image(href?: string, setup?: Setup<SvgImage>): this;
  svgElement(tagName: string, setup?: Setup<SvgElement>): this;
  defs(setup?: Setup<Defs>): this;
}

declare function svg(setup?: Setup<Svg>): Svg;

// ============================================
// 基础形状
// ============================================

declare class Circle extends SvgTag {
  constructor(setup?: Setup<Circle>);
  cx(value: number | string): this;
  cy(value: number | string): this;
  r(value: number | string): this;
}

declare function circle(setup?: Setup<Circle>): Circle;

declare class Ellipse extends SvgTag {
  constructor(setup?: Setup<Ellipse>);
  cx(value: number | string): this;
  cy(value: number | string): this;
  rx(value: number | string): this;
  ry(value: number | string): this;
}

declare function ellipse(setup?: Setup<Ellipse>): Ellipse;

declare class Rect extends SvgTag {
  constructor(setup?: Setup<Rect>);
  x(value: number | string): this;
  y(value: number | string): this;
  width(value: number | string): this;
  height(value: number | string): this;
  rx(value: number | string): this;
  ry(value: number | string): this;
}

declare function rect(setup?: Setup<Rect>): Rect;

declare class Line extends SvgTag {
  constructor(setup?: Setup<Line>);
  x1(value: number | string): this;
  y1(value: number | string): this;
  x2(value: number | string): this;
  y2(value: number | string): this;
}

declare function line(setup?: Setup<Line>): Line;

declare class Polyline extends SvgTag {
  constructor(points?: string | number[], setup?: Setup<Polyline>);
  points(value: string | number[]): this;
}

declare function polyline(points?: string | number[], setup?: Setup<Polyline>): Polyline;

declare class Polygon extends SvgTag {
  constructor(points?: string | number[], setup?: Setup<Polygon>);
  points(value: string | number[]): this;
}

declare function polygon(points?: string | number[], setup?: Setup<Polygon>): Polygon;

// ============================================
// 路径
// ============================================

declare class Path extends SvgTag {
  constructor(d?: string, setup?: Setup<Path>);
  d(value: string): this;
  moveTo(x: number, y: number): this;
  lineTo(x: number, y: number): this;
  hlineTo(x: number): this;
  vlineTo(y: number): this;
  curveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this;
  arcTo(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): this;
  closePath(): this;
}

declare function path(d?: string, setup?: Setup<Path>): Path;

// ============================================
// 文本
// ============================================

declare class SvgText extends SvgTag {
  constructor(content?: string, setup?: Setup<SvgText>);
  x(value: number | string): this;
  y(value: number | string): this;
  dx(value: number | string): this;
  dy(value: number | string): this;
  textAnchor(value: string): this;
  text(content: string): this;
}

declare function svgText(content?: string, setup?: Setup<SvgText>): SvgText;

declare class Tspan extends SvgTag {
  constructor(content?: string, setup?: Setup<Tspan>);
  x(value: number | string): this;
  y(value: number | string): this;
  dx(value: number | string): this;
  dy(value: number | string): this;
  text(content: string): this;
}

declare function tspan(content?: string, setup?: Setup<Tspan>): Tspan;

// ============================================
// 渐变
// ============================================

declare class LinearGradient extends SvgTag {
  constructor(setup?: Setup<LinearGradient>);
  x1(value: number | string): this;
  y1(value: number | string): this;
  x2(value: number | string): this;
  y2(value: number | string): this;
  gradientUnits(value: string): this;
  stop(offset: number | string, color: string, opacity?: number): this;
}

declare function linearGradient(setup?: Setup<LinearGradient>): LinearGradient;

declare class RadialGradient extends SvgTag {
  constructor(setup?: Setup<RadialGradient>);
  cx(value: number | string): this;
  cy(value: number | string): this;
  r(value: number | string): this;
  fx(value: number | string): this;
  fy(value: number | string): this;
  stop(offset: number | string, color: string, opacity?: number): this;
}

declare function radialGradient(setup?: Setup<RadialGradient>): RadialGradient;

declare class Stop extends SvgTag {
  constructor(offset?: number | string, color?: string, opacity?: number);
  offset(value: number | string): this;
  stopColor(value: string): this;
  stopOpacity(value: number): this;
}

declare function stop(offset?: number | string, color?: string, opacity?: number): Stop;

// ============================================
// 图案
// ============================================

declare class Pattern extends SvgTag {
  constructor(setup?: Setup<Pattern>);
  x(value: number | string): this;
  y(value: number | string): this;
  width(value: number | string): this;
  height(value: number | string): this;
  patternUnits(value: string): this;
  patternContentUnits(value: string): this;
}

declare function pattern(setup?: Setup<Pattern>): Pattern;

// ============================================
// 滤镜
// ============================================

declare class Filter extends SvgTag {
  constructor(id?: string, setup?: Setup<Filter>);
  id(value: string): this;
  primitive(type: string, attrs?: Record<string, any>): this;
  gaussianBlur(stdDeviation: number | string, attrs?: Record<string, any>): this;
  dropShadow(dx: number, dy: number, stdDeviation: number | string, floodColor?: string, floodOpacity?: number): this;
}

declare function filter(id?: string, setup?: Setup<Filter>): Filter;

// ============================================
// 图像
// ============================================

declare class SvgImage extends SvgTag {
  constructor(href?: string, setup?: Setup<SvgImage>);
  href(value: string): this;
  x(value: number | string): this;
  y(value: number | string): this;
  width(value: number | string): this;
  height(value: number | string): this;
  preserveAspectRatio(value: string): this;
}

declare function svgImage(href?: string, setup?: Setup<SvgImage>): SvgImage;

// ============================================
// 组
// ============================================

declare class G extends SvgTag {
  constructor(setup?: Setup<G>);
  transform(value: string): this;
  translate(x: number, y: number): this;
  scale(sx: number, sy?: number): this;
  rotate(angle: number, cx?: number, cy?: number): this;
  skewX(angle: number): this;
  skewY(angle: number): this;

  // SVG 子元素工厂方法
  circle(setup?: Setup<Circle>): this;
  ellipse(setup?: Setup<Ellipse>): this;
  rect(setup?: Setup<Rect>): this;
  line(setup?: Setup<Line>): this;
  polyline(points?: string | number[], setup?: Setup<Polyline>): this;
  polygon(points?: string | number[], setup?: Setup<Polygon>): this;
  path(d?: string, setup?: Setup<Path>): this;
  text(content?: string, setup?: Setup<SvgText>): this;
  tspan(content?: string, setup?: Setup<Tspan>): this;
  g(setup?: Setup<G>): this;
  linearGradient(setup?: Setup<LinearGradient>): this;
  radialGradient(setup?: Setup<RadialGradient>): this;
  pattern(setup?: Setup<Pattern>): this;
  filter(id?: string, setup?: Setup<Filter>): this;
  image(href?: string, setup?: Setup<SvgImage>): this;
  svgElement(tagName: string, setup?: Setup<SvgElement>): this;
  defs(setup?: Setup<Defs>): this;
}

declare function g(setup?: Setup<G>): G;

// ============================================
// 通用 SVG 元素
// ============================================

declare class SvgElement extends SvgTag {
  constructor(tagName: string, setup?: Setup<SvgElement>);
}

declare function svgElement(tagName: string, setup?: Setup<SvgElement>): SvgElement;

// ============================================
// 定义容器
// ============================================

declare class Defs extends SvgTag {
  constructor(setup?: Setup<Defs>);
}

declare function defs(setup?: Setup<Defs>): Defs;

// ============================================
// 导出
// ============================================

export {
  // 类
  SvgTag,
  Svg, Circle, Ellipse, Rect, Line, Polyline, Polygon, Path,
  SvgText, Tspan,
  LinearGradient, RadialGradient, Stop, Pattern,
  Filter, SvgImage, G, SvgElement, Defs,

  // 工厂函数
  svg, circle, ellipse, rect, line, polyline, polygon, path,
  svgText, tspan,
  linearGradient, radialGradient, pattern,
  filter, svgImage, g,
  svgElement, defs, stop
};
