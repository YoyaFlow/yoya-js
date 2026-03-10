/**
 * Yoya.Basic - SVG Components
 * SVG 图形组件
 * @module Yoya.SVG
 */

import { Tag } from './basic.js';

// SVG 命名空间
const SVG_NS = 'http://www.w3.org/2000/svg';

// ============================================
// SvgTag 基类
// ============================================

/**
 * SVG 元素基类，所有 SVG 元素的父类
 * @class
 * @extends Tag
 */
class SvgTag extends Tag {
  /**
   * 创建 SVG 元素
   * @param {string} tagName - SVG 标签名
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
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

  /**
   * 渲染 SVG 元素到 DOM（重写 Tag 的 renderDom）
   * 支持 SVG 子元素的智能增删
   * @returns {SVGElement|null} 渲染后的 SVG 元素
   */
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

  /**
   * 生成 SVG XML 格式 HTML（重写 Tag 的 toHTML）
   * @returns {string} SVG XML 字符串
   */
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

  /**
   * 添加 SVG 子元素（重写 child 方法）
   * @param {...(SvgTag|null|undefined|Array)} children - SVG 子元素
   * @returns {this} 返回当前实例支持链式调用
   */
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

/**
 * Svg SVG 画布容器
 * @class
 * @extends SvgTag
 */
class Svg extends SvgTag {
  /**
   * 创建 Svg 画布容器
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('svg', setup);
    this.style('display', 'inline-block');
  }

  /**
   * 设置 SVG 视口
   * @param {number} x - 左上角 x 坐标
   * @param {number} y - 左上角 y 坐标
   * @param {number} width - 视口宽度
   * @param {number} height - 视口高度
   * @returns {this} 返回当前实例支持链式调用
   * @example
   * svg(s => {
   *   s.viewBox(0, 0, 100, 100);
   * });
   */
  viewBox(x, y, width, height) {
    if (arguments.length === 4) {
      return this.attr('viewBox', `${x} ${y} ${width} ${height}`);
    }
    return this.attr('viewBox', x);
  }

  /**
   * 设置 SVG 宽度
   * @param {string|number} value - 宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  width(value) {
    return this.attr('width', value);
  }

  /**
   * 设置 SVG 高度
   * @param {string|number} value - 高度值
   * @returns {this} 返回当前实例支持链式调用
   */
  height(value) {
    return this.attr('height', value);
  }

  /**
   * 设置 SVG 命名空间
   * @param {string} [value='http://www.w3.org/2000/svg'] - 命名空间 URI
   * @returns {this} 返回当前实例支持链式调用
   */
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

  /**
   * 添加 image 子元素
   * @param {string} [href=''] - 图片 URL
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  image(href = '', setup = null) {
    const el = svgImage(href, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加任意 SVG 元素子元素
   * @param {string} tagName - SVG 标签名
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  svgElement(tagName, setup = null) {
    const el = svgElement(tagName, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 defs 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  defs(setup = null) {
    const el = defs(setup);
    this.child(el);
    return this;
  }
}

/**
 * 创建 Svg 画布容器
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Svg} Svg 实例
 */
function svg(setup = null) {
  return new Svg(setup);
}

// ============================================
// 基础形状
// ============================================

/**
 * Circle 圆形
 * @class
 * @extends SvgTag
 */
class Circle extends SvgTag {
  /**
   * 创建 Circle 圆形
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('circle', setup);
  }

  /**
   * 设置圆心 x 坐标
   * @param {number|string} value - 圆心 x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cx(value) {
    return this.attr('cx', value);
  }

  /**
   * 设置圆心 y 坐标
   * @param {number|string} value - 圆心 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cy(value) {
    return this.attr('cy', value);
  }

  /**
   * 设置半径
   * @param {number|string} value - 半径值
   * @returns {this} 返回当前实例支持链式调用
   */
  r(value) {
    return this.attr('r', value);
  }
}

/**
 * 创建 Circle 圆形
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Circle} Circle 实例
 */
function circle(setup = null) {
  return new Circle(setup);
}

/**
 * Ellipse 椭圆
 * @class
 * @extends SvgTag
 */
class Ellipse extends SvgTag {
  /**
   * 创建 Ellipse 椭圆
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('ellipse', setup);
  }

  /**
   * 设置圆心 x 坐标
   * @param {number|string} value - 圆心 x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cx(value) {
    return this.attr('cx', value);
  }

  /**
   * 设置圆心 y 坐标
   * @param {number|string} value - 圆心 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cy(value) {
    return this.attr('cy', value);
  }

  /**
   * 设置 x 轴半径
   * @param {number|string} value - x 轴半径
   * @returns {this} 返回当前实例支持链式调用
   */
  rx(value) {
    return this.attr('rx', value);
  }

