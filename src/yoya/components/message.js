/**
 * Yoya.Basic - Message 消息提示组件
 * 用于显示全局消息提示（成功、错误、警告、信息）
 * @module Yoya.Message
 * @example
 * // 基础用法
 * import { toast } from '../yoya/index.js';
 *
 * toast.success('操作成功！');
 * toast.error('操作失败，请重试！');
 * toast.warning('请注意此操作的影响！');
 * toast.info('这是一个普通信息提示！');
 *
 * // 自定义时长
 * toast.info('消息内容', 5000);  // 5 秒后关闭
 *
 * // 使用消息容器
 * import { vMessageContainer } from '../yoya/index.js';
 *
 * const container = vMessageContainer('top-right');
 * container.success('成功！');
 * container.error('失败！');
 */

import { Tag, div, span } from '../core/basic.js';

// ============================================
// VMessage 消息提示
// ============================================

/**
 * VMessage 消息提示组件
 * 支持 success、error、warning、info 四种类型
 * @class
 * @extends Tag
 */
class VMessage extends Tag {
  static _stateAttrs = ['type'];

  /**
   * 创建 VMessage 实例
   * @param {string} [content=''] - 消息内容
   * @param {string} [type='info'] - 消息类型：success、error、warning、info
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(content = '', type = 'info', setup = null) {
    super('div', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);

    this._content = content;
    this._type = type;
    this._closable = true;
    this._duration = 3000;
    this._timer = null;
    this._closed = false;

    this.addClass('yoya-message');
    this._applyTypeStyles();
    this._buildContent();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 应用类型样式
   * @private
   */
  _applyTypeStyles() {
    this.removeClass('yoya-message--success', 'yoya-message--error', 'yoya-message--warning', 'yoya-message--info');
    this.addClass(`yoya-message--${this._type}`);
  }

  /**
   * 获取类型图标
   * @returns {string} 图标字符
   * @private
   */
  _getTypeIcon() {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[this._type] || icons.info;
  }

  /**
   * 构建消息内容
   * @private
   */
  _buildContent() {
    this.child(span(icon => {
      icon.text(this._getTypeIcon());
      icon.addClass('yoya-message__icon');
    }));

    this.child(span(text => {
      text.text(this._content);
      text.addClass('yoya-message__text');
    }));

    if (this._closable) {
      this.child(span(closeBtn => {
        closeBtn.text('×');
        closeBtn.addClass('yoya-message__close');
        closeBtn.on('click', (e) => {
          e.stopPropagation();
          this.close();
        });
      }));
    }
  }

  /**
   * 设置消息内容
   * @param {string} text - 消息内容
   * @returns {this}
   */
  content(text) {
    this._content = text;
    return this;
  }

  /**
   * 设置是否可关闭
   * @param {boolean} value - 是否可关闭
   * @returns {this}
   */
  closable(value) {
    this._closable = value;
    return this;
  }

  /**
   * 设置自动关闭时长
   * @param {number} ms - 时长（毫秒）
   * @returns {this}
   */
  duration(ms) {
    this._duration = ms;
    return this;
  }

  /**
   * 关闭消息
   * @returns {this}
   */
  close() {
    if (this._closed) return;

    this._closed = true;

    if (this._boundElement) {
      this._boundElement.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => {
        this.destroy();
      }, 300);
    } else {
      this.destroy();
    }

    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  /**
   * 启动自动关闭计时器
   * @private
   */
  startTimer() {
    if (this._duration > 0 && !this._timer) {
      this._timer = setTimeout(() => {
        this.close();
      }, this._duration);
    }
  }

  /**
   * 停止自动关闭计时器
   * @private
   */
  stopTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  /**
   * 渲染 DOM 元素
   * @returns {HTMLElement|null}
   */
  renderDom() {
    const element = super.renderDom();
    if (element && this._duration > 0) {
      this.startTimer();
    }
    return element;
  }
}

