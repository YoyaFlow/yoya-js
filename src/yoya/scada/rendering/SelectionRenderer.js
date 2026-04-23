/**
 * @fileoverview SelectionRenderer 选中渲染器
 * 渲染选中容器的高亮框和控制点
 */

class SelectionRenderer {
  constructor() {
    this._handleSize = 8;
    this._handleColor = '#0066cc';
    this._borderColor = '#0066cc';
    this._borderWidth = 2;
  }

  /**
   * 渲染选中效果
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('./ContainerManager.js').ContainerManager} containerManager - 容器管理器
   * @param {import('./Viewport.js').Viewport} viewport - 视口
   */
  render(ctx, containerManager, viewport) {
    // 渲染容器选中
    const selectedId = containerManager.selectedContainerId;
    if (selectedId) {
      const container = containerManager.getContainer(selectedId);
      if (container && container.visible) {
        this._renderContainerSelection(ctx, container, viewport);
      }
    }

    // 渲染元素选中（新增）
    const selectedElementId = containerManager.selectedElementId;
    if (selectedElementId) {
      const selectedElement = containerManager.getSelectedElement();
      if (selectedElement && selectedElement.visible) {
        this._renderElementSelection(ctx, selectedElement, viewport);
      }
    }
  }

  /**
   * 渲染容器选中效果
   * @private
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('../core/LayoutContainer.js').LayoutContainer} container - 容器
   * @param {import('./Viewport.js').Viewport} viewport - 视口
   */
  _renderContainerSelection(ctx, container, viewport) {
    ctx.save();

    // 绘制选中边框
    ctx.strokeStyle = this._borderColor;
    ctx.lineWidth = this._borderWidth;
    ctx.setLineDash([4, 2]);

    const bounds = container.getBounds();
    const padding = 4;

    ctx.strokeRect(
      bounds.minX - padding,
      bounds.minY - padding,
      bounds.maxX - bounds.minX + padding * 2,
      bounds.maxY - bounds.minY + padding * 2
    );

    ctx.setLineDash([]);

    // 绘制控制点（只在缩放足够大时显示）
    if (viewport.zoom > 0.5) {
      this._renderHandles(ctx, container, viewport);
    }

    ctx.restore();
  }

  /**
   * 渲染元素选中效果（新增）
   * @private
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('../elements/Element.js').Element} element - 元素
   * @param {import('./Viewport.js').Viewport} viewport - 视口
   */
  _renderElementSelection(ctx, element, viewport) {
    ctx.save();

    // 绘制选中边框
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);

    const bounds = element.getBounds();
    const padding = 3;

    ctx.strokeRect(
      bounds.minX - padding,
      bounds.minY - padding,
      bounds.maxX - bounds.minX + padding * 2,
      bounds.maxY - bounds.minY + padding * 2
    );

    ctx.setLineDash([]);

    // 绘制四角控制点
    if (viewport.zoom > 0.3) {
      this._renderElementHandles(ctx, element, viewport);
    }

