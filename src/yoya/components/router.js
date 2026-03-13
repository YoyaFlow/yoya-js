/**
 * Yoya.Basic - Router 路由组件
 * 基于 URL Hash 的简单路由系统，支持路由匹配、参数提取、导航守卫
 * @module Yoya.Router
 * @example
 * // 基础用法
 * import { vRouter, vRoute, vLink } from '../yoya/index.js';
 *
 * vRouter(r => {
 *   r.mode('hash');  // hash 模式（默认）
 *   r.default('/home');
 *
 *   r.route('/home', h => {
 *     h.component(() => div('首页内容'));
 *   });
 *
 *   r.route('/user/:id', h => {
 *     h.component((params) => div(`用户 ID: ${params.id}`));
 *   });
 *
 *   r.route('/about', {
 *     component: () => div('关于页面'),
 *     beforeEnter: (to, from) => {
 *       console.log('即将进入关于页面');
 *       return true; // 返回 false 可阻止导航
 *     }
 *   });
 * });
 *
 * // 导航链接
 * vLink('/home', '首页');
 * vLink('/user/123', '用户详情');
 */

import { Tag, div, a } from '../core/basic.js';

// ============================================
// 工具函数
// ============================================

/**
 * 解析 URL 参数
 * @param {string} path - URL 路径
 * @returns {Object} 参数对象
 * @private
 */
function parseParams(path) {
  const params = {};
  const queryString = path.split('?')[1];
  if (!queryString) return params;

  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    }
  }
  return params;
}

/**
 * 匹配路由路径
 * @param {string} pattern - 路由模式（如 /user/:id）
 * @param {string} path - 实际路径
 * @returns {Object|null} 匹配结果，包含 params
 * @private
 */
function matchRoute(pattern, path) {
  // 移除查询参数
  const patternWithoutQuery = pattern.split('?')[0];
  const pathWithoutQuery = path.split('?')[0];

  const patternParts = patternWithoutQuery.split('/').filter(Boolean);
  const pathParts = pathWithoutQuery.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      // 动态参数
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  // 合并查询参数
  Object.assign(params, parseParams(path));

  return { params, path: pathWithoutQuery };
}

/**
 * 获取当前 hash 路径
 * @returns {string} 当前路径
 * @private
 */
function getCurrentHashPath() {
  const hash = window.location.hash.slice(1); // 去掉 #
  return hash || '/';
}

/**
 * 设置 hash 路径
 * @param {string} path - 目标路径
 * @private
 */
function setHashPath(path) {
  window.location.hash = path;
}

// ============================================
// VRouter 路由容器
// ============================================

/**
 * VRouter 路由容器
 * 管理路由配置和导航
 * @class
 * @extends Tag
 */
class VRouter extends Tag {
  /**
   * 创建 VRouter 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    this._routes = new Map(); // 路由配置
    this._currentRoute = null; // 当前路由
    this._currentParams = {}; // 当前路由参数
    this._defaultPath = '/'; // 默认路径
    this._mode = 'hash'; // 路由模式（仅支持 hash）
    this._globalBeforeEnter = null; // 全局前置守卫
    this._globalAfterEach = null; // 全局后置钩子
    this._isNavigating = false; // 是否正在导航
    this._view = null; // 路由视图容器
    this._initialDispatchPending = true; // 标记初始派发是否待处理

    // 基础样式
    this.styles({
      display: 'block',
      minHeight: '100%',
    });

    if (setup !== null) {
      this.setup(setup);
    }

    // 启动路由监听
    this._startListening();

    // 如果有默认路径且当前是根路径，跳转到默认路径
    // 注意：实际的初始路由派发会等待 _view 被设置后执行
    if (this._defaultPath && getCurrentHashPath() === '/') {
      this.navigate(this._defaultPath, { replace: true });
    }
  }

  /**
   * 启动路由监听
   * @private
   */
  _startListening() {
    this._handleHashChange = () => {
      this._dispatchRoute();
    };
    window.addEventListener('hashchange', this._handleHashChange);
  }

  /**
   * 停止路由监听
   * @private
   */
  _stopListening() {
    if (this._handleHashChange) {
      window.removeEventListener('hashchange', this._handleHashChange);
    }
  }