  /**
   * 设置 y 轴半径
   * @param {number|string} value - y 轴半径
   * @returns {this} 返回当前实例支持链式调用
   */
  ry(value) {
    return this.attr('ry', value);
  }
}

/**
 * 创建 Ellipse 椭圆
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Ellipse} Ellipse 实例
 */
function ellipse(setup = null) {
  return new Ellipse(setup);
}

/**
 * Rect 矩形
 * @class
 * @extends SvgTag
 */
class Rect extends SvgTag {
  /**
   * 创建 Rect 矩形
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('rect', setup);
  }

  /**
   * 设置左上角 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x(value) {
    return this.attr('x', value);
  }

  /**
   * 设置左上角 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y(value) {
    return this.attr('y', value);
  }

  /**
   * 设置宽度
   * @param {number|string} value - 宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  width(value) {
    return this.attr('width', value);
  }

  /**
   * 设置高度
   * @param {number|string} value - 高度值
   * @returns {this} 返回当前实例支持链式调用
   */
  height(value) {
    return this.attr('height', value);
  }

  /**
   * 设置 x 轴圆角半径
   * @param {number|string} value - 圆角半径
   * @returns {this} 返回当前实例支持链式调用
   */
  rx(value) {
    return this.attr('rx', value);
  }

  /**
   * 设置 y 轴圆角半径
   * @param {number|string} value - 圆角半径
   * @returns {this} 返回当前实例支持链式调用
   */
  ry(value) {
    return this.attr('ry', value);
  }
}

/**
 * 创建 Rect 矩形
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Rect} Rect 实例
 */
function rect(setup = null) {
  return new Rect(setup);
}

/**
 * Line 线段
 * @class
 * @extends SvgTag
 */
class Line extends SvgTag {
  /**
   * 创建 Line 线段
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('line', setup);
  }

  /**
   * 设置起点 x 坐标
   * @param {number|string} value - 起点 x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x1(value) {
    return this.attr('x1', value);
  }

  /**
   * 设置起点 y 坐标
   * @param {number|string} value - 起点 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y1(value) {
    return this.attr('y1', value);
  }

  /**
   * 设置终点 x 坐标
   * @param {number|string} value - 终点 x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x2(value) {
    return this.attr('x2', value);
  }

  /**
   * 设置终点 y 坐标
   * @param {number|string} value - 终点 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y2(value) {
    return this.attr('y2', value);
  }
}

/**
 * 创建 Line 线段
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Line} Line 实例
 */
function line(setup = null) {
  return new Line(setup);
}

/**
 * Polyline 折线
 * @class
 * @extends SvgTag
 */
class Polyline extends SvgTag {
  /**
   * 创建 Polyline 折线
   * @param {Array<Array<number>>|string|null} [points=null] - 点坐标数组
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(points = null, setup = null) {
    super('polyline', setup);
    if (points) {
      this.points(points);
    }
  }

  /**
   * 设置折线点坐标
   * @param {Array<Array<number>>|string} value - 点坐标数组或字符串
   * @returns {this} 返回当前实例支持链式调用
   */
  points(value) {
    if (Array.isArray(value)) {
      return this.attr('points', value.join(' '));
    }
    return this.attr('points', value);
  }
}

/**
 * 创建 Polyline 折线
 * @param {Array<Array<number>>|string|null} [points=null] - 点坐标数组
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Polyline} Polyline 实例
 */
function polyline(points = null, setup = null) {
  return new Polyline(points, setup);
}

/**
 * Polygon 多边形
 * @class
 * @extends SvgTag
 */
class Polygon extends SvgTag {
  /**
   * 创建 Polygon 多边形
   * @param {Array<Array<number>>|string|null} [points=null] - 点坐标数组
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(points = null, setup = null) {
    super('polygon', setup);
    if (points) {
      this.points(points);
    }
  }

  /**
   * 设置多边形点坐标
   * @param {Array<Array<number>>|string} value - 点坐标数组或字符串
   * @returns {this} 返回当前实例支持链式调用
   */
  points(value) {
    if (Array.isArray(value)) {
      return this.attr('points', value.join(' '));
    }
    return this.attr('points', value);
  }
}

/**
 * 创建 Polygon 多边形
 * @param {Array<Array<number>>|string|null} [points=null] - 点坐标数组
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Polygon} Polygon 实例
 */
function polygon(points = null, setup = null) {
  return new Polygon(points, setup);
}

// ============================================
// 路径
// ============================================

/**
 * Path 路径
 * @class
 * @extends SvgTag
 */
class Path extends SvgTag {
  /**
   * 创建 Path 路径
   * @param {string|null} [d=null] - 路径数据
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(d = null, setup = null) {
    super('path', setup);
    if (d) {
      this.d(d);
    }
  }

  /**
   * 设置路径数据
   * @param {string} value - SVG 路径数据
   * @returns {this} 返回当前实例支持链式调用
   */
  d(value) {
    return this.attr('d', value);
  }

