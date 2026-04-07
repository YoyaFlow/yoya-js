/**
 * Yoya.Basic - Dashboard Decoration Components
 * 大屏看板装饰组件库
 * 提供边框、分割线、角标等美化组件
 * @module Yoya.Dashboard.Decoration
 */

import { Tag, div, span } from '../core/basic.js';

// ============================================
// VBorder 装饰边框组件
// ============================================

/**
 * VBorder 装饰边框组件
 * 支持多种边框样式：普通、渐变、发光、角标
 * @class
 * @extends Tag
 */
class VBorder extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._type = 'normal';
    this._color = 'var(--yoya-primary)';
    this._color2 = 'var(--yoya-primary-light)';
    this._borderWidth = 2;
    this._borderRadius = 8;
    this._padding = 16;
    this._background = 'var(--yoya-bg)';
    this._glowIntensity = 0.5;
    this._animated = false;
    this._contentEl = null;

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
    
    // Setup 完成后创建装饰
    this._createDecoration();
  }

  _setupBaseStyles() {
    this.addClass('yoya-border');
    this.styles({
      position: 'relative',
      padding: `${this._padding}px`,
      background: this._background,
      borderRadius: `${this._borderRadius}px`,
    });
  }

  _createInternalElements() {
    // 内容容器
    this._contentEl = div(c => {
      c.addClass('yoya-border__content');
      c.styles({
        position: 'relative',
        zIndex: 1,
      });
    });
    this._children.push(this._contentEl);

    // 注意：装饰元素在 setup 之后创建，以确保属性正确应用
  }

  _createDecoration() {
    if (this._type === 'gradient') {
      this._createGradientBorder();
    } else if (this._type === 'glow') {
      this._createGlowBorder();
    } else if (this._type === 'corner') {
      this._createCornerBorder();
    }
  }

  _createGradientBorder() {
    const gradientEl = div(g => {
      g.addClass('yoya-border__gradient');
      g.styles({
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        borderRadius: `${this._borderRadius}px`,
        padding: `${this._borderWidth}px`,
        background: `linear-gradient(135deg, ${this._color}, ${this._color2})`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        pointerEvents: 'none',
      });
    });
    this._children.push(gradientEl);
  }

  _createGlowBorder() {
    const glowEl = div(g => {
      g.addClass('yoya-border__glow');
      g.styles({
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        borderRadius: `${this._borderRadius}px`,
        border: `${this._borderWidth}px solid ${this._color}`,
        boxShadow: `0 0 ${10 * this._glowIntensity}px ${this._color}, inset 0 0 ${5 * this._glowIntensity}px ${this._color}`,
        pointerEvents: 'none',
      });
      if (this._animated) {
        g.style('animation', 'borderGlow 2s ease-in-out infinite');
      }
    });
    this._children.push(glowEl);
  }

  _createCornerBorder() {
    const cornerSize = 20;
    const corners = [
      { class: 'top-left', style: { top: '0', left: '0', borderRadius: `${this._borderRadius}px 0 0 0` } },
      { class: 'top-right', style: { top: '0', right: '0', borderRadius: `0 ${this._borderRadius}px 0 0` } },
      { class: 'bottom-left', style: { bottom: '0', left: '0', borderRadius: `0 0 0 ${this._borderRadius}px` } },
      { class: 'bottom-right', style: { bottom: '0', right: '0', borderRadius: `0 0 ${this._borderRadius}px 0` } },
    ];

    corners.forEach(corner => {
      const cornerEl = div(c => {
        c.addClass('yoya-border__corner');
        c.addClass(corner.class);
        c.styles({
          position: 'absolute',
          width: `${cornerSize}px`,
          height: `${cornerSize}px`,
          border: `${this._borderWidth}px solid ${this._color}`,
          ...corner.style,
          pointerEvents: 'none',
        });
        if (corner.class === 'top-left') {
          c.styles({ borderBottom: 'none', borderRight: 'none' });
        } else if (corner.class === 'top-right') {
          c.styles({ borderBottom: 'none', borderLeft: 'none' });
        } else if (corner.class === 'bottom-left') {
          c.styles({ borderTop: 'none', borderRight: 'none' });
        } else if (corner.class === 'bottom-right') {
          c.styles({ borderTop: 'none', borderLeft: 'none' });
        }
      });
      this._children.push(cornerEl);
    });
  }

  /**
   * 添加内容
   * @param {Tag|string} content - 内容
   * @returns {this}
   */
  content(content) {
    if (this._contentEl) {
      if (typeof content === 'string') {
        this._contentEl.textContent(content);
      } else if (content instanceof Tag) {
        this._contentEl.child(content);
      }
    }
    return this;
  }

  /**
   * 设置边框类型
   * @param {string} type - 'normal' | 'gradient' | 'glow' | 'corner'
   * @returns {this}
   */
  type(type) {
    this._type = type;
    return this;
  }

  /**
   * 设置边框颜色
   * @param {string} color - 主颜色
   * @param {string} color2 - 渐变副颜色
   * @returns {this}
   */
  color(color, color2 = null) {
    this._color = color;
    if (color2) this._color2 = color2;
    return this;
  }

  /**
   * 设置边框宽度
   * @param {number} width - 宽度（像素）
   * @returns {this}
   */
  borderWidth(width) {
    this._borderWidth = width;
    return this;
  }

  /**
   * 设置圆角
   * @param {number} radius - 圆角（像素）
   * @returns {this}
   */
  borderRadius(radius) {
    this._borderRadius = radius;
    return this;
  }

  /**
   * 设置内边距
   * @param {number} padding - 内边距（像素）
   * @returns {this}
   */
  padding(padding) {
    this._padding = padding;
    return this;
  }

  /**
   * 设置背景色
   * @param {string} bg - 背景色
   * @returns {this}
   */
  background(bg) {
    this._background = bg;
    return this;
  }

  /**
   * 设置发光强度
   * @param {number} intensity - 强度 0-1
   * @returns {this}
   */
  glowIntensity(intensity) {
    this._glowIntensity = intensity;
    if (this._type === 'glow') {
      this._recreateDecoration();
    }
    return this;
  }

  /**
   * 设置是否动画
   * @param {boolean} animated - 是否动画
   * @returns {this}
   */
  animated(animated) {
    this._animated = animated;
    if (this._type === 'glow') {
      this._recreateDecoration();
    }
    return this;
  }

  /**
   * 重新创建装饰
   * @private
   */
  _recreateDecoration() {
    // 清除现有的装饰元素（保留内容元素）
    this._children = [this._contentEl];
    // 重新创建装饰
    this._createDecoration();
  }
}

