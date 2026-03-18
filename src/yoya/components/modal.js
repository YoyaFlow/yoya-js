/**
 * Yoya.Basic - Modal 弹出框组件
 * 提供完全透明的弹出框控制，内容由用户自定义
 * @module Yoya.Modal
 * @example
 * // 基础用法
 * import { vModal, vButton, toast } from '../yoya/index.js';
 *
 * const modal = vModal(m => {
 *   m.content(c => {
 *     c.h2('标题');
 *     c.p('这里是弹出框内容');
 *   });
 *   m.footer(f => {
 *     f.button('确定', b => b.onclick(() => {
 *       toast.success('已确认');
 *       modal.hide();
 *     }));
 *     f.button('取消', b => b.onclick(() => modal.hide()));
 *   });
 * });
 *
 * vButton('打开弹出框', b => b.onclick(() => modal.show()));
 */

import { Tag, div, button, p, h1, h2, h3 } from '../core/basic.js';
import { vForm, vInput, vTextarea } from './form.js';
import { vButton } from './button.js';

// ============================================
// VModal 弹出框
// ============================================

/**
 * VModal 弹出框组件
 * 提供完全透明的弹出框控制，内容由用户自定义
 * @class
 * @extends Tag
 */
class VModal extends Tag {
  static _stateAttrs = ['visible', 'closable', 'maskClosable', 'centered'];

  /**
   * 创建 VModal 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this._visible = false;
    this._closable = true;
    this._maskClosable = true;
    this._centered = false;
    this._width = '500px';
    this._title = null;
    this._contentBox = null;
    this._headerBox = null;
    this._footerBox = null;
    this._maskBox = null;
    this._closeBtn = null;
    this._afterCloseCallbacks = [];

    // 3. 设置基础样式
    this.addClass('yoya-modal');
    this.style('display', 'none');
    this.style('position', 'fixed');
    this.style('top', '0');
    this.style('left', '0');
    this.style('width', '100%');
    this.style('height', '100%');
    this.style('z-index', '1000');

    // 4. 构建遮罩和内容
    this._buildMask();
    this._buildContent();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 应用 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 构建遮罩层
   * @private
   */
  _buildMask() {
    this._maskBox = div(mask => {
      mask.addClass('yoya-modal__mask');
      mask.styles({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        transition: 'opacity 0.3s ease'
      });

      // 点击遮罩关闭
      mask.on('click', () => {
        if (this._maskClosable) {
          this.hide();
        }
      });
    });
    this._children.push(this._maskBox);
  }

  /**
   * 构建弹出框内容
   * @private
   */
  _buildContent() {
    // 内容容器
    this._contentBox = div(inner => {
      inner.addClass('yoya-modal__body');
    });

    // 创建模态框内容区域
    this._contentElement = div(content => {
      content.addClass('yoya-modal__content');
      content.styles({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'auto',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        opacity: '0',
        zIndex: '1001'
      });

      // 关闭按钮
      if (this._closable) {
        content.child(this._createCloseButton());
      }

      // 内容容器
      content.child(this._contentBox);
    });

    // 添加到 modal 的 children
    this.child(this._contentElement);
  }

  /**
   * 创建关闭按钮
   * @private
   */
  _createCloseButton() {
    this._closeBtn = button(close => {
      close.addClass('yoya-modal__close');
      close.styles({
        position: 'absolute',
        top: '12px',
        right: '12px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '18px',
        lineHeight: '1',
        transition: 'color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0'
      });

      close.text('×');

      close.on('mouseenter', () => {
        close.style('color', 'var(--yoya-modal-close-hover-color, #333)');
      });
      close.on('mouseleave', () => {
        close.style('color', 'var(--yoya-modal-close-color, #999)');
      });
      close.on('click', () => this.hide());
    });
    return this._closeBtn;
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    // visible 状态处理器
    this.registerStateHandler('visible', (visible, host) => {
      // 同步内部属性
      this._visible = visible;

      if (visible) {
        host.style('display', 'block');
        // 动画：显示
        requestAnimationFrame(() => {
          if (this._contentElement) {
            this._contentElement.style('opacity', '1');
          }
        });
      } else {
        // 动画：隐藏
        if (this._contentElement) {
          this._contentElement.style('opacity', '0');
        }
        setTimeout(() => {
          if (!this._visible) {
            host.style('display', 'none');
            // 执行关闭后回调
            this._executeAfterCloseCallbacks();
          }
        }, 300);
      }
    });

    // closable 状态处理器
    this.registerStateHandler('closable', (closable, host) => {
      if (this._closeBtn) {
        this._closeBtn.style('display', closable ? 'flex' : 'none');
      }
    });

    // centered 状态处理器
    this.registerStateHandler('centered', (centered, host) => {
      if (this._contentElement) {
        if (centered) {
          this._contentElement.addClass('yoya-modal__content--centered');
        } else {
          this._contentElement.removeClass('yoya-modal__content--centered');
        }
      }
    });
  }