  /**
   * 移动到指定点（M 命令）
   * @param {number} x - x 坐标
   * @param {number} y - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  moveTo(x, y) {
    this._pathCommand(`M ${x} ${y}`);
    return this;
  }

  /**
   * 画线到指定点（L 命令）
   * @param {number} x - x 坐标
   * @param {number} y - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  lineTo(x, y) {
    this._pathCommand(`L ${x} ${y}`);
    return this;
  }

  /**
   * 画水平线到指定点（H 命令）
   * @param {number} x - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  hlineTo(x) {
    this._pathCommand(`H ${x}`);
    return this;
  }

  /**
   * 画垂直线到指定点（V 命令）
   * @param {number} y - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  vlineTo(y) {
    this._pathCommand(`V ${y}`);
    return this;
  }

  /**
   * 画三次贝塞尔曲线（C 命令）
   * @param {number} cp1x - 第一个控制点 x 坐标
   * @param {number} cp1y - 第一个控制点 y 坐标
   * @param {number} cp2x - 第二个控制点 x 坐标
   * @param {number} cp2y - 第二个控制点 y 坐标
   * @param {number} x - 终点 x 坐标
   * @param {number} y - 终点 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  curveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._pathCommand(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y}`);
    return this;
  }

  /**
   * 画二次贝塞尔曲线（Q 命令）
   * @param {number} cpx - 控制点 x 坐标
   * @param {number} cpy - 控制点 y 坐标
   * @param {number} x - 终点 x 坐标
   * @param {number} y - 终点 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  quadraticCurveTo(cpx, cpy, x, y) {
    this._pathCommand(`Q ${cpx} ${cpy} ${x} ${y}`);
    return this;
  }

  /**
   * 画弧线（A 命令）
   * @param {number} rx - x 轴半径
   * @param {number} ry - y 轴半径
   * @param {number} xAxisRotation - x 轴旋转角度
   * @param {number} largeArcFlag - 大弧标志
   * @param {number} sweepFlag - 顺时针标志
   * @param {number} x - 终点 x 坐标
   * @param {number} y - 终点 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  arcTo(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    this._pathCommand(`A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`);
    return this;
  }

  /**
   * 闭合路径（Z 命令）
   * @returns {this} 返回当前实例支持链式调用
   */
  closePath() {
    this._pathCommand('Z');
    return this;
  }

