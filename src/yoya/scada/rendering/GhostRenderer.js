/**
 * @fileoverview GhostRenderer 虚影渲染器
 * 用于戴森球计划式拾取操作，显示跟随鼠标的虚影
 */

class GhostRenderer {
  constructor() {
    this._container = null;
    this._opacity = 0.6;
    this._useContainerColor = true; // 使用容器原色
    this._color = 'rgba(0, 102, 204, 0.6)';
    this._borderColor = 'rgba(0, 102, 204, 0.9)';
    this._borderWidth = 2;
    this._dashPattern = [5, 5];
    this._previewX = null;  // 预览位置的 X 坐标
    this._previewY = null;  // 预览位置的 Y 坐标
  }

  /**
   * 设置拾取的容器
   * @param {import('../core/LayoutContainer.js').LayoutContainer} container
   */
  setContainer(container) {
    this._container = container;
    // 清除之前的预览位置，避免使用旧位置
    this._previewX = null;
    this._previewY = null;
  }

  /**
   * 设置预览位置（虚影位置）
   * @param {number} x - 世界坐标 X
   * @param {number} y - 世界坐标 Y
   */
  setPreviewPosition(x, y) {
    this._previewX = x;
    this._previewY = y;
  }

  /**
   * 清除拾取的容器
   */
  clear() {
    this._container = null;
    this._previewX = null;
    this._previewY = null;
  }

  /**
   * 获取拾取的容器
   * @returns {import('../core/LayoutContainer.js').LayoutContainer|null}
   */
  getContainer() {
    return this._container;
  }

  /**
   * 渲染虚影
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('./Viewport.js').Viewport} viewport - 视口
   */
  render(ctx, viewport) {
    if (!this._container) return;

    ctx.save();

    // 使用预览位置（如果有），否则使用容器当前位置
    const x = this._previewX !== null ? this._previewX : this._container.x;
    const y = this._previewY !== null ? this._previewY : this._container.y;

    // 设置虚影样式
    ctx.globalAlpha = this._opacity;

    if (this._useContainerColor && this._container.fillColor) {
      ctx.fillStyle = this._container.fillColor;
      ctx.strokeStyle = this._container.strokeColor;
    } else {
      ctx.fillStyle = this._color;
      ctx.strokeStyle = this._borderColor;
    }

    ctx.lineWidth = this._borderWidth;
    ctx.setLineDash(this._dashPattern);

    // 绘制虚影
    ctx.beginPath();
    switch (this._container.type) {
      case 'rect':
        ctx.rect(x, y, this._container.width, this._container.height);
        break;
      case 'circle': {
        const radius = Math.min(this._container.width, this._container.height) / 2;
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
        break;
      }
      case 'ellipse':
        ctx.ellipse(
          x + this._container.width / 2,
          y + this._container.height / 2,
          this._container.width / 2,
          this._container.height / 2,
          0, 0, Math.PI * 2
        );
        break;
      case 'roundedRect': {
        const radius = Math.min(this._container.width, this._container.height) / 4;
        ctx.roundRect(x, y, this._container.width, this._container.height, radius);
        break;
      }
    }
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * 设置虚影样式
   * @param {string} color - 填充颜色
   * @param {string} borderColor - 边框颜色
   * @param {number} opacity - 透明度
   */
  setStyle(color, borderColor, opacity) {
    if (color) this._color = color;
    if (borderColor) this._borderColor = borderColor;
    if (opacity !== undefined) this._opacity = opacity;
  }
}

export { GhostRenderer };