/**
 * 创建 VMessage 实例
 * @param {string} [content=''] - 消息内容
 * @param {string} [type='info'] - 消息类型
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMessage}
 */
function vMessage(content = '', type = 'info', setup = null) {
  return new VMessage(content, type, setup);
}

// ============================================
// VMessageContainer 消息容器
// ============================================

/**
 * VMessageContainer 消息容器
 * 用于管理多个消息提示，支持多种位置
 * @class
 * @extends Tag
 */
class VMessageContainer extends Tag {
  /**
   * 创建 VMessageContainer 实例
   * @param {string} [position='top-right'] - 位置
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(position = 'top-right', setup = null) {
    super('div', null);

    this._position = position;
    this._messages = [];
    this._maxVisible = 5;

    this.addClass('yoya-message-container');
    this._applyPosition();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 应用位置样式
   * @private
   */
  _applyPosition() {
    this.removeClass(
      'yoya-message-container--top-left',
      'yoya-message-container--top-right',
      'yoya-message-container--top-center',
      'yoya-message-container--bottom-left',
      'yoya-message-container--bottom-right',
      'yoya-message-container--bottom-center'
    );
    this.addClass(`yoya-message-container--${this._position}`);
  }

  /**
   * 添加消息
   * @param {string} content - 消息内容
   * @param {string} [type='info'] - 消息类型
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  add(content, type = 'info', duration = 3000) {
    const msg = vMessage(content, type);
    msg.closable(true);
    msg.duration(duration);

    this._messages.push(msg);
    this.child(msg);

    if (this._boundElement) {
      const msgEl = msg.renderDom();
      if (msgEl) {
        this._boundElement.appendChild(msgEl);
      }
    }

    if (this._messages.length > this._maxVisible) {
      const oldMsg = this._messages.shift();
      if (oldMsg && !oldMsg._closed) {
        oldMsg.close();
      }
    }

    return msg;
  }

  /**
   * 添加成功消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  success(content, duration = 3000) {
    return this.add(content, 'success', duration);
  }

  /**
   * 添加错误消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  error(content, duration = 3000) {
    return this.add(content, 'error', duration);
  }

  /**
   * 添加警告消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  warning(content, duration = 3000) {
    return this.add(content, 'warning', duration);
  }

  /**
   * 添加信息消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  info(content, duration = 3000) {
    return this.add(content, 'info', duration);
  }

  /**
   * 清空所有消息
   */
  clear() {
    this._messages.forEach(msg => msg.close());
    this._messages = [];
    this._children = [];
  }

  /**
   * 设置最大可见消息数量
   * @param {number} count - 数量
   * @returns {this}
   */
  maxVisible(count) {
    this._maxVisible = count;
    return this;
  }
}

/**
 * 创建 VMessageContainer 实例
 * @param {string} [position='top-right'] - 位置
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMessageContainer}
 */
function vMessageContainer(position = 'top-right', setup = null) {
  return new VMessageContainer(position, setup);
}

// ============================================
// VMessageManager 消息管理器（单例）
// ============================================

/**
 * VMessageManager 消息管理器（单例模式）
 * 用于管理全局消息提示
 * @class
 */
class VMessageManager {
  /**
   * 创建 VMessageManager 实例（单例）
   */
  constructor() {
    if (VMessageManager._instance) {
      return VMessageManager._instance;
    }
    this._container = null;
    this._position = 'top-right';
    this._maxVisible = 5;
    VMessageManager._instance = this;
  }

  /**
   * 获取消息容器（惰性创建）
   * @returns {VMessageContainer}
   * @private
   */
  _getContainer() {
    if (!this._container) {
      this._container = vMessageContainer(this._position);
      this._container.maxVisible(this._maxVisible);
      document.body.appendChild(this._container.renderDom());
    }
    return this._container;
  }