  /**
   * 添加路径命令
   * @private
   * @param {string} cmd - 路径命令字符串
   */
  _pathCommand(cmd) {
    const current = this._attrs.d || '';
    this._attrs.d = current ? `${current} ${cmd}` : cmd;
  }
}

/**
 * 创建 Path 路径
 * @param {string|null} [d=null] - 路径数据
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Path} Path 实例
 */
function path(d = null, setup = null) {
  return new Path(d, setup);
}

// ============================================
// 文本
// ============================================

/**
 * Text SVG 文本元素
 * @class
 * @extends SvgTag
 */
class Text extends SvgTag {
  /**
   * 创建 Text 文本元素
   * @param {string|Function} [content=''] - 文本内容或 setup 函数
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
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

  /**
   * 设置 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x(value) {
    return this.attr('x', value);
  }

  /**
   * 设置 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y(value) {
    return this.attr('y', value);
  }

  /**
   * 设置相对 x 偏移
   * @param {number|string} value - x 偏移量
   * @returns {this} 返回当前实例支持链式调用
   */
  dx(value) {
    return this.attr('dx', value);
  }

  /**
   * 设置相对 y 偏移
   * @param {number|string} value - y 偏移量
   * @returns {this} 返回当前实例支持链式调用
   */
  dy(value) {
    return this.attr('dy', value);
  }

  /**
   * 设置文本锚点（对齐方式）
   * @param {string} value - 对齐方式（start, middle, end）
   * @returns {this} 返回当前实例支持链式调用
   */
  textAnchor(value) {
    return this.attr('text-anchor', value);
  }

  /**
   * 设置文本内容
   * @param {string} content - 文本内容
   * @returns {this} 返回当前实例支持链式调用
   */
  text(content) {
    this._text = content;
    return this;
  }

  /**
   * 添加 tspan 子元素
   * @param {string} [content=''] - 文本内容
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  tspan(content = '', setup = null) {
    const el = tspan(content, setup);
    this.child(el);
    return this;
  }

  /**
   * 渲染文本元素到 DOM
   * @returns {SVGTextElement|null} 渲染后的 SVG 文本元素
   */
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

  /**
   * 生成 SVG XML 格式 HTML
   * @returns {string} SVG XML 字符串
   */
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

/**
 * 创建 Text 文本元素
 * @param {string|Function} [content=''] - 文本内容或 setup 函数
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Text} Text 实例
 */
function svgText(content = '', setup = null) {
  return new Text(content, setup);
}

// ============================================
// Tspan
// ============================================

/**
 * Tspan SVG 文本片段元素
 * @class
 * @extends SvgTag
 */
class Tspan extends SvgTag {
  /**
   * 创建 Tspan 文本片段
   * @param {string|Function} [content=''] - 文本内容或 setup 函数
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
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

  /**
   * 设置 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x(value) {
    return this.attr('x', value);
  }

  /**
   * 设置 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y(value) {
    return this.attr('y', value);
  }

  /**
   * 设置相对 x 偏移
   * @param {number|string} value - x 偏移量
   * @returns {this} 返回当前实例支持链式调用
   */
  dx(value) {
    return this.attr('dx', value);
  }

  /**
   * 设置相对 y 偏移
   * @param {number|string} value - y 偏移量
   * @returns {this} 返回当前实例支持链式调用
   */
  dy(value) {
    return this.attr('dy', value);
  }

  /**
   * 设置文本内容
   * @param {string} content - 文本内容
   * @returns {this} 返回当前实例支持链式调用
   */
  text(content) {
    this._text = content;
    return this;
  }

