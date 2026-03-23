/**
 * Yoya.Basic - Browser-native HTML DSL Library
 * 提供类似 Kotlin HTML DSL 的声明式语法
 * @module Yoya.Basic
 */

// ============================================
// Tag 基类
// ============================================

/**
 * Tag 类 - 所有 HTML 元素的基类
 * 提供声明式语法构建 DOM 元素，支持链式调用和虚拟 DOM
 * @class
 * @example
 * // 创建 div 元素
 * const divEl = div(box => {
 *   box.className('container');
 *   box.text('Hello World');
 * }).bindTo('#app');
 */
class Tag {
  /**
   * 创建 Tag 实例
   * @param {string} tagName - HTML 标签名
   * @param {Function|Object|string|null} [setup=null] - 初始化配置，可以是函数、对象或字符串
   * @example
   * new Tag('div', box => {
   *   box.className('container');
   *   box.text('内容');
   * });
   */
  constructor(tagName, setup = null) {
    this._tagName = tagName;

    // Q1 B: 立即创建 DOM 元素
    this._el = document.createElement(tagName);
    this._boundElement = this._el;  // 别名，保持向后兼容

    // Q2 A: 保留虚拟属性
    this._attrs = {};
    this._styles = {};
    this._classes = new Set();
    this._events = {};
    this._children = [];
    this._props = {};  // DOM properties

    // 新增：记录已绑定到 DOM 的事件类型
    this._boundEvents = {};

    // 状态管理
    this._states = new Set();
    this._stateStyles = {};
    this._baseStyles = null;

    // 渲染状态
    this._rendered = false;
    this._deleted = false;

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * setup 统一初始化方法
   * 根据传入参数类型执行不同的初始化逻辑
   * @param {Function|Object|string|null} setup - 初始化配置
   * - 函数：执行回调函数
   * - 对象：应用配置属性
   * - 字符串：添加文本内容
   * @returns {this} 返回当前实例支持链式调用
   */
  setup(setup) {
    if (typeof setup === 'function') {
      this._setupFunction(setup);
    } else if (typeof setup === 'string') {
      this._setupString(setup);
    } else if (typeof setup === 'object' && setup !== null) {
      this._setupObject(setup);
    }
    return this;
  }

  /**
   * 字符串 setup 处理 - 添加文本内容
   * @private
   * @param {string} setupString - 文本内容
   */
  _setupString(setupString){
    this._addText(setupString);
  }

  /**
   * 函数 setup 处理 - 执行回调
   * @private
   * @param {Function} setupFn - 回调函数
   */
  _setupFunction(setupFn){
    setupFn(this)
  }

  /**
   * 对象 setup 处理 - 应用配置属性
   * 处理 class/className, style, 事件 (onXxx), children 和其他属性
   * @private
   * @param {Object} config - 配置对象
   */
  _setupObject(config) {
    // 处理 class
    if (config.class) {
      if (Array.isArray(config.class)) {
        this.className(...config.class);
      } else if (typeof config.class === 'string') {
        this.className(config.class);
      }
    }

    // 处理 className（别名）
    if (config.className) {
      if (Array.isArray(config.className)) {
        this.className(...config.className);
      } else if (typeof config.className === 'string') {
        this.className(config.className);
      }
    }

    // 处理 style
    if (config.style) {
      for (const [key, value] of Object.entries(config.style)) {
        this.style(key, value);
      }
    }

    // 处理事件（onXxx 形式的函数）
    for (const [key, value] of Object.entries(config)) {
      if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        this.on(eventName, value);
      }
    }

    // 处理子元素
    if (config.children) {
      this._addChildren(config.children);
    }

    // 处理其他属性：优先使用 setter，其次使用 attr
    for (const [key, value] of Object.entries(config)) {
      // 跳过已处理的属性
      if (['class', 'style', 'children'].includes(key)) {
        continue;
      }
      // 跳过 on 开头的事件（已在上处理）
      if (key.startsWith('on') && typeof value === 'function') {
        continue;
      }
      // 尝试使用 setter
      const setterName = key;
      if (typeof this[setterName] === 'function') {
        // 有 setter 方法，调用它（包括函数类型的值）
        this[setterName](value);
      } else if (this.hasOwnProperty(setterName)) {
        // 有 setter 属性，直接赋值
        this[setterName] = value;
      } else {
        // 没有 setter，使用 attr（跳过函数类型）
        if (typeof value === 'function') {
          continue;
        }
        this.attr(key, value);
      }
    }
  }

  /**
   * 添加文本节点
   * @private
   * @param {string|number} content - 文本内容
   * @returns {this} 返回当前实例支持链式调用
   */
  _addText(content) {
    const textNode = document.createTextNode(String(content));
    this._el.appendChild(textNode);

    // 创建虚拟 Text 节点
    const textTag = new Text(content);
    textTag._textNode = textNode;
    textTag._el = textNode;
    textTag._boundElement = textNode;
    this._children.push(textTag);

    return this;
  }

  /**
   * 属性操作：存储并同步到 DOM 元素
   * @param {string|Object} name - 属性名或属性对象
   * @param {*} [value] - 属性值（不传则返回当前值）
   * @returns {this|*} 设置时返回 this，获取时返回属性值
   * @example
   * // 设置单个属性
   * el.attr('id', 'my-id');
   * // 设置多个属性
   * el.attr({ id: 'test', name: 'input1' });
   * // 获取属性值
   * const id = el.attr('id');
   */
  attr(name, value) {
    if (value === undefined && typeof name === 'string') {
      return this._attrs[name];
    }

    if (typeof name === 'object') {
      for (const [k, v] of Object.entries(name)) {
        this._attrs[k] = v;
        this._applyAttrToEl(k, v);
      }
    } else {
      this._attrs[name] = value;
      this._applyAttrToEl(name, value);
    }
    return this;
  }