/**
 * 创建 VBorder 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VBorder}
 */
function vBorder(setup = null) {
  return new VBorder(setup);
}

// ============================================
// VDivider 分割线组件
// ============================================

/**
 * VDivider 分割线组件
 * 支持水平/垂直、渐变、虚线、带文字
 * @class
 * @extends Tag
 */
class VDivider extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._orientation = 'horizontal';
    this._type = 'normal';
    this._color = 'var(--yoya-border)';
    this._color2 = 'var(--yoya-primary)';
    this._thickness = 1;
    this._length = '100%';
    this._text = '';
    this._textAlign = 'center';
    this._textColor = 'var(--yoya-text-secondary)';
    this._fontSize = 12;
    this._gap = 8;
    this._rendered = false;

    this._setupBaseStyles();

    if (setup !== null) {
      this.setup(setup);
    }
    
    // Setup 完成后渲染子元素
    this._render();
  }

  _setupBaseStyles() {
    this.addClass('yoya-divider');

    if (this._orientation === 'horizontal') {
      this.styles({
        display: 'flex',
        alignItems: 'center',
        justifyContent: this._textAlign === 'center' ? 'center' : this._textAlign === 'right' ? 'flex-end' : 'flex-start',
        width: this._length,
      });
    } else {
      this.styles({
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: this._length,
      });
    }
  }

  _renderLine() {
    const lineEl = div(l => {
      l.addClass('yoya-divider__line');

      if (this._orientation === 'horizontal') {
        l.styles({
          height: `${this._thickness}px`,
          flex: this._text ? '1' : '0',
          background: this._type === 'gradient'
            ? `linear-gradient(90deg, ${this._color}, ${this._color2})`
            : this._color,
          border: 'none',
        });
        if (this._type === 'dashed') {
          l.style('borderTop', `${this._thickness}px dashed ${this._color}`);
          l.style('background', 'transparent');
        } else if (this._type === 'dotted') {
          l.style('borderTop', `${this._thickness}px dotted ${this._color}`);
          l.style('background', 'transparent');
        }
      } else {
        l.styles({
          width: `${this._thickness}px`,
          flex: this._text ? '1' : '0',
          background: this._type === 'gradient'
            ? `linear-gradient(180deg, ${this._color}, ${this._color2})`
            : this._color,
          border: 'none',
        });
        if (this._type === 'dashed') {
          l.style('borderLeft', `${this._thickness}px dashed ${this._color}`);
          l.style('background', 'transparent');
        } else if (this._type === 'dotted') {
          l.style('borderLeft', `${this._thickness}px dotted ${this._color}`);
          l.style('background', 'transparent');
        }
      }
    });
    return lineEl;
  }

  _render() {
    this.clear();
    this._children = [];

    if (this._text) {
      this.child(this._renderLine());

      const textEl = span(t => {
        t.addClass('yoya-divider__text');
        t.textContent(this._text);
        t.styles({
          padding: `0 ${this._gap}px`,
          fontSize: `${this._fontSize}px`,
          color: this._textColor,
        });
      });
      this.child(textEl);

      this.child(this._renderLine());
    } else {
      this.child(this._renderLine());
    }
  }

  orientation(orientation) {
    this._orientation = orientation;
    return this;
  }

  type(type) {
    this._type = type;
    return this;
  }

  color(color, color2 = null) {
    this._color = color;
    if (color2) this._color2 = color2;
    return this;
  }

  thickness(thickness) {
    this._thickness = thickness;
    return this;
  }

  length(length) {
    this._length = length;
    return this;
  }

  text(text) {
    this._text = text;
    this._render();
    return this;
  }

  textAlign(align) {
    this._textAlign = align;
    return this;
  }

  textColor(color) {
    this._textColor = color;
    return this;
  }

  fontSize(size) {
    this._fontSize = size;
    return this;
  }
}

