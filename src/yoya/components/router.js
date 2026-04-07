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

import { Tag, div, span, a, button } from '../core/basic.js';

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

  // 处理通配符 /*
  if (patternWithoutQuery === '/*') {
    return {
      params: { path: pathWithoutQuery.slice(1) }, // 去掉开头的 /
      path: pathWithoutQuery
    };
  }

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
          h.style('color', 'var(--yoya-primary)');
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
// VRouterViews 多路由视图容器（类似 Tabs 管理多个视图）
// ============================================

/**
 * VRouterViews 多路由视图容器
 * 管理多个路由视图区域，类似 Tabs 的布局
 * @class
 * @extends Tag
 */
class VRouterViews extends Tag {
  /**
   * 创建 VRouterViews 实例
   * @param {VRouter} router - 路由器实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(router, setup = null) {
    super('div', null);

    this._router = router;
    this._views = new Map(); // 视图名称 -> 视图配置
    this._activeView = null; // 当前激活的视图名称
    this._viewsHeader = null; // 视图标签栏
    this._contentContainer = null; // 内容容器
    this._autoAddView = false; // 是否自动添加新视图
    this._maxViews = 10; // 最大视图数量
    this._viewDropdown = null; // 下拉菜单元素

    // 将路由器的 _view 设置为 this，阻止 VRouter 直接渲染组件
    // FRouterViews 会自己处理组件渲染到各个视图的 _contentDiv
    router._view = this;

    // 基础样式
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    });

    this.addClass('yoya-router-views');

    if (setup !== null) {
      this.setup(setup);
    }

    // 监听路由变化，自动切换或添加视图
    this._initRouterListener();
  }

  /**
   * 空实现，阻止 VRouter 直接渲染组件
   * VRouterViews 会自己处理组件渲染到各个视图的 _contentDiv
   * @param {Tag} component - 路由组件
   * @private
   */
  _render(component) {
    // 空实现，不渲染任何内容
    // 组件渲染由 setActiveView 方法处理
  }

  /**
   * 初始化路由器监听器
   * @private
   */
  _initRouterListener() {
    // 监听全局路由变化
    if (this._router && typeof this._router.onRouteChange === 'function') {
      this._router.onRouteChange((to, from) => {
        this._handleRouteChange(to, from);
      });
    } else if (this._router) {
      // 使用 afterEach 钩子
      this._router.afterEach((to, from) => {
        this._handleRouteChange(to, from);
      });
    }
  }

  /**
   * 处理路由变化
   * @param {Object|string} to - 目标路由对象或路径
   * @param {Object|string} from - 源路由对象或路径
   * @private
   */
  _handleRouteChange(to, from) {
    // to 可能是对象 { path, pattern, params } 或字符串
    const toPath = typeof to === 'object' && to !== null ? to.path : to;
    if (!toPath) return;

    // 查找匹配的视图
    for (const [name, viewData] of this._views.entries()) {
      if (viewData.defaultRoute === toPath) {
        // 找到匹配的视图，切换到该视图
        // 传入 true 表示这是从路由变化触发的，避免重复导航
        this.setActiveView(name, true);
        return;
      }
    }

    // 如果启用了自动添加视图
    if (this._autoAddView) {
      this._autoAddViewFromRoute(toPath);
    }
  }