  /**
   * 设置/获取 DOM 属性（直接操作 DOM property，而非 HTML attribute）
   * @param {string} name - 属性名
   * @param {*} [value] - 属性值（不传则返回当前值）
   * @returns {this|*} 设置时返回 this，获取时返回属性值
   * @example
   * el.prop('checked', true);
   * el.prop('value', 'test');
   * const isChecked = el.prop('checked');
   */
  prop(name, value) {
    if (value === undefined) {
      return this._el ? this._el[name] : this._props[name];
    }

    if (typeof name === 'object') {
      for (const [k, v] of Object.entries(name)) {
        this._props[k] = v;
        if (this._el) {
          this._el[k] = v;
        }
      }
    } else {
      this._props[name] = value;
      if (this._el) {
        this._el[name] = value;
      }
    }
    return this;
  }

  /**
   * 将属性应用到 DOM 元素
   * @private
   * @param {string} name - 属性名
   * @param {*} value - 属性值
   */
  _applyAttrToEl(name, value) {
    if (value === null || value === undefined) {
      this._el.removeAttribute(name);
      return;
    }

    switch (name) {
      case 'value':
        this._el.value = value;
        break;
      case 'checked':
        this._el.checked = Boolean(value);
        break;
      case 'selected':
        this._el.selected = Boolean(value);
        break;
      case 'class':
        this._el.className = value;
        break;
      case 'style':
        this._el.cssText = value;
        break;
      default:
        if (value === true) {
          this._el.setAttribute(name, name);
        } else {
          this._el.setAttribute(name, value);
        }
    }
  }

  /**
   * 添加 CSS 类名（同步到 DOM）
   * @param {...(string|string[])} classes - 类名，支持多个参数或数组
   * @returns {this} 返回当前实例支持链式调用
   * @example
   * el.className('active', 'highlight');
   * el.className(['btn', 'btn-primary']);
   * el.className('btn btn-primary'); // 空格分隔的多个类名
   */
  className(...classes) {
    classes.flat().forEach(cls => {
      if (cls) {
        // 处理字符串中包含空格的情况（如 'class1 class2'）
        const classList = typeof cls === 'string' ? cls.trim().split(/\s+/) : [cls];
        classList.forEach(c => {
          if (c) {
            this._classes.add(c);
            this._el.classList.add(c);
          }
        });
      }
    });
    return this;
  }

  /**
   * className 的别名，保持向后兼容
   * @deprecated 推荐使用 className()
   * @param {...(string|string[])} classes - 类名
   * @returns {this}
   */
  class(...classes) {
    return this.className(...classes);
  }

  /**
   * 添加 CSS 类名
   * @param {string} className - 类名
   * @returns {this}
   * @example
   * el.addClass('active');
   * el.addClass('yoya-button');
   */
  addClass(className) {
    if (className && typeof className === 'string') {
      if (!this._classes.has(className)) {
        this._classes.add(className);
        if (this._el) {
          this._el.classList.add(className);
        }
      }
    }
    return this;
  }

  /**
   * 移除 CSS 类名
   * @param {string} className - 类名
   * @returns {this}
   * @example
   * el.removeClass('active');
   * el.removeClass('yoya-button--primary');
   */
  removeClass(className) {
    if (className && typeof className === 'string') {
      if (this._classes.has(className)) {
        this._classes.delete(className);
        if (this._el) {
          this._el.classList.remove(className);
        }
      }
    }
    return this;
  }

  /**
   * 样式操作：存储并同步到 DOM 元素
   * @param {string|Object} name - 样式名或样式对象
   * @param {string|number} [value] - 样式值（不传则返回当前值）
   * @returns {this|*} 设置时返回 this，获取时返回样式值
   * @example
   * // 设置单个样式
   * el.style('color', 'red');
   * // 设置多个样式
   * el.style({ color: 'red', fontSize: '14px' });
   * // 获取样式值
   * const color = el.style('color');
   */
  style(name, value) {
    if (value === undefined && typeof name === 'string') {
      return this._styles[name];
    }

    if (typeof name === 'object') {
      // 对象形式：style({ color: 'red', fontSize: '14px' })
      for (const [k, v] of Object.entries(name)) {
        this._styles[k] = v;
        this._el.style[k] = v;  // 同步到 _el
      }
    } else {
      // 单一形式：style('color', 'red')
      this._styles[name] = value;
      this._el.style[name] = value;  // 同步到 _el
    }
    return this;
  }

  /**
   * 批量设置样式
   * @param {Object} stylesObj - 样式对象
   * @returns {this} 返回当前实例支持链式调用
   * @example
   * el.styles({ color: 'red', padding: '10px', margin: '0 auto' });
   */
  styles(stylesObj) {
    for (const [name, value] of Object.entries(stylesObj)) {
      this._styles[name] = value;
      this._el.style[name] = value;  // 同步到 _el
    }
    return this;
  }

  // ============================================
  // Tag 原型扩展方法 - 通用属性
  // 所有 HTML 元素都可以使用这些方法
  // ============================================

  /**
   * 设置/获取元素 id
   * @param {string} [value] - id 值（不传则返回当前值）
   * @returns {this|string} 设置时返回 this，获取时返回 id 值
   */
  id(value) {
    if (value === undefined) return this.attr('id');
    return this.attr('id', value);
  }

  /**
   * 设置/获取元素 name 属性
   * @param {string} [value] - name 值（不传则返回当前值）
   * @returns {this|string} 设置时返回 this，获取时返回 name 值
   */
  name(value) {
    if (value === undefined) return this.attr('name');
    return this.attr('name', value);
  }

  /**
   * 绑定事件处理器
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   * @returns {this} 返回当前实例支持链式调用
   * @example
   * el.on('click', (e) => { console.log('clicked', e); });
   */
  on(event, handler) {
    // 1. 登记事件处理器到虚拟元素
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(handler);

    // 2. 如果这个事件类型还没有绑定到 DOM，现在绑定
    if (!this._boundEvents[event] && this._el) {
      this._bindEventToEl(event);
      this._boundEvents[event] = true;
    }

    return this;
  }

  // ============================================
  // 统一事件包装器 - 单对象参数格式
  // ============================================
  // 所有事件回调使用单个对象参数：{event, value, oldValue, target, ...}
  // 用户解构使用：onclick(({event, target}) => {})
  // 或简化使用：onclick((e) => { e.value })