  /**
   * 设置弹出框宽度
   * @param {string} width - 宽度值
   * @returns {this}
   */
  width(width) {
    this._width = width;
    if (this._contentElement) {
      this._contentElement.style('width', width);
    }
    return this;
  }

  /**
   * 设置弹出框标题
   * @param {string|Function} title - 标题内容或 setup 函数
   * @returns {this}
   */
  title(title) {
    if (!this._headerBox) {
      this._headerBox = div(header => {
        header.addClass('yoya-modal__header');
        header.style('padding', '16px 20px');
        header.style('borderBottom', '1px solid #f0f0f0');
        header.style('fontWeight', '600');
        header.style('fontSize', '16px');
        header.style('lineHeight', '1.5');

        if (typeof title === 'function') {
          title(header);
        } else {
          header.text(title);
        }
      });
      // 将头部插入到内容区域的最前面
      if (this._contentBox) {
        if (this._contentBox._children) {
          this._contentBox._children.unshift(this._headerBox);
        } else {
          this._contentBox.child(this._headerBox);
        }
      }
    } else {
      if (typeof title === 'function') {
        this._headerBox.setup(title);
      } else {
        this._headerBox.text(title);
      }
    }
    return this;
  }

  /**
   * 设置弹出框内容
   * @param {Function|string} content - 内容 setup 函数或文本
   * @returns {this}
   */
  content(content) {
    if (!this._contentBox) {
      this._contentBox = div(inner => {
        inner.addClass('yoya-modal__body');
        inner.style('padding', '20px');
      });
      this._children.push(this._contentBox);

      // 如果已经有 header（比如 VConfirm 先调用了 title()），将其添加到 contentBox
      if (this._headerBox) {
        this._contentBox._children.unshift(this._headerBox);
      }
    }

    if (typeof content === 'function') {
      // 提供常用工厂方法
      const api = {
        p: (text) => {
          const el = p(text);
          this._contentBox.child(el);
          return el;
        },
        div: (setup) => {
          const el = div(setup);
          this._contentBox.child(el);
          return el;
        },
        h1: (text) => {
          const el = h1(text);
          this._contentBox.child(el);
          return el;
        },
        h2: (text) => {
          const el = h2(text);
          this._contentBox.child(el);
          return el;
        },
        h3: (text) => {
          const el = h3(text);
          this._contentBox.child(el);
          return el;
        },
        button: (setup) => {
          const el = button(setup);
          this._contentBox.child(el);
          return el;
        },
        // 导出组件工厂函数，允许用户嵌套使用
        vForm: (setup) => {
          const el = vForm(setup);
          this._contentBox.child(el);
          return el;
        },
        vInput: (setup) => {
          const el = vInput(setup);
          this._contentBox.child(el);
          return el;
        },
        vTextarea: (setup) => {
          const el = vTextarea(setup);
          this._contentBox.child(el);
          return el;
        },
      };
      content(api);
    } else if (typeof content === 'string') {
      this._contentBox.text(content);
    }
    return this;
  }

  /**
   * 设置弹出框底部
   * @param {Function} setup - 底部内容 setup 函数
   * @returns {this}
   */
  footer(setup) {
    if (!this._footerBox) {
      this._footerBox = div(footer => {
        footer.addClass('yoya-modal__footer');
        footer.style('padding', '12px 20px');
        footer.style('borderTop', '1px solid #f0f0f0');
        footer.style('display', 'flex');
        footer.style('justifyContent', 'flex-end');
        footer.style('gap', '8px');
      });
      // 将底部添加到内容区域的最后面
      if (this._contentBox && this._contentBox._children) {
        this._contentBox._children.push(this._footerBox);
      }
    }

    if (typeof setup === 'function') {
      // 提供 button、vButton 和 child 工厂方法
      const api = {
        button: (btnSetup) => {
          const btn = button(btnSetup);
          this._footerBox.child(btn);
          return btn;
        },
        vButton: (text) => {
          const btn = vButton(text);
          this._footerBox.child(btn);
          return btn;
        },
        child: (el) => {
          this._footerBox.child(el);
          return el;
        }
      };
      setup(api);
    }
    return this;
  }

