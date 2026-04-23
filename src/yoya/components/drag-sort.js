/**
 * 拖拽排序组件 - 基于 Pointer Events + CSS Transform 的现代实现
 *
 * 支持场景：
 * - 列表项拖拽排序
 * - 拖拽占位符显示
 * - 拖拽后顺序更新
 * - 支持分组（不同列表之间可以/不可以互相拖拽）
 *
 * @module Yoya.DragSort
 */

import { Tag, div } from '../core/basic.js';
import { vDraggable } from './drag.js';

// ============================================================================
// VDragSortList - 拖拽排序列表
// ============================================================================

/**
 * VDragSortList - 支持拖拽排序的列表容器
 *
 * 用途：
 * - 列表项拖拽排序
 * - 拖拽占位符显示（带平滑动画）
 * - 拖拽后顺序更新
 * - 支持 onReorder 回调
 * - 支持分组（group）- 不同组之间不能互相拖拽
 *
 * @extends Tag
 */
class VDragSortList extends Tag {
  static _stateAttrs = ['disabled', 'dragging'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化排序相关属性
    this._items = [];                // 列表项数据
    this._itemKey = 'id';            // 用于标识唯一性的键
    this._itemRender = null;         // 单项渲染函数
    this._onReorder = null;          // 重排回调
    this._group = null;              // 分组标识（同组才能互相拖拽）
    this._dragIndex = -1;            // 当前拖拽的索引
    this._placeholderIndex = -1;     // 占位符位置
    this._ghostEl = null;            // Ghost 元素
    this._placeholderEl = null;      // 占位符元素

    // 3. 保存样式快照
    this.saveStateSnapshot('base');

    // 4. 注册状态处理器
    this._registerStateHandlers();

    // 5. 初始化状态
    this.initializeStates({
      disabled: false,
      dragging: false
    });

    // 6. 应用 setup
    if (setup) {
      setup(this);
    }

    // 7. 设置容器样式（position: relative 用于绝对定位的占位符）
    this.style('position', 'relative');
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
   * 设置列表项数据
   * @param {Array} items - 项数组
   * @returns {this}
   */
  items(items) {
    this._items = items;
    this._renderItems();
    return this;
  }

  /**
   * 设置用于标识唯一性的键
   * @param {string} key - 键名
   * @returns {this}
   */
  itemKey(key) {
    this._itemKey = key;
    return this;
  }

  /**
   * 设置单项渲染函数
   * @param {function} fn - 渲染函数，接收 (item, index, container)
   * @returns {this}
   */
  itemRender(fn) {
    this._itemRender = fn;
    return this;
  }

  /**
   * 设置分组标识
   * @param {string} group - 分组名称
   * @returns {this}
   */
  group(group) {
    this._group = group;
    return this;
  }

  /**
   * 重排回调
   * @param {function} fn - 回调函数
   * @returns {this}
   */
  onReorder(fn) {
    this._onReorder = fn;
    return this;
  }

  /**
   * 渲染列表项
   */
  _renderItems() {
    // 完全清空子元素
    this._children = [];

    // 重新渲染所有项
    this._items.forEach((item, index) => {
      const draggableItem = this._createDraggableItem(item, index);
      this._children.push(draggableItem);
    });

    // 触发 DOM 更新
    this._syncDomOrder();
  }

  /**
   * 创建可拖拽的列表项
   * @param {any} item - 项数据
   * @param {number} index - 索引
   * @returns {VDraggable}
   */
  _createDraggableItem(item, index) {
    const key = this._itemKey;
    const itemId = item[key];

    return vDraggable(d => {
      // 设置拖拽数据和分组
      d.data({ type: 'sort-item', index, itemId, group: this._group });
      d.group(this._group);  // 设置分组
      d.constraint('vertical');

      // 设置基础样式
      d.style('cursor', 'grab');
      d.style('userSelect', 'none');
      d.style('touchAction', 'none');
      d.style('position', 'relative');
      d.style('zIndex', '1');

      // 使用 itemRender 渲染内容，如果没有则使用默认渲染
      if (this._itemRender) {
        this._itemRender(item, index, d);
      } else {
        d.text(String(item));
      }

      // 拖拽开始
      d.onDragStart((e) => {
        this._dragIndex = index;
        this.setState('dragging', true);

        // 创建占位符（但不立即更新 DOM）
        this._showPlaceholder(index);
      });

      // 拖拽中
      d.onDrag((e) => {
        // 检测目标位置
        const targetIndex = this._findTargetIndex(e.y);
        if (targetIndex !== -1 && targetIndex !== this._placeholderIndex) {
          this._movePlaceholder(targetIndex);
        }
      });

      // 拖拽结束
      d.onDragEnd((e) => {
        this.setState('dragging', false);

        // 如果需要重排
        if (this._placeholderIndex !== -1 && this._placeholderIndex !== this._dragIndex) {
          this._reorderItems(this._dragIndex, this._placeholderIndex);
        } else {
          // 不需要重排，隐藏占位符
          this._hidePlaceholder();
        }

        this._dragIndex = -1;
        this._ghostEl = null;
      });

      return d;
    });
  }

  /**
   * 显示占位符
   * @param {number} index - 占位符位置
   */
  _showPlaceholder(index) {
    if (!this._placeholderEl) {
      this._placeholderEl = div(p => {
        p.style('height', '4px');
        p.style('background', '#409eff');
        p.style('borderRadius', '2px');
        p.style('margin', '0');
        p.style('transition', 'all 0.15s ease');
        p.style('position', 'absolute');  // 绝对定位，不影响其他元素
        p.style('left', '0');
        p.style('top', '0');
        p.style('width', '100%');
        p.style('pointerEvents', 'none');  // 不接收鼠标事件
        p.style('zIndex', '100');
        p.style('boxShadow', '0 0 10px rgba(64, 158, 255, 0.8)');
        // 添加插入箭头标识
        p.child(div(arr => {
          arr.style('position', 'absolute');
          arr.style('left', '10px');
          arr.style('top', '-8px');
          arr.style('width', '0');
          arr.style('height', '0');
          arr.style('borderLeft', '6px solid transparent');
          arr.style('borderRight', '6px solid transparent');
          arr.style('borderBottom', '8px solid #409eff');
          arr.style('filter', 'drop-shadow(0 0 4px rgba(64, 158, 255, 0.8))');
        }));
      });
      // 预先渲染占位符元素
      this._placeholderEl.renderDom();
    }

    this._placeholderIndex = index;
    // 不立即更新 DOM，等待第一次 pointermove 时再更新
  }

  /**
   * 移动占位符（使用绝对定位）
   * @param {number} index - 新位置
   */
  _movePlaceholder(index) {
    this._placeholderIndex = index;

    // 获取目标位置的元素
    const element = this.renderDom();
    if (!element) return;

    const children = Array.from(element.children).filter(
      el => el !== this._placeholderEl && el.classList.contains('sort-item')
    );

    let targetElement;
    let insertBefore = false;

    if (index === 0) {
      // 插入到第一个位置之前
      targetElement = children[0];
      insertBefore = true;
    } else if (index < children.length) {
      // 插入到两个元素之间
      targetElement = children[index];
      insertBefore = true;
    } else if (children.length > 0) {
      // 插入到最后一个位置之后
      targetElement = children[children.length - 1];
      insertBefore = false;
    }

    // 计算占位符的目标位置
    let targetTop = 0;
    if (targetElement) {
      if (insertBefore) {
        // 插入到目标元素之前
        targetTop = targetElement.offsetTop - 2;  // 减去占位符高度的一半
      } else {
        // 插入到最后一个元素之后
        targetTop = targetElement.offsetTop + targetElement.offsetHeight - 2;
      }
    }

    // 使用绝对定位移动占位符
    const placeholderDom = this._placeholderEl.renderDom();
    if (placeholderDom && placeholderDom.parentNode !== element) {
      element.appendChild(placeholderDom);
    }
    this._placeholderEl.style.top = targetTop + 'px';
    this._placeholderEl.style.opacity = '1';
  }

  /**
   * 隐藏占位符
   */
  _hidePlaceholder() {
    this._placeholderIndex = -1;
    // 隐藏占位符（不删除，以便下次重用）
    if (this._placeholderEl) {
      this._placeholderEl.style.opacity = '0';
      this._placeholderEl.style.top = '0';
    }
  }

  /**
   * 根据 Y 坐标查找目标索引
   * @param {number} clientY - 鼠标 Y 坐标
   * @returns {number}
   */
  _findTargetIndex(clientY) {
    const element = this.renderDom();
    if (!element) return -1;

    // 获取所有列表项（排除占位符）
    const children = Array.from(element.children).filter(
      el => el !== this._placeholderEl && el.classList.contains('sort-item')
    );

    if (children.length === 0) return 0;

    // 遍历所有元素，找到鼠标位置对应的索引
    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      // 当鼠标在元素上半部分时，返回该元素索引
      // 当鼠标在元素下半部分时，继续检查下一个元素
      if (clientY < midY) {
        return i;
      }
    }

    // 鼠标在所有元素的下半部分，返回最后一个索引
    return this._items.length - 1;
  }

