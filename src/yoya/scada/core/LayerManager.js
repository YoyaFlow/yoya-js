/**
 * @fileoverview LayerManager 图层管理
 * 管理图层的创建、删除、排序和可见性控制
 */

import { EventEmitter } from '../utils/EventEmitter.js';

class LayerManager extends EventEmitter {
  constructor() {
    super();

    /** @type {Map<string, Object>} */
    this.layers = new Map();
    this.activeLayerId = null;

    // 图层顺序（从底到顶）
    this.layerOrder = [];
  }

  /**
   * 创建图层
   * @param {string} id - 图层 ID
   * @param {Object} options - 选项
   * @param {string} options.name - 图层名称
   * @param {boolean} options.visible - 是否可见
   * @param {boolean} options.locked - 是否锁定
   * @param {number} options.opacity - 不透明度 (0-1)
   * @param {number} options.order - 图层顺序（可选，默认添加到顶部）
   * @returns {Object} 创建的图层
   */
  createLayer(id, options = {}) {
    if (this.layers.has(id)) {
      console.warn(`LayerManager: Layer "${id}" already exists`);
      return this.getLayer(id);
    }

    const layer = {
      id,
      name: options.name || id,
      visible: options.visible ?? true,
      locked: options.locked ?? false,
      opacity: options.opacity ?? 1.0,
      order: options.order ?? this.layerOrder.length,
      createdAt: Date.now()
    };

    this.layers.set(id, layer);

    // 插入到指定顺序位置
    if (options.order !== undefined) {
      this.layerOrder.splice(options.order, 0, id);
    } else {
      this.layerOrder.push(id);
    }

    // 更新其他图层的 order
    this._updateLayerOrders();

    // 如果没有活动图层，设为当前
    if (!this.activeLayerId) {
      this.activeLayerId = id;
    }

    this.emit('layerChange', {
      type: 'create',
      layerId: id,
      layer
    });

    return layer;
  }

  /**
   * 删除图层
   * @param {string} id - 图层 ID
   * @returns {Object|null} 删除的图层
   */
  deleteLayer(id) {
    const layer = this.layers.get(id);
    if (!layer) {
      return null;
    }

    this.layers.delete(id);

    // 从顺序列表中移除
    const index = this.layerOrder.indexOf(id);
    if (index > -1) {
      this.layerOrder.splice(index, 1);
    }

    // 更新其他图层的 order
    this._updateLayerOrders();

    // 如果删除的是活动图层，选择第一个可用图层
    if (this.activeLayerId === id) {
      this.activeLayerId = this.layerOrder[0] || null;
    }

    this.emit('layerChange', {
      type: 'delete',
      layerId: id,
      layer
    });

    return layer;
  }

  /**
   * 获取图层
   * @param {string} id - 图层 ID
   * @returns {Object|null} 图层对象
   */
  getLayer(id) {
    return this.layers.get(id) || null;
  }

  /**
   * 设置活动图层
   * @param {string} id - 图层 ID
   */
  setActiveLayer(id) {
    if (!this.layers.has(id)) {
      console.warn(`LayerManager: Layer "${id}" does not exist`);
      return;
    }

    this.activeLayerId = id;
    this.emit('activeLayerChange', {
      layerId: id
    });
  }

  /**
   * 获取活动图层
   * @returns {Object|null} 活动图层
   */
  getActiveLayer() {
    if (!this.activeLayerId) return null;
    return this.layers.get(this.activeLayerId);
  }

  /**
   * 设置图层可见性
   * @param {string} id - 图层 ID
   * @param {boolean} visible - 是否可见
   */
  setLayerVisibility(id, visible) {
    const layer = this.layers.get(id);
    if (!layer) return;

    layer.visible = visible;
    this.emit('layerChange', {
      type: 'visibility',
      layerId: id,
      visible
    });
  }

  /**
   * 设置图层锁定状态
   * @param {string} id - 图层 ID
   * @param {boolean} locked - 是否锁定
   */
  setLayerLocked(id, locked) {
    const layer = this.layers.get(id);
    if (!layer) return;

    layer.locked = locked;
    this.emit('layerChange', {
      type: 'locked',
      layerId: id,
      locked
    });
  }

  /**
   * 设置图层不透明度
   * @param {string} id - 图层 ID
   * @param {number} opacity - 不透明度 (0-1)
   */
  setLayerOpacity(id, opacity) {
    const layer = this.layers.get(id);
    if (!layer) return;

    layer.opacity = Math.max(0, Math.min(1, opacity));
    this.emit('layerChange', {
      type: 'opacity',
      layerId: id,
      opacity: layer.opacity
    });
  }

  /**
   * 重新排序图层
   * @param {string} id - 图层 ID
   * @param {number} newIndex - 新位置索引
   */
  reorderLayer(id, newIndex) {
    const oldIndex = this.layerOrder.indexOf(id);
    if (oldIndex === -1 || oldIndex === newIndex) return;

    // 从旧位置移除
    this.layerOrder.splice(oldIndex, 1);
    // 插入到新位置
    this.layerOrder.splice(newIndex, 0, id);

    // 更新 order 属性
    this._updateLayerOrders();

    this.emit('layerChange', {
      type: 'reorder',
      layerId: id,
      oldIndex,
      newIndex
    });
  }

  /**
   * 更新所有图层的 order 属性
   * @private
   */
  _updateLayerOrders() {
    this.layerOrder.forEach((id, index) => {
      const layer = this.layers.get(id);
      if (layer) {
        layer.order = index;
      }
    });
  }

  /**
   * 获取所有可见图层（按顺序）
   * @returns {Object[]} 可见图层数组
   */
  getVisibleLayers() {
    return this.layerOrder
      .map(id => this.layers.get(id))
      .filter(layer => layer && layer.visible);
  }

  /**
   * 获取所有图层（按顺序）
   * @returns {Object[]} 图层数组
   */
  getAllLayers() {
    return this.layerOrder.map(id => this.layers.get(id)).filter(Boolean);
  }

  /**
   * 清空所有图层
   */
  clear() {
    this.layers.clear();
    this.layerOrder = [];
    this.activeLayerId = null;
    this.emit('layerChange', {
      type: 'clear'
    });
  }

  /**
   * 获取图层数量
   * @returns {number} 图层数量
   */
  get count() {
    return this.layers.size;
  }

  /**
   * 序列化为 JSON
   * @returns {Object} JSON 对象
   */
  toJSON() {
    return {
      layers: this.getAllLayers(),
      activeLayerId: this.activeLayerId
    };
  }

  /**
   * 从 JSON 恢复
   * @param {Object} data - JSON 数据
   */
  fromJSON(data) {
    this.clear();

    if (data.layers) {
      data.layers.forEach(layer => {
        this.createLayer(layer.id, {
          name: layer.name,
          visible: layer.visible,
          locked: layer.locked,
          opacity: layer.opacity,
          order: layer.order
        });
      });
    }

    if (data.activeLayerId) {
      this.setActiveLayer(data.activeLayerId);
    }
  }
}

export { LayerManager };
