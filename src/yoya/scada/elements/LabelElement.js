/**
 * @fileoverview LabelElement 标签元素
 * 用于显示文本标签
 */

import { Element } from './Element.js';

class LabelElement extends Element {
  constructor(id, options = {}) {
    super(id, options);
    this.type = 'label';
    this.text = options.text || '标签';
    this.fontSize = options.fontSize ?? 14;
    this.fontFamily = options.fontFamily || 'Arial';
    this.textColor = options.textColor || '#333333';
    this.textAlign = options.textAlign || 'center'; // left, center, right
    this.textBaseline = options.textBaseline || 'middle'; // top, middle, bottom
  }

  /**
   * 设置文本内容
   * @param {string} text
   * @returns {this}
   */
  setText(text) {
    this.text = text;
    this.emit('change', { type: 'textChange', text });
    return this;
  }

  /**
   * 数据更新时更新文本
   * @override
   */
  onDataUpdate(value) {
    this.text = String(value ?? '');
    this.emit('change', { type: 'textChange', text: this.text });
  }

  /**
   * @override
   */
  render(ctx, viewport, parentBounds) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    // 计算世界坐标
    const worldX = parentBounds.minX + this.x;
    const worldY = parentBounds.minY + this.y;

    // 绘制背景（可选）
    if (this.fillColor && this.fillColor !== 'transparent') {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(worldX, worldY, this.width, this.height);
    }

    // 绘制边框
    if (this.strokeWidth > 0 && this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeRect(worldX, worldY, this.width, this.height);
    }

    // 绘制文本
    ctx.fillStyle = this.textColor;
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;

    const textX = this.textAlign === 'left' ? worldX + 4 :
                  this.textAlign === 'right' ? worldX + this.width - 4 :
                  worldX + this.width / 2;

    const textY = this.textBaseline === 'top' ? worldY + 4 :
                  this.textBaseline === 'bottom' ? worldY + this.height - 4 :
                  worldY + this.height / 2;

    ctx.fillText(this.text, textX, textY);

    // 选中效果
    if (this.selected) {
      ctx.strokeStyle = '#0066cc';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(worldX, worldY, this.width, this.height);
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  /**
   * @override
   */
  toJSON() {
    return {
      ...super.toJSON(),
      text: this.text,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      textColor: this.textColor,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline
    };
  }

  /**
   * @override
   */
  static fromJSON(data) {
    return new LabelElement(data.id, {
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
      text: data.text,
      fontSize: data.fontSize,
      fontFamily: data.fontFamily,
      textColor: data.textColor,
      textAlign: data.textAlign,
      textBaseline: data.textBaseline
    });
  }
}

export { LabelElement };
