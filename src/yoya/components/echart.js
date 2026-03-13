/**
 * Yoya.Basic - VEchart 图表组件
 * 用于在 Yoya.Basic 中使用 ECharts 图表库
 *
 * 使用方式：
 * 1. 业务项目需要自行引入 echarts 库
 * 2. 通过 echartsLib 参数传入 echarts 实例
 *
 * @example
 * import { vEchart } from './yoya/index.js';
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
 */

import { Tag, div } from '../core/basic.js';

// ============================================
// VEchart 图表组件
// ============================================

class VEchart extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._echartsLib = null;
    this._chartInstance = null;
    this._option = null;
    this._width = '100%';
    this._height = '400px';
    this._theme = null;
    this._renderer = 'canvas';
    this._devicePixelRatio = null;
    this._onReadyCallbacks = [];
    this._onResizeCallbacks = [];
    this._autoResize = true;
    this._resizeObserver = null;
    this._loading = false;
    this._loadingText = '加载中...';

    this.styles({
      width: this._width,
      height: this._height,
      position: 'relative',
      overflow: 'hidden',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置 ECharts 库实例
   * @param {object} lib - echarts 库实例
   */
  echartsLib(lib) {
    if (lib) {
      this._echartsLib = lib;
    }
    return this;
  }

  /**
   * 设置图表配置项
   * @param {object} option - ECharts 配置项
   */
  option(opt) {
    this._option = opt;
    if (this._chartInstance && this._echartsLib) {
      this._chartInstance.setOption(opt, true);
    }
    return this;
  }

  /**
   * 设置图表宽度
   * @param {string} width - 宽度值
   */
  width(val) {
    this._width = val;
    this.style('width', val);
    return this;
  }

  /**
   * 设置图表高度
   * @param {string} height - 高度值
   */
  height(val) {
    this._height = val;
    this.style('height', val);
    return this;
  }

  /**
   * 设置图表主题
   * @param {string} theme - 主题名称 ('dark', 'light' 或自定义主题)
   */
  theme(val) {
    this._theme = val;
    return this;
  }

  /**
   * 设置渲染器类型
   * @param {string} renderer - 'canvas' 或 'svg'
   */
  renderer(val) {
    this._renderer = val;
    return this;
  }

  /**
   * 设置设备像素比
   * @param {number} ratio - 像素比
   */
  devicePixelRatio(val) {
    this._devicePixelRatio = val;
    return this;
  }

  /**
   * 设置是否自动响应容器大小变化
   * @param {boolean} auto - 是否自动调整
   */
  autoResize(auto) {
    this._autoResize = auto;
    return this;
  }

  /**
   * 设置加载状态
   * @param {boolean} loading - 是否加载中
   * @param {string} text - 加载提示文字
   */
  loading(loading, text = '加载中...') {
    this._loading = loading;
    this._loadingText = text;

    if (this._chartInstance) {
      if (loading) {
        this._chartInstance.showLoading({
          text: text,
          color: 'var(--yoya-primary-color, #5470c6)',
          textColor: 'var(--yoya-text-color, #333)',
          maskColor: 'var(--yoya-mask-bg, rgba(255, 255, 255, 0.8))',
          lineWidth: 2,
        });
      } else {
        this._chartInstance.hideLoading();
      }
    }

    return this;
  }

  /**
   * 注册图表就绪回调
   * @param {function} callback - 回调函数，接收 chart 实例参数
   */
  onChartReady(callback) {
    if (typeof callback === 'function') {
      if (this._chartInstance) {
        callback(this._chartInstance);
      } else {
        this._onReadyCallbacks.push(callback);
      }
    }
    return this;
  }

  /**
   * 注册图表大小变化回调
   * @param {function} callback - 回调函数，接收 {width, height} 参数
   */
  onChartResize(callback) {
    if (typeof callback === 'function') {
      this._onResizeCallbacks.push(callback);
    }
    return this;
  }

  /**
   * 获取 ECharts 实例
   * @returns {object|null} ECharts 实例
   */
  getChartInstance() {
    return this._chartInstance;
  }

  /**
   * 更新图表大小
   * @param {object} opts - 调整大小选项
   */
  resize(opts = {}) {
    if (this._chartInstance) {
      this._chartInstance.resize(opts);
    }
    return this;
  }

  /**
   * 清空图表
   */
  clear() {
    if (this._chartInstance) {
      this._chartInstance.clear();
    }
    return this;
  }

  /**
   * 释放图表实例
   */
  dispose() {
    this._disposeChart();
    return this;
  }

  /**
   * 销毁图表
   * @override
   */
  destroy() {
    this._disposeChart();
    super.destroy();
  }

  /**
   * 内部方法：释放图表资源
   * @private
   */
  _disposeChart() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    if (this._chartInstance) {
      this._chartInstance.dispose();
      this._chartInstance = null;
    }
  }

  /**
   * 内部方法：初始化图表
   * @private
   */
  _initChart() {
    if (!this._echartsLib) {
      console.warn('[VEchart] ECharts library not provided. Please call echartsLib() first.');
      return;
    }

    if (this._chartInstance) {
      return;
    }

    const element = this._boundElement;
    if (!element) {
      return;
    }

    const initOpts = {
      renderer: this._renderer,
      devicePixelRatio: this._devicePixelRatio,
    };

    try {
      this._chartInstance = this._echartsLib.init(element, this._theme, initOpts);

      if (this._option) {
        this._chartInstance.setOption(this._option, true);
      }

      // 延迟调用 resize 确保容器有正确的尺寸
      setTimeout(() => {
        if (this._chartInstance && !this._chartInstance.isDisposed()) {
          this._chartInstance.resize();
        }
      }, 100);

      this._executeReadyCallbacks();

      if (this._autoResize) {
        this._initResizeObserver();
      }
    } catch (error) {
      console.error('[VEchart] Failed to initialize chart:', error);
    }
  }

  /**
   * 内部方法：执行就绪回调
   * @private
   */
  _executeReadyCallbacks() {
    if (!this._chartInstance) return;

    this._onReadyCallbacks.forEach(callback => {
      try {
        callback(this._chartInstance);
      } catch (error) {
        console.error('[VEchart] Error in onChartReady callback:', error);
      }
    });
    this._onReadyCallbacks = [];
  }

  /**
   * 内部方法：监听大小变化
   * @private
   */
  _initResizeObserver() {
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', () => this._handleResize());
      return;
    }

    this._resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this._handleResize(width, height);
      }
    });

    if (this._boundElement) {
      this._resizeObserver.observe(this._boundElement);
    }
  }

  /**
   * 内部方法：处理大小变化
   * @private
   */
  _handleResize(width, height) {
    if (!this._chartInstance) return;

    this._chartInstance.resize();

    this._onResizeCallbacks.forEach(callback => {
      try {
        callback({ width, height });
      } catch (error) {
        console.error('[VEchart] Error in onChartResize callback:', error);
      }
    });
  }

  /**
   * 渲染 DOM
   * @override
   */
  renderDom() {
    const element = super.renderDom();

    if (element && this._echartsLib) {
      // 延迟初始化，确保元素已经在 DOM 中并有正确的尺寸
      requestAnimationFrame(() => {
        this._initChart();
      });
    }

    return element;
  }
}

/**
 * 创建 VEchart 实例
 * @param {function|null} setup - 初始化函数
 * @returns {VEchart} VEchart 实例
 */
function vEchart(setup = null) {
  return new VEchart(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

Tag.prototype.vEchart = function(setup = null) {
  const el = vEchart(setup);
  this.child(el);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  VEchart,
  vEchart,
};
