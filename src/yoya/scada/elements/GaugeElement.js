/**
 * @fileoverview GaugeElement 仪表盘元素
 * 用于显示模拟仪表盘（圆形进度条）
 */

import { Element } from './Element.js';

class GaugeElement extends Element {
  constructor(id, options = {}) {
    super(id, options);
    this.type = 'gauge';

    // 仪表盘配置
    this.minValue = options.minValue ?? 0;
    this.maxValue = options.maxValue ?? 100;
    this.value = options.value ?? 0;

    // 范围颜色（可选）
    this.ranges = options.ranges || [
      { min: 0, max: 30, color: '#33cc33' },    // 绿色：安全区
      { min: 30, max: 70, color: '#cccc33' },   // 黄色：警告区
      { min: 70, max: 100, color: '#cc3333' }   // 红色：危险区
    ];

    // 样式
    this.gaugeColor = options.gaugeColor || '#0066cc';
    this.bgColor = options.bgColor || '#e0e0e0';
    this.showLabel = options.showLabel ?? true;
    this.showValue = options.showValue ?? true;
    this.unit = options.unit || '';
    this.decimals = options.decimals ?? 0;

    // 指针样式
    this.pointerColor = options.pointerColor || '#333333';
    this.pointerLength = options.pointerLength ?? 0.8; // 相对于半径的比例

    // 弧形范围（默认 270 度）
    this.startAngle = options.startAngle ?? (Math.PI * 0.75); // 225 度
    this.endAngle = options.endAngle ?? (Math.PI * 2.25);     // 405 度
  }

  /**
   * 设置值
   * @param {number} value
   * @returns {this}
   */
  setValue(value) {
    this.value = Math.max(this.minValue, Math.min(this.maxValue, value));
    this.emit('change', { type: 'valueChange', value: this.value });
    return this;
  }

  /**
   * 设置范围
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {this}
   */
  setRange(min, max) {
    this.minValue = min;
    this.maxValue = max;
    this.emit('change', { type: 'rangeChange', min, max });
    return this;
  }

  /**
   * 数据更新时更新值
   * @override
   */
  onDataUpdate(value) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      this.setValue(numValue);
    }
  }

  /**
   * 获取当前值对应的颜色
   * @private
   * @returns {string}
   */
  _getValueColor() {
    for (const range of this.ranges) {
      if (this.value >= range.min && this.value < range.max) {
        return range.color;
      }
    }
    return this.gaugeColor;
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
    const centerX = worldX + this.width / 2;
    const centerY = worldY + this.height / 2;
    const radius = Math.min(this.width, this.height) / 2 - 10;

    // 绘制背景圆盘
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
    ctx.fillStyle = this.bgColor;
    ctx.fill();
    ctx.strokeStyle = this.strokeColor || '#999999';
    ctx.lineWidth = this.strokeWidth || 1;
    ctx.stroke();

    // 绘制范围颜色（如果有定义）
    if (this.ranges && this.ranges.length > 0) {
      const totalRange = this.maxValue - this.minValue;
      const angleRange = this.endAngle - this.startAngle;

      for (const range of this.ranges) {
        const rangeStartAngle = this.startAngle + (range.min - this.minValue) / totalRange * angleRange;
        const rangeEndAngle = this.startAngle + (range.max - this.minValue) / totalRange * angleRange;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 5, rangeStartAngle, rangeEndAngle);
        ctx.strokeStyle = range.color;
        ctx.lineWidth = 8;
        ctx.stroke();
      }
    }

    // 计算指针角度
    const normalizedValue = (this.value - this.minValue) / (this.maxValue - this.minValue);
    const pointerAngle = this.startAngle + normalizedValue * (this.endAngle - this.startAngle);

    // 绘制主弧形（当前值）
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 5, this.startAngle, pointerAngle);
    ctx.strokeStyle = this._getValueColor();
    ctx.lineWidth = 8;
    ctx.stroke();

    // 绘制刻度
    this._renderTicks(ctx, centerX, centerY, radius);

    // 绘制指针
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    const pointerLen = radius * this.pointerLength;
    ctx.lineTo(
      centerX + Math.cos(pointerAngle) * pointerLen,
      centerY + Math.sin(pointerAngle) * pointerLen
    );
    ctx.strokeStyle = this.pointerColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 绘制中心点
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = this.pointerColor;
    ctx.fill();

    // 绘制数值和标签
    if (this.showValue || this.showLabel) {
      const labelY = centerY + radius * 0.5;

      if (this.showValue) {
        ctx.fillStyle = '#333333';
        ctx.font = `bold ${this.fontSize ?? 18}px ${this.fontFamily || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const valueText = this.value.toFixed(this.decimals);
        ctx.fillText(valueText, centerX, labelY);
      }

      if (this.showLabel && this.unit) {
        ctx.fillStyle = '#666666';
        ctx.font = `${(this.fontSize ?? 18) * 0.7}px ${this.fontFamily || 'Arial'}`;
        ctx.fillText(this.unit, centerX, labelY + (this.showValue ? 14 : 0));
      }
    }

    // 选中效果
    if (this.selected) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#0066cc';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  /**
   * 绘制刻度
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} radius
   */
  _renderTicks(ctx, centerX, centerY, radius) {
    const tickCount = 10;
    const angleRange = this.endAngle - this.startAngle;
    const tickRadius = radius - 12;

    ctx.fillStyle = '#666666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= tickCount; i++) {
      const angle = this.startAngle + (i / tickCount) * angleRange;
      const value = this.minValue + (i / tickCount) * (this.maxValue - this.minValue);

      const tickX = centerX + Math.cos(angle) * tickRadius;
      const tickY = centerY + Math.sin(angle) * tickRadius;

      // 绘制刻度点
      ctx.beginPath();
      ctx.arc(tickX, tickY, 2, 0, Math.PI * 2);
      ctx.fill();

      // 绘制数值标签（只在主要刻度）
      if (i % 2 === 0) {
        const labelRadius = radius - 22;
        const labelX = centerX + Math.cos(angle) * labelRadius;
        const labelY = centerY + Math.sin(angle) * labelRadius;
        ctx.fillText(Math.round(value).toString(), labelX, labelY);
      }
    }
  }

  /**
   * @override
   */
  toJSON() {
    return {
      ...super.toJSON(),
      minValue: this.minValue,
      maxValue: this.maxValue,
      value: this.value,
      ranges: this.ranges,
      gaugeColor: this.gaugeColor,
      bgColor: this.bgColor,
      showLabel: this.showLabel,
      showValue: this.showValue,
      unit: this.unit,
      decimals: this.decimals,
      pointerColor: this.pointerColor,
      pointerLength: this.pointerLength,
      startAngle: this.startAngle,
      endAngle: this.endAngle
    };
  }

  /**
   * @override
   */
  static fromJSON(data) {
    return new GaugeElement(data.id, {
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
      minValue: data.minValue,
      maxValue: data.maxValue,
      value: data.value,
      ranges: data.ranges,
      gaugeColor: data.gaugeColor,
      bgColor: data.bgColor,
      showLabel: data.showLabel,
      showValue: data.showValue,
      unit: data.unit,
      decimals: data.decimals,
      pointerColor: data.pointerColor,
      pointerLength: data.pointerLength,
      startAngle: data.startAngle,
      endAngle: data.endAngle
    });
  }
}

export { GaugeElement };