  /**
   * 设置是否可关闭
   * @param {boolean} closable - 是否可关闭
   * @returns {this}
   */
  closable(closable) {
    this.setState('closable', closable);
    return this;
  }

  /**
   * 设置是否可点击遮罩关闭
   * @param {boolean} maskClosable - 是否可点击遮罩关闭
   * @returns {this}
   */
  maskClosable(maskClosable) {
    this._maskClosable = maskClosable;
    return this;
  }

  /**
   * 设置是否居中模式
   * @param {boolean} centered - 是否居中
   * @returns {this}
   */
  centered(centered) {
    this.setState('centered', centered);
    return this;
  }

  /**
   * 显示弹出框
   * @returns {this}
   */
  show() {
    // 如果没有绑定到 DOM，先绑定到 document.body
    // 检查 _boundElement 是否存在且是否在 DOM 中
    if (typeof document !== 'undefined') {
      const isInDom = this._boundElement && document.body.contains(this._boundElement);
      if (!isInDom) {
        this.bindTo(document.body);
      }
    }
    this.setState('visible', true);
    return this;
  }

  /**
   * 隐藏弹出框
   * @returns {this}
   */
  hide() {
    this.setState('visible', false);
    return this;
  }

  /**
   * 切换弹出框显示状态
   * @returns {this}
   */
  toggle() {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
    return this;
  }

  /**
   * 注册关闭后回调
   * @param {Function} callback - 回调函数
   * @returns {this}
   */
  afterClose(callback) {
    this._afterCloseCallbacks.push(callback);
    return this;
  }

  /**
   * 执行关闭后回调
   * @private
   */
  _executeAfterCloseCallbacks() {
    const callbacks = [...this._afterCloseCallbacks];
    this._afterCloseCallbacks = [];
    callbacks.forEach(cb => cb(this));
  }

  /**
   * 获取弹出框内容区域
   * @returns {Tag} 内容区域引用
   */
  getBody() {
    return this._contentBox;
  }

  /**
   * 获取弹出框头部区域
   * @returns {Tag} 头部区域引用
   */
  getHeader() {
    return this._headerBox;
  }

  /**
   * 获取弹出框底部区域
   * @returns {Tag} 底部区域引用
   */
  getFooter() {
    return this._footerBox;
  }
}

/**
 * 创建 VModal 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VModal}
 */
function vModal(setup = null) {
  return new VModal(setup);
}

// ============================================
// VConfirm 确认框（简化版弹出框）
// ============================================

/**
 * VConfirm 确认框组件
 * 用于快速创建确认对话框
 * @class
 * @extends VModal
 */
class VConfirm extends VModal {
  /**
   * 创建 VConfirm 实例
   * @param {string} [title='确认'] - 标题
   * @param {string} [content=''] - 内容
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(title = '确认', content = '', setup = null) {
    super(null);

    this._onConfirm = null;
    this._onCancel = null;
    this._confirmText = '确定';
    this._cancelText = '取消';
    this._confirmType = 'primary';

    this.title(title);
    this.content(content);
    this._buildFooter();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 构建底部按钮
   * @private
   */
  _buildFooter() {
    this.footer(f => {
      // 取消按钮
      f.button(cancelBtn => {
        cancelBtn.text(this._cancelText);
        cancelBtn.addClass('yoya-btn yoya-btn--secondary');
        cancelBtn.style('padding', '6px 16px');
        cancelBtn.style('fontSize', '14px');

        cancelBtn.on('click', () => {
          if (this._onCancel) this._onCancel();
          this.hide();
        });
      });

      // 确定按钮
      f.button(confirmBtn => {
        confirmBtn.text(this._confirmText);
        confirmBtn.addClass('yoya-btn yoya-btn--primary');
        confirmBtn.style('padding', '6px 16px');
        confirmBtn.style('fontSize', '14px');

        confirmBtn.on('click', () => {
          if (this._onConfirm) this._onConfirm();
          this.hide();
        });
      });
    });
  }

  /**
   * 设置确认按钮文本
   * @param {string} text - 按钮文本
   * @returns {this}
   */
  confirmText(text) {
    this._confirmText = text;
    return this;
  }

  /**
   * 设置取消按钮文本
   * @param {string} text - 按钮文本
   * @returns {this}
   */
  cancelText(text) {
    this._cancelText = text;
    return this;
  }

  /**
   * 设置确认回调
   * @param {Function} fn - 回调函数
   * @returns {this}
   */
  onConfirm(fn) {
    this._onConfirm = fn;
    return this;
  }

  /**
   * 设置取消回调
   * @param {Function} fn - 回调函数
   * @returns {this}
   */
  onCancel(fn) {
    this._onCancel = fn;
    return this;
  }
}