/**
 * 创建 VDivider 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VDivider}
 */
function vDivider(setup = null) {
  return new VDivider(setup);
}

// ============================================
// VCorner 角标装饰组件
// ============================================

/**
 * VCorner 角标装饰组件
 * 四角装饰框，适合大屏看板
 * @class
 * @extends Tag
 */
class VCorner extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._size = 30;
    this._color = 'var(--yoya-primary)';
    this._borderWidth = 3;
    this._positions = ['tl', 'tr', 'bl', 'br'];
    this._shape = 'L';
    this._animated = false;
    this._contentEl = null;

    this._setupBaseStyles();

    if (setup !== null) {
      this.setup(setup);
    }

    // Setup 完成后创建角标
    this._createCorners();
  }

  _setupBaseStyles() {
    this.addClass('yoya-corner');
    this.styles({
      position: 'relative',
      display: 'inline-block',
    });
  }

  _createCornerElement(position) {
    const cornerEl = div(c => {
      c.addClass('yoya-corner__piece');
      c.addClass(position);
      c.styles({
        position: 'absolute',
        width: `${this._size}px`,
        height: `${this._size}px`,
        pointerEvents: 'none',
      });

      if (this._shape === 'L') {
        this._createLCorner(c, position);
      } else if (this._shape === 'square') {
        this._createSquareCorner(c, position);
      } else if (this._shape === 'triangle') {
        this._createTriangleCorner(c, position);
      }
    });
    return cornerEl;
  }

  _createLCorner(container, position) {
    const isLeft = position.includes('l');
    const isTop = position.includes('t');

    const hLine = div(h => {
      h.styles({
        position: 'absolute',
        height: `${this._borderWidth}px`,
        background: this._color,
        left: isLeft ? '0' : 'auto',
        right: isLeft ? 'auto' : '0',
        top: isTop ? '0' : 'auto',
        bottom: isTop ? 'auto' : `${this._size - this._borderWidth}px`,
        width: `${this._size}px`,
      });
    });
    container.child(hLine);

    const vLine = div(v => {
      v.styles({
        position: 'absolute',
        width: `${this._borderWidth}px`,
        background: this._color,
        left: isLeft ? '0' : 'auto',
        right: isLeft ? 'auto' : `${this._size - this._borderWidth}px`,
        top: isTop ? '0' : 'auto',
        bottom: isTop ? 'auto' : '0',
        height: `${this._size}px`,
      });
    });
    container.child(vLine);

    if (this._animated) {
      hLine.style('animation', 'cornerPulse 2s ease-in-out infinite');
      vLine.style('animation', 'cornerPulse 2s ease-in-out infinite 0.5s');
    }
  }

  _createSquareCorner(container, position) {
    const isLeft = position.includes('l');
    const isTop = position.includes('t');

    const square = div(s => {
      s.styles({
        position: 'absolute',
        width: `${this._borderWidth}px`,
        height: `${this._borderWidth}px`,
        background: this._color,
        left: isLeft ? '0' : 'auto',
        right: isLeft ? 'auto' : '0',
        top: isTop ? '0' : 'auto',
        bottom: isTop ? 'auto' : '0',
      });
      if (this._animated) {
        s.style('animation', 'cornerPulse 2s ease-in-out infinite');
      }
    });
    container.child(square);
  }

  _createTriangleCorner(container, position) {
    const isLeft = position.includes('l');
    const isTop = position.includes('t');

    const triangle = div(t => {
      t.styles({
        position: 'absolute',
        width: '0',
        height: '0',
        borderStyle: 'solid',
        // 根据位置创建不同方向的三角形
        ...(position === 'tl' ? {
          // 左上角 - 三角形指向右下
          borderWidth: `${this._size}px ${this._size}px 0 0`,
          borderColor: `${this._color} transparent transparent transparent`,
          left: '0',
          top: '0',
        } : position === 'tr' ? {
          // 右上角 - 三角形指向左下
          borderWidth: `0 ${this._size}px ${this._size}px 0`,
          borderColor: `transparent ${this._color} transparent transparent`,
          right: '0',
          top: '0',
        } : position === 'bl' ? {
          // 左下角 - 三角形指向右上
          borderWidth: `${this._size}px 0 0 ${this._size}px`,
          borderColor: `transparent transparent ${this._color} transparent`,
          left: '0',
          bottom: '0',
        } : {
          // 右下角 - 三角形指向左上
          borderWidth: `0 0 ${this._size}px ${this._size}px`,
          borderColor: `transparent transparent transparent ${this._color}`,
          right: '0',
          bottom: '0',
        }),
      });
    });
    container.child(triangle);
  }

  _createCorners() {
    this._positions.forEach(pos => {
      this.child(this._createCornerElement(pos));
    });
  }

  content(content) {
    const contentEl = div(c => {
      c.styles({
        padding: `${this._size}px`,
      });
      if (typeof content === 'string') {
        c.textContent(content);
      } else {
        c.child(content);
      }
    });
    this.child(contentEl);
    return this;
  }

  size(size) {
    this._size = size;
    return this;
  }

  color(color) {
    this._color = color;
    return this;
  }

  borderWidth(width) {
    this._borderWidth = width;
    return this;
  }

  positions(positions) {
    this._positions = positions;
    this._recreateCorners();
    return this;
  }

  shape(shape) {
    this._shape = shape;
    this._recreateCorners();
    return this;
  }

  animated(animated) {
    this._animated = animated;
    this._recreateCorners();
    return this;
  }

  _recreateCorners() {
    // 清除现有角标（虚拟和真实 DOM）
    this._children = [];
    // 清空真实 DOM 中的子元素
    if (this._el) {
      this._el.innerHTML = '';
      // 重新应用基础样式类
      this._el.classList.add('yoya-corner');
    }
    // 重新创建
    this._createCorners();
  }
}