  /**
   * 根据路由自动添加视图
   * @param {string} route - 路由路径
   * @private
   */
  _autoAddViewFromRoute(route) {
    // 从路由生成视图名称和标题
    const name = route.replace(/\//g, '-').replace(/^-/, '');
    const title = route.split('/').pop() || name;

    // 添加新视图
    this.addView(name, {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      closable: true,
      defaultRoute: route,
    });
  }

  /**
   * 确保 DOM 结构已初始化
   * @private
   */
  _ensureDom() {
    if (!this._viewsHeader) {
      // 创建视图标签栏（左侧标签 + 右侧按钮区）
      this._viewsHeader = div(h => {
        h.addClass('yoya-router-views__header');
        h.styles({
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--yoya-border)',
          background: 'var(--yoya-bg-secondary)',
          padding: '0 4px',
        });

        // 左侧标签容器
        h.child(div(tabs => {
          tabs.addClass('yoya-router-views__tabs');
          tabs.styles({
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
          });
          this._tabsContainer = tabs;
        }));

        // 右侧按钮区（下拉菜单 + 展开按钮）
        h.child(div(actions => {
          actions.addClass('yoya-router-views__actions');
          actions.styles({
            display: 'none', // 默认隐藏，有多个视图时才显示
            alignItems: 'center',
            gap: '4px',
            padding: '0 4px',
            flexShrink: '0',
          });

          // 视图数量标签
          actions.child(span(count => {
            count.addClass('yoya-router-views__count');
            count.styles({
              fontSize: '12px',
              color: 'var(--yoya-text-secondary)',
              padding: '2px 6px',
            });
            count.text('0');
            this._countEl = count;
          }));

          // 下拉菜单按钮 - 使用列表图标
          actions.child(button(menuBtn => {
            menuBtn.addClass('yoya-router-views__menu-btn');
            menuBtn.styles({
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'var(--yoya-text-secondary)',
            });
            menuBtn.html('☰'); // 使用列表图标
            menuBtn.on('click', (e) => {
              e.stopPropagation();
              this._toggleDropdown();
            });
            this._menuBtn = menuBtn;
          }));
        }));
      });

      // 创建下拉菜单
      this._dropdown = div(dropdown => {
        dropdown.addClass('yoya-router-views__dropdown');
        dropdown.styles({
          position: 'absolute',
          top: '100%',
          right: '4px',
          marginTop: '4px',
          backgroundColor: 'var(--yoya-bg)',
          border: '1px solid var(--yoya-border)',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'none',
          minWidth: '200px',
          maxHeight: '300px',
          overflowY: 'auto',
        });
        dropdown.on('click', (e) => e.stopPropagation());
        this._dropdownContent = dropdown;
      });

      // 创建内容容器
      this._contentContainer = div(c => {
        c.addClass('yoya-router-views__content-container');
        c.styles({
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        });
      });

      this._children = [this._viewsHeader, this._dropdown, this._contentContainer];
    }
  }

  /**
   * 添加视图
   * @param {string} name - 视图名称
   * @param {Object} options - 选项 { title, icon, closable, defaultRoute }
   * @returns {VRouterViews} this
   */
  addView(name, options = {}) {
    const { title = name, icon = null, closable = true, defaultRoute = '/', showTitle = true } = options;

    // 检查是否已存在
    if (this._views.has(name)) {
      this.setActiveView(name);
      return this;
    }

    // 检查是否超过最大视图数量
    if (this._views.size >= this._maxViews) {
      console.warn(`[VRouterViews] 已达到最大视图数量限制 (${this._maxViews})，请先关闭不需要的视图`);
      // 找到最早创建的视图（非激活且可关闭的）并关闭它
      for (const [viewName, viewData] of this._views.entries()) {
        if (viewData.closable && viewData.name !== this._activeView?.name) {
          this.removeView(viewName);
          break;
        }
      }
    }

    this._ensureDom();

    // 创建视图数据
    const viewData = {
      name,
      title,
      icon,
      closable,
      defaultRoute,
      showTitle,
      el: null,
      contentEl: null,
      _closeBtn: null,
      _titleEl: null,
    };

    this._views.set(name, viewData);

    // 创建视图标签元素
    const viewEl = this._createViewElement(viewData);
    this._tabsContainer.child(viewEl);
    viewData.el = viewEl;

    // 创建内容容器
    const contentEl = this._createViewContent(viewData);
    this._contentContainer.child(contentEl);
    viewData.contentEl = contentEl;

    // 更新计数
    this._updateCount();

    // 更新下拉菜单
    this._updateDropdown();

    // 更新右侧按钮区的显示/隐藏
    this._updateActionsVisibility();

    // 如果是第一个视图，激活它
    if (this._views.size === 1) {
      this.setActiveView(name);
    } else if (this._autoAddView) {
      // 如果启用了自动添加视图，添加新视图后激活它
      this.setActiveView(name);
    }

    return this;
  }

