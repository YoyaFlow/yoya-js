/**
 * 拖拽排序组件
 * 支持列表项拖拽排序功能
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
 * - 拖拽占位符显示
 * - 拖拽后顺序更新
 * - 支持 onReorder 回调
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
    this._dragIndex = -1;            // 当前拖拽的索引
    this._placeholderIndex = -1;     // 占位符位置

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
   * @param {function} fn - 渲染函数，接收 (item, index)
   * @returns {this}
   */
  itemRender(fn) {
    this._itemRender = fn;
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
    // 清空现有的子元素（除了占位符）
    this._children = this._children.filter(child => child === this._placeholderEl);

    // 重新渲染所有项
    this._items.forEach((item, index) => {
      const draggableItem = this._createDraggableItem(item, index);
      this._children.push(draggableItem);
    });
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
      d.data({ type: 'sort-item', index, itemId });
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

        // 设置原生拖拽数据
        const el = d.renderDom();
        if (el) {
          el.setAttribute('draggable', 'true');
          e.preventDefault();
        }

        // 创建占位符
        this._showPlaceholder(index);
      });

      // 拖拽中
      d.onDrag((e) => {
        // 检测目标位置
        const targetIndex = this._findTargetIndex(e.clientY);
        if (targetIndex !== -1 && targetIndex !== this._placeholderIndex) {
          this._movePlaceholder(targetIndex);
        }
      });

      // 拖拽结束
      d.onDragEnd((e) => {
        this.setState('dragging', false);
        this._hidePlaceholder();

        // 如果需要重排
        if (this._placeholderIndex !== -1 && this._placeholderIndex !== this._dragIndex) {
          this._reorderItems(this._dragIndex, this._placeholderIndex);
        }

        this._dragIndex = -1;
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
        p.style('height', '40px');
        p.style('background', 'rgba(64, 158, 255, 0.2)');
        p.style('border', '2px dashed #409eff');
        p.style('borderRadius', '4px');
        p.style('margin', '8px 0');
      });
    }

    this._placeholderIndex = index;
    this._movePlaceholder(index);
  }

  /**
   * 移动占位符
   * @param {number} index - 新位置
   */
  _movePlaceholder(index) {
    this._placeholderIndex = index;

    // 重新排列子元素顺序
    const newChildren = [];
    for (let i = 0; i < this._items.length; i++) {
      if (i === index && i !== this._dragIndex) {
        newChildren.push(this._placeholderEl);
      }
      if (i !== index && i !== this._dragIndex) {
        // 找到对应的 draggable item
        const item = this._items[i];
        const existingChild = this._children.find(child =>
          child !== this._placeholderEl &&
          child._dragData?.itemId === item[this._itemKey]
        );
        if (existingChild) {
          newChildren.push(existingChild);
        }
      }
    }
    if (index === this._items.length - 1 && this._dragIndex !== index) {
      newChildren.push(this._placeholderEl);
    }

    this._children = newChildren;
  }

  /**
   * 隐藏占位符
   */
  _hidePlaceholder() {
    this._placeholderIndex = -1;
    this._renderItems();
  }

  /**
   * 根据 Y 坐标查找目标索引
   * @param {number} clientY - 鼠标 Y 坐标
   * @returns {number}
   */
  _findTargetIndex(clientY) {
    const element = this.renderDom();
    if (!element) return -1;

    const children = Array.from(element.children).filter(
      el => el !== this._placeholderEl && !el.hasAttribute('draggable') === false
    );

    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (clientY < midY) {
        return i;
      }
    }

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

    this._renderItems();
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
 * 创建 VDragSortList 实例
 * @param {function} setup - 配置函数
 * @returns {VDragSortList}
 */
function vDragSortList(setup = null) {
  return new VDragSortList(setup);
}

export { VDragSortList, vDragSortList };