  /**
   * 派发路由
   * @private
   */
  async _dispatchRoute() {
    if (this._isNavigating) return;

    const currentPath = getCurrentHashPath();

    // 查找匹配的路由
    let matchedRoute = null;
    let matchResult = null;

    for (const [pattern, route] of this._routes.entries()) {
      matchResult = matchRoute(pattern, currentPath);
      if (matchResult) {
        matchedRoute = route;
        break;
      }
    }

    const from = this._currentRoute;
    const to = matchedRoute ? { path: matchResult.path, pattern: matchedRoute.pattern, params: matchResult.params } : null;

    // 全局前置守卫
    if (this._globalBeforeEnter) {
      const result = await this._globalBeforeEnter(to, from);
      if (result === false) return;
    }

    // 路由守卫
    if (matchedRoute && typeof matchedRoute.beforeEnter === 'function') {
      const result = await matchedRoute.beforeEnter(to, from);
      if (result === false) return;
    }

    // 更新当前路由
    this._currentRoute = to;
    this._currentParams = matchResult ? matchResult.params : {};

    // 渲染路由组件
    this._renderRoute(matchedRoute);

    // 全局后置钩子
    if (this._globalAfterEach) {
      this._globalAfterEach(to, from);
    }
  }

  /**
   * 渲染路由组件
   * @private
   */
  _renderRoute(route) {
    let component = null;

    if (!route) {
      // 404 处理
      component = div(div => {
        div.style('text-align', 'center');
        div.style('padding', '60px 20px');
        div.h1(h => {
          h.style('font-size', '72px');
          h.style('color', '#667eea');
          h.text('404');
        });
        div.p(p => {
          p.style('font-size', '18px');
          p.style('color', '#888');
          p.text('页面未找到');
        });
      });
    } else if (route.component) {
      // 创建组件实例
      component = route.component(this._currentParams);
    }

    // 渲染到 VRouterView
    if (this._view) {
      this._view._render(component);
    } else {
      // 如果没有 VRouterView，直接渲染到自己
      this._children = [];
      if (component) {
        this.child(component);
      }
    }
  }

  /**
   * 导航到指定路径
   * @param {string} path - 目标路径
   * @param {Object} [options={}] - 导航选项
   * @param {boolean} [options.replace=false] - 是否替换历史记录
   * @returns {this}
   */
  navigate(path, options = {}) {
    if (options.replace) {
      window.history.replaceState(null, '', `#${path}`);
      this._dispatchRoute();
    } else {
      setHashPath(path);
    }
    return this;
  }

  /**
   * 前进/后退
   * @param {number} delta - 步数
   * @returns {this}
   */
  go(delta) {
    window.history.go(delta);
    return this;
  }

  /**
   * 后退
   * @returns {this}
   */
  back() {
    return this.go(-1);
  }

  /**
   * 前进
   * @returns {this}
   */
  forward() {
    return this.go(1);
  }

  /**
   * 获取当前路径
   * @returns {string}
   */
  currentPath() {
    return getCurrentHashPath();
  }

  /**
   * 获取当前路由参数
   * @returns {Object}
   */
  currentParams() {
    return this._currentParams;
  }

  /**
   * 刷新当前路由
   * @returns {this}
   */
  refresh() {
    this._dispatchRoute();
    return this;
  }

  /**
   * 销毁路由器
   */
  destroy() {
    this._stopListening();
    super.destroy();
  }

  // ============================================
  // 链式配置方法
  // ============================================

  /**
   * 设置路由模式（仅支持 hash）
   * @param {'hash'} mode - 路由模式
   * @returns {this}
   */
  mode(mode) {
    this._mode = mode;
    return this;
  }

  /**
   * 设置默认路径
   * @param {string} path - 默认路径
   * @returns {this}
   */
  default(path) {
    this._defaultPath = path;
    return this;
  }

  /**
   * 添加路由
   * @param {string} pattern - 路由模式
   * @param {Object|Function} config - 路由配置
   * @returns {this}
   * @example
   * r.route('/home', {
   *   component: () => div('首页'),
   *   beforeEnter: (to, from) => true
   * });
   * r.route('/user/:id', h => {
   *   h.component((params) => div(`用户：${params.id}`));
   * });
   */
  route(pattern, config) {
    if (typeof config === 'function') {
      // 函数式配置
      const handler = {
        component: null,
        beforeEnter: null,
        component(fn) {
          this.component = fn;
          return this;
        },
        beforeEnter(fn) {
          this.beforeEnter = fn;
          return this;
        }
      };
      config(handler);
      this._routes.set(pattern, {
        pattern,
        component: handler.component,
        beforeEnter: handler.beforeEnter,
      });
    } else if (typeof config === 'object') {
      // 对象配置
      this._routes.set(pattern, {
        pattern,
        component: config.component,
        beforeEnter: config.beforeEnter,
      });
    }
    return this;
  }

  /**
   * 设置全局前置守卫
   * @param {Function} guard - 守卫函数
   * @returns {this}
   */
  beforeEach(guard) {
    this._globalBeforeEnter = guard;
    return this;
  }

