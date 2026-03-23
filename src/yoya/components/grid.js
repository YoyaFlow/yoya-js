/**
 * Yoya.Components - Grid Layout
 * 24 栅格系统组件
 */

import { Tag, div } from '../core/basic.js';

// ============================================
// VRow 栅格行组件
// ============================================

class VRow extends Tag {
  static _stateAttrs = ['wrap'];

  constructor(setup = null) {
    super('div', null);

    // 内部状态
    this._gutter = 0;
    this._align = 'stretch';
    this._justify = 'start';

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({ wrap: false });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupString(setup) {
    // 字符串 setup 不做特殊处理
  }

  _setupBaseStyles() {
    this.addClass('yoya-row');
  }

  _registerStateHandlers() {
    // wrap 状态处理器
    this.registerStateHandler('wrap', (shouldWrap, host) => {
      if (shouldWrap) {
        host.style('flexWrap', 'wrap');
      } else {
        host.style('flexWrap', 'nowrap');
      }
    });
  }

  /**
   * 设置列间距
   * @param {number|string|object} value - 间距值（数字、CSS 字符串或响应式对象）
   * @returns {this}
   */
  gutter(value) {
    this._gutter = value;

    // 处理不同格式的 gutter 值
    let gutterValue;
    if (typeof value === 'object' && value !== null) {
      // 响应式对象，如 { xs: 8, sm: 12, md: 16 }
      // 默认使用 md 的值或第一个值
      const keys = Object.keys(value);
      const firstKey = keys.find(k => k === 'md') || keys[0];
      gutterValue = value[firstKey];
    } else {
      gutterValue = typeof value === 'number' ? value : parseInt(value) || 0;
    }

    // 应用间距到子元素
    this._applyGutterStyles(gutterValue);

    return this;
  }

  /**
   * 应用间距样式到子元素
   * @private
   */
  _applyGutterStyles(gutterValue) {
    const halfGutter = gutterValue / 2;

    // 遍历所有 VCol 子元素，应用 padding
    this._children.forEach(child => {
      if (child instanceof VCol) {
        child.style('paddingLeft', `${halfGutter}px`);
        child.style('paddingRight', `${halfGutter}px`);
      }
    });

    // 设置行的负 margin 来抵消 gutter
    this.style('marginLeft', `-${halfGutter}px`);
    this.style('marginRight', `-${halfGutter}px`);
  }

  /**
   * 设置垂直对齐方式
   * @param {string} type - top | middle | bottom | stretch
   * @returns {this}
   */
  align(type) {
    this._align = type;

    const alignMap = {
      'top': 'flex-start',
      'middle': 'center',
      'bottom': 'flex-end',
      'stretch': 'stretch'
    };

    this.style('alignItems', alignMap[type] || 'stretch');
    return this;
  }

  /**
   * 设置水平对齐方式
   * @param {string} type - start | center | end | between | around
   * @returns {this}
   */
  justify(type) {
    this._justify = type;

    const justifyMap = {
      'start': 'flex-start',
      'center': 'center',
      'end': 'flex-end',
      'between': 'space-between',
      'around': 'space-around'
    };

    this.style('justifyContent', justifyMap[type] || 'flex-start');
    return this;
  }

  /**
   * 设置是否换行
   * @param {boolean} bool - 是否换行
   * @returns {this}
   */
  wrap(bool) {
    this.setState('wrap', bool);
    return this;
  }

  /**
   * 添加列
   * @param {function} setup - 列的 setup 函数
   * @returns {this}
   */
  col(setup) {
    const col = vCol(setup);
    this.child(col);

    // 如果已经设置了 gutter，应用到新列
    if (this._gutter) {
      const gutterValue = typeof this._gutter === 'number'
        ? this._gutter
        : parseInt(this._gutter) || 0;
      const halfGutter = gutterValue / 2;
      col.style('paddingLeft', `${halfGutter}px`);
      col.style('paddingRight', `${halfGutter}px`);
    }

    return this;
  }
}

// ============================================
// VCol 栅格列组件
// ============================================

class VCol extends Tag {
  static _stateAttrs = [];

  // 响应式断点定义
  static _breakpoints = {
    xs: { max: 575.98 },      // < 576px
    sm: { min: 576, max: 767.98 },   // ≥ 576px
    md: { min: 768, max: 991.98 },   // ≥ 768px
    lg: { min: 992, max: 1199.98 },  // ≥ 992px
    xl: { min: 1200, max: 1599.98 }, // ≥ 1200px
    xxl: { min: 1600 }               // ≥ 1600px
  };

