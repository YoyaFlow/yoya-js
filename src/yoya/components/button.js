/**
 * Yoya.Components - Button
 * 带主题样式的按钮组件
 */

import { Tag, span } from '../core/basic.js';

// ============================================
// VButton 按钮组件
// ============================================

class VButton extends Tag {
  // 状态属性
  static _stateAttrs = ['disabled', 'loading', 'block', 'ghost', 'hovered'];

  constructor(content = '', setup = null) {
    // 如果 content 是函数，则它是 setup
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }
    // 如果 content 是对象且 setup 未定义，说明是 vButton({ onClick: ... }) 单参数用法
    else if (typeof content === 'object' && content !== null && setup === undefined) {
      setup = content;
      content = '';
    }
    // 正确用法：vButton("文本", { setupObject }) - content 是字符串，setup 是对象，无需处理

    super('button', null);
    // this._el 已在 super() 中创建

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      loading: false,
      block: false,
      ghost: false,
      hovered: false,
      type: 'default'
    });

    // 3. 设置基础样式（直接设置到 this._el）
    this._setupBaseStyles();

    // 4. 保存基础样式快照（用于状态变更时恢复）
    this.saveBaseStylesSnapshot();

    // 4.5. 应用默认类型样式
    this._applyTypeStyles();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 更新内容（setup 可能已经设置了内容，所以只在没有内容时才使用 content 参数）
    if (content && !this._content) {
      this._content = content;
      this._updateContent();
    }
  }

  // 设置基础样式
  _setupBaseStyles() {
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--islands-gap-sm, 6px)',
      padding: 'var(--islands-button-padding, 8px 16px)',
      fontSize: 'var(--islands-button-font-size, 14px)',
      fontWeight: '400',
      borderRadius: 'var(--islands-button-radius, 6px)',
      border: '1px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
      minWidth: 'var(--islands-button-min-width, 64px)',
      height: 'var(--islands-button-height, 32px)',
      transform: 'scale(1)',
      transformOrigin: 'center center',
    });

    // 使用状态机管理 hover
    this.on('mouseenter', () => {
      this.setState('hovered', true);
    });

    this.on('mouseleave', () => {
      this.setState('hovered', false);
    });

    // 点击按压效果
    this.on('mousedown', (e) => {
      e.preventDefault();
      if (!this.hasState('disabled') && !this.hasState('loading')) {
        this.style('transform', 'scale(0.98)');
      }
    });

    this.on('mouseup', () => {
      if (!this.hasState('disabled') && !this.hasState('loading')) {
        this.style('transform', 'scale(1)');
      }
    });

    this.on('mouseout', () => {
      if (!this.hasState('disabled') && !this.hasState('loading')) {
        this.style('transform', 'scale(1)');
      }
    });
  }

  // 获取 hover 样式
  _getHoverStyles() {
    const type = this._type || 'default';
    const isGhost = this.hasState('ghost');
    const hoverStyles = {
      primary: {
        background: isGhost ? 'rgba(102, 126, 234, 0.1)' : 'var(--islands-primary-hover, #5a6fd6)',
      },
      success: {
        background: isGhost ? 'rgba(40, 167, 69, 0.1)' : 'var(--islands-success-hover, #218838)',
      },
      warning: {
        background: isGhost ? 'rgba(255, 193, 7, 0.1)' : 'var(--islands-warning-hover, #e0a800)',
      },
      danger: {
        background: isGhost ? 'rgba(220, 53, 69, 0.1)' : 'var(--islands-error-hover, #c82333)',
      },
      default: {
        background: isGhost ? 'rgba(0, 0, 0, 0.05)' : 'var(--islands-bg-secondary, #f8f9fa)',
      },
    };
    return hoverStyles[type] || hoverStyles.default;
  }

  // 注册状态处理器
  _registerStateHandlers() {
    // disabled 状态
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        });
      } else {
        host.styles({
          opacity: '1',
          cursor: 'pointer',
          pointerEvents: 'auto',
        });
      }
    });

    // loading 状态
    this.registerStateHandler('loading', (loading, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (loading) {
        host.styles({
          cursor: 'wait',
          pointerEvents: 'none',
        });
      } else {
        host.styles({
          cursor: 'pointer',
          pointerEvents: 'auto',
        });
      }
      host._updateContent();
    });

    // block 状态（占满容器）
    this.registerStateHandler('block', (isBlock, host) => {
      host.style('display', isBlock ? 'flex' : 'inline-flex');
      host.style('width', isBlock ? '100%' : '');
    });

    // ghost 状态
    this.registerStateHandler('ghost', (isGhost, host) => {
      host._applyTypeStyles();
    });

    // hovered 状态 - 使用状态机管理 hover
    this.registerStateHandler('hovered', (isHovered, host) => {
      if (isHovered && !host.hasState('disabled') && !host.hasState('loading')) {
        host.styles(host._getHoverStyles());
      } else {
        host._applyTypeStyles();
      }
    });
  }

  // 应用类型样式
  _applyTypeStyles() {
    const type = this._type || 'default';
    const isGhost = this.hasState('ghost');

    const typeStyles = {
      primary: {
        background: isGhost ? 'transparent' : 'var(--islands-primary, #667eea)',
        color: isGhost ? 'var(--islands-primary, #667eea)' : 'white',
        border: '1px solid var(--islands-primary, #667eea)',
      },
      success: {
        background: isGhost ? 'transparent' : 'var(--islands-success, #28a745)',
        color: isGhost ? 'var(--islands-success, #28a745)' : 'white',
        border: '1px solid var(--islands-success, #28a745)',
      },
      warning: {
        background: isGhost ? 'transparent' : 'var(--islands-warning, #ffc107)',
        color: isGhost ? 'var(--islands-warning, #ffc107)' : 'white',
        border: '1px solid var(--islands-warning, #ffc107)',
      },
      danger: {
        background: isGhost ? 'transparent' : 'var(--islands-error, #dc3545)',
        color: isGhost ? 'var(--islands-error, #dc3545)' : 'white',
        border: '1px solid var(--islands-error, #dc3545)',
      },
      default: {
        background: isGhost ? 'transparent' : 'var(--islands-bg, white)',
        color: isGhost ? 'var(--islands-text, #333)' : 'var(--islands-text, #333)',
        border: '1px solid var(--islands-border, #e0e0e0)',
      },
    };

    const styles = typeStyles[type] || typeStyles.default;
    this.styles(styles);

    // 存储当前类型样式，用于 hover 时恢复
    this._currentTypeStyles = styles;
  }

  // 更新内容（支持 loading 状态）- 复用元素，不重新创建
  _updateContent() {
    // 复用或创建 loading 图标
    if (this.hasState('loading')) {
      if (!this._loadingSpinner) {
        this._loadingSpinner = span(s => {
          s.styles({
            display: 'inline-block',
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderBottomColor: 'transparent',
            borderRadius: '50%',
            animation: 'buttonLoadingSpin 0.8s linear infinite',
          });
        });
        // 在内容元素之前插入
        const contentIndex = this._children.indexOf(this._contentEl);
        if (contentIndex >= 0) {
          this._children.splice(contentIndex, 0, this._loadingSpinner);
        } else {
          this.child(this._loadingSpinner);
        }
      }
      this._loadingSpinner.style('display', 'inline-block');
    } else {
      if (this._loadingSpinner) {
        this._loadingSpinner.style('display', 'none');
      }
    }

    // 复用或创建内容元素
    if (!this._contentEl) {
      this._contentEl = span(c => {
        c.styles({ display: 'inline-block' });
      });
      this.child(this._contentEl);
    }

    if (this._content) {
      this._contentEl.html(this._content);
    }
  }

  _ensureContentEl() {
    if (!this._contentEl) {
      this._contentEl = span(c => {
        c.styles({ display: "inline-block" });
      });
      this.child(this._contentEl);
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  text(content) {
    this._content = content;
    this._ensureContentEl();
    if (this._contentEl) {
      this._contentEl.html(this._content);
    }
    return this;
  }

  type(value) {
    if (value === undefined) return this._type;
    this._type = value;
    this._applyTypeStyles();
    return this;
  }

  size(value) {
    if (value === undefined) return this._size;

    const sizeStyles = {
      large: {
        padding: 'var(--islands-button-padding-lg, 10px 20px)',
        fontSize: 'var(--islands-button-font-size-lg, 16px)',
        height: 'var(--islands-button-height-lg, 40px)',
      },
      default: {
        padding: 'var(--islands-button-padding, 8px 16px)',
        fontSize: 'var(--islands-button-font-size, 14px)',
        height: 'var(--islands-button-height, 32px)',
      },
      small: {
        padding: 'var(--islands-button-padding-sm, 4px 10px)',
        fontSize: 'var(--islands-button-font-size-sm, 12px)',
        height: 'var(--islands-button-height-sm, 24px)',
      },
    };

    this._size = value;
    const styles = sizeStyles[value] || sizeStyles.default;
    this.styles(styles);
    return this;
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  loading(value = true) {
    return this.setState('loading', value);
  }

  block(value = true) {
    return this.setState('block', value);
  }

  ghost(value = true) {
    return this.setState('ghost', value);
  }

  // 事件方法 - 基于 Tag._wrapHandler 包装器
  // onClick 直接使用 Tag 基类的 onClick() 方法
}

function vButton(content = '', setup = null) {
  return new VButton(content, setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vButton = function(content = '', setup = null) {
  const btn = vButton(content, setup);
  this.child(btn);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  VButton,
  vButton,
};