  /**
   * 重排列表项
   * @param {number} fromIndex - 原索引
   * @param {number} toIndex - 目标索引
   */
  _reorderItems(fromIndex, toIndex) {
    const items = [...this._items];
    const [removed] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, removed);

    this._items = items;

    if (this._onReorder) {
      this._onReorder({
        type: 'reorder',
        items: this._items,
        fromIndex,
        toIndex
      });
    }

    // 隐藏占位符并重新渲染
    if (this._placeholderEl) {
      this._placeholderEl.style.opacity = '0';
    }
    this._renderItems();
  }

  /**
   * 同步 DOM 元素顺序
   */
  _syncDomOrder() {
    const element = this.renderDom();
    if (!element) return;

    // 先渲染所有子元素确保 _el 存在
    const domElements = [];
    for (const child of this._children) {
      if (child && !child._deleted) {
        const childEl = child.renderDom();
        if (childEl) {
          domElements.push(childEl);
        }
      }
    }

    // 清空 DOM（使用 removeChild 保留事件监听器）
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    // 重新添加子元素（事件监听器仍然绑定在子元素上）
    domElements.forEach((el) => {
      element.appendChild(el);
    });
  }

  /**
   * 渲染 DOM
   * @returns {HTMLElement|null}
   */
  renderDom() {
    if (this._deleted) return null;
    return super.renderDom();
  }
}

