/**
 * Yoya.Basic - Dashboard Components
 * 大屏看板组件库
 * 提供数据可视化大屏常用的展示组件（不与 ECharts 重复）
 * @module Yoya.Dashboard
 */

import { Tag, div, span } from '../core/basic.js';

// ============================================
// VNumberScroll 数字滚动动画组件
// ============================================

/**
 * VNumberScroll 数字滚动动画组件
 * 类似数据大屏的数字翻牌效果，支持从 0 滚动到目标值
 * @class
 * @extends Tag
 */
class VNumberScroll extends Tag {
  static _stateAttrs = ['loading'];

  constructor(setup = null) {
    super('div', null);

    this._value = 0;
    this._targetValue = 0;
    this._prefix = '';
    this._suffix = '';
    this._precision = 0;
    this._separator = ',';
    this._duration = 2000;
    this._easing = 'easeOutExpo';
    this._fontSize = '48px';
    this._color = 'var(--yoya-text-primary)';
    this._valueEl = null;
    this._prefixEl = null;
    this._suffixEl = null;
    this._animationFrame = null;

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ loading: false });

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-number-scroll');
    this.styles({
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: '4px',
      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
      fontVariantNumeric: 'tabular-nums',
    });
  }

  _createInternalElements() {
    // 前缀
    if (this._prefix) {
      this._prefixEl = span(p => {
        p.addClass('yoya-number-scroll__prefix');
        p.text(this._prefix);
        p.styles({
          fontSize: this._fontSize,
          color: this._color,
        });
      });
      this._children.push(this._prefixEl);
    }

    // 数值显示
    this._valueEl = div(v => {
      v.addClass('yoya-number-scroll__value');
      v.text(this._formatNumber(0));
      v.styles({
        fontSize: this._fontSize,
        fontWeight: '700',
        color: this._color,
        lineHeight: '1',
      });
    });
    this._children.push(this._valueEl);

    // 后缀
    if (this._suffix) {
      this._suffixEl = span(s => {
        s.addClass('yoya-number-scroll__suffix');
        s.text(this._suffix);
        s.styles({
          fontSize: this._fontSize,
          color: this._color,
        });
      });
      this._children.push(this._suffixEl);
    }
  }

  _formatNumber(num) {
    let formatted = this._precision > 0
      ? num.toFixed(this._precision)
      : String(Math.round(num));

    if (this._separator) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this._separator);
      formatted = parts.join('.');
    }

    return formatted;
  }

  _easingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeInOutExpo: t => t === 0 || t === 1 ? t : t < 0.5 ? Math.pow(2, 20 * t - 1) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  };

  _animate() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }

    const startValue = 0;
    const endValue = this._targetValue;
    const startTime = performance.now();
    const easingFn = this._easingFunctions[this._easing] || this._easingFunctions.easeOutExpo;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this._duration, 1);
      const easedProgress = easingFn(progress);
      const currentValue = startValue + (endValue - startValue) * easedProgress;

      this._value = currentValue;
      if (this._valueEl) {
        this._valueEl.textContent(this._formatNumber(currentValue));
      }

      if (progress < 1) {
        this._animationFrame = requestAnimationFrame(step);
      } else {
        this._value = endValue;
        if (this._valueEl) {
          this._valueEl.textContent(this._formatNumber(endValue));
        }
      }
    };

    this._animationFrame = requestAnimationFrame(step);
  }

  /**
   * 设置目标值并触发动画
   * @param {number} value - 目标数值
   * @returns {this}
   */
  value(value) {
    this._targetValue = parseFloat(value) || 0;
    this._animate();
    return this;
  }

  /**
   * 设置前缀
   * @param {string} prefix - 前缀字符串
   * @returns {this}
   */
  prefix(prefix) {
    this._prefix = prefix;
    return this;
  }

  /**
   * 设置后缀
   * @param {string} suffix - 后缀字符串
   * @returns {this}
   */
  suffix(suffix) {
    this._suffix = suffix;
    return this;
  }

  /**
   * 设置数值精度（小数位数）
   * @param {number} precision - 小数位数
   * @returns {this}
   */
  precision(precision) {
    this._precision = precision;
    return this;
  }

  /**
   * 设置千分位分隔符
   * @param {string} separator - 分隔符
   * @returns {this}
   */
  separator(separator) {
    this._separator = separator;
    return this;
  }

  /**
   * 设置动画时长（毫秒）
   * @param {number} duration - 时长
   * @returns {this}
   */
  duration(duration) {
    this._duration = duration;
    return this;
  }

  /**
   * 设置缓动函数类型
   * @param {string} easing - 缓动类型：linear, easeInQuad, easeOutQuad, easeInOutQuad, easeInExpo, easeOutExpo, easeInOutExpo
   * @returns {this}
   */
  easing(easing) {
    this._easing = easing;
    return this;
  }

  /**
   * 设置字体大小
   * @param {string} size - 字体大小
   * @returns {this}
   */
  fontSize(size) {
    this._fontSize = size;
    if (this._valueEl) {
      this._valueEl.style('fontSize', size);
    }
    if (this._prefixEl) {
      this._prefixEl.style('fontSize', size);
    }
    if (this._suffixEl) {
      this._suffixEl.style('fontSize', size);
    }
    return this;
  }

  /**
   * 设置字体颜色
   * @param {string} color - 颜色值
   * @returns {this}
   */
  color(color) {
    this._color = color;
    if (this._valueEl) {
      this._valueEl.style('color', color);
    }
    if (this._prefixEl) {
      this._prefixEl.style('color', color);
    }
    if (this._suffixEl) {
      this._suffixEl.style('color', color);
    }
    return this;
  }

  /**
   * 销毁组件，清理动画
   */
  destroy() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }
    return super.destroy();
  }
}

