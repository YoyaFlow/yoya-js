/**
 * Yoya.Echart - ECharts 集成模块
 *
 * 此模块提供 VEchart 组件，用于在 Yoya.Basic 中使用 ECharts 图表库
 *
 * 使用方式：
 * ```javascript
 * import { vEchart } from './yoya.echart.esm.js';
 * import * as echarts from 'echarts';
 *
 * vEchart(chart => {
 *   chart.echartsLib(echarts);
 *   chart.option({
 *     title: { text: '示例图表' },
 *     xAxis: { type: 'category', data: ['A', 'B', 'C'] },
 *     yAxis: { type: 'value' },
 *     series: [{ type: 'bar', data: [10, 20, 30] }]
 *   });
 * });
 * ```
 */

// 导入核心基础模块
import { Tag, div } from './core/basic.js';

// 导出 VEchart 组件
export { VEchart, vEchart } from './components/echart.js';

// 重新导出基础模块，方便使用
export { Tag, div, text } from './core/basic.js';
