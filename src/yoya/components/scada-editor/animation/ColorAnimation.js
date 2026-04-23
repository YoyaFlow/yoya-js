/**
 * @fileoverview ColorAnimation 颜色动画
 * 根据变量值改变图元颜色
 */

/**
 * 颜色动画
 */
class ColorAnimation {
  constructor(config, variableManager) {
    this.type = 'color';
    this.target = config.target || 'fill';  // 'fill', 'stroke', 'background', etc.
    this.variable = config.variable;  // 变量 ID
    this.rules = config.rules;  // [{ value: any, color: string }, ...]
    this._variableManager = variableManager;

    // 如果是连续渐变色，设置渐变标志
    this.isGradient = config.isGradient || false;
  }

  /**
   * 更新动画
   * @param {SymbolNode} symbol - 图元节点
   */
  update(symbol) {
    const variable = this._variableManager.get(this.variable);
    if (!variable) return;

    const value = variable.currentValue;
    if (value === null || value === undefined) return;

    let color;
    if (this.isGradient) {
      color = this._interpolateColor(value);
    } else {
      color = this._matchColor(value);
    }

    if (color && symbol._element) {
      this._applyColor(symbol._element, color);
    }
  }

  /**
   * 匹配颜色（离散值）
   * @private
   * @param {any} value - 当前值
   * @returns {string|null} 颜色值
   */
  _matchColor(value) {
    // 精确匹配
    const exactRule = this.rules.find(r => r.value === value);
    if (exactRule) return exactRule.color;

    // 范围匹配（如果有 min/max）
    for (const rule of this.rules) {
      if (rule.min !== undefined && rule.max !== undefined) {
        if (value >= rule.min && value <= rule.max) {
          return rule.color;
        }
      }
    }

    // 返回默认颜色（第一个规则）
    return this.rules[0]?.color || null;
  }

  /**
   * 插值颜色（连续渐变）
   * @private
   * @param {number} value - 当前值
   * @returns {string} 颜色值
   */
  _interpolateColor(value) {
    // 排序规则
    const sortedRules = [...this.rules].sort((a, b) => a.value - b.value);

    // 边界处理
    if (value <= sortedRules[0].value) return sortedRules[0].color;
    if (value >= sortedRules[sortedRules.length - 1].value) {
      return sortedRules[sortedRules.length - 1].color;
    }

    // 找到相邻的两个断点
    for (let i = 0; i < sortedRules.length - 1; i++) {
      const lower = sortedRules[i];
      const upper = sortedRules[i + 1];

      if (value >= lower.value && value <= upper.value) {
        const ratio = (value - lower.value) / (upper.value - lower.value);
        return this._lerpColor(lower.color, upper.color, ratio);
      }
    }

    return sortedRules[0].color;
  }

  /**
   * 线性插值颜色
   * @private
   * @param {string} color1 - 起始颜色
   * @param {string} color2 - 结束颜色
   * @param {number} ratio - 比例 (0-1)
   * @returns {string} 插值后的颜色
   */
  _lerpColor(color1, color2, ratio) {
    const c1 = this._parseColor(color1);
    const c2 = this._parseColor(color2);

    if (!c1 || !c2) return color1;

    const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
    const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
    const b = Math.round(c1.b + (c2.b - c1.b) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * 解析颜色
   * @private
   * @param {string} color - 颜色字符串
   * @returns {Object|null} { r, g, b } 对象
   */
  _parseColor(color) {
    // Hex 颜色
    const hexMatch = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (hexMatch) {
      return {
        r: parseInt(hexMatch[1], 16),
        g: parseInt(hexMatch[2], 16),
        b: parseInt(hexMatch[3], 16)
      };
    }

    // RGB 颜色
    const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      };
    }

    // 颜色名称（简化处理，只支持几种常见颜色）
    const namedColors = {
      red: { r: 255, g: 0, b: 0 },
      green: { r: 0, g: 128, b: 0 },
      blue: { r: 0, g: 0, b: 255 },
      yellow: { r: 255, g: 255, b: 0 },
      orange: { r: 255, g: 165, b: 0 },
      purple: { r: 128, g: 0, b: 128 },
      white: { r: 255, g: 255, b: 255 },
      black: { r: 0, g: 0, b: 0 },
      gray: { r: 128, g: 128, b: 128 }
    };

    return namedColors[color.toLowerCase()] || null;
  }

  /**
   * 应用颜色到元素
   * @private
   * @param {HTMLElement} element - DOM 元素
   * @param {string} color - 颜色值
   */
  _applyColor(element, color) {
    switch (this.target) {
      case 'fill':
        // SVG 填充
        if (element.querySelector('svg')) {
          const svgEl = element.querySelector('svg');
          svgEl.style.fill = color;
          // 也应用到子元素
          svgEl.querySelectorAll('*').forEach(child => {
            child.style.fill = color;
          });
        } else {
          element.style.backgroundColor = color;
        }
        break;

      case 'stroke':
        if (element.querySelector('svg')) {
          const svgEl = element.querySelector('svg');
          svgEl.style.stroke = color;
        } else {
          element.style.borderColor = color;
        }
        break;

      case 'background':
        element.style.backgroundColor = color;
        break;

      case 'color':
      case 'text':
        element.style.color = color;
        break;

      default:
        element.style[this.target] = color;
    }
  }
}

export { ColorAnimation };
