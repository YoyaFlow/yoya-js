/**
 * @fileoverview DisplayConfig 显示配置
 * 统一管理所有显示相关的配置
 */

import { EventEmitter } from '../utils/EventEmitter.js';

class DisplayConfig extends EventEmitter {
  constructor(defaults = {}) {
    super();

    // 默认配置
    this._config = {
      grid: {
        enabled: defaults.grid?.enabled ?? false,
        size: defaults.grid?.size ?? 20,
        color: defaults.grid?.color ?? '#e0e0e0',
        snapEnabled: defaults.grid?.snapEnabled ?? false
      },
      rulers: {
        enabled: defaults.rulers?.enabled ?? false,
        unit: defaults.rulers?.unit ?? 'px',
        showMeasurements: defaults.rulers?.showMeasurements ?? true,
        width: defaults.rulers?.width ?? 30,
        backgroundColor: defaults.rulers?.backgroundColor ?? '#f5f5f5',
        textColor: defaults.rulers?.textColor ?? '#666'
      },
      guides: {
        enabled: defaults.guides?.enabled ?? true,
        color: defaults.guides?.color ?? '#ff0000',
        autoEnabled: defaults.guides?.autoEnabled ?? true,
        snapDistance: defaults.guides?.snapDistance ?? 5
      },
      background: {
        color: defaults.background?.color ?? '#f0f0f0',
        showCheckerboard: defaults.background?.showCheckerboard ?? false,
        checkerboardSize: defaults.background?.checkerboardSize ?? 20,
        checkerboardColor1: defaults.background?.checkerboardColor1 ?? '#e8e8e8',
        checkerboardColor2: defaults.background?.checkerboardColor2 ?? '#f0f0f0'
      },
      selection: {
        color: defaults.selection?.color ?? '#0066cc',
        handleSize: defaults.selection?.handleSize ?? 8,
        showHandles: defaults.selection?.showHandles ?? true,
        lineWidth: defaults.selection?.lineWidth ?? 2
      },
      performance: {
        maxFps: defaults.performance?.maxFps ?? 60,
        renderMode: defaults.performance?.renderMode ?? 'normal' // 'normal' | 'quality' | 'performance'
      }
    };
  }

  /**
   * 获取配置值
   * @param {string} path - 配置路径（如 'grid.enabled'）
   * @returns {any} 配置值
   */
  get(path) {
    const parts = path.split('.');
    let current = this._config;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * 设置配置值
   * @param {string} path - 配置路径（如 'grid.enabled'）
   * @param {any} value - 配置值
   */
  set(path, value) {
    const parts = path.split('.');
    let current = this._config;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    const oldValue = current[lastPart];
    current[lastPart] = value;

    // 触发变更事件
    this.emit('change', path, value, oldValue);
  }

  /**
   * 获取配置对象
   * @returns {Object} 配置对象
   */
  getAll() {
    return JSON.parse(JSON.stringify(this._config));
  }

  /**
   * 批量设置配置
   * @param {Object} config - 配置对象
   */
  setAll(config) {
    this._mergeConfig(this._config, config);
    this.emit('change', '*', config, null);
  }

  /**
   * 合并配置
   * @private
   * @param {Object} target - 目标配置
   * @param {Object} source - 源配置
   */
  _mergeConfig(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        this._mergeConfig(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }

  /**
   * 切换配置值（boolean）
   * @param {string} path - 配置路径
   */
  toggle(path) {
    const value = this.get(path);
    if (typeof value === 'boolean') {
      this.set(path, !value);
    }
  }

  /**
   * 重置为默认值
   * @param {string} path - 配置路径（可选，不传则重置所有）
   */
  reset(path) {
    if (path) {
      // 重置单个配置
      const defaultValue = this._getDefault(path);
      if (defaultValue !== undefined) {
        this.set(path, defaultValue);
      }
    } else {
      // 重置所有配置
      this._config = {
        grid: { enabled: false, size: 20, color: '#e0e0e0', snapEnabled: false },
        rulers: { enabled: false, unit: 'px', showMeasurements: true, width: 30 },
        guides: { enabled: true, color: '#ff0000', autoEnabled: true, snapDistance: 5 },
        background: { color: '#f0f0f0', showCheckerboard: false },
        selection: { color: '#0066cc', handleSize: 8, showHandles: true },
        performance: { maxFps: 60, renderMode: 'normal' }
      };
      this.emit('change', '*', 'reset', null);
    }
  }

  /**
   * 获取默认值
   * @private
   * @param {string} path - 配置路径
   * @returns {any} 默认值
   */
  _getDefault(path) {
    const defaults = {
      grid: { enabled: false, size: 20, color: '#e0e0e0', snapEnabled: false },
      rulers: { enabled: false, unit: 'px', showMeasurements: true, width: 30 },
      guides: { enabled: true, color: '#ff0000', autoEnabled: true, snapDistance: 5 },
      background: { color: '#f0f0f0', showCheckerboard: false },
      selection: { color: '#0066cc', handleSize: 8, showHandles: true, lineWidth: 2 },
      performance: { maxFps: 60, renderMode: 'normal' }
    };

    const parts = path.split('.');
    let current = defaults;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * 序列化为 JSON
   * @returns {Object} JSON 对象
   */
  toJSON() {
    return JSON.parse(JSON.stringify(this._config));
  }

  /**
   * 从 JSON 恢复
   * @param {Object} data - JSON 数据
   */
  fromJSON(data) {
    if (data) {
      this._mergeConfig(this._config, data);
      this.emit('change', '*', this._config, null);
    }
  }
}

export { DisplayConfig };
