/**
 * @fileoverview RulerRenderer 标尺渲染
 * 绘制水平和垂直标尺
 */

class RulerRenderer {
  constructor() {
    this._majorTickInterval = 100; // 主刻度间隔（世界坐标）
    this._minorTickInterval = 10;  // 次刻度间隔（世界坐标）
  }

  /**
   * 渲染标尺
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('../core/Viewport.js').Viewport} viewport - 视口
   * @param {Object} config - 标尺配置
   * @param {boolean} config.enabled - 是否启用
   * @param {string} config.unit - 单位
   * @param {boolean} config.showMeasurements - 是否显示刻度值
   * @param {number} config.width - 标尺宽度
   * @param {string} config.backgroundColor - 背景色
   * @param {string} config.textColor - 文字颜色
   */
  render(ctx, viewport, config) {
    if (!config.enabled) return;

    const {
      width,
      backgroundColor,
      textColor,
      showMeasurements
    } = config;

    ctx.save();

    // 绘制背景
    ctx.fillStyle = backgroundColor || '#f5f5f5';
    ctx.fillRect(0, 0, viewport.canvasWidth, width);
    ctx.fillRect(0, 0, width, viewport.canvasHeight);

    // 绘制边框
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width, viewport.canvasHeight);
    ctx.moveTo(0, width);
    ctx.lineTo(viewport.canvasWidth, width);
    ctx.stroke();

    // 绘制水平标尺
    this._renderHorizontalRuler(ctx, viewport, width, textColor || '#666', showMeasurements);

    // 绘制垂直标尺
    this._renderVerticalRuler(ctx, viewport, width, textColor || '#666', showMeasurements);

    ctx.restore();
  }

  /**
   * 渲染水平标尺
   * @private
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('../core/Viewport.js').Viewport} viewport - 视口
   * @param {number} rulerSize - 标尺大小
   * @param {string} textColor - 文字颜色
   * @param {boolean} showMeasurements - 是否显示刻度值
   */
  _renderHorizontalRuler(ctx, viewport, rulerSize, textColor, showMeasurements) {
    const zoom = viewport.zoom;
    const offsetY = rulerSize;

    // 计算可见区域的世界坐标范围
    const visibleBounds = viewport.getVisibleBounds();
    const startX = Math.floor(visibleBounds.minX / this._minorTickInterval) * this._minorTickInterval;
    const endX = Math.ceil(visibleBounds.maxX / this._minorTickInterval) * this._minorTickInterval;

    ctx.strokeStyle = textColor;
    ctx.fillStyle = textColor;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';

    // 绘制刻度
    for (let x = startX; x <= endX; x += this._minorTickInterval) {
      const screenPos = viewport.worldToScreen(x, 0).x;

      // 跳过标尺区域外的刻度
      if (screenPos < rulerSize) continue;

      const isMajor = x % this._majorTickInterval === 0;
      const tickHeight = isMajor ? 8 : 4;

      // 绘制刻度线
      ctx.beginPath();
      ctx.moveTo(screenPos, offsetY);
      ctx.lineTo(screenPos, offsetY + tickHeight);
      ctx.stroke();

      // 绘制主刻度标签
      if (isMajor && showMeasurements && zoom > 0.5) {
        ctx.fillText(x.toString(), screenPos, offsetY + 20);
      }
    }
  }

  /**
   * 渲染垂直标尺
   * @private
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('../core/Viewport.js').Viewport} viewport - 视口
   * @param {number} rulerSize - 标尺大小
   * @param {string} textColor - 文字颜色
   * @param {boolean} showMeasurements - 是否显示刻度值
   */
  _renderVerticalRuler(ctx, viewport, rulerSize, textColor, showMeasurements) {
    const zoom = viewport.zoom;
    const offsetX = rulerSize;

    // 计算可见区域的世界坐标范围
    const visibleBounds = viewport.getVisibleBounds();
    const startY = Math.floor(visibleBounds.minY / this._minorTickInterval) * this._minorTickInterval;
    const endY = Math.ceil(visibleBounds.maxY / this._minorTickInterval) * this._minorTickInterval;

    ctx.strokeStyle = textColor;
    ctx.fillStyle = textColor;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';

    // 绘制刻度
    for (let y = startY; y <= endY; y += this._minorTickInterval) {
      const screenPos = viewport.worldToScreen(0, y).y;

      // 跳过标尺区域外的刻度
      if (screenPos < rulerSize) continue;

      const isMajor = y % this._majorTickInterval === 0;
      const tickWidth = isMajor ? 8 : 4;

      // 绘制刻度线
      ctx.beginPath();
      ctx.moveTo(offsetX, screenPos);
      ctx.lineTo(offsetX + tickWidth, screenPos);
      ctx.stroke();

      // 绘制主刻度标签
      if (isMajor && showMeasurements && zoom > 0.5) {
        ctx.fillText(y.toString(), offsetX - 2, screenPos + 4);
      }
    }
  }

  /**
   * 设置刻度间隔
   * @param {number} majorInterval - 主刻度间隔
   * @param {number} minorInterval - 次刻度间隔
   */
  setTickIntervals(majorInterval, minorInterval) {
    this._majorTickInterval = majorInterval;
    this._minorTickInterval = minorInterval;
  }

  /**
   * 获取标尺大小
   * @param {Object} config - 标尺配置
   * @returns {number} 标尺大小
   */
  getRulerSize(config) {
    return config.enabled ? (config.width || 30) : 0;
  }
}

export { RulerRenderer };