  /**
   * 统一事件包装器
   * @param {Function} handler - 用户传入的回调函数
   * @param {Function} buildContext - 构建事件上下文的函数 (e, host) => contextObject
   */
  _wrapHandler(handler, buildContext) {
    return (e) => {
      const context = {
        event: e,
        target: this,
      };
      // 合并额外属性
      if (buildContext) {
        Object.assign(context, buildContext(e, this));
      }
      handler(context);
    };
  }

  /**
   * 绑定标准点击事件
   * @param {Function} handler - 事件处理器，接收 {event, target} 参数
   * @returns {this} 返回当前实例支持链式调用
   * @example
   * el.onClick(({ event, target }) => {
   *   console.log('元素被点击', target);
   * });
   */
  onClick(handler) {
    this.on('click', this._wrapHandler(handler));
    return this;
  }

  /**
   * 绑定值变化事件
   * @param {Function} handler - 事件处理器，接收 {event, value, oldValue, target} 参数
   * @returns {this} 返回当前实例支持链式调用
   * @example
   * el.onChangeValue(({ value, oldValue }) => {
   *   console.log('值从', oldValue, '变为', value);
   * });
   */
  onChangeValue(handler) {
    // 从 DOM 元素获取当前值作为 oldValue
    const oldValue = this._el ? (this._el.value || this.value?.()) : undefined;
    this.on('change', this._wrapHandler(handler, (e) => {
      // 从事件目标或虚拟元素获取新值
      const newValue = e.target?.value || this.value?.();
      return { value: newValue, oldValue };
    }));
    return this;
  }

  /**
   * 绑定输入事件
   * @param {Function} handler - 事件处理器，接收 {event, value, target} 参数
   * @returns {this} 返回当前实例支持链式调用
   */
  onInputValue(handler) {
    this.on('input', this._wrapHandler(handler, (e) => {
      return { value: this.value?.() || e.target?.value };
    }));
    return this;
  }

  /**
   * 绑定布尔状态切换事件
   * @param {Function} handler - 事件处理器，接收 {event, value, oldValue, target} 参数
   * @returns {this} 返回当前实例支持链式调用
   */
  onToggle(handler) {
    const oldValue = this.checked?.();
    this.on('change', this._wrapHandler(handler, (e) => {
      const newValue = this.checked?.() || e.target?.checked;
      return { value: newValue, oldValue };
    }));
    return this;
  }

  /**
   * 绑定焦点事件
   * @param {Function} handler - 事件处理器，接收 {event, target} 参数
   * @returns {this} 返回当前实例支持链式调用
   */
  onFocus(handler) {
    this.on('focus', this._wrapHandler(handler));
    return this;
  }

  /**
   * 绑定失焦事件
   * @param {Function} handler - 事件处理器，接收 {event, target} 参数
   * @returns {this} 返回当前实例支持链式调用
   */
  onBlur(handler) {
    this.on('blur', this._wrapHandler(handler));
    return this;
  }

  /**
   * 绑定键盘事件
   * @param {Function} handler - 事件处理器，接收 {event, key, code, target} 参数
   * @returns {this} 返回当前实例支持链式调用
   */
  onKey(handler) {
    this.on('keydown', this._wrapHandler(handler, (e) => {
      return { key: e.key, code: e.code };
    }));
    return this;
  }

  /**
   * 绑定鼠标进入事件
   * @param {Function} handler - 事件处理器，接收 {event, target} 参数
   * @returns {this} 返回当前实例支持链式调用
   */
  onMouseEnter(handler) {
    this.on('mouseenter', this._wrapHandler(handler));
    return this;
  }

  /**
   * 绑定鼠标离开事件
   * @param {Function} handler - 事件处理器，接收 {event, target} 参数
   * @returns {this} 返回当前实例支持链式调用
   */
  onMouseLeave(handler) {
    this.on('mouseleave', this._wrapHandler(handler));
    return this;
  }

  /**
   * 添加文本节点或子元素
   * @param {string|number|Tag} content - 文本内容、数字或 Tag 实例
   * @returns {this} 返回当前实例支持链式调用
   * @example
   * // 添加文本
   * el.text('Hello World');
   * // 添加 Tag 实例
   * el.text(span('inner text'));
   */
  text(content) {
    // 如果传入的是 Tag 对象（如 text('Hello')），直接添加为子元素
    if (content instanceof Tag) {
      this.child(content);
      return this;
    }
    return this._addText(content);
  }

  /**
   * 清空并设置文本内容
   * @param {string|number} content - 文本内容
   * @returns {this} 返回当前实例支持链式调用
   */
  textContent(content){
    this.clear();
    this.text(content);
    // 如果已经渲染过，直接更新真实 DOM
    if (this._rendered && this._el) {
      this._el.textContent = String(content);
    }
    return this;
  }

  /**
   * 设置 HTML 内容
   * @param {string} content - HTML 字符串
   * @returns {this} 返回当前实例支持链式调用
   */
  html(content) {
    this._htmlContent = content;
    return this;
  }

  /**
   * 添加一个或多个子元素
   * @param {...(Tag|string|number|null|undefined|Array)} children - 子元素，支持 Tag 实例、字符串、数字、数组
   * @returns {this} 返回当前实例支持链式调用
   * @example
   * el.child(div('child1'), span('child2'));
   * el.child([div('a'), span('b')]);
   */
  child(...children) {
    this._addChildren(children);
    return this;
  }

  /**
   * 添加多个子元素（内部方法）
   * @private
   * @param {Array} children - 子元素数组
   */
  _addChildren(children) {
    children.flat().forEach(child => {
      if (child === null || child === undefined) {
        return;
      }
      if (child instanceof Tag) {
        this._children.push(child);
        // 渲染子元素并添加到父元素的 _el
        const childEl = child.renderDom();
        if (childEl && childEl.parentNode === null) {
          this._el.appendChild(childEl);
        }
      } else if (typeof child === 'string' || typeof child === 'number') {
        this.text(child);
      }
    });
  }

  /**
   * 清空子元素
   * @returns {this} 返回当前实例支持链式调用
   */
  clear() {
    this._children = [];
    this._htmlContent = null;
    // 同时清空真实 DOM 中的子元素
    if (this._el) {
      this._el.innerHTML = '';
    }
    return this;
  }

