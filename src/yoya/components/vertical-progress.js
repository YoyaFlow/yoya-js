/**
 * Yoya.Basic - VVerticalProgress 纵向进度条组件
 * 用于显示料位、重量等工业场景的纵向进度指示
 * 支持预警、报警双阈值
 */

import { Tag, div, span } from '../core/basic.js';

/**
 * VVerticalProgress 纵向进度条组件
 * @class
 * @extends Tag
 */
class VVerticalProgress extends Tag {
  static _stateAttrs = ['value', 'warning', 'alarm'];

  constructor(setup = null) {
    super('div', null);

    // 状态值
    this._value = 0;          // 当前值
    this._min = 0;            // 最小值
    this._max = 100;          // 最大值
    this._unit = '%';         // 单位

    // 阈值
    this._warningThreshold = 70;  // 预警阈值（百分比或绝对值）
    this._alarmThreshold = 90;    // 报警阈值（百分比或绝对值）
    this._thresholdMode = 'percent'; // 'percent' 或 'absolute'

    // 显示配置
    this._showValue = true;       // 显示当前值
    this._showLabel = true;       // 显示标签
    this._showUnit = true;        // 显示单位
    this._displayMode = 'percent'; // 'percent' 或 'absolute'

    // 颜色配置
    this._normalColor = '#52c41a';   // 正常 - 绿色
    this._warningColor = '#faad14';  // 预警 - 橙色
    this._alarmColor = '#ff4d4f';    // 报警 - 红色

    // 尺寸配置
    this._width = 60;
    this._height = 200;
    this._barWidth = 40;
    this._borderRadius = 4;

    // 标签
    this._label = '';
    this._name = '';

    // 内部元素引用
    this._containerEl = null;
    this._trackEl = null;
    this._fillEl = null;
    this._valueEl = null;
    this._labelEl = null;
    this._warningLineEl = null;
    this._alarmLineEl = null;

    // 注册状态
    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ value: 0, warning: false, alarm: false });

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-vertical-progress');
    this.styles({
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    });
  }

  _createInternalElements() {
    // 进度条容器
    this._containerEl = div(c => {
      c.addClass('yoya-vertical-progress__container');
      c.styles({
        position: 'relative',
        width: `${this._width}px`,
        height: `${this._height}px`,
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: `${this._borderRadius}px`,
        overflow: 'hidden',
      });

      // 轨道
      this._trackEl = div(t => {
        t.addClass('yoya-vertical-progress__track');
        t.styles({
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'var(--yoya-border)',
          borderRadius: `${this._borderRadius}px`,
        });
      });
      c.child(this._trackEl);

      // 填充条
      this._fillEl = div(f => {
        f.addClass('yoya-vertical-progress__fill');
        f.styles({
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: `${this._barWidth}px`,
          height: '0%',
          background: this._normalColor,
          borderRadius: `${this._borderRadius}px`,
          transition: 'height 0.3s ease, background-color 0.3s ease',
          margin: '0 auto',
        });
      });
      c.child(this._fillEl);

      // 预警线
      this._warningLineEl = div(w => {
        w.addClass('yoya-vertical-progress__warning-line');
        w.styles({
          position: 'absolute',
          left: '0',
          width: '100%',
          height: '2px',
          background: this._warningColor,
          opacity: '0.7',
          zIndex: '2',
        });
      });
      c.child(this._warningLineEl);

      // 报警线
      this._alarmLineEl = div(a => {
        a.addClass('yoya-vertical-progress__alarm-line');
        a.styles({
          position: 'absolute',
          left: '0',
          width: '100%',
          height: '2px',
          background: this._alarmColor,
          opacity: '0.8',
          zIndex: '2',
        });
      });
      c.child(this._alarmLineEl);
    });
    // 在 setup 回调外添加容器到子元素
    this._children.push(this._containerEl);

    // 标签
    if (this._label || this._name) {
      this._labelEl = div(l => {
        l.addClass('yoya-vertical-progress__label');
        l.styles({
          fontSize: '12px',
          color: 'var(--yoya-text-secondary)',
          textAlign: 'center',
        });
        l.textContent(this._label || this._name);
      });
      this._children.push(this._labelEl);
    }

    // 数值显示
    if (this._showValue) {
      this._valueEl = div(v => {
        v.addClass('yoya-vertical-progress__value');
        v.styles({
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--yoya-text-primary)',
          fontFamily: 'Monaco, Consolas, monospace',
        });
        v.textContent(this._formatValue());
      });
      this._children.push(this._valueEl);
    }

    // 初始更新
    this._updateProgress();
  }

  _getValueInRange() {
    return Math.max(this._min, Math.min(this._max, this._value));
  }

  _getPercent() {
    const range = this._max - this._min;
    if (range === 0) return 0;
    return ((this._getValueInRange() - this._min) / range) * 100;
  }

  _getThresholdPercent(threshold) {
    if (this._thresholdMode === 'absolute') {
      const range = this._max - this._min;
      if (range === 0) return 0;
      return ((threshold - this._min) / range) * 100;
    }
    return threshold;
  }

  _getStatus() {
    const percent = this._getPercent();
    const warningThreshold = this._thresholdMode === 'absolute'
      ? this._getThresholdPercent(this._warningThreshold)
      : this._warningThreshold;
    const alarmThreshold = this._thresholdMode === 'absolute'
      ? this._getThresholdPercent(this._alarmThreshold)
      : this._alarmThreshold;

    if (percent >= alarmThreshold) {
      this.setState('alarm', true);
      this.setState('warning', false);
      return 'alarm';
    } else if (percent >= warningThreshold) {
      this.setState('alarm', false);
      this.setState('warning', true);
      return 'warning';
    } else {
      this.setState('alarm', false);
      this.setState('warning', false);
      return 'normal';
    }
  }

  _getColor() {
    const status = this._getStatus();
    switch (status) {
      case 'alarm':
        return this._alarmColor;
      case 'warning':
        return this._warningColor;
      default:
        return this._normalColor;
    }
  }

  _formatValue() {
    if (this._displayMode === 'absolute') {
      const value = this._getValueInRange();
      return `${value}${this._showUnit ? this._unit : ''}`;
    }
    return `${this._getPercent().toFixed(1)}${this._showUnit ? '%' : ''}`;
  }

  _updateProgress() {
    if (!this._fillEl || !this._containerEl) return;

    const percent = this._getPercent();
    const color = this._getColor();

    // 更新填充条高度
    this._fillEl.style('height', `${percent}%`);
    this._fillEl.style('background', color);
    this._fillEl.style('left', `${(this._width - this._barWidth) / 2}px`);

    // 更新预警线位置
    if (this._warningLineEl) {
      const warningPercent = this._getThresholdPercent(this._warningThreshold);
      this._warningLineEl.style('bottom', `${warningPercent}%`);
      this._warningLineEl.style('background', this._warningColor);
    }

    // 更新报警线位置
    if (this._alarmLineEl) {
      const alarmPercent = this._getThresholdPercent(this._alarmThreshold);
      this._alarmLineEl.style('bottom', `${alarmPercent}%`);
      this._alarmLineEl.style('background', this._alarmColor);
    }

    // 更新数值显示
    if (this._valueEl) {
      this._valueEl.textContent(this._formatValue());
      this._valueEl.style('color', color);
    }
  }

  // ============================================
  // API 方法
  // ============================================

  /**
   * 设置当前值
   * @param {number} value - 当前值
   * @returns {this}
   */
  value(value) {
    this._value = parseFloat(value) || 0;
    this._updateProgress();
    return this;
  }

  /**
   * 设置范围最小值
   * @param {number} min - 最小值
   * @returns {this}
   */
  min(min) {
    this._min = min;
    this._updateProgress();
    return this;
  }

  /**
   * 设置范围最大值
   * @param {number} max - 最大值
   * @returns {this}
   */
  max(max) {
    this._max = max;
    this._updateProgress();
    return this;
  }

  /**
   * 设置单位
   * @param {string} unit - 单位
   * @returns {this}
   */
  unit(unit) {
    this._unit = unit;
    this._updateProgress();
    return this;
  }

  /**
   * 设置高度
   * @param {number} height - 高度
   * @returns {this}
   */
  height(height) {
    this._height = height;
    if (this._containerEl) {
      this._containerEl.style('height', `${height}px`);
    }
    return this;
  }

  /**
   * 设置宽度
   * @param {number} width - 宽度
   * @returns {this}
   */
  width(width) {
    this._width = width;
    if (this._containerEl) {
      this._containerEl.style('width', `${width}px`);
    }
    return this;
  }

  /**
   * 设置预警阈值
   * @param {number} threshold - 阈值
   * @returns {this}
   */
  warning(threshold) {
    this._warningThreshold = threshold;
    this._updateProgress();
    return this;
  }

  /**
   * 设置报警阈值
   * @param {number} threshold - 阈值
   * @returns {this}
   */
  alarm(threshold) {
    this._alarmThreshold = threshold;
    this._updateProgress();
    return this;
  }

  /**
   * 设置阈值模式
   * @param {'percent' | 'absolute'} mode - 模式
   * @returns {this}
   */
  thresholdMode(mode) {
    this._thresholdMode = mode;
    this._updateProgress();
    return this;
  }

  /**
   * 设置显示模式
   * @param {'percent' | 'absolute'} mode - 模式
   * @returns {this}
   */
  displayMode(mode) {
    this._displayMode = mode;
    this._updateProgress();
    return this;
  }

  /**
   * 设置是否显示数值
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showValue(show) {
    this._showValue = show;
    if (!show && this._valueEl) {
      this._valueEl.style('display', 'none');
    } else if (show && this._valueEl) {
      this._valueEl.style('display', '');
    }
    return this;
  }

  /**
   * 设置是否显示标签
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showLabel(show) {
    this._showLabel = show;
    if (!show && this._labelEl) {
      this._labelEl.style('display', 'none');
    } else if (show && this._labelEl) {
      this._labelEl.style('display', '');
    }
    return this;
  }

  /**
   * 设置是否显示单位
   * @param {boolean} show - 是否显示
   * @returns {this}
   */
  showUnit(show) {
    this._showUnit = show;
    this._updateProgress();
    return this;
  }

  /**
   * 设置标签文本
   * @param {string} label - 标签
   * @returns {this}
   */
  label(label) {
    this._label = label;
    if (this._labelEl) {
      // 标签元素已存在，更新文本
      this._labelEl.textContent(label);
    } else {
      // 标签元素不存在，创建它
      this._labelEl = div(l => {
        l.addClass('yoya-vertical-progress__label');
        l.styles({
          fontSize: '12px',
          color: 'var(--yoya-text-secondary)',
          textAlign: 'center',
        });
        l.textContent(label);
      });
      // 在容器之后、数值之前插入标签元素
      const valueIndex = this._children.findIndex(c => c === this._valueEl);
      if (valueIndex >= 0) {
        this._children.splice(valueIndex, 0, this._labelEl);
      } else {
        this._children.push(this._labelEl);
      }
    }
    return this;
  }

  /**
   * 设置名称
   * @param {string} name - 名称
   * @returns {this}
   */
  name(name) {
    this._name = name;
    if (this._labelEl && !this._label) {
      this._labelEl.textContent(name);
    }
    return this;
  }

  /**
   * 设置尺寸
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @returns {this}
   */
  size(width, height) {
    this._width = width;
    this._height = height;
    if (this._containerEl) {
      this._containerEl.styles({
        width: `${width}px`,
        height: `${height}px`,
      });
    }
    return this;
  }

  /**
   * 设置进度条宽度
   * @param {number} width - 宽度
   * @returns {this}
   */
  barWidth(width) {
    this._barWidth = width;
    this._updateProgress();
    return this;
  }

  /**
   * 设置圆角
   * @param {number} radius - 圆角
   * @returns {this}
   */
  borderRadius(radius) {
    this._borderRadius = radius;
    return this;
  }

  /**
   * 设置颜色
   * @param {string} normal - 正常颜色
   * @param {string} warning - 预警颜色
   * @param {string} alarm - 报警颜色
   * @returns {this}
   */
  colors(normal, warning, alarm) {
    this._normalColor = normal;
    this._warningColor = warning;
    this._alarmColor = alarm;
    this._updateProgress();
    return this;
  }

  /**
   * 设置正常颜色
   * @param {string} color - 颜色
   * @returns {this}
   */
  normalColor(color) {
    this._normalColor = color;
    this._updateProgress();
    return this;
  }

  /**
   * 设置预警颜色
   * @param {string} color - 颜色
   * @returns {this}
   */
  warningColor(color) {
    this._warningColor = color;
    this._updateProgress();
    return this;
  }

  /**
   * 设置报警颜色
   * @param {string} color - 颜色
   * @returns {this}
   */
  alarmColor(color) {
    this._alarmColor = color;
    this._updateProgress();
    return this;
  }

  /**
   * 获取当前状态
   * @returns {'normal' | 'warning' | 'alarm'}
   */
  getStatus() {
    return this._getStatus();
  }

  /**
   * 获取当前百分比
   * @returns {number}
   */
  getPercent() {
    return this._getPercent();
  }
}

/**
 * 创建 VVerticalProgress 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VVerticalProgress}
 */
function vVerticalProgress(setup = null) {
  return new VVerticalProgress(setup);
}

// ============================================
// 导出
// ============================================

export {
  VVerticalProgress,
  vVerticalProgress,
};
