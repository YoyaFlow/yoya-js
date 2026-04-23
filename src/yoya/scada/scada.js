/**
 * @fileoverview SCADA 画布 standalone 构建入口
 * 用于 Rollup 打包生成 yoya.scada.js
 */

import {
  ScadaCanvas,
  Viewport,
  LayerManager,
  DisplayConfig,
  GridRenderer,
  RulerRenderer,
  GuideRenderer,
  MouseHandler,
  KeyboardHandler,
  EventEmitter,
  Matrix2D
} from './index.js';

// 导出所有类
export {
  ScadaCanvas,
  Viewport,
  LayerManager,
  DisplayConfig,
  GridRenderer,
  RulerRenderer,
  GuideRenderer,
  MouseHandler,
  KeyboardHandler,
  EventEmitter,
  Matrix2D
};

// 默认导出
export default {
  ScadaCanvas,
  Viewport,
  LayerManager,
  DisplayConfig,
  GridRenderer,
  RulerRenderer,
  GuideRenderer,
  MouseHandler,
  KeyboardHandler,
  EventEmitter,
  Matrix2D
};