/**
 * 创建 VCorner 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VCorner}
 */
function vCorner(setup = null) {
  return new VCorner(setup);
}

// ============================================
// VTitleBar 标题栏组件
// ============================================

/**
 * VTitleBar 标题栏组件
 * 带装饰的标题条，适合大屏看板分区
 * @class
 * @extends Tag
 */
class VTitleBar extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._title = '';
    this._icon = '';
    this._subtitle = '';
    this._align = 'left';
    this._type = 'normal';
    this._color = 'var(--yoya-primary)';
    this._color2 = 'var(--yoya-primary-light)';
    this._height = 40;
    this._fontSize = 16;
    this._decorationWidth = 60;
    this._titleEl = null;
    this._iconEl = null;
    this._subtitleEl = null;

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-title-bar');
    this.styles({
      display: 'flex',
      alignItems: 'center',
      justifyContent: this._align === 'center' ? 'center' : this._align === 'right' ? 'flex-end' : 'flex-start',
      height: `${this._height}px`,
      gap: '12px',
    });
  }

  _createInternalElements() {
    if (this._type === 'bracket') {
      this.child(this._createBracket('left'));
    } else if (this._type === 'gradient' || this._type === 'underline') {
      this.child(this._createLine('left'));
    }

    // 始终创建图标元素（即使内容为空）
    const iconEl = span(i => {
      i.addClass('yoya-title-bar__icon');
      i.styles({
        fontSize: `${this._fontSize}px`,
      });
    });
    this._iconEl = iconEl;
    this.child(iconEl);

    // 始终创建标题元素（即使内容为空）
    const titleEl = span(t => {
      t.addClass('yoya-title-bar__title');
      t.styles({
        fontSize: `${this._fontSize}px`,
        fontWeight: '600',
        color: this._color,
      });
    });
    this._titleEl = titleEl;
    this.child(titleEl);

    // 始终创建副标题元素（即使内容为空）
    const subtitleEl = span(s => {
      s.addClass('yoya-title-bar__subtitle');
      s.styles({
        fontSize: `${this._fontSize - 2}px`,
        color: 'var(--yoya-text-secondary)',
      });
    });
    this._subtitleEl = subtitleEl;
    this.child(subtitleEl);

    if (this._type === 'bracket') {
      this.child(this._createBracket('right'));
    } else if (this._type === 'gradient' || this._type === 'underline') {
      this.child(this._createLine('right'));
    }
  }

  _createBracket(side) {
    return div(b => {
      b.addClass('yoya-title-bar__bracket');
      b.addClass(side);
      b.styles({
        width: `${this._height * 0.3}px`,
        height: `${this._height * 0.6}px`,
        border: `2px solid ${this._color}`,
        ...(side === 'left' ? {
          borderRight: 'none',
          borderRadius: '4px 0 0 4px',
        } : {
          borderLeft: 'none',
          borderRadius: '0 4px 4px 0',
        }),
      });
    });
  }

  _createLine(side) {
    return div(l => {
      l.addClass('yoya-title-bar__line');
      l.styles({
        width: `${this._decorationWidth}px`,
        height: '3px',
        background: `linear-gradient(90deg, ${this._color}, ${this._color2})`,
        borderRadius: '2px',
      });
    });
  }

  title(title) {
    this._title = title;
    return this;
  }

  icon(icon) {
    this._icon = icon;
    if (this._iconEl) {
      this._iconEl.textContent(icon);
    }
    return this;
  }

  subtitle(subtitle) {
    this._subtitle = subtitle;
    if (this._subtitleEl) {
      this._subtitleEl.textContent(subtitle);
    }
    return this;
  }

  align(align) {
    this._align = align;
    return this;
  }

  type(type) {
    this._type = type;
    // 动态更新装饰
    this._updateDecorationByType();
    return this;
  }

  _updateDecorationByType() {
    // 清除现有的装饰线（如果有）
    if (this._lineLeft) {
      this._lineLeft.destroy();
      this._lineLeft = null;
    }
    if (this._lineRight) {
      this._lineRight.destroy();
      this._lineRight = null;
    }
    if (this._bracketLeft) {
      this._bracketLeft.destroy();
      this._bracketLeft = null;
    }
    if (this._bracketRight) {
      this._bracketRight.destroy();
      this._bracketRight = null;
    }

    // 根据类型创建装饰
    if (this._type === 'bracket') {
      this._bracketLeft = this._createBracket('left');
      this._bracketRight = this._createBracket('right');
      // 在 icon 之前插入左括号，在 title 之后插入右括号
      const iconIndex = this._children.indexOf(this._iconEl);
      if (iconIndex >= 0) {
        this._children.splice(iconIndex, 0, this._bracketLeft);
      }
      const subtitleIndex = this._children.indexOf(this._subtitleEl);
      if (subtitleIndex >= 0) {
        this._children.splice(subtitleIndex + 1, 0, this._bracketRight);
      }
    } else if (this._type === 'gradient' || this._type === 'underline') {
      this._lineLeft = this._createLine('left');
      this._lineRight = this._createLine('right');
      const iconIndex = this._children.indexOf(this._iconEl);
      if (iconIndex >= 0) {
        this._children.splice(iconIndex, 0, this._lineLeft);
      }
      const subtitleIndex = this._children.indexOf(this._subtitleEl);
      if (subtitleIndex >= 0) {
        this._children.splice(subtitleIndex + 1, 0, this._lineRight);
      }
    }
  }

  color(color, color2 = null) {
    this._color = color;
    if (color2) this._color2 = color2;
    return this;
  }

  height(height) {
    this._height = height;
    return this;
  }

  fontSize(size) {
    this._fontSize = size;
    return this;
  }

  decorationWidth(width) {
    this._decorationWidth = width;
    return this;
  }

  title(title) {
    this._title = title;
    if (this._titleEl) {
      this._titleEl.textContent(title);
    }
    return this;
  }
}