  /**
   * 根据位置重新创建容器（如需要）
   * @param {string} position - 位置
   * @returns {VMessageContainer}
   * @private
   */
  _recreateContainerIfNeeded(position) {
    if (position && position !== this._position) {
      this._position = position;
      if (this._container) {
        this._container.destroy();
        this._container = null;
      }
    }
    if (!this._container) {
      this._container = vMessageContainer(this._position);
      this._container.maxVisible(this._maxVisible);
      document.body.appendChild(this._container.renderDom());
    }
    return this._container;
  }

  /**
   * 统一入口 - 支持多种调用方式
   *
   * 1. toast.success('消息') / toast.error('消息') / toast.warning('消息') / toast.info('消息')
   * 2. toast('消息', { type: 'success', duration: 3000, position: 'top-center' })
   * 3. toast('消息', 'success', 3000)  // 兼容旧 API
   */
  call = (content, typeOrOptions = 'info', duration = 3000) => {
    // 处理参数
    let type = typeOrOptions;
    let position = this._position;

    if (typeof typeOrOptions === 'object') {
      type = typeOrOptions.type || 'info';
      duration = typeOrOptions.duration ?? 3000;
      position = typeOrOptions.position || this._position;
    }

    const container = this._recreateContainerIfNeeded(position);
    return container.add(content, type, duration);
  };

  /**
   * 成功消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  success = (content, duration = 3000) => this._getContainer().success(content, duration);

  /**
   * 错误消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  error = (content, duration = 3000) => this._getContainer().error(content, duration);

  /**
   * 警告消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  warning = (content, duration = 3000) => this._getContainer().warning(content, duration);

  /**
   * 信息消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  info = (content, duration = 3000) => this._getContainer().info(content, duration);

  /**
   * 清空所有消息
   */
  clear = () => {
    if (this._container) {
      this._container.clear();
    }
  };

  /**
   * 设置消息位置
   * @param {string} position - 位置
   */
  setPosition = (position) => {
    this._position = position;
    if (this._container) {
      this._container.destroy();
      this._container = null;
    }
  };

  /**
   * 设置最大可见消息数量
   * @param {number} count - 数量
   * @returns {this}
   */
  setMaxVisible = (count) => {
    this._maxVisible = count;
    return this;
  };
}

const vMessageManager = new VMessageManager();

/**
 * 全局消息提示函数（toast）
 * 支持多种调用方式：
 * 1. toast.success('消息') / toast.error('消息') / toast.warning('消息') / toast.info('消息')
 * 2. toast('消息', { type: 'success', duration: 3000, position: 'top-center' })
 * 3. toast('消息', 'success', 3000)  // 兼容旧 API
 * @param {string} content - 消息内容
 * @param {string|Object} [typeOrOptions='info'] - 消息类型或配置对象
 * @param {number} [duration=3000] - 自动关闭时长（毫秒）
 * @returns {VMessage}
 */
function toast(content, typeOrOptions = 'info', duration = 3000) {
  return vMessageManager.call(content, typeOrOptions, duration);
}

// 挂载快捷方法
toast.success = vMessageManager.success;
toast.error = vMessageManager.error;
toast.warning = vMessageManager.warning;
toast.info = vMessageManager.info;
toast.clear = vMessageManager.clear;
toast.setPosition = vMessageManager.setPosition;

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 vMessage 子元素
 * @param {string} [content=''] - 消息内容
 * @param {string} [type='info'] - 消息类型
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMessage = function(content, type = 'info', setup = null) {
  const el = vMessage(content, type, setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vMessageContainer 子元素
 * @param {string} [position='top-right'] - 位置
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMessageContainer = function(position = 'top-right', setup = null) {
  const el = vMessageContainer(position, setup);
  this.child(el);
  return this;
};

// 兼容旧方法名
Tag.prototype.message = Tag.prototype.vMessage;
Tag.prototype.messageContainer = Tag.prototype.vMessageContainer;

// ============================================
// 添加动画样式
// ============================================

if (typeof document !== 'undefined') {
  const styleId = 'yoya-message-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// 导出
// ============================================

export {
  VMessage,
  VMessageContainer,
  VMessageManager,
  vMessage,
  vMessageContainer,
  vMessageManager,
  toast
};
