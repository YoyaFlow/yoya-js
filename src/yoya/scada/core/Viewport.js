/**
 * @fileoverview Viewport 视口变换
 * 管理画布的缩放和平移
 */

import { EventEmitter } from '../utils/EventEmitter.js';
import { Matrix2D } from '../utils/Matrix2D.js';

class Viewport extends EventEmitter {
  constructor(options = {}) {
    super();

    this.zoom = options.zoom ?? 1.0;
    this.offsetX = options.offsetX ?? 0;
    this.offsetY = options.offsetY ?? 0;
    this.minZoom = options.minZoom ?? 0.1;
    this.maxZoom = options.maxZoom ?? 10.0;
    this.canvasWidth = options.canvasWidth ?? 1920;
    this.canvasHeight = options.canvasHeight ?? 1080;

    // 内容边界（用于 fitToContent）
    this.contentBounds = null;

    // 变换矩阵缓存
    this._matrixCache = null;
    this._matrixCacheValid = false;
  }

  /**
   * 设置缩放（以某点为中心）
   * @param {number} zoom - 目标缩放
   * @param {number} centerX - 中心点 X（屏幕坐标）
   * @param {number} centerY - 中心点 Y（屏幕坐标）
   */
  setZoom(zoom, centerX = 0, centerY = 0) {
    // 限制缩放范围
    zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));

    if (zoom === this.zoom) return;

    // 计算世界坐标（缩放前的中心点）
    const worldX = (centerX - this.offsetX) / this.zoom;
    const worldY = (centerY - this.offsetY) / this.zoom;

    // 更新缩放
    this.zoom = zoom;

    // 调整偏移，保持中心点世界坐标不变
    this.offsetX = centerX - worldX * zoom;
    this.offsetY = centerY - worldY * zoom;

    this._invalidateMatrix();
    this.emit('change', {
      type: 'zoom',
      zoom: this.zoom,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    });
  }

  /**
   * 放大
   * @param {number} step - 缩放步长（默认 1.2）
   * @param {number} centerX - 中心点 X
   * @param {number} centerY - 中心点 Y
   */
  zoomIn(step = 1.2, centerX = 0, centerY = 0) {
    this.setZoom(this.zoom * step, centerX, centerY);
  }

  /**
   * 缩小
   * @param {number} step - 缩放步长（默认 1.2）
   * @param {number} centerX - 中心点 X
   * @param {number} centerY - 中心点 Y
   */
  zoomOut(step = 1.2, centerX = 0, centerY = 0) {
    this.setZoom(this.zoom / step, centerX, centerY);
  }

  /**
   * 重置缩放
   */
  resetZoom() {
    this.setZoom(1.0);
  }

  /**
   * 平移
   * @param {number} deltaX - X 偏移量
   * @param {number} deltaY - Y 偏移量
   */
  pan(deltaX, deltaY) {
    this.offsetX += deltaX;
    this.offsetY += deltaY;

    this._invalidateMatrix();
    this.emit('change', {
      type: 'pan',
      zoom: this.zoom,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    });
  }

  /**
   * 适应内容
   * @param {{minX: number, minY: number, maxX: number, maxY: number}} bounds - 内容边界
   * @param {number} padding - 边距（像素）
   */
  fitToContent(bounds, padding = 20) {
    if (!bounds) return;

    this.contentBounds = bounds;

    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;

    if (contentWidth === 0 || contentHeight === 0) return;

    // 计算缩放比例
    const scaleX = (this.canvasWidth - padding * 2) / contentWidth;
    const scaleY = (this.canvasHeight - padding * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // 不超过 100%

    // 限制缩放范围
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, scale));

    // 计算偏移（居中显示）
    const scaledWidth = contentWidth * newZoom;
    const scaledHeight = contentHeight * newZoom;

    this.zoom = newZoom;
    this.offsetX = (this.canvasWidth - scaledWidth) / 2 - bounds.minX * newZoom;
    this.offsetY = (this.canvasHeight - scaledHeight) / 2 - bounds.minY * newZoom;

    this._invalidateMatrix();
    this.emit('change', {
      type: 'fit',
      zoom: this.zoom,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    });
  }

  /**
   * 屏幕坐标转世界坐标
   * @param {number} screenX - 屏幕 X
   * @param {number} screenY - 屏幕 Y
   * @returns {{x: number, y: number}} 世界坐标
   */
  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.offsetX) / this.zoom,
      y: (screenY - this.offsetY) / this.zoom
    };
  }

  /**
   * 世界坐标转屏幕坐标
   * @param {number} worldX - 世界 X
   * @param {number} worldY - 世界 Y
   * @returns {{x: number, y: number}} 屏幕坐标
   */
  worldToScreen(worldX, worldY) {
    return {
      x: worldX * this.zoom + this.offsetX,
      y: worldY * this.zoom + this.offsetY
    };
  }

  /**
   * 获取变换矩阵
   * @returns {Matrix2D} 变换矩阵
   */
  getTransformMatrix() {
    if (!this._matrixCacheValid) {
      this._matrixCache = Matrix2D.translate(this.offsetX, this.offsetY)
        .scale(this.zoom, this.zoom);
      this._matrixCacheValid = true;
    }
    return this._matrixCache.clone();
  }

  /**
   * 应用变换到 Canvas 上下文
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   */
  applyTransform(ctx) {
    ctx.setTransform(this.zoom, 0, 0, this.zoom, this.offsetX, this.offsetY);
  }

  /**
   * 重置变换
   */
  reset() {
    this.zoom = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;
    this._invalidateMatrix();
    this.emit('change', {
      type: 'reset',
      zoom: this.zoom,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    });
  }

  /**
   * 设置画布大小
   * @param {number} width - 宽度
   * @param {number} height - 高度
   */
  setCanvasSize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  /**
   * 获取可见区域（世界坐标）
   * @returns {{minX: number, minY: number, maxX: number, maxY: number}} 可见区域
   */
  getVisibleBounds() {
    const topLeft = this.screenToWorld(0, 0);
    const bottomRight = this.screenToWorld(this.canvasWidth, this.canvasHeight);

    return {
      minX: topLeft.x,
      minY: topLeft.y,
      maxX: bottomRight.x,
      maxY: bottomRight.y
    };
  }

  /**
   * 检查元素是否在视口内
   * @param {{x: number, y: number, width: number, height: number}} bounds - 元素边界
   * @returns {boolean} 是否可见
   */
  isInViewport(bounds) {
    const visible = this.getVisibleBounds();
    return !(
      bounds.x + bounds.width < visible.minX ||
      bounds.x > visible.maxX ||
      bounds.y + bounds.height < visible.minY ||
      bounds.y > visible.maxY
    );
  }

  /**
   * 失效矩阵缓存
   * @private
   */
  _invalidateMatrix() {
    this._matrixCacheValid = false;
  }

  /**
   * 序列化为 JSON
   * @returns {Object} JSON 对象
   */
  toJSON() {
    return {
      zoom: this.zoom,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      contentBounds: this.contentBounds
    };
  }

  /**
   * 从 JSON 恢复
   * @param {Object} data - JSON 数据
   */
  fromJSON(data) {
    if (data.zoom !== undefined) this.zoom = data.zoom;
    if (data.offsetX !== undefined) this.offsetX = data.offsetX;
    if (data.offsetY !== undefined) this.offsetY = data.offsetY;
    if (data.minZoom !== undefined) this.minZoom = data.minZoom;
    if (data.maxZoom !== undefined) this.maxZoom = data.maxZoom;
    if (data.contentBounds) this.contentBounds = data.contentBounds;
    this._invalidateMatrix();
  }
}

export { Viewport };