  /**
   * 渲染文本片段到 DOM
   * @returns {SVGTSpanElement|null} 渲染后的 SVG tspan 元素
   */
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

/**
 * 创建 Tspan 文本片段
 * @param {string|Function} [content=''] - 文本内容或 setup 函数
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Tspan} Tspan 实例
 */
function tspan(content = '', setup = null) {
  return new Tspan(content, setup);
}

// ============================================
// 渐变
// ============================================

/**
 * LinearGradient 线性渐变
 * @class
 * @extends SvgTag
 */
class LinearGradient extends SvgTag {
  /**
   * 创建 LinearGradient 线性渐变
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('linearGradient', setup);
  }

  /**
   * 设置渐变起点 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x1(value) {
    return this.attr('x1', value);
  }

  /**
   * 设置渐变起点 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y1(value) {
    return this.attr('y1', value);
  }

  /**
   * 设置渐变终点 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x2(value) {
    return this.attr('x2', value);
  }

  /**
   * 设置渐变终点 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y2(value) {
    return this.attr('y2', value);
  }

  /**
   * 设置渐变单位
   * @param {string} value - 单位类型（objectBoundingBox 或 userSpaceOnUse）
   * @returns {this} 返回当前实例支持链式调用
   */
  gradientUnits(value) {
    return this.attr('gradientUnits', value);
  }

  /**
   * 添加渐变色阶
   * @param {number} offset - 色阶位置（0-100）
   * @param {string} color - 颜色值
   * @param {number} [opacity=1] - 不透明度
   * @returns {this} 返回当前实例支持链式调用
   */
  stop(offset, color, opacity = 1) {
    const stopEl = new Stop(offset, color, opacity);
    this._children.push(stopEl);
    return this;
  }
}

/**
 * 创建 LinearGradient 线性渐变
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {LinearGradient} LinearGradient 实例
 */
function linearGradient(setup = null) {
  return new LinearGradient(setup);
}

/**
 * RadialGradient 径向渐变
 * @class
 * @extends SvgTag
 */
class RadialGradient extends SvgTag {
  /**
   * 创建 RadialGradient 径向渐变
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('radialGradient', setup);
  }

  /**
   * 设置渐变圆心 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cx(value) {
    return this.attr('cx', value);
  }

  /**
   * 设置渐变圆心 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cy(value) {
    return this.attr('cy', value);
  }

  /**
   * 设置渐变半径
   * @param {number|string} value - 半径值
   * @returns {this} 返回当前实例支持链式调用
   */
  r(value) {
    return this.attr('r', value);
  }

  /**
   * 设置焦点 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  fx(value) {
    return this.attr('fx', value);
  }

  /**
   * 设置焦点 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  fy(value) {
    return this.attr('fy', value);
  }

  /**
   * 添加渐变色阶
   * @param {number} offset - 色阶位置（0-100）
   * @param {string} color - 颜色值
   * @param {number} [opacity=1] - 不透明度
   * @returns {this} 返回当前实例支持链式调用
   */
  stop(offset, color, opacity = 1) {
    const stopEl = new Stop(offset, color, opacity);
    this._children.push(stopEl);
    return this;
  }
}

/**
 * 创建 RadialGradient 径向渐变
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {RadialGradient} RadialGradient 实例
 */
function radialGradient(setup = null) {
  return new RadialGradient(setup);
}

/**
 * Stop 渐变色阶
 * @class
 * @extends SvgTag
 */
class Stop extends SvgTag {
  /**
   * 创建 Stop 渐变色阶
   * @param {number} [offset=0] - 色阶位置（0-100）
   * @param {string} [color='#000'] - 颜色值
   * @param {number} [opacity=1] - 不透明度
   */
  constructor(offset = 0, color = '#000', opacity = 1) {
    super('stop');
    this.offset(offset);
    this.stopColor(color);
    this.stopOpacity(opacity);
  }

  /**
   * 设置色阶位置
   * @param {number|string} value - 位置（百分比或数值）
   * @returns {this} 返回当前实例支持链式调用
   */
  offset(value) {
    return this.attr('offset', typeof value === 'number' ? `${value}%` : value);
  }

