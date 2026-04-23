/**
 * @fileoverview PositionAnimation 位置动画
 * 根据变量值改变图元位置
 */

/**
 * 位置动画
 */
class PositionAnimation {
  constructor(config, variableManager) {
    this.type = 'position';
    this.variable = config.variable;  // 变量 ID
    this.axis = config.axis || 'both';  // 'x', 'y', 'both'
    this.mapping = config.mapping;  // { min: 0, max: 100, from: {x, y}, to: {x, y} }
    this._variableManager = variableManager;
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

    // 计算比例
    const ratio = this._calculateRatio(value);

    // 计算新位置
    const newX = this.mapping.from.x + (this.mapping.to.x - this.mapping.from.x) * ratio;
    const newY = this.mapping.from.y + (this.mapping.to.y - this.mapping.from.y) * ratio;

    // 应用位置
    if (symbol._element) {
      if (this.axis === 'x' || this.axis === 'both') {
        symbol._element.style.left = newX + 'px';
      }
      if (this.axis === 'y' || this.axis === 'both') {
        symbol._element.style.top = newY + 'px';
      }

      // 更新 symbol 的位置属性
      symbol.position.x = this.axis === 'x' || this.axis === 'both' ? newX : symbol.position.x;
      symbol.position.y = this.axis === 'y' || this.axis === 'both' ? newY : symbol.position.y;
    }
  }

  /**
   * 计算比例
   * @private
   * @param {number} value - 当前值
   * @returns {number} 比例 (0-1)
   */
  _calculateRatio(value) {
    const { min, max } = this.mapping;
    if (max === min) return 0;

    let ratio = (value - min) / (max - min);

    // 限制在 0-1 范围内
    return Math.max(0, Math.min(1, ratio));
  }

  /**
   * 设置位置映射
   * @param {Object} mapping - 映射配置
   * @param {number} mapping.min - 变量最小值
   * @param {number} mapping.max - 变量最大值
   * @param {Object} mapping.from - 起始位置 {x, y}
   * @param {Object} mapping.to - 结束位置 {x, y}
   */
  setMapping(mapping) {
    this.mapping = mapping;
  }
}

export { PositionAnimation };
