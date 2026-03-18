/**
 * Yoya.Basic - Body 组件
 * 页面整体背景容器
 */

import { Tag } from '../core/basic.js';

/**
 * VBody 类 - 页面背景容器
 *
 * @example
 * vBody(b => {
 *   b.child(
 *     div(d => {
 *       d.text('页面内容');
 *     })
 *   );
 * });
 */
export class VBody extends Tag {
  static _stateAttrs = ['fullscreen'];

  constructor(setup = null) {
    super('div', null);

    // 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 初始化状态
    this.initializeStates({ fullscreen: true });

    // 应用基础 CSS 类
    this.addClass('yoya-body');
    this.addClass('yoya-body--fullscreen');

    // 注册状态处理器
    this._registerStateHandlers();

    // 监听主题变化
    this._setupThemeListener();

    // 执行 setup
    if (setup) {
      this.setup(setup);
    }
  }

  /**
   * 监听主题变化事件
   */
  _setupThemeListener() {
    if (typeof window === 'undefined') return;

    this._themeChangeListener = (e) => {
      // 主题变化时重新应用样式
      this._applyThemeBaseStyles();
    };

    window.addEventListener('theme-changed', this._themeChangeListener);
  }

  /**
   * 应用主题基础样式
   */
  _applyThemeBaseStyles() {
    // 从主题管理器获取 VBody 组件样式
    const theme = this._getTheme();
    if (theme?.componentThemes?.VBody?.baseStyles) {
      this.styles(theme.componentThemes.VBody.baseStyles);
    }
  }

  /**
   * 获取当前主题
   */
  _getTheme() {
    if (typeof window !== 'undefined' && window._yoyaTheme) {
      return window._yoyaTheme;
    }
    return null;
  }

  /**
   * 设置背景色
   * @param {string} color - 颜色值
   * @returns {VBody} this
   */
  background(color) {
    this.style('background', color);
    return this;
  }

  /**
   * 设置最小高度
   * @param {string} height - 高度值
   * @returns {VBody} this
   */
  minHeight(height) {
    this.style('minHeight', height);
    return this;
  }

  /**
   * 设置全屏模式
   * @param {boolean} enabled - 是否启用全屏
   * @returns {VBody} this
   */
  fullscreen(enabled) {
    this.setState('fullscreen', enabled);
    return this;
  }

  /**
   * 设置内容对齐方式
   * @param {string} align - 对齐方式
   * @returns {VBody} this
   */
  align(align) {
    this.removeClass('yoya-body--align-top', 'yoya-body--align-bottom', 'yoya-body--align-stretch', 'yoya-body--center');
    if (align === 'top') {
      this.addClass('yoya-body--align-top');
    } else if (align === 'bottom') {
      this.addClass('yoya-body--align-bottom');
    } else if (align === 'center') {
      this.addClass('yoya-body--center');
    } else {
      this.addClass('yoya-body--align-stretch');
    }
    return this;
  }

  /**
   * 设置内容居中对齐
   * @returns {VBody} this
   */
  center() {
    this.addClass('yoya-body--center');
    return this;
  }

  /**
   * 设置内边距
   * @param {string} padding - 内边距值
   * @returns {VBody} this
   */
  padding(padding) {
    this.style('padding', padding);
    return this;
  }

  /**
   * 添加子元素
   * @param {Tag|HTMLElement|string} child - 子元素
   * @returns {VBody} this
   */
  content(child) {
    if (typeof child === 'string') {
      this.text(child);
    } else if (child instanceof Tag) {
      this.child(child);
    } else if (child instanceof HTMLElement) {
      this.child(child);
    }
    return this;
  }

  /**
   * 注册状态处理器
   */
  _registerStateHandlers() {
    // fullscreen 状态处理器
    this.registerStateHandler('fullscreen', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-body--fullscreen');
      } else {
        host.removeClass('yoya-body--fullscreen');
      }
    });
  }

  /**
   * 销毁组件，清理事件监听
   */
  destroy() {
    // 移除主题变化监听器
    if (this._themeChangeListener && typeof window !== 'undefined') {
      window.removeEventListener('theme-changed', this._themeChangeListener);
    }
    super.destroy();
  }
}

/**
 * vBody 工厂函数
 * @param {Function|Object|string} setup - 配置函数、对象或文本内容
 * @returns {VBody} VBody 实例
 */
export function vBody(setup = null) {
  return new VBody(setup);
}

/**
 * 创建 Body 容器并绑定到指定目标
 * @param {string|HTMLElement} target - 绑定目标
 * @param {Function} setup - 配置函数
 * @returns {VBody} VBody 实例
 */
export function createBody(target, setup = null) {
  const body = new VBody(setup);
  if (target) {
    body.bindTo(target);
  }
  return body;
}