/**
 * 创建 VTitleBar 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VTitleBar}
 */
function vTitleBar(setup = null) {
  return new VTitleBar(setup);
}

// ============================================
// VPanel 装饰面板组件
// ============================================

/**
 * VPanel 装饰面板组件
 * 带边框和背景的容器，适合大屏看板内容区
 * @class
 * @extends Tag
 */
class VPanel extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._title = '';
    this._type = 'normal';
    this._color = 'var(--yoya-primary)';
    this._color2 = 'var(--yoya-primary-light)';
    this._background = 'var(--yoya-bg)';
    this._borderRadius = 8;
    this._padding = 16;
    this._showHeader = true;
    this._headerEl = null;
    this._contentEl = null;

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
    
    // Setup 完成后添加装饰
    this._addDecoration();
  }

  _setupBaseStyles() {
    this.addClass('yoya-panel');
    this.styles({
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: `${this._borderRadius}px`,
      overflow: 'hidden',
    });
  }

  _createInternalElements() {
    if (this._showHeader && this._title) {
      this._headerEl = div(h => {
        h.addClass('yoya-panel__header');
        h.styles({
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--yoya-border-light)',
          background: 'var(--yoya-bg-secondary)',
        });

        const titleEl = span(t => {
          t.addClass('yoya-panel__title');
          t.textContent(this._title);
          t.styles({
            fontSize: '14px',
            fontWeight: '600',
            color: this._color,
          });
        });
        h.child(titleEl);
      });
      this.child(this._headerEl);
    }

    this._contentEl = div(c => {
      c.addClass('yoya-panel__content');
      c.styles({
        flex: '1',
        padding: `${this._padding}px`,
        background: this._background,
      });
    });
    this.child(this._contentEl);
  }

  _addDecoration() {
    if (this._type === 'gradient') {
      this._addGradientBorder();
    } else if (this._type === 'tech') {
      this._addTechDecoration();
    } else if (this._type === 'glass') {
      this._addGlassEffect();
    }
  }

  _addGradientBorder() {
    const gradientEl = div(g => {
      g.addClass('yoya-panel__gradient');
      g.styles({
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        borderRadius: `${this._borderRadius}px`,
        padding: '2px',
        background: `linear-gradient(135deg, ${this._color}, ${this._color2})`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        pointerEvents: 'none',
        zIndex: 1,
      });
    });
    this.child(gradientEl);
  }

  _addTechDecoration() {
    const cornerSize = 10;
    const corners = [
      { class: 'tl', style: { top: '0', left: '0' } },
      { class: 'tr', style: { top: '0', right: '0' } },
      { class: 'bl', style: { bottom: '0', left: '0' } },
      { class: 'br', style: { bottom: '0', right: '0' } },
    ];

    corners.forEach(corner => {
      const cornerEl = div(c => {
        c.addClass('yoya-panel__tech-corner');
        c.addClass(corner.class);
        c.styles({
          position: 'absolute',
          width: `${cornerSize}px`,
          height: `${cornerSize}px`,
          border: `2px solid ${this._color}`,
          ...corner.style,
          ...(corner.class === 'tl' ? { borderBottom: 'none', borderRight: 'none', borderRadius: `${this._borderRadius}px 0 0 0` } : {}),
          ...(corner.class === 'tr' ? { borderBottom: 'none', borderLeft: 'none', borderRadius: `0 ${this._borderRadius}px 0 0` } : {}),
          ...(corner.class === 'bl' ? { borderTop: 'none', borderRight: 'none', borderRadius: `0 0 0 ${this._borderRadius}px` } : {}),
          ...(corner.class === 'br' ? { borderTop: 'none', borderLeft: 'none', borderRadius: `0 0 ${this._borderRadius}px 0` } : {}),
          pointerEvents: 'none',
          zIndex: 1,
        });
      });
      this.child(cornerEl);
    });
  }

  _addGlassEffect() {
    this.style('background', `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`);
    this.style('backdropFilter', 'blur(10px)');
    this.style('border', '1px solid rgba(255,255,255,0.1)');
  }

  title(title) {
    this._title = title;
    // 如果 header 不存在，创建它
    if (!this._headerEl) {
      this._createHeader();
    } else {
      // 更新标题文本
      const titleEl = this._headerEl._children[0];
      if (titleEl) {
        titleEl.textContent(title);
      }
    }
    return this;
  }

  _createHeader() {
    this._headerEl = div(h => {
      h.addClass('yoya-panel__header');
      h.styles({
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid var(--yoya-border-light)',
        background: 'var(--yoya-bg-secondary)',
      });

      const titleEl = span(t => {
        t.addClass('yoya-panel__title');
        t.textContent(this._title);
        t.styles({
          fontSize: '14px',
          fontWeight: '600',
          color: this._color,
        });
      });
      h.child(titleEl);
    });

    // 在 contentEl 之前插入
    const contentIndex = this._children.indexOf(this._contentEl);
    if (contentIndex >= 0) {
      this._children.splice(contentIndex, 0, this._headerEl);
    }
  }

  type(type) {
    this._type = type;
    return this;
  }

  color(color, color2 = null) {
    this._color = color;
    if (color2) this._color2 = color2;
    return this;
  }

  background(bg) {
    this._background = bg;
    return this;
  }

  borderRadius(radius) {
    this._borderRadius = radius;
    return this;
  }

  padding(padding) {
    this._padding = padding;
    return this;
  }

  showHeader(show) {
    this._showHeader = show;
    return this;
  }

  content(content) {
    if (this._contentEl) {
      if (typeof content === 'string') {
        this._contentEl.textContent(content);
      } else if (content instanceof Tag) {
        this._contentEl.child(content);
      }
    }
    return this;
  }
}

