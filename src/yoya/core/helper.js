/**
 * Yoya.Basic - Helper Utilities
 * 工具函数：安全的动态加载组件
 * @module Yoya.Helper
 */

import { Tag, div } from './basic.js';

// ============================================
// 动态加载状态管理
// ============================================

/**
 * 加载状态枚举
 * @enum {string}
 * @readonly
 */
const LoadStatus = {
  PENDING: 'pending',      // 等待加载
  LOADING: 'loading',      // 加载中
  LOADED: 'loaded',        // 已加载
  ERROR: 'error'           // 加载失败
};

// 模块加载缓存
const _moduleCache = new Map();

// 加载回调缓存
const _loadCallbacks = new Map();

// ============================================
// 动态加载组件类
// ============================================

/**
 * VDynamicLoader - 动态加载组件
 *
 * 功能：
 * 1. 按需加载 JS 模块
 * 2. 导出模块 API
 * 3. 错误处理，加载失败不影响页面正常运行
 * 4. 支持加载状态回调
 *
 * @class
 * @extends Tag
 * @example
 * // 基础用法
 * vDynamicLoader(() => import('./my-component.js'), {
 *   onLoad: (api) => {
 *     api.render();
 *   },
 *   onError: (error) => {
 *     console.warn('组件加载失败:', error);
 *   },
 *   onStatusChange: (status) => {
 *     console.log('加载状态:', status);
 *   }
 * });
 *
 * // 使用占位内容
 * vDynamicLoader(
 *   () => import('./chart.js'),
 *   { placeholder: div('加载中...') },
 *   { onLoad: (api) => api.init() }
 * );
 */
class VDynamicLoader extends Tag {
  /**
   * 创建 VDynamicLoader 实例
   * @param {Function} moduleLoader - 模块加载函数 () => Promise<Module>
   * @param {Object} [options={}] - 配置选项
   * @param {Tag} [options.placeholder=null] - 占位内容
   * @param {Tag} [options.loadingContent=div('加载中...')] - 加载中内容
   * @param {Tag} [options.errorContent=div('加载失败')] - 错误内容
   * @param {Function} [options.onLoad=null] - 加载成功回调 (api, component) => void
   * @param {Function} [options.onError=null] - 加载失败回调 (error, component) => void
   * @param {Function} [options.onStatusChange=null] - 状态变化回调 (status) => void
   * @param {number} [options.retryCount=0] - 重试次数
   * @param {number} [options.retryDelay=1000] - 重试延迟（毫秒）
   * @param {string} [options.minHeight='auto'] - 最小高度
   * @param {string} [options.minWidth='auto'] - 最小宽度
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(moduleLoader, options = {}, setup = null) {
    // 处理参数重载
    if (typeof options === 'function') {
      setup = options;
      options = {};
    }

    super('div', null);

    this._moduleLoader = moduleLoader;
    this._options = options;
    this._status = LoadStatus.PENDING;
    this._api = null;
    this._error = null;

    // 配置项
    this._placeholder = options.placeholder || null;
    this._loadingContent = options.loadingContent || div('加载中...');
    this._errorContent = options.errorContent || div(c => {
      c.styles({
        color: 'var(--islands-error, #dc3545)',
        padding: '12px',
        background: 'var(--islands-bg-error, #fff5f5)',
        borderRadius: '4px',
      });
      c.text('组件加载失败');
    });

    // 回调
    this._onLoad = options.onLoad || null;
    this._onError = options.onError || null;
    this._onStatusChange = options.onStatusChange || null;

    // 重试配置
    this._retryCount = options.retryCount || 0;
    this._retryDelay = options.retryDelay || 1000;

    // 设置基础样式
    this.styles({
      display: 'inline-block',
      minHeight: options.minHeight || 'auto',
      minWidth: options.minWidth || 'auto',
    });

    // 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 开始加载
    this._startLoad();
  }

  /**
   * 开始加载模块
   * @private
   */
  async _startLoad() {
    // 已加载或加载中，跳过
    if (this._status === LoadStatus.LOADED || this._status === LoadStatus.LOADING) {
      return;
    }

    this._setStatus(LoadStatus.LOADING);

    // 显示加载中内容
    this._showLoading();

    try {
      // 检查缓存
      const cacheKey = this._getCacheKey();
      if (_moduleCache.has(cacheKey)) {
        const cached = _moduleCache.get(cacheKey);
        if (cached.status === LoadStatus.LOADED) {
          this._handleLoaded(cached.api);
          return;
        } else if (cached.status === LoadStatus.ERROR) {
          this._handleError(cached.error);
          return;
        }
      }

      // 加载模块
      const module = await this._moduleLoader();

      // 获取 API（模块默认导出或命名导出 api）
      const api = module.default || module.api || module;

      // 缓存模块
      _moduleCache.set(cacheKey, {
        status: LoadStatus.LOADED,
        api: api,
      });

      this._handleLoaded(api);

    } catch (error) {
      // 缓存错误
      const cacheKey = this._getCacheKey();
      _moduleCache.set(cacheKey, {
        status: LoadStatus.ERROR,
        error: error,
      });

      this._handleError(error);
    }
  }