  /**
   * 绑定到 DOM 元素
   * 支持 CSS 选择器字符串、DOM 元素或 Tag 实例
   * @param {string|Element|Tag} target - 绑定目标
   * @returns {this} 返回当前实例支持链式调用
   * @example
   * // 绑定到 CSS 选择器
   * el.bindTo('#app');
   * // 绑定到 DOM 元素
   * el.bindTo(document.getElementById('app'));
   * // 绑定到 Tag 实例
   * parent.child(el);
   */
  bindTo(target) {
    const el = this.renderDom();
    if (!el) return this;

    if (typeof target === 'string') {
      const parent = document.querySelector(target);
      if (parent) parent.appendChild(el);
    } else if (target instanceof Element) {
      target.appendChild(el);
    } else if (target instanceof Tag) {
      target.child(this);
      target.renderDom();
    }
    return this;
  }

  /**
   * 渲染虚拟元素树为真实 DOM
   * 智能更新子元素，只处理增删，不重新应用属性
   * @returns {HTMLElement|null} 返回渲染后的 DOM 元素，如果已删除则返回 null
   */
  renderDom() {
    if (this._deleted) return null;

    // 全局日志 - 追踪调用
    if (!window._renderDomCalls) window._renderDomCalls = [];
    window._renderDomCalls.push({ tag: this._tagName, rendered: this._rendered, connected: this._el?.isConnected, hasListeners: !!this._eventListeners });

    // 首次渲染或元素被从 DOM 移除后重新渲染时应用事件和 props
    // 或者事件还没有绑定时也应用事件
    const shouldApplyEvents = !this._rendered || !this._el.isConnected || !this._eventListeners;
    if (shouldApplyEvents) {
      this._applyEventsToEl();
      this._applyPropsToEl();
    }

    // 智能更新子元素
    const currentEls = Array.from(this._el.children);
    const currentElSet = new Set(currentEls);

    const newEls = [];
    const childrenToAdd = [];

    for (const child of this._children) {
      if (child._deleted) continue;

      const childEl = child.renderDom();
      if (!childEl) continue;

      newEls.push(childEl);

      // 如果已存在，跳过
      if (currentElSet.has(childEl)) {
        currentElSet.delete(childEl);
      } else {
        childrenToAdd.push(childEl);
      }
    }

    // 移除已删除的子元素
    for (const el of currentEls) {
      if (!newEls.includes(el)) {
        this._el.removeChild(el);
      }
    }

    // 添加新的子元素
    for (const childEl of childrenToAdd) {
      this._el.appendChild(childEl);
    }

    // 应用 HTML 内容（如果有）
    if (this._htmlContent) {
      // 清空并设置 HTML
      this._el.innerHTML = this._htmlContent;
    }

    this._rendered = true;
    return this._el;
  }

  /**
   * @deprecated 改用 _bindEventToEl 按需绑定
   * 将事件同步到 DOM 元素（仅在首次渲染时调用）
   * @private
   */
  _applyEventsToEl() {
    // 保留空实现或日志提示
    // 原有的事件绑定逻辑已移到 _bindEventToEl
  }

  /**
   * 将单个事件类型绑定到 DOM 元素
   * 每个事件类型只绑定一次，使用统一的委托处理器
   * @param {string} event - 事件名称
   * @private
   */
  _bindEventToEl(event) {
    this._el.addEventListener(event, (nativeEvent) => {
      // 附加虚拟元素引用到原生事件
      nativeEvent._vnode = this;

      // 关键：每次触发时动态读取当前 _events
      // 这样即使 handler 是在绑定监听器之后添加的，也能被调用
      const handlers = this._events[event] || [];
      handlers.forEach(handler => handler.call(this._el, nativeEvent));
    });
  }

  /**
   * 将 DOM properties 应用到 DOM 元素
   * @private
   */
  _applyPropsToEl() {
    for (const [key, value] of Object.entries(this._props)) {
      if (value === null || value === undefined) {
        delete this._el[key];
      } else {
        this._el[key] = value;
      }
    }
  }

  /**
   * 销毁元素及其所有子元素
   * @returns {this} 返回当前实例支持链式调用
   */
  destroy() {
    this._deleted = true;

    // 递归销毁子元素
    for (const child of this._children) {
      child.destroy();
    }
    this._children = [];

    if (this._el && this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }

    return this;
  }

  // ============================================
  // 状态管理方法
  // ============================================

  /**
   * 设置元素状态
   * @param {string} state - 状态名称
   * @param {boolean} [enabled=true] - 是否启用该状态
   * @returns {this} 返回当前实例支持链式调用
   */
  setState(state, enabled = true) {
    if (enabled) {
      this._states.add(state);
    } else {
      this._states.delete(state);
    }
    this._applyStateStyles();
    return this;
  }

  /**
   * 检查元素是否处于某个状态
   * @param {string} state - 状态名称
   * @returns {boolean} 如果处于该状态返回 true
   */
  hasState(state) {
    return this._states.has(state);
  }

  /**
   * 获取当前所有状态
   * @returns {Set<string>} 返回所有状态的副本
   */
  getStates() {
    return new Set(this._states);
  }

  /**
   * 应用状态样式（由子类实现具体逻辑）
   * 默认实现：根据状态应用内联样式
   * @private
   */
  _applyStateStyles() {
    // 组件可以通过覆盖此方法来自定义状态样式的处理方式
    // 默认行为：应用 _stateStyles 中定义的样式
    for (const state of this._states) {
      const styles = this._stateStyles[state];
      if (styles) {
        this.styles(styles);
      }
    }
  }

  /**
   * 设置状态样式映射
   * @param {Object} stateStyles - 状态与样式的映射对象
   * @returns {this} 返回当前实例支持链式调用
   */
  setStateStyles(stateStyles) {
    this._stateStyles = { ...this._stateStyles, ...stateStyles };
    return this;
  }

  /**
   * 清除所有状态
   * @returns {this} 返回当前实例支持链式调用
   */
  clearStates() {
    this._states.clear();
    this._applyStateStyles();
    return this;
  }

