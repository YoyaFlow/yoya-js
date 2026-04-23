/**
 * @fileoverview AnimationEngine 动画引擎
 * 负责根据实时数据驱动图元的动画效果
 */

import { ColorAnimation } from './ColorAnimation.js';
import { PositionAnimation } from './PositionAnimation.js';
import { VisibleAnimation } from './VisibleAnimation.js';
import { RotateAnimation } from './RotateAnimation.js';

/**
 * 动画引擎
 */
class AnimationEngine {
  constructor(variableManager) {
    this._variableManager = variableManager;
    this._animations = new Map();  // symbolId -> Animation[]
    this._symbolRefs = new Map();  // symbolId -> SymbolNode 引用
    this._running = false;
    this._interval = null;
    this._tickRate = 100;  // 100ms 刷新率
  }

  /**
   * 绑定图元
   * @param {SymbolNode} symbol - 图元节点
   */
  bindSymbol(symbol) {
    this._symbolRefs.set(symbol.id, symbol);

    // 如果图元已有动画配置，创建动画实例
    if (symbol.animations) {
      for (const config of symbol.animations) {
        this.addAnimation(symbol.id, config);
      }
    }
  }

  /**
   * 解绑图元
   * @param {string} symbolId - 图元 ID
   */
  unbindSymbol(symbolId) {
    this._symbolRefs.delete(symbolId);
    this._animations.delete(symbolId);
  }

  /**
   * 添加动画
   * @param {string} symbolId - 图元 ID
   * @param {Object} config - 动画配置
   * @returns {Object} 动画对象
   */
  addAnimation(symbolId, config) {
    const animation = this._createAnimation(config);

    if (!this._animations.has(symbolId)) {
      this._animations.set(symbolId, []);
    }
    this._animations.get(symbolId).push(animation);

    return animation;
  }

  /**
   * 移除动画
   * @param {string} symbolId - 图元 ID
   * @param {number} index - 动画索引
   */
  removeAnimation(symbolId, index) {
    const animations = this._animations.get(symbolId);
    if (animations && index < animations.length) {
      animations.splice(index, 1);
    }
  }

  /**
   * 清除图元所有动画
   * @param {string} symbolId - 图元 ID
   */
  clearAnimations(symbolId) {
    this._animations.delete(symbolId);
  }

  /**
   * 创建动画实例
   * @private
   * @param {Object} config - 动画配置
   * @returns {Object} 动画对象
   */
  _createAnimation(config) {
    switch (config.type) {
      case 'color':
        return new ColorAnimation(config, this._variableManager);
      case 'position':
        return new PositionAnimation(config, this._variableManager);
      case 'visible':
        return new VisibleAnimation(config, this._variableManager);
      case 'rotate':
        return new RotateAnimation(config, this._variableManager);
      case 'scale':
        return new ScaleAnimation(config, this._variableManager);
      default:
        console.warn(`Unknown animation type: ${config.type}`);
        return null;
    }
  }

  /**
   * 启动动画引擎
   */
  start() {
    if (this._running) return;

    this._running = true;
    this._interval = setInterval(() => this._tick(), this._tickRate);
  }

  /**
   * 停止动画引擎
   */
  stop() {
    this._running = false;
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  /**
   * 动画心跳
   * @private
   */
  _tick() {
    // 遍历所有动画，根据变量当前值更新图元
    for (const [symbolId, animations] of this._animations) {
      const symbol = this._symbolRefs.get(symbolId);
      if (!symbol || !symbol._element) continue;

      for (const animation of animations) {
        try {
          animation.update(symbol);
        } catch (e) {
          console.error(`Error updating animation for ${symbolId}:`, e);
        }
      }
    }
  }

  /**
   * 立即更新所有动画
   */
  updateAll() {
    this._tick();
  }

  /**
   * 设置刷新率
   * @param {number} ms - 毫秒
   */
  setTickRate(ms) {
    this._tickRate = ms;
    if (this._running) {
      this.stop();
      this.start();
    }
  }

  /**
   * 获取动画统计
   * @returns {Object} 统计信息
   */
  getStatistics() {
    let totalAnimations = 0;
    const byType = {};

    for (const animations of this._animations.values()) {
      totalAnimations += animations.length;
      for (const anim of animations) {
        const type = anim.type;
        byType[type] = (byType[type] || 0) + 1;
      }
    }

    return {
      totalSymbols: this._symbolRefs.size,
      totalAnimations,
      byType
    };
  }
}

/**
 * 缩放动画
 */
class ScaleAnimation {
  constructor(config, variableManager) {
    this.type = 'scale';
    this.target = config.target || 'transform';
    this.variable = config.variable;
    this.mapping = config.mapping; // { min: 0, max: 100, from: 1, to: 1.5 }
    this._variableManager = variableManager;
  }

  update(symbol) {
    const variable = this._variableManager.get(this.variable);
    if (!variable) return;

    const value = variable.currentValue;
    if (value === null || value === undefined) return;

    // 计算缩放比例
    const ratio = (value - this.mapping.min) / (this.mapping.max - this.mapping.min);
    const scale = this.mapping.from + (this.mapping.to - this.mapping.from) * ratio;

    // 应用缩放
    if (symbol._element) {
      const currentTransform = symbol._element.style.transform || '';
      const rotateMatch = currentTransform.match(/rotate\(([^)]+)\)/);
      const rotate = rotateMatch ? rotateMatch[1] : '0deg';

      symbol._element.style.transform = `scale(${scale}) rotate(${rotate})`;
    }
  }
}

export { AnimationEngine, ScaleAnimation };
