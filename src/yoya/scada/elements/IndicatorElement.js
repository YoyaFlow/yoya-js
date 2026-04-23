/**
 * @fileoverview IndicatorElement 指示灯元素
 * 用于显示状态指示灯（红/黄/绿等）
 */

import { Element } from './Element.js';

class IndicatorElement extends Element {
  constructor(id, options = {}) {
    super(id, options);
    this.type = 'indicator';

    // 颜色配置
    this.colors = {
      red: options.redColor || '#cc3333',
      yellow: options.yellowColor || '#cccc33',
      green: options.greenColor || '#33cc33',
      gray: options.grayColor || '#999999'
    };

    // 当前状态：off, red, yellow, green
    this.status = options.status || 'off';

    // 闪烁配置
    this.blinking = options.blinking ?? false;
    this.blinkInterval = options.blinkInterval ?? 500;
    this._blinkState = true;
    this._blinkTimerId = null;

    // 标签
    this.showLabel = options.showLabel ?? true;
    this.label = options.label || '';
    this.labelPosition = options.labelPosition || 'bottom'; // bottom, top, left, right
    this.labelColor = options.labelColor || '#333333';
    this.fontSize = options.fontSize ?? 12;
  }

  /**
   * 设置状态
   * @param {'off'|'red'|'yellow'|'green'} status
   * @returns {this}
   */
  setStatus(status) {
    this.status = status;
    this.emit('change', { type: 'statusChange', status });
    return this;
  }

  /**
   * 设置闪烁
   * @param {boolean} blinking
   * @returns {this}
   */
  setBlinking(blinking) {
    this.blinking = blinking;
    if (blinking && !this._blinkTimerId) {
      this._startBlink();
    } else if (!blinking && this._blinkTimerId) {
      this._stopBlink();
    }
    this.emit('change', { type: 'blinkingChange', blinking });
    return this;
  }

  /**
   * 启动闪烁
   * @private
   */
  _startBlink() {
    this._blinkTimerId = setInterval(() => {
      this._blinkState = !this._blinkState;
      this.emit('change', { type: 'blink', state: this._blinkState });
    }, this.blinkInterval);
  }

  /**
   * 停止闪烁
   * @private
   */
  _stopBlink() {
    if (this._blinkTimerId) {
      clearInterval(this._blinkTimerId);
      this._blinkTimerId = null;
    }
    this._blinkState = true;
  }

  /**
   * 获取当前颜色
   * @private
   * @returns {string}
   */
  _getCurrentColor() {
    if (!this.enabled) return this.colors.gray;
    if (this.blinking && !this._blinkState) return 'transparent';

    switch (this.status) {
      case 'red': return this.colors.red;
      case 'yellow': return this.colors.yellow;
      case 'green': return this.colors.green;
      default: return this.colors.gray;
    }
  }

  /**
   * 数据更新时更新状态
   * @override
   */
  onDataUpdate(value) {
    // 支持布尔值或状态字符串
    if (typeof value === 'boolean') {
      this.setStatus(value ? 'green' : 'off');
    } else if (typeof value === 'string') {
      this.setStatus(value);
    }
  }

  /**
   * @override
   */
  render(ctx, viewport, parentBounds) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    const worldX = parentBounds.minX + this.x;
    const worldY = parentBounds.minY + this.y;
    const w = this.width;
    const h = this.height;

    // 计算指示灯中心
    const centerX = worldX + w / 2;
    const centerY = worldY + h / 2;
    const radius = Math.min(w, h) / 2 - 4;

    // 绘制外圈
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 3, 0, Math.PI * 2);
    ctx.fillStyle = '#666666';
    ctx.fill();

    // 绘制指示灯
    const color = this._getCurrentColor();
    if (color !== 'transparent') {
      // 创建渐变效果
      const gradient = ctx.createRadialGradient(
        centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.1,
        centerX, centerY, radius
      );
      gradient.addColorStop(0, this._lightenColor(color, 40));
      gradient.addColorStop(1, color);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 添加高光
      ctx.beginPath();
      ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
    }

    // 绘制边框
    ctx.strokeStyle = this.strokeColor || '#333333';
    ctx.lineWidth = this.strokeWidth || 1;
    ctx.stroke();

    // 绘制标签
    if (this.showLabel && this.label) {
      ctx.fillStyle = this.labelColor;
      ctx.font = `${this.fontSize}px ${this.fontFamily || 'Arial'}`;
      ctx.textAlign = 'center';

      let labelX = centerX;
      let labelY;

      switch (this.labelPosition) {
        case 'top':
          labelY = worldY - 4;
          ctx.textBaseline = 'bottom';
          break;
        case 'left':
          labelX = worldX - 4;
          labelY = centerY;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          break;
        case 'right':
          labelX = worldX + w + 4;
          labelY = centerY;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          break;
        default: // bottom
          labelY = worldY + h + this.fontSize;
          ctx.textBaseline = 'top';
      }

      ctx.fillText(this.label, labelX, labelY);
    }

    // 选中效果
    if (this.selected) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#0066cc';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  /**
   *  lighten 颜色
   * @private
   * @param {string} color - 颜色字符串
   * @param {number} amount - 变亮程度 (0-255)
   * @returns {string}
   */
  _lightenColor(color, amount) {
    // 解析十六进制颜色
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `rgb(${r},${g},${b})`;
  }

  /**
   * @override
   */
  toJSON() {
    return {
      ...super.toJSON(),
      colors: this.colors,
      status: this.status,
      blinking: this.blinking,
      blinkInterval: this.blinkInterval,
      showLabel: this.showLabel,
      label: this.label,
      labelPosition: this.labelPosition,
      labelColor: this.labelColor,
      fontSize: this.fontSize
    };
  }

  /**
   * @override
   */
  static fromJSON(data) {
    return new IndicatorElement(data.id, {
      name: data.name,
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height,
      fillColor: data.fillColor,
      strokeColor: data.strokeColor,
      strokeWidth: data.strokeWidth,
      opacity: data.opacity,
      visible: data.visible,
      locked: data.locked,
      redColor: data.colors?.red,
      yellowColor: data.colors?.yellow,
      greenColor: data.colors?.green,
      grayColor: data.colors?.gray,
      status: data.status,
      blinking: data.blinking,
      blinkInterval: data.blinkInterval,
      showLabel: data.showLabel,
      label: data.label,
      labelPosition: data.labelPosition,
      labelColor: data.labelColor,
      fontSize: data.fontSize
    });
  }

  /**
   * @override
   */
  destroy() {
    this._stopBlink();
    super.destroy?.();
  }
}

export { IndicatorElement };