  /**
   * 保存基础样式快照（用于状态变更时恢复）
   * @returns {this} 返回当前实例支持链式调用
   */
  saveBaseStylesSnapshot() {
    this._baseStyles = { ...this._styles };
    return this;
  }

  /**
   * 清空状态样式（恢复基础样式）
   * @returns {this} 返回当前实例支持链式调用
   */
  clearStateStyles() {
    if (!this._baseStyles) return this;

    // 清空 _el 的所有行内样式
    this._el.style.cssText = '';

    // 重新应用基础样式
    for (const [name, value] of Object.entries(this._baseStyles)) {
      this._el.style[name] = value;
    }

    // 重置虚拟样式
    this._styles = { ...this._baseStyles };

    return this;
  }

  /**
   * 转换为 HTML 字符串
   * @returns {string} 返回 HTML 字符串表示
   */
  toHTML() {
    if (this._deleted) return '';

    const attrs = Object.entries(this._attrs)
      .filter(([k]) => k !== 'deleted')
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');

    const styles = Object.entries(this._styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    const classes = Array.from(this._classes).join(' ');

    const tagStart = `<${this._tagName}${attrs ? ' ' + attrs : ''}${classes ? ' class="' + classes + '"' : ''}${styles ? ' style="' + styles + '"' : ''}>`;
    const tagEnd = `</${this._tagName}>`;

    const childrenHtml = this._children
      .filter(c => !c._deleted)
      .map(c => c.toHTML())
      .join('');

    const htmlContent = this._htmlContent || '';

    return tagStart + htmlContent + childrenHtml + tagEnd;
  }
}

/**
 * 创建简单的 Tag 子类（无额外方法）
 * @param {string} tagName - HTML 标签名
 * @param {string} className - 类名
 * @returns {Class} Tag 子类
 */
function createSimpleClass(tagName, className) {
  return class extends Tag {
    constructor(setup = null) {
      super(tagName, null);
      // 支持传入 '.class1.class2' 或 '#id' 作为简写
      if (typeof setup === 'string') {
        if (setup.startsWith('.')) {
          // .class1.class2 形式
          const classes = setup.slice(1).split('.').filter(Boolean);
          classes.forEach(c => this.className(c));
        } else if (setup.startsWith('#')) {
          // #id 形式
          this.id(setup.slice(1));
        } else {
          // 普通字符串，作为文本内容
          this.text(setup);
        }
        setup = null; // 已处理
      }
      // 执行 setup（函数或对象）
      if (setup !== null) {
        this.setup(setup);
      }
    }
    static get name() { return className; }
  };
}

/**
 * 批量创建简单元素类和工厂函数
 * @param {Object} definitions - 标签名到类名的映射
 * @returns {Object} 包含所有类和工厂函数的对象
 */
function createSimpleElements(definitions) {
  const result = {};
  for (const [tagName, className] of Object.entries(definitions)) {
    result[className] = createSimpleClass(tagName, className);
    // 创建工厂函数（小写类名）
    const factoryName = className.charAt(0).toLowerCase() + className.slice(1);
    // 支持 factory('.class', fn) 或 factory(fn) 或 factory('text')
    result[factoryName] = function(selectorOrSetup = null, setup = null) {
      // 处理 factory('.class', fn) 情况
      if (typeof selectorOrSetup === 'string' && typeof setup === 'function') {
        return new result[className]((el) => {
          // 先应用选择器
          if (selectorOrSetup.startsWith('.')) {
            const classes = selectorOrSetup.slice(1).split('.').filter(Boolean);
            classes.forEach(c => el.className(c));
          } else if (selectorOrSetup.startsWith('#')) {
            el.id(selectorOrSetup.slice(1));
          } else {
            el.text(selectorOrSetup);
          }
          // 再应用 setup 函数
          setup(el);
        });
      }
      // 其他情况直接传入
      return new result[className](selectorOrSetup);
    };
  }
  return result;
}

// ============================================
// 基础容器元素
// ============================================

const containerElements = createSimpleElements({
  div: 'Div',
  span: 'Span',
  p: 'P',
  section: 'Section',
  article: 'Article',
  header: 'Header',
  footer: 'Footer',
  nav: 'Nav',
  aside: 'Aside',
  main: 'Main',
  h1: 'H1',
  h2: 'H2',
  h3: 'H3',
  h4: 'H4',
  h5: 'H5',
  h6: 'H6'
});

const { Div, Span, P, Section, Article, Header, Footer, Nav, Aside, Main,
        H1, H2, H3, H4, H5, H6 } = containerElements;

// 工厂函数（直接引用）
const { div, span, p, section, article, header, footer, nav, aside, main,
        h1, h2, h3, h4, h5, h6 } = containerElements;

// ============================================
// Tag 原型扩展方法 - 基础容器
// 任何元素都可以使用这些方法添加子元素
// ============================================

/**
 * 创建支持两个参数的 Tag 原型方法
 * @param {string} methodName - 方法名（如 'div', 'h1'）
 * @param {Function} factoryFn - 工厂函数（如 div, h1）
 */
function createTagProtoMethod(methodName, factoryFn) {
  return function(selectorOrSetup = null, setup = null) {
    let finalSetup = selectorOrSetup;
    if (typeof selectorOrSetup === 'string' && setup !== null) {
      finalSetup = (el) => {
        if (selectorOrSetup.startsWith('.')) {
          const classes = selectorOrSetup.slice(1).split('.').filter(Boolean);
          classes.forEach(c => el.className(c));
        } else if (selectorOrSetup.startsWith('#')) {
          el.id(selectorOrSetup.slice(1));
        } else {
          el.text(selectorOrSetup);
        }
        if (typeof setup === 'function') {
          setup(el);
        }
      };
    } else if (typeof selectorOrSetup === 'string') {
      finalSetup = (el) => {
        if (selectorOrSetup.startsWith('.')) {
          const classes = selectorOrSetup.slice(1).split('.').filter(Boolean);
          classes.forEach(c => el.className(c));
        } else if (selectorOrSetup.startsWith('#')) {
          el.id(selectorOrSetup.slice(1));
        } else {
          el.text(selectorOrSetup);
        }
      };
    }
    const el = factoryFn(finalSetup);
    this.child(el);
    return this;
  };
}

// 批量创建 Tag 原型方法
Tag.prototype.div = createTagProtoMethod('div', div);
Tag.prototype.span = createTagProtoMethod('span', span);
Tag.prototype.p = createTagProtoMethod('p', p);
Tag.prototype.section = createTagProtoMethod('section', section);
Tag.prototype.article = createTagProtoMethod('article', article);
Tag.prototype.header = createTagProtoMethod('header', header);
Tag.prototype.footer = createTagProtoMethod('footer', footer);
Tag.prototype.nav = createTagProtoMethod('nav', nav);
Tag.prototype.aside = createTagProtoMethod('aside', aside);
Tag.prototype.main = createTagProtoMethod('main', main);
Tag.prototype.h1 = createTagProtoMethod('h1', h1);
Tag.prototype.h2 = createTagProtoMethod('h2', h2);
Tag.prototype.h3 = createTagProtoMethod('h3', h3);
Tag.prototype.h4 = createTagProtoMethod('h4', h4);
Tag.prototype.h5 = createTagProtoMethod('h5', h5);
Tag.prototype.h6 = createTagProtoMethod('h6', h6);

Tag.prototype.h2 = createTagProtoMethod('h2', h2);
Tag.prototype.h3 = createTagProtoMethod('h3', h3);
Tag.prototype.h4 = createTagProtoMethod('h4', h4);
Tag.prototype.h5 = createTagProtoMethod('h5', h5);
Tag.prototype.h6 = createTagProtoMethod('h6', h6);

// ============================================
// 文本格式化元素
// ============================================

// A 类 - 有特殊方法
class A extends Tag {
  constructor(setup = null) {
    super('a', setup);
  }

