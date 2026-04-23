/**
 * @fileoverview RotateAnimation 旋转动画
 * 根据变量值控制图元旋转角度
 */

/**
 * 旋转动画
 */
class RotateAnimation {
  constructor(config, variableManager) {
    this.type = 'rotate';
    this.variable = config.variable;  // 变量 ID
    this.mode = config.mode || 'value';  // 'value' (基于值) 或 'continuous' (连续旋转)
    this.mapping = config.mapping;  // { min: 0, max: 100, from: 0, to: 360 }
    this.speed = config.speed || 360;  // 连续旋转模式：度/秒
    this._variableManager = variableManager;

    // 连续旋转状态
    this._currentAngle = 0;
    this._lastUpdateTime = null;
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

    if (this.mode === 'value') {
      this._updateByValue(value, symbol);
    } else if (this.mode === 'continuous') {
      this._updateContinuous(value, symbol);
    }
  }

  /**
   * 基于值的旋转
   * @private
   * @param {any} value - 当前值
   * @param {SymbolNode} symbol - 图元节点
   */
  _updateByValue(value, symbol) {
    // 计算比例
    const ratio = this._calculateRatio(value);

    // 计算角度
    const angle = this.mapping.from + (this.mapping.to - this.mapping.from) * ratio;

    this._applyRotation(symbol, angle);
  }

  /**
   * 连续旋转
   * @private
   * @param {any} value - 当前值（boolean，true 表示运行）
   * @param {SymbolNode} symbol - 图元节点
   */
  _updateContinuous(value, symbol) {
    if (!value) {
      // 停止状态，不更新
      return;
    }

    const now = Date.now();
    if (!this._lastUpdateTime) {
      this._lastUpdateTime = now;
      return;
    }

    // 计算时间差（秒）
    const deltaTime = (now - this._lastUpdateTime) / 1000;
    this._lastUpdateTime = now;

    // 更新角度
    this._currentAngle = (this._currentAngle + this.speed * deltaTime) % 360;

    this._applyRotation(symbol, this._currentAngle);
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
   * 应用旋转
   * @private
   * @param {SymbolNode} symbol - 图元节点
   * @param {number} angle - 旋转角度
   */
  _applyRotation(symbol, angle) {
    if (!symbol._element) return;

    // 获取当前的变换
    const currentTransform = symbol._element.style.transform || '';

    // 替换或添加 rotate
    const rotateMatch = currentTransform.match(/rotate\(([^)]+)\)/);
    if (rotateMatch) {
      // 替换现有的 rotate
      symbol._element.style.transform = currentTransform.replace(
        /rotate\([^)]+\)/,
        `rotate(${angle}deg)`
      );
    } else {
      // 添加 rotate
      symbol._element.style.transform = `${currentTransform} rotate(${angle}deg)`.trim();
    }

    // 更新 symbol 的 rotation 属性
    symbol.rotation = angle;
  }

  /**
   * 重置旋转角度
   */
  reset() {
    this._currentAngle = 0;
    this._lastUpdateTime = null;
  }

  /**
   * 设置旋转速度（连续模式）
   * @param {number} speed - 度/秒
   */
  setSpeed(speed) {
    this.speed = speed;
  }
}

export { RotateAnimation };
