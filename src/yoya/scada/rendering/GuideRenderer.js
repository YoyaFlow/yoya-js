/**
 * @fileoverview GuideRenderer 参考线渲染
 * 绘制水平和垂直参考线
 */

class GuideRenderer {
  constructor() {
    this._guides = {
      horizontal: [],
      vertical: []
    };
  }

  /**
   * 渲染参考线
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('../core/Viewport.js').Viewport} viewport - 视口
   * @param {Object} config - 参考线配置
   * @param {boolean} config.enabled - 是否启用
   * @param {string} config.color - 参考线颜色
   * @param {number} config.lineWidth - 线宽
   */
  render(ctx, viewport, config) {
    if (!config.enabled) return;

    const {
      color = '#ff0000',
      lineWidth = 1
    } = config;

    ctx.save();

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash([5, 5]);

    // 绘制水平参考线
    for (const y of this._guides.horizontal) {
      const screenY = viewport.worldToScreen(0, y).y;
      if (screenY >= 0 && screenY <= viewport.canvasHeight) {
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(viewport.canvasWidth, screenY);
        ctx.stroke();
      }
    }

    // 绘制垂直参考线
    for (const x of this._guides.vertical) {
      const screenX = viewport.worldToScreen(x, 0).x;
      if (screenX >= 0 && screenX <= viewport.canvasWidth) {
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, viewport.canvasHeight);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /**
   * 添加水平参考线
   * @param {number} y - Y 坐标（世界坐标）
   */
  addHorizontalGuide(y) {
    if (!this._guides.horizontal.includes(y)) {
      this._guides.horizontal.push(y);
    }
  }

  /**
   * 添加垂直参考线
   * @param {number} x - X 坐标（世界坐标）
   */
  addVerticalGuide(x) {
    if (!this._guides.vertical.includes(x)) {
      this._guides.vertical.push(x);
    }
  }

  /**
   * 移除水平参考线
   * @param {number} y - Y 坐标
   */
  removeHorizontalGuide(y) {
    this._guides.horizontal = this._guides.horizontal.filter(g => g !== y);
  }

  /**
   * 移除垂直参考线
   * @param {number} x - X 坐标
   */
  removeVerticalGuide(x) {
    this._guides.vertical = this._guides.vertical.filter(g => g !== x);
  }

  /**
   * 清空所有参考线
   */
  clear() {
    this._guides.horizontal = [];
    this._guides.vertical = [];
  }

  /**
   * 获取所有参考线
   * @returns {{horizontal: number[], vertical: number[]}} 参考线数组
   */
  getGuides() {
    return { ...this._guides };
  }

  /**
   * 从屏幕坐标创建参考线
   * @param {number} screenX - 屏幕 X
   * @param {number} screenY - 屏幕 Y
   * @param {import('../core/Viewport.js').Viewport} viewport - 视口
   */
  createGuideFromScreen(screenX, screenY, viewport) {
    const world = viewport.screenToWorld(screenX, screenY);

    // 根据鼠标位置决定创建水平还是垂直参考线
    const horizontalDist = Math.min(
      ...this._guides.horizontal.map(y => Math.abs(viewport.worldToScreen(0, y).y - screenY))
    );
    const verticalDist = Math.min(
      ...this._guides.vertical.map(x => Math.abs(viewport.worldToScreen(x, 0).x - screenX))
    );

    if (horizontalDist < verticalDist) {
      this.addHorizontalGuide(world.y);
      return { type: 'horizontal', value: world.y };
    } else {
      this.addVerticalGuide(world.x);
      return { type: 'vertical', value: world.x };
    }
  }

  /**
   * 获取最近的参考线（用于吸附）
   * @param {number} x - X 坐标（世界坐标）
   * @param {number} y - Y 坐标（世界坐标）
   * @param {number} snapDistance - 吸附距离
   * @returns {{x: number|null, y: number|null}} 吸附后的坐标
   */
  snap(x, y, snapDistance = 5) {
    let snappedX = null;
    let snappedY = null;

    // 检查垂直参考线
    for (const guideX of this._guides.vertical) {
      if (Math.abs(guideX - x) <= snapDistance) {
        snappedX = guideX;
        break;
      }
    }

    // 检查水平参考线
    for (const guideY of this._guides.horizontal) {
      if (Math.abs(guideY - y) <= snapDistance) {
        snappedY = guideY;
        break;
      }
    }

    return { x: snappedX, y: snappedY };
  }

  /**
   * 序列化为 JSON
   * @returns {Object} JSON 对象
   */
  toJSON() {
    return {
      horizontal: [...this._guides.horizontal],
      vertical: [...this._guides.vertical]
    };
  }

  /**
   * 从 JSON 恢复
   * @param {Object} data - JSON 数据
   */
  fromJSON(data) {
    if (data.horizontal) {
      this._guides.horizontal = [...data.horizontal];
    }
    if (data.vertical) {
      this._guides.vertical = [...data.vertical];
    }
  }
}

export { GuideRenderer };