  href(value) {
    if (value === undefined) return this.attr('href');
    return this.attr('href', value);
  }

  target(value) {
    if (value === undefined) return this.attr('target');
    return this.attr('target', value);
  }
}

const textElements = createSimpleElements({
  strong: 'Strong',
  em: 'Em',
  code: 'Code',
  pre: 'Pre',
  blockquote: 'Blockquote'
});

const { Strong, Em, Code, Pre, Blockquote } = textElements;
const { strong, em, code, pre, blockquote } = textElements;

function a(setup = null) { return new A(setup); }

// ============================================
// Tag 原型扩展方法 - 文本格式化
// ============================================

Tag.prototype.a = createTagProtoMethod('a', a);
Tag.prototype.strong = createTagProtoMethod('strong', strong);
Tag.prototype.em = createTagProtoMethod('em', em);
Tag.prototype.code = createTagProtoMethod('code', code);
Tag.prototype.pre = createTagProtoMethod('pre', pre);
Tag.prototype.blockquote = createTagProtoMethod('blockquote', blockquote);

// ============================================
// 表单元素
// ============================================

class Button extends Tag {
  constructor(setup = null) {
    super('button', setup);
  }

  type(value) {
    if (value === undefined) return this.attr('type');
    return this.attr('type', value);
  }

  disabled(value) {
    if (value === undefined) return this.attr('disabled');
    return this.attr('disabled', value);
  }
}

Button.prototype.submit = function() {
  return this.type('submit');
};

Button.prototype.large = function() {
  return this.style('padding', '12px 24px').style('font-size', '16px');
};

class Input extends Tag {
  constructor(setup = null) {
    super('input', setup);
  }

  type(value) {
    if (value === undefined) return this.attr('type');
    return this.attr('type', value);
  }

  value(val) {
    if (val === undefined) return this.attr('value');
    return this.attr('value', val);
  }

  placeholder(value) {
    if (value === undefined) return this.attr('placeholder');
    return this.attr('placeholder', value);
  }

  disabled(value) {
    if (value === undefined) return this.attr('disabled');
    return this.attr('disabled', value);
  }

  readonly(value) {
    if (value === undefined) return this.attr('readonly');
    return this.attr('readonly', value);
  }

  focus() {
    if (this._el && typeof this._el.focus === 'function') {
      this._el.focus();
    }
    return this;
  }

  blur() {
    if (this._el && typeof this._el.blur === 'function') {
      this._el.blur();
    }
    return this;
  }

  // 事件便捷方法
  onChange(handler) {
    return this.on('change', handler);
  }

  onInput(handler) {
    return this.on('input', handler);
  }

  onFocus(handler) {
    return this.on('focus', handler);
  }

  onBlur(handler) {
    return this.on('blur', handler);
  }
}

class Textarea extends Tag {
  constructor(setup = null) {
    super('textarea', setup);
  }

  value(val) {
    if (val === undefined) return this.attr('value');
    return this.attr('value', val);
  }

  placeholder(value) {
    if (value === undefined) return this.attr('placeholder');
    return this.attr('placeholder', value);
  }

  rows(value) {
    if (value === undefined) return this.attr('rows');
    return this.attr('rows', value);
  }

  cols(value) {
    if (value === undefined) return this.attr('cols');
    return this.attr('cols', value);
  }

  disabled(value) {
    if (value === undefined) return this.attr('disabled');
    return this.attr('disabled', value);
  }

  // 事件便捷方法
  onChange(handler) {
    return this.on('change', handler);
  }

  onInput(handler) {
    return this.on('input', handler);
  }
}

class Select extends Tag {
  constructor(setup = null) {
    super('select', setup);
  }

  value(val) {
    if (val === undefined) return this.attr('value');
    return this.attr('value', val);
  }

  disabled(value) {
    if (value === undefined) return this.attr('disabled');
    return this.attr('disabled', value);
  }

  // 事件便捷方法
  onChange(handler) {
    return this.on('change', handler);
  }
}

class Option extends Tag {
  constructor(setup = null) {
    super('option', setup);
  }

  value(val) {
    if (val === undefined) return this.attr('value');
    return this.attr('value', val);
  }

  selected(value) {
    if (value === undefined) return this.attr('selected');
    return this.attr('selected', value);
  }

  disabled(value) {
    if (value === undefined) return this.attr('disabled');
    return this.attr('disabled', value);
  }
}

class Label extends Tag {
  constructor(setup = null) {
    super('label', setup);
  }

