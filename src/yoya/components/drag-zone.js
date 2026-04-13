/**
 * 拖拽区域组件
 * 用于布局编辑器场景，支持多区域拖拽和嵌套
 */

import { Tag, div } from '../core/basic.js';
import { vDraggable } from './drag.js';
import { vDroppable } from './drag.js';

// ============================================================================
// VDragZone - 拖拽区域（布局编辑器用）
// ============================================================================

/**
 * VDragZone - 定义可拖入/拖出的区域
 *
 * 用途：
 * - 支持多区域拖拽
 * - 支持嵌套区域
 * - 支持拖拽验证
 * - 支持放置位置计算（上/下/左/右/中）
 *
 * @extends Tag
 */
class VDragZone extends Tag {
  static _stateAttrs = ['disabled', 'over', 'active'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化区域相关属性
    this._zoneId = null;             // 区域唯一标识
    this._acceptFn = null;           // 接受验证回调
    this._onDragEnter = null;        // 拖拽进入回调
    this._onDragOver = null;         // 拖拽经过回调
    this._onDragLeave = null;        // 拖拽离开回调
    this._onDrop = null;             // 放置回调
    this._dropPosition = null;       // 放置位置：top/bottom/left/right/center

    // 3. 保存样式快照
    this.saveStateSnapshot('base');

    // 4. 注册状态处理器
    this._registerStateHandlers();

    // 5. 初始化状态
    this.initializeStates({
      disabled: false,
      over: false,
      active: false
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
        host.style('border-color', '#409eff');
        host.style('background-color', 'rgba(64, 158, 255, 0.05)');
      } else {
        host.style('border-color', '');
        host.style('background-color', '');
      }
    });

    // active 状态处理器
    this.registerStateHandler('active', (isActive, host) => {
      if (isActive) {
        host.style('border-color', '#67c23a');
        host.style('box-shadow', '0 0 0 2px rgba(103, 194, 58, 0.2)');
      } else {
        host.style('border-color', '');
        host.style('box-shadow', '');
      }
    });
  }

  /**
   * 设置区域唯一标识
   * @param {string} id - 区域 ID
   * @returns {this}
   */
  zoneId(id) {
    this._zoneId = id;
    return this;
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
   * 设置放置位置模式
   * @param {'top'|'bottom'|'left'|'right'|'center'} position - 放置位置
   * @returns {this}
   */
  dropPosition(position) {
    this._dropPosition = position;
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
    let isOver = false;

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

      if (accepts) {
        isOver = true;
        this.setState('over', true);

        // 显示放置指示器
        if (this._dropPosition) {
          this._showDropIndicator(e, this._dropPosition);
        }

        if (this._onDragEnter) {
          this._onDragEnter({
            type: 'dragEnter',
            target: element,
            zoneId: this._zoneId,
            data: dragData ? JSON.parse(dragData) : null
          });
        }
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();

      if (!isOver) return;

      if (this._onDragOver) {
        const dragData = e.dataTransfer?.getData('application/yoya-drag-data');
        this._onDragOver({
          type: 'dragOver',
          target: element,
          zoneId: this._zoneId,
          data: dragData ? JSON.parse(dragData) : null,
          x: e.clientX,
          y: e.clientY,
          position: this._calculateDropPosition(e)
        });
      }

      // 动态更新放置指示器位置
      if (this._dropPosition === 'auto') {
        this._updateDropIndicator(e);
      }
    };

    const handleDragLeave = (e) => {
      // 检查是否真的离开了区域
      const rect = element.getBoundingClientRect();
      const { clientX, clientY } = e;

      if (clientX >= rect.left && clientX <= rect.right &&
          clientY >= rect.top && clientY <= rect.bottom) {
        return;
      }

      isOver = false;
      this.setState('over', false);
      this._hideDropIndicator();

      if (this._onDragLeave) {
        this._onDragLeave({
          type: 'dragLeave',
          target: element,
          zoneId: this._zoneId
        });
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();

      if (this.getBooleanState('disabled') || !isOver) return;

      const dragData = e.dataTransfer?.getData('application/yoya-drag-data');
      const parsedData = dragData ? JSON.parse(dragData) : null;

      isOver = false;
      this.setState('over', false);
      this._hideDropIndicator();

      if (this._onDrop) {
        this._onDrop({
          type: 'drop',
          target: element,
          zoneId: this._zoneId,
          data: parsedData,
          x: e.clientX,
          y: e.clientY,
          position: this._calculateDropPosition(e)
        });
      }
    };

    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);
  }

  /**
   * 计算放置位置
   * @param {MouseEvent} e - 鼠标事件
   * @returns {string}
   */
  _calculateDropPosition(e) {
    const element = this.renderDom();
    if (!element) return 'center';

    const rect = element.getBoundingClientRect();
    const { clientX, clientY } = e;

    // 计算相对位置
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const leftDist = Math.abs(clientX - rect.left);
    const rightDist = Math.abs(clientX - rect.right);
    const topDist = Math.abs(clientY - rect.top);
    const bottomDist = Math.abs(clientY - rect.bottom);

    const minHorizontal = Math.min(leftDist, rightDist);
    const minVertical = Math.min(topDist, bottomDist);

    // 根据最近的边确定放置位置
    if (minHorizontal < minVertical) {
      return leftDist < rightDist ? 'left' : 'right';
    } else {
      return topDist < bottomDist ? 'top' : 'bottom';
    }
  }

  /**
   * 显示放置指示器
   * @param {MouseEvent} e - 鼠标事件
   * @param {string} position - 放置位置
   */
  _showDropIndicator(e, position) {
    if (!this._indicatorEl) {
      this._indicatorEl = div(i => {
        i.style('position', 'absolute');
        i.style('pointerEvents', 'none');
        i.style('zIndex', '1000');
        i.style('background', '#409eff');
        i.style('opacity', '0.5');
      });
    }

    const element = this.renderDom();
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const indicator = this._indicatorEl.renderDom();

    // 根据位置设置指示器样式
    const thickness = 4;
    switch (position) {
      case 'top':
        indicator.style('width', `${rect.width}px`);
        indicator.style('height', `${thickness}px`);
        indicator.style('left', `${rect.left}px`);
        indicator.style('top', `${rect.top}px`);
        break;
      case 'bottom':
        indicator.style('width', `${rect.width}px`);
        indicator.style('height', `${thickness}px`);
        indicator.style('left', `${rect.left}px`);
        indicator.style('top', `${rect.bottom - thickness}px`);
        break;
      case 'left':
        indicator.style('width', `${thickness}px`);
        indicator.style('height', `${rect.height}px`);
        indicator.style('left', `${rect.left}px`);
        indicator.style('top', `${rect.top}px`);
        break;
      case 'right':
        indicator.style('width', `${thickness}px`);
        indicator.style('height', `${rect.height}px`);
        indicator.style('left', `${rect.right - thickness}px`);
        indicator.style('top', `${rect.top}px`);
        break;
      case 'center':
      default:
        indicator.style('width', `${rect.width}px`);
        indicator.style('height', `${rect.height}px`);
        indicator.style('left', `${rect.left}px`);
        indicator.style('top', `${rect.top}px`);
        break;
    }

    document.body.appendChild(indicator);
  }

  /**
   * 更新放置指示器位置
   * @param {MouseEvent} e - 鼠标事件
   */
  _updateDropIndicator(e) {
    const position = this._calculateDropPosition(e);
    this._hideDropIndicator();
    this._showDropIndicator(e, position);
  }

  /**
   * 隐藏放置指示器
   */
  _hideDropIndicator() {
    if (this._indicatorEl) {
      const indicator = this._indicatorEl.renderDom();
      if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }
  }

  /**
   * 销毁组件
   */
  destroy() {
    this._hideDropIndicator();
    super.destroy();
  }
}

