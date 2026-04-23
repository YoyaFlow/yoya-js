/**
 * @fileoverview ContainerManager 容器管理器
 * 管理画布上的布局容器（添加、删除、选择、查找）
 */

import { EventEmitter } from '../utils/EventEmitter.js';
import { LayoutContainer } from './LayoutContainer.js';

class ContainerManager extends EventEmitter {
  constructor() {
    super();

    // 容器存储
    this.containers = new Map();

    // 选中的容器 ID
    this.selectedContainerId = null;

    // 拾取的容器 ID（用于戴森球计划式操作）
    this.pickupContainerId = null;

    // 选中的元素 ID（新增）
    this.selectedElementId = null;

    // 容器顺序（从底到顶）
    this.containerOrder = [];

    // 容器 ID 计数器
    this._idCounter = 0;
  }

  /**
   * 生成唯一 ID
   * @private
   * @returns {string}
   */
  _generateId() {
    return `container-${++this._idCounter}`;
  }

  /**
   * 创建容器
   * @param {Object} options - 容器选项
   * @param {string} options.type - 容器类型：rect, circle, ellipse, roundedRect
   * @param {number} options.x - X 坐标
   * @param {number} options.y - Y 坐标
   * @param {number} options.width - 宽度
   * @param {number} options.height - 高度
   * @param {string} options.name - 名称
   * @param {string} options.fillColor - 填充颜色
   * @param {string} options.strokeColor - 描边颜色
   * @returns {LayoutContainer}
   */
  createContainer(options = {}) {
    const id = this._generateId();
    const container = new LayoutContainer(id, options);

    this.containers.set(id, container);
    this.containerOrder.push(id);

    // 自动选中新创建的容器
    this.selectContainer(id);

    this.emit('change', { type: 'create', container });
    return container;
  }

  /**
   * 添加现有容器
   * @param {LayoutContainer} container - 容器实例
   */
  addContainer(container) {
    if (!container.id) {
      container.id = this._generateId();
    }

    this.containers.set(container.id, container);
    this.containerOrder.push(container.id);

    this.emit('change', { type: 'add', container });
  }

  /**
   * 删除容器
   * @param {string} id - 容器 ID
   * @returns {LayoutContainer|null}
   */
  deleteContainer(id) {
    const container = this.containers.get(id);
    if (!container) return null;

    // 如果删除的是选中的容器，清除选择
    if (this.selectedContainerId === id) {
      this.selectedContainerId = null;
    }

    // 从顺序列表中移除
    const index = this.containerOrder.indexOf(id);
    if (index > -1) {
      this.containerOrder.splice(index, 1);
    }

    this.containers.delete(id);
    this.emit('change', { type: 'delete', container });
    return container;
  }

  /**
   * 临时移除容器（用于拾取操作，容器仍在内存中但不在画布上渲染）
   * @param {string} id - 容器 ID
   * @returns {LayoutContainer|null}
   */
  pickupContainer(id) {
    const container = this.containers.get(id);
    if (!container) return null;

    // 如果拾取的是选中的容器，清除选择
    if (this.selectedContainerId === id) {
      this.selectedContainerId = null;
    }

    // 记录拾取的容器 ID
    this.pickupContainerId = id;

    // 从顺序列表中移除（但不删除容器本身）
    const index = this.containerOrder.indexOf(id);
    if (index > -1) {
      this.containerOrder.splice(index, 1);
    }

    this.emit('change', { type: 'pickup', container });
    return container;
  }

  /**
   * 释放拾取的容器（重新添加到渲染列表）
   * @param {LayoutContainer} container - 容器实例
   */
  releaseContainer(container) {
    // 清除拾取状态
    this.pickupContainerId = null;

    if (!this.containers.has(container.id)) {
      this.containers.set(container.id, container);
    }
    if (!this.containerOrder.includes(container.id)) {
      this.containerOrder.push(container.id);
    }
    this.emit('change', { type: 'release', container });
  }

  /**
   * 获取容器
   * @param {string} id - 容器 ID
   * @returns {LayoutContainer|null}
   */
  getContainer(id) {
    return this.containers.get(id) || null;
  }

  /**
   * 获取所有容器（按顺序）
   * @returns {LayoutContainer[]}
   */
  getAllContainers() {
    return this.containerOrder.map(id => this.containers.get(id)).filter(Boolean);
  }

