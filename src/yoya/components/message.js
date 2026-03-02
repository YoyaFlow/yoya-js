/**
 * Yoya.Basic - Message 消息提示组件
 * 用于显示全局消息提示（成功、错误、警告、信息）
 */

import { Tag, div, span } from '../core/basic.js';

// ============================================
// Message 消息提示
// ============================================

class Message extends Tag {
  constructor(content = '', type = 'info', setup = null) {
    super('div', null);

    this._content = content;
    this._type = type;
    this._closable = true;
    this._duration = 3000;
    this._timer = null;
    this._closed = false;

    // 应用基础样式
    this.styles({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '280px',
      maxWidth: '400px',
      animation: 'slideIn 0.3s ease',
      position: 'relative'
    });

    // 根据类型设置样式
    this._applyTypeStyles();

    // 构建内容
    this._buildContent();

    // 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 应用类型样式
  _applyTypeStyles() {
    const typeStyles = {
      success: {
        background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
        color: '#155724',
        border: '1px solid #c3e6cb'
      },
      error: {
        background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
        color: '#721c24',
        border: '1px solid #f5c6cb'
      },
      warning: {
        background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
        color: '#856404',
        border: '1px solid #ffeaa7'
      },
      info: {
        background: 'linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)',
        color: '#0c5460',
        border: '1px solid #bee5eb'
      }
    };

    const styles = typeStyles[this._type] || typeStyles.info;
    this.styles(styles);
  }

  // 获取类型图标
  _getTypeIcon() {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[this._type] || icons.info;
  }

  // 构建内容
  _buildContent() {
    // 图标
    this.child(span(icon => {
      icon.text(this._getTypeIcon());
      icon.styles({
        fontSize: '18px',
        fontWeight: 'bold',
        flexShrink: '0'
      });
    }));

    // 文本内容
    this.child(span(text => {
      text.text(this._content);
      text.styles({
        flex: 1,
        fontSize: '14px',
        lineHeight: '1.5'
      });
    }));

    // 关闭按钮
    if (this._closable) {
      this.child(span(closeBtn => {
        closeBtn.text('×');
        closeBtn.styles({
          fontSize: '20px',
          cursor: 'pointer',
          padding: '0 4px',
          opacity: '0.7',
          transition: 'opacity 0.2s',
          flexShrink: '0'
        });
        closeBtn.on('mouseenter', () => {
          closeBtn.style('opacity', '1');
        });
        closeBtn.on('mouseleave', () => {
          closeBtn.style('opacity', '0.7');
        });
        closeBtn.on('click', (e) => {
          e.stopPropagation();
          this.close();
        });
      }));
    }
  }

  // 设置消息内容
  content(text) {
    this._content = text;
    return this;
  }

  // 设置是否可关闭
  closable(value) {
    this._closable = value;
    return this;
  }

  // 设置自动关闭时间（毫秒），0 表示不自动关闭
  duration(ms) {
    this._duration = ms;
    return this;
  }

  // 关闭消息
  close() {
    if (this._closed) return;

    this._closed = true;

    // 添加淡出动画
    if (this._boundElement) {
      this._boundElement.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => {
        this.destroy();
      }, 300);
    } else {
      this.destroy();
    }

    // 清除定时器
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  // 启动自动关闭定时器
  startTimer() {
    if (this._duration > 0 && !this._timer) {
      this._timer = setTimeout(() => {
        this.close();
      }, this._duration);
    }
  }

  // 停止自动关闭定时器
  stopTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  // 渲染后启动定时器
  renderDom() {
    const element = super.renderDom();
    if (element && this._duration > 0) {
      this.startTimer();
    }
    return element;
  }
}

function message(content = '', type = 'info', setup = null) {
  return new Message(content, type, setup);
}

// ============================================
// MessageContainer 消息容器
// ============================================

class MessageContainer extends Tag {
  constructor(position = 'top-right', setup = null) {
    super('div', null);

    this._position = position;
    this._messages = [];
    this._maxVisible = 5;

    // 应用基础样式
    this.styles({
      position: 'fixed',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '16px',
      maxWidth: '420px'
    });

    // 设置位置
    this._applyPosition();

    // 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 应用位置样式
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

  // 添加消息
  add(content, type = 'info', duration = 3000) {
    const msg = message(content, type);
    msg.closable(true);
    msg.duration(duration);

    this._messages.push(msg);
    this.child(msg);

    // 如果容器已经渲染，将消息添加到 DOM
    if (this._boundElement) {
      const msgEl = msg.renderDom();
      if (msgEl) {
        this._boundElement.appendChild(msgEl);
      }
    }

    // 限制最大显示数量
    if (this._messages.length > this._maxVisible) {
      const oldMsg = this._messages.shift();
      if (oldMsg && !oldMsg._closed) {
        oldMsg.close();
      }
    }

    return msg;
  }

  // 成功消息
  success(content, duration = 3000) {
    return this.add(content, 'success', duration);
  }

  // 错误消息
  error(content, duration = 3000) {
    return this.add(content, 'error', duration);
  }

  // 警告消息
  warning(content, duration = 3000) {
    return this.add(content, 'warning', duration);
  }

  // 信息消息
  info(content, duration = 3000) {
    return this.add(content, 'info', duration);
  }

  // 清空所有消息
  clear() {
    this._messages.forEach(msg => msg.close());
    this._messages = [];
    // 清空子元素引用（不删除 DOM，由 close() 方法处理）
    this._children = [];
  }

  // 设置最大显示数量
  maxVisible(count) {
    this._maxVisible = count;
    return this;
  }
}

function messageContainer(position = 'top-right', setup = null) {
  return new MessageContainer(position, setup);
}

// ============================================
// MessageManager 消息管理器（单例）
// ============================================

class MessageManager {
  constructor() {
    if (MessageManager._instance) {
      return MessageManager._instance;
    }
    this._container = null;
    MessageManager._instance = this;
  }