  /**
   * 设置色阶颜色
   * @param {string} value - 颜色值
   * @returns {this} 返回当前实例支持链式调用
   */
  stopColor(value) {
    return this.attr('stop-color', value);
  }

  /**
   * 设置色阶不透明度
   * @param {number} value - 不透明度（0-1）
   * @returns {this} 返回当前实例支持链式调用
   */
  stopOpacity(value) {
    return this.attr('stop-opacity', value);
  }
}

/**
 * 创建 Stop 渐变色阶
 * @param {number} [offset=0] - 色阶位置
 * @param {string} [color='#000'] - 颜色值
 * @param {number} [opacity=1] - 不透明度
 * @returns {Stop} Stop 实例
 */
function stop(offset = 0, color = '#000', opacity = 1) {
  return new Stop(offset, color, opacity);
}

// ============================================
// 图案
// ============================================

/**
 * Pattern SVG 图案元素
 * @class
 * @extends SvgTag
 */
class Pattern extends SvgTag {
  /**
   * 创建 Pattern 图案元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('pattern', setup);
  }

  /**
   * 设置图案 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x(value) {
    return this.attr('x', value);
  }

  /**
   * 设置图案 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y(value) {
    return this.attr('y', value);
  }

  /**
   * 设置图案宽度
   * @param {number|string} value - 宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  width(value) {
    return this.attr('width', value);
  }

  /**
   * 设置图案高度
   * @param {number|string} value - 高度值
   * @returns {this} 返回当前实例支持链式调用
   */
  height(value) {
    return this.attr('height', value);
  }

  /**
   * 设置图案单位
   * @param {string} value - 单位类型（objectBoundingBox 或 userSpaceOnUse）
   * @returns {this} 返回当前实例支持链式调用
   */
  patternUnits(value) {
    return this.attr('patternUnits', value);
  }

  /**
   * 设置图案内容单位
   * @param {string} value - 单位类型（objectBoundingBox 或 userSpaceOnUse）
   * @returns {this} 返回当前实例支持链式调用
   */
  patternContentUnits(value) {
    return this.attr('patternContentUnits', value);
  }
}

/**
 * 创建 Pattern 图案元素
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Pattern} Pattern 实例
 */
function pattern(setup = null) {
  return new Pattern(setup);
}

// ============================================
// 滤镜
// ============================================

/**
 * FilterPrimitive 滤镜基类
 * @class
 * @extends SvgTag
 */
class FilterPrimitive extends SvgTag {
  /**
   * 创建 FilterPrimitive 滤镜元素
   * @param {string} tagName - SVG 滤镜标签名
   * @param {Object} [attrs={}] - 初始属性
   */
  constructor(tagName, attrs = {}) {
    super(tagName);
    for (const [k, v] of Object.entries(attrs)) {
      this.attr(k, v);
    }
  }
}

/**
 * Filter SVG 滤镜容器
 * @class
 * @extends SvgTag
 */
class Filter extends SvgTag {
  /**
   * 创建 Filter 滤镜容器
   * @param {string} id - 滤镜 ID
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(id, setup = null) {
    super('filter', setup);
    if (id) {
      this.id(id);
    }
  }

  /**
   * 添加滤镜基元
   * @param {string} type - 滤镜类型（如 GaussianBlur, DropShadow）
   * @param {Object} [attrs={}] - 滤镜属性
   * @returns {this} 返回当前实例支持链式调用
   */
  primitive(type, attrs = {}) {
    const el = new FilterPrimitive(`fe${type}`, attrs);
    this._children.push(el);
    return this;
  }

  /**
   * 添加高斯模糊滤镜
   * @param {number} stdDeviation - 模糊半径
   * @param {Object} [attrs={}] - 其他滤镜属性
   * @returns {this} 返回当前实例支持链式调用
   */
  gaussianBlur(stdDeviation, attrs = {}) {
    return this.primitive('GaussianBlur', { stdDeviation, ...attrs });
  }

