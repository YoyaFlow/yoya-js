/**
 * @fileoverview LayoutContainer 布局容器
 * 表示画布上的一个布局容器，可包含子容器
 */

import { EventEmitter } from '../utils/EventEmitter.js';

class LayoutContainer extends EventEmitter {
  constructor(id, options = {}) {
    super();

    this.id = id;
    this.name = options.name || id;
    this.type = options.type || 'rect'; // rect, circle, ellipse, etc.

    // 位置和大小（世界坐标）
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.width = options.width ?? 100;
    this.height = options.height ?? 100;

    // 样式
    this.fillColor = options.fillColor || '#cce5ff';
    this.strokeColor = options.strokeColor || '#0066cc';
    this.strokeWidth = options.strokeWidth ?? 2;
    this.opacity = options.opacity ?? 1.0;

    // 状态
    this.visible = options.visible ?? true;
    this.locked = options.locked ?? false;
    this.selected = options.selected ?? false;

    // 子容器
    this.children = [];

    // 元素列表（新增）
    this.elements = [];

    // 父容器引用
    this.parent = null;

    // 边界框
    this._boundsCache = null;

    // 布局模式（新增）
    this.layoutMode = options.layoutMode || 'free'; // free, hbox, vbox, grid

    // 布局约束（新增）
    this.layoutConstraints = {
      gap: options.gap ?? 8,
      padding: options.padding ?? 8,
      columns: options.columns ?? 2,
      rows: options.rows ?? 2,
      alignment: options.alignment || 'center' // start, center, end, stretch
    };
  }

  /**
   * 获取边界框
   * @returns {{minX: number, minY: number, maxX: number, maxY: number}}
   */
  getBounds() {
    if (this._boundsCache) return this._boundsCache;

    let minX = this.x;
    let minY = this.y;
    let maxX = this.x + this.width;
    let maxY = this.y + this.height;

    // 包含子容器
    for (const child of this.children) {
      const childBounds = child.getBounds();
      minX = Math.min(minX, childBounds.minX);
      minY = Math.min(minY, childBounds.minY);
      maxX = Math.max(maxX, childBounds.maxX);
      maxY = Math.max(maxY, childBounds.maxY);
    }

    this._boundsCache = { minX, minY, maxX, maxY };
    return this._boundsCache;
  }

  /**
   * 清除边界缓存
   */
  _invalidateBounds() {
    this._boundsCache = null;
    if (this.parent) {
      this.parent._invalidateBounds();
    }
  }

  /**
   * 检查点是否在容器内
   * @param {number} x - X 坐标（世界坐标）
   * @param {number} y - Y 坐标（世界坐标）
   * @returns {boolean}
   */
  containsPoint(x, y) {
    const bounds = this.getBounds();
    return x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;
  }

  /**
   * 添加子容器
   * @param {LayoutContainer} child - 子容器
   */
  addChild(child) {
    child.parent = this;
    this.children.push(child);
    this._invalidateBounds();
    this.emit('change', { type: 'addChild', child });
  }

