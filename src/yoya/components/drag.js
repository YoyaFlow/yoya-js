/**
 * 拖拽组件
 * 支持拖拽布局编辑器和拖拽排序等多种场景
 *
 * 组件:
 * - VDraggable: 可拖拽元素容器
 * - VDroppable: 可放置区域容器
 * - VDragSortList: 拖拽排序列表
 * - VDragZone: 拖拽区域（布局编辑器用）
 */

import { Tag } from '../core/basic.js';

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
 * - 支持拖拽预览/占位符
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
    this._dragHandleElement = null;  // 拖拽把手元素引用

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

    // 绑定拖拽事件（只绑定一次）
    if (element && !this._dragEventsBound) {
      this._bindDragEvents(element);
      this._dragEventsBound = true;
    }

    return element;
  }

  /**
   * 绑定拖拽事件
   * @param {HTMLElement} element - 根元素
   */
  _bindDragEvents(element) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    let dragElement = null;
    let positionInitialized = false;

    const handleMouseDown = (e) => {
      // 检查是否禁用
      if (this.getBooleanState('disabled')) return;

      // 检查拖拽把手
      if (this._dragHandle) {
        const handleEl = element.querySelector(this._dragHandle);
        if (!handleEl || !handleEl.contains(e.target)) return;
      }

      isDragging = true;

      // 获取元素当前位置（优先使用 offsetLeft/offsetTop，如果没有则使用 getBoundingClientRect）
      const rect = element.getBoundingClientRect();
      const parentRect = element.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };

      // 使用相对于父容器的位置
      startLeft = element.offsetLeft || (rect.left - parentRect.left);
      startTop = element.offsetTop || (rect.top - parentRect.top);

      // 记录鼠标相对于元素左上角的偏移
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;

      // 设置 dragging 状态
      this.setState('dragging', true);

      // 触发自定义回调
      if (this._onDragStart) {
        this._onDragStart({
          type: 'dragStart',
          target: element,
          data: this._dragData,
          x: e.clientX,
          y: e.clientY,
          preventDefault: () => e.preventDefault()
        });
      }

      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      // 第一次拖拽时设置绝对定位
      if (!positionInitialized) {
        element.style.position = 'absolute';
        positionInitialized = true;
      }

      const constraint = this.getStringState('constraint');

      // 计算新位置（鼠标位置减去偏移量）
      let newLeft = e.clientX - startX;
      let newTop = e.clientY - startY;

      // 调整为相对于父容器的位置
      const parentRect = element.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
      newLeft = newLeft - parentRect.left;
      newTop = newTop - parentRect.top;

      // 应用约束
      if (constraint === 'horizontal') {
        newTop = startTop;
      } else if (constraint === 'vertical') {
        newLeft = startLeft;
      }

      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;

      // 触发自定义回调
      if (this._onDrag) {
        this._onDrag({
          type: 'drag',
          target: element,
          data: this._dragData,
          x: e.clientX,
          y: e.clientY,
          deltaX: e.clientX - (startLeft + startX),
          deltaY: e.clientY - (startTop + startY),
          left: newLeft,
          top: newTop
        });
      }
    };

    const handleMouseUp = (e) => {
      if (!isDragging) return;

      isDragging = false;
      this.setState('dragging', false);

      // 触发自定义回调
      if (this._onDragEnd) {
        this._onDragEnd({
          type: 'dragEnd',
          target: element,
          data: this._dragData,
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    // 绑定鼠标事件
    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 存储清理函数
    this._cleanupDrag = () => {
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
    this._onDragEnter = null;        // 拖拽进入回调
    this._onDragOver = null;         // 拖拽经过回调
    this._onDragLeave = null;        // 拖拽离开回调
    this._onDrop = null;             // 放置回调

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
   * @param {function} fn - 验证函数，返回 true 表示接受
   * @returns {this}
   */
  accept(fn) {
    this._acceptFn = fn;
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
    const handleDragEnter = (e) => {
      e.preventDefault();

      if (this.getBooleanState('disabled')) return;

      // 获取拖拽数据
      const dragData = e.dataTransfer?.getData('application/yoya-drag-data');

      // 验证是否接受
      let accepts = true;
      if (this._acceptFn && dragData) {
        try {
          const parsedData = JSON.parse(dragData);
          accepts = this._acceptFn(parsedData);
        } catch (err) {
          accepts = false;
        }
      }

      this.setState('accepts', accepts);

      if (accepts) {
        this.setState('over', true);

        if (this._onDragEnter) {
          this._onDragEnter({
            type: 'dragEnter',
            target: element,
            data: dragData ? JSON.parse(dragData) : null
          });
        }
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();

      if (!this.getBooleanState('over')) return;

      if (this._onDragOver) {
        const dragData = e.dataTransfer?.getData('application/yoya-drag-data');
        this._onDragOver({
          type: 'dragOver',
          target: element,
          data: dragData ? JSON.parse(dragData) : null,
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    const handleDragLeave = (e) => {
      // 检查是否真的离开了区域（而不是进入子元素）
      const rect = element.getBoundingClientRect();
      const { clientX, clientY } = e;

      if (clientX >= rect.left && clientX <= rect.right &&
          clientY >= rect.top && clientY <= rect.bottom) {
        return;
      }

      this.setState('over', false);

      if (this._onDragLeave) {
        this._onDragLeave({
          type: 'dragLeave',
          target: element
        });
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();

      if (this.getBooleanState('disabled') || !this.getBooleanState('over')) return;

      const dragData = e.dataTransfer?.getData('application/yoya-drag-data');
      const parsedData = dragData ? JSON.parse(dragData) : null;

      this.setState('over', false);

      if (this._onDrop) {
        this._onDrop({
          type: 'drop',
          target: element,
          data: parsedData,
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);
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

export { VDraggable, VDroppable, vDraggable, vDroppable };