  /**
   * 添加投影滤镜
   * @param {number} dx - x 方向偏移
   * @param {number} dy - y 方向偏移
   * @param {number} stdDeviation - 模糊半径
   * @param {string} [floodColor='#000'] - 阴影颜色
   * @param {number} [floodOpacity=0.5] - 阴影不透明度
   * @returns {this} 返回当前实例支持链式调用
   */
  dropShadow(dx, dy, stdDeviation, floodColor = '#000', floodOpacity = 0.5) {
    return this
      .primitive('DropShadow', { dx, dy, stdDeviation, floodColor, floodOpacity });
  }
}

/**
 * 创建 Filter 滤镜容器
 * @param {string} id - 滤镜 ID
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Filter} Filter 实例
 */
function filter(id, setup = null) {
  return new Filter(id, setup);
}

// ============================================
// 图像
// ============================================

/**
 * Image SVG 图像元素
 * @class
 * @extends SvgTag
 */
class Image extends SvgTag {
  /**
   * 创建 Image SVG 图像元素
   * @param {string} [href=''] - 图片 URL
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(href = '', setup = null) {
    super('image', setup);
    if (href) {
      this.href(href);
    }
  }

  /**
   * 设置图片 URL
   * @param {string} value - 图片 URL
   * @returns {this} 返回当前实例支持链式调用
   */
  href(value) {
    return this.attr('href', value);
  }

  /**
   * 设置 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x(value) {
    return this.attr('x', value);
  }

  /**
   * 设置 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y(value) {
    return this.attr('y', value);
  }

  /**
   * 设置宽度
   * @param {number|string} value - 宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  width(value) {
    return this.attr('width', value);
  }

  /**
   * 设置高度
   * @param {number|string} value - 高度值
   * @returns {this} 返回当前实例支持链式调用
   */
  height(value) {
    return this.attr('height', value);
  }

  /**
   * 设置preserveAspectRatio 属性
   * @param {string} value - 缩放比例（none, xMinYMin, xMidYMid, xMaxYMax 等）
   * @returns {this} 返回当前实例支持链式调用
   */
  preserveAspectRatio(value) {
    return this.attr('preserveAspectRatio', value);
  }
}

/**
 * 创建 Image SVG 图像元素
 * @param {string} [href=''] - 图片 URL
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Image} Image 实例
 */
function svgImage(href = '', setup = null) {
  return new Image(href, setup);
}

// ============================================
// 组
// ============================================

/**
 * G SVG 组元素
 * @class
 * @extends SvgTag
 */
class G extends SvgTag {
  /**
   * 创建 G 组元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('g', setup);
  }

  /**
   * 设置变换
   * @param {string} value - 变换字符串
   * @returns {this} 返回当前实例支持链式调用
   */
  transform(value) {
    if (value) {
      this._transforms.push(value);
      this.attr('transform', this._transforms.join(' '));
    }
    return this;
  }

  /**
   * 平移变换
   * @param {number} x - x 方向平移距离
   * @param {number} y - y 方向平移距离
   * @returns {this} 返回当前实例支持链式调用
   */
  translate(x, y) {
    return this.transform(`translate(${x}, ${y})`);
  }

  /**
   * 缩放变换
   * @param {number} sx - x 方向缩放比例
   * @param {number} [sy=sx] - y 方向缩放比例（默认为 sx）
   * @returns {this} 返回当前实例支持链式调用
   */
  scale(sx, sy = sx) {
    return this.transform(`scale(${sx}, ${sy})`);
  }

  /**
   * 旋转变换
   * @param {number} angle - 旋转角度（度）
   * @param {number} [cx] - 旋转中心 x 坐标
   * @param {number} [cy] - 旋转中心 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  rotate(angle, cx, cy) {
    if (cx !== undefined && cy !== undefined) {
      return this.transform(`rotate(${angle} ${cx} ${cy})`);
    }
    return this.transform(`rotate(${angle})`);
  }

  /**
   * 斜切变换（X 轴）
   * @param {number} angle - 斜切角度（度）
   * @returns {this} 返回当前实例支持链式调用
   */
  skewX(angle) {
    return this.transform(`skewX(${angle})`);
  }

