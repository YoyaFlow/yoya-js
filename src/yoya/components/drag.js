/**
 * 拖拽组件 - 基于 Pointer Events + CSS Transform 的现代实现
 *
 * 支持场景：
 * 1. 基础拖拽 (VDraggable)
 * 2. 拖拽排序 (VDragSortList)
 * 3. 可放置区域 (VDroppable)
 * 4. 拖拽区域分组 (VDragGroup)
 *
 * @module Yoya.Drag
 */

import { Tag, div } from '../core/basic.js';

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 创建拖拽预览元素（Ghost）
 * @param {HTMLElement} originalEl - 原始元素
 * @returns {HTMLElement} Ghost 元素
 */
function createGhostElement(originalEl) {
  const ghost = originalEl.cloneNode(true);
  ghost.classList.add('drag-ghost');
  ghost.style.cssText = `
    position: fixed;
    pointer-events: none;
    opacity: 0.8;
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    z-index: 9999;
    transition: transform 0.15s ease;
  `;
  ghost.style.width = originalEl.offsetWidth + 'px';
  ghost.style.height = originalEl.offsetHeight + 'px';
  document.body.appendChild(ghost);
  return ghost;
}

/**
 * 更新 Ghost 元素位置
 * @param {HTMLElement} ghost - Ghost 元素
 * @param {number} x - X 坐标（鼠标位置）
 * @param {number} y - Y 坐标（鼠标位置）
 * @param {number} offsetX - 鼠标相对于元素的 X 偏移
 * @param {number} offsetY - 鼠标相对于元素的 Y 偏移
 */
function updateGhostPosition(ghost, x, y, offsetX = 0, offsetY = 0) {
  if (ghost) {
    // 使用 left/top 定位到绝对位置（而不是 transform 相对位移）
    ghost.style.left = (x - offsetX) + 'px';
    ghost.style.top = (y - offsetY) + 'px';
    ghost.style.transform = 'scale(1.05)';
  }
}

/**
 * 移除 Ghost 元素
 * @param {HTMLElement} ghost - Ghost 元素
 */
function removeGhostElement(ghost) {
  if (ghost && ghost.parentNode) {
    ghost.parentNode.removeChild(ghost);
  }
}

// ============================================================================
// VDraggable - 可拖拽元素容器
// ============================================================================

/**
 * VDraggable - 使子元素可拖拽
 *
 * 用途：
 * - 支持拖拽开始、拖拽中、拖拽结束的事件回调
 * - 支持拖拽把手（drag handle）指定
 * - 支持拖拽约束（水平/垂直/自由）
 * - 支持拖拽预览（Ghost 元素）
 * - 支持拖拽分组（group）
 *
 * @extends Tag
 */
class VDraggable extends Tag {
  static _stateAttrs = ['disabled', 'dragging', 'constraint'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化拖拽相关属性
    this._dragData = null;           // 拖拽携带的数据
    this._dragHandle = null;         // 拖拽把手选择器
    this._onDragStart = null;        // 拖拽开始回调
    this._onDrag = null;             // 拖拽中回调
    this._onDragEnd = null;          // 拖拽结束回调
    this._group = null;              // 拖拽分组标识

    // Pointer Events 相关
    this._pointerId = null;          // Pointer ID
    this._startX = 0;                // 起始 X
    this._startY = 0;                // 起始 Y
    this._currentX = 0;              // 当前 X
    this._currentY = 0;              // 当前 Y
    this._ghostEl = null;            // Ghost 元素
    this._isDragging = false;        // 是否正在拖拽
    this._dragOffsetX = 0;           // 鼠标相对于元素左上角的 X 偏移
    this._dragOffsetY = 0;           // 鼠标相对于元素左上角的 Y 偏移

    // 3. 保存样式快照
    this.saveStateSnapshot('base');

    // 4. 注册状态处理器
    this._registerStateHandlers();

    // 5. 初始化状态
    this.initializeStates({
      disabled: false,
      dragging: false,
      constraint: 'free'  // free, horizontal, vertical
    });

    // 6. 应用 setup
    if (setup) {
      setup(this);
    }
  }