  /**
   * 获取缓存键
   * @private
   */
  _getCacheKey() {
    // 使用 loader 函数的字符串表示作为缓存键
    return this._moduleLoader.toString();
  }

  /**
   * 处理加载成功
   * @private
   */
  _handleLoaded(api) {
    this._api = api;
    this._setStatus(LoadStatus.LOADED);

    // 显示内容（由 API 控制渲染）
    this._el.innerHTML = '';
    this._children = [];

    // 调用 onLoad 回调
    if (this._onLoad && typeof this._onLoad === 'function') {
      try {
        this._onLoad(api, this);
      } catch (e) {
        console.warn('DynamicLoader onLoad 回调执行失败:', e);
      }
    }
  }

  /**
   * 处理加载失败
   * @private
   */
  _handleError(error) {
    this._error = error;
    this._setStatus(LoadStatus.ERROR);

    // 显示错误内容
    this._showError();

    // 调用 onError 回调
    if (this._onError && typeof this._onError === 'function') {
      try {
        this._onError(error, this);
      } catch (e) {
        console.warn('DynamicLoader onError 回调执行失败:', e);
      }
    }

    // 自动重试
    if (this._retryCount > 0) {
      this._scheduleRetry();
    }
  }

  /**
   * 安排重试
   * @private
   */
  _scheduleRetry() {
    if (this._retryCount <= 0) return;

    setTimeout(() => {
      if (this._status === LoadStatus.ERROR) {
        this._retryCount--;
        this._startLoad();
      }
    }, this._retryDelay);
  }

  /**
   * 设置加载状态
   * @private
   */
  _setStatus(status) {
    this._status = status;

    // 调用状态变化回调
    if (this._onStatusChange && typeof this._onStatusChange === 'function') {
      try {
        this._onStatusChange(status, this);
      } catch (e) {
        console.warn('DynamicLoader onStatusChange 回调执行失败:', e);
      }
    }

    // 触发状态机状态变化（如果已注册）
    if (this.setState) {
      this.setState('loading', status === LoadStatus.LOADING);
      this.setState('loaded', status === LoadStatus.LOADED);
      this.setState('error', status === LoadStatus.ERROR);
    }
  }

  /**
   * 显示加载中内容
   * @private
   */
  _showLoading() {
    this._el.innerHTML = '';
    this._children = [];

    if (this._loadingContent instanceof Tag) {
      this.child(this._loadingContent);
    } else if (typeof this._loadingContent === 'string') {
      this.text(this._loadingContent);
    }
  }

  /**
   * 显示错误内容
   * @private
   */
  _showError() {
    this._el.innerHTML = '';
    this._children = [];

    if (this._errorContent instanceof Tag) {
      this.child(this._errorContent);
    } else if (typeof this._errorContent === 'string') {
      this.text(this._errorContent);
    }
  }

  /**
   * 显示占位内容
   * @private
   */
  _showPlaceholder() {
    if (!this._placeholder) return;

    this._el.innerHTML = '';
    this._children = [];

    if (this._placeholder instanceof Tag) {
      this.child(this._placeholder);
    } else if (typeof this._placeholder === 'string') {
      this.text(this._placeholder);
    }
  }