  /**
   * 斜切变换（Y 轴）
   * @param {number} angle - 斜切角度（度）
   * @returns {this} 返回当前实例支持链式调用
   */
  skewY(angle) {
    return this.transform(`skewY(${angle})`);
  }

  // SVG 子元素工厂方法
  /**
   * 添加 circle 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  circle(setup = null) {
    const el = circle(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 ellipse 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  ellipse(setup = null) {
    const el = ellipse(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 rect 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  rect(setup = null) {
    const el = rect(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 line 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  line(setup = null) {
    const el = line(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 polyline 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  polyline(setup = null) {
    const el = polyline(null, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 polygon 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  polygon(setup = null) {
    const el = polygon(null, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 path 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  path(setup = null) {
    const el = path(null, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 text 子元素
   * @param {string} [content=''] - 文本内容
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  text(content = '', setup = null) {
    const el = svgText(content, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 tspan 子元素
   * @param {string} [content=''] - 文本内容
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  tspan(content = '', setup = null) {
    const el = tspan(content, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 g 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  g(setup = null) {
    const el = g(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 linearGradient 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  linearGradient(setup = null) {
    const el = linearGradient(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 radialGradient 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  radialGradient(setup = null) {
    const el = radialGradient(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 pattern 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  pattern(setup = null) {
    const el = pattern(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 filter 子元素
   * @param {string} id - 滤镜 ID
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  filter(id, setup = null) {
    const el = filter(id, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 image 子元素
   * @param {string} [href=''] - 图片 URL
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  image(href = '', setup = null) {
    const el = svgImage(href, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加任意 SVG 元素子元素
   * @param {string} tagName - SVG 标签名
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  svgElement(tagName, setup = null) {
    const el = svgElement(tagName, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 defs 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  defs(setup = null) {
    const el = defs(setup);
    this.child(el);
    return this;
  }
}

/**
 * 创建 G 组元素
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {G} G 实例
 */
function g(setup = null) {
  return new G(setup);
}

// ============================================
// 通用 SVG 元素
// ============================================

/**
 * SvgElement 通用 SVG 元素
 * @class
 * @extends SvgTag
 */
class SvgElement extends SvgTag {
  /**
   * 创建 SvgElement 通用 SVG 元素
   * @param {string} tagName - SVG 标签名
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(tagName, setup = null) {
    super(tagName, setup);
  }

  /**
   * 渲染元素到 DOM
   * @returns {SVGElement|null} 渲染后的 SVG 元素
   */
  renderDom() {
    if (this._deleted) return null;
    return super.renderDom();
  }
}

/**
 * 创建 SvgElement 通用 SVG 元素
 * @param {string} tagName - SVG 标签名
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {SvgElement} SvgElement 实例
 */
function svgElement(tagName, setup = null) {
  return new SvgElement(tagName, setup);
}

// ============================================
// 定义容器
// ============================================

/**
 * Defs SVG 定义容器
 * @class
 * @extends SvgTag
 */
class Defs extends SvgTag {
  /**
   * 创建 Defs 定义容器
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('defs', setup);
  }

  // SVG 子元素工厂方法
  /**
   * 添加 linearGradient 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  linearGradient(setup = null) {
    const el = linearGradient(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 radialGradient 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  radialGradient(setup = null) {
    const el = radialGradient(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 filter 子元素
   * @param {string} id - 滤镜 ID
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  filter(id, setup = null) {
    const el = filter(id, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 pattern 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  pattern(setup = null) {
    const el = pattern(setup);
    this.child(el);
    return this;
  }
}

/**
 * 创建 Defs 定义容器
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Defs} Defs 实例
 */
function defs(setup = null) {
  return new Defs(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 svg 子元素
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {this} 返回当前实例支持链式调用
 */
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
