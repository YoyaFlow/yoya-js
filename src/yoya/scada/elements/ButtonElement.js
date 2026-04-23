/**
 * @fileoverview ButtonElement 按钮元素
 * 用于显示可点击的按钮
 */

import { Element } from './Element.js';

class ButtonElement extends Element {
  constructor(id, options = {}) {
    super(id, options);
    this.type = 'button';
    this.text = options.text || '按钮';
    this.fontSize = options.fontSize ?? 14;
    this.fontFamily = options.fontFamily || 'Arial';
    this.textColor = options.textColor || '#333333';
    this.cornerRadius = options.cornerRadius ?? 4;
    this.hoverColor = options.hoverColor || '#e0e0e0';
    this.pressedColor = options.pressedColor || '#d0d0d0';

    // 按钮状态
    this._isHovered = false;
    this._isPressed = false;

    // 点击回调
    this._onClick = options.onClick || null;
  }

  /**
   * 设置按钮文本
   * @param {string} text
   * @returns {this}
   */
  setText(text) {
    this.text = text;
    this.emit('change', { type: 'textChange', text });
    return this;
  }

  /**
   * 设置点击回调
   * @param {Function} callback
   * @returns {this}
   */
  onClick(callback) {
    this._onClick = callback;
    return this;
  }

  /**
   * 设置悬停状态
   * @param {boolean} hovered
   */
  setHovered(hovered) {
    this._isHovered = hovered;
    this.emit('change', { type: 'hover', hovered });
  }

  /**
   * 设置按下状态
   * @param {boolean} pressed
   */
  setPressed(pressed) {
    this._isPressed = pressed;
    this.emit('change', { type: 'press', pressed });
  }

  /**
   * 触发点击事件
   */
  _triggerClick() {
    if (this._onClick && this.enabled) {
      this._onClick({
        element: this,
        type: 'click',
        x: this.x,
        y: this.y
      });
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

    // 确定背景颜色
    let bgColor = this.fillColor || '#f0f0f0';
    if (!this.enabled) {
      bgColor = '#e0e0e0';
    } else if (this._isPressed) {
      bgColor = this.pressedColor;
    } else if (this._isHovered) {
      bgColor = this.hoverColor;
    }

    // 绘制背景圆角矩形
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(worldX, worldY, w, h, this.cornerRadius);
    ctx.fill();

    // 绘制边框
    ctx.strokeStyle = this.strokeColor || '#cccccc';
    ctx.lineWidth = this.strokeWidth || 1;
    ctx.stroke();

    // 绘制文本
    ctx.fillStyle = this.enabled ? this.textColor : '#999999';
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, worldX + w / 2, worldY + h / 2);

    // 选中效果
    if (this.selected) {
      ctx.strokeStyle = '#0066cc';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
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
      cornerRadius: this.cornerRadius,
      hoverColor: this.hoverColor,
      pressedColor: this.pressedColor
    };
  }

  /**
   * @override
   */
  static fromJSON(data) {
    return new ButtonElement(data.id, {
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
      cornerRadius: data.cornerRadius,
      hoverColor: data.hoverColor,
      pressedColor: data.pressedColor,
      onClick: data.onClick
    });
  }
}

export { ButtonElement };
