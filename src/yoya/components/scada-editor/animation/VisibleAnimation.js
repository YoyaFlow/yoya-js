/**
 * @fileoverview VisibleAnimation 可见性动画
 * 根据变量值控制图元显示/隐藏
 */

/**
 * 可见性动画
 */
class VisibleAnimation {
  constructor(config, variableManager) {
    this.type = 'visible';
    this.variable = config.variable;  // 变量 ID
    this.condition = config.condition;  // '>', '<', '==', '!=', '>=', '<='
    this.threshold = config.threshold;
    this.inverted = config.inverted || false;  // 是否反转结果
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

    // 评估条件
    const shouldShow = this._evaluate(value);

    // 应用可见性
    if (symbol._element) {
      symbol._element.style.display = shouldShow ? '' : 'none';
    }

    // 更新 meta 状态
    symbol.meta.hidden = !shouldShow;
  }

  /**
   * 评估条件
   * @private
   * @param {any} value - 当前值
   * @returns {boolean} 是否应该显示
   */
  _evaluate(value) {
    let result;

    switch (this.condition) {
      case '>':
        result = value > this.threshold;
        break;
      case '<':
        result = value < this.threshold;
        break;
      case '>=':
        result = value >= this.threshold;
        break;
      case '<=':
        result = value <= this.threshold;
        break;
      case '==':
        result = value == this.threshold;
        break;
      case '!=':
        result = value != this.threshold;
        break;
      default:
        result = false;
    }

    return this.inverted ? !result : result;
  }

  /**
   * 设置条件
   * @param {string} condition - 条件运算符
   * @param {any} threshold - 阈值
   */
  setCondition(condition, threshold) {
    this.condition = condition;
    this.threshold = threshold;
  }
}

export { VisibleAnimation };