  /**
   * 选中容器
   * @param {string|null} id - 容器 ID
   */
  selectContainer(id) {
    // 取消之前的选中
    if (this.selectedContainerId) {
      const prevContainer = this.containers.get(this.selectedContainerId);
      if (prevContainer) {
        prevContainer.selected = false;
        prevContainer.emit('change', { type: 'deselect' });
      }
    }

    this.selectedContainerId = id;

    // 设置新选中状态
    if (id) {
      const container = this.containers.get(id);
      if (container) {
        container.selected = true;
        container.emit('change', { type: 'select' });
      }
    }

    this.emit('change', { type: 'select', containerId: id });
  }

  /**
   * 取消选中容器
   */
  unselectContainer() {
    this.selectContainer(null);
  }

  /**
   * 获取选中的容器
   * @returns {LayoutContainer|null}
   */
  getSelectedContainer() {
    if (!this.selectedContainerId) return null;
    return this.containers.get(this.selectedContainerId);
  }

  /**
   * 查找包含点的容器
   * @param {number} x - X 坐标（世界坐标）
   * @param {number} y - Y 坐标（世界坐标）
   * @param {boolean} deep - 是否深入查找最内层容器
   * @returns {LayoutContainer|null}
   */
  findContainerAtPoint(x, y, deep = true) {
    // 从顶到底遍历
    const containers = this.getAllContainers().reverse();

    if (deep) {
      // 深入查找：找到最内层的容器
      return this._deepFind(containers, x, y);
    } else {
      // 只查找最外层
      for (const container of containers) {
        if (container.containsPoint(x, y)) {
          return container;
        }
      }
    }

    return null;
  }

  /**
   * 深入查找容器
   * @private
   * @param {LayoutContainer[]} containers - 容器列表
   * @param {number} x - X 坐标
   * @param {number} y - Y 坐标
   * @returns {LayoutContainer|null}
   */
  _deepFind(containers, x, y) {
    for (const container of containers) {
      if (container.containsPoint(x, y)) {
        // 递归查找子容器
        const childResult = this._deepFind(container.children, x, y);
        return childResult || container;
      }
    }
    return null;
  }

  /**
   * 移动容器到最前面（顶层）
   * @param {string} id - 容器 ID
   */
  bringToFront(id) {
    const index = this.containerOrder.indexOf(id);
    if (index > -1) {
      this.containerOrder.splice(index, 1);
      this.containerOrder.push(id);
      this.emit('change', { type: 'reorder', containerId: id });
    }
  }

  /**
   * 移动容器到最后面（底层）
   * @param {string} id - 容器 ID
   */
  sendToBack(id) {
    const index = this.containerOrder.indexOf(id);
    if (index > -1) {
      this.containerOrder.splice(index, 1);
      this.containerOrder.unshift(id);
      this.emit('change', { type: 'reorder', containerId: id });
    }
  }

  /**
   * 更新容器属性
   * @param {string} id - 容器 ID
   * @param {Object} props - 属性对象
   */
  updateContainer(id, props) {
    const container = this.containers.get(id);
    if (!container) return;

    if (props.x !== undefined || props.y !== undefined) {
      const x = props.x !== undefined ? props.x : container.x;
      const y = props.y !== undefined ? props.y : container.y;
      container.setPosition(x, y);
    }

    if (props.width !== undefined) {
      container.setSize(props.width, container.height);
    }

    if (props.height !== undefined) {
      container.setSize(container.width, props.height);
    }

    if (props.fillColor !== undefined) {
      container.fillColor = props.fillColor;
    }

    if (props.strokeColor !== undefined) {
      container.strokeColor = props.strokeColor;
    }

    if (props.visible !== undefined) {
      container.visible = props.visible;
    }

    if (props.locked !== undefined) {
      container.locked = props.locked;
    }

    this.emit('change', { type: 'update', containerId: id, props });
  }

  /**
   * 清空所有容器
   */
  clear() {
    this.containers.clear();
    this.containerOrder = [];
    this.selectedContainerId = null;
    this._idCounter = 0;
    this.emit('change', { type: 'clear' });
  }

  /**
   * 获取容器数量
   * @returns {number}
   */
  get count() {
    return this.containers.size;
  }

  // ========== 元素管理方法（新增） ==========