    ctx.restore();
  }

  /**
   * 绘制元素控制点
   * @private
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {import('../elements/Element.js').Element} element - 元素
   * @param {import('./Viewport.js').Viewport} viewport - 视口
   */
  _renderElementHandles(ctx, element, viewport) {
    const bounds = element.getBounds();
    const { minX, minY, maxX, maxY } = bounds;
    const zoom = viewport.zoom;

    // 控制点大小
    const handleSize = Math.max(4, this._handleSize / zoom);
    const halfSize = handleSize / 2;

    // 四角控制点位置
    const corners = [
      { x: minX, y: minY },  // 左上
      { x: maxX, y: minY },  // 右上
      { x: maxX, y: maxY },  // 右下
      { x: minX, y: maxY }   // 左下
    ];

    ctx.fillStyle = this._handleColor;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 / zoom;

    for (const corner of corners) {
      // 只在视口内绘制
      const screenPos = viewport.worldToScreen(corner.x, corner.y);
      if (screenPos.x < 0 || screenPos.x > viewport.canvasWidth ||
          screenPos.y < 0 || screenPos.y > viewport.canvasHeight) {
        continue;
      }

      ctx.beginPath();
      ctx.rect(
        corner.x - halfSize,
        corner.y - halfSize,
        handleSize,
        handleSize
      );
      ctx.fill();
      ctx.stroke();
    }
  }

  /**
   * 绘制控制点
   * @private
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {LayoutContainer} container - 选中的容器
   * @param {import('./Viewport.js').Viewport} viewport - 视口
   */
  _renderHandles(ctx, container, viewport) {
    const bounds = container.getBounds();
    const handles = this._getHandlePositions(bounds);
    const zoom = viewport.zoom;

    // 根据缩放调整控制点大小
    const handleSize = Math.max(4, this._handleSize / zoom);
    const halfSize = handleSize / 2;

    ctx.fillStyle = this._handleColor;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 / zoom;

    for (const handle of handles) {
      // 只在视口内绘制
      const screenPos = viewport.worldToScreen(handle.x, handle.y);
      if (screenPos.x < 0 || screenPos.x > viewport.canvasWidth ||
          screenPos.y < 0 || screenPos.y > viewport.canvasHeight) {
        continue;
      }

      ctx.beginPath();
      ctx.rect(
        handle.x - halfSize,
        handle.y - halfSize,
        handleSize,
        handleSize
      );
      ctx.fill();
      ctx.stroke();
    }
  }

  /**
   * 获取控制点位置
   * @private
   * @param {{minX: number, minY: number, maxX: number, maxY: number}} bounds
   * @returns {Array<{x: number, y: number, type: string}>}
   */
  _getHandlePositions(bounds) {
    const { minX, minY, maxX, maxY } = bounds;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return [
      // 四个角
      { x: minX, y: minY, type: 'nw' },  // 左上
      { x: maxX, y: minY, type: 'ne' },  // 右上
      { x: maxX, y: maxY, type: 'se' },  // 右下
      { x: minX, y: maxY, type: 'sw' },  // 左下
      // 四个边中点
      { x: centerX, y: minY, type: 'n' },  // 上
      { x: maxX, y: centerY, type: 'e' },  // 右
      { x: centerX, y: maxY, type: 's' },  // 下
      { x: minX, y: centerY, type: 'w' }   // 左
    ];
  }

  /**
   * 获取控制点对应的调整类型
   * @param {number} worldX - 世界坐标 X
   * @param {number} worldY - 世界坐标 Y
   * @param {LayoutContainer} container - 选中的容器
   * @param {import('./Viewport.js').Viewport} viewport - 视口
   * @returns {string|null} 控制点类型（nw, ne, se, sw, n, e, s, w）或 null
   */
  getHandleAtPoint(worldX, worldY, container, viewport) {
    const bounds = container.getBounds();
    const handles = this._getHandlePositions(bounds);
    const zoom = viewport.zoom;

    // 根据缩放调整控制点命中区域大小
    const hitSize = Math.max(8, this._handleSize * 1.5 / zoom);
    const halfHit = hitSize / 2;

    for (const handle of handles) {
      if (worldX >= handle.x - halfHit && worldX <= handle.x + halfHit &&
          worldY >= handle.y - halfHit && worldY <= handle.y + halfHit) {
        return handle.type;
      }
    }

    return null;
  }

  /**
   * 设置控制点大小
   * @param {number} size - 控制点大小
   */
  setHandleSize(size) {
    this._handleSize = size;
  }

  /**
   * 设置颜色
   * @param {string} borderColor - 边框颜色
   * @param {string} handleColor - 控制点颜色
   */
  setColors(borderColor, handleColor) {
    this._borderColor = borderColor;
    this._handleColor = handleColor;
  }
}

export { SelectionRenderer };