/**
 * 创建 VPanel 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VPanel}
 */
function vPanel(setup = null) {
  return new VPanel(setup);
}

// ============================================
// VGlowBox 发光盒子组件
// ============================================

/**
 * VGlowBox 发光盒子组件
 * 带发光效果的容器
 * @class
 * @extends Tag
 */
class VGlowBox extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._color = 'var(--yoya-primary)';
    this._glowSize = 20;
    this._glowIntensity = 0.5;
    this._animated = true;
    this._borderRadius = 12;
    this._padding = 20;
    this._background = 'var(--yoya-bg)';

    this._setupBaseStyles();

    if (setup !== null) {
      this.setup(setup);
    }

    // Setup 完成后应用发光样式
    this._applyGlowStyles();
    if (this._animated) {
      this._applyAnimation();
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-glow-box');
    this.styles({
      position: 'relative',
    });
  }

  _applyGlowStyles() {
    const color = this._color;
    // 将十六进制颜色转换为 rgba
    const rgba = this._hexToRgba(color);
    this.styles({
      position: 'relative',
      borderRadius: `${this._borderRadius}px`,
      padding: `${this._padding}px`,
      background: this._background,
      boxShadow: `0 0 ${this._glowSize}px ${color}40, inset 0 0 ${this._glowSize / 2}px ${color}10`,
    });
  }

  _applyAnimation() {
    const animName = `glowPulse_${this._color.replace(/[^a-zA-Z0-9]/g, '')}`;
    this.style('animation', `${animName} 3s ease-in-out infinite`);

    // 如果动画关键帧已存在，不再创建
    if (document.getElementById(animName)) return;

    const rgba = this._hexToRgba(this._color);
    const style = document.createElement('style');
    style.id = animName;
    style.textContent = `
      @keyframes ${animName} {
        0%, 100% {
          box-shadow: 0 0 ${this._glowSize}px ${this._color}40, inset 0 0 ${this._glowSize / 2}px ${this._color}10;
        }
        50% {
          box-shadow: 0 0 ${this._glowSize * 1.5}px ${this._color}60, inset 0 0 ${this._glowSize}px ${this._color}20;
        }
      }
    `;
    document.head.appendChild(style);
  }

  _hexToRgba(hex) {
    // 处理十六进制颜色
    if (hex.startsWith('#')) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return hex;
  }

  content(content) {
    if (typeof content === 'string') {
      this.textContent(content);
    } else {
      this.child(content);
    }
    return this;
  }

  color(color) {
    this._color = color;
    this._applyGlowStyles();
    return this;
  }

  glowSize(size) {
    this._glowSize = size;
    // 重新应用 boxShadow
    this.style('boxShadow', `0 0 ${size}px ${this._color}40, inset 0 0 ${size / 2}px ${this._color}10`);
    return this;
  }

  glowIntensity(intensity) {
    this._glowIntensity = intensity;
    return this;
  }

  animated(animated) {
    this._animated = animated;
    if (animated) {
      this._applyAnimation();
    } else {
      this.style('animation', '');
    }
    return this;
  }

  borderRadius(radius) {
    this._borderRadius = radius;
    return this;
  }

  padding(padding) {
    this._padding = padding;
    return this;
  }

  background(bg) {
    this._background = bg;
    return this;
  }
}

