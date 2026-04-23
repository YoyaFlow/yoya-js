/**
 * @fileoverview MouseHandler 鼠标交互处理器
 * 处理画布的缩放、平移、容器拖拽和创建等鼠标交互
 */

import { EventEmitter } from '../utils/EventEmitter.js';

class MouseHandler extends EventEmitter {
  constructor(scadaCanvas, options = {}) {
    super();

    this.scadaCanvas = scadaCanvas;
    this.canvas = scadaCanvas.canvas;
    this.viewport = scadaCanvas.viewport;
    this.displayConfig = scadaCanvas.displayConfig;
    this.containerManager = scadaCanvas.containerManager;
    this.selectionRenderer = scadaCanvas.selectionRenderer;

    // 交互状态
    this._isPanning = false;
    this._isDragging = false;
    this._isCreating = false;
    this._isResizing = false;
    this._isPickup = false;  // 戴森球计划式拾取状态
    this._pickupContainer = null;  // 拾取的容器
    this._pickupPreview = null;  // 拾取预览位置（虚影位置）
    this._pickupOffsetX = 0;  // 拾取点相对于容器中心的偏移
    this._pickupOffsetY = 0;
    this._startX = 0;
    this._startY = 0;
    this._startOffsetX = 0;
    this._startOffsetY = 0;
    this._dragStartX = 0;
    this._dragStartY = 0;
    this._resizeHandle = null;
    this._createType = null;

    // 元素交互状态（新增）
    this._isDraggingElement = false;
    this._elementDragStartX = 0;
    this._elementDragStartY = 0;
    this._hoveredElement = null;

    // 配置
    this.zoomOnWheel = options.zoomOnWheel ?? true;
    this.panOnMiddleClick = options.panOnMiddleClick ?? true;
    this.zoomSpeed = options.zoomSpeed ?? 0.1;
    this.panButton = options.panButton ?? 1; // 0: 左键，1: 中键，2: 右键
    this.selectOnLeftClick = options.selectOnLeftClick ?? true;
    this.pickupOnRightClick = options.pickupOnRightClick ?? true; // 右键拾取

    // 创建模式
    this._creationMode = null; // 'rect', 'circle', 'ellipse', null

    // 绑定事件
    this._bindEvents();
  }

  /**
   * 设置创建模式
   * @param {string|null} type - 容器类型：'rect', 'circle', 'ellipse', null（取消创建）
   */
  setCreationMode(type) {
    this._creationMode = type;
    this.emit('creationModeChange', { type });
  }

  /**
   * 获取创建模式
   * @returns {string|null}
   */
  getCreationMode() {
    return this._creationMode;
  }

  /**
   * 取消拾取（ESC 键）
   */
  cancelPickup() {
    if (this._isPickup && this._pickupContainer) {
      this.containerManager.releaseContainer(this._pickupContainer);
      this._isPickup = false;
      this._pickupContainer = null;
      this._pickupPreview = null;
      this.canvas.style.cursor = 'default';
    }
  }

  /**
   * 绑定事件
   * @private
   */
  _bindEvents() {
    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this._onMouseLeave.bind(this));
    this.canvas.addEventListener('wheel', this._onWheel.bind(this), { passive: false });
    this.canvas.addEventListener('dblclick', this._onDoubleClick.bind(this));

