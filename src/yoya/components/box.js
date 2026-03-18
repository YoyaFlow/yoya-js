/**
 * Yoya.Basic - Box 通用容器组件
 * 提供圆角、背景色、透明度、阴影等样式的通用容器
 * @module Yoya.Box
 * @example
 * // 基础用法 - 完全透明，继承父元素样式
 * import { vBox } from '../yoya/index.js';
 *
 * vBox(b => {
 *   b.text('这是一个透明容器');
 * });
 *
 * // 带背景色和圆角
 * vBox(b => {
 *   b.background('var(--yoya-primary)');
 *   b.radius('md');
 *   b.text('带样式的容器');
 * });
 *
 * // 带阴影
 * vBox(b => {
 *   b.shadow();
 *   b.padding('lg');
 *   b.text('带阴影的容器');
 * });
 *
 * // 半透明背景
 * vBox(b => {
 *   b.background('var(--yoya-primary)');
 *   b.opacity(0.1);
 *   b.radius('lg');
 * });
 */

import { Tag, div } from '../core/basic.js';

// ============================================
// VBox 通用容器
// ============================================

/**
 * VBox 通用容器
 * 支持背景色、圆角、阴影、透明度等样式
 * @class
 * @extends Tag
 */
class VBox extends Tag {
  static _stateAttrs = ['shadowed', 'bordered'];

  /**
   * 创建 VBox 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      shadowed: false,
      bordered: false,
    });

    // 3. 设置基础 CSS 类
    this.addClass('yoya-box');

    // 4. 设置默认样式（宽高 100%，透明背景，继承字体颜色）
    this.styles({
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      color: 'inherit',
      boxSizing: 'border-box',
    });

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    // shadowed 状态
    this.registerStateHandler('shadowed', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-box--shadowed');
      } else {
        host.removeClass('yoya-box--shadowed');
      }
    });

    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-box--bordered');
      } else {
        host.removeClass('yoya-box--bordered');
      }
    });
  }

  /**
   * 设置背景颜色
   * @param {string} color - 颜色值（支持 CSS 变量、hex、rgb/rgba 等）
   * @returns {this}
   */
  background(color) {
    if (color === undefined) return this.style('background-color');
    this.style('background-color', color);
    return this;
  }

  /**
   * 设置背景透明度
   * @param {number} value - 透明度值 (0-1)
   * @returns {this}
   */
  opacity(value) {
    if (value === undefined) return this.style('opacity');
    this.style('opacity', value);
    return this;
  }

  /**
   * 设置圆角
   * @param {string|number} value - 圆角值（支持 'sm' | 'md' | 'lg' | 'xl' 或具体像素值）
   * @returns {this}
   */
  radius(value) {
    if (value === undefined) return this.style('border-radius');

    // 支持预设值
    const radiusMap = {
      'sm': 'var(--yoya-radius-sm, 4px)',
      'md': 'var(--yoya-radius-md, 6px)',
      'lg': 'var(--yoya-radius-lg, 8px)',
      'xl': 'var(--yoya-radius-xl, 12px)',
    };

    const radiusValue = radiusMap[value] || value;
    this.style('border-radius', radiusValue);
    return this;
  }

  /**
   * 设置阴影
   * @param {string|boolean} value - 阴影值（支持 true/false 或具体阴影值）
   * @returns {this}
   */
  shadow(value) {
    if (value === undefined) return this.setState('shadowed', true);

    if (typeof value === 'boolean') {
      return this.setState('shadowed', value);
    }

    // 支持预设值
    const shadowMap = {
      'sm': 'var(--yoya-shadow, 0 2px 8px rgba(0,0,0,0.08))',
      'md': 'var(--yoya-shadow, 0 4px 12px rgba(0,0,0,0.08))',
      'lg': 'var(--yoya-shadow-hover, 0 6px 16px rgba(0,0,0,0.15))',
      'xl': 'var(--yoya-shadow-elevated, 0 8px 24px rgba(0,0,0,0.12))',
    };

    const shadowValue = shadowMap[value] || value;
    this.style('box-shadow', shadowValue);
    this.setState('shadowed', true);
    return this;
  }

  /**
   * 设置边框
   * @param {string|boolean} value - 边框值（支持 true/false 或具体边框值）
   * @returns {this}
   */
  border(value) {
    if (value === undefined) return this.setState('bordered', true);

    if (typeof value === 'boolean') {
      return this.setState('bordered', value);
    }

    this.style('border', value);
    this.setState('bordered', true);
    return this;
  }

  /**
   * 设置内边距
   * @param {string} value - 内边距值（支持 'xs' | 'sm' | 'md' | 'lg' | 'xl' 或具体像素值）
   * @returns {this}
   */
  padding(value) {
    if (value === undefined) return this.style('padding');

    const paddingMap = {
      'xs': 'var(--yoya-padding-xs, 4px)',
      'sm': 'var(--yoya-padding-sm, 6px)',
      'md': 'var(--yoya-padding-md, 8px)',
      'lg': 'var(--yoya-padding-lg, 10px)',
      'xl': 'var(--yoya-padding-xl, 16px)',
    };

    const paddingValue = paddingMap[value] || value;
    this.style('padding', paddingValue);
    return this;
  }

  /**
   * 设置外边距
   * @param {string} value - 外边距值（支持 'xs' | 'sm' | 'md' | 'lg' | 'xl' 或具体像素值）
   * @returns {this}
   */
  margin(value) {
    if (value === undefined) return this.style('margin');

    const marginMap = {
      'xs': 'var(--yoya-margin-xs, 4px)',
      'sm': 'var(--yoya-margin-sm, 6px)',
      'md': 'var(--yoya-margin-md, 8px)',
      'lg': 'var(--yoya-margin-lg, 10px)',
      'xl': 'var(--yoya-margin-xl, 16px)',
    };

    const marginValue = marginMap[value] || value;
    this.style('margin', marginValue);
    return this;
  }

  /**
   * 设置宽度
   * @param {string} value - 宽度值
   * @returns {this}
   */
  width(value) {
    if (value === undefined) return this.style('width');
    this.style('width', value);
    return this;
  }

  /**
   * 设置高度
   * @param {string} value - 高度值
   * @returns {this}
   */
  height(value) {
    if (value === undefined) return this.style('height');
    this.style('height', value);
    return this;
  }

  /**
   * 设置字体颜色
   * @param {string} color - 颜色值
   * @returns {this}
   */
  color(color) {
    if (color === undefined) return this.style('color');
    this.style('color', color);
    return this;
  }

  /**
   * 启用阴影
   * @returns {this}
   */
  withShadow() {
    return this.setState('shadowed', true);
  }

  /**
   * 启用边框
   * @returns {this}
   */
  withBorder() {
    return this.setState('bordered', true);
  }
}

/**
 * 创建 VBox 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VBox}
 */
function vBox(setup = null) {
  return new VBox(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 vBox 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vBox = function(setup = null) {
  const el = vBox(setup);
  this.child(el);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  VBox,
  vBox,
};
