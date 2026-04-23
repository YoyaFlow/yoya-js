/**
 * @fileoverview 工业组态编辑器核心模块
 * 导出 ScadaEditor、SymbolNode、VariableManager、AlarmManager、AnimationEngine 等核心类
 */

export { VScadaEditor } from './core/ScadaEditor.js';
export { SymbolNode } from './core/SymbolNode.js';
export { VariableManager } from './core/VariableManager.js';
export { AlarmManager } from './core/AlarmManager.js';
export { AnimationEngine, ScaleAnimation } from './animation/AnimationEngine.js';
export { ColorAnimation } from './animation/ColorAnimation.js';
export { PositionAnimation } from './animation/PositionAnimation.js';
export { VisibleAnimation } from './animation/VisibleAnimation.js';
export { RotateAnimation } from './animation/RotateAnimation.js';
export { History } from './utils/History.js';