    // 右键菜单
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      console.log('[MouseHandler] contextmenu prevented');
    });
  }

  /**
   * 鼠标按下
   * @private
   * @param {MouseEvent} e - 鼠标事件
   */
  _onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = this.viewport.screenToWorld(screenX, screenY);

    // 中键或配置的平移按钮
    if (e.button === this.panButton) {
      this._isPanning = true;
      this._startX = screenX;
      this._startY = screenY;
      this._startOffsetX = this.viewport.offsetX;
      this._startOffsetY = this.viewport.offsetY;
      this.canvas.style.cursor = 'grabbing';
      e.preventDefault();
      return;
    }
    // 左键 - 选择/拖拽/创建容器 或 放置拾取的容器
    else if (e.button === 0 && this.selectOnLeftClick) {
      // 检查是否在放置拾取的容器
      if (this._isPickup && this._pickupContainer) {
        const container = this._pickupContainer;

        // 使用预览位置（如果有）或鼠标位置
        const newX = this._pickupPreview?.x ?? (world.x - container.width / 2);
        const newY = this._pickupPreview?.y ?? (world.y - container.height / 2);

        // 检查目标位置是否有其他容器
        const existingContainer = this.containerManager.findContainerAtPoint(
          newX + container.width / 2,
          newY + container.height / 2
        );

        if (!existingContainer || existingContainer.id === container.id) {
          // 目标位置为空，放置容器
          container.setPosition(newX, newY);
          // 释放拾取的容器，重新添加到渲染列表
          this.containerManager.releaseContainer(container);
          this.containerManager.selectContainer(container.id);
          this.emit('containerPlace', { container, x: newX, y: newY });
        } else {
          // 目标位置有其他容器，取消放置
          this.containerManager.releaseContainer(container);
        }

        // 清除拾取状态
        this._isPickup = false;
        this._pickupContainer = null;
        this._pickupPreview = null;
        this.canvas.style.cursor = 'default';
        e.preventDefault();
        return;
      }

      // 检查是否在拖拽控制点
      const selectedContainer = this.containerManager.getSelectedContainer();
      if (selectedContainer && this.viewport.zoom > 0.5) {
        const handleType = this.selectionRenderer.getHandleAtPoint(
          world.x, world.y, selectedContainer, this.viewport
        );
        if (handleType) {
          this._isResizing = true;
          this._resizeHandle = handleType;
          this._startX = world.x;
          this._startY = world.y;
          e.preventDefault();
          return;
        }
      }

      // 检查是否在点击元素（新增：优先于容器）
      const elementResult = this.containerManager.findElementAtPoint(world.x, world.y);
      if (elementResult && elementResult.element && !elementResult.element.locked) {
        const { element, container } = elementResult;

        // 选中元素
        this.containerManager.selectElement(element.id);
        this._isDraggingElement = true;
        this._elementDragStartX = world.x;
        this._elementDragStartY = world.y;
        this.canvas.style.cursor = 'move';

        // 触发元素点击事件
        element.emit('click', {
          type: 'click',
          element: element,
          container: container,
          worldX: world.x,
          worldY: world.y
        });

        // 如果是按钮元素，触发按下状态
        if (element.type === 'button' && element.setPressed) {
          element.setPressed(true);
        }

        e.preventDefault();
        return;
      }

      // 检查是否在创建模式
      if (this._creationMode) {
        this._isCreating = true;
        this._createType = this._creationMode;
        this._startX = world.x;
        this._startY = world.y;

        // 创建临时容器
        const container = this.containerManager.createContainer({
          type: this._createType,
          x: world.x,
          y: world.y,
          width: 0,
          height: 0,
          name: `新${this._createType === 'circle' ? '圆形' : this._createType === 'ellipse' ? '椭圆' : '矩形'}`
        });

        this.emit('containerCreateStart', { container, x: world.x, y: world.y });
        e.preventDefault();
        return;
      }

      // 选择容器
      const container = this.containerManager.findContainerAtPoint(world.x, world.y);
      if (container && !container.locked) {
        this.containerManager.selectContainer(container.id);
        this._isDragging = true;
        this._dragStartX = world.x;
        this._dragStartY = world.y;
        this.canvas.style.cursor = 'move';
      } else {
        // 点击空白处，取消选择
        this.containerManager.selectContainer(null);
      }
    }
    // 右键 - 拾取容器（戴森球计划式操作）
    else if (e.button === 2 && this.pickupOnRightClick) {
      const container = this.containerManager.findContainerAtPoint(world.x, world.y);
      if (container && !container.locked) {
        // 如果已经在拾取状态，先释放之前的容器
        if (this._isPickup && this._pickupContainer) {
          this.containerManager.releaseContainer(this._pickupContainer);
        }

        // 拾取容器
        this._isPickup = true;
        this._pickupContainer = this.containerManager.pickupContainer(container.id);

        // 重置拾取预览位置（修复状态泄露）
        this._pickupPreview = null;

        // 计算拾取点相对于容器中心的偏移
        const bounds = container.getBounds();
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        this._pickupOffsetX = world.x - centerX;
        this._pickupOffsetY = world.y - centerY;

        this.canvas.style.cursor = 'crosshair';
        this.emit('containerPickup', { container, x: world.x, y: world.y });
        e.preventDefault();
        return;
      }
    }

    this.emit('mouseDown', {
      x: screenX,
      y: screenY,
      worldX: world.x,
      worldY: world.y,
      button: e.button
    });
  }

  /**
   * 鼠标移动
   * @private
   * @param {MouseEvent} e - 鼠标事件
   */
  _onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = this.viewport.screenToWorld(screenX, screenY);

    // 调试日志
    if (this._isPickup) {
      console.log('[MouseHandler] _onMouseMove 拾取中', {
        isPickup: this._isPickup,
        pickupContainer: this._pickupContainer?.id,
        worldX: world.x,
        worldY: world.y
      });
    }

    // 平移
    if (this._isPanning) {
      const deltaX = screenX - this._startX;
      const deltaY = screenY - this._startY;
      this.viewport.pan(
        this._startOffsetX + deltaX,
        this._startOffsetY + deltaY
      );
    }

    // 拖拽容器
    if (this._isDragging) {
      const selectedContainer = this.containerManager.getSelectedContainer();
      if (selectedContainer) {
        const dx = world.x - this._dragStartX;
        const dy = world.y - this._dragStartY;
        selectedContainer.translate(dx, dy);
        this._dragStartX = world.x;
        this._dragStartY = world.y;
      }
    }

    // 拖拽元素（新增）
    if (this._isDraggingElement) {
      const selectedElement = this.containerManager.getSelectedElement();
      if (selectedElement) {
        const dx = world.x - this._elementDragStartX;
        const dy = world.y - this._elementDragStartY;
        selectedElement.translate(dx, dy);
        this._elementDragStartX = world.x;
        this._elementDragStartY = world.y;
      }
    }

    // 创建容器
    if (this._isCreating) {
      const selectedContainer = this.containerManager.getSelectedContainer();
      if (selectedContainer) {
        const width = world.x - this._startX;
        const height = world.y - this._startY;

        if (this._createType === 'circle' || this._createType === 'ellipse') {
          // 圆形/椭圆：从中心向外扩展
          const centerX = this._startX;
          const centerY = this._startY;
          selectedContainer.setPosition(
            centerX - Math.abs(width),
            centerY - Math.abs(height)
          );
          selectedContainer.setSize(Math.abs(width) * 2, Math.abs(height) * 2);
        } else {
          // 矩形：支持从任意角开始
          selectedContainer.setPosition(
            width < 0 ? world.x : this._startX,
            height < 0 ? world.y : this._startY
          );
          selectedContainer.setSize(Math.abs(width), Math.abs(height));
        }

        this.emit('containerCreating', {
          container: selectedContainer,
          x: selectedContainer.x,
          y: selectedContainer.y,
          width: selectedContainer.width,
          height: selectedContainer.height
        });

        // 触发重新渲染
        if (this.scadaCanvas) {
          this.scadaCanvas.requestRender();
        }
      }
    }

    // 调整大小
    if (this._isResizing) {
      const selectedContainer = this.containerManager.getSelectedContainer();
      if (selectedContainer) {
        this._resizeContainer(selectedContainer, world.x, world.y);
      }
    }

    // 拾取容器移动（戴森球计划式）
    if (this._isPickup && this._pickupContainer) {
      // 拾取状态下，只更新虚影位置，原容器保持不动
      // 虚影位置由 GhostRenderer 根据 pickupPreview 位置渲染
      const newX = world.x - this._pickupContainer.width / 2;
      const newY = world.y - this._pickupContainer.height / 2;

      // 更新拾取预览位置（用于虚影渲染）
      this._pickupPreview = { x: newX, y: newY };

      // 触发重新渲染
      if (this.scadaCanvas) {
        this.scadaCanvas.requestRender();
      }

      this.emit('containerPickupMove', {
        container: this._pickupContainer,
        previewX: newX,
        previewY: newY,
        x: world.x,
        y: world.y
      });
    }

    // 更新光标
    if (!this._isPanning && !this._isDragging && !this._isCreating && !this._isResizing && !this._isPickup) {
      this._updateCursor(screenX, screenY, world);
    }

    this.emit('mouseMove', {
      x: screenX,
      y: screenY,
      worldX: world.x,
      worldY: world.y
    });
  }

  /**
   * 调整容器大小
   * @private
   * @param {LayoutContainer} container - 容器
   * @param {number} worldX - 世界坐标 X
   * @param {number} worldY - 世界坐标 Y
   */
  _resizeContainer(container, worldX, worldY) {
    const bounds = container.getBounds();
    let newX = container.x;
    let newY = container.y;
    let newWidth = container.width;
    let newHeight = container.height;

    switch (this._resizeHandle) {
      case 'nw': // 左上
        newX = worldX;
        newY = worldY;
        newWidth = bounds.maxX - worldX;
        newHeight = bounds.maxY - worldY;
        break;
      case 'ne': // 右上
        newY = worldY;
        newWidth = worldX - bounds.minX;
        newHeight = bounds.maxY - worldY;
        break;
      case 'se': // 右下
        newWidth = worldX - bounds.minX;
        newHeight = worldY - bounds.minY;
        break;
      case 'sw': // 左下
        newX = worldX;
        newWidth = bounds.maxX - worldX;
        newHeight = worldY - bounds.minY;
        break;
      case 'n': // 上
        newY = worldY;
        newHeight = bounds.maxY - worldY;
        break;
      case 'e': // 右
        newWidth = worldX - bounds.minX;
        break;
      case 's': // 下
        newHeight = worldY - bounds.minY;
        break;
      case 'w': // 左
        newX = worldX;
        newWidth = bounds.maxX - worldX;
        break;
    }

    container.setPosition(newX, newY);
    container.setSize(newWidth, newHeight);
  }

  /**
   * 更新光标
   * @private
   * @param {number} screenX - 屏幕 X
   * @param {number} screenY - 屏幕 Y
   * @param {{x: number, y: number}} world - 世界坐标
   */
  _updateCursor(screenX, screenY, world) {
    const selectedContainer = this.containerManager.getSelectedContainer();
    if (selectedContainer && this.viewport.zoom > 0.5) {
      const handleType = this.selectionRenderer.getHandleAtPoint(
        world.x, world.y, selectedContainer, this.viewport
      );
      if (handleType) {
        // 根据控制点类型设置光标
        const cursorMap = {
          'nw': 'nw-resize', 'ne': 'ne-resize',
          'se': 'se-resize', 'sw': 'sw-resize',
          'n': 'n-resize', 'e': 'e-resize',
          's': 's-resize', 'w': 'w-resize'
        };
        this.canvas.style.cursor = cursorMap[handleType] || 'default';
        return;
      }
    }

    // 检查是否在容器上
    const container = this.containerManager.findContainerAtPoint(world.x, world.y);
    if (container && !container.locked) {
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  /**
   * 鼠标释放
   * @private
   * @param {MouseEvent} e - 鼠标事件
   */
  _onMouseUp(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = this.viewport.screenToWorld(screenX, screenY);

    // 结束平移
    if (this._isPanning) {
      this._isPanning = false;
      this.canvas.style.cursor = 'default';
    }

    // 结束拖拽
    if (this._isDragging) {
      this._isDragging = false;
      this.canvas.style.cursor = 'default';
      this.emit('containerDragEnd', {
        container: this.containerManager.getSelectedContainer()
      });
    }

    // 结束元素拖拽（新增）
    if (this._isDraggingElement) {
      this._isDraggingElement = false;
      this.canvas.style.cursor = 'default';

      // 释放按钮按下状态
      const selectedElement = this.containerManager.getSelectedElement();
      if (selectedElement && selectedElement.type === 'button' && selectedElement.setPressed) {
        selectedElement.setPressed(false);
      }

      this.emit('elementDragEnd', {
        element: selectedElement
      });
    }

    // 结束创建
    if (this._isCreating) {
      this._isCreating = false;
      const container = this.containerManager.getSelectedContainer();
      if (container && (container.width < 5 || container.height < 5)) {
        // 太小的容器删除
        this.containerManager.deleteContainer(container.id);
      } else {
        this.emit('containerCreateEnd', { container });
        // 创建完成后退出创建模式
        // this._creationMode = null;
      }
    }

    // 结束调整大小
    if (this._isResizing) {
      this._isResizing = false;
      this._resizeHandle = null;
      this.emit('containerResizeEnd', {
        container: this.containerManager.getSelectedContainer()
      });
    }

    // 结束拾取（右键取消）
    // 戴森球计划式操作：右键松开时保持拾取状态，只有左键点击才放置
    // 如果需要取消拾取，可以按 ESC 键（待实现）

    this.emit('mouseUp', {
      x: screenX,
      y: screenY,
      worldX: world.x,
      worldY: world.y,
      button: e.button
    });
  }

  /**
   * 双击事件
   * @private
   * @param {MouseEvent} e - 鼠标事件
   */
  _onDoubleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const world = this.viewport.screenToWorld(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    this.emit('doubleClick', {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      worldX: world.x,
      worldY: world.y
    });
  }

  /**
   * 鼠标离开画布
   * @private
   * @param {MouseEvent} e - 鼠标事件
   */
  _onMouseLeave(e) {
    if (this._isPanning || this._isDragging || this._isCreating || this._isResizing) {
      this._isPanning = false;
      this._isDragging = false;
      this._isCreating = false;
      this._isResizing = false;
      this.canvas.style.cursor = 'default';
    }

    // 结束元素拖拽（新增）
    if (this._isDraggingElement) {
      this._isDraggingElement = false;
      this.canvas.style.cursor = 'default';

      // 释放按钮按下状态
      const selectedElement = this.containerManager.getSelectedElement();
      if (selectedElement && selectedElement.type === 'button' && selectedElement.setPressed) {
        selectedElement.setPressed(false);
      }
    }

    this.emit('mouseLeave');
  }

  /**
   * 滚轮事件
   * @private
   * @param {WheelEvent} e - 滚轮事件
   */
  _onWheel(e) {
    if (!this.zoomOnWheel) return;

    e.preventDefault();

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 计算缩放
    const delta = -e.deltaY;
    const zoomFactor = delta > 0 ? (1 + this.zoomSpeed) : (1 / (1 + this.zoomSpeed));
    const newZoom = this.viewport.zoom * zoomFactor;

    // 以鼠标为中心缩放
    this.viewport.setZoom(newZoom, x, y);
  }

  /**
   * 启用
   */
  enable() {
    this._bindEvents();
  }

  /**
   * 禁用
   */
  disable() {
    this.canvas.removeEventListener('mousedown', this._onMouseDown);
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseup', this._onMouseUp);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    this.canvas.removeEventListener('wheel', this._onWheel);
    this.canvas.removeEventListener('dblclick', this._onDoubleClick);
  }

  /**
   * 销毁
   */
  destroy() {
    this.disable();
    this.removeAllListeners();
  }
}

export { MouseHandler };
