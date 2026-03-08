/**
 * Yoya.Basic - Message 消息提示组件
 * 用于显示全局消息提示（成功、错误、警告、信息）
 */

import { Tag, div, span } from '../core/basic.js';

// ============================================
// VMessage 消息提示
// ============================================

class VMessage extends Tag {
  constructor(content = '', type = 'info', setup = null) {
    super('div', null);

    this._content = content;
    this._type = type;
    this._closable = true;
    this._duration = 3000;
    this._timer = null;
    this._closed = false;

    this.styles({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: 'var(--islands-message-box-shadow, 0 4px 12px rgba(0,0,0,0.15))',
      minWidth: '280px',
      maxWidth: '400px',
      animation: 'slideIn 0.3s ease',
      position: 'relative'
    });

    this._applyTypeStyles();
    this._buildContent();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _applyTypeStyles() {
    const typeStyles = {
      success: {
        background: 'var(--islands-message-success-bg)',
        color: 'var(--islands-message-success-color)',
        border: 'var(--islands-message-success-border)',
      },
      error: {
        background: 'var(--islands-message-error-bg)',
        color: 'var(--islands-message-error-color)',
        border: 'var(--islands-message-error-border)',
      },
      warning: {
        background: 'var(--islands-message-warning-bg)',
        color: 'var(--islands-message-warning-color)',
        border: 'var(--islands-message-warning-border)',
      },
      info: {
        background: 'var(--islands-message-info-bg)',
        color: 'var(--islands-message-info-color)',
        border: 'var(--islands-message-info-border)',
      }
    };

    const styles = typeStyles[this._type] || typeStyles.info;
    this.styles(styles);
  }

  _getTypeIcon() {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[this._type] || icons.info;
  }

  _buildContent() {
    this.child(span(icon => {
      icon.text(this._getTypeIcon());
      icon.styles({
        fontSize: 'var(--islands-message-icon-size, 18px)',
        fontWeight: 'bold',
        flexShrink: '0',
        marginRight: 'var(--islands-message-icon-margin, 10px)',
      });
    }));

    this.child(span(text => {
      text.text(this._content);
      text.styles({
        flex: 1,
        fontSize: 'var(--islands-message-font-size, 14px)',
        lineHeight: 'var(--islands-message-line-height, 1.5)',
        color: 'var(--islands-message-text-color, inherit)',
      });
    }));

    if (this._closable) {
      this.child(span(closeBtn => {
        closeBtn.text('×');
        closeBtn.styles({
          fontSize: 'var(--islands-message-close-size, 20px)',
          cursor: 'pointer',
          padding: 'var(--islands-message-close-padding, 0 4px)',
          opacity: 'var(--islands-message-close-opacity, 0.7)',
          transition: 'opacity 0.2s',
          flexShrink: '0',
          color: 'var(--islands-message-close-color, inherit)',
        });
        closeBtn.on('mouseenter', () => {
          closeBtn.style('opacity', 'var(--islands-message-close-hover-opacity, 1)');
        });
        closeBtn.on('mouseleave', () => {
          closeBtn.style('opacity', 'var(--islands-message-close-opacity, 0.7)');
        });
        closeBtn.on('click', (e) => {
          e.stopPropagation();
          this.close();
        });
      }));
    }
  }

  content(text) {
    this._content = text;
    return this;
  }

  closable(value) {
    this._closable = value;
    return this;
  }

  duration(ms) {
    this._duration = ms;
    return this;
  }

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

  startTimer() {
    if (this._duration > 0 && !this._timer) {
      this._timer = setTimeout(() => {
        this.close();
      }, this._duration);
    }
  }

  stopTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  renderDom() {
    const element = super.renderDom();
    if (element && this._duration > 0) {
      this.startTimer();
    }
    return element;
  }
}

function vMessage(content = '', type = 'info', setup = null) {
  return new VMessage(content, type, setup);
}

// ============================================
// VMessageContainer 消息容器
// ============================================

class VMessageContainer extends Tag {
  constructor(position = 'top-right', setup = null) {
    super('div', null);

    this._position = position;
    this._messages = [];
    this._maxVisible = 5;

    this.styles({
      position: 'fixed',
      zIndex: 'var(--islands-message-z-index, 9999)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--islands-message-gap, 10px)',
      padding: 'var(--islands-message-container-padding, 16px)',
      maxWidth: 'var(--islands-message-max-width, 420px)',
    });

    this._applyPosition();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _applyPosition() {
    const positions = {
      'top-left': { top: '0', left: '0' },
      'top-right': { top: '0', right: '0' },
      'top-center': { top: '0', left: '50%', transform: 'translateX(-50%)' },
      'bottom-left': { bottom: '0', left: '0' },
      'bottom-right': { bottom: '0', right: '0' },
      'bottom-center': { bottom: '0', left: '50%', transform: 'translateX(-50%)' }
    };

    const pos = positions[this._position] || positions['top-right'];
    this.styles(pos);
  }

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

  success(content, duration = 3000) {
    return this.add(content, 'success', duration);
  }

  error(content, duration = 3000) {
    return this.add(content, 'error', duration);
  }

  warning(content, duration = 3000) {
    return this.add(content, 'warning', duration);
  }

  info(content, duration = 3000) {
    return this.add(content, 'info', duration);
  }

  clear() {
    this._messages.forEach(msg => msg.close());
    this._messages = [];
    this._children = [];
  }

  maxVisible(count) {
    this._maxVisible = count;
    return this;
  }
}

function vMessageContainer(position = 'top-right', setup = null) {
  return new VMessageContainer(position, setup);
}

// ============================================
// VMessageManager 消息管理器（单例）
// ============================================

class VMessageManager {
  constructor() {
    if (VMessageManager._instance) {
      return VMessageManager._instance;
    }
    this._container = null;
    this._position = 'top-right';
    this._maxVisible = 5;
    VMessageManager._instance = this;
  }

  _getContainer() {
    if (!this._container) {
      this._container = vMessageContainer(this._position);
      this._container.maxVisible(this._maxVisible);
      document.body.appendChild(this._container.renderDom());
    }
    return this._container;
  }

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

  success = (content, duration = 3000) => this._getContainer().success(content, duration);
  error = (content, duration = 3000) => this._getContainer().error(content, duration);
  warning = (content, duration = 3000) => this._getContainer().warning(content, duration);
  info = (content, duration = 3000) => this._getContainer().info(content, duration);

  clear = () => {
    if (this._container) {
      this._container.clear();
    }
  };

  setPosition = (position) => {
    this._position = position;
    if (this._container) {
      this._container.destroy();
      this._container = null;
    }
  };

  setMaxVisible = (count) => {
    this._maxVisible = count;
    return this;
  };
}

const vMessageManager = new VMessageManager();

// 便捷函数 - 支持两种调用方式
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

Tag.prototype.vMessage = function(content, type = 'info', setup = null) {
  const el = vMessage(content, type, setup);
  this.child(el);
  return this;
};

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
