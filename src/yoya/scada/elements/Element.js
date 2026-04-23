/**
 * @fileoverview Element 元素基类
 * 所有可显示在布局容器中的元素的基类
 */

import { EventEmitter } from '../utils/EventEmitter.js';

class Element extends EventEmitter {
  constructor(id, options = {}) {
    super();

    this.id = id;
    this.name = options.name || id;
    this.type = options.type || 'element';

    // 位置和大小（相对于父容器的局部坐标）
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.width = options.width ?? 100;
    this.height = options.height ?? 50;

    // 样式
    this.fillColor = options.fillColor || '#ffffff';
    this.strokeColor = options.strokeColor || '#cccccc';
    this.strokeWidth = options.strokeWidth ?? 1;
    this.opacity = options.opacity ?? 1.0;

    // 状态
    this.visible = options.visible ?? true;
    this.locked = options.locked ?? false;
    this.selected = options.selected ?? false;
    this.enabled = options.enabled ?? true;

    // 父容器引用
    this.parent = null;

    // 数据绑定
    this._dataBinding = null;
    this._dataValue = null;
  }

  /**
   * 绑定数据源
   * @param {Object} dataSource - 数据源对象，需有 getValue 方法
   * @returns {this}
   */
  bindData(dataSource) {
    this._dataBinding = dataSource;
    this._updateFromData();
    return this;
  }

  /**
   * 从数据源更新
   * @protected
   */
  _updateFromData() {
    if (this._dataBinding && typeof this._dataBinding.getValue === 'function') {
      this._dataValue = this._dataBinding.getValue();
      this.onDataUpdate(this._dataValue);
    }
  }

  /**
   * 数据更新回调（子类重写）
   * @protected
   * @param {any} value - 数据值
   */
  onDataUpdate(value) {
    // 子类实现具体的数据显示逻辑
  }

  /**
   * 检查点是否在元素内
   * @param {number} x - X 坐标（局部坐标）
   * @param {number} y - Y 坐标（局部坐标）
   * @returns {boolean}
   */
  containsPoint(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
  }

  /**
   * 获取边界框
   * @returns {{minX: number, minY: number, maxX: number, maxY: number}}
   */
  getBounds() {
    return {
      minX: this.x,
      minY: this.y,
      maxX: this.x + this.width,
      maxY: this.y + this.height
    };
  }

  /**
   * 设置位置
   * @param {number} x - X 坐标
   * @param {number} y - Y 坐标
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.emit('change', { type: 'setPosition', x, y });
    return this;
  }

  /**
   * 设置大小
   * @param {number} width - 宽度
   * @param {number} height - 高度
   */
  setSize(width, height) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.emit('change', { type: 'setSize', width: this.width, height: this.height });
    return this;
  }

  /**
   * 移动（相对偏移）
   * @param {number} dx - X 偏移量
   * @param {number} dy - Y 偏移量
   */
  translate(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.emit('change', { type: 'translate', dx, dy });
    return this;
  }

  /**
   * 渲染方法（子类实现）
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('../core/Viewport.js').Viewport} viewport - 视口
   * @param {{minX: number, minY: number, maxX: number, maxY: number}} parentBounds - 父容器边界
   */
  render(ctx, viewport, parentBounds) {
    if (!this.visible) return;
    // 子类实现具体的渲染逻辑
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
      selected: this.selected,
      enabled: this.enabled
    };
  }

  /**
   * 从 JSON 恢复（静态方法，子类需重写）
   * @param {Object} data - JSON 数据
   * @returns {Element}
   */
  static fromJSON(data) {
    return new Element(data.id, {
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
      selected: data.selected,
      enabled: data.enabled
    });
  }
}

export { Element };