/**
 * 创建 VDragZone 实例
 * @param {function} setup - 配置函数
 * @returns {VDragZone}
 */
function vDragZone(setup = null) {
  return new VDragZone(setup);
}

// ============================================================================
// VDragCanvas - 拖拽画布（布局编辑器容器）
// ============================================================================

/**
 * VDragCanvas - 布局编辑器画布容器
 *
 * 用途：
 * - 管理多个拖拽区域
 * - 支持组件从工具栏拖入画布
 * - 支持画布内组件自由拖拽
 *
 * @extends Tag
 */
class VDragCanvas extends Tag {
  static _stateAttrs = ['disabled', 'editing'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化画布相关属性
    this._zones = new Map();         // 区域映射
    this._components = [];           // 组件列表
    this._onComponentAdd = null;     // 组件添加回调
    this._onComponentMove = null;    // 组件移动回调
    this._onComponentRemove = null;  // 组件删除回调

    // 3. 保存样式快照
    this.saveStateSnapshot('base');

    // 4. 注册状态处理器
    this._registerStateHandlers();

    // 5. 初始化状态
    this.initializeStates({
      disabled: false,
      editing: true
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
  }

  /**
   * 注册区域
   * @param {string} zoneId - 区域 ID
   * @param {VDragZone} zone - 区域实例
   */
  registerZone(zoneId, zone) {
    this._zones.set(zoneId, zone);
  }

  /**
   * 注销区域
   * @param {string} zoneId - 区域 ID
   */
  unregisterZone(zoneId) {
    this._zones.delete(zoneId);
  }

  /**
   * 组件添加回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onComponentAdd(fn) {
    this._onComponentAdd = fn;
    return this;
  }

  /**
   * 组件移动回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onComponentMove(fn) {
    this._onComponentMove = fn;
    return this;
  }

  /**
   * 组件删除回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onComponentRemove(fn) {
    this._onComponentRemove = fn;
    return this;
  }

  /**
   * 添加组件
   * @param {object} component - 组件数据
   */
  _addComponent(component) {
    this._components.push(component);
    if (this._onComponentAdd) {
      this._onComponentAdd({ component });
    }
  }

  /**
   * 移动组件
   * @param {string} componentId - 组件 ID
   * @param {string} zoneId - 目标区域 ID
   * @param {number} index - 目标索引
   */
  _moveComponent(componentId, zoneId, index) {
    const component = this._components.find(c => c.id === componentId);
    if (component) {
      component.zoneId = zoneId;
      component.index = index;
      if (this._onComponentMove) {
        this._onComponentMove({ component, zoneId, index });
      }
    }
  }

  /**
   * 渲染 DOM
   * @returns {HTMLElement|null}
   */
  renderDom() {
    if (this._deleted) return null;

    // 调用父类 renderDom 获取元素
    return super.renderDom();
  }
}

/**
 * 创建 VDragCanvas 实例
 * @param {function} setup - 配置函数
 * @returns {VDragCanvas}
 */
function vDragCanvas(setup = null) {
  return new VDragCanvas(setup);
}

export { VDragZone, VDragCanvas, vDragZone, vDragCanvas };