/**
 * 创建 VConfirm 实例
 * @param {string} [title='确认'] - 标题
 * @param {string} [content=''] - 内容
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VConfirm}
 */
function vConfirm(title = '确认', content = '', setup = null) {
  return new VConfirm(title, content, setup);
}

// ============================================
// 便捷方法
// ============================================

/**
 * 快速创建确认框
 * @param {string} content - 确认内容
 * @param {Function} onConfirm - 确认回调
 * @param {Function} [onCancel] - 取消回调
 * @returns {VConfirm}
 */
function confirm(content, onConfirm, onCancel) {
  const modal = vConfirm('确认', content);
  if (onConfirm) modal.onConfirm(onConfirm);
  if (onCancel) modal.onCancel(onCancel);
  modal.show();
  return modal;
}

// ============================================
// CSS 样式
// ============================================

// 注入全局样式
if (typeof document !== 'undefined') {
  const styleId = 'yoya-modal-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
      .yoya-modal {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      .yoya-modal__mask {
        background-color: var(--yoya-modal-mask-bg, rgba(0, 0, 0, 0.45));
        backdrop-filter: var(--yoya-modal-mask-backdrop-filter, blur(4px));
        animation: yoya-modal-fade-in var(--yoya-modal-animation-duration, 0.3s) var(--yoya-modal-animation-timing, ease);
      }

      .yoya-modal__content {
        background-color: var(--yoya-modal-bg, white);
        border-radius: var(--yoya-modal-radius, 8px);
        box-shadow: var(--yoya-modal-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
        min-width: var(--yoya-modal-min-width, 300px);
        max-width: var(--yoya-modal-max-width, 90%);
        max-height: var(--yoya-modal-max-height, 90vh);
        animation: yoya-modal-zoom-in var(--yoya-modal-animation-duration, 0.3s) var(--yoya-modal-animation-timing, ease);
      }

      .yoya-modal__content--centered {
        text-align: center;
      }

      .yoya-modal__header {
        padding: var(--yoya-modal-header-padding, 16px 20px);
        border-bottom: var(--yoya-modal-header-border, 1px solid #e0e0e0);
        font-weight: var(--yoya-modal-header-font-weight, 600);
        font-size: var(--yoya-modal-header-font-size, 16px);
        line-height: var(--yoya-modal-header-line-height, 1.5);
        color: var(--yoya-modal-header-color, #333);
      }

      .yoya-modal__body {
        padding: var(--yoya-modal-body-padding, 20px);
        color: var(--yoya-modal-body-color, #333);
        font-size: var(--yoya-modal-body-font-size, 14px);
        line-height: var(--yoya-modal-body-line-height, 1.5);
      }

      .yoya-modal__footer {
        padding: var(--yoya-modal-footer-padding, 12px 20px);
        border-top: var(--yoya-modal-footer-border, 1px solid #e0e0e0);
        display: flex;
        justify-content: var(--yoya-modal-footer-justify, flex-end);
        gap: var(--yoya-modal-footer-gap, 8px);
      }

      .yoya-modal__close {
        font-family: inherit;
        width: var(--yoya-modal-close-size, 24px);
        height: var(--yoya-modal-close-size, 24px);
        color: var(--yoya-modal-close-color, #999);
        border-radius: var(--yoya-modal-close-radius, 4px);
      }

      .yoya-modal__close:hover {
        background-color: var(--yoya-modal-close-hover-bg, rgba(0, 0, 0, 0.05));
        color: var(--yoya-modal-close-hover-color, #333);
      }

      @keyframes yoya-modal-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes yoya-modal-zoom-in {
        from {
          transform: translate(-50%, -50%) scale(0.95);
          opacity: 0;
        }
        to {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }

      .yoya-modal.hiding .yoya-modal__content {
        animation: yoya-modal-zoom-out var(--yoya-modal-animation-duration, 0.3s) var(--yoya-modal-animation-timing, ease) forwards;
      }

      .yoya-modal.hiding .yoya-modal__mask {
        animation: yoya-modal-fade-out var(--yoya-modal-animation-duration, 0.3s) var(--yoya-modal-animation-timing, ease) forwards;
      }

      @keyframes yoya-modal-zoom-out {
        from {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        to {
          transform: translate(-50%, -50%) scale(0.95);
          opacity: 0;
        }
      }

      @keyframes yoya-modal-fade-out {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }
}

// ============================================
// 导出
// ============================================

export {
  VModal,
  vModal,
  VConfirm,
  vConfirm,
  confirm,
};