  // ============================================
  // 公共方法
  // ============================================

  /**
   * 获取加载状态
   * @returns {string} 加载状态（pending/loading/loaded/error）
   */
  getStatus() {
    return this._status;
  }

  /**
   * 检查是否已加载
   * @returns {boolean} 是否已加载完成
   */
  isLoaded() {
    return this._status === LoadStatus.LOADED;
  }

  /**
   * 检查是否加载失败
   * @returns {boolean} 是否加载失败
   */
  isError() {
    return this._status === LoadStatus.ERROR;
  }

  /**
   * 检查是否正在加载
   * @returns {boolean} 是否正在加载
   */
  isLoading() {
    return this._status === LoadStatus.LOADING;
  }

  /**
   * 获取导出的 API
   * @returns {any} 模块 API
   */
  getApi() {
    return this._api;
  }

  /**
   * 获取错误信息
   * @returns {Error|null} 错误对象或 null
   */
  getError() {
    return this._error;
  }

  /**
   * 手动重试加载
   * @returns {Promise<this>} 返回当前实例支持链式调用
   */
  async retry() {
    this._retryCount = 0;  // 重置重试计数
    this._error = null;
    await this._startLoad();
    return this;
  }

  /**
   * 设置加载超时
   * @param {number} ms - 超时毫秒数
   * @returns {this} 返回当前实例支持链式调用
   */
  timeout(ms) {
    this._timeout = ms;
    return this;
  }

  /**
   * 设置重试配置
   * @param {number} count - 重试次数
   * @param {number} [delay=1000] - 重试间隔（毫秒）
   * @returns {this} 返回当前实例支持链式调用
   */
  retryConfig(count, delay = 1000) {
    this._retryCount = count;
    this._retryDelay = delay;
    return this;
  }

  /**
   * 设置加载成功回调
   * @param {Function} callback - (api, loader) => void
   * @returns {this} 返回当前实例支持链式调用
   */
  onLoad(callback) {
    this._onLoad = callback;
    // 如果已经加载完成，立即调用回调
    if (this._status === LoadStatus.LOADED && this._api) {
      try {
        callback(this._api, this);
      } catch (e) {
        console.warn('DynamicLoader onLoad 回调执行失败:', e);
      }
    }
    return this;
  }

  /**
   * 设置错误回调
   * @param {Function} callback - (error, loader) => void
   * @returns {this} 返回当前实例支持链式调用
   */
  onError(callback) {
    this._onError = callback;
    // 如果已经加载失败，立即调用回调
    if (this._status === LoadStatus.ERROR && this._error) {
      try {
        callback(this._error, this);
      } catch (e) {
        console.warn('DynamicLoader onError 回调执行失败:', e);
      }
    }
    return this;
  }

  /**
   * 设置状态变化回调
   * @param {Function} callback - (status, loader) => void
   * @returns {this} 返回当前实例支持链式调用
   */
  onStatusChange(callback) {
    this._onStatusChange = callback;
    // 立即调用一次当前状态
    if (callback) {
      try {
        callback(this._status, this);
      } catch (e) {
        console.warn('DynamicLoader onStatusChange 回调执行失败:', e);
      }
    }
    return this;
  }

  /**
   * 卸载组件，清理缓存
   * @returns {this} 返回当前实例支持链式调用
   */
  unload() {
    const cacheKey = this._getCacheKey();
    _moduleCache.delete(cacheKey);
    this._api = null;
    this._error = null;
    this._status = LoadStatus.PENDING;
    this._showPlaceholder();
    return this;
  }

  /**
   * 销毁组件
   * @returns {this} 返回当前实例支持链式调用
   */
  destroy() {
    this.unload();
    super.destroy();
    return this;
  }
}

