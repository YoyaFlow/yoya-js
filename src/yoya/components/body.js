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

    // 应用基础样式（使用主题变量）
    this.styles({
      // 背景色
      background: 'var(--yoya-body-bg, var(--yoya-bg, white))',
      backgroundColor: 'var(--yoya-body-bg-color, var(--yoya-body-bg, var(--yoya-bg, white)))',

      // 最小高度
      minHeight: 'var(--yoya-body-min-height, 100vh)',

      // 宽度
      width: 'var(--yoya-body-width, 100%)',

      // 布局
      display: 'var(--yoya-body-display, flex)',
      flexDirection: 'var(--yoya-body-flex-direction, column)',
      alignItems: 'var(--yoya-body-align-items, stretch)',

      // 内边距
      padding: 'var(--yoya-body-padding, 0)',
      margin: 'var(--yoya-body-margin, 0)',
      boxSizing: 'border-box',

      // 过渡效果
      transition: 'background-color 0.3s ease, min-height 0.3s ease',
    });

    // 应用组件基础样式
    this._applyThemeBaseStyles();

    // 执行 setup
    if (setup) {
      this.setup(setup);
    }
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
    if (enabled) {
      this.style('minHeight', 'var(--yoya-body-min-height, 100vh)');
    }
    return this;
  }

  /**
   * 设置内容对齐方式
   * @param {string} align - 对齐方式
   * @returns {VBody} this
   */
  align(align) {
    this.style('alignItems', align);
    return this;
  }

  /**
   * 设置内容居中对齐
   * @returns {VBody} this
   */
  center() {
    this.style('alignItems', 'center')
      .style('justifyContent', 'center');
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
        host.styles({
          minHeight: 'var(--yoya-body-min-height, 100vh)',
          width: 'var(--yoya-body-width, 100%)',
        });
      } else {
        host.style('minHeight', '');
        host.style('width', '');
      }
    });
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
