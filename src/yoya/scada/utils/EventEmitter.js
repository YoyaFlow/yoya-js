/**
 * @fileoverview EventEmitter 事件发射器
 * 提供事件订阅/发布功能
 */

class EventEmitter {
  constructor() {
    this._events = new Map();
  }

  /**
   * 订阅事件
   * @param {string} event - 事件名
   * @param {Function} handler - 处理函数
   * @returns {EventEmitter} this
   */
  on(event, handler) {
    if (!this._events.has(event)) {
      this._events.set(event, new Set());
    }
    this._events.get(event).add(handler);
    return this;
  }

  /**
   * 取消订阅
   * @param {string} event - 事件名
   * @param {Function} handler - 处理函数
   * @returns {EventEmitter} this
   */
  off(event, handler) {
    const handlers = this._events.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this._events.delete(event);
      }
    }
    return this;
  }

  /**
   * 一次性订阅
   * @param {string} event - 事件名
   * @param {Function} handler - 处理函数
   * @returns {EventEmitter} this
   */
  once(event, handler) {
    const onceHandler = (...args) => {
      handler(...args);
      this.off(event, onceHandler);
    };
    onceHandler._originalHandler = handler;
    return this.on(event, onceHandler);
  }

  /**
   * 触发事件
   * @param {string} event - 事件名
   * @param  {...any} args - 事件参数
   * @returns {boolean} 是否有监听器
   */
  emit(event, ...args) {
    const handlers = this._events.get(event);
    if (!handlers || handlers.size === 0) {
      return false;
    }

    // 复制到数组，防止处理过程中修改
    const handlersArray = Array.from(handlers);
    for (const handler of handlersArray) {
      try {
        handler(...args);
      } catch (e) {
        console.error(`Error in event handler for "${event}":`, e);
      }
    }
    return true;
  }

  /**
   * 移除所有监听器
   * @param {string} event - 事件名（可选，不传则清空所有）
   * @returns {EventEmitter} this
   */
  removeAllListeners(event) {
    if (event) {
      this._events.delete(event);
    } else {
      this._events.clear();
    }
    return this;
  }

  /**
   * 获取事件监听器数量
   * @param {string} event - 事件名
   * @returns {number} 监听器数量
   */
  listenerCount(event) {
    const handlers = this._events.get(event);
    return handlers ? handlers.size : 0;
  }

  /**
   * 获取所有事件名
   * @returns {string[]} 事件名数组
   */
  eventNames() {
    return Array.from(this._events.keys());
  }
}

export { EventEmitter };