  /**
   * 创建视图标签元素
   * @param {Object} viewData - 视图数据
   * @returns {Tag} 视图标签元素
   * @private
   */
  _createViewElement(viewData) {
    const self = this;

    return div(t => {
      t.addClass('yoya-router-views__tab');

      if (!viewData.closable) {
        t.addClass('yoya-router-views__tab--unclosable');
      }

      t.on('click', () => {
        self.setActiveView(viewData.name);
      });

      // 图标
      if (viewData.icon) {
        t.child(
          span(i => {
            i.addClass('yoya-router-views__tab-icon');
            i.html(viewData.icon);
          })
        );
      }

      // 标题（支持隐藏）
      if (viewData.showTitle !== false && viewData.title) {
        t.child(
          span(s => {
            s.addClass('yoya-router-views__tab-title');
            s.text(viewData.title);
            viewData._titleEl = s;
          })
        );
      }

      // 关闭按钮
      t.child(
        span(c => {
          c.addClass('yoya-router-views__tab-close');
          c.html('×');
          c.on('click', (e) => {
            e.stopPropagation();
            self.removeView(viewData.name);
          });
          viewData._closeBtn = c;
        })
      );
    });
  }

  /**
   * 创建视图内容
   * @param {Object} viewData - 视图数据
   * @returns {Tag} 视图内容元素
   * @private
   */
  _createViewContent(viewData) {
    const self = this;

    return div(c => {
      c.addClass('yoya-router-views__view');
      c.styles({
        display: 'none',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
      });

      // 创建内容容器
      const contentDiv = div(content => {
        content.styles({
          flex: 1,
          overflow: 'auto',
          height: '100%',
        });
      });

      c.child(contentDiv);
      viewData._contentDiv = contentDiv;
      viewData._rendered = false;
    });
  }

  /**
   * 设置激活的视图
   * @param {string} name - 视图名称
   * @returns {VRouterViews} this
   */
  setActiveView(name, fromRouteChange = false) {
    const viewData = this._views.get(name);
    if (!viewData) return this;

    const previousView = this._activeView;

    // 如果已经是激活的视图，直接返回
    if (previousView === viewData) {
      return this;
    }

    // 更新激活状态
    this._activeView = viewData;

    // 更新之前激活的视图样式 - 只移除激活类，不直接设置 opacity（让 CSS 控制 hover）
    if (previousView && previousView.el) {
      previousView.el.removeClass('yoya-router-views__tab--active');
    }
    if (previousView && previousView.contentEl) {
      previousView.contentEl.style('display', 'none');
    }

    // 更新新激活的视图样式
    viewData.el.addClass('yoya-router-views__tab--active');
    viewData.contentEl.style('display', 'flex');

    // 渲染内容（如果还没有渲染，或者需要从路由变化中更新内容）
    if ((!viewData._rendered || fromRouteChange) && viewData._contentDiv) {
      viewData._rendered = true;
      viewData._lastRenderedPath = viewData.defaultRoute;
      // 获取当前路由的组件并渲染
      const currentPath = viewData.defaultRoute;

      // 在 _routes Map 中查找匹配的路由
      let matchedRoute = null;
      let matchResult = null;

      for (const [pattern, route] of this._router._routes.entries()) {
        matchResult = matchRoute(pattern, currentPath);
        if (matchResult) {
          matchedRoute = route;
          break;
        }
      }

      if (matchedRoute && matchedRoute.component) {
        // 清空旧内容
        viewData._contentDiv._children = [];
        if (viewData._contentDiv._el) {
          viewData._contentDiv._el.innerHTML = '';
        }
        const component = matchedRoute.component(matchResult.params || {});
        viewData._contentDiv.child(component);
      }
    }

    // 导航到视图的默认路由（如果是首次激活）
    if (!viewData._initialized && !fromRouteChange) {
      viewData._initialized = true;
      this._router.navigate(viewData.defaultRoute, { replace: true });
    } else if (fromRouteChange) {
      // 如果是从路由变化触发的，不需要再次导航
    } else {
      // 视图已经初始化过，需要重新导航到该视图的默认路由
      // 这样才能触发 _handleRouteChange 和视图内容更新
      this._router.navigate(viewData.defaultRoute, { replace: false });
    }

    // 派发事件
    if (this._onChange) {
      this._onChange(name, viewData);
    }

    return this;
  }