  /**
   * 获取元素（遍历所有容器查找）
   * @param {string} id - 元素 ID
   * @returns {import('../elements/Element.js').Element|null}
   */
  getElement(id) {
    for (const container of this.containers.values()) {
      const element = container.getElement(id);
      if (element) return element;
    }
    return null;
  }

  /**
   * 获取选中的元素
   * @returns {import('../elements/Element.js').Element|null}
   */
  getSelectedElement() {
    if (!this.selectedElementId) return null;
    return this.getElement(this.selectedElementId);
  }

  /**
   * 选择元素
   * @param {string|null} id - 元素 ID
   */
  selectElement(id) {
    // 取消之前的元素选中
    if (this.selectedElementId) {
      const prevElement = this.getElement(this.selectedElementId);
      if (prevElement) {
        prevElement.selected = false;
        prevElement.emit('change', { type: 'deselect' });
      }
    }

    // 同时取消容器选中
    if (this.selectedContainerId) {
      const prevContainer = this.containers.get(this.selectedContainerId);
      if (prevContainer) {
        prevContainer.selected = false;
      }
      this.selectedContainerId = null;
    }

    this.selectedElementId = id;

    // 设置新选中状态
    if (id) {
      const element = this.getElement(id);
      if (element) {
        element.selected = true;
        element.emit('change', { type: 'select' });
      }
    }

    this.emit('change', { type: 'selectElement', elementId: id });
  }

  /**
   * 查找指定容器中的元素（通过坐标）
   * @param {string} containerId - 容器 ID
   * @param {number} x - X 坐标（世界坐标）
   * @param {number} y - Y 坐标（世界坐标）
   * @returns {import('../elements/Element.js').Element|null}
   */
  findElementInContainer(containerId, x, y) {
    const container = this.getContainer(containerId);
    if (!container) return null;

    const bounds = container.getBounds();
    const localX = x - bounds.minX;
    const localY = y - bounds.minY;

    return container.getElementAtPoint(localX, localY);
  }

  /**
   * 查找任意容器中的元素（通过坐标）
   * @param {number} x - X 坐标（世界坐标）
   * @param {number} y - Y 坐标（世界坐标）
   * @returns {{element: import('../elements/Element.js').Element, container: import('./LayoutContainer.js').LayoutContainer}|null}
   */
  findElementAtPoint(x, y) {
    // 从顶到底遍历容器
    const containers = this.getAllContainers().reverse();

    for (const container of containers) {
      const bounds = container.getBounds();
      const localX = x - bounds.minX;
      const localY = y - bounds.minY;

      const element = container.getElementAtPoint(localX, localY);
      if (element) {
        return { element, container };
      }
    }

    return null;
  }

  /**
   * 删除元素
   * @param {string} elementId - 元素 ID
   * @returns {import('../elements/Element.js').Element|null}
   */
  deleteElement(elementId) {
    const element = this.getElement(elementId);
    if (!element) return null;

    // 如果删除的是选中的元素，清除选择
    if (this.selectedElementId === elementId) {
      this.selectedElementId = null;
    }

    // 从容器中移除
    if (element.parent) {
      element.parent.removeElement(element);
    }

    this.emit('change', { type: 'deleteElement', elementId });
    return element;
  }

  /**
   * 序列化为 JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      containers: this.getAllContainers().map(c => c.toJSON()),
      containerOrder: [...this.containerOrder],
      selectedContainerId: this.selectedContainerId,
      selectedElementId: this.selectedElementId,
      _idCounter: this._idCounter
    };
  }

  /**
   * 从 JSON 恢复
   * @param {Object} data - JSON 数据
   * @param {Object} elementFromJSON - 元素 fromJSON 函数映射表（key: 元素类型，value: fromJSON 函数）
   */
  fromJSON(data, elementFromJSON = null) {
    this.clear();

    if (data.containers) {
      for (const containerData of data.containers) {
        const container = LayoutContainer.fromJSON(containerData, elementFromJSON);
        this.addContainer(container);
      }
    }

    if (data.containerOrder) {
      this.containerOrder = [...data.containerOrder];
    }

    if (data.selectedContainerId) {
      this.selectContainer(data.selectedContainerId);
    }

    if (data.selectedElementId) {
      this.selectedElementId = data.selectedElementId;
    }

    if (data._idCounter) {
      this._idCounter = data._idCounter;
    }
  }
}

export { ContainerManager };
