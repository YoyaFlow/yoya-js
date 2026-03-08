/**
 * Yoya.Echart - ECharts 集成模块类型声明
 */

/// <reference types="./yoya.echart.esm.js" />

import { Tag } from './core/basic.js';

/**
 * ECharts 配置项类型（简化版，完整类型请参考 echarts/types/dist/shared.d.ts）
 */
export interface EChartsOption {
  title?: any;
  tooltip?: any;
  legend?: any;
  grid?: any;
  xAxis?: any;
  yAxis?: any;
  series?: any[];
  [key: string]: any;
}

/**
 * ECharts 库接口
 */
export interface EChartsLib {
  init(dom: HTMLElement, theme?: string | object, opts?: {
    renderer?: 'canvas' | 'svg';
    devicePixelRatio?: number;
  }): EChartsInstance;
  [key: string]: any;
}

/**
 * ECharts 实例接口
 */
export interface EChartsInstance {
  setOption(option: EChartsOption, notMerge?: boolean): void;
  resize(opts?: { width?: number; height?: number }): void;
  dispose(): void;
  isDisposed(): boolean;
  clear(): void;
  showLoading(opts?: any): void;
  hideLoading(): void;
  getDataURL(opts?: { type?: 'png' | 'jpeg'; pixelRatio?: number; backgroundColor?: string }): string;
  getOption(): EChartsOption | null;
  [key: string]: any;
}

/**
 * VEchart 图表组件选项
 */
export interface VEchartOptions {
  /**
   * 图表宽度
   * @default '100%'
   */
  width?: string;
  /**
   * 图表高度
   * @default '400px'
   */
  height?: string;
  /**
   * 图表主题 ('dark', 'light' 或自定义主题)
   */
  theme?: string | null;
  /**
   * 渲染器类型
   * @default 'canvas'
   */
  renderer?: 'canvas' | 'svg';
  /**
   * 设备像素比
   */
  devicePixelRatio?: number;
  /**
   * 是否自动响应容器大小变化
   * @default true
   */
  autoResize?: boolean;
}

/**
 * VEchart 图表组件
 *
 * @example
 * ```typescript
 * import { vEchart } from './yoya.echart.esm.js';
 * import * as echarts from 'echarts';
 *
 * vEchart(chart => {
 *   chart.echartsLib(echarts);
 *   chart.option({
 *     title: { text: '销售统计' },
 *     xAxis: { type: 'category', data: ['周一', '周二', '周三'] },
 *     yAxis: { type: 'value' },
 *     series: [{ type: 'bar', data: [10, 20, 30] }]
 *   });
 *   chart.onChartReady((instance) => {
 *     console.log('图表已就绪');
 *   });
 * });
 * ```
 */
export class VEchart extends Tag {
  constructor(setup?: ((self: VEchart) => void) | null);

  /**
   * 设置 ECharts 库实例
   */
  echartsLib(lib: EChartsLib): this;

  /**
   * 设置图表配置项
   */
  option(opt: EChartsOption): this;

  /**
   * 设置图表宽度
   */
  width(val: string): this;

  /**
   * 设置图表高度
   */
  height(val: string): this;

  /**
   * 设置图表主题
   */
  theme(val: string | null): this;

  /**
   * 设置渲染器类型
   */
  renderer(val: 'canvas' | 'svg'): this;

  /**
   * 设置设备像素比
   */
  devicePixelRatio(val: number): this;

  /**
   * 设置是否自动响应容器大小变化
   */
  autoResize(auto: boolean): this;

  /**
   * 设置加载状态
   */
  loading(loading: boolean, text?: string): this;

  /**
   * 注册图表就绪回调
   */
  onChartReady(callback: (chartInstance: EChartsInstance) => void): this;

  /**
   * 注册图表大小变化回调
   */
  onChartResize(callback: (size: { width: number; height: number }) => void): this;

  /**
   * 获取 ECharts 实例
   */
  getChartInstance(): EChartsInstance | null;

  /**
   * 更新图表大小
   */
  resize(opts?: { width?: number; height?: number }): this;

  /**
   * 清空图表
   */
  clear(): this;

  /**
   * 释放图表实例
   */
  dispose(): this;

  /**
   * 销毁图表
   */
  destroy(): void;
}

/**
 * 创建 VEchart 实例
 *
 * @param setup - 初始化函数
 * @returns VEchart 实例
 *
 * @example
 * ```typescript
 * const chart = vEchart(c => {
 *   c.echartsLib(echarts);
 *   c.option({ /* 配置项 *\/ });
 * });
 * ```
 */
export function vEchart(setup?: ((self: VEchart) => void) | null): VEchart;

// Tag 原型扩展
declare module './core/basic.js' {
  interface Tag {
    vEchart(setup?: ((self: VEchart) => void) | null): this;
  }
}