  constructor(setup = null) {
    super('div', null);

    // 内部状态
    this._span = 24;  // 默认占满整行
    this._offset = 0;
    this._order = 0;
    this._responsiveSpans = {};
    this._responsiveOffsets = {};

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({});

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupString(setup) {
    // 字符串 setup 不做特殊处理
  }

  _setupBaseStyles() {
    this.addClass('yoya-col');
    this.style('boxSizing', 'border-box');
    // 默认占满整行
    this.style('width', '100%');
    this.style('flex', '0 0 100%');
  }

  _registerStateHandlers() {
    // 无状态处理器
  }

  /**
   * 设置占位格数
   * @param {number} n - 占位格数 (1-24)
   * @returns {this}
   */
  span(n) {
    this._span = Math.max(1, Math.min(24, n));
    this._updateWidth();
    return this;
  }

  /**
   * 设置偏移格数
   * @param {number} n - 偏移格数 (0-24)
   * @returns {this}
   */
  offset(n) {
    this._offset = Math.max(0, Math.min(24, n));
    this._updateMargin();
    return this;
  }

  /**
   * 设置布局顺序
   * @param {number} n - 顺序值
   * @returns {this}
   */
  order(n) {
    this._order = n;
    this.style('order', String(n));
    return this;
  }

  // 响应式断点方法 - 占位
  xsSpan(n) { return this._setResponsiveSpan('xs', n); }
  smSpan(n) { return this._setResponsiveSpan('sm', n); }
  mdSpan(n) { return this._setResponsiveSpan('md', n); }
  lgSpan(n) { return this._setResponsiveSpan('lg', n); }
  xlSpan(n) { return this._setResponsiveSpan('xl', n); }
  xxlSpan(n) { return this._setResponsiveSpan('xxl', n); }

  // 响应式断点方法 - 偏移
  xsOffset(n) { return this._setResponsiveOffset('xs', n); }
  smOffset(n) { return this._setResponsiveOffset('sm', n); }
  mdOffset(n) { return this._setResponsiveOffset('md', n); }
  lgOffset(n) { return this._setResponsiveOffset('lg', n); }
  xlOffset(n) { return this._setResponsiveOffset('xl', n); }
  xxlOffset(n) { return this._setResponsiveOffset('xxl', n); }

  /**
   * 设置响应式占位
   * @private
   */
  _setResponsiveSpan(breakpoint, n) {
    this._responsiveSpans[breakpoint] = Math.max(1, Math.min(24, n));
    this._applyResponsiveStyles();
    return this;
  }

  /**
   * 设置响应式偏移
   * @private
   */
  _setResponsiveOffset(breakpoint, n) {
    this._responsiveOffsets[breakpoint] = Math.max(0, Math.min(24, n));
    this._applyResponsiveStyles();
    return this;
  }

  /**
   * 更新宽度样式
   * @private
   */
  _updateWidth() {
    const percentage = (this._span / 24) * 100;
    this.style('width', `${percentage}%`);
    this.style('flex', `0 0 ${percentage}%`);
  }

  /**
   * 更新边距样式
   * @private
   */
  _updateMargin() {
    if (this._offset > 0) {
      const percentage = (this._offset / 24) * 100;
      this.style('marginLeft', `${percentage}%`);
    } else {
      this.style('marginLeft', '');
    }
  }

  /**
   * 应用响应式样式（媒体查询）
   * @private
   */
  _applyResponsiveStyles() {
    // 为每个断点生成对应的样式
    Object.entries(VCol._breakpoints).forEach(([bp, range]) => {
      const spanValue = this._responsiveSpans[bp];
      const offsetValue = this._responsiveOffsets[bp];

      if (spanValue !== undefined || offsetValue !== undefined) {
        // 这里通过 style 标签注入媒体查询样式
        // 实际项目中应该在 CSS 文件中预定义这些类
        const styleId = `yoya-col-responsive-${bp}-${this._el.id || 'col'}`;

        // 简化实现：在 setup 时应用各断点的默认样式
        // 完整实现需要在 CSS 中使用媒体查询
      }
    });
  }
}

// ============================================
// 工厂函数
// ============================================

/**
 * 创建 VRow 栅格行
 * @param {function} setup - setup 函数
 * @returns {VRow}
 */
function vRow(setup = null) {
  return new VRow(setup);
}

/**
 * 创建 VCol 栅格列
 * @param {function} setup - setup 函数
 * @returns {VCol}
 */
function vCol(setup = null) {
  return new VCol(setup);
}

// ============================================
// 导出
// ============================================

export {
  VRow,
  VCol,
  vRow,
  vCol,
};