/**
 * 创建 VGlowBox 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VGlowBox}
 */
function vGlowBox(setup = null) {
  return new VGlowBox(setup);
}

// ============================================
// VTechBorder 科技风边框组件
// ============================================

/**
 * VTechBorder 科技风边框组件
 * 适合数据大屏的科技风格边框
 * @class
 * @extends Tag
 */
class VTechBorder extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._color = 'var(--yoya-primary)';
    this._color2 = 'var(--yoya-primary-light)';
    this._borderWidth = 2;
    this._borderRadius = 4;
    this._padding = 16;
    this._showCorner = true;
    this._showLine = true;
    this._animated = true;
    this._contentEl = null;

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-tech-border');
    this.styles({
      position: 'relative',
      padding: `${this._padding}px`,
    });
  }

  _createInternalElements() {
    this._contentEl = div(c => {
      c.addClass('yoya-tech-border__content');
      c.styles({
        position: 'relative',
        zIndex: 1,
      });
    });
    this.child(this._contentEl);

    if (this._showLine) {
      this._createBorderLines();
    }

    if (this._showCorner) {
      this._createCorners();
    }
  }

  _createBorderLines() {
    const lines = [
      { class: 'top', style: { top: '0', left: '0', right: '0', height: `${this._borderWidth}px` } },
      { class: 'bottom', style: { bottom: '0', left: '0', right: '0', height: `${this._borderWidth}px` } },
      { class: 'left', style: { top: '0', bottom: '0', left: '0', width: `${this._borderWidth}px` } },
      { class: 'right', style: { top: '0', bottom: '0', right: '0', width: `${this._borderWidth}px` } },
    ];

    lines.forEach(line => {
      const lineEl = div(l => {
        l.addClass('yoya-tech-border__line');
        l.addClass(line.class);
        l.styles({
          position: 'absolute',
          background: `linear-gradient(90deg, ${this._color}00, ${this._color}, ${this._color2}, ${this._color}00)`,
          ...line.style,
        });
        if (this._animated) {
          l.style('animation', `techLineFlow 3s linear infinite`);
        }
      });
      this.child(lineEl);
    });
  }

  _createCorners() {
    const cornerSize = 15;
    const corners = ['tl', 'tr', 'bl', 'br'];

    corners.forEach(pos => {
      const cornerEl = div(c => {
        c.addClass('yoya-tech-border__corner');
        c.addClass(pos);
        c.styles({
          position: 'absolute',
          width: `${cornerSize}px`,
          height: `${cornerSize}px`,
        });

        const isLeft = pos.includes('l');
        const isTop = pos.includes('t');

        // 科技风角标：使用两个分离的小线段，形成斜角效果
        const hLine = div(h => {
          h.styles({
            position: 'absolute',
            height: `${this._borderWidth + 1}px`,
            background: this._color,
            width: `${cornerSize * 0.6}px`,
            left: isLeft ? '0' : 'auto',
            right: isLeft ? 'auto' : '0',
            top: isTop ? '0' : 'auto',
            bottom: isTop ? 'auto' : '0',
          });
        });
        c.child(hLine);

        const vLine = div(v => {
          v.styles({
            position: 'absolute',
            width: `${this._borderWidth + 1}px`,
            background: this._color,
            height: `${cornerSize * 0.6}px`,
            left: isLeft ? '0' : 'auto',
            right: isLeft ? 'auto' : '0',
            top: isTop ? '0' : 'auto',
            bottom: isTop ? 'auto' : '0',
          });
        });
        c.child(vLine);
      });
      this.child(cornerEl);
    });
  }

  content(content) {
    if (this._contentEl) {
      if (typeof content === 'string') {
        this._contentEl.textContent(content);
      } else if (content instanceof Tag) {
        this._contentEl.child(content);
      }
    }
    return this;
  }

  color(color, color2 = null) {
    this._color = color;
    if (color2) this._color2 = color2;
    return this;
  }

  borderWidth(width) {
    this._borderWidth = width;
    return this;
  }

  borderRadius(radius) {
    this._borderRadius = radius;
    return this;
  }

  padding(padding) {
    this._padding = padding;
    return this;
  }

  showCorner(show) {
    this._showCorner = show;
    return this;
  }

  showLine(show) {
    this._showLine = show;
    return this;
  }

  animated(animated) {
    this._animated = animated;
    return this;
  }
}

/**
 * 创建 VTechBorder 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VTechBorder}
 */
function vTechBorder(setup = null) {
  return new VTechBorder(setup);
}

// ============================================
// 导出装饰组件
// ============================================

export {
  VBorder,
  vBorder,
  VDivider,
  vDivider,
  VCorner,
  vCorner,
  VTitleBar,
  vTitleBar,
  VPanel,
  vPanel,
  VGlowBox,
  vGlowBox,
  VTechBorder,
  vTechBorder,
};