/**
 * 创建 VNumberScroll 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VNumberScroll}
 */
function vNumberScroll(setup = null) {
  return new VNumberScroll(setup);
}

// ============================================
// VTrend 趋势指示器组件
// ============================================

/**
 * VTrend 趋势指示器组件
 * 显示上升/下降趋势箭头和百分比
 * @class
 * @extends Tag
 */
class VTrend extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._value = 0;
    this._precision = 1;
    this._showIcon = true;
    this._showValue = true;
    this._iconSize = '16px';
    this._fontSize = '14px';
    this._positiveColor = '#52c41a';
    this._negativeColor = '#ff4d4f';
    this._neutralColor = 'var(--yoya-text-secondary)';
    this._iconEl = null;
    this._valueEl = null;

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-trend');
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    });
  }

  _createInternalElements() {
    // 图标
    this._iconEl = span(i => {
      i.addClass('yoya-trend__icon');
      i.styles({
        fontSize: this._iconSize,
        lineHeight: '1',
      });
    });
    this._children.push(this._iconEl);

    // 数值
    this._valueEl = span(v => {
      v.addClass('yoya-trend__value');
      v.styles({
        fontSize: this._fontSize,
      });
    });
    this._children.push(this._valueEl);
  }

  _updateDisplay() {
    if (!this._iconEl || !this._valueEl) return;

    const isPositive = this._value > 0;
    const isNegative = this._value < 0;
    const isNeutral = this._value === 0;

    // 更新图标
    if (this._showIcon) {
      if (isPositive) {
        this._iconEl.textContent('↑');
        this._iconEl.style('color', this._positiveColor);
      } else if (isNegative) {
        this._iconEl.textContent('↓');
        this._iconEl.style('color', this._negativeColor);
      } else {
        this._iconEl.textContent('−');
        this._iconEl.style('color', this._neutralColor);
      }
      this._iconEl.style('display', '');
    } else {
      this._iconEl.style('display', 'none');
    }

    // 更新数值
    if (this._showValue) {
      const absValue = Math.abs(this._value).toFixed(this._precision);
      this._valueEl.textContent(`${absValue}%`);

      if (isPositive) {
        this._valueEl.style('color', this._positiveColor);
      } else if (isNegative) {
        this._valueEl.style('color', this._negativeColor);
      } else {
        this._valueEl.style('color', this._neutralColor);
      }
      this._valueEl.style('display', '');
    } else {
      this._valueEl.style('display', 'none');
    }
  }

  /**
   * 设置趋势值（百分比）
   * @param {number} value - 趋势值（正数表示上升，负数表示下降）
   * @returns {this}
   */
  value(value) {
    this._value = parseFloat(value) || 0;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置数值精度
   * @param {number} precision - 小数位数
   * @returns {this}
   */
  precision(precision) {
    this._precision = precision;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置是否显示图标
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showIcon(show) {
    this._showIcon = show;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置是否显示数值
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showValue(show) {
    this._showValue = show;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置图标大小
   * @param {string} size - 图标大小
   * @returns {this}
   */
  iconSize(size) {
    this._iconSize = size;
    if (this._iconEl) {
      this._iconEl.style('fontSize', size);
    }
    return this;
  }

  /**
   * 设置字体大小
   * @param {string} size - 字体大小
   * @returns {this}
   */
  fontSize(size) {
    this._fontSize = size;
    if (this._valueEl) {
      this._valueEl.style('fontSize', size);
    }
    return this;
  }

  /**
   * 设置上升/正面颜色
   * @param {string} color - 颜色值
   * @returns {this}
   */
  positiveColor(color) {
    this._positiveColor = color;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置下降/负面颜色
   * @param {string} color - 颜色值
   * @returns {this}
   */
  negativeColor(color) {
    this._negativeColor = color;
    this._updateDisplay();
    return this;
  }
}

/**
 * 创建 VTrend 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VTrend}
 */
function vTrend(setup = null) {
  return new VTrend(setup);
}

// ============================================
// VGauge 简易仪表盘组件
// ============================================

/**
 * VGauge 简易仪表盘组件
 * 半圆/全圆进度条，使用 SVG 绘制
 * @class
 * @extends Tag
 */
class VGauge extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._value = 0;
    this._min = 0;
    this._max = 100;
    this._size = 200;
    this._strokeWidth = 20;
    this._type = 'semicircle';
    this._showValue = true;
    this._showLabel = true;
    this._label = '';
    this._valueSuffix = '';
    this._precision = 0;
    this._svgEl = null;
    this._textGroupEl = null;
    this._valueTextEl = null;
    this._labelTextEl = null;

    this._setupBaseStyles();
    this._createSVG();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-gauge');
    this.styles({
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    });
  }

  _createSVG() {
    const size = this._size;
    const height = this._type === 'semicircle' ? size / 2 + this._strokeWidth : size;

    // 创建 SVG 容器
    this._svgEl = div(s => {
      s.addClass('yoya-gauge__svg');
      s.styles({
        display: 'block',
        width: `${size}px`,
        height: `${height}px`,
      });

      // 使用 innerHTML 创建 SVG 结构（仅用于初始结构，后续更新通过属性）
      s.html(`
        <svg width="${size}" height="${height}" viewBox="0 0 ${size} ${height}">
          <defs>
            <linearGradient id="gaugeGradient-${this._el.id || 'default'}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:var(--yoya-primary)"/>
              <stop offset="100%" style="stop-color:var(--yoya-primary-light)"/>
            </linearGradient>
          </defs>
          <!-- 背景轨道 -->
          <path class="yoya-gauge__track" fill="none" stroke="var(--yoya-border)" stroke-width="${this._strokeWidth}" stroke-linecap="round"/>
          <!-- 进度条 -->
          <path class="yoya-gauge__progress" fill="none" stroke="url(#gaugeGradient-${this._el.id || 'default'})" stroke-width="${this._strokeWidth}" stroke-linecap="round"/>
        </svg>
      `);
    });
    this._children.push(this._svgEl);

    // 延迟获取 SVG 元素引用
    setTimeout(() => {
      const svg = this._svgEl._el.querySelector('svg');
      if (svg) {
        const paths = svg.querySelectorAll('path');
        this._trackPath = paths[0];
        this._progressPath = paths[1];

        // 创建文本组
        if (this._showValue || this._showLabel) {
          const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          textGroup.setAttribute('text-anchor', 'middle');

          if (this._showValue) {
            this._valueTextEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            this._valueTextEl.setAttribute('fill', 'var(--yoya-text-primary)');
            this._valueTextEl.setAttribute('font-size', String(this._size / 8));
            this._valueTextEl.setAttribute('font-weight', '600');
            textGroup.appendChild(this._valueTextEl);
          }

          if (this._showLabel) {
            this._labelTextEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            this._labelTextEl.setAttribute('fill', 'var(--yoya-text-secondary)');
            this._labelTextEl.setAttribute('font-size', String(this._size / 12));
            this._labelTextEl.setAttribute('dy', String(this._size / 6));
            textGroup.appendChild(this._labelTextEl);
          }

          svg.appendChild(textGroup);
        }

        this._updateGauge();
      }
    }, 0);
  }

  _getArcPath(cx, cy, r, startAngle, endAngle, clockwise) {
    const start = {
      x: cx + r * Math.cos(startAngle),
      y: cy + r * Math.sin(startAngle)
    };
    const end = {
      x: cx + r * Math.cos(endAngle),
      y: cy + r * Math.sin(endAngle)
    };
    const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    const sweepFlag = clockwise ? 1 : 0;

    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
  }

  _updateGauge() {
    if (!this._trackPath || !this._progressPath) return;

    const size = this._size;
    const center = size / 2;
    const radius = center - this._strokeWidth;
    const isSemicircle = this._type === 'semicircle';

    if (isSemicircle) {
      // 半圆仪表盘（从 π 到 2π）
      const startAngle = Math.PI;
      const endAngle = 2 * Math.PI;
      const totalAngle = endAngle - startAngle;

      // 轨道
      this._trackPath.setAttribute('d', this._getArcPath(center, center, radius, startAngle, endAngle, true));

      // 进度
      const normalizedValue = (this._value - this._min) / (this._max - this._min);
      const currentAngle = startAngle + totalAngle * normalizedValue;
      this._progressPath.setAttribute('d', this._getArcPath(center, center, radius, startAngle, currentAngle, true));

      // 文本位置
      if (this._valueTextEl) {
        this._valueTextEl.setAttribute('x', String(center));
        this._valueTextEl.setAttribute('y', String(center * 0.7));
        this._valueTextEl.textContent = this._formatValue();
      }
      if (this._labelTextEl) {
        this._labelTextEl.setAttribute('x', String(center));
        this._labelTextEl.setAttribute('y', String(center * 0.7));
        this._labelTextEl.textContent = this._label || '目标值';
      }
    } else {
      // 全圆仪表盘（从 -π/2 到 3π/2）
      const startAngle = -Math.PI / 2;
      const endAngle = 3 * Math.PI / 2;
      const totalAngle = endAngle - startAngle;

      // 轨道
      this._trackPath.setAttribute('d', this._getArcPath(center, center, radius, startAngle, endAngle, true));

      // 进度
      const normalizedValue = (this._value - this._min) / (this._max - this._min);
      const currentAngle = startAngle + totalAngle * normalizedValue;
      this._progressPath.setAttribute('d', this._getArcPath(center, center, radius, startAngle, currentAngle, true));

      // 文本位置
      if (this._valueTextEl) {
        this._valueTextEl.setAttribute('x', String(center));
        this._valueTextEl.setAttribute('y', String(center + this._size / 12));
        this._valueTextEl.textContent = this._formatValue();
      }
      if (this._labelTextEl) {
        this._labelTextEl.setAttribute('x', String(center));
        this._labelTextEl.setAttribute('y', String(center + this._size / 4));
        this._labelTextEl.textContent = this._label || '目标值';
      }
    }
  }

  _formatValue() {
    const formatted = this._precision > 0
      ? this._value.toFixed(this._precision)
      : String(Math.round(this._value));
    return formatted + this._valueSuffix;
  }

  /**
   * 设置当前值
   * @param {number} value - 数值
   * @returns {this}
   */
  value(value) {
    this._value = Math.max(this._min, Math.min(this._max, parseFloat(value) || 0));
    this._updateGauge();
    return this;
  }

  /**
   * 设置最小值
   * @param {number} min - 最小值
   * @returns {this}
   */
  min(min) {
    this._min = min;
    this._updateGauge();
    return this;
  }

  /**
   * 设置最大值
   * @param {number} max - 最大值
   * @returns {this}
   */
  max(max) {
    this._max = max;
    this._updateGauge();
    return this;
  }

  /**
   * 设置仪表盘尺寸
   * @param {number} size - 尺寸（像素）
   * @returns {this}
   */
  size(size) {
    this._size = size;
    return this;
  }

  /**
   * 设置进度条宽度
   * @param {number} width - 宽度（像素）
   * @returns {this}
   */
  strokeWidth(width) {
    this._strokeWidth = width;
    return this;
  }

  /**
   * 设置仪表盘类型
   * @param {string} type - 'semicircle' | 'circle'
   * @returns {this}
   */
  type(type) {
    this._type = type;
    return this;
  }

  /**
   * 设置是否显示数值
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showValue(show) {
    this._showValue = show;
    return this;
  }

  /**
   * 设置是否显示标签
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showLabel(show) {
    this._showLabel = show;
    return this;
  }

  /**
   * 设置标签文本
   * @param {string} label - 标签文本
   * @returns {this}
   */
  label(label) {
    this._label = label;
    return this;
  }

  /**
   * 设置数值后缀
   * @param {string} suffix - 后缀
   * @returns {this}
   */
  valueSuffix(suffix) {
    this._valueSuffix = suffix;
    this._updateGauge();
    return this;
  }

  /**
   * 设置数值精度
   * @param {number} precision - 小数位数
   * @returns {this}
   */
  precision(precision) {
    this._precision = precision;
    this._updateGauge();
    return this;
  }
}

/**
 * 创建 VGauge 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VGauge}
 */
function vGauge(setup = null) {
  return new VGauge(setup);
}

// ============================================
// VCircularProgress 环形进度条组件
// ============================================

/**
 * VCircularProgress 环形进度条组件
 * 简洁的环形进度条，使用 SVG 绘制
 * @class
 * @extends Tag
 */
class VCircularProgress extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._value = 0;
    this._max = 100;
    this._size = 120;
    this._strokeWidth = 8;
    this._showValue = true;
    this._showPercent = true;
    this._valueSuffix = '';
    this._precision = 0;
    this._svgEl = null;
    this._textEl = null;
    this._circumference = 0;

    this._setupBaseStyles();
    this._createSVG();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-circular-progress');
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    });
  }

  _createSVG() {
    const size = this._size;
    const center = size / 2;
    const radius = center - this._strokeWidth;
    this._circumference = 2 * Math.PI * radius;

    // 创建 SVG 容器
    this._svgEl = div(s => {
      s.addClass('yoya-circular-progress__svg');
      s.styles({
        display: 'block',
        width: `${size}px`,
        height: `${size}px`,
      });

      s.html(`
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg)">
          <circle class="yoya-circular-progress__track" cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--yoya-border)" stroke-width="${this._strokeWidth}"/>
          <circle class="yoya-circular-progress__progress" cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--yoya-primary)" stroke-width="${this._strokeWidth}" stroke-linecap="round" stroke-dasharray="${this._circumference} ${this._circumference}" stroke-dashoffset="${this._circumference}"/>
        </svg>
      `);
    });
    this._children.push(this._svgEl);

    // 创建文本
    if (this._showValue) {
      this._textEl = div(t => {
        t.addClass('yoya-circular-progress__value');
        t.styles({
          position: 'absolute',
          fontSize: `${this._size / 5}px`,
          fontWeight: '600',
          color: 'var(--yoya-text-primary)',
          lineHeight: '1',
        });
        t.text(this._formatValue());
      });
      this._children.push(this._textEl);
    }

    // 延迟获取 SVG 元素引用
    setTimeout(() => {
      const progressCircle = this._svgEl._el.querySelector('.yoya-circular-progress__progress');
      if (progressCircle) {
        this._progressCircle = progressCircle;
        this._updateProgress();
      }
    }, 0);
  }

  _updateProgress() {
    if (!this._progressCircle) return;

    const percent = Math.max(0, Math.min(1, this._value / this._max));
    const offset = this._circumference * (1 - percent);
    this._progressCircle.setAttribute('stroke-dashoffset', String(offset));

    if (this._textEl) {
      this._textEl.textContent(this._formatValue());
    }
  }

  _formatValue() {
    let value;
    if (this._showPercent) {
      const percent = (this._value / this._max * 100).toFixed(this._precision);
      value = `${percent}%`;
    } else {
      value = this._precision > 0
        ? this._value.toFixed(this._precision)
        : String(Math.round(this._value));
    }
    return value + this._valueSuffix;
  }

  /**
   * 设置当前值
   * @param {number} value - 数值
   * @returns {this}
   */
  value(value) {
    this._value = Math.max(0, Math.min(this._max, parseFloat(value) || 0));
    this._updateProgress();
    return this;
  }

  /**
   * 设置最大值
   * @param {number} max - 最大值
   * @returns {this}
   */
  max(max) {
    this._max = max;
    this._updateProgress();
    return this;
  }

  /**
   * 设置环形尺寸
   * @param {number} size - 尺寸（像素）
   * @returns {this}
   */
  size(size) {
    this._size = size;
    return this;
  }

  /**
   * 设置进度条宽度
   * @param {number} width - 宽度（像素）
   * @returns {this}
   */
  strokeWidth(width) {
    this._strokeWidth = width;
    return this;
  }

  /**
   * 设置是否显示数值
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showValue(show) {
    this._showValue = show;
    return this;
  }

  /**
   * 设置是否显示百分比
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showPercent(show) {
    this._showPercent = show;
    this._updateProgress();
    return this;
  }

  /**
   * 设置数值后缀
   * @param {string} suffix - 后缀
   * @returns {this}
   */
  valueSuffix(suffix) {
    this._valueSuffix = suffix;
    this._updateProgress();
    return this;
  }

  /**
   * 设置数值精度
   * @param {number} precision - 小数位数
   * @returns {this}
   */
  precision(precision) {
    this._precision = precision;
    this._updateProgress();
    return this;
  }
}