  /**
   * 移除子容器
   * @param {LayoutContainer} child - 子容器
   * @returns {LayoutContainer|null} 被移除的容器
   */
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null;
      this._invalidateBounds();
      this.emit('change', { type: 'removeChild', child });
      return child;
    }
    return null;
  }

  /**
   * 添加元素
   * @param {import('../elements/Element.js').Element} element - 元素
   * @returns {this}
   */
  addElement(element) {
    element.parent = this;
    this.elements.push(element);
    this.emit('change', { type: 'addElement', element });
    return this;
  }

  /**
   * 移除元素
   * @param {import('../elements/Element.js').Element} element - 元素
   * @returns {import('../elements/Element.js').Element|null} 被移除的元素
   */
  removeElement(element) {
    const index = this.elements.indexOf(element);
    if (index > -1) {
      this.elements.splice(index, 1);
      element.parent = null;
      this.emit('change', { type: 'removeElement', element });
      return element;
    }
    return null;
  }

  /**
   * 获取元素（通过 ID）
   * @param {string} id - 元素 ID
   * @returns {import('../elements/Element.js').Element|null}
   */
  getElement(id) {
    return this.elements.find(el => el.id === id) || null;
  }

  /**
   * 获取元素（通过坐标）
   * @param {number} x - X 坐标（局部坐标）
   * @param {number} y - Y 坐标（局部坐标）
   * @returns {import('../elements/Element.js').Element|null}
   */
  getElementAtPoint(x, y) {
    // 从顶到底遍历
    for (const element of this.elements.reverse()) {
      if (element.containsPoint(x, y)) {
        return element;
      }
    }
    return null;
  }

  /**
   * 移除所有元素
   */
  removeAllElements() {
    for (const element of this.elements) {
      element.parent = null;
    }
    this.elements = [];
    this.emit('change', { type: 'removeAllElements' });
  }

  /**
   * 设置位置
   * @param {number} x - X 坐标
   * @param {number} y - Y 坐标
   */
  setPosition(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    this.x = x;
    this.y = y;

    // 移动子容器
    for (const child of this.children) {
      child.setPosition(child.x + dx, child.y + dy);
    }

    this._invalidateBounds();
    this.emit('change', { type: 'setPosition', x, y });
  }

  /**
   * 设置大小
   * @param {number} width - 宽度
   * @param {number} height - 高度
   */
  setSize(width, height) {
    this.width = Math.max(10, width);
    this.height = Math.max(10, height);
    this._invalidateBounds();
    this.emit('change', { type: 'setSize', width: this.width, height: this.height });
  }

  /**
   * 移动（相对偏移）
   * @param {number} dx - X 偏移量
   * @param {number} dy - Y 偏移量
   */
  translate(dx, dy) {
    this.setPosition(this.x + dx, this.y + dy);
  }

  /**
   * 渲染自身
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('./Viewport.js').Viewport} viewport - 视口
   */
  render(ctx, viewport) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    switch (this.type) {
      case 'rect':
        this._renderRect(ctx);
        break;
      case 'circle':
        this._renderCircle(ctx);
        break;
      case 'ellipse':
        this._renderEllipse(ctx);
        break;
      case 'roundedRect':
        this._renderRoundedRect(ctx);
        break;
      default:
        this._renderRect(ctx);
    }

    // 渲染子容器
    for (const child of this.children) {
      child.render(ctx, viewport);
    }

    // 渲染元素（新增）
    const parentBounds = this.getBounds();
    for (const element of this.elements) {
      element.render(ctx, viewport, parentBounds);
    }

    ctx.restore();
  }

  /**
   * 渲染矩形
   * @private
   */
  _renderRect(ctx) {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  /**
   * 渲染圆形
   * @private
   */
  _renderCircle(ctx) {
    const radius = Math.min(this.width, this.height) / 2;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;
    ctx.stroke();
  }

  /**
   * 渲染椭圆
   * @private
   */
  _renderEllipse(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radiusX = this.width / 2;
    const radiusY = this.height / 2;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;
    ctx.stroke();
  }

  /**
   * 渲染圆角矩形
   * @private
   */
  _renderRoundedRect(ctx) {
    const radius = Math.min(this.width, this.height) / 10;
    const x = this.x;
    const y = this.y;
    const w = this.width;
    const h = this.height;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;
    ctx.stroke();
  }

  /**
   * 序列化为 JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      opacity: this.opacity,
      visible: this.visible,
      locked: this.locked,
      children: this.children.map(child => child.toJSON()),
      elements: this.elements.map(el => el.toJSON()),
      layoutMode: this.layoutMode,
      layoutConstraints: this.layoutConstraints
    };
  }

  /**
   * 从 JSON 恢复
   * @param {Object} data - JSON 数据
   * @param {Function} elementFromJSON - 元素 fromJSON 函数映射表
   * @returns {LayoutContainer}
   */
  static fromJSON(data, elementFromJSON = null) {
    const container = new LayoutContainer(data.id, {
      name: data.name,
      type: data.type,
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height,
      fillColor: data.fillColor,
      strokeColor: data.strokeColor,
      strokeWidth: data.strokeWidth,
      opacity: data.opacity,
      visible: data.visible,
      locked: data.locked,
      layoutMode: data.layoutMode,
      gap: data.layoutConstraints?.gap,
      padding: data.layoutConstraints?.padding,
      columns: data.layoutConstraints?.columns,
      rows: data.layoutConstraints?.rows,
      alignment: data.layoutConstraints?.alignment
    });

    if (data.children) {
      for (const childData of data.children) {
        const child = LayoutContainer.fromJSON(childData, elementFromJSON);
        container.addChild(child);
      }
    }

    // 恢复元素
    if (data.elements && elementFromJSON) {
      for (const elData of data.elements) {
        const createFn = elementFromJSON[elData.type];
        if (createFn && typeof createFn === 'function') {
          const element = createFn(elData);
          container.addElement(element);
        }
      }
    }

    return container;
  }
}

export { LayoutContainer };