  for(value) {
    if (value === undefined) return this.attr('for');
    return this.attr('for', value);
  }
}

class Form extends Tag {
  constructor(setup = null) {
    super('form', setup);
  }

  action(value) {
    if (value === undefined) return this.attr('action');
    return this.attr('action', value);
  }

  method(value) {
    if (value === undefined) return this.attr('method');
    return this.attr('method', value);
  }

  enctype(value) {
    if (value === undefined) return this.attr('enctype');
    return this.attr('enctype', value);
  }
}

// 表单扩展方法
Select.prototype.option = createTagProtoMethod('option', option);
Form.prototype.input = createTagProtoMethod('input', input);
Form.prototype.button = createTagProtoMethod('button', button);
Form.prototype.textarea = createTagProtoMethod('textarea', textarea);
Form.prototype.select = createTagProtoMethod('select', select);

function button(setup = null) { return new Button(setup); }
function input(setup = null) { return new Input(setup); }
function textarea(setup = null) { return new Textarea(setup); }
function select(setup = null) { return new Select(setup); }
function option(setup = null) { return new Option(setup); }
function vOption(setup = null) { return new Option(setup); }
function label(setup = null) { return new Label(setup); }
function form(setup = null) { return new Form(setup); }

// ============================================
// Tag 原型扩展方法 - 表单
// ============================================

Tag.prototype.button = createTagProtoMethod('button', button);
Tag.prototype.input = createTagProtoMethod('input', input);
Tag.prototype.textarea = createTagProtoMethod('textarea', textarea);
Tag.prototype.select = createTagProtoMethod('select', select);
Tag.prototype.option = createTagProtoMethod('option', option);
Tag.prototype.label = createTagProtoMethod('label', label);
Tag.prototype.form = createTagProtoMethod('form', form);

// ============================================
// 列表元素
// ============================================

const listElements = createSimpleElements({
  ul: 'Ul',
  ol: 'Ol',
  li: 'Li',
  dl: 'Dl',
  dt: 'Dt',
  dd: 'Dd'
});

const { Ul, Ol, Li, Dl, Dt, Dd } = listElements;
const { ul, ol, li, dl, dt, dd } = listElements;

// 列表扩展方法
Ul.prototype.li = createTagProtoMethod('li', li);

Ol.prototype.li = createTagProtoMethod('li', li);
Dl.prototype.dt = createTagProtoMethod('dt', dt);
Dl.prototype.dd = createTagProtoMethod('dd', dd);

// ============================================
// Tag 原型扩展方法 - 列表
// ============================================

Tag.prototype.ul = createTagProtoMethod('ul', ul);
Tag.prototype.ol = createTagProtoMethod('ol', ol);
Tag.prototype.li = createTagProtoMethod('li', li);
Tag.prototype.dl = createTagProtoMethod('dl', dl);
Tag.prototype.dt = createTagProtoMethod('dt', dt);
Tag.prototype.dd = createTagProtoMethod('dd', dd);

// ============================================
// 表格元素
// ============================================

class Table extends Tag {
  constructor(setup = null) {
    super('table', setup);
  }
}

class Tr extends Tag {
  constructor(setup = null) {
    super('tr', setup);
  }
}

class Td extends Tag {
  constructor(setup = null) {
    super('td', setup);
  }

  colspan(value) {
    if (value === undefined) return this.attr('colspan');
    return this.attr('colspan', value);
  }

  rowspan(value) {
    if (value === undefined) return this.attr('rowspan');
    return this.attr('rowspan', value);
  }
}

class Th extends Tag {
  constructor(setup = null) {
    super('th', setup);
  }

  colspan(value) {
    if (value === undefined) return this.attr('colspan');
    return this.attr('colspan', value);
  }

  rowspan(value) {
    if (value === undefined) return this.attr('rowspan');
    return this.attr('rowspan', value);
  }

  scope(value) {
    if (value === undefined) return this.attr('scope');
    return this.attr('scope', value);
  }
}

const tableContainerElements = createSimpleElements({
  thead: 'Thead',
  tbody: 'Tbody',
  tfoot: 'Tfoot'
});

const { Thead, Tbody, Tfoot } = tableContainerElements;
const { thead, tbody, tfoot } = tableContainerElements;

function table(setup = null) { return new Table(setup); }
function tr(setup = null) { return new Tr(setup); }
function td(setup = null) { return new Td(setup); }
function th(setup = null) { return new Th(setup); }

// 表格扩展方法
Table.prototype.tr = createTagProtoMethod('tr', tr);
Tr.prototype.td = createTagProtoMethod('td', td);
Tr.prototype.th = createTagProtoMethod('th', th);
Thead.prototype.tr = createTagProtoMethod('tr', tr);
Tbody.prototype.tr = createTagProtoMethod('tr', tr);
Tfoot.prototype.tr = createTagProtoMethod('tr', tr);

// ============================================
// Tag 原型扩展方法 - 表格
// ============================================

Tag.prototype.table = createTagProtoMethod('table', table);
Tag.prototype.tr = createTagProtoMethod('tr', tr);
Tag.prototype.td = createTagProtoMethod('td', td);
Tag.prototype.th = createTagProtoMethod('th', th);
Tag.prototype.thead = createTagProtoMethod('thead', thead);
Tag.prototype.tbody = createTagProtoMethod('tbody', tbody);
Tag.prototype.tfoot = createTagProtoMethod('tfoot', tfoot);

// ============================================
// 媒体元素
// ============================================

class Img extends Tag {
  constructor(setup = null) {
    super('img', setup);
  }

  src(value) {
    if (value === undefined) return this.attr('src');
    return this.attr('src', value);
  }

  alt(value) {
    if (value === undefined) return this.attr('alt');
    return this.attr('alt', value);
  }

  width(value) {
    if (value === undefined) return this.attr('width');
    return this.attr('width', value);
  }

  height(value) {
    if (value === undefined) return this.attr('height');
    return this.attr('height', value);
  }
}

class Video extends Tag {
  constructor(setup = null) {
    super('video', setup);
  }