/**
 * 创建动态加载组件
 *
 * @param {Function} moduleLoader - 模块加载函数，如 () => import('./component.js')
 * @param {Object|Function} options - 配置选项或 setup 函数
 * @param {Tag|string} [options.placeholder] - 占位内容
 * @param {Tag|string} [options.loadingContent] - 加载中显示内容
 * @param {Tag|string} [options.errorContent] - 错误时显示内容
 * @param {Function} [options.onLoad] - 加载成功回调 (api, loader) => void
 * @param {Function} [options.onError] - 加载失败回调 (error, loader) => void
 * @param {Function} [options.onStatusChange] - 状态变化回调 (status, loader) => void
 * @param {number} [options.retryCount] - 重试次数
 * @param {number} [options.retryDelay] - 重试间隔（毫秒）
 * @param {string} [options.minHeight] - 最小高度
 * @param {string} [options.minWidth] - 最小宽度
 * @param {Function} [setup] - setup 函数
 * @returns {VDynamicLoader}
 */
function vDynamicLoader(moduleLoader, options = {}, setup = null) {
  return new VDynamicLoader(moduleLoader, options, setup);
}

// ============================================
// 批量加载工具
// ============================================

/**
 * 批量加载多个模块
 *
 * @param {Array<{name: string, loader: Function}>} modules - 模块列表
 * @param {Object} options - 配置选项
 * @param {boolean} [options.parallel=true] - 是否并行加载
 * @param {Function} [options.onProgress] - 进度回调 (loaded, total) => void
 * @param {Function} [options.onComplete] - 完成回调 (results) => void
 * @returns {Promise<Map<string, any>>} 模块名到 API 的映射
 */
async function loadModules(modules, options = {}) {
  const {
    parallel = true,
    onProgress = null,
    onComplete = null,
  } = options;

  const results = new Map();
  let loaded = 0;
  const total = modules.length;

  const updateProgress = () => {
    if (onProgress) {
      try {
        onProgress(loaded, total);
      } catch (e) {
        console.warn('loadModules onProgress 回调执行失败:', e);
      }
    }
  };

  const loadSingle = async (name, loader) => {
    try {
      const module = await loader();
      const api = module.default || module.api || module;
      results.set(name, api);
      _moduleCache.set(loader.toString(), {
        status: LoadStatus.LOADED,
        api: api,
      });
    } catch (error) {
      results.set(name, { error });
      _moduleCache.set(loader.toString(), {
        status: LoadStatus.ERROR,
        error: error,
      });
    }
    loaded++;
    updateProgress();
  };

  if (parallel) {
    // 并行加载
    await Promise.all(modules.map(m => loadSingle(m.name, m.loader)));
  } else {
    // 串行加载
    for (const m of modules) {
      await loadSingle(m.name, m.loader);
    }
  }

  if (onComplete) {
    try {
      onComplete(results);
    } catch (e) {
      console.warn('loadModules onComplete 回调执行失败:', e);
    }
  }

  return results;
}

/**
 * 预加载模块到缓存
 *
 * @param {Array<Function>} loaders - 模块加载函数列表
 * @returns {Promise<void>}
 */
async function preloadModules(loaders) {
  await Promise.all(loaders.map(async (loader) => {
    try {
      const module = await loader();
      const api = module.default || module.api || module;
      _moduleCache.set(loader.toString(), {
        status: LoadStatus.LOADED,
        api: api,
      });
    } catch (error) {
      _moduleCache.set(loader.toString(), {
        status: LoadStatus.ERROR,
        error: error,
      });
    }
  }));
}

/**
 * 清除模块缓存
 *
 * @param {string|Function} [loader] - 模块加载函数或缓存键，不传则清空所有缓存
 */
function clearModuleCache(loader) {
  if (typeof loader === 'function') {
    const key = loader.toString();
    _moduleCache.delete(key);
  } else if (typeof loader === 'string') {
    _moduleCache.delete(loader);
  } else {
    _moduleCache.clear();
  }
}

/**
 * 获取模块缓存状态
 *
 * @param {Function} loader - 模块加载函数
 * @returns {Object|null} 返回缓存状态对象 {status, api, error} 或 null
 */
function getModuleCacheStatus(loader) {
  const key = loader.toString();
  return _moduleCache.get(key) || null;
}

// ============================================
// 导出
// ============================================

export {
  // 状态常量
  LoadStatus,

  // 组件类和工厂函数
  VDynamicLoader,
  vDynamicLoader,

  // 批量加载工具
  loadModules,
  preloadModules,
  clearModuleCache,
  getModuleCacheStatus,
};