  /**
   * 移除视图
   * @param {string} name - 视图名称
   * @returns {VRouterViews} this
   */
  removeView(name) {
    const viewData = this._views.get(name);
    if (!viewData) return this;

    const wasActive = this._activeView?.name === name;

    // 从 DOM 移除
    if (viewData.el) {
      viewData.el.destroy();
    }
    if (viewData.contentEl) {
      viewData.contentEl.destroy();
    }

    // 从 Map 移除
    this._views.delete(name);

    // 更新计数
    this._updateCount();

    // 更新下拉菜单
    this._updateDropdown();

    // 更新右侧按钮区的显示/隐藏
    this._updateActionsVisibility();

    // 如果移除的是激活的视图，激活相邻的视图
    if (wasActive) {
      const views = Array.from(this._views.values());
      if (views.length > 0) {
        // 激活最后一个视图
        this.setActiveView(views[views.length - 1].name);
      } else {
        this._activeView = null;
      }
    }

    return this;
  }

  /**
   * 更新视图标题
   * @param {string} name - 视图名称
   * @param {string} title - 新标题
   * @returns {VRouterViews} this
   */
  updateViewTitle(name, title) {
    const viewData = this._views.get(name);
    if (!viewData) return this;

    viewData.title = title;
    if (viewData._titleEl) {
      viewData._titleEl.text(title);
    }

    return this;
  }

  /**
   * 获取激活的视图名称
   * @returns {string|null}
   */
  getActiveViewName() {
    return this._activeView?.name || null;
  }

  /**
   * 获取激活的视图数据
   * @returns {Object|null}
   */
  getActiveView() {
    return this._activeView || null;
  }

  /**
   * 获取所有视图
   * @returns {Array}
   */
  getViews() {
    return Array.from(this._views.values());
  }

  /**
   * 视图变化回调
   * @param {Function} fn
   * @returns {VRouterViews} this
   */
  onChange(fn) {
    this._onChange = fn;
    return this;
  }

  /**
   * 启用自动添加视图功能
   * 当路由变化时，如果没有匹配的视图，自动创建新视图
   * @param {boolean} enabled - 是否启用
   * @returns {VRouterViews} this
   */
  enableAutoView(enabled = true) {
    this._autoAddView = enabled;
    return this;
  }

  /**
   * 监听路由并自动添加视图
   * @deprecated 使用 enableAutoView 代替
   * @param {Function} fn - 回调函数，返回视图配置
   * @returns {VRouterViews} this
   */
  bindRoute(fn) {
    if (typeof fn === 'function') {
      this._routeToViewConfig = fn;
    }
    return this;
  }

  /**
   * 更新视图计数显示
   * @private
   */
  _updateCount() {
    if (this._countEl) {
      const count = this._views.size.toString();
      // 使用 html() 方法替换内容，不会累积
      this._countEl.html(count);
      // 如果已经渲染到 DOM，强制刷新
      if (this._countEl._el) {
        this._countEl._el.textContent = count;
      }
    }
  }

  /**
   * 更新右侧按钮区的显示/隐藏（当有多个视图时显示）
   * @private
   */
  _updateActionsVisibility() {
    if (this._viewsHeader) {
      const actionsEl = this._viewsHeader._children.find(c => c._classes?.has('yoya-router-views__actions'));
      if (actionsEl && actionsEl._el) {
        // 当有多个视图时显示右侧按钮区
        if (this._views.size > 1) {
          actionsEl.style('display', 'flex');
        } else {
          actionsEl.style('display', 'none');
        }
      }
    }
  }