  src(value) {
    if (value === undefined) return this.attr('src');
    return this.attr('src', value);
  }

  width(value) {
    if (value === undefined) return this.attr('width');
    return this.attr('width', value);
  }

  height(value) {
    if (value === undefined) return this.attr('height');
    return this.attr('height', value);
  }

  controls(value) {
    if (value === undefined) return this.attr('controls');
    return this.attr('controls', value);
  }

  autoplay(value) {
    if (value === undefined) return this.attr('autoplay');
    return this.attr('autoplay', value);
  }

  loop(value) {
    if (value === undefined) return this.attr('loop');
    return this.attr('loop', value);
  }
}

class Audio extends Tag {
  constructor(setup = null) {
    super('audio', setup);
  }

  src(value) {
    if (value === undefined) return this.attr('src');
    return this.attr('src', value);
  }

  controls(value) {
    if (value === undefined) return this.attr('controls');
    return this.attr('controls', value);
  }

  autoplay(value) {
    if (value === undefined) return this.attr('autoplay');
    return this.attr('autoplay', value);
  }

  loop(value) {
    if (value === undefined) return this.attr('loop');
    return this.attr('loop', value);
  }
}

class Source extends Tag {
  constructor(setup = null) {
    super('source', setup);
  }

  src(value) {
    if (value === undefined) return this.attr('src');
    return this.attr('src', value);
  }

  type(value) {
    if (value === undefined) return this.attr('type');
    return this.attr('type', value);
  }
}

function img(setup = null) { return new Img(setup); }
function video(setup = null) { return new Video(setup); }
function audio(setup = null) { return new Audio(setup); }
function source(setup = null) { return new Source(setup); }

// ============================================
// Tag 原型扩展方法 - 媒体
// ============================================

Tag.prototype.img = createTagProtoMethod('img', img);
Tag.prototype.video = createTagProtoMethod('video', video);
Tag.prototype.audio = createTagProtoMethod('audio', audio);
Tag.prototype.source = createTagProtoMethod('source', source);

// ============================================
// 其他元素
// ============================================

const otherElements = createSimpleElements({
  br: 'Br',
  hr: 'Hr'
});

const { Br, Hr } = otherElements;
const { br, hr } = otherElements;

// ============================================
// Tag 原型扩展方法 - 其他
// ============================================

Tag.prototype.br = createTagProtoMethod('br', br);
Tag.prototype.hr = createTagProtoMethod('hr', hr);

// ============================================
// IFrame, Canvas 元素
// ============================================

class IFrame extends Tag {
  constructor(setup = null) {
    super('iframe', setup);
  }

  src(value) {
    if (value === undefined) return this.attr('src');
    return this.attr('src', value);
  }

  width(value) {
    if (value === undefined) return this.attr('width');
    return this.attr('width', value);
  }

  height(value) {
    if (value === undefined) return this.attr('height');
    return this.attr('height', value);
  }

  frameborder(value) {
    if (value === undefined) return this.attr('frameborder');
    return this.attr('frameborder', value);
  }
}

class Canvas extends Tag {
  constructor(setup = null) {
    super('canvas', setup);
  }

  width(value) {
    if (value === undefined) return this.attr('width');
    return this.attr('width', value);
  }

  height(value) {
    if (value === undefined) return this.attr('height');
    return this.attr('height', value);
  }
}

function iframe(setup = null) { return new IFrame(setup); }
function canvas(setup = null) { return new Canvas(setup); }

// ============================================
// Tag 原型扩展方法 - IFrame, Canvas
// ============================================

Tag.prototype.iframe = createTagProtoMethod('iframe', iframe);
Tag.prototype.canvas = createTagProtoMethod('canvas', canvas);

// ============================================
// 通用 tag 工厂函数
// ============================================

function tag(name, setup = null) {
  return new Tag(name, setup);
}

// ============================================
// Text 文本节点封装
// ============================================

/**
 * Text - 文本节点封装
 * 注意：Text 不是真正的 DOM 元素，所以不使用 super() 创建
 * 而是继承 Tag 并在 renderDom 时创建文本节点
 */
class Text extends Tag {
  constructor(content = '', setup = null) {
    // 使用 'span' 作为占位标签名，避免 createElement('#text') 错误
    super('span');
    this._tagName = '#text';  // 覆盖为正确的 tagName
    this._content = '';

    // 设置内容
    if (typeof content === 'string' || typeof content === 'number') {
      this._content = String(content);
    } else if (typeof content === 'function') {
      setup = content;
    }

    // 执行 setup
    if (setup !== null) {
      if (typeof setup === 'function') {
        setup(this);
      } else if (typeof setup === 'object' && setup !== null) {
        this._setupObject(setup);
      }
    }
  }

  content(value) {
    if (value === undefined) return this._content;
    this._content = String(value);
    return this;
  }

  renderDom() {
    if (this._deleted) return null;
    this._el.textContent = this._content;
    this._rendered = true;
    return this._el;
  }

  toHTML() {
    return this._content || '';
  }
}

function text(content) {
  return new Text(content);
}

// ============================================
// 导出
// ============================================

export {
  // 基类
  Tag,

  // 基础容器
  Div, Span, P, Section, Article, Header, Footer, Nav, Aside, Main,
  H1, H2, H3, H4, H5, H6,

  // 文本格式化
  A, Strong, Em, Code, Pre, Blockquote,

  // 表单
  Button, Input, Textarea, Select, Option, Label, Form,

  // 列表
  Ul, Ol, Li, Dl, Dt, Dd,

  // 表格
  Table, Tr, Td, Th, Thead, Tbody, Tfoot,

  // 媒体
  Img, Video, Audio, Source,

  // 其他
  Br, Hr, IFrame, Canvas,

  // 工厂函数
  div, span, p, section, article, header, footer, nav, aside, main,
  h1, h2, h3, h4, h5, h6,
  a, strong, em, code, pre, blockquote,
  button, input, textarea, select, option, vOption, label, form,
  ul, ol, li, dl, dt, dd,
  table, tr, td, th, thead, tbody, tfoot,
  img, video, audio, source,
  br, hr, iframe, canvas,
  text,
  tag
};