/**
 * 创建 VDragSortList 实例
 * @param {function} setup - 配置函数
 * @returns {VDragSortList}
 */
function vDragSortList(setup = null) {
  return new VDragSortList(setup);
}

// ============================================================================
// VDragSortGroup - 拖拽排序组（支持多个列表之间互相拖拽）
// ============================================================================

/**
 * VDragSortGroup - 拖拽排序组容器
 *
 * 用途：
 * - 管理多个 VDragSortList 之间的拖拽
 * - 同组列表之间可以互相拖拽
 * - 不同组之间不能互相拖拽
 *
 * @extends Tag
 */
class VDragSortGroup extends Tag {
  constructor(groupName, setup = null) {
    super('div', null);

    // 分组名称
    this._groupName = groupName;

    // 管理的列表
    this._lists = [];

    // 应用 setup
    if (setup) {
      setup(this);
    }
  }

  /**
   * 添加列表到组
   * @param {VDragSortList} list - 列表实例
   * @returns {this}
   */
  addList(list) {
    if (!list._group) {
      list.group(this._groupName);
    }
    this._lists.push(list);
    return this;
  }

  /**
   * 移除列表
   * @param {VDragSortList} list - 列表实例
   * @returns {this}
   */
  removeList(list) {
    const index = this._lists.indexOf(list);
    if (index !== -1) {
      this._lists.splice(index, 1);
    }
    return this;
  }
}

/**
 * 创建 VDragSortGroup 实例
 * @param {string} groupName - 分组名称
 * @param {function} setup - 配置函数
 * @returns {VDragSortGroup}
 */
function vDragSortGroup(groupName, setup = null) {
  return new VDragSortGroup(groupName, setup);
}

// ============================================================================
// 导出
// ============================================================================

export { VDragSortList, VDragSortGroup, vDragSortList, vDragSortGroup };