  /**
   * 设置全局后置钩子
   * @param {Function} hook - 钩子函数
   * @returns {this}
   */
  afterEach(hook) {
    this._globalAfterEach = hook;
    return this;
  }
}

/**
 * 创建 VRouter 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VRouter}
 */
function vRouter(setup = null) {
  return new VRouter(setup);
}

// ============================================
// VRoute 路由配置助手（可选，用于更清晰的配置）
// ============================================

/**
 * VRoute 路由配置助手
 * 用于更清晰地配置单个路由
 * @class
 */
class VRoute {
  constructor(pattern) {
    this._pattern = pattern;
    this._component = null;
    this._beforeEnter = null;
  }

  component(fn) {
    this._component = fn;
    return this;
  }

  beforeEnter(fn) {
    this._beforeEnter = fn;
    return this;
  }

  build() {
    return {
      pattern: this._pattern,
      component: this._component,
      beforeEnter: this._beforeEnter,
    };
  }
}

/**
 * 创建 VRoute 实例
 * @param {string} pattern - 路由模式
 * @returns {VRoute}
 */
function vRoute(pattern) {
  return new VRoute(pattern);
}

// ============================================
// VLink 导航链接组件
// ============================================

/**
 * VLink 导航链接
 * 用于创建路由跳转链接
 * @class
 * @extends Tag
 */
class VLink extends Tag {
  /**
   * 创建 VLink 实例
   * @param {string} [to='/'] - 目标路径
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(to = '/', setup = null) {
    super('a', null);

    this._to = to;
    this._replace = false;

    // 基础样式
    this.styles({
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
    });

    // 设置 href
    this.attr('href', `#${to}`);

    // 绑定点击事件
    this.on('click', (e) => {
      e.preventDefault();
      this._navigate();
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 执行导航
   * @private
   */
  _navigate() {
    if (this._replace) {
      window.history.replaceState(null, '', `#${this._to}`);
      window.dispatchEvent(new Event('hashchange'));
    } else {
      window.location.hash = this._to;
    }
  }

  /**
   * 设置目标路径
   * @param {string} path - 路径
   * @returns {this}
   */
  to(path) {
    this._to = path;
    this.attr('href', `#${path}`);
    return this;
  }

  /**
   * 使用 replace 模式（不产生历史记录）
   * @param {boolean} [replace=true] - 是否替换历史
   * @returns {this}
   */
  replace(replace = true) {
    this._replace = replace;
    return this;
  }
}

/**
 * 创建 VLink 实例
 * @param {string} [to='/'] - 目标路径
 * @param {string|Function} [content=''] - 链接内容
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VLink}
 */
function vLink(to = '/', content = '', setup = null) {
  if (typeof content === 'function') {
    setup = content;
    content = '';
  }

  const link = new VLink(to, setup);

  if (content) {
    link.text(content);
  }

  return link;
}

// ============================================
// VRouterView 路由视图（用于在指定位置渲染路由内容）
// ============================================

/**
 * VRouterView 路由视图
 * 在指定位置渲染匹配的路由组件
 * @class
 * @extends Tag
 */
class VRouterView extends Tag {
  /**
   * 创建 VRouterView 实例
   * @param {VRouter} router - 路由器实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(router, setup = null) {
    super('div', null);

    this._router = router;

    // 基础样式
    this.styles({
      flex: 1,
      display: 'block',
    });

    // 将 VRouterView 设置为路由器的渲染容器
    router._view = this;

    // 触发初始路由派发（如果之前有待处理的）
    if (router._initialDispatchPending) {
      router._initialDispatchPending = false;
      // 等待微任务确保 DOM 准备就绪
      Promise.resolve().then(() => {
        router._dispatchRoute();
      });
    }

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 刷新视图（由路由器调用）
   * @private
   */
  _render(component) {
    // 清空子元素（包括真实 DOM）
    this.clear();

    if (component) {
      this.child(component);
    }
  }
}

/**
 * 创建 VRouterView 实例
 * @param {VRouter} router - 路由器实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VRouterView}
 */
function vRouterView(router, setup = null) {
  return new VRouterView(router, setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vRouter = function(setup = null) {
  const router = vRouter(setup);
  this.child(router);
  return this;
};

Tag.prototype.vLink = function(to = '/', content = '', setup = null) {
  const link = vLink(to, content, setup);
  this.child(link);
  return this;
};

Tag.prototype.vRouterView = function(router, setup = null) {
  const view = vRouterView(router, setup);
  this.child(view);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  VRouter,
  vRouter,
  VRoute,
  vRoute,
  VLink,
  vLink,
  VRouterView,
  vRouterView,
};
