/**
 * @fileoverview SCADA 画布模块入口
 * 导出所有核心类和工具
 */

// 核心类
export { ScadaCanvas } from './core/ScadaCanvas.js';
export { Viewport } from './core/Viewport.js';
export { LayerManager } from './core/LayerManager.js';
export { DisplayConfig } from './core/DisplayConfig.js';
export { ContainerManager } from './core/ContainerManager.js';
export { LayoutContainer } from './core/LayoutContainer.js';

// 渲染器
export { GridRenderer } from './rendering/GridRenderer.js';
export { RulerRenderer } from './rendering/RulerRenderer.js';
export { GuideRenderer } from './rendering/GuideRenderer.js';
export { SelectionRenderer } from './rendering/SelectionRenderer.js';
export { GhostRenderer } from './rendering/GhostRenderer.js';

// 交互处理器
export { MouseHandler } from './interaction/MouseHandler.js';
export { KeyboardHandler } from './interaction/KeyboardHandler.js';

// 工具
export { EventEmitter } from './utils/EventEmitter.js';
export { Matrix2D } from './utils/Matrix2D.js';

// 元素（新增）
export * from './elements/index.js';
