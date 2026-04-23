/**
 * @fileoverview ScadaCanvas 主画布类
 * 整合 Viewport、LayerManager、DisplayConfig 和各渲染器
 */

import { EventEmitter } from '../utils/EventEmitter.js';
import { Viewport } from './Viewport.js';
import { LayerManager } from './LayerManager.js';
import { DisplayConfig } from './DisplayConfig.js';
import { ContainerManager } from './ContainerManager.js';
import { GridRenderer } from '../rendering/GridRenderer.js';
import { RulerRenderer } from '../rendering/RulerRenderer.js';
import { SelectionRenderer } from '../rendering/SelectionRenderer.js';
import { GhostRenderer } from '../rendering/GhostRenderer.js';

class ScadaCanvas extends EventEmitter {
  constructor(canvas, options = {}) {
    super();

    if (!canvas) {
      throw new Error('ScadaCanvas: canvas element is required');
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // 初始化视口
    this.viewport = new Viewport({
      zoom: options.zoom ?? 1.0,
      offsetX: options.offsetX ?? 0,
      offsetY: options.offsetY ?? 0,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    });

    // 初始化图层管理器
    this.layerManager = new LayerManager();

    // 初始化容器管理器
    this.containerManager = new ContainerManager();

    // 初始化显示配置
    this.displayConfig = new DisplayConfig(options.defaults);

    // 初始化渲染器
    this.gridRenderer = new GridRenderer();
    this.rulerRenderer = new RulerRenderer();
    this.selectionRenderer = new SelectionRenderer();
    this.ghostRenderer = new GhostRenderer();

    // mouseHandler（由外部设置）
    this.mouseHandler = null;

    // 渲染状态
    this._animationFrameId = null;
    this._isRendering = false;
    this._needsRender = true;

    // 已注册的渲染器
    this._renderers = new Map();

    // 绑定 this
    this._renderLoop = this._renderLoop.bind(this);

    // 初始化
    this._init();
  }

  /**
   * 初始化
   * @private
   */
  _init() {
    // 监听配置变更
    this.displayConfig.on('change', (path, value) => {
      this._needsRender = true;
      this.emit('configChange', { path, value });
    });

    // 监听视口变更
    this.viewport.on('change', (event) => {
      this._needsRender = true;
      this.emit('viewportChange', event);
    });

    // 监听图层变更
    this.layerManager.on('layerChange', (event) => {
      this._needsRender = true;
      this.emit('layerChange', event);
    });

    // 监听容器变更
    this.containerManager.on('change', (event) => {
      this._needsRender = true;
      this.emit('containerChange', event);
    });

    // 设置画布大小
    this._resizeCanvas();
  }

  /**
   * 调整画布大小
   * @private
   */
  _resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.viewport.setCanvasSize(rect.width, rect.height);
    this._needsRender = true;
  }

  /**
   * 注册渲染器
   * @param {string} name - 渲染器名称
   * @param {Object} renderer - 渲染器实例
   */
  registerRenderer(name, renderer) {
    this._renderers.set(name, renderer);
    this._needsRender = true;
  }

  /**
   * 取消注册渲染器
   * @param {string} name - 渲染器名称
   */
  unregisterRenderer(name) {
    this._renderers.delete(name);
    this._needsRender = true;
  }

  /**
   * 开始渲染循环
   */
  startRenderLoop() {
    if (this._animationFrameId) return;
    this._animationFrameId = requestAnimationFrame(this._renderLoop);
  }

  /**
   * 停止渲染循环
   */
  stopRenderLoop() {
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
    this._isRendering = false;
  }

  /**
   * 渲染循环
   * @private
   */
  _renderLoop() {
    if (this._needsRender && !this._isRendering) {
      this._isRendering = true;
      this._render();
      this._needsRender = false;
      this._isRendering = false;
    }
    this._animationFrameId = requestAnimationFrame(this._renderLoop);
  }

