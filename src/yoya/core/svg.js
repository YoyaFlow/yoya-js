/**
 * Yoya.Basic - SVG Components
 * SVG 图形组件
 */

import { Tag } from './basic.js';

// SVG 命名空间
const SVG_NS = 'http://www.w3.org/2000/svg';

// ============================================
// SvgTag 基类
// ============================================

class SvgTag extends Tag {
  constructor(tagName, setup = null) {
    // 先调用父类构造函数
    super(tagName, null);

    // 重新创建 SVG 元素（覆盖 Tag 创建的普通 HTML 元素）
    this._el = document.createElementNS(SVG_NS, tagName);
    this._boundElement = this._el;

    // SVG 特有的属性
    this._transforms = [];

    // 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 重写 renderDom，处理 SVG 子元素的智能增删
  renderDom() {
    if (this._deleted) return null;

    // 首次渲染时应用事件
    if (!this._rendered) {
      this._applyEventsToEl();
    }

    // 智能更新子元素
    const currentEls = Array.from(this._el.children);
    const currentElSet = new Set(currentEls);

    const newEls = [];
    const childrenToAdd = [];

    for (const child of this._children) {
      if (child._deleted) continue;

      const childEl = child.renderDom();
      if (!childEl) continue;

      newEls.push(childEl);

      // 如果已存在，跳过
      if (currentElSet.has(childEl)) {
        currentElSet.delete(childEl);
      } else {
        childrenToAdd.push(childEl);
      }
    }

    // 移除已删除的子元素
    for (const el of currentEls) {
      if (!newEls.includes(el)) {
        this._el.removeChild(el);
      }
    }

    // 添加新的子元素
    for (const childEl of childrenToAdd) {
      this._el.appendChild(childEl);
    }

    this._rendered = true;
    return this._el;
  }

  // 重写 toHTML，生成 SVG XML 格式
  toHTML() {
    const attrs = Object.entries(this._attrs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');

    const classes = Array.from(this._classes).join(' ');
    const styles = Object.entries(this._styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    const tagStart = `<${this._tagName}${attrs ? ' ' + attrs : ''}${classes ? ' class="' + classes + '"' : ''}${styles ? ' style="' + styles + '"' : ''}>`;
    const children = this._children.map(child => {
      if (child === null || child === undefined) return '';
      if (typeof child === 'string' || typeof child === 'number') return child;
      if (child.toHTML) return child.toHTML();
      return '';
    }).join('');

    return tagStart + children + `</${this._tagName}>`;
  }

  // 重写 child 方法，支持 SVG 子元素
  child(...children) {
    for (const child of children) {
      if (Array.isArray(child)) {
        this.child(...child);
      } else if (child !== null && child !== undefined) {
        this._children.push(child);
      }
    }
    return this;
  }
}

// ============================================
// SVG 基类
// ============================================

class Svg extends SvgTag {
  constructor(setup = null) {
    super('svg', setup);
    this.style('display', 'inline-block');
  }

  // 视口
  viewBox(value) {
    return this.attr('viewBox', value);
  }

  viewBox(x, y, width, height) {
    if (arguments.length === 4) {
      return this.attr('viewBox', `${x} ${y} ${width} ${height}`);
    }
    return this.attr('viewBox', value);
  }

  // 尺寸
  width(value) {
    return this.attr('width', value);
  }

  height(value) {
    return this.attr('height', value);
  }

  // 命名空间
  xmlns(value = 'http://www.w3.org/2000/svg') {
    return this.attr('xmlns', value);
  }

  // SVG 子元素工厂方法
  circle(setup = null) {
    const el = circle(setup);
    this.child(el);
    return this;
  }

  ellipse(setup = null) {
    const el = ellipse(setup);
    this.child(el);
    return this;
  }

  rect(setup = null) {
    const el = rect(setup);
    this.child(el);
    return this;
  }

  line(setup = null) {
    const el = line(setup);
    this.child(el);
    return this;
  }

  polyline(setup = null) {
    const el = polyline(null, setup);
    this.child(el);
    return this;
  }

  polygon(setup = null) {
    const el = polygon(null, setup);
    this.child(el);
    return this;
  }

  path(setup = null) {
    const el = path(null, setup);
    this.child(el);
    return this;
  }

  text(content = '', setup = null) {
    const el = svgText(content, setup);
    this.child(el);
    return this;
  }

  tspan(content = '', setup = null) {
    const el = tspan(content, setup);
    this.child(el);
    return this;
  }

  g(setup = null) {
    const el = g(setup);
    this.child(el);
    return this;
  }

  linearGradient(setup = null) {
    const el = linearGradient(setup);
    this.child(el);
    return this;
  }

  radialGradient(setup = null) {
    const el = radialGradient(setup);
    this.child(el);
    return this;
  }

  pattern(setup = null) {
    const el = pattern(setup);
    this.child(el);
    return this;
  }

  filter(id, setup = null) {
    const el = filter(id, setup);
    this.child(el);
    return this;
  }

  image(href = '', setup = null) {
    const el = svgImage(href, setup);
    this.child(el);
    return this;
  }

  svgElement(tagName, setup = null) {
    const el = svgElement(tagName, setup);
    this.child(el);
    return this;
  }

  defs(setup = null) {
    const el = defs(setup);
    this.child(el);
    return this;
  }
}

function svg(setup = null) {
  return new Svg(setup);
}

// ============================================
// 基础形状
// ============================================

class Circle extends SvgTag {
  constructor(setup = null) {
    super('circle', setup);
  }

  cx(value) {
    return this.attr('cx', value);
  }

  cy(value) {
    return this.attr('cy', value);
  }

  r(value) {
    return this.attr('r', value);
  }
}

function circle(setup = null) {
  return new Circle(setup);
}

class Ellipse extends SvgTag {
  constructor(setup = null) {
    super('ellipse', setup);
  }

  cx(value) {
    return this.attr('cx', value);
  }

  cy(value) {
    return this.attr('cy', value);
  }

  rx(value) {
    return this.attr('rx', value);
  }

  ry(value) {
    return this.attr('ry', value);
  }
}

function ellipse(setup = null) {
  return new Ellipse(setup);
}

class Rect extends SvgTag {
  constructor(setup = null) {
    super('rect', setup);
  }

  x(value) {
    return this.attr('x', value);
  }

  y(value) {
    return this.attr('y', value);
  }

  width(value) {
    return this.attr('width', value);
  }

  height(value) {
    return this.attr('height', value);
  }

  rx(value) {
    return this.attr('rx', value);
  }

  ry(value) {
    return this.attr('ry', value);
  }
}

function rect(setup = null) {
  return new Rect(setup);
}

class Line extends SvgTag {
  constructor(setup = null) {
    super('line', setup);
  }

  x1(value) {
    return this.attr('x1', value);
  }

  y1(value) {
    return this.attr('y1', value);
  }

  x2(value) {
    return this.attr('x2', value);
  }

  y2(value) {
    return this.attr('y2', value);
  }
}

function line(setup = null) {
  return new Line(setup);
}

class Polyline extends SvgTag {
  constructor(points = null, setup = null) {
    super('polyline', setup);
    if (points) {
      this.points(points);
    }
  }

  points(value) {
    if (Array.isArray(value)) {
      return this.attr('points', value.join(' '));
    }
    return this.attr('points', value);
  }
}

function polyline(points = null, setup = null) {
  return new Polyline(points, setup);
}

class Polygon extends SvgTag {
  constructor(points = null, setup = null) {
    super('polygon', setup);
    if (points) {
      this.points(points);
    }
  }

  points(value) {
    if (Array.isArray(value)) {
      return this.attr('points', value.join(' '));
    }
    return this.attr('points', value);
  }
}

function polygon(points = null, setup = null) {
  return new Polygon(points, setup);
}

// ============================================
// 路径
// ============================================

class Path extends SvgTag {
  constructor(d = null, setup = null) {
    super('path', setup);
    if (d) {
      this.d(d);
    }
  }

  d(value) {
    return this.attr('d', value);
  }

  // 路径命令辅助方法
  moveTo(x, y) {
    this._pathCommand(`M ${x} ${y}`);
    return this;
  }

  lineTo(x, y) {
    this._pathCommand(`L ${x} ${y}`);
    return this;
  }

  hlineTo(x) {
    this._pathCommand(`H ${x}`);
    return this;
  }

  vlineTo(y) {
    this._pathCommand(`V ${y}`);
    return this;
  }

  curveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._pathCommand(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y}`);
    return this;
  }

  quadraticCurveTo(cpx, cpy, x, y) {
    this._pathCommand(`Q ${cpx} ${cpy} ${x} ${y}`);
    return this;
  }

  arcTo(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    this._pathCommand(`A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`);
    return this;
  }

  closePath() {
    this._pathCommand('Z');
    return this;
  }

  _pathCommand(cmd) {
    const current = this._attrs.d || '';
    this._attrs.d = current ? `${current} ${cmd}` : cmd;
  }
}

function path(d = null, setup = null) {
  return new Path(d, setup);
}

// ============================================
// 文本
// ============================================

class Text extends SvgTag {
  constructor(content = '', setup = null) {
    // 如果 content 是函数，则它是 setup
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }
    super('text', setup);
    if (content) {
      this.text(content);
    }
  }

  x(value) {
    return this.attr('x', value);
  }

  y(value) {
    return this.attr('y', value);
  }

  dx(value) {
    return this.attr('dx', value);
  }

  dy(value) {
    return this.attr('dy', value);
  }

  textAnchor(value) {
    return this.attr('text-anchor', value);
  }

  text(content) {
    this._text = content;
    return this;
  }

  tspan(content = '', setup = null) {
    const el = tspan(content, setup);
    this.child(el);
    return this;
  }

  renderDom() {
    if (this._deleted) return null;

    // 首次渲染时应用事件
    if (!this._rendered) {
      this._applyEventsToEl();
    }

    // 智能更新子元素
    const currentEls = Array.from(this._el.children);
    const currentElSet = new Set(currentEls);

    const newEls = [];
    const childrenToAdd = [];

    for (const child of this._children) {
      if (child._deleted) continue;

      const childEl = child.renderDom();
      if (!childEl) continue;

      newEls.push(childEl);

      // 如果已存在，跳过
      if (currentElSet.has(childEl)) {
        currentElSet.delete(childEl);
      } else {
        childrenToAdd.push(childEl);
      }
    }

    // 移除已删除的子元素
    for (const el of currentEls) {
      if (!newEls.includes(el)) {
        this._el.removeChild(el);
      }
    }

    // 添加新的子元素
    for (const childEl of childrenToAdd) {
      this._el.appendChild(childEl);
    }

    // 设置文本内容（如果没有子元素）
    if (this._children.length === 0 && this._text) {
      this._el.textContent = this._text;
    }

    this._rendered = true;
    return this._el;
  }

  toHTML() {
    const attrs = Object.entries(this._attrs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');

    const classes = Array.from(this._classes).join(' ');
    const styles = Object.entries(this._styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    const tagStart = `<text${attrs ? ' ' + attrs : ''}${classes ? ' class="' + classes + '"' : ''}${styles ? ' style="' + styles + '"' : ''}>`;
    return tagStart + (this._text || '') + '</text>';
  }
}

function svgText(content = '', setup = null) {
  return new Text(content, setup);
}

// ============================================
// Tspan
// ============================================

class Tspan extends SvgTag {
  constructor(content = '', setup = null) {
    // 如果 content 是函数，则它是 setup
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }
    super('tspan', setup);
    if (content) {
      this.text(content);
    }
  }

  x(value) {
    return this.attr('x', value);
  }

  y(value) {
    return this.attr('y', value);
  }

  dx(value) {
    return this.attr('dx', value);
  }

  dy(value) {
    return this.attr('dy', value);
  }

  text(content) {
    this._text = content;
    return this;
  }

  renderDom() {
    if (this._deleted) return null;

    // 首次渲染时应用事件
    if (!this._rendered) {
      this._applyEventsToEl();
    }

    // 设置文本内容
    if (this._text) {
      this._el.textContent = this._text;
    }

    this._rendered = true;
    return this._el;
  }
}

function tspan(content = '', setup = null) {
  return new Tspan(content, setup);
}

// ============================================
// 渐变
// ============================================

class LinearGradient extends SvgTag {
  constructor(setup = null) {
    super('linearGradient', setup);
  }

  x1(value) {
    return this.attr('x1', value);
  }

  y1(value) {
    return this.attr('y1', value);
  }

  x2(value) {
    return this.attr('x2', value);
  }

  y2(value) {
    return this.attr('y2', value);
  }

  gradientUnits(value) {
    return this.attr('gradientUnits', value);
  }

  stop(offset, color, opacity = 1) {
    const stopEl = new Stop(offset, color, opacity);
    this._children.push(stopEl);
    return this;
  }
}

function linearGradient(setup = null) {
  return new LinearGradient(setup);
}

class RadialGradient extends SvgTag {
  constructor(setup = null) {
    super('radialGradient', setup);
  }

  cx(value) {
    return this.attr('cx', value);
  }

  cy(value) {
    return this.attr('cy', value);
  }

  r(value) {
    return this.attr('r', value);
  }

  fx(value) {
    return this.attr('fx', value);
  }

  fy(value) {
    return this.attr('fy', value);
  }

  stop(offset, color, opacity = 1) {
    const stopEl = new Stop(offset, color, opacity);
    this._children.push(stopEl);
    return this;
  }
}

function radialGradient(setup = null) {
  return new RadialGradient(setup);
}

class Stop extends SvgTag {
  constructor(offset = 0, color = '#000', opacity = 1) {
    super('stop');
    this.offset(offset);
    this.stopColor(color);
    this.stopOpacity(opacity);
  }

  offset(value) {
    return this.attr('offset', typeof value === 'number' ? `${value}%` : value);
  }

  stopColor(value) {
    return this.attr('stop-color', value);
  }

  stopOpacity(value) {
    return this.attr('stop-opacity', value);
  }
}

function stop(offset = 0, color = '#000', opacity = 1) {
  return new Stop(offset, color, opacity);
}

// ============================================
// 图案
// ============================================

class Pattern extends SvgTag {
  constructor(setup = null) {
    super('pattern', setup);
  }

  x(value) {
    return this.attr('x', value);
  }

  y(value) {
    return this.attr('y', value);
  }

  width(value) {
    return this.attr('width', value);
  }

  height(value) {
    return this.attr('height', value);
  }

  patternUnits(value) {
    return this.attr('patternUnits', value);
  }

  patternContentUnits(value) {
    return this.attr('patternContentUnits', value);
  }
}

function pattern(setup = null) {
  return new Pattern(setup);
}

// ============================================
// 滤镜
// ============================================

class FilterPrimitive extends SvgTag {
  constructor(tagName, attrs = {}) {
    super(tagName);
    for (const [k, v] of Object.entries(attrs)) {
      this.attr(k, v);
    }
  }
}

class Filter extends SvgTag {
  constructor(id, setup = null) {
    super('filter', setup);
    if (id) {
      this.id(id);
    }
  }

  primitive(type, attrs = {}) {
    const el = new FilterPrimitive(`fe${type}`, attrs);
    this._children.push(el);
    return this;
  }

  gaussianBlur(stdDeviation, attrs = {}) {
    return this.primitive('GaussianBlur', { stdDeviation, ...attrs });
  }

  dropShadow(dx, dy, stdDeviation, floodColor = '#000', floodOpacity = 0.5) {
    return this
      .primitive('DropShadow', { dx, dy, stdDeviation, floodColor, floodOpacity });
  }
}

function filter(id, setup = null) {
  return new Filter(id, setup);
}

// ============================================
// 图像
// ============================================

class Image extends SvgTag {
  constructor(href = '', setup = null) {
    super('image', setup);
    if (href) {
      this.href(href);
    }
  }

  href(value) {
    return this.attr('href', value);
  }

  x(value) {
    return this.attr('x', value);
  }

  y(value) {
    return this.attr('y', value);
  }

  width(value) {
    return this.attr('width', value);
  }

  height(value) {
    return this.attr('height', value);
  }

  preserveAspectRatio(value) {
    return this.attr('preserveAspectRatio', value);
  }
}

function svgImage(href = '', setup = null) {
  return new Image(href, setup);
}

// ============================================
// 组
// ============================================

class G extends SvgTag {
  constructor(setup = null) {
    super('g', setup);
  }

  transform(value) {
    if (value) {
      this._transforms.push(value);
      this.attr('transform', this._transforms.join(' '));
    }
    return this;
  }

  translate(x, y) {
    return this.transform(`translate(${x}, ${y})`);
  }

  scale(sx, sy = sx) {
    return this.transform(`scale(${sx}, ${sy})`);
  }

  rotate(angle, cx, cy) {
    if (cx !== undefined && cy !== undefined) {
      return this.transform(`rotate(${angle} ${cx} ${cy})`);
    }
    return this.transform(`rotate(${angle})`);
  }

  skewX(angle) {
    return this.transform(`skewX(${angle})`);
  }

  skewY(angle) {
    return this.transform(`skewY(${angle})`);
  }

  // SVG 子元素工厂方法
  circle(setup = null) {
    const el = circle(setup);
    this.child(el);
    return this;
  }

  ellipse(setup = null) {
    const el = ellipse(setup);
    this.child(el);
    return this;
  }

  rect(setup = null) {
    const el = rect(setup);
    this.child(el);
    return this;
  }

  line(setup = null) {
    const el = line(setup);
    this.child(el);
    return this;
  }

  polyline(setup = null) {
    const el = polyline(null, setup);
    this.child(el);
    return this;
  }

  polygon(setup = null) {
    const el = polygon(null, setup);
    this.child(el);
    return this;
  }

  path(setup = null) {
    const el = path(null, setup);
    this.child(el);
    return this;
  }

  text(content = '', setup = null) {
    const el = svgText(content, setup);
    this.child(el);
    return this;
  }

  tspan(content = '', setup = null) {
    const el = tspan(content, setup);
    this.child(el);
    return this;
  }

  g(setup = null) {
    const el = g(setup);
    this.child(el);
    return this;
  }

  linearGradient(setup = null) {
    const el = linearGradient(setup);
    this.child(el);
    return this;
  }

  radialGradient(setup = null) {
    const el = radialGradient(setup);
    this.child(el);
    return this;
  }

  pattern(setup = null) {
    const el = pattern(setup);
    this.child(el);
    return this;
  }

  filter(id, setup = null) {
    const el = filter(id, setup);
    this.child(el);
    return this;
  }

  image(href = '', setup = null) {
    const el = svgImage(href, setup);
    this.child(el);
    return this;
  }

  svgElement(tagName, setup = null) {
    const el = svgElement(tagName, setup);
    this.child(el);
    return this;
  }

  defs(setup = null) {
    const el = defs(setup);
    this.child(el);
    return this;
  }
}

function g(setup = null) {
  return new G(setup);
}

// ============================================
// 通用 SVG 元素
// ============================================

class SvgElement extends SvgTag {
  constructor(tagName, setup = null) {
    super(tagName, setup);
  }

  renderDom() {
    if (this._deleted) return null;
    return super.renderDom();
  }
}

function svgElement(tagName, setup = null) {
  return new SvgElement(tagName, setup);
}

// ============================================
// 定义容器
// ============================================

class Defs extends SvgTag {
  constructor(setup = null) {
    super('defs', setup);
  }

  // SVG 子元素工厂方法
  linearGradient(setup = null) {
    const el = linearGradient(setup);
    this.child(el);
    return this;
  }

  radialGradient(setup = null) {
    const el = radialGradient(setup);
    this.child(el);
    return this;
  }

  filter(id, setup = null) {
    const el = filter(id, setup);
    this.child(el);
    return this;
  }

  pattern(setup = null) {
    const el = pattern(setup);
    this.child(el);
    return this;
  }
}

function defs(setup = null) {
  return new Defs(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

Tag.prototype.svg = function(setup = null) {
  const el = svg(setup);
  this.child(el);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  // 类
  SvgTag,
  Svg, Circle, Ellipse, Rect, Line, Polyline, Polygon, Path,
  Text as SvgText, Tspan,
  LinearGradient, RadialGradient, Stop, Pattern,
  Filter, Image as SvgImage, G, SvgElement, Defs,

  // 工厂函数
  svg, circle, ellipse, rect, line, polyline, polygon, path,
  svgText, tspan,
  linearGradient, radialGradient, pattern,
  filter, svgImage, g,
  svgElement, defs, stop
};