  /**
   * 注册状态处理器
   */
  _registerStateHandlers() {
    // disabled 状态处理器
    this.registerStateHandler('disabled', (disabled, host) => {
      if (disabled) {
        host.style('pointerEvents', 'none');
        host.style('opacity', '0.5');
      } else {
        host.style('pointerEvents', '');
        host.style('opacity', '');
      }
    });

    // dragging 状态处理器
    this.registerStateHandler('dragging', (isDragging, host) => {
      if (isDragging) {
        host.style('opacity', '0.5');
        host.style('cursor', 'grabbing');
      } else {
        host.style('opacity', '');
        host.style('cursor', 'grab');
      }
    });
  }

  /**
   * 设置拖拽携带的数据
   * @param {any} data - 拖拽数据
   * @returns {this}
   */
  data(data) {
    this._dragData = data;
    // 如果已经渲染，同时更新 DOM 属性
    if (this._el) {
      if (data && typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
          this._el.setAttribute(`data-${key}`, value);
        }
      }
    }
    return this;
  }

  /**
   * 指定拖拽把手（只有点击把手才触发拖拽）
   * @param {string} selector - CSS 选择器
   * @returns {this}
   */
  dragHandle(selector) {
    this._dragHandle = selector;
    return this;
  }

  /**
   * 设置拖拽约束
   * @param {'horizontal'|'vertical'|'free'} constraint - 约束方向
   * @returns {this}
   */
  constraint(constraint) {
    this.setState('constraint', constraint);
    return this;
  }

  /**
   * 设置拖拽分组
   * @param {string} group - 分组标识
   * @returns {this}
   */
  group(group) {
    this._group = group;
    // 如果已经渲染，同时更新 DOM 属性
    if (this._el) {
      this._el.setAttribute('data-group', group);
    }
    return this;
  }

  /**
   * 拖拽开始回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onDragStart(fn) {
    this._onDragStart = fn;
    return this;
  }

  /**
   * 拖拽中回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onDrag(fn) {
    this._onDrag = fn;
    return this;
  }

  /**
   * 拖拽结束回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onDragEnd(fn) {
    this._onDragEnd = fn;
    return this;
  }

  /**
   * 渲染 DOM 并绑定拖拽事件
   * @returns {HTMLElement|null}
   */
  renderDom() {
    if (this._deleted) return null;

    // 调用父类 renderDom 获取元素
    const element = super.renderDom();

    // 设置 data-* 属性
    if (element && this._dragData) {
      if (typeof this._dragData === 'object') {
        for (const [key, value] of Object.entries(this._dragData)) {
          element.setAttribute(`data-${key}`, value);
        }
      }
    }

    // 设置 data-group 属性
    if (element && this._group) {
      element.setAttribute('data-group', this._group);
    }

    // 绑定事件（只绑定一次）
    if (element && !this._dragEventsBound) {
      // 同时绑定 Pointer Events 和 HTML5 Drag Events
      // Pointer Events 用于手动鼠标操作
      // HTML5 Drag Events 用于自动化测试和原生拖拽
      if (window.PointerEvent) {
        this._bindPointerEvents(element);
      } else {
        this._bindMouseEvents(element);
      }
      this._bindHTML5DragEvents(element);
      this._dragEventsBound = true;
    }

    return element;
  }

  /**
   * 绑定 HTML5 Drag Events（用于自动化测试和原生拖拽支持）
   * @param {HTMLElement} element - 根元素
   */
  _bindHTML5DragEvents(element) {
    // 设置 draggable 属性
    element.setAttribute('draggable', 'true');

    // Drag Start
    const handleDragStart = (e) => {
      if (this.getBooleanState('disabled')) return;

      e.preventDefault();

      // 设置拖拽数据
      if (this._dragData) {
        try {
          e.dataTransfer?.setData('application/json', JSON.stringify(this._dragData));
        } catch (err) {
          // 忽略 setData 错误（可能在某些环境中 dataTransfer 不可用）
        }
      }
      try {
        e.dataTransfer?.setData('text/plain', this._group || '');
      } catch (err) {
        // 忽略
      }
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
      }

      // 设置 dragging 状态
      this.setState('dragging', true);

      // 触发自定义回调
      if (this._onDragStart) {
        this._onDragStart({
          type: 'dragStart',
          target: element,
          data: this._dragData,
          group: this._group,
          x: e.clientX,
          y: e.clientY,
          preventDefault: () => e.preventDefault()
        });
      }
    };

    // Drag End
    const handleDragEnd = (e) => {
      this.setState('dragging', false);

      // 触发自定义回调
      if (this._onDragEnd) {
        this._onDragEnd({
          type: 'dragEnd',
          target: element,
          data: this._dragData,
          group: this._group,
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
  }

  /**
   * 绑定 Pointer Events（现代浏览器）
   * @param {HTMLElement} element - 根元素
   */
  _bindPointerEvents(element) {
    let positionInitialized = false;
    let originalTransform = '';

    // Pointer Down - 拖拽开始
    const handlePointerDown = (e) => {
      // 检查是否禁用
      if (this.getBooleanState('disabled')) return;

      // 检查拖拽把手
      if (this._dragHandle) {
        const handleEl = element.querySelector(this._dragHandle);
        if (!handleEl || !handleEl.contains(e.target)) return;
      }

      // 防止默认行为
      e.preventDefault();

      // 设置 pointer capture，这样即使鼠标移出元素也能继续接收事件
      this._pointerId = e.pointerId;
      element.setPointerCapture(this._pointerId);

      this._isDragging = true;

      // 获取元素当前位置
      const rect = element.getBoundingClientRect();

      // 记录鼠标相对于元素左上角的偏移
      this._dragOffsetX = e.clientX - rect.left;
      this._dragOffsetY = e.clientY - rect.top;

      // 记录起始位置
      this._startX = e.clientX;
      this._startY = e.clientY;
      this._currentX = 0;
      this._currentY = 0;

      // 保存原始 transform
      const computedStyle = window.getComputedStyle(element);
      originalTransform = computedStyle.transform !== 'none' ? computedStyle.transform : '';

      // 使用 transform 初始化位置（GPU 加速）
      if (!positionInitialized) {
        element.style.transition = 'none';  // 拖拽时禁用过渡，避免延迟
        element.style.willChange = 'transform';  // 提示浏览器优化
        positionInitialized = true;
      }

      // 设置 dragging 状态
      this.setState('dragging', true);

      // 创建 Ghost 元素（视觉预览）
      this._ghostEl = createGhostElement(element);
      // 设置 Ghost 元素的初始位置（使用 left/top 定位）
      if (this._ghostEl) {
        this._ghostEl.style.left = (e.clientX - this._dragOffsetX) + 'px';
        this._ghostEl.style.top = (e.clientY - this._dragOffsetY) + 'px';
      }

      // 设置原生拖拽数据（支持跨组件拖拽）
      element.setAttribute('draggable', 'true');

      // 触发自定义回调
      if (this._onDragStart) {
        this._onDragStart({
          type: 'dragStart',
          target: element,
          data: this._dragData,
          group: this._group,
          x: e.clientX,
          y: e.clientY,
          preventDefault: () => e.preventDefault()
        });
      }
    };

    // Pointer Move - 拖拽中
    const handlePointerMove = (e) => {
      if (!this._isDragging || e.pointerId !== this._pointerId) return;

      const constraint = this.getStringState('constraint');

      // 计算位移
      let deltaX = e.clientX - this._startX;
      let deltaY = e.clientY - this._startY;

      // 应用约束
      if (constraint === 'horizontal') {
        deltaY = 0;
      } else if (constraint === 'vertical') {
        deltaX = 0;
      }

      // 更新当前相对位置
      this._currentX = deltaX;
      this._currentY = deltaY;

      // 使用 GPU 加速的 transform 更新位置
      element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;

      // 更新 Ghost 位置
      if (this._ghostEl) {
        this._ghostEl.style.left = (e.clientX - this._dragOffsetX) + 'px';
        this._ghostEl.style.top = (e.clientY - this._dragOffsetY) + 'px';
      }

      // 检测下方的 droppable 元素
      // 隐藏 ghost 和原始元素以便检测到下方的元素
      if (this._ghostEl) this._ghostEl.style.display = 'none';
      element.style.visibility = 'hidden';

      const hitEl = document.elementFromPoint(e.clientX, e.clientY);

      // 恢复显示
      if (this._ghostEl) this._ghostEl.style.display = '';
      element.style.visibility = '';

      // 查找 droppable：可能是 hitEl 本身，或者是它的子元素
      let droppable = hitEl?.closest('[data-vdroppable="true"]');

      // 如果 hitEl 没有找到，尝试查找其子元素中的 droppable
      if (!droppable && hitEl) {
        droppable = hitEl.querySelector('[data-vdroppable="true"]');
      }

      // 如果进入新的 droppable，触发 dragenter
      if (droppable && droppable !== this._currentDroppable) {
        if (this._currentDroppable) {
          // 触发之前 droppable 的 dragleave
          const leaveEvent = new CustomEvent('yoya-dragleave', {
            bubbles: true,
            detail: { dragData: this._dragData, group: this._group }
          });
          this._currentDroppable.dispatchEvent(leaveEvent);
        }
        // 触发新 droppable 的 dragenter
        const enterEvent = new CustomEvent('yoya-dragenter', {
          bubbles: true,
          detail: { dragData: this._dragData, group: this._group }
        });
        droppable.dispatchEvent(enterEvent);
        this._currentDroppable = droppable;
      } else if (!droppable && this._currentDroppable) {
        // 离开所有 droppable
        const leaveEvent = new CustomEvent('yoya-dragleave', {
          bubbles: true,
          detail: { dragData: this._dragData, group: this._group }
        });
        this._currentDroppable.dispatchEvent(leaveEvent);
        this._currentDroppable = null;
      }

      // 触发自定义回调
      if (this._onDrag) {
        this._onDrag({
          type: 'drag',
          target: element,
          data: this._dragData,
          group: this._group,
          x: e.clientX,
          y: e.clientY,
          deltaX,
          deltaY,
          left: deltaX,
          top: deltaY
        });
      }
    };

    // 当前所在的 droppable 元素
    this._currentDroppable = null;

    // Pointer Up - 拖拽结束
    const handlePointerUp = (e) => {
      if (!this._isDragging || e.pointerId !== this._pointerId) return;

      this._isDragging = false;

      // 释放 pointer capture
      element.releasePointerCapture(this._pointerId);

      // 恢复过渡效果
      element.style.transition = '';
      element.style.willChange = '';

      // 检测下方的 droppable 元素并触发 drop
      const droppableEl = document.elementFromPoint(e.clientX, e.clientY);
      const droppable = droppableEl?.closest('[data-vdroppable="true"]');

      if (droppable) {
        // 触发 drop 事件
        const dropEvent = new CustomEvent('yoya-drop', {
          bubbles: true,
          detail: {
            dragData: this._dragData,
            group: this._group,
            x: e.clientX,
            y: e.clientY
          }
        });
        droppable.dispatchEvent(dropEvent);
      }

      // 离开当前 droppable
      if (this._currentDroppable) {
        const leaveEvent = new CustomEvent('yoya-dragleave', {
          bubbles: true,
          detail: { dragData: this._dragData, group: this._group }
        });
        this._currentDroppable.dispatchEvent(leaveEvent);
        this._currentDroppable = null;
      }

      // 重置位置（如果需要）
      // 如果是在 droppable 区域外释放，可以重置位置
      element.style.transform = originalTransform || '';

      // 移除 Ghost 元素
      removeGhostElement(this._ghostEl);
      this._ghostEl = null;

      // 设置 dragging 状态为 false
      this.setState('dragging', false);

      // 触发自定义回调
      if (this._onDragEnd) {
        this._onDragEnd({
          type: 'dragEnd',
          target: element,
          data: this._dragData,
          group: this._group,
          x: e.clientX,
          y: e.clientY
        });
      }

      // 重置状态
      this._pointerId = null;
    };

    // Pointer Cancel - 拖拽取消
    const handlePointerCancel = (e) => {
      if (!this._isDragging) return;
      this._isDragging = false;
      element.releasePointerCapture(this._pointerId);
      element.style.transform = originalTransform || '';
      removeGhostElement(this._ghostEl);
      this._ghostEl = null;
      this.setState('dragging', false);
    };

    // 绑定 Pointer Events
    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
    element.addEventListener('pointercancel', handlePointerCancel);

    // 存储清理函数
    this._cleanupDrag = () => {
      element.removeEventListener('pointerdown', handlePointerDown);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', handlePointerUp);
      element.removeEventListener('pointercancel', handlePointerCancel);
    };
  }

  /**
   * 绑定 Mouse Events（后备方案）
   * @param {HTMLElement} element - 根元素
   */
  _bindMouseEvents(element) {
    let positionInitialized = false;
    let originalTransform = '';

    // Mouse Down - 拖拽开始
    const handleMouseDown = (e) => {
      // 检查是否禁用
      if (this.getBooleanState('disabled')) return;

      // 检查拖拽把手
      if (this._dragHandle) {
        const handleEl = element.querySelector(this._dragHandle);
        if (!handleEl || !handleEl.contains(e.target)) return;
      }

      // 防止默认行为
      e.preventDefault();

      this._isDragging = true;

      // 获取元素当前位置
      const rect = element.getBoundingClientRect();

      // 记录鼠标相对于元素左上角的偏移
      this._dragOffsetX = e.clientX - rect.left;
      this._dragOffsetY = e.clientY - rect.top;

      // 记录起始位置
      this._startX = e.clientX;
      this._startY = e.clientY;
      this._currentX = 0;
      this._currentY = 0;

      // 保存原始 transform
      const computedStyle = window.getComputedStyle(element);
      originalTransform = computedStyle.transform !== 'none' ? computedStyle.transform : '';

      // 使用 transform 初始化位置（GPU 加速）
      if (!positionInitialized) {
        element.style.transition = 'none';  // 拖拽时禁用过渡，避免延迟
        element.style.willChange = 'transform';  // 提示浏览器优化
        positionInitialized = true;
      }

      // 设置 dragging 状态
      this.setState('dragging', true);

      // 创建 Ghost 元素（视觉预览）
      this._ghostEl = createGhostElement(element);
      // 设置 Ghost 元素的初始位置（使用 left/top 定位）
      if (this._ghostEl) {
        this._ghostEl.style.left = (e.clientX - this._dragOffsetX) + 'px';
        this._ghostEl.style.top = (e.clientY - this._dragOffsetY) + 'px';
      }

      // 设置原生拖拽数据（支持跨组件拖拽）
      element.setAttribute('draggable', 'true');

      // 触发自定义回调
      if (this._onDragStart) {
        this._onDragStart({
          type: 'dragStart',
          target: element,
          data: this._dragData,
          group: this._group,
          x: e.clientX,
          y: e.clientY,
          preventDefault: () => e.preventDefault()
        });
      }
    };

    // Mouse Move - 拖拽中
    const handleMouseMove = (e) => {
      if (!this._isDragging) return;

      const constraint = this.getStringState('constraint');

      // 计算位移
      let deltaX = e.clientX - this._startX;
      let deltaY = e.clientY - this._startY;

      // 应用约束
      if (constraint === 'horizontal') {
        deltaY = 0;
      } else if (constraint === 'vertical') {
        deltaX = 0;
      }

      // 更新当前相对位置
      this._currentX = deltaX;
      this._currentY = deltaY;

      // 使用 GPU 加速的 transform 更新位置
      element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;

      // 更新 Ghost 位置
      if (this._ghostEl) {
        this._ghostEl.style.left = (e.clientX - this._dragOffsetX) + 'px';
        this._ghostEl.style.top = (e.clientY - this._dragOffsetY) + 'px';
      }

      // 触发自定义回调
      if (this._onDrag) {
        this._onDrag({
          type: 'drag',
          target: element,
          data: this._dragData,
          group: this._group,
          x: e.clientX,
          y: e.clientY,
          deltaX,
          deltaY,
          left: deltaX,
          top: deltaY
        });
      }
    };

    // Mouse Up - 拖拽结束
    const handleMouseUp = (e) => {
      if (!this._isDragging) return;

      this._isDragging = false;

      // 恢复过渡效果
      element.style.transition = '';
      element.style.willChange = '';

      // 重置位置（如果需要）
      element.style.transform = originalTransform || '';

      // 移除 Ghost 元素
      removeGhostElement(this._ghostEl);
      this._ghostEl = null;

      // 设置 dragging 状态为 false
      this.setState('dragging', false);

      // 触发自定义回调
      if (this._onDragEnd) {
        this._onDragEnd({
          type: 'dragEnd',
          target: element,
          data: this._dragData,
          group: this._group,
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    // 绑定 Mouse Events
    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 存储清理函数
    this._cleanupDrag = () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }

  /**
   * 销毁组件
   */
  destroy() {
    if (this._cleanupDrag) {
      this._cleanupDrag();
    }
    if (this._ghostEl) {
      removeGhostElement(this._ghostEl);
    }
    super.destroy();
  }
}

/**
 * 创建 VDraggable 实例
 * @param {function} setup - 配置函数
 * @returns {VDraggable}
 */
function vDraggable(setup = null) {
  return new VDraggable(setup);
}

// ============================================================================
// VDroppable - 可放置区域容器
// ============================================================================

/**
 * VDroppable - 定义可放置区域
 *
 * 用途：
 * - 提供 onDragEnter/onDragOver/onDragLeave/onDrop 回调
 * - 支持接受验证（accept 回调）
 * - 支持放置区域高亮
 * - 支持分组验证
 *
 * @extends Tag
 */
class VDroppable extends Tag {
  static _stateAttrs = ['disabled', 'over', 'accepts'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化放置相关属性
    this._acceptFn = null;           // 接受验证回调
    this._acceptGroup = null;        // 接受的分组标识
    this._onDragEnter = null;        // 拖拽进入回调
    this._onDragOver = null;         // 拖拽经过回调
    this._onDragLeave = null;        // 拖拽离开回调
    this._onDrop = null;             // 放置回调
    this._enteredDraggables = new Set();  // 记录已进入的拖拽元素

    // 3. 保存样式快照
    this.saveStateSnapshot('base');

    // 4. 注册状态处理器
    this._registerStateHandlers();

    // 5. 初始化状态
    this.initializeStates({
      disabled: false,
      over: false,
      accepts: false
    });

    // 6. 应用 setup
    if (setup) {
      setup(this);
    }
  }

  /**
   * 注册状态处理器
   */
  _registerStateHandlers() {
    // over 状态处理器 - 高亮放置区域
    this.registerStateHandler('over', (isOver, host) => {
      if (isOver) {
        host.style('border', '2px dashed #409eff');
        host.style('background', 'rgba(64, 158, 255, 0.1)');
      } else {
        host.style('border', '');
        host.style('background', '');
      }
    });

    // accepts 状态处理器
    this.registerStateHandler('accepts', (accepts, host) => {
      if (!accepts && !host.getBooleanState('over')) {
        host.style('opacity', '0.5');
        host.style('pointerEvents', 'none');
      } else {
        host.style('opacity', '');
        host.style('pointerEvents', '');
      }
    });
  }

  /**
   * 设置接受验证回调
   * @param {function|Array<string>} fn - 验证函数或分组标识数组
   * @returns {this}
   */
  accept(fn) {
    if (Array.isArray(fn)) {
      this._acceptGroup = fn;
      this._acceptFn = (data, group) => {
        if (!data && !group) return false;
        // 检查 data.type 或 data 本身是否在数组中
        // 这允许 accept(['new-component', 'draggable-item']) 这样的用法
        const dataType = data?.type || data;
        if (dataType && fn.includes(dataType)) return true;
        // 如果 data.type 不匹配，检查 group
        const effectiveGroup = data?.group || group;
        if (!effectiveGroup) return !dataType;  // 如果没有 group，返回 data.type 是否匹配
        return fn.includes(effectiveGroup);
      };
    } else {
      this._acceptFn = fn;
    }
    return this;
  }

  /**
   * 拖拽进入回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onDragEnter(fn) {
    this._onDragEnter = fn;
    return this;
  }

  /**
   * 拖拽经过回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onDragOver(fn) {
    this._onDragOver = fn;
    return this;
  }

  /**
   * 拖拽离开回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onDragLeave(fn) {
    this._onDragLeave = fn;
    return this;
  }

  /**
   * 放置回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onDrop(fn) {
    this._onDrop = fn;
    return this;
  }

  /**
   * 渲染 DOM 并绑定放置事件
   * @returns {HTMLElement|null}
   */
  renderDom() {
    if (this._deleted) return null;

    // 调用父类 renderDom 获取元素
    const element = super.renderDom();

    // 设置 data-vdroppable 标记，便于 VDraggable 检测
    if (element && !element.hasAttribute('data-vdroppable')) {
      element.setAttribute('data-vdroppable', 'true');
    }

    // 绑定放置事件（只绑定一次）
    if (element && !this._dropEventsBound) {
      this._bindDropEvents(element);
      this._dropEventsBound = true;
    }

    return element;
  }

  /**
   * 绑定放置事件
   * @param {HTMLElement} element - 根元素
   */
  _bindDropEvents(element) {
    // 处理原生 HTML5 Drag Enter
    const handleDragEnter = (e) => {
      e.preventDefault();

      if (this.getBooleanState('disabled')) return;

      // 获取拖拽数据（从 dataTransfer 或自定义属性）
      let dragData = null;
      let dragGroup = null;
      try {
        const dataTransferData = e.dataTransfer?.getData('application/json');
        if (dataTransferData) {
          dragData = JSON.parse(dataTransferData);
        }
        // 获取分组标识（从 text/plain）
        const groupData = e.dataTransfer?.getData('text/plain');
        if (groupData) {
          dragGroup = groupData;
        }
      } catch (err) {
        // 忽略解析错误
      }

      // 验证是否接受
      let accepts = true;
      if (this._acceptFn) {
        accepts = this._acceptFn(dragData, dragGroup);
      }

      this.setState('accepts', accepts);

      if (accepts) {
        this.setState('over', true);
        this._enteredDraggables.add(e.target);

        if (this._onDragEnter) {
          this._onDragEnter({
            type: 'dragEnter',
            target: element,
            nativeEvent: e,
            data: dragData,
            group: dragGroup
          });
        }
      }
    };

    // 处理原生 HTML5 Drag Over
    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      if (!this.getBooleanState('over')) return;

      if (this._onDragOver) {
        let dragData = null;
        try {
          const dataTransferData = e.dataTransfer?.getData('application/json');
          if (dataTransferData) {
            dragData = JSON.parse(dataTransferData);
          }
        } catch (err) {
          // 忽略
        }

        this._onDragOver({
          type: 'dragOver',
          target: element,
          nativeEvent: e,
          data: dragData,
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    // 处理原生 HTML5 Drag Leave
    const handleDragLeave = (e) => {
      // 检查是否真的离开了区域（而不是进入子元素）
      const rect = element.getBoundingClientRect();
      const { clientX, clientY } = e;

      if (clientX >= rect.left && clientX <= rect.right &&
          clientY >= rect.top && clientY <= rect.bottom) {
        return;
      }

      this._enteredDraggables.delete(e.target);

      if (this._enteredDraggables.size === 0) {
        this.setState('over', false);

        if (this._onDragLeave) {
          this._onDragLeave({
            type: 'dragLeave',
            target: element,
            nativeEvent: e
          });
        }
      }
    };

    // 处理原生 HTML5 Drop
    const handleDrop = (e) => {
      e.preventDefault();

      if (this.getBooleanState('disabled') || !this.getBooleanState('over')) return;

      let dragData = null;
      let dragGroup = null;
      try {
        const dataTransferData = e.dataTransfer?.getData('application/json');
        if (dataTransferData) {
          dragData = JSON.parse(dataTransferData);
        }
        // 获取分组标识（从 text/plain）
        const groupData = e.dataTransfer?.getData('text/plain');
        if (groupData) {
          dragGroup = groupData;
        }
      } catch (err) {
        // 忽略
      }

      this.setState('over', false);
      this._enteredDraggables.clear();

      if (this._onDrop) {
        this._onDrop({
          type: 'drop',
          target: element,
          nativeEvent: e,
          data: dragData,
          group: dragGroup,
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    // 绑定自定义 Yoya Drag 事件（用于 Pointer Events 拖拽）
    const handleYoyaDragEnter = (e) => {
      e.preventDefault();
      const { dragData, group } = e.detail;

      if (this.getBooleanState('disabled')) return;

      // 验证是否接受
      let accepts = true;
      if (this._acceptFn) {
        // 使用与 accept() 方法一致的验证逻辑
        accepts = this._acceptFn(dragData, group);
      }

      this.setState('accepts', accepts);

      if (accepts) {
        this.setState('over', true);
        this._enteredDraggables.add(e.target);

        if (this._onDragEnter) {
          this._onDragEnter({
            type: 'dragEnter',
            target: element,
            nativeEvent: e,
            data: dragData,
            group
          });
        }
      }
    };

    const handleYoyaDragLeave = (e) => {
      e.preventDefault();
      const { dragData, group } = e.detail;

      this._enteredDraggables.delete(e.target);

      if (this._enteredDraggables.size === 0) {
        this.setState('over', false);

        if (this._onDragLeave) {
          this._onDragLeave({
            type: 'dragLeave',
            target: element,
            nativeEvent: e,
            data: dragData,
            group
          });
        }
      }
    };

    const handleYoyaDrop = (e) => {
      e.preventDefault();
      const { dragData, group, x, y } = e.detail;

      if (this.getBooleanState('disabled') || !this.getBooleanState('over')) return;

      this.setState('over', false);
      this._enteredDraggables.clear();

      if (this._onDrop) {
        this._onDrop({
          type: 'drop',
          target: element,
          nativeEvent: e,
          data: dragData,
          group,
          x,
          y
        });
      }
    };

    element.addEventListener('yoya-dragenter', handleYoyaDragEnter);
    element.addEventListener('yoya-dragleave', handleYoyaDragLeave);
    element.addEventListener('yoya-drop', handleYoyaDrop);
  }
}

/**
 * 创建 VDroppable 实例
 * @param {function} setup - 配置函数
 * @returns {VDroppable}
 */
function vDroppable(setup = null) {
  return new VDroppable(setup);
}

// ============================================================================
// 导出
// ============================================================================

export { VDraggable, VDroppable, vDraggable, vDroppable, createGhostElement, updateGhostPosition, removeGhostElement };
