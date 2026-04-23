/**
 * @fileoverview GridRenderer 网格渲染
 * 绘制背景网格
 */

class GridRenderer {
  constructor() {
    this._patternCanvas = null;
    this._patternCtx = null;
    this._lastSize = 0;
    this._lastColor = '';
  }

  /**
   * 渲染网格
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('../core/Viewport.js').Viewport} viewport - 视口
   * @param {Object} config - 网格配置
   * @param {boolean} config.enabled - 是否启用
   * @param {number} config.size - 网格大小
   * @param {string} config.color - 网格颜色
   */
  render(ctx, viewport, config) {
    if (!config.enabled) return;

    const { size, color } = config;
    const zoom = viewport.zoom;

    // 计算实际网格大小（考虑缩放）
    const scaledSize = size * zoom;

    // 如果网格太小或太大，不渲染
    if (scaledSize < 2 || scaledSize > 1000) return;

    // 获取或创建图案
    const pattern = this._getPattern(ctx, scaledSize, color);

    // 绘制网格背景
    ctx.save();
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, viewport.canvasWidth, viewport.canvasHeight);
    ctx.restore();
  }

  /**
   * 获取或创建图案
   * @private
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {number} size - 图案大小
   * @param {string} color - 颜色
   * @returns {CanvasPattern} 图案
   */
  _getPattern(ctx, size, color) {
    // 检查缓存
    if (this._patternCanvas && this._lastSize === size && this._lastColor === color) {
      return ctx.createPattern(this._patternCanvas, 'repeat');
    }

    // 创建新图案
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const patternCtx = canvas.getContext('2d');

    // 绘制网格线
    patternCtx.strokeStyle = color;
    patternCtx.lineWidth = 1;

    // 水平线
    patternCtx.beginPath();
    patternCtx.moveTo(0, 0);
    patternCtx.lineTo(size, 0);
    patternCtx.stroke();

    // 垂直线
    patternCtx.beginPath();
    patternCtx.moveTo(0, 0);
    patternCtx.lineTo(0, size);
    patternCtx.stroke();

    // 缓存
    this._patternCanvas = canvas;
    this._lastSize = size;
    this._lastColor = color;

    return ctx.createPattern(canvas, 'repeat');
  }

  /**
   * 渲染带坐标的网格（调试用）
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('../core/Viewport.js').Viewport} viewport - 视口
   * @param {Object} config - 网格配置
   */
  renderWithLabels(ctx, viewport, config) {
    this.render(ctx, viewport, config);

    if (!config.enabled) return;

    const { size } = config;
    const zoom = viewport.zoom;
    const scaledSize = size * zoom;

    ctx.save();
    ctx.fillStyle = config.color || '#999';
    ctx.font = '10px sans-serif';

    // 渲染 X 轴标签
    for (let x = 0; x < viewport.canvasWidth; x += scaledSize) {
      const worldX = viewport.screenToWorld(x, 0).x;
      ctx.fillText(Math.round(worldX).toString(), x + 2, 12);
    }

    // 渲染 Y 轴标签
    for (let y = 0; y < viewport.canvasHeight; y += scaledSize) {
      const worldY = viewport.screenToWorld(0, y).y;
      ctx.fillText(Math.round(worldY).toString(), 2, y + 12);
    }

    ctx.restore();
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this._patternCanvas = null;
    this._lastSize = 0;
    this._lastColor = '';
  }
}

export { GridRenderer };