  // 获取或创建容器
  _getContainer() {
    if (!this._container) {
      this._container = messageContainer('top-right');
      document.body.appendChild(this._container.renderDom());
    }
    return this._container;
  }

  // 添加消息
  add(content, type = 'info', duration = 3000) {
    return this._getContainer().add(content, type, duration);
  }

  // 成功消息
  success(content, duration = 3000) {
    return this._getContainer().success(content, duration);
  }

  // 错误消息
  error(content, duration = 3000) {
    return this._getContainer().error(content, duration);
  }

  // 警告消息
  warning(content, duration = 3000) {
    return this._getContainer().warning(content, duration);
  }

  // 信息消息
  info(content, duration = 3000) {
    return this._getContainer().info(content, duration);
  }

  // 清空所有消息
  clear() {
    if (this._container) {
      this._container.clear();
    }
  }

  // 设置容器位置
  setPosition(position) {
    if (this._container) {
      this._container.destroy();
      this._container = null;
    }
    this._container = messageContainer(position);
    document.body.appendChild(this._container.renderDom());
    return this;
  }

  // 设置最大显示数量
  maxVisible(count) {
    this._getContainer().maxVisible(count);
    return this;
  }
}

// 创建全局单例
const messageManager = new MessageManager();

// 便捷方法
function toast(content, type = 'info', duration = 3000) {
  return messageManager.add(content, type, duration);
}

toast.success = (content, duration) => messageManager.success(content, duration);
toast.error = (content, duration) => messageManager.error(content, duration);
toast.warning = (content, duration) => messageManager.warning(content, duration);
toast.info = (content, duration) => messageManager.info(content, duration);
toast.clear = () => messageManager.clear();

// ============================================
// Tag 原型扩展方法
// ============================================

Tag.prototype.message = function(content, type = 'info', setup = null) {
  const el = message(content, type, setup);
  this.child(el);
  return this;
};

Tag.prototype.messageContainer = function(position = 'top-right', setup = null) {
  const el = messageContainer(position, setup);
  this.child(el);
  return this;
};

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
  // 类
  Message,
  MessageContainer,
  MessageManager,

  // 工厂函数
  message,
  messageContainer,

  // 全局管理器
  messageManager,
  toast
};