/**
 * 创建 VCircularProgress 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VCircularProgress}
 */
function vCircularProgress(setup = null) {
  return new VCircularProgress(setup);
}

// ============================================
// VIndicator 指标卡组件
// ============================================

/**
 * VIndicator 指标卡组件
 * 展示关键指标的卡片，包含图标、标题、数值、趋势
 * @class
 * @extends Tag
 */
class VIndicator extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._icon = null;
    this._title = '';
    this._value = 0;
    this._trend = 0;
    this._prefix = '';
    this._suffix = '';
    this._precision = 0;
    this._separator = ',';
    this._showTrend = true;
    this._trendPrecision = 1;
    this._iconEl = null;
    this._titleEl = null;
    this._valueEl = null;
    this._trendEl = null;

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-indicator');
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      background: 'var(--yoya-bg)',
      borderRadius: 'var(--yoya-radius-lg)',
      border: '1px solid var(--yoya-border-light)',
      gap: '12px',
      minWidth: '200px',
    });
  }

  _createInternalElements() {
    // 图标和标题行
    const headerRow = div(h => {
      h.styles({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      });

      // 图标
      this._iconEl = span(i => {
        i.addClass('yoya-indicator__icon');
        i.styles({
          fontSize: '24px',
        });
      });
      h.child(this._iconEl);

      // 标题
      this._titleEl = span(t => {
        t.addClass('yoya-indicator__title');
        t.styles({
          fontSize: '14px',
          color: 'var(--yoya-text-secondary)',
        });
      });
      h.child(this._titleEl);
    });
    this._children.push(headerRow);

    // 数值
    this._valueEl = div(v => {
      v.addClass('yoya-indicator__value');
      v.styles({
        fontSize: '32px',
        fontWeight: '700',
        color: 'var(--yoya-text-primary)',
        fontFamily: 'Monaco, Consolas, monospace',
        fontVariantNumeric: 'tabular-nums',
      });
    });
    this._children.push(this._valueEl);

    // 趋势
    this._trendEl = div(t => {
      t.addClass('yoya-indicator__trend');
      t.styles({
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '14px',
      });
    });
    this._children.push(this._trendEl);
  }

  _formatValue(num) {
    let formatted = this._precision > 0
      ? num.toFixed(this._precision)
      : String(Math.round(num));

    if (this._separator) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this._separator);
      formatted = parts.join('.');
    }

    return this._prefix + formatted + this._suffix;
  }

  _updateDisplay() {
    // 更新图标
    if (this._iconEl) {
      if (this._icon) {
        this._iconEl.textContent(this._icon);
        this._iconEl.style('display', '');
      } else {
        this._iconEl.style('display', 'none');
      }
    }

    // 更新标题
    if (this._titleEl) {
      this._titleEl.textContent(this._title);
    }

    // 更新数值
    if (this._valueEl) {
      this._valueEl.textContent(this._formatValue(this._value));
    }

    // 更新趋势
    if (this._trendEl) {
      if (this._showTrend) {
        this._trendEl.style('display', 'flex');
        const isPositive = this._trend > 0;
        const isNegative = this._trend < 0;
        const absValue = Math.abs(this._trend).toFixed(this._trendPrecision);

        if (isPositive) {
          this._trendEl.textContent(`↑ ${absValue}%`);
          this._trendEl.style('color', '#52c41a');
        } else if (isNegative) {
          this._trendEl.textContent(`↓ ${absValue}%`);
          this._trendEl.style('color', '#ff4d4f');
        } else {
          this._trendEl.textContent(`− ${absValue}%`);
          this._trendEl.style('color', 'var(--yoya-text-secondary)');
        }
      } else {
        this._trendEl.style('display', 'none');
      }
    }
  }

  /**
   * 设置图标（emoji 或字符）
   * @param {string} icon - 图标
   * @returns {this}
   */
  icon(icon) {
    this._icon = icon;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置标题
   * @param {string} title - 标题
   * @returns {this}
   */
  title(title) {
    this._title = title;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置数值
   * @param {number} value - 数值
   * @returns {this}
   */
  value(value) {
    this._value = parseFloat(value) || 0;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置趋势值（百分比）
   * @param {number} trend - 趋势值
   * @returns {this}
   */
  trend(trend) {
    this._trend = parseFloat(trend) || 0;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置数值前缀
   * @param {string} prefix - 前缀
   * @returns {this}
   */
  prefix(prefix) {
    this._prefix = prefix;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置数值后缀
   * @param {string} suffix - 后缀
   * @returns {this}
   */
  suffix(suffix) {
    this._suffix = suffix;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置数值精度
   * @param {number} precision - 小数位数
   * @returns {this}
   */
  precision(precision) {
    this._precision = precision;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置千分位分隔符
   * @param {string} separator - 分隔符
   * @returns {this}
   */
  separator(separator) {
    this._separator = separator;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置是否显示趋势
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showTrend(show) {
    this._showTrend = show;
    this._updateDisplay();
    return this;
  }

  /**
   * 设置趋势精度
   * @param {number} precision - 小数位数
   * @returns {this}
   */
  trendPrecision(precision) {
    this._trendPrecision = precision;
    this._updateDisplay();
    return this;
  }
}

/**
 * 创建 VIndicator 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VIndicator}
 */
function vIndicator(setup = null) {
  return new VIndicator(setup);
}

// ============================================
// VTimeSeries 时间序列卡片组件
// ============================================

/**
 * VTimeSeries 时间序列卡片组件
 * 展示按时间排列的数据序列
 * @class
 * @extends Tag
 */
class VTimeSeries extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._title = '';
    this._data = [];
    this._timeFormat = 'HH:mm';
    this._valuePrecision = 0;
    this._valuePrefix = '';
    this._valueSuffix = '';
    this._showValue = true;
    this._showTime = true;
    this._itemHeight = 40;
    this._maxItems = 10;
    this._titleEl = null;
    this._containerEl = null;

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-time-series');
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      background: 'var(--yoya-bg)',
      borderRadius: 'var(--yoya-radius-lg)',
      border: '1px solid var(--yoya-border-light)',
      overflow: 'hidden',
    });
  }

  _createInternalElements() {
    // 标题
    this._titleEl = div(t => {
      t.addClass('yoya-time-series__title');
      t.styles({
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--yoya-text-primary)',
        marginBottom: '12px',
      });
    });
    this._children.push(this._titleEl);

    // 数据容器
    this._containerEl = div(c => {
      c.addClass('yoya-time-series__container');
      c.styles({
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: '1',
        overflowY: 'auto',
      });
    });
    this._children.push(this._containerEl);
  }

  _formatTime(date) {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    switch (this._timeFormat) {
      case 'HH:mm':
        return `${hours}:${minutes}`;
      case 'HH:mm:ss':
        return `${hours}:${minutes}:${seconds}`;
      case 'YYYY-MM-DD HH:mm':
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${hours}:${minutes}`;
      default:
        return `${hours}:${minutes}`;
    }
  }

  _formatValue(value) {
    let formatted = this._valuePrecision > 0
      ? value.toFixed(this._valuePrecision)
      : String(Math.round(value));

    return this._valuePrefix + formatted + this._valueSuffix;
  }

  _renderItems() {
    if (!this._containerEl) return;

    // 清空容器
    this._containerEl._children = [];
    this._containerEl.clear();

    const items = this._data.slice(0, this._maxItems);

    items.forEach((item, index) => {
      const row = div(r => {
        r.addClass('yoya-time-series__item');
        r.styles({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: index % 2 === 0 ? 'var(--yoya-bg-secondary)' : 'transparent',
          borderRadius: 'var(--yoya-radius-md)',
          height: `${this._itemHeight}px`,
        });

        // 时间
        if (this._showTime) {
          const timeEl = span(t => {
            t.addClass('yoya-time-series__time');
            t.styles({
              fontSize: '13px',
              color: 'var(--yoya-text-secondary)',
            });
            t.text(this._formatTime(item.time));
          });
          r.child(timeEl);
        }

        // 数值
        if (this._showValue) {
          const valueEl = span(v => {
            v.addClass('yoya-time-series__value');
            v.styles({
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--yoya-text-primary)',
              fontFamily: 'Monaco, Consolas, monospace',
              fontVariantNumeric: 'tabular-nums',
            });
            v.text(this._formatValue(item.value));
          });
          r.child(valueEl);
        }
      });
      this._containerEl.child(row);
    });
  }

  /**
   * 设置标题
   * @param {string} title - 标题
   * @returns {this}
   */
  title(title) {
    this._title = title;
    if (this._titleEl) {
      this._titleEl.textContent(title);
    }
    return this;
  }

  /**
   * 设置数据
   * @param {Array<{time: Date|string, value: number}>} data - 数据数组
   * @returns {this}
   */
  data(data) {
    this._data = data || [];
    this._renderItems();
    return this;
  }

  /**
   * 添加数据项
   * @param {{time: Date|string, value: number}} item - 数据项
   * @returns {this}
   */
  addItem(item) {
    this._data.push(item);
    if (this._data.length > this._maxItems) {
      this._data.shift();
    }
    this._renderItems();
    return this;
  }

  /**
   * 设置时间格式
   * @param {string} format - 格式：HH:mm, HH:mm:ss, YYYY-MM-DD HH:mm
   * @returns {this}
   */
  timeFormat(format) {
    this._timeFormat = format;
    this._renderItems();
    return this;
  }

  /**
   * 设置数值精度
   * @param {number} precision - 小数位数
   * @returns {this}
   */
  valuePrecision(precision) {
    this._valuePrecision = precision;
    this._renderItems();
    return this;
  }

  /**
   * 设置数值前缀
   * @param {string} prefix - 前缀
   * @returns {this}
   */
  valuePrefix(prefix) {
    this._valuePrefix = prefix;
    this._renderItems();
    return this;
  }

  /**
   * 设置数值后缀
   * @param {string} suffix - 后缀
   * @returns {this}
   */
  valueSuffix(suffix) {
    this._valueSuffix = suffix;
    this._renderItems();
    return this;
  }

  /**
   * 设置是否显示数值
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showValue(show) {
    this._showValue = show;
    this._renderItems();
    return this;
  }

  /**
   * 设置是否显示时间
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showTime(show) {
    this._showTime = show;
    this._renderItems();
    return this;
  }

  /**
   * 设置最大显示项数
   * @param {number} max - 最大项数
   * @returns {this}
   */
  maxItems(max) {
    this._maxItems = max;
    this._renderItems();
    return this;
  }

  /**
   * 设置每项高度
   * @param {number} height - 高度（像素）
   * @returns {this}
   */
  itemHeight(height) {
    this._itemHeight = height;
    this._renderItems();
    return this;
  }
}

/**
 * 创建 VTimeSeries 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VTimeSeries}
 */
function vTimeSeries(setup = null) {
  return new VTimeSeries(setup);
}

// ============================================
// VRankList 排行榜组件
// ============================================

/**
 * VRankList 排行榜组件
 * 展示排名列表，支持自定义排名样式
 * @class
 * @extends Tag
 */
class VRankList extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._title = '';
    this._data = [];
    this._showRank = true;
    this._showValue = true;
    this._valuePrecision = 0;
    this._valuePrefix = '';
    this._valueSuffix = '';
    this._separator = '';
    this._topThreeColors = ['#ff4d4f', '#ff7a45', '#ffa940'];
    this._rankColor = 'var(--yoya-text-secondary)';
    this._maxItems = 10;
    this._titleEl = null;
    this._containerEl = null;

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-rank-list');
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      background: 'var(--yoya-bg)',
      borderRadius: 'var(--yoya-radius-lg)',
      border: '1px solid var(--yoya-border-light)',
      overflow: 'hidden',
    });
  }

  _createInternalElements() {
    // 标题
    this._titleEl = div(t => {
      t.addClass('yoya-rank-list__title');
      t.styles({
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--yoya-text-primary)',
        marginBottom: '12px',
      });
    });
    this._children.push(this._titleEl);

    // 列表容器
    this._containerEl = div(c => {
      c.addClass('yoya-rank-list__container');
      c.styles({
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: '1',
      });
    });
    this._children.push(this._containerEl);
  }

  _formatValue(value) {
    let formatted = this._valuePrecision > 0
      ? value.toFixed(this._valuePrecision)
      : String(Math.round(value));

    // 如果有分隔符，添加千分位分隔
    if (this._separator) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this._separator);
      formatted = parts.join('.');
    }

    return this._valuePrefix + formatted + this._valueSuffix;
  }

  _renderItems() {
    if (!this._containerEl) return;

    // 清空容器
    this._containerEl._children = [];
    this._containerEl.clear();

    const items = this._data.slice(0, this._maxItems);

    items.forEach((item, index) => {
      const rank = index + 1;
      const isTopThree = rank <= 3;

      const row = div(r => {
        r.addClass('yoya-rank-list__item');
        r.styles({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 12px',
          background: isTopThree ? 'var(--yoya-bg-secondary)' : 'transparent',
          borderRadius: 'var(--yoya-radius-md)',
        });

        // 排名
        if (this._showRank) {
          const rankEl = span(e => {
            e.addClass('yoya-rank-list__rank');
            e.styles({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600',
              color: isTopThree ? '#fff' : this._rankColor,
              background: isTopThree ? this._topThreeColors[index] : 'transparent',
            });
            e.text(String(rank));
          });
          r.child(rankEl);
        }

        // 名称
        const nameEl = span(n => {
          n.addClass('yoya-rank-list__name');
          n.styles({
            flex: '1',
            fontSize: '14px',
            color: 'var(--yoya-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          });
          n.text(item.name);
        });
        r.child(nameEl);

        // 数值
        if (this._showValue) {
          const valueEl = span(v => {
            v.addClass('yoya-rank-list__value');
            v.styles({
              fontSize: '14px',
              fontWeight: '600',
              color: isTopThree ? this._topThreeColors[index] : 'var(--yoya-text-primary)',
              fontFamily: 'Monaco, Consolas, monospace',
              fontVariantNumeric: 'tabular-nums',
            });
            v.text(this._formatValue(item.value));
          });
          r.child(valueEl);
        }
      });
      this._containerEl.child(row);
    });
  }

  /**
   * 设置标题
   * @param {string} title - 标题
   * @returns {this}
   */
  title(title) {
    this._title = title;
    if (this._titleEl) {
      this._titleEl.textContent(title);
    }
    return this;
  }

  /**
   * 设置数据
   * @param {Array<{name: string, value: number}>} data - 数据数组（按值降序排列）
   * @returns {this}
   */
  data(data) {
    this._data = data || [];
    this._renderItems();
    return this;
  }

  /**
   * 设置是否显示排名
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showRank(show) {
    this._showRank = show;
    this._renderItems();
    return this;
  }

  /**
   * 设置是否显示数值
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showValue(show) {
    this._showValue = show;
    this._renderItems();
    return this;
  }

  /**
   * 设置数值精度
   * @param {number} precision - 小数位数
   * @returns {this}
   */
  valuePrecision(precision) {
    this._valuePrecision = precision;
    this._renderItems();
    return this;
  }

  /**
   * 设置数值前缀
   * @param {string} prefix - 前缀
   * @returns {this}
   */
  valuePrefix(prefix) {
    this._valuePrefix = prefix;
    this._renderItems();
    return this;
  }

  /**
   * 设置数值后缀
   * @param {string} suffix - 后缀
   * @returns {this}
   */
  valueSuffix(suffix) {
    this._valueSuffix = suffix;
    this._renderItems();
    return this;
  }

  /**
   * 设置数值后缀（别名）
   * @param {string} suffix - 后缀
   * @returns {this}
   */
  suffix(suffix) {
    this._valueSuffix = suffix;
    this._renderItems();
    return this;
  }

  /**
   * 设置前三名颜色
   * @param {Array<string>} colors - 颜色数组 [第一名，第二名，第三名]
   * @returns {this}
   */
  topThreeColors(colors) {
    this._topThreeColors = colors;
    this._renderItems();
    return this;
  }

  /**
   * 设置最大显示项数
   * @param {number} max - 最大项数
   * @returns {this}
   */
  maxItems(max) {
    this._maxItems = max;
    this._renderItems();
    return this;
  }

  /**
   * 设置千分位分隔符
   * @param {string} separator - 分隔符
   * @returns {this}
   */
  separator(separator) {
    this._separator = separator;
    this._renderItems();
    return this;
  }
}

/**
 * 创建 VRankList 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VRankList}
 */
function vRankList(setup = null) {
  return new VRankList(setup);
}

// ============================================
// VDashboardGrid 看板栅格布局组件
// ============================================

/**
 * VDashboardGrid 看板栅格布局组件
 * 响应式栅格布局，专为大屏看板设计
 * @class
 * @extends Tag
 */
class VDashboardGrid extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._columns = 12;
    this._gap = 16;
    this._minColumnWidth = 200;
    this._autoFit = true;

    this._setupBaseStyles();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-dashboard-grid');
    this.styles({
      display: 'grid',
      gridTemplateColumns: `repeat(${this._columns}, 1fr)`,
      gap: `${this._gap}px`,
      padding: `${this._gap}px`,
      background: 'var(--yoya-bg-secondary)',
      borderRadius: 'var(--yoya-radius-lg)',
    });
  }

  /**
   * 设置列数
   * @param {number} columns - 列数
   * @returns {this}
   */
  columns(columns) {
    this._columns = columns;
    this.style('gridTemplateColumns', `repeat(${columns}, 1fr)`);
    return this;
  }

  /**
   * 设置间距
   * @param {number} gap - 间距（像素）
   * @returns {this}
   */
  gap(gap) {
    this._gap = gap;
    this.style('gap', `${gap}px`);
    this.style('padding', `${gap}px`);
    return this;
  }

  /**
   * 设置最小列宽
   * @param {number} width - 宽度（像素）
   * @returns {this}
   */
  minColumnWidth(width) {
    this._minColumnWidth = width;
    return this;
  }

  /**
   * 设置是否自动适配
   * @param {boolean} autoFit - 是否自动适配
   * @returns {this}
   */
  autoFit(autoFit) {
    this._autoFit = autoFit;
    return this;
  }

  /**
   * 添加子元素
   * @param {Tag} child - 子元素
   * @param {number} [span=1] - 占据列数
   * @returns {this}
   */
  addChild(child, span = 1) {
    if (child instanceof Tag) {
      child.styles({
        gridColumn: `span ${span}`,
        background: 'var(--yoya-bg)',
        borderRadius: 'var(--yoya-radius-md)',
        padding: '16px',
      });
      this._children.push(child);
    }
    return this;
  }
}

/**
 * 创建 VDashboardGrid 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VDashboardGrid}
 */
function vDashboardGrid(setup = null) {
  return new VDashboardGrid(setup);
}

// ============================================
// 导出
// ============================================

export {
  VNumberScroll,
  vNumberScroll,
  VTrend,
  vTrend,
  VGauge,
  vGauge,
  VCircularProgress,
  vCircularProgress,
  VIndicator,
  vIndicator,
  VTimeSeries,
  vTimeSeries,
  VRankList,
  vRankList,
  VDashboardGrid,
  vDashboardGrid,
};