  /**
   * 更新下拉菜单内容
   * @private
   */
  _updateDropdown() {
    if (!this._dropdownContent) return;

    // 清空下拉菜单的虚拟 DOM 和真实 DOM
    this._dropdownContent._children = [];
    if (this._dropdownContent._el) {
      this._dropdownContent._el.innerHTML = '';
    }

    // 添加视图列表项
    for (const [name, viewData] of this._views.entries()) {
      const isActive = this._activeView?.name === name;

      this._dropdownContent.child(div(item => {
        item.styles({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          cursor: 'pointer',
          background: isActive ? 'var(--yoya-bg-hover)' : 'transparent',
          fontSize: '13px',
        });
        item.on('click', () => {
          this.setActiveView(name);
          this._hideDropdown();
        });
        item.on('mouseenter', () => {
          item.style('background', 'var(--yoya-bg-hover)');
        });
        item.on('mouseleave', () => {
          item.style('background', isActive ? 'var(--yoya-bg-hover)' : 'transparent');
        });

        // 左侧：图标 + 标题
        item.child(div(left => {
          left.styles({
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flex: 1,
          });

          if (viewData.icon) {
            left.child(span(icon => {
              icon.text(viewData.icon);
            }));
          }

          left.child(span(title => {
            title.text(viewData.title);
            if (isActive) {
              title.styles({ fontWeight: '500' });
            }
          }));
        }));

        // 右侧：关闭按钮（仅可关闭的视图）
        if (viewData.closable) {
          item.child(span(close => {
            close.styles({
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              borderRadius: '3px',
              fontSize: '14px',
              color: 'var(--yoya-text-secondary)',
              cursor: 'pointer',
            });
            close.html('×');
            close.on('click', (e) => {
              e.stopPropagation();
              this.removeView(name);
              this._hideDropdown();
            });
            close.on('mouseenter', () => {
              close.style('background', 'var(--yoya-error-bg)');
              close.style('color', 'var(--yoya-error)');
            });
            close.on('mouseleave', () => {
              close.style('background', 'transparent');
              close.style('color', 'var(--yoya-text-secondary)');
            });
          }));
        }
      }));
    }

    // 如果没有视图
    if (this._views.size === 0) {
      this._dropdownContent.child(div(empty => {
        empty.styles({
          padding: '16px 12px',
          textAlign: 'center',
          color: 'var(--yoya-text-secondary)',
          fontSize: '13px',
        });
        empty.text('暂无打开的页面');
      }));
    }
  }

  /**
   * 切换下拉菜单显示/隐藏
   * @private
   */
  _toggleDropdown() {
    if (!this._dropdown) return;

    const isShowing = this._dropdown.style('display') === 'block';
    if (isShowing) {
      this._hideDropdown();
    } else {
      this._showDropdown();
    }
  }

  /**
   * 显示下拉菜单
   * @private
   */
  _showDropdown() {
    if (!this._dropdown) return;

    this._updateDropdown();
    this._dropdown.style('display', 'block');

    // 点击外部关闭
    const closeHandler = () => {
      this._hideDropdown();
      document.removeEventListener('click', closeHandler);
    };
    setTimeout(() => {
      document.addEventListener('click', closeHandler);
    }, 100);
  }

  /**
   * 隐藏下拉菜单
   * @private
   */
  _hideDropdown() {
    if (!this._dropdown) return;
    this._dropdown.style('display', 'none');
  }

  /**
   * 设置最大视图数量
   * @param {number} max - 最大数量
   * @returns {VRouterViews} this
   */
  setMaxViews(max) {
    this._maxViews = max;
    return this;
  }

  renderDom() {
    if (this._deleted) return null;

    if (!this._initialized) {
      this._ensureDom();
      this._initialized = true;
    }

    return super.renderDom();
  }
}

/**
 * 创建 VRouterViews 实例
 * @param {VRouter} router - 路由器实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VRouterViews}
 */
function vRouterViews(router, setup = null) {
  return new VRouterViews(router, setup);
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

Tag.prototype.vRouterViews = function(router, setup = null) {
  const views = vRouterViews(router, setup);
  this.child(views);
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
  VRouterViews,
  vRouterViews,
};