  /**
   * 执行渲染
   * @private
   */
  _render() {
    const ctx = this.ctx;
    const viewport = this.viewport;
    const config = this.displayConfig.getAll();

    // 清空画布
    ctx.clearRect(0, 0, viewport.canvasWidth, viewport.canvasHeight);

    // 绘制背景
    if (config.background.color) {
      ctx.fillStyle = config.background.color;
      ctx.fillRect(0, 0, viewport.canvasWidth, viewport.canvasHeight);
    }

    // 绘制网格（背景层）
    if (config.grid.enabled) {
      this.gridRenderer.render(ctx, viewport, config.grid);
    }

    // 应用视口变换
    ctx.save();
    viewport.applyTransform(ctx);

    // 渲染所有可见图层
    const visibleLayers = this.layerManager.getVisibleLayers();
    for (const layer of visibleLayers) {
      if (layer.render) {
        ctx.save();
        layer.render(ctx, viewport);
        ctx.restore();
      }
    }

    // 渲染所有容器
    const containers = this.containerManager.getAllContainers();
    for (const container of containers) {
      container.render(ctx, viewport);
    }

    // 渲染拾取容器的虚影（在普通容器之上）
    if (this.ghostRenderer && this.containerManager.pickupContainerId) {
      const pickupContainer = this.containerManager.getContainer(this.containerManager.pickupContainerId);
      if (pickupContainer) {
        this.ghostRenderer.setContainer(pickupContainer);
        // 如果有预览位置，使用预览位置渲染虚影
        const previewPos = this.mouseHandler?._pickupPreview;
        if (previewPos) {
          this.ghostRenderer.setPreviewPosition(previewPos.x, previewPos.y);
        }
        this.ghostRenderer.render(ctx, viewport);
      }
    }

    // 渲染选中效果（只在非拾取状态下渲染）
    if (this.selectionRenderer && !this.containerManager.pickupContainerId) {
      this.selectionRenderer.render(ctx, this.containerManager, viewport);
    }

    // 恢复视口变换
    ctx.restore();

    // 绘制标尺（前景层）
    if (config.rulers.enabled) {
      this.rulerRenderer.render(ctx, viewport, config.rulers);
    }

    // 渲染自定义渲染器
    for (const [name, renderer] of this._renderers) {
      if (renderer.render) {
        renderer.render(ctx, viewport, config);
      }
    }
  }

  /**
   * 请求重新渲染
   */
  requestRender() {
    this._needsRender = true;
  }

  /**
   * 清空画布
   */
  clear() {
    this.ctx.clearRect(0, 0, this.viewport.canvasWidth, this.viewport.canvasHeight);
  }

  /**
   * 获取当前配置
   * @returns {Object} 配置对象
   */
  getConfig() {
    return this.displayConfig.getAll();
  }

  /**
   * 更新配置
   * @param {string} path - 配置路径
   * @param {any} value - 配置值
   */
  setConfig(path, value) {
    this.displayConfig.set(path, value);
  }

  /**
   * 切换配置
   * @param {string} path - 配置路径
   */
  toggleConfig(path) {
    this.displayConfig.toggle(path);
  }

  /**
   * 导出为 JSON
   * @returns {Object} JSON 对象
   */
  toJSON() {
    return {
      viewport: this.viewport.toJSON(),
      layers: this.layerManager.toJSON(),
      containers: this.containerManager.toJSON(),
      config: this.displayConfig.toJSON()
    };
  }

  /**
   * 从 JSON 恢复
   * @param {Object} data - JSON 数据
   */
  fromJSON(data) {
    if (data.viewport) {
      this.viewport.fromJSON(data.viewport);
    }
    if (data.layers) {
      this.layerManager.fromJSON(data.layers);
    }
    if (data.containers) {
      this.containerManager.fromJSON(data.containers);
    }
    if (data.config) {
      this.displayConfig.fromJSON(data.config);
    }
    this.requestRender();
  }

  /**
   * 销毁
   */
  destroy() {
    this.stopRenderLoop();
    this.layerManager.clear();
    this._renderers.clear();
    this.removeAllListeners();
  }
}

export { ScadaCanvas };
