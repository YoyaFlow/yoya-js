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
    setupFn(this);
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
      } else {
        this.className(config.class);
      }
    }

    // 处理 className（别名）
    if (config.className) {
      if (Array.isArray(config.className)) {
        this.className(...config.className);
      } else {
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
    const textTag = new Text$1(content);
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
        this._el.checked = true;
        break;
      case 'selected':
        this._el.selected = true;
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
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(handler);
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
    const oldValue = this.value?.();
    this.on('change', this._wrapHandler(handler, (e) => {
      const newValue = this.value?.() || e.target?.value;
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

    // 首次渲染时应用事件
    if (!this._rendered) {
      this._applyEventsToEl();
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
   * 将事件同步到 DOM 元素（仅在首次渲染时调用）
   * @private
   */
  _applyEventsToEl() {
    for (const [event, handlers] of Object.entries(this._events)) {
      if (handlers.length === 0) continue;

      // 绑定一个包装处理器，统一分发事件
      this._el.addEventListener(event, (nativeEvent) => {
        // 为原生事件对象附加_vnode 属性，指向虚拟元素
        nativeEvent._vnode = this;
        // 分发所有处理器，绑定 this 到 DOM 元素
        handlers.forEach(handler => handler.call(this._el, nativeEvent));
      });
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
let Text$1 = class Text extends Tag {
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
};

function text(content) {
  return new Text$1(content);
}

/**
 * Yoya.Basic - Theme System
 * 主题系统：基于状态机的样式管理机制
 * 支持 boolean、string、number 多种状态值类型
 * @module Yoya.Theme
 */

// 注意：不在这里导入 Tag，而是在 initTagExtensions 中动态获取
// 这是为了避免循环依赖问题

// ============================================
// 状态处理器注册表
// ============================================

/**
 * 主题注册表
 * 存储每个组件类型的状态处理器
 * @type {Map<string, Theme>}
 */
const themeRegistry = new Map();

/**
 * 全局主题配置
 * @type {Object}
 */
let globalTheme = {
  components: {}
};

// ============================================
// StateMachine 状态机类
// ============================================

/**
 * 状态值类型定义
 * @typedef {boolean | string | number} StateValue
 */

/**
 * StateMachine 状态机类
 * 用于管理组件的状态（如 disabled, active, size 等）
 * @class
 */
class StateMachine {
  /**
   * 创建 StateMachine 实例
   * @param {Tag} host - 宿主元素（Tag 实例）
   * @param {Array<string|Object>} [stateAttrs=[]] - 状态属性列表
   */
  constructor(host, stateAttrs = []) {
    this._host = host;           // 宿主元素（Tag 实例）
    this._stateAttrs = new Set(stateAttrs);  // 关注的状态属性列表
    this._currentState = {};     // 当前状态值 { disabled: true, size: 'medium', count: 1 }
    this._handlers = new Map();  // 状态处理器 { stateName: [handler1, handler2] }
    this._interceptors = [];     // 拦截器列表
    this._initialized = false;
    this._snapshots = {};        // 状态快照（用于恢复）
    this._stateTypes = {};       // 状态类型定义 { size: 'string', count: 'number' }
  }

  /**
   * 注册状态属性
   * @param {...string|Object} attrs - 状态属性名，或状态类型定义对象
   * @returns {this}
   * @example
   * registerStateAttrs('disabled', 'active')
   * registerStateAttrs({ size: 'string', count: 'number' })
   * registerStateAttrs('disabled', { size: 'string' })
   */
  registerStateAttrs(...attrs) {
    attrs.forEach(attr => {
      if (typeof attr === 'string') {
        this._stateAttrs.add(attr);
        // 默认为 boolean 类型
        this._stateTypes[attr] = 'boolean';
      } else if (typeof attr === 'object' && attr !== null) {
        // 支持类型定义对象
        for (const [name, type] of Object.entries(attr)) {
          this._stateAttrs.add(name);
          this._stateTypes[name] = type || 'boolean';
        }
      }
    });
    return this;
  }

  /**
   * 获取注册的状态属性列表
   * @returns {string[]}
   */
  getStateAttrs() {
    return Array.from(this._stateAttrs);
  }

  /**
   * 获取状态类型定义
   * @param {string} stateName - 状态名
   * @returns {string} 'boolean' | 'string' | 'number'
   */
  getStateType(stateName) {
    return this._stateTypes[stateName] || 'boolean';
  }

  /**
   * 注册状态处理器
   * @param {string} stateName - 状态名
   * @param {Function} handler - 处理函数 (value: StateValue, host: Tag, oldValue?: StateValue) => void
   * @returns {this}
   */
  registerHandler(stateName, handler) {
    if (!this._handlers.has(stateName)) {
      this._handlers.set(stateName, []);
    }
    this._handlers.get(stateName).push(handler);
    return this;
  }

  /**
   * 移除状态处理器
   * @param {string} stateName - 状态名
   * @param {Function} handler - 要移除的处理函数
   * @returns {this}
   */
  removeHandler(stateName, handler) {
    if (this._handlers.has(stateName)) {
      const handlers = this._handlers.get(stateName);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
    return this;
  }

  /**
   * 注册状态变更拦截器
   * @param {Function} interceptor - (stateName: string, value: StateValue) => { stateName, value } | null
   * @returns {this}
   */
  registerInterceptor(interceptor) {
    this._interceptors.push(interceptor);
    return this;
  }

  /**
   * 移除拦截器
   * @param {Function} interceptor
   * @returns {this}
   */
  removeInterceptor(interceptor) {
    const index = this._interceptors.indexOf(interceptor);
    if (index > -1) {
      this._interceptors.splice(index, 1);
    }
    return this;
  }

  /**
   * 设置状态
   * @param {string} stateName - 状态名
   * @param {StateValue} value - 状态值（boolean/string/number）
   * @returns {this}
   */
  setState(stateName, value) {
    // 检查是否是注册的状态属性
    if (!this._stateAttrs.has(stateName)) {
      console.warn(`State "${stateName}" is not registered. Call registerStateAttrs() first.`);
    }

    // 执行拦截器
    let newStateName = stateName;
    let newValue = value;
    for (const interceptor of this._interceptors) {
      const result = interceptor(newStateName, newValue);
      if (result === null) {
        return this;  // 拦截器返回 null 表示取消操作
      }
      newStateName = result.stateName;
      newValue = result.value;
    }

    // 状态未变化则跳过
    if (this._currentState[newStateName] === newValue) {
      return this;
    }

    // 保存旧值
    const oldValue = this._currentState[newStateName];

    // 更新状态
    this._currentState[newStateName] = newValue;

    // 执行状态处理器（传入新值和旧值）
    this._executeHandlers(newStateName, newValue, oldValue);

    return this;
  }

  /**
   * 设置 boolean 状态（快捷方法）
   * @param {string} stateName - 状态名
   * @param {boolean} enabled - 是否启用
   * @returns {this}
   */
  setBooleanState(stateName, enabled = true) {
    return this.setState(stateName, enabled);
  }

  /**
   * 设置 string 状态（快捷方法）
   * @param {string} stateName - 状态名
   * @param {string} value - 字符串值
   * @returns {this}
   */
  setStringState(stateName, value) {
    return this.setState(stateName, value);
  }

  /**
   * 设置 number 状态（快捷方法）
   * @param {string} stateName - 状态名
   * @param {number} value - 数值
   * @returns {this}
   */
  setNumberState(stateName, value) {
    return this.setState(stateName, value);
  }

  /**
   * 获取状态值
   * @param {string} stateName
   * @returns {StateValue}
   */
  getState(stateName) {
    return this._currentState[stateName];
  }

  /**
   * 获取布尔状态值
   * @param {string} stateName
   * @returns {boolean}
   */
  getBooleanState(stateName) {
    return !!this._currentState[stateName];
  }

  /**
   * 获取字符串状态值
   * @param {string} stateName
   * @returns {string}
   */
  getStringState(stateName) {
    return String(this._currentState[stateName] || '');
  }

  /**
   * 获取数值状态值
   * @param {string} stateName
   * @returns {number}
   */
  getNumberState(stateName) {
    const val = this._currentState[stateName];
    return typeof val === 'number' ? val : 0;
  }

  /**
   * 获取所有状态
   * @returns {Object}
   */
  getAllStates() {
    return { ...this._currentState };
  }

  /**
   * 检查是否处于某个状态（仅适用于 boolean 状态）
   * @param {string} stateName
   * @returns {boolean}
   */
  hasState(stateName) {
    return !!this._currentState[stateName];
  }

  /**
   * 执行状态处理器
   * @param {string} stateName
   * @param {StateValue} newValue
   * @param {StateValue} oldValue
   * @private
   */
  _executeHandlers(stateName, newValue, oldValue) {
    // 执行该状态的所有处理器
    const handlers = this._handlers.get(stateName) || [];
    handlers.forEach(handler => {
      try {
        handler(newValue, this._host, oldValue);
      } catch (error) {
        console.error(`State handler error for "${stateName}":`, error);
      }
    });

    // 执行全局主题处理器（如果有）
    const themeHandler = globalTheme.components[this._host.constructor.name];
    if (themeHandler && typeof themeHandler === 'function') {
      try {
        themeHandler(this._host, stateName, newValue, oldValue);
      } catch (error) {
        console.error(`Theme handler error for "${stateName}":`, error);
      }
    }
  }

  /**
   * 保存当前状态快照
   * @param {string} snapshotName - 快照名
   * @returns {this}
   */
  saveSnapshot(snapshotName = 'default') {
    this._snapshots[snapshotName] = { ...this._currentState };
    return this;
  }

  /**
   * 恢复状态快照
   * @param {string} snapshotName - 快照名
   * @returns {this}
   */
  restoreSnapshot(snapshotName = 'default') {
    const snapshot = this._snapshots[snapshotName];
    if (!snapshot) {
      console.warn(`Snapshot "${snapshotName}" not found.`);
      return this;
    }

    // 恢复每个状态
    for (const [stateName, value] of Object.entries(snapshot)) {
      this.setState(stateName, value);
    }
    return this;
  }

  /**
   * 初始化状态（设置默认值）
   * @param {Object} defaultStates - 默认状态 { disabled: false, size: 'medium', count: 0 }
   * @returns {this}
   */
  initialize(defaultStates = {}) {
    if (this._initialized) {
      return this;
    }

    // 保存初始状态快照
    this.saveSnapshot('initial');

    // 设置默认状态
    for (const [stateName, value] of Object.entries(defaultStates)) {
      if (this._stateAttrs.has(stateName)) {
        this._currentState[stateName] = value;
        this._executeHandlers(stateName, value, undefined);
      }
    }

    this._initialized = true;
    return this;
  }

  /**
   * 恢复到初始化前的状态
   * @returns {this}
   */
  deinitialize() {
    this.restoreSnapshot('initial');
    this._initialized = false;
    return this;
  }

  /**
   * 重置所有状态
   * @returns {this}
   */
  reset() {
    for (const stateName of this._stateAttrs) {
      const type = this._stateTypes[stateName];
      let defaultValue;
      switch (type) {
        case 'boolean':
          defaultValue = false;
          break;
        case 'string':
          defaultValue = '';
          break;
        case 'number':
          defaultValue = 0;
          break;
        default:
          defaultValue = null;
      }
      this.setState(stateName, defaultValue);
    }
    return this;
  }

  /**
   * 销毁状态机
   */
  destroy() {
    this._handlers.clear();
    this._interceptors = [];
    this._currentState = {};
    this._snapshots = {};
    this._stateTypes = {};
    this._initialized = false;
  }
}

// ============================================
// Theme 主题类
// ============================================

/**
 * Theme 主题类
 * 用于定义和管理组件的状态样式和处理器
 * @class
 */
class Theme {
  /**
   * 创建 Theme 实例
   * @param {string} [name='default'] - 主题名称
   */
  constructor(name = 'default') {
    this.name = name;
    this.stateStyles = {};      // { disabled: { opacity: '0.5' } }
    this.stateHandlers = {};    // { disabled: (enabled, host) => {} }
    this.componentThemes = {};  // { MenuItem: { stateStyles: {}, handlers: {} } }
  }

  /**
   * 设置组件的状态样式
   * @param {string} componentName - 组件名
   * @param {string} stateName - 状态名
   * @param {Object} styles - 样式对象
   * @returns {this} 返回当前实例支持链式调用
   */
  setComponentStateStyles(componentName, stateName, styles) {
    if (!this.componentThemes[componentName]) {
      this.componentThemes[componentName] = {
        stateStyles: {},
        handlers: {}
      };
    }
    this.componentThemes[componentName].stateStyles[stateName] = styles;
    return this;
  }

  /**
   * 设置组件的状态处理器
   * @param {string} componentName - 组件名
   * @param {string} stateName - 状态名
   * @param {Function} handler - 处理函数 (value, host, oldValue) => void
   * @returns {this} 返回当前实例支持链式调用
   */
  setComponentStateHandler(componentName, stateName, handler) {
    if (!this.componentThemes[componentName]) {
      this.componentThemes[componentName] = {
        stateStyles: {},
        handlers: {}
      };
    }
    this.componentThemes[componentName].handlers[stateName] = handler;
    return this;
  }

  /**
   * 注册主题到注册表
   * @returns {this} 返回当前实例支持链式调用
   */
  register() {
    themeRegistry.set(this.name, this);
    return this;
  }

  /**
   * 应用主题到组件
   * @param {Tag} component - 组件实例
   */
  applyToComponent(component) {
    const componentName = component.constructor.name;
    const theme = this.componentThemes[componentName];
    if (!theme) return;

    // 为组件注册状态样式处理器
    for (const [stateName, styles] of Object.entries(theme.stateStyles)) {
      component.registerStateHandler(stateName, (value) => {
        if (value) {
          component.styles(styles);
        } else {
          this._removeStyles(component, styles);
        }
      });
    }

    // 注册自定义处理器
    for (const [stateName, handler] of Object.entries(theme.handlers)) {
      component.registerStateHandler(stateName, handler);
    }
  }

  /**
   * 移除样式（辅助方法）
   * @private
   * @param {Tag} component - 组件实例
   * @param {Object} styles - 样式对象
   */
  _removeStyles(component, styles) {
    for (const name of Object.keys(styles)) {
      component.style(name, '');
    }
  }
}

// ============================================
// 主题管理器
// ============================================

/**
 * ThemeManager 主题管理器
 * 用于注册和管理多个主题
 * @class
 */
class ThemeManager {
  /**
   * 创建 ThemeManager 实例
   */
  constructor() {
    this._currentTheme = null;
    this._themes = new Map();
  }

  /**
   * 注册主题
   * @param {Theme} theme - 主题实例
   * @returns {this} 返回当前实例支持链式调用
   */
  registerTheme(theme) {
    this._themes.set(theme.name, theme);
    return this;
  }

  /**
   * 获取主题
   * @param {string} name - 主题名称
   * @returns {Theme|undefined} 主题实例或 undefined
   */
  getTheme(name) {
    return this._themes.get(name);
  }

  /**
   * 设置当前主题
   * @param {string} name - 主题名称
   * @returns {this} 返回当前实例支持链式调用
   */
  setTheme(name) {
    const theme = this._themes.get(name);
    if (!theme) {
      console.warn(`Theme "${name}" not found.`);
      return this;
    }
    this._currentTheme = theme;
    return this;
  }

  /**
   * 获取当前主题
   * @returns {Theme|null} 当前主题实例或 null
   */
  getCurrentTheme() {
    return this._currentTheme;
  }

  /**
   * 应用当前主题到组件
   * @param {Tag} component - 组件实例
   * @returns {this} 返回当前实例支持链式调用
   */
  applyTheme(component) {
    if (this._currentTheme) {
      this._currentTheme.applyToComponent(component);
    }
    return this;
  }

  /**
   * 应用所有已注册主题到组件
   * @param {Tag} component - 组件实例
   * @returns {this} 返回当前实例支持链式调用
   */
  applyAllThemes(component) {
    for (const theme of this._themes.values()) {
      theme.applyToComponent(component);
    }
    return this;
  }
}

// ============================================
// 创建全局单例
// ============================================

/**
 * themeManager 全局主题管理器单例
 * @type {ThemeManager}
 */
const themeManager = new ThemeManager();

// ============================================
// 辅助函数
// ============================================

/**
 * 快速创建主题
 * @param {string} name - 主题名称
 * @param {Object} definitions - 主题定义 { componentName: { stateName: { styles } } }
 * @returns {Theme} 主题实例
 * @example
 * const theme = createTheme('dark', {
 *   MenuItem: {
 *     disabled: { opacity: '0.5' },
 *     active: { background: 'blue' }
 *   }
 * });
 */
function createTheme(name, definitions = {}) {
  const theme = new Theme(name);

  // definitions 格式：
  // {
  //   MenuItem: {
  //     disabled: { opacity: '0.5' },
  //     active: { background: 'blue' }
  //   }
  // }
  for (const [componentName, stateStyles] of Object.entries(definitions)) {
    for (const [stateName, styles] of Object.entries(stateStyles)) {
      theme.setComponentStateStyles(componentName, stateName, styles);
    }
  }

  return theme;
}

/**
 * 快速注册状态处理器
 * @param {string} themeName - 主题名称
 * @param {string} componentName - 组件名称
 * @param {string} stateName - 状态名称
 * @param {Function} handler - 处理函数 (value, host, oldValue) => void
 * @returns {Theme} 主题实例
 */
function registerStateHandler(themeName, componentName, stateName, handler) {
  let theme = themeManager.getTheme(themeName);
  if (!theme) {
    theme = new Theme(themeName);
    themeManager.registerTheme(theme);
  }
  theme.setComponentStateHandler(componentName, stateName, handler);
  return theme;
}

// ============================================
// Tag 原型扩展 - 在模块加载时自动执行
// ============================================

/**
 * 为 Tag 组件添加状态机支持
 * @param {Array<string|Object>} [stateAttrs=[]] - 状态属性列表
 * @returns {Function} 初始化函数
 */
function initStateMachine(stateAttrs = []) {
  return function() {
    this._stateMachine = new StateMachine(this, stateAttrs);
    return this;
  };
}

/**
 * 初始化 Tag 原型扩展方法
 * 需要在 Tag 定义后调用
 * @param {Tag} TagClass - Tag 类
 * @returns {boolean} 是否初始化成功
 */
function initTagExtensions(TagClass) {
  if (!TagClass || typeof TagClass.prototype === 'undefined') {
    console.warn('TagClass is not defined.');
    return false;
  }

  // 检查是否已经初始化
  if (TagClass.prototype._stateExtensionsInitialized) {
    return true;
  }

  /**
   * 注册状态属性（支持类型定义）
   * @param {...string|Object} attrs - 状态属性名或类型定义对象
   * @returns {this} 返回当前实例支持链式调用
   */
  TagClass.prototype.registerStateAttrs = function(...attrs) {
    if (!this._stateMachine) {
      this._stateMachine = new StateMachine(this, attrs);
    } else {
      this._stateMachine.registerStateAttrs(...attrs);
    }
    return this;
  };

  /**
   * 注册状态处理器
   * @param {string} stateName - 状态名称
   * @param {Function} handler - 处理函数 (value, host, oldValue) => void
   * @returns {this} 返回当前实例支持链式调用
   */
  TagClass.prototype.registerStateHandler = function(stateName, handler) {
    if (!this._stateMachine) {
      console.warn('State machine not initialized. Call registerStateAttrs() first.');
      return this;
    }
    this._stateMachine.registerHandler(stateName, handler);
    return this;
  };

  /**
   * 设置状态（支持 boolean/string/number）
   * @param {string} stateName - 状态名称
   * @param {StateValue} value - 状态值
   * @returns {this} 返回当前实例支持链式调用
   */
  TagClass.prototype.setState = function(stateName, value) {
    if (!this._stateMachine) {
      console.warn('State machine not initialized.');
      return this;
    }
    this._stateMachine.setState(stateName, value);
    return this;  // 返回 Tag 实例，支持链式调用
  };

  /**
   * 获取状态值
   * @param {string} stateName - 状态名称
   * @returns {StateValue|undefined} 状态值
   */
  TagClass.prototype.getState = function(stateName) {
    if (!this._stateMachine) {
      return undefined;
    }
    return this._stateMachine.getState(stateName);
  };

  /**
   * 获取布尔状态值
   * @param {string} stateName - 状态名称
   * @returns {boolean} 布尔状态值
   */
  TagClass.prototype.getBooleanState = function(stateName) {
    if (!this._stateMachine) {
      return false;
    }
    return this._stateMachine.getBooleanState(stateName);
  };

  /**
   * 获取字符串状态值
   * @param {string} stateName - 状态名称
   * @returns {string} 字符串状态值
   */
  TagClass.prototype.getStringState = function(stateName) {
    if (!this._stateMachine) {
      return '';
    }
    return this._stateMachine.getStringState(stateName);
  };

  /**
   * 获取数值状态值
   * @param {string} stateName - 状态名称
   * @returns {number} 数值状态值
   */
  TagClass.prototype.getNumberState = function(stateName) {
    if (!this._stateMachine) {
      return 0;
    }
    return this._stateMachine.getNumberState(stateName);
  };

  /**
   * 检查状态（适用于 boolean）
   * @param {string} stateName - 状态名称
   * @returns {boolean} 是否处于该状态
   */
  TagClass.prototype.hasState = function(stateName) {
    if (!this._stateMachine) {
      return false;
    }
    return this._stateMachine.hasState(stateName);
  };

  /**
   * 获取所有状态
   * @returns {Object} 所有状态对象
   */
  TagClass.prototype.getAllStates = function() {
    if (!this._stateMachine) {
      return {};
    }
    return this._stateMachine.getAllStates();
  };

  /**
   * 重置所有状态
   * @returns {this} 返回当前实例支持链式调用
   */
  TagClass.prototype.resetStates = function() {
    if (!this._stateMachine) {
      return this;
    }
    return this._stateMachine.reset();
  };

  /**
   * 保存状态快照
   * @param {string} [name='default'] - 快照名称
   * @returns {this} 返回当前实例支持链式调用
   */
  TagClass.prototype.saveStateSnapshot = function(name = 'default') {
    if (!this._stateMachine) {
      return this;
    }
    return this._stateMachine.saveSnapshot(name);
  };

  /**
   * 恢复状态快照
   * @param {string} [name='default'] - 快照名称
   * @returns {this} 返回当前实例支持链式调用
   */
  TagClass.prototype.restoreStateSnapshot = function(name = 'default') {
    if (!this._stateMachine) {
      return this;
    }
    return this._stateMachine.restoreSnapshot(name);
  };

  /**
   * 初始化状态（设置默认值）
   * @param {Object} [defaultStates={}] - 默认状态对象
   * @returns {this} 返回当前实例支持链式调用
   */
  TagClass.prototype.initializeStates = function(defaultStates = {}) {
    if (!this._stateMachine) {
      this._stateMachine = new StateMachine(this);
    }
    return this._stateMachine.initialize(defaultStates);
  };

  /**
   * 反初始化（恢复初始状态）
   * @returns {this} 返回当前实例支持链式调用
   */
  TagClass.prototype.deinitializeStates = function() {
    if (!this._stateMachine) {
      return this;
    }
    return this._stateMachine.deinitialize();
  };

  /**
   * 注册状态拦截器
   * @param {Function} interceptor - 拦截函数 (stateName, value) => { stateName, value } | null
   * @returns {this} 返回当前实例支持链式调用
   */
  TagClass.prototype.registerStateInterceptor = function(interceptor) {
    if (!this._stateMachine) {
      this._stateMachine = new StateMachine(this);
    }
    this._stateMachine.registerInterceptor(interceptor);
    return this;
  };

  TagClass.prototype._stateExtensionsInitialized = true;
  return true;
}

/**
 * Yoya.Basic - Layout Components
 * 提供常用布局组件（Flex, Grid, Stack 等）
 * @module Yoya.Layout
 */


// ============================================
// Flex 布局容器
// ============================================

/**
 * Flex 弹性布局容器
 * @class
 * @extends Tag
 * @example
 * flex(f => {
 *   f.justifyCenter().alignCenter();
 *   f.div('项目 1');
 *   f.div('项目 2');
 * });
 */
class Flex extends Tag {
  /**
   * 创建 Flex 布局容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'flex');
  }

  /**
   * 设置主轴方向为 row
   * @returns {this} 返回当前实例支持链式调用
   */
  row() {
    return this.style('flexDirection', 'row');
  }

  /**
   * 设置主轴方向为 column
   * @returns {this} 返回当前实例支持链式调用
   */
  column() {
    return this.style('flexDirection', 'column');
  }

  /**
   * 设置主轴方向为 row-reverse
   * @returns {this} 返回当前实例支持链式调用
   */
  rowReverse() {
    return this.style('flexDirection', 'row-reverse');
  }

  /**
   * 设置主轴方向为 column-reverse
   * @returns {this} 返回当前实例支持链式调用
   */
  columnReverse() {
    return this.style('flexDirection', 'column-reverse');
  }

  /**
   * 设置主轴对齐方式
   * @param {string} value - justify-content 值
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyContent(value) {
    return this.style('justifyContent', value);
  }

  /**
   * 主轴起点对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyStart() {
    return this.justifyContent('flex-start');
  }

  /**
   * 主轴终点对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyEnd() {
    return this.justifyContent('flex-end');
  }

  /**
   * 主轴居中对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyCenter() {
    return this.justifyContent('center');
  }

  /**
   * 主轴两端对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyBetween() {
    return this.justifyContent('space-between');
  }

  /**
   * 主轴环绕对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyAround() {
    return this.justifyContent('space-around');
  }

  /**
   * 主轴均匀分布
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyEvenly() {
    return this.justifyContent('space-evenly');
  }

  /**
   * 设置交叉轴对齐方式
   * @param {string} value - align-items 值
   * @returns {this} 返回当前实例支持链式调用
   */
  alignItems(value) {
    return this.style('alignItems', value);
  }

  /**
   * 交叉轴起点对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  alignStart() {
    return this.alignItems('flex-start');
  }

  /**
   * 交叉轴终点对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  alignEnd() {
    return this.alignItems('flex-end');
  }

  /**
   * 交叉轴居中对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  alignCenter() {
    return this.alignItems('center');
  }

  /**
   * 交叉轴拉伸（默认）
   * @returns {this} 返回当前实例支持链式调用
   */
  alignStretch() {
    return this.alignItems('stretch');
  }

  /**
   * 交叉轴基线对齐
   * @returns {this} 返回当前实例支持链式调用
   */
  alignBaseline() {
    return this.alignItems('baseline');
  }

  /**
   * 设置换行行为
   * @param {string} [value='wrap'] - flex-wrap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  wrap(value = 'wrap') {
    return this.style('flexWrap', value);
  }

  /**
   * 不换行
   * @returns {this} 返回当前实例支持链式调用
   */
  noWrap() {
    return this.style('flexWrap', 'nowrap');
  }

  /**
   * 设置子元素间距
   * @param {string} value - gap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gap(value) {
    return this.style('gap', value);
  }
}

/**
 * 创建 Flex 布局容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Flex} Flex 实例
 */
function flex(setup = null) {
  return new Flex(setup);
}

// ============================================
// Grid 布局容器
// ============================================

/**
 * Grid 网格布局容器
 * @class
 * @extends Tag
 */
class Grid extends Tag {
  /**
   * 创建 Grid 布局容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'grid');
  }

  /**
   * 设置网格列模板
   * @param {string} value - grid-template-columns 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gridTemplateColumns(value) {
    return this.style('gridTemplateColumns', value);
  }

  /**
   * 设置列数和每列大小
   * @param {number} count - 列数
   * @param {string} [size='1fr'] - 每列大小
   * @returns {this} 返回当前实例支持链式调用
   */
  columns(count, size = '1fr') {
    return this.gridTemplateColumns(`repeat(${count}, ${size})`);
  }

  /**
   * 设置网格行模板
   * @param {string} value - grid-template-rows 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gridTemplateRows(value) {
    return this.style('gridTemplateRows', value);
  }

  /**
   * 设置行数和每行大小
   * @param {number} count - 行数
   * @param {string} [size='1fr'] - 每行大小
   * @returns {this} 返回当前实例支持链式调用
   */
  rows(count, size = '1fr') {
    return this.gridTemplateRows(`repeat(${count}, ${size})`);
  }

  /**
   * 设置列间距
   * @param {string} value - column-gap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  columnGap(value) {
    return this.style('columnGap', value);
  }

  /**
   * 设置行间距
   * @param {string} value - row-gap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  rowGap(value) {
    return this.style('rowGap', value);
  }

  /**
   * 设置间距（行列间距相同）
   * @param {string} value - gap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gap(value) {
    return this.style('gap', value);
  }

  /**
   * 设置主轴对齐方式
   * @param {string} value - justify-content 值
   * @returns {this} 返回当前实例支持链式调用
   */
  justifyContent(value) {
    return this.style('justifyContent', value);
  }

  /**
   * 设置交叉轴对齐方式
   * @param {string} value - align-items 值
   * @returns {this} 返回当前实例支持链式调用
   */
  alignItems(value) {
    return this.style('alignItems', value);
  }

  /**
   * 设置网格区域
   * @param {string} value - grid-area 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gridArea(value) {
    return this.style('gridArea', value);
  }

  /**
   * 添加 div 子元素
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this} 返回当前实例支持链式调用
   */
  div(setup = null) {
    const el = new Tag('div', setup);
    this._children.push(el);
    return this;
  }

  /**
   * 添加响应式网格子元素
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this} 返回当前实例支持链式调用
   */
  responsiveGrid(setup = null) {
    const el = responsiveGrid(setup);
    this._children.push(el);
    return this;
  }
}

/**
 * 创建 Grid 布局容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Grid} Grid 实例
 */
function grid(setup = null) {
  return new Grid(setup);
}

// ============================================
// 响应式 Grid 项
// ============================================

/**
 * 响应式网格容器（自动适应列数）
 * @class
 * @extends Grid
 */
class ResponsiveGrid extends Grid {
  /**
   * 创建响应式网格容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super(setup);
    this.style('gridTemplateColumns', 'repeat(auto-fit, minmax(250px, 1fr))');
  }

  /**
   * 设置最小列宽
   * @param {string} value - 最小宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  minSize(value) {
    return this.style('gridTemplateColumns', `repeat(auto-fit, minmax(${value}, 1fr))`);
  }

  /**
   * 使用 auto-fit 自适应
   * @returns {this} 返回当前实例支持链式调用
   */
  autoFit() {
    return this.style('gridTemplateColumns', 'repeat(auto-fit, minmax(200px, 1fr))');
  }

  /**
   * 使用 auto-fill 填充
   * @returns {this} 返回当前实例支持链式调用
   */
  autoFill() {
    return this.style('gridTemplateColumns', 'repeat(auto-fill, minmax(200px, 1fr))');
  }
}

/**
 * 创建响应式网格容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {ResponsiveGrid} ResponsiveGrid 实例
 */
function responsiveGrid(setup = null) {
  return new ResponsiveGrid(setup);
}

// ============================================
// Stack 堆叠布局
// ============================================

/**
 * Stack 堆叠布局容器（默认垂直）
 * @class
 * @extends Tag
 */
class Stack extends Tag {
  /**
   * 创建 Stack 堆叠容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'flex');
    this.style('flexDirection', 'column');
  }

  /**
   * 设置为水平堆叠
   * @returns {this} 返回当前实例支持链式调用
   */
  horizontal() {
    return this.style('flexDirection', 'row');
  }

  /**
   * 设置子元素间距
   * @param {string} value - gap 值
   * @returns {this} 返回当前实例支持链式调用
   */
  gap(value) {
    return this.style('gap', value);
  }

  /**
   * 设置对齐方式
   * @param {string} value - align-items 值
   * @returns {this} 返回当前实例支持链式调用
   */
  align(value) {
    return this.style('alignItems', value);
  }

  /**
   * 设置交叉轴对齐方式
   * @param {string} value - align-items 值
   * @returns {this} 返回当前实例支持链式调用
   */
  alignItems(value) {
    return this.style('alignItems', value);
  }

  /**
   * 设置主轴对齐方式
   * @param {string} value - justify-content 值
   * @returns {this} 返回当前实例支持链式调用
   */
  justify(value) {
    return this.style('justifyContent', value);
  }
}

/**
 * 创建 Stack 堆叠容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Stack} Stack 实例
 */
function stack(setup = null) {
  return new Stack(setup);
}

// ============================================
// HStack 水平堆叠
// ============================================

/**
 * HStack 水平堆叠容器
 * @class
 * @extends Stack
 */
class HStack extends Stack {
  /**
   * 创建 HStack 水平堆叠容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super(setup);
    this.style('flexDirection', 'row');
  }
}

/**
 * 创建 HStack 水平堆叠容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {HStack} HStack 实例
 */
function hstack(setup = null) {
  return new HStack(setup);
}

// ============================================
// VStack 垂直堆叠
// ============================================

/**
 * VStack 垂直堆叠容器
 * @class
 * @extends Stack
 */
/**
 * VStack 垂直堆叠容器
 * @class
 * @extends Stack
 */
class VStack extends Stack {
  /**
   * 创建 VStack 垂直堆叠容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super(setup);
    this.style('flexDirection', 'column');
  }
}

/**
 * 创建 VStack 垂直堆叠容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VStack} VStack 实例
 */
function vstack(setup = null) {
  return new VStack(setup);
}

// ============================================
// Center 居中布局
// ============================================

/**
 * Center 居中布局容器（水平 + 垂直居中）
 * @class
 * @extends Tag
 */
class Center extends Tag {
  /**
   * 创建 Center 居中容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('display', 'flex');
    this.style('justifyContent', 'center');
    this.style('alignItems', 'center');
  }

  /**
   * 设置水平居中
   * @returns {this} 返回当前实例支持链式调用
   */
  horizontal() {
    return this.style('justifyContent', 'center');
  }

  /**
   * 设置垂直居中
   * @returns {this} 返回当前实例支持链式调用
   */
  vertical() {
    return this.style('alignItems', 'center');
  }

  /**
   * 设置完全居中（默认）
   * @returns {this} 返回当前实例支持链式调用
   */
  center() {
    return this.style('justifyContent', 'center').style('alignItems', 'center');
  }
}

/**
 * 创建 Center 居中容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Center} Center 实例
 */
function center(setup = null) {
  return new Center(setup);
}

// ============================================
// Spacer 弹性 spacer
// ============================================

/**
 * Spacer 弹性占位组件
 * @class
 * @extends Tag
 */
class Spacer extends Tag {
  /**
   * 创建 Spacer 弹性占位
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('flex', '1');
  }

  /**
   * 设置弹性大小
   * @param {string} value - flex 值
   * @returns {this} 返回当前实例支持链式调用
   */
  size(value) {
    return this.style('flex', value);
  }

  /**
   * 设置宽度
   * @param {string} value - 宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  width(value) {
    return this.style('width', value);
  }

  /**
   * 设置高度
   * @param {string} value - 高度值
   * @returns {this} 返回当前实例支持链式调用
   */
  height(value) {
    return this.style('height', value);
  }
}

/**
 * 创建 Spacer 弹性占位
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Spacer} Spacer 实例
 */
function spacer(setup = null) {
  return new Spacer(setup);
}

// ============================================
// Container 响应式容器
// ============================================

/**
 * Container 响应式容器（最大宽度 1200px，自动居中）
 * @class
 * @extends Tag
 */
class Container extends Tag {
  /**
   * 创建 Container 响应式容器
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.style('maxWidth', '1200px');
    this.style('margin', '0 auto');
    this.style('padding', '0 16px');
  }

  /**
   * 设置最大宽度
   * @param {string} value - 最大宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  maxWidth(value) {
    return this.style('maxWidth', value);
  }

  /**
   * 设置内边距
   * @param {string} value - 内边距值
   * @returns {this} 返回当前实例支持链式调用
   */
  padding(value) {
    return this.style('padding', value);
  }

  /**
   * 设置流体布局（100% 宽度）
   * @returns {this} 返回当前实例支持链式调用
   */
  fluid() {
    return this.style('maxWidth', '100%');
  }
}

/**
 * 创建 Container 响应式容器
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Container} Container 实例
 */
function container(setup = null) {
  return new Container(setup);
}

// ============================================
// Divider 分割线
// ============================================

/**
 * Divider 分割线组件
 * @class
 * @extends Tag
 */
class Divider extends Tag {
  /**
   * 创建 Divider 分割线
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('hr', setup);
    this.style('border', 'none');
    this.style('height', '1px');
    this.style('background', '#e0e0e0');
    this.style('margin', '0');
  }

  /**
   * 设置分割线颜色
   * @param {string} value - 颜色值
   * @returns {this} 返回当前实例支持链式调用
   */
  color(value) {
    return this.style('background', value);
  }

  /**
   * 设置为垂直分割线
   * @returns {this} 返回当前实例支持链式调用
   */
  vertical() {
    return this.style('width', '1px')
      .style('height', 'auto')
      .style('border-right', '1px solid currentColor');
  }

  /**
   * 设置外边距
   * @param {string} value - 外边距值
   * @returns {this} 返回当前实例支持链式调用
   */
  margin(value) {
    return this.style('margin', value);
  }
}

/**
 * 创建 Divider 分割线
 * @param {Function} [setup=null] - 初始化函数
 * @returns {Divider} Divider 实例
 */
function divider(setup = null) {
  return new Divider(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 flex 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.flex = function(setup = null) {
  const el = flex(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 grid 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.grid = function(setup = null) {
  const el = grid(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 responsiveGrid 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.responsiveGrid = function(setup = null) {
  const el = responsiveGrid(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 stack 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.stack = function(setup = null) {
  const el = stack(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 hstack 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.hstack = function(setup = null) {
  const el = hstack(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vstack 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vstack = function(setup = null) {
  const el = vstack(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 center 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.center = function(setup = null) {
  const el = center(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 spacer 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.spacer = function(setup = null) {
  const el = spacer(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 container 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.container = function(setup = null) {
  const el = container(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 divider 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.divider = function(setup = null) {
  const el = divider(setup);
  this.child(el);
  return this;
};

/**
 * Yoya.Basic - SVG Components
 * SVG 图形组件
 * @module Yoya.SVG
 */


// SVG 命名空间
const SVG_NS = 'http://www.w3.org/2000/svg';

// ============================================
// SvgTag 基类
// ============================================

/**
 * SVG 元素基类，所有 SVG 元素的父类
 * @class
 * @extends Tag
 */
class SvgTag extends Tag {
  /**
   * 创建 SVG 元素
   * @param {string} tagName - SVG 标签名
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(tagName, setup = null) {
    // 先调用父类构造函数
    super(tagName, null);

    // 重新创建 SVG 元素（覆盖 Tag 创建的普通 HTML 元素）
    this._el = document.createElementNS(SVG_NS, tagName);
    this._boundElement = this._el;

    // SVG 特有的属性
    this._transforms = [];

    // 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 渲染 SVG 元素到 DOM（重写 Tag 的 renderDom）
   * 支持 SVG 子元素的智能增删
   * @returns {SVGElement|null} 渲染后的 SVG 元素
   */
  renderDom() {
    if (this._deleted) return null;

    // 首次渲染时应用事件
    if (!this._rendered) {
      this._applyEventsToEl();
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

    this._rendered = true;
    return this._el;
  }

  /**
   * 生成 SVG XML 格式 HTML（重写 Tag 的 toHTML）
   * @returns {string} SVG XML 字符串
   */
  toHTML() {
    const attrs = Object.entries(this._attrs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');

    const classes = Array.from(this._classes).join(' ');
    const styles = Object.entries(this._styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    const tagStart = `<${this._tagName}${attrs ? ' ' + attrs : ''}${classes ? ' class="' + classes + '"' : ''}${styles ? ' style="' + styles + '"' : ''}>`;
    const children = this._children.map(child => {
      if (child === null || child === undefined) return '';
      if (typeof child === 'string' || typeof child === 'number') return child;
      if (child.toHTML) return child.toHTML();
      return '';
    }).join('');

    return tagStart + children + `</${this._tagName}>`;
  }

  /**
   * 添加 SVG 子元素（重写 child 方法）
   * @param {...(SvgTag|null|undefined|Array)} children - SVG 子元素
   * @returns {this} 返回当前实例支持链式调用
   */
  child(...children) {
    for (const child of children) {
      if (Array.isArray(child)) {
        this.child(...child);
      } else if (child !== null && child !== undefined) {
        this._children.push(child);
      }
    }
    return this;
  }
}

// ============================================
// SVG 基类
// ============================================

/**
 * Svg SVG 画布容器
 * @class
 * @extends SvgTag
 */
class Svg extends SvgTag {
  /**
   * 创建 Svg 画布容器
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('svg', setup);
    this.style('display', 'inline-block');
  }

  /**
   * 设置 SVG 视口
   * @param {number} x - 左上角 x 坐标
   * @param {number} y - 左上角 y 坐标
   * @param {number} width - 视口宽度
   * @param {number} height - 视口高度
   * @returns {this} 返回当前实例支持链式调用
   * @example
   * svg(s => {
   *   s.viewBox(0, 0, 100, 100);
   * });
   */
  viewBox(x, y, width, height) {
    if (arguments.length === 4) {
      return this.attr('viewBox', `${x} ${y} ${width} ${height}`);
    }
    return this.attr('viewBox', x);
  }

  /**
   * 设置 SVG 宽度
   * @param {string|number} value - 宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  width(value) {
    return this.attr('width', value);
  }

  /**
   * 设置 SVG 高度
   * @param {string|number} value - 高度值
   * @returns {this} 返回当前实例支持链式调用
   */
  height(value) {
    return this.attr('height', value);
  }

  /**
   * 设置 SVG 命名空间
   * @param {string} [value='http://www.w3.org/2000/svg'] - 命名空间 URI
   * @returns {this} 返回当前实例支持链式调用
   */
  xmlns(value = 'http://www.w3.org/2000/svg') {
    return this.attr('xmlns', value);
  }

  // SVG 子元素工厂方法
  circle(setup = null) {
    const el = circle(setup);
    this.child(el);
    return this;
  }

  ellipse(setup = null) {
    const el = ellipse(setup);
    this.child(el);
    return this;
  }

  rect(setup = null) {
    const el = rect(setup);
    this.child(el);
    return this;
  }

  line(setup = null) {
    const el = line(setup);
    this.child(el);
    return this;
  }

  polyline(setup = null) {
    const el = polyline(null, setup);
    this.child(el);
    return this;
  }

  polygon(setup = null) {
    const el = polygon(null, setup);
    this.child(el);
    return this;
  }

  path(setup = null) {
    const el = path(null, setup);
    this.child(el);
    return this;
  }

  text(content = '', setup = null) {
    const el = svgText(content, setup);
    this.child(el);
    return this;
  }

  tspan(content = '', setup = null) {
    const el = tspan(content, setup);
    this.child(el);
    return this;
  }

  g(setup = null) {
    const el = g(setup);
    this.child(el);
    return this;
  }

  linearGradient(setup = null) {
    const el = linearGradient(setup);
    this.child(el);
    return this;
  }

  radialGradient(setup = null) {
    const el = radialGradient(setup);
    this.child(el);
    return this;
  }

  pattern(setup = null) {
    const el = pattern(setup);
    this.child(el);
    return this;
  }

  filter(id, setup = null) {
    const el = filter(id, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 image 子元素
   * @param {string} [href=''] - 图片 URL
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  image(href = '', setup = null) {
    const el = svgImage(href, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加任意 SVG 元素子元素
   * @param {string} tagName - SVG 标签名
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  svgElement(tagName, setup = null) {
    const el = svgElement(tagName, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 defs 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  defs(setup = null) {
    const el = defs(setup);
    this.child(el);
    return this;
  }
}

/**
 * 创建 Svg 画布容器
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Svg} Svg 实例
 */
function svg(setup = null) {
  return new Svg(setup);
}

// ============================================
// 基础形状
// ============================================

/**
 * Circle 圆形
 * @class
 * @extends SvgTag
 */
class Circle extends SvgTag {
  /**
   * 创建 Circle 圆形
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('circle', setup);
  }

  /**
   * 设置圆心 x 坐标
   * @param {number|string} value - 圆心 x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cx(value) {
    return this.attr('cx', value);
  }

  /**
   * 设置圆心 y 坐标
   * @param {number|string} value - 圆心 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cy(value) {
    return this.attr('cy', value);
  }

  /**
   * 设置半径
   * @param {number|string} value - 半径值
   * @returns {this} 返回当前实例支持链式调用
   */
  r(value) {
    return this.attr('r', value);
  }
}

/**
 * 创建 Circle 圆形
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Circle} Circle 实例
 */
function circle(setup = null) {
  return new Circle(setup);
}

/**
 * Ellipse 椭圆
 * @class
 * @extends SvgTag
 */
class Ellipse extends SvgTag {
  /**
   * 创建 Ellipse 椭圆
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('ellipse', setup);
  }

  /**
   * 设置圆心 x 坐标
   * @param {number|string} value - 圆心 x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cx(value) {
    return this.attr('cx', value);
  }

  /**
   * 设置圆心 y 坐标
   * @param {number|string} value - 圆心 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cy(value) {
    return this.attr('cy', value);
  }

  /**
   * 设置 x 轴半径
   * @param {number|string} value - x 轴半径
   * @returns {this} 返回当前实例支持链式调用
   */
  rx(value) {
    return this.attr('rx', value);
  }

  /**
   * 设置 y 轴半径
   * @param {number|string} value - y 轴半径
   * @returns {this} 返回当前实例支持链式调用
   */
  ry(value) {
    return this.attr('ry', value);
  }
}

/**
 * 创建 Ellipse 椭圆
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Ellipse} Ellipse 实例
 */
function ellipse(setup = null) {
  return new Ellipse(setup);
}

/**
 * Rect 矩形
 * @class
 * @extends SvgTag
 */
class Rect extends SvgTag {
  /**
   * 创建 Rect 矩形
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('rect', setup);
  }

  /**
   * 设置左上角 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x(value) {
    return this.attr('x', value);
  }

  /**
   * 设置左上角 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y(value) {
    return this.attr('y', value);
  }

  /**
   * 设置宽度
   * @param {number|string} value - 宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  width(value) {
    return this.attr('width', value);
  }

  /**
   * 设置高度
   * @param {number|string} value - 高度值
   * @returns {this} 返回当前实例支持链式调用
   */
  height(value) {
    return this.attr('height', value);
  }

  /**
   * 设置 x 轴圆角半径
   * @param {number|string} value - 圆角半径
   * @returns {this} 返回当前实例支持链式调用
   */
  rx(value) {
    return this.attr('rx', value);
  }

  /**
   * 设置 y 轴圆角半径
   * @param {number|string} value - 圆角半径
   * @returns {this} 返回当前实例支持链式调用
   */
  ry(value) {
    return this.attr('ry', value);
  }
}

/**
 * 创建 Rect 矩形
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Rect} Rect 实例
 */
function rect(setup = null) {
  return new Rect(setup);
}

/**
 * Line 线段
 * @class
 * @extends SvgTag
 */
class Line extends SvgTag {
  /**
   * 创建 Line 线段
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('line', setup);
  }

  /**
   * 设置起点 x 坐标
   * @param {number|string} value - 起点 x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x1(value) {
    return this.attr('x1', value);
  }

  /**
   * 设置起点 y 坐标
   * @param {number|string} value - 起点 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y1(value) {
    return this.attr('y1', value);
  }

  /**
   * 设置终点 x 坐标
   * @param {number|string} value - 终点 x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x2(value) {
    return this.attr('x2', value);
  }

  /**
   * 设置终点 y 坐标
   * @param {number|string} value - 终点 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y2(value) {
    return this.attr('y2', value);
  }
}

/**
 * 创建 Line 线段
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Line} Line 实例
 */
function line(setup = null) {
  return new Line(setup);
}

/**
 * Polyline 折线
 * @class
 * @extends SvgTag
 */
class Polyline extends SvgTag {
  /**
   * 创建 Polyline 折线
   * @param {Array<Array<number>>|string|null} [points=null] - 点坐标数组
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(points = null, setup = null) {
    super('polyline', setup);
    if (points) {
      this.points(points);
    }
  }

  /**
   * 设置折线点坐标
   * @param {Array<Array<number>>|string} value - 点坐标数组或字符串
   * @returns {this} 返回当前实例支持链式调用
   */
  points(value) {
    if (Array.isArray(value)) {
      return this.attr('points', value.join(' '));
    }
    return this.attr('points', value);
  }
}

/**
 * 创建 Polyline 折线
 * @param {Array<Array<number>>|string|null} [points=null] - 点坐标数组
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Polyline} Polyline 实例
 */
function polyline(points = null, setup = null) {
  return new Polyline(points, setup);
}

/**
 * Polygon 多边形
 * @class
 * @extends SvgTag
 */
class Polygon extends SvgTag {
  /**
   * 创建 Polygon 多边形
   * @param {Array<Array<number>>|string|null} [points=null] - 点坐标数组
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(points = null, setup = null) {
    super('polygon', setup);
    if (points) {
      this.points(points);
    }
  }

  /**
   * 设置多边形点坐标
   * @param {Array<Array<number>>|string} value - 点坐标数组或字符串
   * @returns {this} 返回当前实例支持链式调用
   */
  points(value) {
    if (Array.isArray(value)) {
      return this.attr('points', value.join(' '));
    }
    return this.attr('points', value);
  }
}

/**
 * 创建 Polygon 多边形
 * @param {Array<Array<number>>|string|null} [points=null] - 点坐标数组
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Polygon} Polygon 实例
 */
function polygon(points = null, setup = null) {
  return new Polygon(points, setup);
}

// ============================================
// 路径
// ============================================

/**
 * Path 路径
 * @class
 * @extends SvgTag
 */
class Path extends SvgTag {
  /**
   * 创建 Path 路径
   * @param {string|null} [d=null] - 路径数据
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(d = null, setup = null) {
    super('path', setup);
    if (d) {
      this.d(d);
    }
  }

  /**
   * 设置路径数据
   * @param {string} value - SVG 路径数据
   * @returns {this} 返回当前实例支持链式调用
   */
  d(value) {
    return this.attr('d', value);
  }

  /**
   * 移动到指定点（M 命令）
   * @param {number} x - x 坐标
   * @param {number} y - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  moveTo(x, y) {
    this._pathCommand(`M ${x} ${y}`);
    return this;
  }

  /**
   * 画线到指定点（L 命令）
   * @param {number} x - x 坐标
   * @param {number} y - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  lineTo(x, y) {
    this._pathCommand(`L ${x} ${y}`);
    return this;
  }

  /**
   * 画水平线到指定点（H 命令）
   * @param {number} x - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  hlineTo(x) {
    this._pathCommand(`H ${x}`);
    return this;
  }

  /**
   * 画垂直线到指定点（V 命令）
   * @param {number} y - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  vlineTo(y) {
    this._pathCommand(`V ${y}`);
    return this;
  }

  /**
   * 画三次贝塞尔曲线（C 命令）
   * @param {number} cp1x - 第一个控制点 x 坐标
   * @param {number} cp1y - 第一个控制点 y 坐标
   * @param {number} cp2x - 第二个控制点 x 坐标
   * @param {number} cp2y - 第二个控制点 y 坐标
   * @param {number} x - 终点 x 坐标
   * @param {number} y - 终点 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  curveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._pathCommand(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y}`);
    return this;
  }

  /**
   * 画二次贝塞尔曲线（Q 命令）
   * @param {number} cpx - 控制点 x 坐标
   * @param {number} cpy - 控制点 y 坐标
   * @param {number} x - 终点 x 坐标
   * @param {number} y - 终点 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  quadraticCurveTo(cpx, cpy, x, y) {
    this._pathCommand(`Q ${cpx} ${cpy} ${x} ${y}`);
    return this;
  }

  /**
   * 画弧线（A 命令）
   * @param {number} rx - x 轴半径
   * @param {number} ry - y 轴半径
   * @param {number} xAxisRotation - x 轴旋转角度
   * @param {number} largeArcFlag - 大弧标志
   * @param {number} sweepFlag - 顺时针标志
   * @param {number} x - 终点 x 坐标
   * @param {number} y - 终点 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  arcTo(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    this._pathCommand(`A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`);
    return this;
  }

  /**
   * 闭合路径（Z 命令）
   * @returns {this} 返回当前实例支持链式调用
   */
  closePath() {
    this._pathCommand('Z');
    return this;
  }

  /**
   * 添加路径命令
   * @private
   * @param {string} cmd - 路径命令字符串
   */
  _pathCommand(cmd) {
    const current = this._attrs.d || '';
    this._attrs.d = current ? `${current} ${cmd}` : cmd;
  }
}

/**
 * 创建 Path 路径
 * @param {string|null} [d=null] - 路径数据
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Path} Path 实例
 */
function path(d = null, setup = null) {
  return new Path(d, setup);
}

// ============================================
// 文本
// ============================================

/**
 * Text SVG 文本元素
 * @class
 * @extends SvgTag
 */
class Text extends SvgTag {
  /**
   * 创建 Text 文本元素
   * @param {string|Function} [content=''] - 文本内容或 setup 函数
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(content = '', setup = null) {
    // 如果 content 是函数，则它是 setup
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }
    super('text', setup);
    if (content) {
      this.text(content);
    }
  }

  /**
   * 设置 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x(value) {
    return this.attr('x', value);
  }

  /**
   * 设置 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y(value) {
    return this.attr('y', value);
  }

  /**
   * 设置相对 x 偏移
   * @param {number|string} value - x 偏移量
   * @returns {this} 返回当前实例支持链式调用
   */
  dx(value) {
    return this.attr('dx', value);
  }

  /**
   * 设置相对 y 偏移
   * @param {number|string} value - y 偏移量
   * @returns {this} 返回当前实例支持链式调用
   */
  dy(value) {
    return this.attr('dy', value);
  }

  /**
   * 设置文本锚点（对齐方式）
   * @param {string} value - 对齐方式（start, middle, end）
   * @returns {this} 返回当前实例支持链式调用
   */
  textAnchor(value) {
    return this.attr('text-anchor', value);
  }

  /**
   * 设置文本内容
   * @param {string} content - 文本内容
   * @returns {this} 返回当前实例支持链式调用
   */
  text(content) {
    this._text = content;
    return this;
  }

  /**
   * 添加 tspan 子元素
   * @param {string} [content=''] - 文本内容
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  tspan(content = '', setup = null) {
    const el = tspan(content, setup);
    this.child(el);
    return this;
  }

  /**
   * 渲染文本元素到 DOM
   * @returns {SVGTextElement|null} 渲染后的 SVG 文本元素
   */
  renderDom() {
    if (this._deleted) return null;

    // 首次渲染时应用事件
    if (!this._rendered) {
      this._applyEventsToEl();
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

    // 设置文本内容（如果没有子元素）
    if (this._children.length === 0 && this._text) {
      this._el.textContent = this._text;
    }

    this._rendered = true;
    return this._el;
  }

  /**
   * 生成 SVG XML 格式 HTML
   * @returns {string} SVG XML 字符串
   */
  toHTML() {
    const attrs = Object.entries(this._attrs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');

    const classes = Array.from(this._classes).join(' ');
    const styles = Object.entries(this._styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    const tagStart = `<text${attrs ? ' ' + attrs : ''}${classes ? ' class="' + classes + '"' : ''}${styles ? ' style="' + styles + '"' : ''}>`;
    return tagStart + (this._text || '') + '</text>';
  }
}

/**
 * 创建 Text 文本元素
 * @param {string|Function} [content=''] - 文本内容或 setup 函数
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Text} Text 实例
 */
function svgText(content = '', setup = null) {
  return new Text(content, setup);
}

// ============================================
// Tspan
// ============================================

/**
 * Tspan SVG 文本片段元素
 * @class
 * @extends SvgTag
 */
class Tspan extends SvgTag {
  /**
   * 创建 Tspan 文本片段
   * @param {string|Function} [content=''] - 文本内容或 setup 函数
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(content = '', setup = null) {
    // 如果 content 是函数，则它是 setup
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }
    super('tspan', setup);
    if (content) {
      this.text(content);
    }
  }

  /**
   * 设置 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x(value) {
    return this.attr('x', value);
  }

  /**
   * 设置 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y(value) {
    return this.attr('y', value);
  }

  /**
   * 设置相对 x 偏移
   * @param {number|string} value - x 偏移量
   * @returns {this} 返回当前实例支持链式调用
   */
  dx(value) {
    return this.attr('dx', value);
  }

  /**
   * 设置相对 y 偏移
   * @param {number|string} value - y 偏移量
   * @returns {this} 返回当前实例支持链式调用
   */
  dy(value) {
    return this.attr('dy', value);
  }

  /**
   * 设置文本内容
   * @param {string} content - 文本内容
   * @returns {this} 返回当前实例支持链式调用
   */
  text(content) {
    this._text = content;
    return this;
  }

  /**
   * 渲染文本片段到 DOM
   * @returns {SVGTSpanElement|null} 渲染后的 SVG tspan 元素
   */
  renderDom() {
    if (this._deleted) return null;

    // 首次渲染时应用事件
    if (!this._rendered) {
      this._applyEventsToEl();
    }

    // 设置文本内容
    if (this._text) {
      this._el.textContent = this._text;
    }

    this._rendered = true;
    return this._el;
  }
}

/**
 * 创建 Tspan 文本片段
 * @param {string|Function} [content=''] - 文本内容或 setup 函数
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Tspan} Tspan 实例
 */
function tspan(content = '', setup = null) {
  return new Tspan(content, setup);
}

// ============================================
// 渐变
// ============================================

/**
 * LinearGradient 线性渐变
 * @class
 * @extends SvgTag
 */
class LinearGradient extends SvgTag {
  /**
   * 创建 LinearGradient 线性渐变
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('linearGradient', setup);
  }

  /**
   * 设置渐变起点 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x1(value) {
    return this.attr('x1', value);
  }

  /**
   * 设置渐变起点 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y1(value) {
    return this.attr('y1', value);
  }

  /**
   * 设置渐变终点 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x2(value) {
    return this.attr('x2', value);
  }

  /**
   * 设置渐变终点 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y2(value) {
    return this.attr('y2', value);
  }

  /**
   * 设置渐变单位
   * @param {string} value - 单位类型（objectBoundingBox 或 userSpaceOnUse）
   * @returns {this} 返回当前实例支持链式调用
   */
  gradientUnits(value) {
    return this.attr('gradientUnits', value);
  }

  /**
   * 添加渐变色阶
   * @param {number} offset - 色阶位置（0-100）
   * @param {string} color - 颜色值
   * @param {number} [opacity=1] - 不透明度
   * @returns {this} 返回当前实例支持链式调用
   */
  stop(offset, color, opacity = 1) {
    const stopEl = new Stop(offset, color, opacity);
    this._children.push(stopEl);
    return this;
  }
}

/**
 * 创建 LinearGradient 线性渐变
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {LinearGradient} LinearGradient 实例
 */
function linearGradient(setup = null) {
  return new LinearGradient(setup);
}

/**
 * RadialGradient 径向渐变
 * @class
 * @extends SvgTag
 */
class RadialGradient extends SvgTag {
  /**
   * 创建 RadialGradient 径向渐变
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('radialGradient', setup);
  }

  /**
   * 设置渐变圆心 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cx(value) {
    return this.attr('cx', value);
  }

  /**
   * 设置渐变圆心 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  cy(value) {
    return this.attr('cy', value);
  }

  /**
   * 设置渐变半径
   * @param {number|string} value - 半径值
   * @returns {this} 返回当前实例支持链式调用
   */
  r(value) {
    return this.attr('r', value);
  }

  /**
   * 设置焦点 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  fx(value) {
    return this.attr('fx', value);
  }

  /**
   * 设置焦点 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  fy(value) {
    return this.attr('fy', value);
  }

  /**
   * 添加渐变色阶
   * @param {number} offset - 色阶位置（0-100）
   * @param {string} color - 颜色值
   * @param {number} [opacity=1] - 不透明度
   * @returns {this} 返回当前实例支持链式调用
   */
  stop(offset, color, opacity = 1) {
    const stopEl = new Stop(offset, color, opacity);
    this._children.push(stopEl);
    return this;
  }
}

/**
 * 创建 RadialGradient 径向渐变
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {RadialGradient} RadialGradient 实例
 */
function radialGradient(setup = null) {
  return new RadialGradient(setup);
}

/**
 * Stop 渐变色阶
 * @class
 * @extends SvgTag
 */
class Stop extends SvgTag {
  /**
   * 创建 Stop 渐变色阶
   * @param {number} [offset=0] - 色阶位置（0-100）
   * @param {string} [color='#000'] - 颜色值
   * @param {number} [opacity=1] - 不透明度
   */
  constructor(offset = 0, color = '#000', opacity = 1) {
    super('stop');
    this.offset(offset);
    this.stopColor(color);
    this.stopOpacity(opacity);
  }

  /**
   * 设置色阶位置
   * @param {number|string} value - 位置（百分比或数值）
   * @returns {this} 返回当前实例支持链式调用
   */
  offset(value) {
    return this.attr('offset', typeof value === 'number' ? `${value}%` : value);
  }

  /**
   * 设置色阶颜色
   * @param {string} value - 颜色值
   * @returns {this} 返回当前实例支持链式调用
   */
  stopColor(value) {
    return this.attr('stop-color', value);
  }

  /**
   * 设置色阶不透明度
   * @param {number} value - 不透明度（0-1）
   * @returns {this} 返回当前实例支持链式调用
   */
  stopOpacity(value) {
    return this.attr('stop-opacity', value);
  }
}

/**
 * 创建 Stop 渐变色阶
 * @param {number} [offset=0] - 色阶位置
 * @param {string} [color='#000'] - 颜色值
 * @param {number} [opacity=1] - 不透明度
 * @returns {Stop} Stop 实例
 */
function stop(offset = 0, color = '#000', opacity = 1) {
  return new Stop(offset, color, opacity);
}

// ============================================
// 图案
// ============================================

/**
 * Pattern SVG 图案元素
 * @class
 * @extends SvgTag
 */
class Pattern extends SvgTag {
  /**
   * 创建 Pattern 图案元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('pattern', setup);
  }

  /**
   * 设置图案 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x(value) {
    return this.attr('x', value);
  }

  /**
   * 设置图案 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y(value) {
    return this.attr('y', value);
  }

  /**
   * 设置图案宽度
   * @param {number|string} value - 宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  width(value) {
    return this.attr('width', value);
  }

  /**
   * 设置图案高度
   * @param {number|string} value - 高度值
   * @returns {this} 返回当前实例支持链式调用
   */
  height(value) {
    return this.attr('height', value);
  }

  /**
   * 设置图案单位
   * @param {string} value - 单位类型（objectBoundingBox 或 userSpaceOnUse）
   * @returns {this} 返回当前实例支持链式调用
   */
  patternUnits(value) {
    return this.attr('patternUnits', value);
  }

  /**
   * 设置图案内容单位
   * @param {string} value - 单位类型（objectBoundingBox 或 userSpaceOnUse）
   * @returns {this} 返回当前实例支持链式调用
   */
  patternContentUnits(value) {
    return this.attr('patternContentUnits', value);
  }
}

/**
 * 创建 Pattern 图案元素
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Pattern} Pattern 实例
 */
function pattern(setup = null) {
  return new Pattern(setup);
}

// ============================================
// 滤镜
// ============================================

/**
 * FilterPrimitive 滤镜基类
 * @class
 * @extends SvgTag
 */
class FilterPrimitive extends SvgTag {
  /**
   * 创建 FilterPrimitive 滤镜元素
   * @param {string} tagName - SVG 滤镜标签名
   * @param {Object} [attrs={}] - 初始属性
   */
  constructor(tagName, attrs = {}) {
    super(tagName);
    for (const [k, v] of Object.entries(attrs)) {
      this.attr(k, v);
    }
  }
}

/**
 * Filter SVG 滤镜容器
 * @class
 * @extends SvgTag
 */
class Filter extends SvgTag {
  /**
   * 创建 Filter 滤镜容器
   * @param {string} id - 滤镜 ID
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(id, setup = null) {
    super('filter', setup);
    if (id) {
      this.id(id);
    }
  }

  /**
   * 添加滤镜基元
   * @param {string} type - 滤镜类型（如 GaussianBlur, DropShadow）
   * @param {Object} [attrs={}] - 滤镜属性
   * @returns {this} 返回当前实例支持链式调用
   */
  primitive(type, attrs = {}) {
    const el = new FilterPrimitive(`fe${type}`, attrs);
    this._children.push(el);
    return this;
  }

  /**
   * 添加高斯模糊滤镜
   * @param {number} stdDeviation - 模糊半径
   * @param {Object} [attrs={}] - 其他滤镜属性
   * @returns {this} 返回当前实例支持链式调用
   */
  gaussianBlur(stdDeviation, attrs = {}) {
    return this.primitive('GaussianBlur', { stdDeviation, ...attrs });
  }

  /**
   * 添加投影滤镜
   * @param {number} dx - x 方向偏移
   * @param {number} dy - y 方向偏移
   * @param {number} stdDeviation - 模糊半径
   * @param {string} [floodColor='#000'] - 阴影颜色
   * @param {number} [floodOpacity=0.5] - 阴影不透明度
   * @returns {this} 返回当前实例支持链式调用
   */
  dropShadow(dx, dy, stdDeviation, floodColor = '#000', floodOpacity = 0.5) {
    return this
      .primitive('DropShadow', { dx, dy, stdDeviation, floodColor, floodOpacity });
  }
}

/**
 * 创建 Filter 滤镜容器
 * @param {string} id - 滤镜 ID
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Filter} Filter 实例
 */
function filter(id, setup = null) {
  return new Filter(id, setup);
}

// ============================================
// 图像
// ============================================

/**
 * Image SVG 图像元素
 * @class
 * @extends SvgTag
 */
class Image extends SvgTag {
  /**
   * 创建 Image SVG 图像元素
   * @param {string} [href=''] - 图片 URL
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(href = '', setup = null) {
    super('image', setup);
    if (href) {
      this.href(href);
    }
  }

  /**
   * 设置图片 URL
   * @param {string} value - 图片 URL
   * @returns {this} 返回当前实例支持链式调用
   */
  href(value) {
    return this.attr('href', value);
  }

  /**
   * 设置 x 坐标
   * @param {number|string} value - x 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  x(value) {
    return this.attr('x', value);
  }

  /**
   * 设置 y 坐标
   * @param {number|string} value - y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  y(value) {
    return this.attr('y', value);
  }

  /**
   * 设置宽度
   * @param {number|string} value - 宽度值
   * @returns {this} 返回当前实例支持链式调用
   */
  width(value) {
    return this.attr('width', value);
  }

  /**
   * 设置高度
   * @param {number|string} value - 高度值
   * @returns {this} 返回当前实例支持链式调用
   */
  height(value) {
    return this.attr('height', value);
  }

  /**
   * 设置preserveAspectRatio 属性
   * @param {string} value - 缩放比例（none, xMinYMin, xMidYMid, xMaxYMax 等）
   * @returns {this} 返回当前实例支持链式调用
   */
  preserveAspectRatio(value) {
    return this.attr('preserveAspectRatio', value);
  }
}

/**
 * 创建 Image SVG 图像元素
 * @param {string} [href=''] - 图片 URL
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Image} Image 实例
 */
function svgImage(href = '', setup = null) {
  return new Image(href, setup);
}

// ============================================
// 组
// ============================================

/**
 * G SVG 组元素
 * @class
 * @extends SvgTag
 */
class G extends SvgTag {
  /**
   * 创建 G 组元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('g', setup);
  }

  /**
   * 设置变换
   * @param {string} value - 变换字符串
   * @returns {this} 返回当前实例支持链式调用
   */
  transform(value) {
    if (value) {
      this._transforms.push(value);
      this.attr('transform', this._transforms.join(' '));
    }
    return this;
  }

  /**
   * 平移变换
   * @param {number} x - x 方向平移距离
   * @param {number} y - y 方向平移距离
   * @returns {this} 返回当前实例支持链式调用
   */
  translate(x, y) {
    return this.transform(`translate(${x}, ${y})`);
  }

  /**
   * 缩放变换
   * @param {number} sx - x 方向缩放比例
   * @param {number} [sy=sx] - y 方向缩放比例（默认为 sx）
   * @returns {this} 返回当前实例支持链式调用
   */
  scale(sx, sy = sx) {
    return this.transform(`scale(${sx}, ${sy})`);
  }

  /**
   * 旋转变换
   * @param {number} angle - 旋转角度（度）
   * @param {number} [cx] - 旋转中心 x 坐标
   * @param {number} [cy] - 旋转中心 y 坐标
   * @returns {this} 返回当前实例支持链式调用
   */
  rotate(angle, cx, cy) {
    if (cx !== undefined && cy !== undefined) {
      return this.transform(`rotate(${angle} ${cx} ${cy})`);
    }
    return this.transform(`rotate(${angle})`);
  }

  /**
   * 斜切变换（X 轴）
   * @param {number} angle - 斜切角度（度）
   * @returns {this} 返回当前实例支持链式调用
   */
  skewX(angle) {
    return this.transform(`skewX(${angle})`);
  }

  /**
   * 斜切变换（Y 轴）
   * @param {number} angle - 斜切角度（度）
   * @returns {this} 返回当前实例支持链式调用
   */
  skewY(angle) {
    return this.transform(`skewY(${angle})`);
  }

  // SVG 子元素工厂方法
  /**
   * 添加 circle 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  circle(setup = null) {
    const el = circle(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 ellipse 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  ellipse(setup = null) {
    const el = ellipse(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 rect 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  rect(setup = null) {
    const el = rect(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 line 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  line(setup = null) {
    const el = line(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 polyline 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  polyline(setup = null) {
    const el = polyline(null, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 polygon 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  polygon(setup = null) {
    const el = polygon(null, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 path 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  path(setup = null) {
    const el = path(null, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 text 子元素
   * @param {string} [content=''] - 文本内容
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  text(content = '', setup = null) {
    const el = svgText(content, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 tspan 子元素
   * @param {string} [content=''] - 文本内容
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  tspan(content = '', setup = null) {
    const el = tspan(content, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 g 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  g(setup = null) {
    const el = g(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 linearGradient 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  linearGradient(setup = null) {
    const el = linearGradient(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 radialGradient 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  radialGradient(setup = null) {
    const el = radialGradient(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 pattern 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  pattern(setup = null) {
    const el = pattern(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 filter 子元素
   * @param {string} id - 滤镜 ID
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  filter(id, setup = null) {
    const el = filter(id, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 image 子元素
   * @param {string} [href=''] - 图片 URL
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  image(href = '', setup = null) {
    const el = svgImage(href, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加任意 SVG 元素子元素
   * @param {string} tagName - SVG 标签名
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  svgElement(tagName, setup = null) {
    const el = svgElement(tagName, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 defs 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  defs(setup = null) {
    const el = defs(setup);
    this.child(el);
    return this;
  }
}

/**
 * 创建 G 组元素
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {G} G 实例
 */
function g(setup = null) {
  return new G(setup);
}

// ============================================
// 通用 SVG 元素
// ============================================

/**
 * SvgElement 通用 SVG 元素
 * @class
 * @extends SvgTag
 */
class SvgElement extends SvgTag {
  /**
   * 创建 SvgElement 通用 SVG 元素
   * @param {string} tagName - SVG 标签名
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(tagName, setup = null) {
    super(tagName, setup);
  }

  /**
   * 渲染元素到 DOM
   * @returns {SVGElement|null} 渲染后的 SVG 元素
   */
  renderDom() {
    if (this._deleted) return null;
    return super.renderDom();
  }
}

/**
 * 创建 SvgElement 通用 SVG 元素
 * @param {string} tagName - SVG 标签名
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {SvgElement} SvgElement 实例
 */
function svgElement(tagName, setup = null) {
  return new SvgElement(tagName, setup);
}

// ============================================
// 定义容器
// ============================================

/**
 * Defs SVG 定义容器
 * @class
 * @extends SvgTag
 */
class Defs extends SvgTag {
  /**
   * 创建 Defs 定义容器
   * @param {Function|Object|null} [setup=null] - 初始化配置
   */
  constructor(setup = null) {
    super('defs', setup);
  }

  // SVG 子元素工厂方法
  /**
   * 添加 linearGradient 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  linearGradient(setup = null) {
    const el = linearGradient(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 radialGradient 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  radialGradient(setup = null) {
    const el = radialGradient(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 filter 子元素
   * @param {string} id - 滤镜 ID
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  filter(id, setup = null) {
    const el = filter(id, setup);
    this.child(el);
    return this;
  }

  /**
   * 添加 pattern 子元素
   * @param {Function|Object|null} [setup=null] - 初始化配置
   * @returns {this} 返回当前实例支持链式调用
   */
  pattern(setup = null) {
    const el = pattern(setup);
    this.child(el);
    return this;
  }
}

/**
 * 创建 Defs 定义容器
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {Defs} Defs 实例
 */
function defs(setup = null) {
  return new Defs(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 svg 子元素
 * @param {Function|Object|null} [setup=null] - 初始化配置
 * @returns {this} 返回当前实例支持链式调用
 */
Tag.prototype.svg = function(setup = null) {
  const el = svg(setup);
  this.child(el);
  return this;
};

/**
 * Yoya.Basic - Box 通用容器组件
 * 提供圆角、背景色、透明度、阴影等样式的通用容器
 * @module Yoya.Box
 * @example
 * // 基础用法 - 完全透明，继承父元素样式
 * import { vBox } from '../yoya/index.js';
 *
 * vBox(b => {
 *   b.text('这是一个透明容器');
 * });
 *
 * // 带背景色和圆角
 * vBox(b => {
 *   b.background('var(--yoya-primary)');
 *   b.radius('md');
 *   b.text('带样式的容器');
 * });
 *
 * // 带阴影
 * vBox(b => {
 *   b.shadow();
 *   b.padding('lg');
 *   b.text('带阴影的容器');
 * });
 *
 * // 半透明背景
 * vBox(b => {
 *   b.background('var(--yoya-primary)');
 *   b.opacity(0.1);
 *   b.radius('lg');
 * });
 */


// ============================================
// VBox 通用容器
// ============================================

/**
 * VBox 通用容器
 * 支持背景色、圆角、阴影、透明度等样式
 * @class
 * @extends Tag
 */
class VBox extends Tag {
  static _stateAttrs = ['shadowed', 'bordered'];

  /**
   * 创建 VBox 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      shadowed: false,
      bordered: false,
    });

    // 3. 设置基础 CSS 类
    this.addClass('yoya-box');

    // 4. 设置默认样式（宽高 100%，透明背景，继承字体颜色）
    this.styles({
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      color: 'inherit',
      boxSizing: 'border-box',
    });

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    // shadowed 状态
    this.registerStateHandler('shadowed', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-box--shadowed');
      } else {
        host.removeClass('yoya-box--shadowed');
      }
    });

    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-box--bordered');
      } else {
        host.removeClass('yoya-box--bordered');
      }
    });
  }

  /**
   * 设置背景颜色
   * @param {string} color - 颜色值（支持 CSS 变量、hex、rgb/rgba 等）
   * @returns {this}
   */
  background(color) {
    if (color === undefined) return this.style('background-color');
    this.style('background-color', color);
    return this;
  }

  /**
   * 设置背景透明度
   * @param {number} value - 透明度值 (0-1)
   * @returns {this}
   */
  opacity(value) {
    if (value === undefined) return this.style('opacity');
    this.style('opacity', value);
    return this;
  }

  /**
   * 设置圆角
   * @param {string|number} value - 圆角值（支持 'sm' | 'md' | 'lg' | 'xl' 或具体像素值）
   * @returns {this}
   */
  radius(value) {
    if (value === undefined) return this.style('border-radius');

    // 支持预设值
    const radiusMap = {
      'sm': 'var(--yoya-radius-sm, 4px)',
      'md': 'var(--yoya-radius-md, 6px)',
      'lg': 'var(--yoya-radius-lg, 8px)',
      'xl': 'var(--yoya-radius-xl, 12px)',
    };

    const radiusValue = radiusMap[value] || value;
    this.style('border-radius', radiusValue);
    return this;
  }

  /**
   * 设置阴影
   * @param {string|boolean} value - 阴影值（支持 true/false 或具体阴影值）
   * @returns {this}
   */
  shadow(value) {
    if (value === undefined) return this.setState('shadowed', true);

    if (typeof value === 'boolean') {
      return this.setState('shadowed', value);
    }

    // 支持预设值
    const shadowMap = {
      'sm': 'var(--yoya-shadow, 0 2px 8px rgba(0,0,0,0.08))',
      'md': 'var(--yoya-shadow, 0 4px 12px rgba(0,0,0,0.08))',
      'lg': 'var(--yoya-shadow-hover, 0 6px 16px rgba(0,0,0,0.15))',
      'xl': 'var(--yoya-shadow-elevated, 0 8px 24px rgba(0,0,0,0.12))',
    };

    const shadowValue = shadowMap[value] || value;
    this.style('box-shadow', shadowValue);
    this.setState('shadowed', true);
    return this;
  }

  /**
   * 设置边框
   * @param {string|boolean} value - 边框值（支持 true/false 或具体边框值）
   * @returns {this}
   */
  border(value) {
    if (value === undefined) return this.setState('bordered', true);

    if (typeof value === 'boolean') {
      return this.setState('bordered', value);
    }

    this.style('border', value);
    this.setState('bordered', true);
    return this;
  }

  /**
   * 设置内边距
   * @param {string} value - 内边距值（支持 'xs' | 'sm' | 'md' | 'lg' | 'xl' 或具体像素值）
   * @returns {this}
   */
  padding(value) {
    if (value === undefined) return this.style('padding');

    const paddingMap = {
      'xs': 'var(--yoya-padding-xs, 4px)',
      'sm': 'var(--yoya-padding-sm, 6px)',
      'md': 'var(--yoya-padding-md, 8px)',
      'lg': 'var(--yoya-padding-lg, 10px)',
      'xl': 'var(--yoya-padding-xl, 16px)',
    };

    const paddingValue = paddingMap[value] || value;
    this.style('padding', paddingValue);
    return this;
  }

  /**
   * 设置外边距
   * @param {string} value - 外边距值（支持 'xs' | 'sm' | 'md' | 'lg' | 'xl' 或具体像素值）
   * @returns {this}
   */
  margin(value) {
    if (value === undefined) return this.style('margin');

    const marginMap = {
      'xs': 'var(--yoya-margin-xs, 4px)',
      'sm': 'var(--yoya-margin-sm, 6px)',
      'md': 'var(--yoya-margin-md, 8px)',
      'lg': 'var(--yoya-margin-lg, 10px)',
      'xl': 'var(--yoya-margin-xl, 16px)',
    };

    const marginValue = marginMap[value] || value;
    this.style('margin', marginValue);
    return this;
  }

  /**
   * 设置宽度
   * @param {string} value - 宽度值
   * @returns {this}
   */
  width(value) {
    if (value === undefined) return this.style('width');
    this.style('width', value);
    return this;
  }

  /**
   * 设置高度
   * @param {string} value - 高度值
   * @returns {this}
   */
  height(value) {
    if (value === undefined) return this.style('height');
    this.style('height', value);
    return this;
  }

  /**
   * 设置字体颜色
   * @param {string} color - 颜色值
   * @returns {this}
   */
  color(color) {
    if (color === undefined) return this.style('color');
    this.style('color', color);
    return this;
  }

  /**
   * 启用阴影
   * @returns {this}
   */
  withShadow() {
    return this.setState('shadowed', true);
  }

  /**
   * 启用边框
   * @returns {this}
   */
  withBorder() {
    return this.setState('bordered', true);
  }
}

/**
 * 创建 VBox 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VBox}
 */
function vBox(setup = null) {
  return new VBox(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 vBox 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vBox = function(setup = null) {
  const el = vBox(setup);
  this.child(el);
  return this;
};

/**
 * Yoya.Basic - Card Component
 * 卡片组件：提供卡片布局容器，支持头部、内容、底部结构
 * @module Yoya.Card
 * @example
 * // 基础卡片
 * import { vCard, vCardHeader, vCardBody, vCardFooter } from '../yoya/index.js';
 *
 * vCard(c => {
 *   c.vCardHeader('卡片标题');
 *   c.vCardBody('卡片内容');
 *   c.vCardFooter(b => {
 *     b.button('操作');
 *   });
 * });
 *
 * // 悬浮卡片
 * vCard(c => {
 *   c.hoverable();
 *   c.vCardBody('悬浮效果卡片');
 * });
 */


// ============================================
// VCard 卡片布局
// ============================================

/**
 * VCard 卡片容器
 * 支持 hoverable、bordered、noShadow 等状态
 * @class
 * @extends Tag
 */
class VCard extends Tag {
  static _stateAttrs = ['hoverable', 'bordered', 'noShadow'];

  /**
   * 创建 VCard 卡片实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      hoverable: false,
      bordered: false,
      noShadow: false,
    });

    // 3. 设置基础 CSS 类
    this.addClass('yoya-card');

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置卡片内容（支持函数/字符串/对象配置）
   * @param {Function|string|Object} setup - 初始化配置
   * @returns {this}
   */
  setup(setup) {
    if (typeof setup === 'function') {
      setup(this);
    } else if (typeof setup === 'string') {
      // 字符串作为卡片内容
      this.vCardBody(setup);
    } else if (typeof setup === 'object' && setup !== null) {
      // 对象配置：支持 header, body, footer 等属性
      if (setup.header !== undefined) {
        if (typeof setup.header === 'function') {
          this.vCardHeader(setup.header);
        } else if (typeof setup.header === 'string') {
          this.vCardHeader(setup.header);
        } else {
          this.vCardHeader(c => c.child(setup.header));
        }
      }
      if (setup.body !== undefined) {
        if (typeof setup.body === 'function') {
          this.vCardBody(setup.body);
        } else if (typeof setup.body === 'string') {
          this.vCardBody(setup.body);
        } else {
          this.vCardBody(c => c.child(setup.body));
        }
      }
      if (setup.footer !== undefined) {
        if (typeof setup.footer === 'function') {
          this.vCardFooter(setup.footer);
        } else if (typeof setup.footer === 'string') {
          this.vCardFooter(setup.footer);
        } else {
          this.vCardFooter(c => c.child(setup.footer));
        }
      }
      // 处理其他配置（class, style 等）
      if (setup.class) this.className(setup.class);
      if (setup.style) this.styles(setup.style);
      if (setup.onclick) this.on('click', setup.onclick);
    }
    return this;
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    // hoverable 状态
    this.registerStateHandler('hoverable', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-card--hoverable');
      } else {
        host.removeClass('yoya-card--hoverable');
      }
    });

    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-card--outlined');
      } else {
        host.removeClass('yoya-card--outlined');
      }
    });

    // noShadow 状态
    this.registerStateHandler('noShadow', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-card--no-shadow');
      } else {
        host.removeClass('yoya-card--no-shadow');
      }
    });
  }

  /**
   * 启用悬浮效果（鼠标悬停时上移 + 阴影）
   * @returns {this}
   */
  hoverable() {
    return this.setState('hoverable', true);
  }

  /**
   * 移除边框
   * @returns {this}
   */
  noBorder() {
    return this.style('border', 'none');
  }

  /**
   * 移除阴影
   * @returns {this}
   */
  noShadow() {
    return this.setState('noShadow', true);
  }

  /**
   * 启用边框样式
   * @returns {this}
   */
  bordered() {
    return this.setState('bordered', true);
  }

  /**
   * 添加卡片头部
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  /**
   * 添加卡片头部
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  vCardHeader(setup = null) {
    const el = vCardHeader(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加卡片内容
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  vCardBody(setup = null) {
    const el = vCardBody(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加卡片底部
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  vCardFooter(setup = null) {
    const el = vCardFooter(setup);
    this.child(el);
    return this;
  }

  // 兼容旧方法名
  cardHeader(setup = null) { return this.vCardHeader(setup); }
  cardBody(setup = null) { return this.vCardBody(setup); }
  cardFooter(setup = null) { return this.vCardFooter(setup); }
}

/**
 * 创建 VCard 卡片
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VCard}
 */
function vCard(setup = null) {
  return new VCard(setup);
}

// ============================================
// VCardHeader 卡片头部
// ============================================

/**
 * VCardHeader 卡片头部容器
 * @class
 * @extends Tag
 */
class VCardHeader extends Tag {
  /**
   * 创建 VCardHeader 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.addClass('yoya-card__header');
  }
}

/**
 * 创建 VCardHeader 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VCardHeader}
 */
function vCardHeader(setup = null) {
  return new VCardHeader(setup);
}

// ============================================
// VCardBody 卡片内容
// ============================================

/**
 * VCardBody 卡片内容容器
 * @class
 * @extends Tag
 */
class VCardBody extends Tag {
  /**
   * 创建 VCardBody 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.addClass('yoya-card__body');
  }
}

/**
 * 创建 VCardBody 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VCardBody}
 */
function vCardBody(setup = null) {
  return new VCardBody(setup);
}

// ============================================
// VCardFooter 卡片底部
// ============================================

/**
 * VCardFooter 卡片底部容器
 * @class
 * @extends Tag
 */
class VCardFooter extends Tag {
  /**
   * 创建 VCardFooter 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.addClass('yoya-card__footer');
  }
}

/**
 * 创建 VCardFooter 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VCardFooter}
 */
function vCardFooter(setup = null) {
  return new VCardFooter(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 vCard 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vCard = function(setup = null) {
  const el = vCard(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vCardHeader 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vCardHeader = function(setup = null) {
  const el = vCardHeader(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vCardBody 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vCardBody = function(setup = null) {
  const el = vCardBody(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vCardFooter 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vCardFooter = function(setup = null) {
  const el = vCardFooter(setup);
  this.child(el);
  return this;
};

// 兼容旧方法名
Tag.prototype.card = Tag.prototype.vCard;
Tag.prototype.cardHeader = Tag.prototype.vCardHeader;
Tag.prototype.cardBody = Tag.prototype.vCardBody;
Tag.prototype.cardFooter = Tag.prototype.vCardFooter;

/**
 * Yoya.Components - Button
 * 带主题样式的按钮组件
 */


// ============================================
// VButton 按钮组件
// ============================================

class VButton extends Tag {
  // 状态属性
  static _stateAttrs = ['disabled', 'loading', 'block', 'ghost', 'hovered'];

  constructor(content = '', setup = null) {
    // 如果 content 是函数，则它是 setup
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }
    // 如果 content 是对象且 setup 未定义，说明是 vButton({ onClick: ... }) 单参数用法
    else if (typeof content === 'object' && content !== null && setup === undefined) {
      setup = content;
      content = '';
    }
    // 正确用法：vButton("文本", { setupObject }) - content 是字符串，setup 是对象，无需处理

    super('button', null);
    // this._el 已在 super() 中创建

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      loading: false,
      block: false,
      ghost: false,
      hovered: false,
      type: 'default'
    });

    // 3. 设置基础 CSS 类
    this.addClass('yoya-button');

    // 4. 应用默认类型 CSS 类
    this._applyTypeClass();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 更新内容（setup 可能已经设置了内容，所以只在没有内容时才使用 content 参数）
    if (content && !this._content) {
      this._content = content;
      this._updateContent();
    }
  }

  // 应用类型 CSS 类
  _applyTypeClass() {
    const type = this._type || 'default';

    // 移除旧类型类
    this.removeClass('yoya-button--primary')
        .removeClass('yoya-button--success')
        .removeClass('yoya-button--warning')
        .removeClass('yoya-button--danger')
        .removeClass('yoya-button--info')
        .removeClass('yoya-button--default');

    // 添加新类型类
    this.addClass(`yoya-button--${type}`);

    // 处理 ghost 状态
    if (this.hasState('ghost')) {
      this.addClass('yoya-button--ghost');
    } else {
      this.removeClass('yoya-button--ghost');
    }
  }

  // 注册状态处理器
  _registerStateHandlers() {
    // disabled 状态
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-button--disabled');
        host.attr('disabled', 'true');
      } else {
        host.removeClass('yoya-button--disabled');
        host.attr('disabled', 'false');
      }
    });

    // loading 状态
    this.registerStateHandler('loading', (loading, host) => {
      if (loading) {
        host.addClass('yoya-button--loading');
      } else {
        host.removeClass('yoya-button--loading');
      }
      host._updateContent();
    });

    // block 状态（占满容器）
    this.registerStateHandler('block', (isBlock, host) => {
      if (isBlock) {
        host.addClass('yoya-button--block');
      } else {
        host.removeClass('yoya-button--block');
      }
    });

    // ghost 状态
    this.registerStateHandler('ghost', (isGhost, host) => {
      if (isGhost) {
        host.addClass('yoya-button--ghost');
      } else {
        host.removeClass('yoya-button--ghost');
      }
      host._applyTypeClass();
    });

    // hovered 状态 - CSS :hover 已处理，无需额外逻辑
  }

  // 更新内容（支持 loading 状态）- 复用元素，不重新创建
  _updateContent() {
    // 复用或创建 loading 图标
    if (this.hasState('loading')) {
      if (!this._loadingSpinner) {
        this._loadingSpinner = span(s => {
          s.styles({
            display: 'inline-block',
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderBottomColor: 'transparent',
            borderRadius: '50%',
            animation: 'buttonLoadingSpin 0.8s linear infinite',
          });
        });
        // 在内容元素之前插入
        const contentIndex = this._children.indexOf(this._contentEl);
        if (contentIndex >= 0) {
          this._children.splice(contentIndex, 0, this._loadingSpinner);
        } else {
          this.child(this._loadingSpinner);
        }
      }
      this._loadingSpinner.style('display', 'inline-block');
    } else {
      if (this._loadingSpinner) {
        this._loadingSpinner.style('display', 'none');
      }
    }

    // 复用或创建内容元素
    if (!this._contentEl) {
      this._contentEl = span(c => {
        c.styles({ display: 'inline-block' });
      });
      this.child(this._contentEl);
    }

    if (this._content) {
      this._contentEl.html(this._content);
    }
  }

  _ensureContentEl() {
    if (!this._contentEl) {
      this._contentEl = span(c => {
        c.styles({ display: "inline-block" });
      });
      this.child(this._contentEl);
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  text(content) {
    this._content = content;
    this._ensureContentEl();
    if (this._contentEl) {
      this._contentEl.html(this._content);
    }
    return this;
  }

  type(value) {
    if (value === undefined) return this._type;
    this._type = value;
    this._applyTypeClass();
    return this;
  }

  size(value) {
    if (value === undefined) return this._size;

    // 移除旧尺寸类
    this.removeClass('yoya-button--small')
        .removeClass('yoya-button--medium')
        .removeClass('yoya-button--large');

    this._size = value;

    // 添加新尺寸类
    if (value === 'small' || value === 'medium' || value === 'large') {
      this.addClass(`yoya-button--${value}`);
    } else {
      this.addClass('yoya-button--medium'); // 默认尺寸
    }

    return this;
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  loading(value = true) {
    return this.setState('loading', value);
  }

  block(value = true) {
    return this.setState('block', value);
  }

  ghost(value = true) {
    return this.setState('ghost', value);
  }

  // 事件方法 - 基于 Tag._wrapHandler 包装器
  // onClick 直接使用 Tag 基类的 onClick() 方法
}

function vButton(content = '', setup = null) {
  return new VButton(content, setup);
}

// ============================================
// VButtons - 按钮组组件（紧凑模式）
// ============================================

class VButtons extends Tag {
  // 状态属性
  static _stateAttrs = ['vertical', 'compact', 'size'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      vertical: false,
      compact: false,
      size: null
    });

    // 3. 设置基础 CSS 类
    this.addClass('yoya-buttons');

    // 4. 注册状态处理器
    this._registerStateHandlers();

    // 5. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 注册状态处理器
  _registerStateHandlers() {
    // vertical 状态 - 控制布局方向
    this.registerStateHandler('vertical', (isVertical, host) => {
      if (isVertical) {
        host.addClass('yoya-buttons--vertical');
        host.removeClass('yoya-buttons--horizontal');
      } else {
        host.addClass('yoya-buttons--horizontal');
        host.removeClass('yoya-buttons--vertical');
      }
    });

    // compact 状态 - 控制是否紧凑模式
    this.registerStateHandler('compact', (isCompact, host) => {
      if (isCompact) {
        host.addClass('yoya-buttons--compact');
      } else {
        host.removeClass('yoya-buttons--compact');
      }
    });

    // size 状态 - 控制按钮尺寸（传递给子按钮）
    this.registerStateHandler('size', (size, host) => {
      // VButtons 本身不直接应用尺寸类，而是在添加按钮时传递给子按钮
      if (host._itemsInitialized) {
        host._applySizeToChildren(size);
      }
    });
  }

  // 应用尺寸到所有子按钮
  _applySizeToChildren(size) {
    this._children.forEach(child => {
      if (child instanceof VButton) {
        child.size(size);
      }
    });
  }

  // ============================================
  // 链式方法
  // ============================================

  // 添加单个按钮
  button(content = '', setup = null) {
    const btn = vButton(content, setup);
    this.child(btn);
    return this;
  }

  // 批量添加按钮（旧 API，保留兼容）
  buttons(buttonConfigs) {
    if (Array.isArray(buttonConfigs)) {
      buttonConfigs.forEach(config => {
        if (typeof config === 'string') {
          this.button(config);
        } else if (typeof config === 'object' && config !== null) {
          this.button(config.content || '', config);
        }
      });
    }
    return this;
  }

  // 配置化添加按钮组（推荐）
  // 支持 vButtons({ items: [...], onClick: (item) => {...} })
  items(items, baseConfig = {}) {
    if (!Array.isArray(items)) {
      return this;
    }

    const {
      onClick,
      type = 'default',
      size,
      disabled = false,
      ghost = false,
      ...restBaseConfig
    } = baseConfig;

    this._itemsInitialized = true;

    items.forEach((item, index) => {
      // 支持字符串简写
      if (typeof item === 'string') {
        item = { name: item, label: item };
      }

      const {
        name,
        label,
        content = label || name || `Button ${index}`,
        type: itemType,
        size: itemSize,
        disabled: itemDisabled,
        ghost: itemGhost,
        onClick: itemOnClick,
        ...itemRest
      } = item;

      // 创建按钮
      this.button(content, btn => {
        // 应用基础配置
        if (type && !itemType) btn.type(type);
        if (itemType) btn.type(itemType);
        if (size && !itemSize) btn.size(size);
        if (itemSize) btn.size(itemSize);
        if (disabled && !itemDisabled) btn.disabled(disabled);
        if (itemDisabled) btn.disabled(itemDisabled);
        if (ghost && !itemGhost) btn.ghost(ghost);
        if (itemGhost) btn.ghost(itemGhost);

        // 应用其他配置
        Object.keys(itemRest).forEach(key => {
          if (typeof btn[key] === 'function') {
            btn[key](itemRest[key]);
          }
        });

        // 统一 onClick 处理：先调用 item.onClick，再调用统一的 onClick
        btn.on('click', (e) => {
          if (itemOnClick) itemOnClick(e, item, index);
          if (onClick) onClick(e, { ...item, index }, index);
        });
      });
    });

    return this;
  }

  // 设置布局方向
  vertical(value = true) {
    if (value === undefined) return this.hasState('vertical');
    return this.setState('vertical', value);
  }

  // 快捷方法：横向布局
  horizontal() {
    return this.setState('vertical', false);
  }

  // 设置紧凑模式
  compact(value = true) {
    if (value === undefined) return this.hasState('compact');
    return this.setState('compact', value);
  }

  // 设置间距
  gap(value) {
    if (value === undefined) return this.style('gap');
    this.style('gap', value);
    return this;
  }

  // 设置按钮尺寸
  size(value) {
    if (value === undefined) return this._size;
    this.setState('size', value);
    return this;
  }
}

function vButtons(setup = null) {
  // 支持 vButtons({ items: [...], onClick: ... }) 对象配置方式
  if (setup !== null && typeof setup === 'object' && !Array.isArray(setup)) {
    const { items, onClick, vertical, horizontal, compact, gap, size, ...restSetup } = setup;

    return new VButtons(box => {
      // 设置布局
      if (vertical) box.vertical(true);
      if (horizontal) box.horizontal();
      if (compact) box.compact(true);
      if (gap) box.gap(gap);
      if (size) box.size(size);

      // 应用其他配置
      Object.keys(restSetup).forEach(key => {
        if (typeof box[key] === 'function') {
          box[key](restSetup[key]);
        }
      });

      // 添加按钮项
      if (items && Array.isArray(items)) {
        box.items(items, { onClick, size });
      }
    });
  }

  return new VButtons(setup);
}

// Tag 原型扩展
Tag.prototype.vButtons = function(setup = null) {
  const buttons = vButtons(setup);
  this.child(buttons);
  return this;
};

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vButton = function(content = '', setup = null) {
  const btn = vButton(content, setup);
  this.child(btn);
  return this;
};

/**
 * Yoya.Basic - Menu Components
 * 菜单组件库：提供菜单、下拉菜单、右键菜单、侧边栏等组件
 * @module Yoya.Menu
 * @example
 * // 基础菜单
 * import { vMenu, vMenuItem, vMenuDivider } from '../yoya/index.js';
 *
 * vMenu(m => {
 *   m.item(it => {
 *     it.text('📋 菜单项 1')
 *       .onclick(() => console.log('点击 1'));
 *   });
 *   m.item(it => {
 *     it.text('📁 菜单项 2')
 *       .onclick(() => console.log('点击 2'));
 *   });
 *   m.divider();
 *   m.item(it => {
 *     it.text('⚙️ 设置')
 *       .onclick(() => console.log('设置'));
 *   });
 * });
 *
 * // 带图标的菜单项
 * vMenuItem(item => {
 *   item.icon('<span>🏠</span>')
 *       .text('首页')
 *       .shortcut('Ctrl+H')
 *       .active();
 * });
 */


// ============================================
// VMenu 菜单
// ============================================

/**
 * VMenu 菜单容器
 * 支持垂直/水平布局，可包含菜单项、分割线、子菜单等
 * @class
 * @extends Tag
 */
class VMenu extends Tag {
  /**
   * 创建 VMenu 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    // 设置基础 CSS 类
    this.addClass('yoya-menu');

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置垂直布局
   * @returns {this}
   */
  vertical() {
    this.removeClass('yoya-menu--horizontal');
    return this;
  }

  /**
   * 设置水平布局
   * @returns {this}
   */
  horizontal() {
    this.addClass('yoya-menu--horizontal');
    return this;
  }

  /**
   * 设置紧凑模式（减小内边距）
   * @returns {this}
   */
  compact() {
    this.addClass('yoya-menu--compact');
    return this;
  }

  /**
   * 移除阴影
   * @returns {this}
   */
  noShadow() {
    this.addClass('yoya-menu--no-shadow');
    return this;
  }

  /**
   * 添加边框
   * @returns {this}
   */
  bordered() {
    this.addClass('yoya-menu--bordered');
    return this;
  }

  /**
   * 添加菜单项
   * @param {string|Function} [content=''] - 内容或 setup 函数
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuItem}
   */
  item(content = '', setup = null) {
    const el = vMenuItem(content, setup);
    this.child(el);
    return el;
  }

  /**
   * 添加分割线
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  divider(setup = null) {
    const el = vMenuDivider(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加菜单组
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuGroup}
   */
  group(setup = null) {
    const el = vMenuGroup(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加子菜单
   * @param {string} title - 子菜单标题
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VSubMenu}
   */
  submenu(title, setup = null) {
    // 使用 vSubMenu 创建子菜单
    const subMenu = vSubMenu(title, setup);
    this.child(subMenu);
    return subMenu;
  }
}

/**
 * 创建 VMenu 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMenu}
 */
function vMenu(setup = null) {
  return new VMenu(setup);
}

// ============================================
// VMenuItem 菜单项
// ============================================

/**
 * VMenuItem 菜单项
 * 支持 disabled、active、danger、hoverable、expanded 等状态
 * @class
 * @extends Tag
 */
class VMenuItem extends Tag {
  static _stateAttrs = ['disabled', 'active', 'danger', 'hoverable', 'expanded'];

  /**
   * 创建 VMenuItem 实例
   * @param {string|Function} [content=''] - 内容或 setup 函数
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(content = '', setup = null) {
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }

    super('div', null);
    this.registerStateAttrs(...this.constructor._stateAttrs);
    this._registerStateHandlers();

    // 设置基础 CSS 类
    this.addClass('yoya-menu-item');

    this.saveStateSnapshot('base');
    this._registerHoverInterceptor();
    this._setupInteractions();

    if (setup !== null) {
      this.setup(setup);
    }

    this.initializeStates({
      disabled: false,
      active: false,
      danger: false,
      hoverable: false,
      expanded: false,
    });

    if (content) {
      this.text(content);
    }
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-menu-item--disabled');
      } else {
        host.removeClass('yoya-menu-item--disabled');
      }
    });

    this.registerStateHandler('active', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-menu-item--active');
      } else {
        host.removeClass('yoya-menu-item--active');
      }
    });

    this.registerStateHandler('danger', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-menu-item--danger');
      } else {
        host.removeClass('yoya-menu-item--danger');
      }
    });

    this.registerStateHandler('hoverable', () => {
      // hoverable 状态的视觉效果由拦截器动态处理
    });

    // expanded 状态 - 用于子菜单展开/折叠
    this.registerStateHandler('expanded', (expanded, host) => {
      // 获取子菜单容器引用（从 titleItem 上获取）
      const submenuContainer = host._submenuContainer;
      const arrowEl = host._arrowEl;

      if (submenuContainer && arrowEl && submenuContainer._boundElement && arrowEl._boundElement) {
        if (expanded) {
          submenuContainer._boundElement.style.display = 'flex';
          arrowEl._boundElement.style.transform = 'rotate(90deg)';
          // 展开时高亮父菜单项
          host.addClass('yoya-menu-item--expanded');
        } else {
          submenuContainer._boundElement.style.display = 'none';
          arrowEl._boundElement.style.transform = 'rotate(0deg)';
          // 折叠时恢复背景（如果没有 active）
          if (!host.hasState('active')) {
            host.removeClass('yoya-menu-item--expanded');
          }
        }
      }
    });
  }

  /**
   * 注册悬浮拦截器
   * @private
   */
  _registerHoverInterceptor() {
    this.registerStateInterceptor((stateName, value) => {
      if (this.hasState('disabled') && stateName !== 'disabled') {
        return null;
      }
      return { stateName, value };
    });
  }

  /**
   * 设置交互事件（悬浮、点击）
   * @private
   */
  _setupInteractions() {
    const self = this;

    this.on('mouseenter', () => {
      if (!self.hasState('disabled')) {
        self.addClass('yoya-menu-item--hovering');
      }
    }).on('mouseleave', () => {
      if (!self.hasState('disabled') && !self.hasState('active')) {
        self.removeClass('yoya-menu-item--hovering');
      }
    });

    this.on('click', (e) => {
      if (!self.hasState('disabled')) {
        // 有子菜单：只能展开/折叠，不能选中
        if (self._submenuContainer || self._arrowEl) {
          e.stopPropagation();
          const isExpanded = self.getState('expanded') || false;
          self.setState('expanded', !isExpanded);
          return;
        }

        // 没有子菜单（叶子节点）：可以选中
        const parent = self._boundElement?.parentNode;
        if (parent) {
          Array.from(parent.children).forEach(child => {
            if (child._vMenuItem) {
              child._vMenuItem.setState('active', false);
            }
          });
        }
        self.setState('active', true);
        if (self._onclick) {
          self._onclick({ event: e, text: self._text, icon: self._icon, target: self });
        }
      }
    });
  }

  /**
   * 添加子菜单
   * @param {string} title - 子菜单标题
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VSubMenu}
   */
  submenu(title, setup = null) {
    // 使用 vSubMenu 创建子菜单
    const subMenu = vSubMenu(title, setup);
    this._submenu = subMenu;
    this._submenuContainer = subMenu._container;

    // 为此菜单项添加展开/折叠箭头
    this._ensureArrow();

    return subMenu;
  }

  /**
   * 确保箭头元素存在
   * @private
   */
  _ensureArrow() {
    if (this._arrowEl) return;
    this._arrowEl = span(arrow => {
      arrow.styles({
        marginLeft: 'auto',
        fontSize: '10px',
        transition: 'transform 0.2s',
        opacity: '0.5',
        display: 'inline-block',
        flexShrink: '0',
      });
      arrow.text('▶');
    });
  }

  /**
   * 确保箭头元素已添加到子元素
   * @private
   */
  _ensureArrowEl() {
    if (!this._arrowEl) return;
    if (!this._children.includes(this._arrowEl)) {
      this.child(this._arrowEl);
    }
  }

  /**
   * 设置菜单项文本
   * @param {string} content - 文本内容
   * @returns {this}
   */
  text(content) {
    this._text = content;
    this._updateContent();
    return this;
  }

  /**
   * 设置菜单项图标
   * @param {string} content - 图标 HTML 或文本
   * @returns {this}
   */
  icon(content) {
    this._icon = content;
    this._ensureIconBox();
    if (this._iconBox) {
      this._iconBox.html(this._icon);
    }
    return this;
  }

  /**
   * 设置点击事件处理
   * @param {Function} fn - 事件处理函数
   * @returns {this}
   */
  onclick(fn) {
    this._onclick = fn;
    return this;
  }

  /**
   * 设置点击事件处理（统一事件格式）
   * @param {Function} handler - 事件处理函数
   * @returns {this}
   */
  onClick(handler) {
    this._onclick = handler;
    return this;
  }

  /**
   * 禁用菜单项
   * @returns {this}
   */
  disabled() {
    return this.setState('disabled', true);
  }

  /**
   * 启用菜单项
   * @returns {this}
   */
  enabled() {
    return this.setState('disabled', false);
  }

  /**
   * 激活菜单项
   * @returns {this}
   */
  active() {
    return this.setState('active', true);
  }

  /**
   * 取消激活菜单项
   * @returns {this}
   */
  inactive() {
    return this.setState('active', false);
  }

  /**
   * 设置为危险样式（红色）
   * @returns {this}
   */
  danger() {
    return this.setState('danger', true);
  }

  /**
   * 启用悬浮效果
   * @returns {this}
   */
  hoverable() {
    return this.setState('hoverable', true);
  }

  /**
   * 设置快捷键提示
   * @param {string} key - 快捷键文本
   * @returns {this}
   */
  shortcut(key) {
    this._shortcut = key;
    this._updateContent();
    return this;
  }

  /**
   * 切换状态
   * @param {string} stateName - 状态名称
   * @returns {this}
   */
  toggleState(stateName) {
    return this.setState(stateName, !this.hasState(stateName));
  }

  /**
   * 确保图标容器存在
   * @private
   */
  _ensureIconBox() {
    if (this._iconBox) return;
    this._iconBox = span(iconEl => {
      iconEl.styles({ display: 'inline-flex', alignItems: 'center', color: 'inherit', pointerEvents: 'none' });
    });
    this.child(this._iconBox);
  }

  /**
   * 确保文本容器存在
   * @private
   */
  _ensureTextBox() {
    if (this._textBox) return;
    this._textBox = span(textEl => {
      textEl.styles({
        flex: 1,
        color: 'inherit',
        pointerEvents: 'none',
        opacity: '1',
        transition: 'opacity 0.2s ease, width 0.3s ease',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      });
    });
    this.child(this._textBox);
  }

  /**
   * 确保快捷键容器存在
   * @private
   */
  _ensureShortcutBox() {
    if (this._shortcutBox) return;
    this._shortcutBox = span(shortcutEl => {
      shortcutEl.styles({
        fontSize: '12px',
        color: 'var(--yoya-text-tertiary, #999)',
        background: 'var(--yoya-bg-secondary, #f5f5f5)',
        padding: '2px 6px',
        borderRadius: '4px',
        pointerEvents: 'none'
      });
    });
    this.child(this._shortcutBox);
  }

  _updateContent() {
    // 清除旧的子元素（从 _children 数组中移除）
    this._children = this._children.filter(c => {
      return c !== this._iconBox && c !== this._textBox && c !== this._shortcutBox && c !== this._arrowEl;
    });

    this._iconBox = null;
    this._textBox = null;
    this._shortcutBox = null;
    this._arrowEl = null;

    if (this._icon) {
      this._ensureIconBox();
      this._iconBox.html(this._icon);
    }

    if (this._text) {
      this._ensureTextBox();
      this._textBox.text(this._text);
    }

    if (this._shortcut) {
      this._ensureShortcutBox();
      this._shortcutBox.text(this._shortcut);
    }

    // 添加箭头（如果有子菜单）
    if (this._submenuContainer) {
      this._ensureArrowEl();
    }
  }

  /**
   * 渲染 DOM 元素
   * @returns {HTMLElement|null}
   */
  renderDom() {
    const element = super.renderDom();
    if (element) {
      element._vMenuItem = this;
    }
    return element;
  }
}

/**
 * 创建 VMenuItem 实例
 * @param {string|Function} [content=''] - 内容或 setup 函数
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMenuItem}
 */
function vMenuItem(content = '', setup = null) {
  return new VMenuItem(content, setup);
}

// ============================================
// VMenuDivider 菜单分割线
// ============================================

/**
 * VMenuDivider 菜单分割线
 * @class
 * @extends Tag
 */
class VMenuDivider extends Tag {
  /**
   * 创建 VMenuDivider 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('hr', setup);
    this.addClass('yoya-menu-divider');
  }
}

/**
 * 创建 VMenuDivider 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMenuDivider}
 */
function vMenuDivider(setup = null) {
  return new VMenuDivider(setup);
}

// ============================================
// VMenuGroup 菜单组
// ============================================

/**
 * VMenuGroup 菜单组容器
 * @class
 * @extends Tag
 */
class VMenuGroup extends Tag {
  /**
   * 创建 VMenuGroup 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.addClass('yoya-menu-group');
  }

  /**
   * 设置组标签
   * @param {string} text - 标签文本
   * @returns {this}
   */
  label(text) {
    this._label = text;
    this._updateContent();
    return this;
  }

  /**
   * 添加菜单项
   * @param {string|Function} [content=''] - 内容或 setup 函数
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuItem}
   */
  item(content = '', setup = null) {
    const el = vMenuItem(content, setup);
    this.child(el);
    return el;
  }

  /**
   * 添加分割线
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  divider(setup = null) {
    const el = vMenuDivider(setup);
    this.child(el);
    return this;
  }

  /**
   * 更新内容（标签 + 菜单项）
   * @private
   */
  _updateContent() {
    const labelEl = this._children.find(c => c._isLabel);
    if (labelEl) {
      this._children = this._children.filter(c => c !== labelEl);
    }

    if (this._label) {
      const newLabelEl = span(label => {
        label.text(this._label);
        label.addClass('yoya-menu-group__label');
        label._isLabel = true;
      });

      const nonLabelChildren = this._children.filter(c => !c._isLabel);
      this._children = [newLabelEl, ...nonLabelChildren];
    }
  }
}

/**
 * 创建 VMenuGroup 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMenuGroup}
 */
function vMenuGroup(setup = null) {
  return new VMenuGroup(setup);
}

// ============================================
// VDropdownMenu 下拉菜单
// ============================================

/**
 * VDropdownMenu 下拉菜单
 * 支持点击触发展开/折叠，可设置点击外部关闭
 * @class
 * @extends Tag
 */
class VDropdownMenu extends Tag {
  /**
   * 创建 VDropdownMenu 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);
    this.style('position', 'relative');
    this.style('display', 'inline-block');
    this._triggerContent = null;
    this._menu = null;
    this._triggerWrap = null;
    this._menuContainer = null;
    this._arrow = null;
    this._built = false;

    if (setup !== null) {
      this.setup(setup);
    }

    this._buildStructure();
  }

  /**
   * 设置触发器内容
   * @param {string|Tag} content - 内容或标签
   * @returns {this}
   */
  trigger(content) {
    this._triggerContent = content;
    return this;
  }

  /**
   * 设置菜单内容
   * @param {VMenu} menu - 菜单实例
   * @returns {this}
   */
  menuContent(menu) {
    this._menu = menu;
    return this;
  }

  /**
   * 启用点击外部关闭
   * @returns {this}
   */
  closeOnClickOutside() {
    this._closeOnClickOutside = true;
    return this;
  }

  /**
   * 切换展开/折叠状态
   * @private
   */
  _toggle() {
    if (!this._menuContainer || !this._arrow) return;

    const menuEl = this._menuContainer._boundElement;
    const arrowEl = this._arrow._boundElement;

    if (!menuEl || !arrowEl) return;

    const isOpen = menuEl.style.display === 'block';
    menuEl.style.display = isOpen ? 'none' : 'block';
    arrowEl.style.transform = isOpen ? '' : 'rotate(180deg)';
  }

  /**
   * 构建下拉菜单结构
   * @private
   */
  _buildStructure() {
    if (this._built) return;

    this.clear();

    this._triggerWrap = div(wrap => {
      wrap.styles({
        cursor: 'pointer',
        padding: 'var(--yoya-dropdown-trigger-padding, 8px 16px)',
        background: 'var(--yoya-dropdown-trigger-bg, var(--yoya-primary))',
        color: 'var(--yoya-dropdown-trigger-color, white)',
        borderRadius: 'var(--yoya-dropdown-trigger-radius, 6px)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--yoya-dropdown-trigger-gap, 6px)',
        userSelect: 'none',
        transition: 'all 0.2s',
      });
      wrap.on('mouseenter', () => {
        wrap.style('background', 'var(--yoya-dropdown-trigger-hover-bg, var(--yoya-primary-dark))');
      });
      wrap.on('mouseleave', () => {
        wrap.style('background', 'var(--yoya-dropdown-trigger-bg, var(--yoya-primary))');
      });

      if (typeof this._triggerContent === 'string') {
        wrap.span(this._triggerContent);
      } else if (this._triggerContent && this._triggerContent.renderDom) {
        wrap.child(this._triggerContent);
      }

      wrap.span(arrow => {
        arrow.text('▼');
        arrow.styles({ fontSize: 'var(--yoya-dropdown-arrow-size, 10px)', transition: 'transform 0.2s' });
        this._arrow = arrow;
      });

      wrap.on('click', (e) => {
        e.stopPropagation();
        this._toggle();
      });
    });

    this.child(this._triggerWrap);

    if (this._menu) {
      this._menuContainer = div(menuWrap => {
        menuWrap.styles({
          position: 'absolute',
          top: 'calc(100% + var(--yoya-dropdown-menu-offset, 4px))',
          left: '0',
          minWidth: 'var(--yoya-dropdown-menu-min-width, 160px)',
          background: 'var(--yoya-dropdown-menu-bg, var(--yoya-bg))',
          borderRadius: 'var(--yoya-dropdown-menu-radius, var(--yoya-radius-md))',
          boxShadow: 'var(--yoya-dropdown-menu-shadow, var(--yoya-shadow-dropdown))',
          padding: 'var(--yoya-dropdown-menu-padding, 8px) 0',
          zIndex: 'var(--yoya-dropdown-z-index, 1000)',
          display: 'none',
        });

        if (this._menu._children) {
          this._menu._children.forEach(child => {
            if (child) menuWrap.child(child);
          });
        }
      });

      this.child(this._menuContainer);
    }

    if (this._closeOnClickOutside) {
      const closeHandler = (e) => {
        const element = this._boundElement;
        if (element && !element.contains(e.target)) {
          const menuEl = this._menuContainer?._boundElement;
          const arrowEl = this._arrow?._boundElement;
          if (menuEl) menuEl.style.display = 'none';
          if (arrowEl) arrowEl.style.transform = '';
        }
      };
      document.addEventListener('click', closeHandler);
    }

    this._built = true;
  }
}

/**
 * 创建 VDropdownMenu 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VDropdownMenu}
 */
function vDropdownMenu(setup = null) {
  return new VDropdownMenu(setup);
}

// ============================================
// VContextMenu 右键菜单
// ============================================

/**
 * VContextMenu 右键菜单
 * 绑定到指定元素的右键事件，在鼠标位置显示
 * @class
 * @extends Tag
 */
class VContextMenu extends Tag {
  /**
   * 创建 VContextMenu 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);
    this.styles({
      position: 'fixed',
      zIndex: 'var(--yoya-context-menu-z-index, 9999)',
      display: 'none',
      background: 'var(--yoya-context-menu-bg, var(--yoya-bg))',
      borderRadius: 'var(--yoya-context-menu-radius, var(--yoya-radius-md))',
      boxShadow: 'var(--yoya-context-menu-shadow, var(--yoya-shadow-dropdown))',
      padding: 'var(--yoya-context-menu-padding, 8px) 0',
      minWidth: 'var(--yoya-context-menu-min-width, 160px)',
      border: 'var(--yoya-context-menu-border, 1px solid var(--yoya-border))',
    });
    this._target = null;
    this._menu = null;
    this._built = false;

    if (setup !== null) {
      this.setup(setup);
    }

    this._buildContent();
  }

  /**
   * 绑定目标元素（右键触发）
   * @param {HTMLElement} element - 目标 DOM 元素
   * @returns {this}
   */
  target(element) {
    this._target = element;
    this._bindTarget();
    return this;
  }

  /**
   * 设置菜单内容
   * @param {VMenu} menu - 菜单实例
   * @returns {this}
   */
  menuContent(menu) {
    this._menu = menu;
    return this;
  }

  /**
   * 绑定目标元素事件
   * @private
   */
  _bindTarget() {
    if (!this._target) return;

    this._target.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.show(e.clientX, e.clientY);
    });

    document.addEventListener('click', () => { this.hide(); });
    window.addEventListener('scroll', () => { this.hide(); });
  }

  /**
   * 显示右键菜单
   * @param {number} x - x 坐标
   * @param {number} y - y 坐标
   * @returns {this}
   */
  show(x, y) {
    if (this._boundElement) {
      this._boundElement.style.display = 'block';
      this._boundElement.style.left = `${x}px`;
      this._boundElement.style.top = `${y}px`;

      const rect = this._boundElement.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        this._boundElement.style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > window.innerHeight) {
        this._boundElement.style.top = `${y - rect.height}px`;
      }
    }
    return this;
  }

  /**
   * 隐藏右键菜单
   * @returns {this}
   */
  hide() {
    if (this._boundElement) {
      this._boundElement.style.display = 'none';
    }
    return this;
  }

  /**
   * 构建菜单内容
   * @private
   */
  _buildContent() {
    if (this._built) return;

    this.clear();

    if (this._menu && this._menu._children) {
      this._menu._children.forEach(child => {
        if (child) this.child(child);
      });
    }

    this._built = true;
  }
}

/**
 * 创建 VContextMenu 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VContextMenu}
 */
function vContextMenu(setup = null) {
  return new VContextMenu(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 vMenu 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMenu = function(setup = null) {
  const el = vMenu(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vMenuItem 子元素
 * @param {string|Function} [content=''] - 内容或 setup 函数
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMenuItem = function(content = '', setup = null) {
  const el = vMenuItem(content, setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vMenuDivider 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMenuDivider = function(setup = null) {
  const el = vMenuDivider(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vDropdownMenu 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vDropdownMenu = function(setup = null) {
  const el = vDropdownMenu(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vMenuGroup 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMenuGroup = function(setup = null) {
  const el = vMenuGroup(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vContextMenu 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vContextMenu = function(setup = null) {
  const el = vContextMenu(setup);
  this.child(el);
  return this;
};

// 兼容旧方法名
Tag.prototype.menu = Tag.prototype.vMenu;
Tag.prototype.menuItem = Tag.prototype.vMenuItem;
Tag.prototype.menuDivider = Tag.prototype.vMenuDivider;
Tag.prototype.dropdownMenu = Tag.prototype.vDropdownMenu;
Tag.prototype.menuGroup = Tag.prototype.vMenuGroup;
Tag.prototype.contextMenu = Tag.prototype.vContextMenu;

// ============================================
// VSubMenu 子菜单
// ============================================

/**
 * VSubMenu 子菜单
 * 可展开/折叠的菜单项，包含子菜单项
 * @class
 * @extends Tag
 */
class VSubMenu extends Tag {
  static _stateAttrs = ['expanded'];

  /**
   * 创建 VSubMenu 实例
   * @param {string} [title=''] - 子菜单标题
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(title = '', setup = null) {
    super('div', null);

    this._title = title;
    this._submenuItems = [];
    this._arrowEl = null;
    this._headerItem = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({ expanded: false });

    // 3. 创建标题项（带箭头）
    this._headerItem = vMenuItem(title, item => {
      item.styles({ fontWeight: '500' });

      // 添加展开箭头
      item._arrowEl = span(arrow => {
        arrow.styles({
          marginLeft: 'auto',
          fontSize: '10px',
          transition: 'transform 0.2s',
          opacity: '0.5',
          display: 'inline-block',
          flexShrink: '0',
        });
        arrow.text('▶');
      });
      this._arrowEl = item._arrowEl;
      item.child(item._arrowEl);

      // 点击标题切换展开/折叠
      item.on('click', (e) => {
        e.stopPropagation();
        const isExpanded = this.getState('expanded') || false;
        this.setState('expanded', !isExpanded);
      });
    });

    // 4. 创建子菜单容器
    this._container = div(container => {
      container.styles({
        display: 'none',
        flexDirection: 'column',
        marginLeft: '16px',
        paddingLeft: '8px',
        borderLeft: '1px solid var(--yoya-border, #e0e0e0)',
        marginTop: '4px',
      });
    });

    // 5. 注册 expanded 状态处理器
    this.registerStateHandler('expanded', (expanded, host) => {
      if (host._container?._boundElement && host._arrowEl?._boundElement) {
        if (expanded) {
          host._container._boundElement.style.display = 'flex';
          host._arrowEl._boundElement.style.transform = 'rotate(90deg)';
        } else {
          host._container._boundElement.style.display = 'none';
          host._arrowEl._boundElement.style.transform = 'rotate(0deg)';
        }
      }
    });

    // 6. 执行 setup
    if (setup !== null) {
      if (typeof setup === 'function') {
        setup(this);
      } else if (typeof setup === 'object' && setup !== null) {
        this._setupObject(setup);
      }
    }
  }

  /**
   * 处理对象配置
   * @param {Object} config - 配置对象
   * @private
   */
  _setupObject(config) {
    // 处理对象配置
    if (config.items && Array.isArray(config.items)) {
      config.items.forEach(itemConfig => {
        this.item(itemConfig);
      });
    }
  }

  /**
   * 添加子菜单项
   * @param {string|Function} [content=''] - 内容或 setup 函数
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuItem}
   */
  item(content = '', setup = null) {
    const el = vMenuItem(content, setup);
    el.styles({ paddingLeft: '24px' });
    this._container.child(el);
    this._submenuItems.push(el);
    return el;
  }

  /**
   * 添加分割线
   * @returns {VMenuDivider}
   */
  divider() {
    const el = vMenuDivider();
    el.styles({ marginLeft: '16px' });
    this._container.child(el);
    return el;
  }

  /**
   * 渲染 DOM 元素
   * @returns {HTMLElement|null}
   */
  renderDom() {
    if (this._deleted) return null;

    // 确保子元素按正确顺序添加
    if (!this._children.includes(this._headerItem)) {
      this._children.unshift(this._headerItem);
    }
    if (!this._children.includes(this._container)) {
      this._children.push(this._container);
    }

    return super.renderDom();
  }
}

/**
 * 创建 VSubMenu 实例
 * @param {string} [title=''] - 子菜单标题
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VSubMenu}
 */
function vSubMenu(title = '', setup = null) {
  return new VSubMenu(title, setup);
}

// ============================================
// VSidebar 侧边栏菜单
// ============================================

/**
 * VSidebar 侧边栏菜单
 * 支持折叠/展开，可设置宽度、头部、内容、底部等
 * @class
 * @extends Tag
 */
class VSidebar extends Tag {
  static _stateAttrs = ['collapsed', 'expanded'];

  /**
   * 创建 VSidebar 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 配置
    this._width = 'var(--yoya-sidebar-width, 240px)';
    this._collapsedWidth = 'var(--yoya-sidebar-collapsed-width, 64px)';

    // 内部元素引用
    this._headerEl = null;
    this._contentEl = null;
    this._footerEl = null;
    this._toggleBtnEl = null;

    // 状态
    this._collapsed = false;

    // 1. 初始化状态
    this.initializeStates({
      collapsed: false,
      expanded: false,
    });

    // 2. 设置基础样式
    this._setupBaseStyles();

    // 3. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 4. 注册状态处理器
    this._registerStateHandlers();

    // 5. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置基础样式
   * @private
   */
  _setupBaseStyles() {
    this.addClass('yoya-sidebar');
  }

  _registerStateHandlers() {
    this.registerStateHandler('collapsed', (collapsed, host) => {
      const el = host._boundElement;

      if (collapsed) {
        // 折叠状态
        host.addClass('yoya-sidebar--collapsed');

        // 隐藏头部和尾部 - 带淡出效果
        if (host._headerEl) {
          host._headerEl.styles({
            opacity: '0',
            transform: 'translateX(-10px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          });
          setTimeout(() => {
            host._headerEl.style('display', 'none');
          }, 200);
        }
        if (host._footerEl) {
          host._footerEl.styles({
            opacity: '0',
            transform: 'translateX(-10px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          });
          setTimeout(() => {
            host._footerEl.style('display', 'none');
          }, 200);
        }

        // 隐藏菜单项文本 - 带淡出效果
        if (host._contentEl) {
          const items = host._contentEl._children.filter(c => c._textBox);
          items.forEach((item, index) => {
            setTimeout(() => {
              if (item._textBox) {
                item._textBox.styles({
                  opacity: '0',
                  transition: 'opacity 0.15s ease',
                });
              }
              if (item._shortcutBox) {
                item._shortcutBox.styles({
                  opacity: '0',
                  transition: 'opacity 0.15s ease',
                });
              }
            }, index * 30);
          });
        }

        if (el) {
          el.style.width = host._collapsedWidth;
          el.style.minWidth = host._collapsedWidth;
        }
      } else {
        // 展开状态
        host.removeClass('yoya-sidebar--collapsed');

        // 显示头部和尾部 - 带淡入效果
        if (host._headerEl) {
          host._headerEl.style('display', 'flex');
          setTimeout(() => {
            host._headerEl.styles({
              opacity: '1',
              transform: 'translateX(0)',
              transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s',
            });
          }, 50);
        }
        if (host._footerEl) {
          host._footerEl.style('display', 'flex');
          setTimeout(() => {
            host._footerEl.styles({
              opacity: '1',
              transform: 'translateX(0)',
              transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s',
            });
          }, 50);
        }

        // 显示菜单项文本 - 带阶梯淡入效果
        if (host._contentEl) {
          const items = host._contentEl._children.filter(c => c._textBox);
          items.forEach((item, index) => {
            setTimeout(() => {
              if (item._textBox) {
                item._textBox.style('display', '');
                item._textBox.styles({
                  opacity: '1',
                  transition: 'opacity 0.2s ease',
                });
              }
              if (item._shortcutBox) {
                item._shortcutBox.style('display', '');
                item._shortcutBox.styles({
                  opacity: '1',
                  transition: 'opacity 0.2s ease',
                });
              }
            }, 100 + index * 30);
          });
        }

        if (el) {
          el.style.width = host._width;
          el.style.minWidth = host._width;
        }
      }
    });
  }

  /**
   * 设置侧边栏宽度
   * @param {string} w - 宽度值
   * @returns {this}
   */
  width(w) {
    this._width = w;
    if (!this._collapsed) {
      this.style('width', w);
      this.style('minWidth', w);
    }
    return this;
  }

  /**
   * 设置折叠时宽度
   * @param {string} w - 宽度值
   * @returns {this}
   */
  collapsedWidth(w) {
    this._collapsedWidth = w;
    return this;
  }

  /**
   * 设置头部内容
   * @param {Function|string} setup - 初始化函数或文本
   * @returns {this}
   */
  header(setup) {
    if (!this._headerEl) {
      this._headerEl = div(header => {
        header.addClass('yoya-sidebar__header');
        header.styles({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--yoya-sidebar-header-padding, 16px)',
          borderBottom: 'var(--yoya-sidebar-header-border, 1px solid var(--yoya-border, #e0e0e0))',
          background: 'var(--yoya-sidebar-header-bg, var(--yoya-bg-secondary, #f7f8fa))',
          color: 'var(--yoya-sidebar-header-color, var(--yoya-text, #333))',
        });
      });
      this.child(this._headerEl);
    } else {
      this._headerEl.clear();
    }

    if (typeof setup === 'function') {
      setup(this._headerEl);
    } else if (typeof setup === 'string') {
      this._headerEl.text(setup);
    }

    return this;
  }

  /**
   * 设置内容区域
   * @param {Function} setup - 初始化函数
   * @returns {this}
   */
  content(setup) {
    if (!this._contentEl) {
      this._contentEl = div(content => {
        content.addClass('yoya-sidebar__content');
        content.styles({
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 'var(--yoya-sidebar-content-padding, 8px 0)',
        });
      });
      this.child(this._contentEl);
    } else {
      this._contentEl.clear();
    }

    if (typeof setup === 'function') {
      // 创建一个包装对象，提供便捷的 item、divider、group 方法
      const contentWrapper = {
        item: (content, itemSetup) => {
          const el = vMenuItem(content, itemSetup);
          this._contentEl.child(el);
          return el;
        },
        divider: () => {
          const el = vMenuDivider();
          el.styles({
            marginLeft: '8px',
            marginRight: '8px',
          });
          this._contentEl.child(el);
          return this;
        },
        group: (groupSetup) => {
          const el = vMenuGroup(groupSetup);
          this._contentEl.child(el);
          return el;
        },
        // 返回原始 div 元素供直接使用
        _el: this._contentEl,
      };
      setup(contentWrapper);
    }

    return this;
  }

  /**
   * 设置底部内容
   * @param {Function|string} setup - 初始化函数或文本
   * @returns {this}
   */
  footer(setup) {
    if (!this._footerEl) {
      this._footerEl = div(footer => {
        footer.addClass('yoya-sidebar__footer');
        footer.styles({
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--yoya-sidebar-footer-padding, 16px)',
          borderTop: 'var(--yoya-sidebar-footer-border, 1px solid var(--yoya-border, #e0e0e0))',
          background: 'var(--yoya-sidebar-footer-bg, var(--yoya-bg-secondary, #f7f8fa))',
          color: 'var(--yoya-sidebar-footer-color, var(--yoya-text-secondary, #666))',
        });
      });
      this.child(this._footerEl);
    } else {
      this._footerEl.clear();
    }

    if (typeof setup === 'function') {
      setup(this._footerEl);
    } else if (typeof setup === 'string') {
      this._footerEl.text(setup);
    }

    return this;
  }

  /**
   * 添加菜单项
   * @param {string|Function} [content=''] - 内容或 setup 函数
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuItem}
   */
  item(content = '', setup = null) {
    if (!this._contentEl) {
      this.content(c => {});
    }
    const el = vMenuItem(content, setup);
    this._contentEl.child(el);
    return el;
  }

  /**
   * 添加分割线
   * @returns {this}
   */
  divider() {
    if (!this._contentEl) {
      this.content(c => {});
    }
    const el = vMenuDivider();
    el.styles({
      marginLeft: 'var(--yoya-sidebar-divider-margin, 8px)',
      marginRight: 'var(--yoya-sidebar-divider-margin, 8px)',
    });
    this._contentEl.child(el);
    return this;
  }

  /**
   * 添加菜单组
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuGroup}
   */
  group(setup = null) {
    if (!this._contentEl) {
      this.content(c => {});
    }
    const el = vMenuGroup(setup);
    this._contentEl.child(el);
    return el;
  }

  /**
   * 切换折叠状态
   * @returns {this}
   */
  toggle() {
    const collapsed = this.hasState('collapsed');
    this.setState('collapsed', !collapsed);
    this._collapsed = !collapsed;
    return this;
  }

  /**
   * 折叠侧边栏
   * @returns {this}
   */
  collapse() {
    this.setState('collapsed', true);
    this._collapsed = true;
    return this;
  }

  /**
   * 展开侧边栏
   * @returns {this}
   */
  expand() {
    this.setState('collapsed', false);
    this._collapsed = false;
    return this;
  }

  /**
   * 检查是否已折叠
   * @returns {boolean}
   */
  isCollapsed() {
    return this.hasState('collapsed');
  }

  /**
   * 添加切换按钮到头部
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  showToggleBtn(setup = null) {
    if (!this._headerEl) {
      this.header(h => {});
    }

    this._toggleBtnEl = button(btn => {
      btn.styles({
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 'var(--yoya-sidebar-toggle-padding, 8px)',
        borderRadius: 'var(--yoya-sidebar-toggle-radius, 6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        color: 'var(--yoya-text-secondary, #666)',
        fontSize: '16px',
      });
      btn.text('◀');
      btn.on('mouseenter', () => {
        btn.styles({
          background: 'var(--yoya-hover-bg, rgba(30, 64, 175, 0.1))',
          color: 'var(--yoya-primary)',
        });
      });
      btn.on('mouseleave', () => {
        btn.styles({
          background: 'transparent',
          color: 'var(--yoya-text-secondary, #666)',
        });
      });
      btn.on('click', () => {
        this.toggle();
      });
    });

    // 监听折叠状态变化，更新按钮图标方向
    this.registerStateInterceptor((stateName, value) => {
      if (stateName === 'collapsed' && this._toggleBtnEl && this._toggleBtnEl._boundElement) {
        setTimeout(() => {
          this._toggleBtnEl.textContent(value ? '▶' : '◀');
          this._toggleBtnEl.styles({
            transform: value ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          });
        }, 50);
      }
      return { stateName, value };
    });

    this._headerEl.child(this._toggleBtnEl);
    return this;
  }

  /**
   * 使用深色模式样式
   * @returns {this}
   */
  dark() {
    this.styles({
      background: 'var(--yoya-sidebar-bg-dark, var(--yoya-bg-dark, #1a1a1a))',
      borderRight: 'var(--yoya-sidebar-border-dark, 1px solid var(--yoya-border-dark, #333))',
    });
    if (this._headerEl) {
      this._headerEl.styles({
        background: 'var(--yoya-sidebar-header-bg-dark, var(--yoya-bg-dark-secondary, #2a2a2a))',
        borderBottom: 'var(--yoya-sidebar-header-border-dark, 1px solid var(--yoya-border-dark, #333))',
      });
    }
    if (this._footerEl) {
      this._footerEl.styles({
        background: 'var(--yoya-sidebar-footer-bg-dark, var(--yoya-bg-dark-secondary, #2a2a2a))',
        borderTop: 'var(--yoya-sidebar-footer-border-dark, 1px solid var(--yoya-border-dark, #333))',
      });
    }
    return this;
  }

  /**
   * 销毁组件（清理引用）
   * @returns {this}
   */
  destroy() {
    this._headerEl = null;
    this._contentEl = null;
    this._footerEl = null;
    this._toggleBtnEl = null;
    super.destroy();
  }
}

/**
 * 创建 VSidebar 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VSidebar}
 */
function vSidebar(setup = null) {
  return new VSidebar(setup);
}

/**
 * Tag 原型扩展 - 添加 vSidebar 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vSidebar = function(setup = null) {
  const el = vSidebar(setup);
  this.child(el);
  return this;
};

// ============================================
// VTopNavbar 顶部导航栏组件
// ============================================

/**
 * VTopNavbar - 顶部导航栏组件
 * 用于页面顶部的导航栏，支持 Logo、菜单项、右侧操作区等
 * @example
 * vTopNavbar(nav => {
 *   nav.height('60px');
 *   nav.logo('🏝️ Yoya.Basic', () => location.href = '/');
 *   nav.item('首页', () => toast('首页'));
 *   nav.item('文档', () => toast('文档'));
 *   nav.right(r => {
 *     r.button('登录', () => toast('登录'));
 *   });
 * });
 */
class VTopNavbar extends Tag {
  static _stateAttrs = ['fixed', 'bordered', 'themeMode'];

  /**
   * 创建 VTopNavbar 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 内部元素引用
    this._containerEl = null;
    this._logoEl = null;
    this._menuEl = null;
    this._rightEl = null;

    // 配置
    this._height = 'var(--yoya-navbar-height, 60px)';

    // 1. 初始化状态
    this.initializeStates({
      fixed: false,
      bordered: true,
      themeMode: 'light',
    });

    // 2. 设置基础样式
    this._setupBaseStyles();

    // 3. 注册状态处理器
    this._registerStateHandlers();

    // 4. 执行 setup（先创建子元素）
    if (setup !== null) {
      this.setup(setup);
    }

    // 5. 监听主题变化事件（子元素创建后再应用主题）
    this._setupThemeListener();
  }

  /**
   * 设置基础样式
   * @private
   */
  _setupBaseStyles() {
    // 应用 CSS 类
    this.addClass('yoya-navbar');

    // 创建内部容器
    this._containerEl = div(container => {
      container.addClass('yoya-navbar__container');
    });
    this.child(this._containerEl);
  }

  _registerStateHandlers() {
    // fixed 状态处理器
    this.registerStateHandler('fixed', (fixed, host) => {
      if (fixed) {
        host.addClass('yoya-navbar--fixed');
      } else {
        host.removeClass('yoya-navbar--fixed');
      }
    });

    // bordered 状态处理器
    this.registerStateHandler('bordered', (bordered, host) => {
      if (bordered) {
        host.addClass('yoya-navbar--bordered');
        host.removeClass('yoya-navbar--no-border');
      } else {
        host.removeClass('yoya-navbar--bordered');
        host.addClass('yoya-navbar--no-border');
      }
    });

    // themeMode 状态处理器
    this.registerStateHandler('themeMode', (mode, host) => {
      // Islands 主题系统会自动更新 CSS 变量的值，所以只需要设置一次变量引用
      // 不需要区分 dark/light 模式的变量名
      // CSS 变量已在 .yoya-navbar 类中定义，主题变化时会自动更新

      // 更新 Logo 颜色（CSS 变量会自动处理）
      if (host._logoEl) {
        host._logoEl.style('color', 'var(--yoya-navbar-logo-color, var(--yoya-text, #333))');
      }
      // 更新菜单项颜色
      if (host._menuEl) {
        host._menuEl._children.forEach(item => {
          if (item._active) {
            item.styles({
              background: 'var(--yoya-navbar-item-active-bg, rgba(37,99,235,0.08))',
              color: 'var(--yoya-navbar-item-active-color, var(--yoya-primary))',
            });
          } else {
            item.styles({
              background: 'transparent',
              color: 'var(--yoya-navbar-item-color, var(--yoya-text-secondary, #666))',
            });
          }
        });
      }
      // 更新右侧区域按钮颜色
      if (host._rightEl) {
        host._rightEl._children.forEach(child => {
          if (child instanceof VButton) {
            // VButton 组件，通过 ghost 模式适应暗色主题
            if (!child.hasState('ghost')) {
              child.styles({
                background: 'var(--yoya-button-bg, white)',
                color: 'var(--yoya-button-text, #333)',
                borderColor: 'var(--yoya-button-border, #e0e0e0)',
              });
            }
          } else if (child._el && child._el._children) {
            // 普通 div 元素
            child.style('color', 'var(--yoya-navbar-item-color, var(--yoya-text-secondary, #666))');
          }
        });
      }
    });
  }

  /**
   * 设置主题变化监听器
   * @private
   */
  _setupThemeListener() {
    if (typeof window === 'undefined') return;

    // 监听主题变化事件
    window.addEventListener('theme-changed', (e) => {
      const mode = e.detail?.mode || 'light';
      this.setState('themeMode', mode);
    });

    // 初始化时获取当前主题模式
    // 从全局 window._yoyaMode 获取（由 setThemeMode 设置）
    const getInitialMode = () => {
      if (typeof window._yoyaMode === 'string') {
        if (window._yoyaMode === 'auto') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return window._yoyaMode;
      }
      // 默认值
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const initialMode = getInitialMode();
    this.setState('themeMode', initialMode);
  }

  /**
   * 设置导航栏高度
   * @param {string} h - 高度值
   * @returns {this}
   */
  height(h) {
    this._height = h;
    this.style('height', h);
    return this;
  }

  /**
   * 设置 Logo 区域
   * @param {string|Function} content - Logo 内容（文本或 setup 函数）
   * @param {Function} [onClick=null] - 点击回调
   * @returns {this}
   */
  logo(content, onClick = null) {
    if (!this._logoEl) {
      this._logoEl = div(logo => {
        logo.addClass('yoya-navbar__logo');
      });
    } else {
      this._logoEl.clear();
    }

    if (typeof content === 'function') {
      content(this._logoEl);
    } else {
      this._logoEl.text(content);
    }

    if (onClick) {
      this._logoEl.on('click', onClick);
    }

    // 将 Logo 添加到容器（如果尚未添加）
    if (this._containerEl && !this._logoEl._parent) {
      this._containerEl._children.unshift(this._logoEl);
      this._logoEl._parent = this._containerEl;
    }

    return this;
  }

  /**
   * 添加导航项
   * @param {string} content - 菜单项文本
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  item(content, setup = null) {
    if (!this._menuEl) {
      this._menuEl = div(menu => {
        menu.addClass('yoya-navbar__menu');
      });
    }

    const menuItem = div(item => {
      item.addClass('yoya-navbar__item');
      item.text(content);

      item.on('mouseenter', () => {
        item.addClass('yoya-navbar__item--hover');
      });

      item.on('mouseleave', () => {
        if (!item._active) {
          item.removeClass('yoya-navbar__item--hover');
        }
      });

      item.on('click', (e) => {
        e.stopPropagation();
        // 移除其他项的激活状态
        if (this._menuEl) {
          this._menuEl._children.forEach(child => {
            if (child !== item) {
              child._active = false;
              child.removeClass('yoya-navbar__item--active');
            }
          });
        }
        // 设置当前项为激活状态
        item._active = true;
        item.addClass('yoya-navbar__item--active');

        if (setup && typeof setup === 'function') {
          setup(item);
        }
      });
    });

    this._menuEl.child(menuItem);

    // 将菜单区域添加到容器（在 Logo 之后，_rightEl 之前）
    if (this._containerEl) {
      if (!this._menuEl._parent) {
        // 找到 _rightEl 的位置，在其之前插入
        const rightIndex = this._containerEl._children.indexOf(this._rightEl);
        if (rightIndex >= 0) {
          this._containerEl._children.splice(rightIndex, 0, this._menuEl);
        } else {
          this._containerEl._children.push(this._menuEl);
        }
        this._menuEl._parent = this._containerEl;
        this._containerEl.renderDom();
      }
    }
    return this;
  }

  /**
   * 设置右侧区域
   * @param {Function} setup - 初始化函数
   * @returns {this}
   */
  right(setup) {
    if (!this._rightEl) {
      this._rightEl = div(right => {
        right.addClass('yoya-navbar__right');
      });
    }

    // 提供便捷的 button 方法
    const rightWrapper = {
      button: (content, onClick = null) => {
        const btn = vButton(content);
        rightWrapper._el.child(btn);
        if (onClick) {
          btn.on('click', onClick);
        }
        return btn;
      },
      item: (content, setup = null) => this.item(content, setup),
      divider: () => {
        const dividerEl = div(d => {
          d.addClass('yoya-navbar__divider');
        });
        rightWrapper._el.child(dividerEl);
        return rightWrapper;
      },
      _el: this._rightEl,
    };

    if (typeof setup === 'function') {
      setup(rightWrapper);
    }

    // 将右侧区域添加到容器末尾
    if (this._containerEl) {
      // 确保 _rightEl 在_children 数组的最后
      const index = this._containerEl._children.indexOf(this._rightEl);
      if (index >= 0) {
        this._containerEl._children.splice(index, 1);
      }
      this._containerEl._children.push(this._rightEl);
      this._rightEl._parent = this._containerEl;
      this._containerEl.renderDom();
    }
    return this;
  }

  /**
   * 设置为深色模式（兼容旧 API）
   * @returns {this}
   */
  dark() {
    this.setState('themeMode', 'dark');
    return this;
  }
}

/**
 * 创建 VTopNavbar 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VTopNavbar}
 */
function vTopNavbar(setup = null) {
  return new VTopNavbar(setup);
}

/**
 * Tag 原型扩展 - 添加 vTopNavbar 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vTopNavbar = function(setup = null) {
  const el = vTopNavbar(setup);
  this.child(el);
  return this;
};

/**
 * Yoya.Basic - Message 消息提示组件
 * 用于显示全局消息提示（成功、错误、警告、信息）
 * @module Yoya.Message
 * @example
 * // 基础用法
 * import { toast } from '../yoya/index.js';
 *
 * toast.success('操作成功！');
 * toast.error('操作失败，请重试！');
 * toast.warning('请注意此操作的影响！');
 * toast.info('这是一个普通信息提示！');
 *
 * // 自定义时长
 * toast.info('消息内容', 5000);  // 5 秒后关闭
 *
 * // 使用消息容器
 * import { vMessageContainer } from '../yoya/index.js';
 *
 * const container = vMessageContainer('top-right');
 * container.success('成功！');
 * container.error('失败！');
 */


// ============================================
// VMessage 消息提示
// ============================================

/**
 * VMessage 消息提示组件
 * 支持 success、error、warning、info 四种类型
 * @class
 * @extends Tag
 */
class VMessage extends Tag {
  static _stateAttrs = ['type'];

  /**
   * 创建 VMessage 实例
   * @param {string} [content=''] - 消息内容
   * @param {string} [type='info'] - 消息类型：success、error、warning、info
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(content = '', type = 'info', setup = null) {
    super('div', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);

    this._content = content;
    this._type = type;
    this._closable = true;
    this._duration = 3000;
    this._timer = null;
    this._closed = false;

    this.addClass('yoya-message');
    this._applyTypeStyles();
    this._buildContent();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 应用类型样式
   * @private
   */
  _applyTypeStyles() {
    this.removeClass('yoya-message--success', 'yoya-message--error', 'yoya-message--warning', 'yoya-message--info');
    this.addClass(`yoya-message--${this._type}`);
  }

  /**
   * 获取类型图标
   * @returns {string} 图标字符
   * @private
   */
  _getTypeIcon() {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[this._type] || icons.info;
  }

  /**
   * 构建消息内容
   * @private
   */
  _buildContent() {
    this.child(span(icon => {
      icon.text(this._getTypeIcon());
      icon.addClass('yoya-message__icon');
    }));

    this.child(span(text => {
      text.text(this._content);
      text.addClass('yoya-message__text');
    }));

    if (this._closable) {
      this.child(span(closeBtn => {
        closeBtn.text('×');
        closeBtn.addClass('yoya-message__close');
        closeBtn.on('click', (e) => {
          e.stopPropagation();
          this.close();
        });
      }));
    }
  }

  /**
   * 设置消息内容
   * @param {string} text - 消息内容
   * @returns {this}
   */
  content(text) {
    this._content = text;
    return this;
  }

  /**
   * 设置是否可关闭
   * @param {boolean} value - 是否可关闭
   * @returns {this}
   */
  closable(value) {
    this._closable = value;
    return this;
  }

  /**
   * 设置自动关闭时长
   * @param {number} ms - 时长（毫秒）
   * @returns {this}
   */
  duration(ms) {
    this._duration = ms;
    return this;
  }

  /**
   * 关闭消息
   * @returns {this}
   */
  close() {
    if (this._closed) return;

    this._closed = true;

    if (this._boundElement) {
      this._boundElement.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => {
        this.destroy();
      }, 300);
    } else {
      this.destroy();
    }

    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  /**
   * 启动自动关闭计时器
   * @private
   */
  startTimer() {
    if (this._duration > 0 && !this._timer) {
      this._timer = setTimeout(() => {
        this.close();
      }, this._duration);
    }
  }

  /**
   * 停止自动关闭计时器
   * @private
   */
  stopTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  /**
   * 渲染 DOM 元素
   * @returns {HTMLElement|null}
   */
  renderDom() {
    const element = super.renderDom();
    if (element && this._duration > 0) {
      this.startTimer();
    }
    return element;
  }
}

/**
 * 创建 VMessage 实例
 * @param {string} [content=''] - 消息内容
 * @param {string} [type='info'] - 消息类型
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMessage}
 */
function vMessage(content = '', type = 'info', setup = null) {
  return new VMessage(content, type, setup);
}

// ============================================
// VMessageContainer 消息容器
// ============================================

/**
 * VMessageContainer 消息容器
 * 用于管理多个消息提示，支持多种位置
 * @class
 * @extends Tag
 */
class VMessageContainer extends Tag {
  /**
   * 创建 VMessageContainer 实例
   * @param {string} [position='top-right'] - 位置
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(position = 'top-right', setup = null) {
    super('div', null);

    this._position = position;
    this._messages = [];
    this._maxVisible = 5;

    this.addClass('yoya-message-container');
    this._applyPosition();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 应用位置样式
   * @private
   */
  _applyPosition() {
    this.removeClass(
      'yoya-message-container--top-left',
      'yoya-message-container--top-right',
      'yoya-message-container--top-center',
      'yoya-message-container--bottom-left',
      'yoya-message-container--bottom-right',
      'yoya-message-container--bottom-center'
    );
    this.addClass(`yoya-message-container--${this._position}`);
  }

  /**
   * 添加消息
   * @param {string} content - 消息内容
   * @param {string} [type='info'] - 消息类型
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  add(content, type = 'info', duration = 3000) {
    const msg = vMessage(content, type);
    msg.closable(true);
    msg.duration(duration);

    this._messages.push(msg);
    this.child(msg);

    if (this._boundElement) {
      const msgEl = msg.renderDom();
      if (msgEl) {
        this._boundElement.appendChild(msgEl);
      }
    }

    if (this._messages.length > this._maxVisible) {
      const oldMsg = this._messages.shift();
      if (oldMsg && !oldMsg._closed) {
        oldMsg.close();
      }
    }

    return msg;
  }

  /**
   * 添加成功消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  success(content, duration = 3000) {
    return this.add(content, 'success', duration);
  }

  /**
   * 添加错误消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  error(content, duration = 3000) {
    return this.add(content, 'error', duration);
  }

  /**
   * 添加警告消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  warning(content, duration = 3000) {
    return this.add(content, 'warning', duration);
  }

  /**
   * 添加信息消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  info(content, duration = 3000) {
    return this.add(content, 'info', duration);
  }

  /**
   * 清空所有消息
   */
  clear() {
    this._messages.forEach(msg => msg.close());
    this._messages = [];
    this._children = [];
  }

  /**
   * 设置最大可见消息数量
   * @param {number} count - 数量
   * @returns {this}
   */
  maxVisible(count) {
    this._maxVisible = count;
    return this;
  }
}

/**
 * 创建 VMessageContainer 实例
 * @param {string} [position='top-right'] - 位置
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMessageContainer}
 */
function vMessageContainer(position = 'top-right', setup = null) {
  return new VMessageContainer(position, setup);
}

// ============================================
// VMessageManager 消息管理器（单例）
// ============================================

/**
 * VMessageManager 消息管理器（单例模式）
 * 用于管理全局消息提示
 * @class
 */
class VMessageManager {
  /**
   * 创建 VMessageManager 实例（单例）
   */
  constructor() {
    if (VMessageManager._instance) {
      return VMessageManager._instance;
    }
    this._container = null;
    this._position = 'top-right';
    this._maxVisible = 5;
    VMessageManager._instance = this;
  }

  /**
   * 获取消息容器（惰性创建）
   * @returns {VMessageContainer}
   * @private
   */
  _getContainer() {
    if (!this._container) {
      this._container = vMessageContainer(this._position);
      this._container.maxVisible(this._maxVisible);
      document.body.appendChild(this._container.renderDom());
    }
    return this._container;
  }

  /**
   * 根据位置重新创建容器（如需要）
   * @param {string} position - 位置
   * @returns {VMessageContainer}
   * @private
   */
  _recreateContainerIfNeeded(position) {
    if (position && position !== this._position) {
      this._position = position;
      if (this._container) {
        this._container.destroy();
        this._container = null;
      }
    }
    if (!this._container) {
      this._container = vMessageContainer(this._position);
      this._container.maxVisible(this._maxVisible);
      document.body.appendChild(this._container.renderDom());
    }
    return this._container;
  }

  /**
   * 统一入口 - 支持多种调用方式
   *
   * 1. toast.success('消息') / toast.error('消息') / toast.warning('消息') / toast.info('消息')
   * 2. toast('消息', { type: 'success', duration: 3000, position: 'top-center' })
   * 3. toast('消息', 'success', 3000)  // 兼容旧 API
   */
  call = (content, typeOrOptions = 'info', duration = 3000) => {
    // 处理参数
    let type = typeOrOptions;
    let position = this._position;

    if (typeof typeOrOptions === 'object') {
      type = typeOrOptions.type || 'info';
      duration = typeOrOptions.duration ?? 3000;
      position = typeOrOptions.position || this._position;
    }

    const container = this._recreateContainerIfNeeded(position);
    return container.add(content, type, duration);
  };

  /**
   * 成功消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  success = (content, duration = 3000) => this._getContainer().success(content, duration);

  /**
   * 错误消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  error = (content, duration = 3000) => this._getContainer().error(content, duration);

  /**
   * 警告消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  warning = (content, duration = 3000) => this._getContainer().warning(content, duration);

  /**
   * 信息消息
   * @param {string} content - 消息内容
   * @param {number} [duration=3000] - 自动关闭时长（毫秒）
   * @returns {VMessage}
   */
  info = (content, duration = 3000) => this._getContainer().info(content, duration);

  /**
   * 清空所有消息
   */
  clear = () => {
    if (this._container) {
      this._container.clear();
    }
  };

  /**
   * 设置消息位置
   * @param {string} position - 位置
   */
  setPosition = (position) => {
    this._position = position;
    if (this._container) {
      this._container.destroy();
      this._container = null;
    }
  };

  /**
   * 设置最大可见消息数量
   * @param {number} count - 数量
   * @returns {this}
   */
  setMaxVisible = (count) => {
    this._maxVisible = count;
    return this;
  };
}

const vMessageManager = new VMessageManager();

/**
 * 全局消息提示函数（toast）
 * 支持多种调用方式：
 * 1. toast.success('消息') / toast.error('消息') / toast.warning('消息') / toast.info('消息')
 * 2. toast('消息', { type: 'success', duration: 3000, position: 'top-center' })
 * 3. toast('消息', 'success', 3000)  // 兼容旧 API
 * @param {string} content - 消息内容
 * @param {string|Object} [typeOrOptions='info'] - 消息类型或配置对象
 * @param {number} [duration=3000] - 自动关闭时长（毫秒）
 * @returns {VMessage}
 */
function toast(content, typeOrOptions = 'info', duration = 3000) {
  return vMessageManager.call(content, typeOrOptions, duration);
}

// 挂载快捷方法
toast.success = vMessageManager.success;
toast.error = vMessageManager.error;
toast.warning = vMessageManager.warning;
toast.info = vMessageManager.info;
toast.clear = vMessageManager.clear;
toast.setPosition = vMessageManager.setPosition;

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 vMessage 子元素
 * @param {string} [content=''] - 消息内容
 * @param {string} [type='info'] - 消息类型
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMessage = function(content, type = 'info', setup = null) {
  const el = vMessage(content, type, setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vMessageContainer 子元素
 * @param {string} [position='top-right'] - 位置
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMessageContainer = function(position = 'top-right', setup = null) {
  const el = vMessageContainer(position, setup);
  this.child(el);
  return this;
};

// 兼容旧方法名
Tag.prototype.message = Tag.prototype.vMessage;
Tag.prototype.messageContainer = Tag.prototype.vMessageContainer;

// ============================================
// 添加动画样式
// ============================================

if (typeof document !== 'undefined') {
  const styleId = 'yoya-message-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Yoya.Components - Code
 * 代码展示组件，支持语法高亮和一键复制功能
 * @module Yoya.Code
 * @example
 * // 基础用法
 * import { vCode, toast } from '../yoya/index.js';
 *
 * vCode(c => {
 *   c.content(`const hello = (name) => {
 *   console.log('Hello, ' + name);
 * };`);
 *   c.title('JavaScript 示例');
 *   c.onCopy(() => toast.success('代码已复制'));
 * });
 *
 * // 快速创建代码块
 * import { codeBlock } from '../yoya/index.js';
 * codeBlock('示例代码', 'const x = 1;');
 */


// ============================================
// VCode 代码展示组件
// ============================================

/**
 * VCode 代码展示组件
 * 支持语法高亮、行号显示、一键复制功能
 * @class
 * @extends Tag
 */
class VCode extends Tag {
  static _stateAttrs = ['copied'];

  /**
   * 创建 VCode 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    this._codeContent = '';
    this._language = 'javascript';
    this._showLineNumbers = true;
    this._showCopyButton = true;
    this._title = '';
    this._onCopy = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      copied: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素
    this._createInternalElements();
  }

  /**
   * 设置基础样式
   * @private
   */
  _setupBaseStyles() {
    this.styles({
      display: 'block',
      borderRadius: 'var(--yoya-code-radius, 8px)',
      overflow: 'hidden',
      background: 'var(--yoya-code-bg, #1e1e1e)',
      border: 'var(--yoya-code-border, 1px solid rgba(255,255,255,0.1))',
    });
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    this.registerStateHandler('copied', (copied, host) => {
      if (host._copyButton) {
        if (copied) {
          host._copyButton.textContent('✓ 已复制');
          host._copyButton.styles({
            background: 'var(--yoya-code-copy-success-bg, #28a745)',
            color: 'var(--yoya-code-copy-success-color, white)',
          });
          // 2 秒后恢复
          setTimeout(() => {
            host.setState('copied', false);
          }, 2000);
        } else {
          host._copyButton.textContent('📋 复制');
          host._copyButton.styles({
            background: 'var(--yoya-code-copy-bg, #444)',
            color: 'var(--yoya-code-copy-color, #ccc)',
          });
        }
      }
    });
  }

  _createInternalElements() {
    // 标题栏
    if (this._title || this._showCopyButton) {
      this._headerBar = div(h => {
        h.styles({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--yoya-code-header-padding, 10px 16px)',
          background: 'var(--yoya-code-header-bg, rgba(255,255,255,0.05))',
          borderBottom: 'var(--yoya-code-header-border, 1px solid rgba(255,255,255,0.1))',
        });

        // 标题
        if (this._title) {
          h.child(span(t => {
            t.styles({
              color: 'var(--yoya-code-title-color, #007acc)',
              fontSize: 'var(--yoya-code-title-font-size, 13px)',
              fontWeight: 'var(--yoya-code-title-font-weight, 600)',
            });
            t.text(this._title);
          }));
        } else {
          h.child(span(s => s.styles({ flex: 1 })));
        }

        // 复制按钮
        if (this._showCopyButton) {
          h.child(this._copyButton = span(b => {
            b.styles({
              padding: 'var(--yoya-code-copy-padding, 4px 10px)',
              borderRadius: 'var(--yoya-code-copy-radius, 4px)',
              fontSize: 'var(--yoya-code-copy-font-size, 12px)',
              cursor: 'pointer',
              background: 'var(--yoya-code-copy-bg, #444)',
              color: 'var(--yoya-code-copy-color, #ccc)',
              transition: 'all 0.2s',
              userSelect: 'none',
            });
            b.text('📋 复制');
            b.on('click', () => this._handleCopy());
            b.on('mouseenter', () => {
              if (!this.hasState('copied')) {
                b.styles({
                  background: 'var(--yoya-code-copy-hover-bg, #555)',
                  color: 'var(--yoya-code-copy-hover-color, white)',
                });
              }
            });
            b.on('mouseleave', () => {
              if (!this.hasState('copied')) {
                b.styles({
                  background: 'var(--yoya-code-copy-bg, #444)',
                  color: 'var(--yoya-code-copy-color, #ccc)',
                });
              }
            });
          }));
        }
      });

      this.child(this._headerBar);
    }

    // 代码容器
    this._codeContainer = pre(c => {
      c.styles({
        margin: 0,
        padding: 'var(--yoya-code-padding, 16px)',
        overflow: 'auto',
        fontSize: 'var(--yoya-code-font-size, 13px)',
        lineHeight: 'var(--yoya-code-line-height, 1.6)',
        color: 'var(--yoya-code-text-color, #d4d4d4)',
        fontFamily: 'var(--yoya-code-font-family, "Fira Code", "Consolas", "Monaco", monospace)',
      });

      c.child(this._codeElement = code(inner => {
        inner.styles({
          color: 'var(--yoya-code-text-color, #d4d4d4)',
          fontFamily: 'inherit',
          background: 'transparent',
          border: 'none',
          padding: 0,
        });
        if (this._showLineNumbers) {
          inner.styles({ counterReset: 'line' });
        }
      }));
    });

    this.child(this._codeContainer);

    // 直接设置代码内容的 innerHTML
    this._updateCodeContent();
  }

  /**
   * 更新代码内容
   * @private
   */
  _updateCodeContent() {
    if (this._codeElement && this._codeContent) {
      const highlighted = this._highlightCode(this._codeContent);
      this._codeElement._htmlContent = highlighted;
      // 如果已经渲染，更新 DOM
      if (this._codeElement._el) {
        this._codeElement._el.innerHTML = highlighted;
      }
    }
  }

  /**
   * 语法高亮处理
   * @param {string} content - 代码内容
   * @returns {string} 高亮后的 HTML
   * @private
   */
  _highlightCode(content) {
    // 1. 先提取字符串，使用占位符保护
    const strings = [];
    let idx = 0;
    let code = content.replace(/(['"`])(?:[^\\]|\\.)*?\1/g, (match) => {
      strings.push(match);
      return `___STR${idx++}___`;
    });

    // 2. 先不转义，直接进行语法高亮
    // 使用特殊标记包裹关键字，避免后续转义影响
    const markers = [];
    let markerIdx = 0;

    // 2a. 注释高亮
    code = code.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (match) => {
      markers.push({ type: 'comment', content: match });
      return `___MRK${markerIdx++}___`;
    });

    // 2b. 关键字高亮
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
                      'do', 'switch', 'case', 'break', 'continue', 'new', 'class', 'extends',
                      'import', 'export', 'from', 'default', 'try', 'catch', 'finally', 'throw',
                      'async', 'await', 'yield', 'typeof', 'instanceof', 'in', 'of',
                      'true', 'false', 'null', 'undefined', 'this', 'super'];

    keywords.forEach(kw => {
      code = code.replace(new RegExp(`\\b${kw}\\b`, 'g'), (match) => {
        markers.push({ type: 'keyword', content: kw });
        return `___MRK${markerIdx++}___`;
      });
    });

    // 2c. 函数名高亮 - 排除已经是占位符的内容
    code = code.replace(/(\w+)(?=\s*\()/g, (match) => {
      // 跳过占位符
      if (match.startsWith('___MRK') || match.startsWith('___STR')) {
        return match;
      }
      markers.push({ type: 'function', content: match });
      return `___MRK${markerIdx++}___`;
    });

    // 3. HTML 转义
    code = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 4. 恢复标记为 HTML 标签
    markers.forEach((marker, i) => {
      const escapedContent = marker.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      code = code.replace(`___MRK${i}___`, `<span class="token-${marker.type}">${escapedContent}</span>`);
    });

    // 5. 恢复字符串
    strings.forEach((str, i) => {
      const escapedStr = str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      code = code.replace(`___STR${i}___`, `<span class="token-string">${escapedStr}</span>`);
    });

    return code;
  }

  /**
   * 处理复制操作
   * @private
   */
  _handleCopy() {
    // 复制代码到剪贴板
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this._codeContent).then(() => {
        this.setState('copied', true);
        if (this._onCopy) {
          this._onCopy({ event: new ClipboardEvent('copy'), value: this._codeContent, target: this });
        }
      }).catch(() => {
        this._fallbackCopy();
      });
    } else {
      this._fallbackCopy();
    }
  }

  /**
   * 备用复制方法（当 navigator.clipboard 不可用时）
   * @private
   */
  _fallbackCopy() {
    // 备用复制方法
    const textarea = document.createElement('textarea');
    textarea.value = this._codeContent;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      this.setState('copied', true);
      if (this._onCopy) {
        this._onCopy({ event: new ClipboardEvent('copy'), value: this._codeContent, target: this });
      }
    } catch (err) {
      console.error('复制失败:', err);
    }
    document.body.removeChild(textarea);
  }

  // ============================================
  // 链式方法
  // ============================================

  content(c) {
    if (c === undefined) return this._codeContent;
    this._codeContent = c;
    this._updateCodeContent();
    return this;
  }

  language(lang) {
    if (lang === undefined) return this._language;
    this._language = lang;
    return this;
  }

  showLineNumbers(show) {
    if (show === undefined) return this._showLineNumbers;
    this._showLineNumbers = show;
    return this;
  }

  showCopyButton(show) {
    if (show === undefined) return this._showCopyButton;
    this._showCopyButton = show;
    return this;
  }

  title(t) {
    if (t === undefined) return this._title;
    this._title = t;
    return this;
  }

  onCopy(handler) {
    this._onCopy = handler;
    return this;
  }
}

function vCode(setup = null) {
  return new VCode(setup);
}

// ============================================
// CodeBlock 简化代码块（快速创建带标题的代码块）
// ============================================

class CodeBlock extends Tag {
  constructor(title = '', content = '', setup = null) {
    if (typeof title === 'function') {
      setup = title;
      title = '';
    } else if (typeof content === 'function') {
      setup = content;
      content = '';
    }

    super('div', null);

    this._title = title;
    this._content = content;

    // 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 创建内容
    this._createInternalElements();
  }

  _createInternalElements() {
    this.child(vCode(c => {
      c.title(this._title);
      c.content(this._content);
    }));
  }
}

function codeBlock(title = '', content = '', setup = null) {
  return new CodeBlock(title, content, setup);
}

// 添加到 Tag 原型
Tag.prototype.vCode = function(setup = null) {
  const code = vCode(setup);
  this.child(code);
  return this;
};

Tag.prototype.codeBlock = function(title = '', content = '', setup = null) {
  const block = codeBlock(title, content, setup);
  this.child(block);
  return this;
};

/**
 * Yoya.Components - Form Elements
 * 带主题样式的表单输入组件
 */


// ============================================
// VInput 输入框组件
// ============================================

class VInput extends Tag {
  static _stateAttrs = ['disabled', 'readonly', 'error', 'loading'];

  constructor(setup = null) {
    super('div', null);
    // this._el 已在 super() 中创建

    // 内部 input 元素引用
    this._inputEl = null;
    this._loadingSpinner = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      readonly: false,
      error: false,
      loading: false,
    });

    // 3. 设置基础样式（直接设置到 this._el）
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 创建内部元素（在 setup 之前，确保 setup 时可以绑定事件）
    this._createInternalElements();

    // 7. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupString(setup){
    this.placeholder(setup);
  }
  _setupBaseStyles() {
    this.addClass('yoya-input');
  }

  _createInternalElements() {
    // 只在首次创建内部 input 元素
    if (this._inputEl) return;

    this._inputEl = input(i => {
      i.addClass('yoya-input__inner');
    });

    // 同步属性到内部 input
    if (this._placeholder) {
      this._inputEl.attr('placeholder', this._placeholder);
    }
    if (this._value !== undefined) {
      this._inputEl.attr('value', this._value);
    }
    if (this._inputType) {
      this._inputEl.attr('type', this._inputType);
    }
    if (this._inputName) {
      this._inputEl.attr('name', this._inputName);
    }

    this.child(this._inputEl);

    // 处理 loading 状态
    if (this.hasState('loading')) {
      this._showLoadingSpinner();
    }

    // 点击外层容器时聚焦到 input
    this.on('click', () => {
      if (this._inputEl && this._inputEl._el) {
        this._inputEl._el.focus();
      }
    });
  }

  _showLoadingSpinner() {
    if (!this._loadingSpinner) {
      this._loadingSpinner = span(s => {
        s.addClass('yoya-input__loading');
      });
      this.child(this._loadingSpinner);
    }
    this._loadingSpinner.style('display', 'inline-block');
  }

  _hideLoadingSpinner() {
    if (this._loadingSpinner) {
      this._loadingSpinner.style('display', 'none');
    }
  }

  _registerStateHandlers() {
    // disabled 状态
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-input--disabled');
        if (host._inputEl) {
          host._inputEl.attr('disabled', 'disabled');
        }
      } else {
        host.removeClass('yoya-input--disabled');
        if (host._inputEl) {
          host._inputEl.attr('disabled', null);
        }
      }
    });

    // readonly 状态
    this.registerStateHandler('readonly', (readonly, host) => {
      if (host._inputEl) {
        host._inputEl.attr('readonly', readonly ? 'readonly' : null);
      }
    });

    // error 状态
    this.registerStateHandler('error', (hasError, host) => {
      if (hasError) {
        host.addClass('yoya-input--error');
      } else {
        host.removeClass('yoya-input--error');
      }
    });

    // loading 状态
    this.registerStateHandler('loading', (loading, host) => {
      if (loading) {
        host._showLoadingSpinner();
      } else {
        host._hideLoadingSpinner();
      }
    });
  }

  // ============================================
  // 链式方法
  // ============================================

  placeholder(value) {
    if (value === undefined) return this._placeholder;
    this._placeholder = value;
    if (this._inputEl) {
      this._inputEl.attr('placeholder', value);
    }
    return this;
  }

  value(val) {
    if (val === undefined) {
      if (this._inputEl && this._inputEl._boundElement) {
        return this._inputEl._boundElement.value;
      }
      return this._inputEl ? this._inputEl.attr('value') : this._value;
    }
    this._value = val;
    if (this._inputEl) {
      this._inputEl.attr('value', val);
    }
    return this;
  }

  type(t) {
    if (t === undefined) return this._inputType;
    this._inputType = t;
    if (this._inputEl) {
      this._inputEl.attr('type', t);
    }
    return this;
  }

  name(n) {
    if (n === undefined) return this._inputName;
    this._inputName = n;
    if (this._inputEl) {
      this._inputEl.attr('name', n);
    }
    return this;
  }

  size(s) {
    if (s === undefined) return this._size;
    this._size = s;
    this.removeClass('yoya-input--large', 'yoya-input--small');
    if (s === 'large') {
      this.addClass('yoya-input--large');
    } else if (s === 'small') {
      this.addClass('yoya-input--small');
    }
    return this;
  }

  onChange(handler) {
    if (this._inputEl) {
      const oldValue = this._value;
      this._inputEl.on('change', (e) => {
        const newValue = this._inputEl._el?.value || this._value;
        handler({ event: e, value: newValue, oldValue, target: this });
      });
    }
    return this;
  }

  onInput(handler) {
    if (this._inputEl) {
      this._inputEl.on('input', (e) => {
        // 同步值到内部 _value
        const value = e.target?.value || this._value;
        this._value = value;
        handler({ event: e, value, target: this });
      });
      // 如果已经渲染过，立即绑定事件到 DOM
      if (this._inputEl._rendered) {
        this._inputEl._applyEventsToEl();
      }
    }
    return this;
  }

  focus() {
    if (this._inputEl) {
      this._inputEl.focus();
    }
    return this;
  }

  blur() {
    if (this._inputEl) {
      this._inputEl.blur();
    }
    return this;
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  readonly(value = true) {
    return this.setState('readonly', value);
  }

  error(value = true) {
    return this.setState('error', value);
  }

  loading(value = true) {
    return this.setState('loading', value);
  }
}

function vInput(setup = null) {
  return new VInput(setup);
}

// ============================================
// VSelect 选择框组件
// ============================================

class VSelect extends Tag {
  static _stateAttrs = ['disabled', 'error'];

  constructor(setup = null) {
    super('div', null);
    // this._el 已在 super() 中创建

    this._selectEl = null;
    this._options = [];
    this._value = undefined;
    this._placeholder = undefined;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      error: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 创建内部元素（在 setup 之前，确保 setup 时可以绑定事件）
    this._createInternalElements();

    // 7. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 重写 setup 方法，字符串作为 placeholder 处理
  setup(setup) {
    if (typeof setup === 'function') {
      // 使用 Proxy 拦截属性赋值
      const handler = {
        set: (target, prop, value) => {
          if (prop === 'options') {
            target.options(value);
          } else if (prop === 'value') {
            target.value(value);
          } else if (prop === 'placeholder') {
            target.placeholder(value);
          } else if (prop.startsWith('on') && typeof value === 'function') {
            const eventName = prop.slice(2).toLowerCase();
            if (eventName === 'change') {
              target.onChange(value);
            }
          } else {
            target[prop] = value;
          }
          return true;
        }
      };
      const proxy = new Proxy(this, handler);
      setup(proxy);
    } else if (typeof setup === 'string') {
      // 字符串作为 placeholder
      this._placeholder = setup;
    } else if (typeof setup === 'object' && setup !== null) {
      this._setupObject(setup);
    }
    return this;
  }

  // 重写 _setupObject 处理 options 等属性
  _setupObject(config) {
    // 处理 options
    if (config.options) {
      this.options(config.options);
    }
    // 处理 value
    if (config.value !== undefined) {
      this.value(config.value);
    }
    // 处理 placeholder
    if (config.placeholder) {
      this.placeholder(config.placeholder);
    }
    // 处理事件
    for (const [key, value] of Object.entries(config)) {
      if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        if (eventName === 'change') {
          this.onChange(value);
        }
      }
    }
    // 调用父类的 _setupObject 处理 class/className/style 等
    if (config.class || config.className || config.style) {
      const parentSetup = {};
      if (config.class) parentSetup.class = config.class;
      if (config.className) parentSetup.className = config.className;
      if (config.style) parentSetup.style = config.style;
      Tag.prototype._setupObject.call(this, parentSetup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-select');
  }

  _createInternalElements() {
    // 首次创建 select 元素
    if (!this._selectEl) {
      this._selectEl = select(s => {
        s.addClass('yoya-select__inner');
      });

      this.child(this._selectEl);

      // 绑定 change 事件同步值
      this._selectEl.on('change', (e) => {
        if (e._el) {
          this._value = e._el.value;
        }
      });
    }

    // 更新选项
    this._updateOptions();
  }

  _updateOptions() {
    if (!this._selectEl) return;
    this._updateOptionsWithPlaceholder();
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-select--disabled');
        if (host._selectEl) {
          host._selectEl.attr('disabled', 'disabled');
        }
      } else {
        host.removeClass('yoya-select--disabled');
        if (host._selectEl) {
          host._selectEl.attr('disabled', null);
        }
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      if (hasError) {
        host.addClass('yoya-select--error');
      } else {
        host.removeClass('yoya-select--error');
      }
    });
  }

  _updateOptionsWithPlaceholder() {
    if (!this._selectEl) return;

    // 清空选项
    this._selectEl.clear();

    // 添加 placeholder 选项（如果设置了）
    if (this._placeholder) {
      const placeholderOpt = option(o => {
        o.text(this._placeholder);
        o.attr('value', '');
        o.attr('disabled', 'disabled');
        o.attr('selected', 'selected');
      });
      this._selectEl.child(placeholderOpt);
    }

    // 添加其他选项
    this._options.forEach(opt => {
      const optEl = option(o => {
        o.attr('value', opt.value);
        o.text(opt.label);
        if (opt.value === this._value) {
          o.attr('selected', 'selected');
        }
      });
      this._selectEl.child(optEl);
    });

    // 同步值到 select 元素
    if (this._value !== undefined) {
      this._selectEl.attr('value', this._value);
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  options(arr) {
    if (arr === undefined) return this._options;
    this._options = arr;
    if (this._selectEl) {
      this._updateOptionsWithPlaceholder();
    }
    return this;
  }

  value(val) {
    if (val === undefined) return this._selectEl ? this._selectEl.attr('value') : this._value;
    this._value = val;
    if (this._selectEl) {
      this._selectEl.attr('value', val);
    }
    return this;
  }

  name(n) {
    if (n === undefined) return this._name;
    this._name = n;
    if (this._selectEl) {
      this._selectEl.attr('name', n);
    }
    return this;
  }

  placeholder(val) {
    if (val === undefined) return this._placeholder;
    this._placeholder = val;
    if (this._selectEl) {
      this._updateOptionsWithPlaceholder();
    }
    return this;
  }

  size(s) {
    if (s === undefined) return this._size;
    this._size = s;
    this.removeClass('yoya-select--large', 'yoya-select--small');
    if (s === 'large') {
      this.addClass('yoya-select--large');
    } else if (s === 'small') {
      this.addClass('yoya-select--small');
    }
    return this;
  }

  onChange(handler) {
    if (this._selectEl) {
      const oldValue = this._value;
      this._selectEl.on('change', (e) => {
        const newValue = this._selectEl._el?.value || this._value;
        handler({ event: e, value: newValue, oldValue, target: this });
      });
    }
    return this;
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  error(value = true) {
    return this.setState('error', value);
  }
}

function vSelect(setup = null) {
  return new VSelect(setup);
}

// ============================================
// VTextarea 多行文本框组件
// ============================================

class VTextarea extends Tag {
  static _stateAttrs = ['disabled', 'readonly', 'error'];

  constructor(setup = null) {
    super('div', null);

    // 内部 textarea 元素引用
    this._textareaEl = null;
    this._rows = 4;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      readonly: false,
      error: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 创建内部元素（在 setup 之前，确保 setup 时可以绑定事件）
    this._updateContent();

    // 7. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 重写 setup 方法，字符串作为 placeholder 处理
  setup(setup) {
    if (typeof setup === 'function') {
      setup(this);
    } else if (typeof setup === 'string') {
      // 字符串作为 placeholder
      this._placeholder = setup;
    } else if (typeof setup === 'object' && setup !== null) {
      this._setupObject(setup);
    }
    return this;
  }

  _setupBaseStyles() {
    this.addClass('yoya-textarea');
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-textarea--disabled');
        if (host._textareaEl) {
          host._textareaEl.attr('disabled', 'disabled');
        }
      } else {
        host.removeClass('yoya-textarea--disabled');
        if (host._textareaEl) {
          host._textareaEl.attr('disabled', null);
        }
      }
    });

    this.registerStateHandler('readonly', (readonly, host) => {
      if (host._textareaEl) {
        host._textareaEl.attr('readonly', readonly ? 'readonly' : null);
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      if (hasError) {
        host.addClass('yoya-textarea--error');
      } else {
        host.removeClass('yoya-textarea--error');
      }
    });
  }

  _updateContent() {
    // 只在首次创建内部 textarea 元素
    if (this._textareaEl) return;

    this._textareaEl = textarea(t => {
      t.addClass('yoya-textarea__inner');
      t.attr('rows', this._rows);

      // 设置初始值（textarea 使用 text 内容）
      if (this._value !== undefined) {
        t.text(this._value);
      }
    });

    if (this._placeholder) {
      this._textareaEl.attr('placeholder', this._placeholder);
    }

    this.child(this._textareaEl);

    // 点击外层容器时聚焦到 textarea
    this.on('click', () => {
      if (this._textareaEl && this._textareaEl._el) {
        this._textareaEl._el.focus();
      }
    });
  }

  // ============================================
  // 链式方法
  // ============================================

  placeholder(val) {
    if (val === undefined) return this._placeholder;
    this._placeholder = val;
    if (this._textareaEl) {
      this._textareaEl.attr('placeholder', val);
    }
    return this;
  }

  value(val) {
    if (val === undefined) {
      if (this._textareaEl && this._textareaEl._boundElement) {
        return this._textareaEl._boundElement.value;
      }
      return this._value;
    }
    this._value = val;
    if (this._textareaEl) {
      this._textareaEl.text(val);
      if (this._textareaEl._boundElement) {
        this._textareaEl._boundElement.value = val;
      }
    }
    return this;
  }

  rows(r) {
    if (r === undefined) return this._rows;
    this._rows = r;
    if (this._textareaEl) {
      this._textareaEl.attr('rows', r);
    }
    return this;
  }

  name(n) {
    if (n === undefined) return this._name;
    this._name = n;
    if (this._textareaEl) {
      this._textareaEl.attr('name', n);
    }
    return this;
  }

  onChange(handler) {
    if (this._textareaEl) {
      const oldValue = this._value;
      this._textareaEl.on('change', (e) => {
        const newValue = this._textareaEl._el?.value || this._value;
        handler({ event: e, value: newValue, oldValue, target: this });
      });
    }
    return this;
  }

  onInput(handler) {
    if (this._textareaEl) {
      this._textareaEl.on('input', (e) => {
        const value = e.target?.value || this._value;
        this._value = value;
        handler({ event: e, value, target: this });
      });
      // 如果已经渲染过，立即绑定事件到 DOM
      if (this._textareaEl._rendered) {
        this._textareaEl._applyEventsToEl();
      }
    }
    return this;
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  readonly(value = true) {
    return this.setState('readonly', value);
  }

  error(value = true) {
    return this.setState('error', value);
  }
}

function vTextarea(setup = null) {
  return new VTextarea(setup);
}

// ============================================
// VCheckbox 复选框组件
// ============================================

class VCheckbox extends Tag {
  static _stateAttrs = ['disabled', 'checked', 'error'];

  constructor(labelText = '', setup = null) {
    if (typeof labelText === 'function') {
      setup = labelText;
      labelText = '';
    }

    super('label', null);

    // 内部 checkbox 元素引用
    this._checkboxEl = null;
    this._labelText = labelText;
    this._onChange = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      checked: false,
      error: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素
    this._updateContent();
  }

  _setupBaseStyles() {
    this.addClass('yoya-checkbox');
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-checkbox--disabled');
        if (host._checkboxEl) {
          host._checkboxEl.attr('disabled', 'disabled');
        }
      } else {
        host.removeClass('yoya-checkbox--disabled');
        if (host._checkboxEl) {
          host._checkboxEl.attr('disabled', null);
        }
      }
    });

    this.registerStateHandler('checked', (checked, host) => {
      if (host._checkboxEl) {
        if (checked) {
          host._checkboxEl.attr('checked', 'checked');
        } else {
          host._checkboxEl.attr('checked', null);
        }
        // 如果 DOM 已渲染，同步到真实元素
        if (host._checkboxEl._boundElement) {
          host._checkboxEl._boundElement.checked = checked;
        }
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      if (hasError) {
        host.addClass('yoya-checkbox--error');
      }
    });
  }

  _updateContent() {
    // 只在首次创建内部 checkbox 元素
    if (this._checkboxEl) return;

    this._checkboxEl = input(i => {
      i.addClass('yoya-checkbox__input');
      i.attr('type', 'checkbox');
    });

    // 设置 checked 状态
    if (this.hasState('checked')) {
      this._checkboxEl.attr('checked', 'checked');
    }

    // 点击复选框时切换状态
    this._checkboxEl.on('change', (e) => {
      if (!this.hasState('disabled')) {
        const checked = e._boundElement ? e._boundElement.checked : e.target.checked;
        const oldValue = this.hasState('checked');
        this.setState('checked', checked);
        // 触发 onChange 回调 - 使用统一事件对象格式
        if (this._onChange) {
          this._onChange({ event: e, value: checked, oldValue, target: this });
        }
      }
    });

    this.child(this._checkboxEl);

    // 添加标签文本
    if (this._labelText) {
      this.child(span(s => s.text(this._labelText)));
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  label(value) {
    if (value === undefined) return this._labelText;
    this._labelText = value;
    // 如果 checkbox 元素已创建，更新标签文本
    if (this._checkboxEl) {
      // 查找并更新标签 span
      const labelSpan = this._children.find(c => c._tagName === 'span');
      if (labelSpan) {
        labelSpan.text(value);
      } else {
        // 如果还没有标签，添加一个
        this.child(span(s => s.text(value)));
      }
    }
    return this;
  }

  checked(value = true) {
    return this.setState('checked', value);
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  error(value = true) {
    return this.setState('error', value);
  }

  name(value) {
    if (value === undefined) return this._name;
    this._name = value;
    if (this._checkboxEl) {
      this._checkboxEl.attr('name', value);
    }
    return this;
  }

  value(value) {
    if (value === undefined) return this._value;
    this._value = value;
    if (this._checkboxEl) {
      this._checkboxEl.attr('value', value);
    }
    return this;
  }

  onChange(handler) {
    this._onChange = handler;
    return this;
  }
}

function vCheckbox(labelText = '', setup = null) {
  return new VCheckbox(labelText, setup);
}

// ============================================
// VSwitch 开关组件
// ============================================

class VSwitch extends Tag {
  static _stateAttrs = ['disabled', 'checked'];

  constructor(setup = null) {
    super('div', null);

    // 内部状态
    this._checked = false;
    this._label = null;
    this._wrapper = null;
    this._labelEl = null;
    this._switchEl = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      checked: false,
    });

    // 3. 注册状态处理器
    this._registerStateHandlers();

    // 4. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 5. 创建内部结构
    this._createInternalElements();
  }

  _createInternalElements() {
    // 创建滑块
    const knob = span(k => {
      k._isKnob = true;
      k.addClass('yoya-switch__knob');
      if (this._checked) {
        k.addClass('yoya-switch__knob--checked');
      }
    });

    // 创建 switch 按钮容器
    this._switchEl = div(s => {
      s.addClass('yoya-switch');
      if (this._checked) {
        s.addClass('yoya-switch--checked');
      }
      s.child(knob);
    });

    // 如果有 label，创建 wrapper
    if (this._label) {
      this._wrapper = div(w => {
        w.addClass('yoya-switch__wrapper');
        w.child(this._switchEl);
        w.child(this._labelEl = span(s => {
          s.text(this._label);
          s.addClass('yoya-switch__label');
        }));
      });
      this.child(this._wrapper);
    } else {
      this.child(this._switchEl);
    }

    // 绑定点击事件
    this._switchEl.on('click', (e) => {
      if (!this.hasState('disabled')) {
        const newChecked = !this._checked;
        const oldValue = this._checked;
        this.setState('checked', newChecked);
        // 触发 onChange 回调 - 使用统一事件对象格式
        if (this._onChangeHandler) {
          this._onChangeHandler({ event: e, value: newChecked, oldValue, target: this });
        }
      }
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-switch--disabled');
      } else {
        host.removeClass('yoya-switch--disabled');
      }
    });

    this.registerStateHandler('checked', (checked, host) => {
      host._checked = checked;
      if (host._switchEl) {
        if (checked) {
          host._switchEl.addClass('yoya-switch--checked');
        } else {
          host._switchEl.removeClass('yoya-switch--checked');
        }
      }
      // 更新滑块位置
      const knob = host._switchEl?._children?.find(c => c._isKnob);
      if (knob) {
        if (checked) {
          knob.addClass('yoya-switch__knob--checked');
        } else {
          knob.removeClass('yoya-switch__knob--checked');
        }
      }
    });
  }

  _onChangeHandler = null;

  // ============================================
  // 链式方法
  // ============================================

  label(value) {
    if (value === undefined) return this._label;
    this._label = value;
    // 如果已经创建了内部元素，需要更新 label
    if (this._labelEl) {
      this._labelEl.text(value);
    }
    return this;
  }

  checked(value = true) {
    return this.setState('checked', value);
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  size(value) {
    if (value === undefined) return this._size;
    this._size = value;
    this.removeClass('yoya-switch--large', 'yoya-switch--small');
    if (value === 'large') {
      this.addClass('yoya-switch--large');
    } else if (value === 'small') {
      this.addClass('yoya-switch--small');
    }
    return this;
  }

  onChange(handler) {
    this._onChangeHandler = handler;
    return this;
  }
}

function vSwitch(setup = null) {
  return new VSwitch(setup);
}

// ============================================
// VForm 表单容器组件
// ============================================

class VForm extends Tag {
  constructor(setup = null) {
    super('form', null);

    this._setupBaseStyles();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-form');
  }

  // ============================================
  // 链式方法
  // ============================================

  gap(value) {
    if (value === undefined) return this.style('gap');
    this.style('gap', value);
    return this;
  }

  action(value) {
    if (value === undefined) return this._action;
    this._action = value;
    this.attr('action', value);
    return this;
  }

  method(value) {
    if (value === undefined) return this._method;
    this._method = value;
    this.attr('method', value);
    return this;
  }

  onSubmit(handler) {
    this.on('submit', (e) => {
      e.preventDefault();
      handler({ event: e, target: this });
    });
    return this;
  }
}

function vForm(setup = null) {
  return new VForm(setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vInput = function(setup = null) {
  const input = vInput(setup);
  this.child(input);
  return this;
};

Tag.prototype.vSelect = function(setup = null) {
  const select = vSelect(setup);
  this.child(select);
  return this;
};

Tag.prototype.vTextarea = function(setup = null) {
  const textarea = vTextarea(setup);
  this.child(textarea);
  return this;
};

Tag.prototype.vCheckbox = function(labelText = '', setup = null) {
  const checkbox = vCheckbox(labelText, setup);
  this.child(checkbox);
  return this;
};

Tag.prototype.vSwitch = function(setup = null) {
  const sw = vSwitch(setup);
  this.child(sw);
  return this;
};

Tag.prototype.vForm = function(setup = null) {
  const form = vForm(setup);
  this.child(form);
  return this;
};

// ============================================
// VCheckboxes 复选框组组件
// ============================================

class VCheckboxes extends Tag {
  static _stateAttrs = ['disabled', 'error'];

  constructor(setup = null) {
    super('div', null);

    // 内部复选框列表
    this._checkboxes = [];
    this._options = [];
    this._value = [];  // 多选模式使用数组
    this._singleValue = '';  // 单选模式使用单个值
    this._multiple = false;  // 是否多选
    this._layout = 'column';  // 布局方式：column, row, grid
    this._columns = 2;  // grid 布局时的列数
    this._onChange = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      error: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素（在 setup 之后，确保 options 已设置）
    this._updateContent();
  }

  // 重写 setup 方法，支持属性赋值
  setup(setup) {
    if (typeof setup === 'function') {
      // 使用 Proxy 拦截属性赋值
      const handler = {
        set: (target, prop, value) => {
          if (prop === 'options') {
            target.options(value);
          } else if (prop === 'value') {
            target.value(value);
          } else if (prop === 'multiple') {
            target.multiple(value);
          } else if (prop === 'layout') {
            target.layout(value);
          } else if (prop === 'columns') {
            target.columns(value);
          } else if (prop === 'disabled') {
            target.disabled(value);
          } else if (prop === 'error') {
            target.error(value);
          } else if (prop.startsWith('on') && typeof value === 'function') {
            const eventName = prop.slice(2).toLowerCase();
            if (eventName === 'change') {
              target.onChange(value);
            }
          } else {
            target[prop] = value;
          }
          return true;
        }
      };
      const proxy = new Proxy(this, handler);
      setup(proxy);
    } else if (typeof setup === 'object' && setup !== null) {
      this._setupObject(setup);
    }
    return this;
  }

  // 处理对象配置
  _setupObject(config) {
    if (config.options) {
      this.options(config.options);
    }
    if (config.value !== undefined) {
      this.value(config.value);
    }
    if (config.multiple !== undefined) {
      this.multiple(config.multiple);
    }
    if (config.layout !== undefined) {
      this.layout(config.layout);
    }
    if (config.columns !== undefined) {
      this.columns(config.columns);
    }
    if (config.onChange && typeof config.onChange === 'function') {
      this.onChange(config.onChange);
    }
    // 调用父类处理 class/className/style
    if (config.class || config.className || config.style) {
      const parentSetup = {};
      if (config.class) parentSetup.class = config.class;
      if (config.className) parentSetup.className = config.className;
      if (config.style) parentSetup.style = config.style;
      Tag.prototype._setupObject.call(this, parentSetup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-checkboxes');
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-checkboxes--disabled');
        // 禁用所有复选框
        host._checkboxes.forEach(cb => {
          if (cb._checkboxEl) {
            cb._checkboxEl.attr('disabled', 'disabled');
          }
        });
      } else {
        host.removeClass('yoya-checkboxes--disabled');
        // 启用所有复选框
        host._checkboxes.forEach(cb => {
          if (cb._checkboxEl) {
            cb._checkboxEl.attr('disabled', null);
          }
        });
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      if (hasError) {
        host.addClass('yoya-checkboxes--error');
      } else {
        host.removeClass('yoya-checkboxes--error');
      }
    });
  }

  _updateContent() {
    // 清空现有复选框
    this.clear();
    this._checkboxes = [];

    // 根据布局方式设置容器样式
    this._applyLayoutStyles();

    // 创建复选框
    this._options.forEach((opt, index) => {
      const cb = vCheckbox(opt.label, c => {
        c.value(opt.value);
        // 根据模式设置选中状态
        if (this._multiple) {
          c.checked(this._value.includes(opt.value));
        } else {
          c.checked(opt.value === this._singleValue);
        }

        // 禁用状态
        if (this.hasState('disabled')) {
          c.disabled();
        }

        // 变化事件 - 使用统一事件对象格式
        c.onChange((e) => {
          const checked = e.value;
          e.oldValue;
          if (this._multiple) {
            // 多选模式：重新遍历所有 checkboxes 构建值数组
            this._value = this._checkboxes
              .filter(cb => cb.hasState('checked'))
              .map(cb => cb.value());
          } else {
            // 单选模式
            if (checked) {
              this._singleValue = opt.value;
              // 取消其他选项的选中状态
              this._checkboxes.forEach((otherCb, otherIndex) => {
                if (otherIndex !== index) {
                  otherCb.setState('checked', false);
                }
              });
            } else {
              this._singleValue = '';
            }
          }
          // 触发 onChange 回调 - 使用统一事件对象格式
          if (this._onChange) {
            this._onChange({
              event: e.event,
              value: this._multiple ? this._value : this._singleValue,
              oldValue: this._multiple ? this._value : this._singleValue,
              target: this,
            });
          }
        });
      });

      this._checkboxes.push(cb);
      this.child(cb);
    });
  }

  _applyLayoutStyles() {
    this.removeClass('yoya-checkboxes--column', 'yoya-checkboxes--row', 'yoya-checkboxes--grid');

    if (this._layout === 'row') {
      this.addClass('yoya-checkboxes--row');
    } else if (this._layout === 'grid') {
      this.addClass('yoya-checkboxes--grid');
      this.style('gridTemplateColumns', `repeat(${this._columns}, 1fr)`);
    } else {
      this.addClass('yoya-checkboxes--column');
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  options(arr) {
    if (arr === undefined) return this._options;
    this._options = arr;
    this._updateContent();
    return this;
  }

  value(val) {
    if (val === undefined) {
      return this._multiple ? this._value : this._singleValue;
    }
    if (this._multiple) {
      this._value = Array.isArray(val) ? val : (val ? [val] : []);
      // 更新复选框状态
      this._checkboxes.forEach(cb => {
        cb.setState('checked', this._value.includes(cb.value()));
      });
    } else {
      this._singleValue = val;
      // 更新复选框状态
      this._checkboxes.forEach(cb => {
        cb.setState('checked', cb.value() === val);
      });
    }
    return this;
  }

  multiple(v = true) {
    this._multiple = v;
    if (!this._multiple) {
      // 切换到单选模式时，只保留第一个值
      this._singleValue = this._value[0] || '';
    } else {
      // 切换到多选模式时，转换为数组
      if (this._singleValue) {
        this._value = [this._singleValue];
      }
    }
    return this;
  }

  layout(v) {
    if (v === undefined) return this._layout;
    this._layout = v;
    this._applyLayoutStyles();
    return this;
  }

  columns(v) {
    if (v === undefined) return this._columns;
    this._columns = v;
    if (this._layout === 'grid') {
      this._applyLayoutStyles();
    }
    return this;
  }

  disabled(v = true) {
    return this.setState('disabled', v);
  }

  error(v = true) {
    return this.setState('error', v);
  }

  onChange(handler) {
    this._onChange = handler;
    return this;
  }
}

function vCheckboxes(setup = null) {
  return new VCheckboxes(setup);
}

Tag.prototype.vCheckboxes = function(setup = null) {
  const checkboxes = vCheckboxes(setup);
  this.child(checkboxes);
  return this;
};

// ============================================
// VTimer 日期选择器组件（日历选择器）
// ============================================

class VTimer extends Tag {
  static _stateAttrs = ['disabled', 'error', 'readonly'];

  constructor(setup = null) {
    super('div', null);

    this._inputEl = null;
    this._type = 'date';  // date, datetime-local, time, month, week
    this._value = '';
    this._onChange = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      error: false,
      readonly: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素
    this._createInternalElements();
  }

  _setupBaseStyles() {
    this.styles({
      display: 'inline-block',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();
      if (enabled) {
        host.styles({ opacity: '0.5', cursor: 'not-allowed', pointerEvents: 'none' });
        if (host._inputEl) host._inputEl.attr('disabled', 'disabled');
      } else {
        host.styles({ opacity: '1', cursor: 'pointer' });
        if (host._inputEl) host._inputEl.attr('disabled', null);
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();
      if (hasError) {
        host.style('borderColor', 'var(--yoya-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--yoya-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
      }
    });

    this.registerStateHandler('readonly', (readonly, host) => {
      if (host._inputEl) {
        if (readonly) {
          host._inputEl.attr('readonly', 'readonly');
        } else {
          host._inputEl.attr('readonly', null);
        }
      }
    });
  }

  _createInternalElements() {
    this._inputEl = input(i => {
      i.attr('type', this._type);
      i.styles({
        padding: 'var(--yoya-padding-sm, 6px) var(--yoya-padding-md, 8px)',
        borderRadius: 'var(--yoya-radius-md, 6px)',
        border: '1px solid var(--yoya-border)',
        background: 'var(--yoya-bg)',
        fontSize: 'var(--yoya-font-size-md, 14px)',
        color: 'var(--yoya-text-primary)',
        outline: 'none',
        cursor: 'pointer',
      });
      if (this._value) i.value(this._value);
      i.on('change', () => this._onValueChange());
      i.on('input', () => this._onValueChange());
    });

    this.child(this._inputEl);
  }

  _onValueChange() {
    const oldValue = this._value;
    this._value = this._inputEl && this._inputEl._boundElement ? this._inputEl._boundElement.value : '';
    if (this._onChange) {
      this._onChange({
        event: new Event('change'),
        value: this._value,
        oldValue,
        target: this,
      });
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  type(t) {
    if (t === undefined) return this._type;
    this._type = t;
    if (this._inputEl) {
      this._inputEl.attr('type', t);
    }
    return this;
  }

  value(val) {
    if (val === undefined) return this._value;
    this._value = val;
    if (this._inputEl) {
      this._inputEl.value(val);
    }
    return this;
  }

  disabled(v = true) {
    return this.setState('disabled', v);
  }

  error(v = true) {
    return this.setState('error', v);
  }

  readonly(v = true) {
    return this.setState('readonly', v);
  }

  min(val) {
    if (this._inputEl) {
      this._inputEl.attr('min', val);
    }
    return this;
  }

  max(val) {
    if (this._inputEl) {
      this._inputEl.attr('max', val);
    }
    return this;
  }

  step(val) {
    if (this._inputEl) {
      this._inputEl.attr('step', val);
    }
    return this;
  }

  placeholder(val) {
    if (this._inputEl) {
      this._inputEl.attr('placeholder', val);
    }
    return this;
  }

  onChange(handler) {
    this._onChange = handler;
    return this;
  }
}

function vTimer(setup = null) {
  return new VTimer(setup);
}

// ============================================
// VTimer2 日期范围选择器组件
// ============================================

class VTimer2 extends Tag {
  static _stateAttrs = ['disabled', 'error', 'readonly'];

  constructor(setup = null) {
    super('div', null);

    this._startInputEl = null;
    this._endInputEl = null;
    this._type = 'date';
    this._value = { start: '', end: '' };
    this._onChange = null;
    this._startMin = null;
    this._startMax = null;
    this._endMin = null;
    this._endMax = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      error: false,
      readonly: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素
    this._createInternalElements();
  }

  _setupBaseStyles() {
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();
      if (enabled) {
        host.styles({ opacity: '0.5', cursor: 'not-allowed', pointerEvents: 'none' });
        if (host._startInputEl) host._startInputEl.attr('disabled', 'disabled');
        if (host._endInputEl) host._endInputEl.attr('disabled', 'disabled');
      } else {
        host.styles({ opacity: '1', cursor: 'pointer' });
        if (host._startInputEl) host._startInputEl.attr('disabled', null);
        if (host._endInputEl) host._endInputEl.attr('disabled', null);
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();
      if (hasError) {
        host.style('borderColor', 'var(--yoya-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--yoya-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
      }
    });

    this.registerStateHandler('readonly', (readonly, host) => {
      if (host._startInputEl) {
        host._startInputEl.attr('readonly', readonly ? 'readonly' : null);
      }
      if (host._endInputEl) {
        host._endInputEl.attr('readonly', readonly ? 'readonly' : null);
      }
    });
  }

  _createInternalElements() {
    // 开始时间输入
    this._startInputEl = input(i => {
      i.attr('type', this._type);
      i.attr('placeholder', '开始日期');
      i.styles({
        padding: 'var(--yoya-padding-sm, 6px) var(--yoya-padding-md, 8px)',
        borderRadius: 'var(--yoya-radius-md, 6px)',
        border: '1px solid var(--yoya-border)',
        background: 'var(--yoya-bg)',
        fontSize: 'var(--yoya-font-size-md, 14px)',
        color: 'var(--yoya-text-primary)',
        outline: 'none',
        cursor: 'pointer',
      });
      if (this._value.start) i.value(this._value.start);
      i.on('change', () => this._onValueChange());
      i.on('input', () => this._onValueChange());
    });

    // 分隔符
    const separator = span(s => {
      s.text('至');
      s.styles({ color: 'var(--yoya-text-secondary)', fontSize: 'var(--yoya-font-size-md, 14px)' });
    });

    // 结束时间输入
    this._endInputEl = input(i => {
      i.attr('type', this._type);
      i.attr('placeholder', '结束日期');
      i.styles({
        padding: 'var(--yoya-padding-sm, 6px) var(--yoya-padding-md, 8px)',
        borderRadius: 'var(--yoya-radius-md, 6px)',
        border: '1px solid var(--yoya-border)',
        background: 'var(--yoya-bg)',
        fontSize: 'var(--yoya-font-size-md, 14px)',
        color: 'var(--yoya-text-primary)',
        outline: 'none',
        cursor: 'pointer',
      });
      if (this._value.end) i.value(this._value.end);
      i.on('change', () => this._onValueChange());
      i.on('input', () => this._onValueChange());
    });

    this.child(this._startInputEl);
    this.child(separator);
    this.child(this._endInputEl);
  }

  _onValueChange() {
    const oldValue = { ...this._value };
    const start = this._startInputEl && this._startInputEl._boundElement ? this._startInputEl._boundElement.value : '';
    const end = this._endInputEl && this._endInputEl._boundElement ? this._endInputEl._boundElement.value : '';

    // 确保开始时间不晚于结束时间
    if (start && end && start > end) {
      // 如果开始时间晚于结束时间，将结束时间设置为开始时间
      this._endInputEl._boundElement.value = start;
      this._value = { start, end: start };
    } else {
      this._value = { start, end };
    }

    // 动态更新结束时间的最小值为开始时间
    if (start && this._endInputEl) {
      this._endInputEl.attr('min', start);
    }

    // 动态更新开始时间的最大值为结束时间
    if (end && this._startInputEl) {
      this._startInputEl.attr('max', end);
    }

    if (this._onChange) {
      this._onChange({
        event: new Event('change'),
        value: this._value,
        oldValue,
        target: this,
      });
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  type(t) {
    if (t === undefined) return this._type;
    this._type = t;
    if (this._startInputEl) {
      this._startInputEl.attr('type', t);
    }
    if (this._endInputEl) {
      this._endInputEl.attr('type', t);
    }
    return this;
  }

  value(val) {
    if (val === undefined) return this._value;
    if (val.start !== undefined) {
      this._value.start = val.start;
      if (this._startInputEl) {
        this._startInputEl.value(val.start);
      }
    }
    if (val.end !== undefined) {
      this._value.end = val.end;
      if (this._endInputEl) {
        this._endInputEl.value(val.end);
      }
    }
    return this;
  }

  disabled(v = true) {
    return this.setState('disabled', v);
  }

  error(v = true) {
    return this.setState('error', v);
  }

  readonly(v = true) {
    return this.setState('readonly', v);
  }

  min(val) {
    if (val === undefined) return { start: this._startMin, end: this._endMin };
    this._startMin = val;
    this._endMin = val;
    if (this._startInputEl) {
      this._startInputEl.attr('min', val);
    }
    if (this._endInputEl) {
      this._endInputEl.attr('min', val);
    }
    return this;
  }

  max(val) {
    if (val === undefined) return { start: this._startMax, end: this._endMax };
    this._startMax = val;
    this._endMax = val;
    if (this._startInputEl) {
      this._startInputEl.attr('max', val);
    }
    if (this._endInputEl) {
      this._endInputEl.attr('max', val);
    }
    return this;
  }

  startMin(val) {
    if (val === undefined) return this._startMin;
    this._startMin = val;
    if (this._startInputEl) {
      this._startInputEl.attr('min', val);
    }
    return this;
  }

  startMax(val) {
    if (val === undefined) return this._startMax;
    this._startMax = val;
    if (this._startInputEl) {
      this._startInputEl.attr('max', val);
    }
    return this;
  }

  endMin(val) {
    if (val === undefined) return this._endMin;
    this._endMin = val;
    if (this._endInputEl) {
      this._endInputEl.attr('min', val);
    }
    return this;
  }

  endMax(val) {
    if (val === undefined) return this._endMax;
    this._endMax = val;
    if (this._endInputEl) {
      this._endInputEl.attr('max', val);
    }
    return this;
  }

  onChange(handler) {
    this._onChange = handler;
    return this;
  }
}

function vTimer2(setup = null) {
  return new VTimer2(setup);
}

Tag.prototype.vTimer = function(setup = null) {
  const timer = vTimer(setup);
  this.child(timer);
  return this;
};

Tag.prototype.vTimer2 = function(setup = null) {
  const timer2 = vTimer2(setup);
  this.child(timer2);
  return this;
};

/**
 * Yoya.Components - Detail / Descriptions
 * 类似 antd Descriptions 的详情展示组件
 */


// ============================================
// VDetail 详情展示组件
// ============================================

class VDetail extends Tag {
  static _stateAttrs = ['bordered', 'layout', 'column'];

  constructor(setup = null) {
    super('div', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);

    this._items = [];
    this._column = 3;
    this._title = null;
    this._bordered = false;
    this._layout = 'horizontal';
    this._initialized = false;

    this.addClass('yoya-detail');
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _registerStateHandlers() {
    this.registerStateHandler('bordered', (bordered, host) => {
      if (bordered) {
        host.addClass('yoya-detail--bordered');
      } else {
        host.removeClass('yoya-detail--bordered');
      }
    });

    this.registerStateHandler('layout', (layout, host) => {
      host._layout = layout;
    });

    this.registerStateHandler('column', (column, host) => {
      host._column = column;
      if (host._layout === 'vertical' && host._gridContainer) {
        host._gridContainer.style('gridTemplateColumns', `repeat(${column}, 1fr)`);
      }
    });
  }

  // 创建表格结构
  _buildTable() {
    this.clear();

    // 标题
    if (this._title) {
      const titleEl = div(t => {
        t.addClass('yoya-detail__title');
        t.text(this._title);
      });
      this.child(titleEl);
    }

    // 表格容器
    const tableContainer = div(tc => {
      tc.addClass('yoya-detail__table-container');

      if (this._layout === 'vertical') {
        // 纵向布局：使用 flex 布局
        this._buildVerticalLayout(tc);
      } else {
        // 横向布局：使用表格布局
        const tbl = table(t => {
          t.addClass('yoya-detail__table');
          if (this._bordered) {
            t.addClass('yoya-detail__table--bordered');
          }
        });

        // 根据 items 和 column 计算行数
        const rows = this._buildRows();

        rows.forEach(rowItems => {
          const trEl = tr(r => {
            if (this._bordered) {
              r.addClass('yoya-detail__row--bordered');
            }
          });

          rowItems.forEach(item => {
            // 标签单元格
            const labelTd = td(l => {
              l.addClass('yoya-detail__label');
              if (this._bordered) {
                l.addClass('yoya-detail__label--bordered');
              }
              if (item.label) {
                l.text(item.label);
              }
            });

            // 内容单元格
            const contentTd = td(c => {
              c.addClass('yoya-detail__content');
              if (this._bordered) {
                c.addClass('yoya-detail__content--bordered');
              }
              if (item.content) {
                if (typeof item.content === 'string') {
                  c.text(item.content);
                } else if (item.content instanceof Tag) {
                  c.child(item.content);
                }
              }
            });

            trEl.child(labelTd, contentTd);
          });

          tbl.child(trEl);
        });

        tc.child(tbl);
      }
    });

    this.child(tableContainer);
  }

  // 纵向布局实现
  _buildVerticalLayout(container) {
    const grid = div(g => {
      g.addClass('yoya-detail__grid');
      g.style('gridTemplateColumns', `repeat(${this._column}, 1fr)`);
      this._gridContainer = g;

      this._items.forEach(item => {
        const itemEl = div(i => {
          i.addClass('yoya-detail__grid-item');

          // 标签
          const labelEl = span(l => {
            l.addClass('yoya-detail__grid-label');
            if (item.label) l.text(item.label);
          });

          // 内容
          const contentEl = div(c => {
            c.addClass('yoya-detail__grid-content');

            if (item.content) {
              if (typeof item.content === 'string') {
                c.text(item.content);
              } else if (item.content instanceof Tag) {
                c.child(item.content);
              }
            }
          });

          i.child(labelEl, contentEl);
        });

        g.child(itemEl);
      });
    });

    container.child(grid);
  }

  _buildRows() {
    const rows = [];
    let currentRow = [];

    for (const item of this._items) {
      currentRow.push(item);
      if (currentRow.length >= this._column) {
        rows.push(currentRow);
        currentRow = [];
      }
    }

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }

  // ============================================
  // 链式方法
  // ============================================

  title(value) {
    if (value === undefined) return this._title;
    this._title = value;
    return this;
  }

  column(value) {
    if (value === undefined) return this._column;
    this._column = value;
    return this;
  }

  bordered(value = true) {
    this._bordered = value;
    return this;
  }

  layout(value) {
    if (value === undefined) return this._layout;
    this._layout = value; // 'horizontal' | 'vertical'
    return this;
  }

  item(label, content) {
    this._items.push({ label, content });
    this._buildTable();  // 重新构建表格
    return this;
  }

  items(itemsArray) {
    this._items = [...this._items, ...itemsArray];
    this._buildTable();  // 重新构建表格
    return this;
  }

  // 渲染
  renderDom() {
    if (this._deleted) return null;

    if (!this._initialized) {
      this._buildTable();
      this._initialized = true;
    }

    // 调用父类 renderDom 方法整合子元素
    return super.renderDom();
  }
}

function vDetail(setup = null) {
  return new VDetail(setup);
}

// ============================================
// VDetailItem 详情项（用于组合）
// ============================================

class VDetailItem extends Tag {
  constructor(label = '', content = null, setup = null) {
    if (typeof label === 'object' && label !== null) {
      setup = content;
      content = label.content;
      label = label.label;
    }

    super('div', null);

    this._label = label;
    this._content = content;

    if (setup !== null) {
      this.setup(setup);
    }
  }

  label(value) {
    if (value === undefined) return this._label;
    this._label = value;
    return this;
  }

  content(value) {
    if (value === undefined) return this._content;
    this._content = value;
    return this;
  }
}

function vDetailItem(label = '', content = null, setup = null) {
  return new VDetailItem(label, content, setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vDetail = function(setup = null) {
  const detail = vDetail(setup);
  this.child(detail);
  return this;
};

/**
 * Yoya.Components - Field
 * 可编辑字段组件，支持显示和编辑模式切换
 */


// ============================================
// VField 可编辑字段组件
// ============================================

class VField extends Tag {
  static _stateAttrs = ['editing', 'disabled', 'loading', 'hovered'];

  constructor(setup = null) {
    super('div', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 内容定义
    this._showContentFn = null;
    this._editContentFn = null;

    // 回调
    this._onSave = null;
    this._onChange = null;
    this._onEdit = null;

    // 配置
    this._placeholder = '点击编辑';
    this._autoSave = false;
    this._editable = true;

    // 状态
    this._value = undefined;
    this._editValue = undefined;

    // 1. 初始化状态
    this.initializeStates({
      editing: false,
      disabled: false,
      loading: false,
      hovered: false,
    });

    // 2. 设置基础样式
    this._setupBaseStyles();

    // 3. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 4. 注册状态处理器
    this._registerStateHandlers();

    // 5. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 6. 构建内容（setup 后才执行）
    this._buildContent();

    // 7. 设置全局点击事件
    this._setupGlobalClickHandler();
  }

  _setupBaseStyles() {
    this.className('yoya-field');
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--yoya-field-gap, 6px)',
      padding: '0',
      minWidth: 'var(--yoya-field-min-width, 80px)',
      minHeight: 'var(--yoya-field-min-height, 32px)',
      position: 'relative',
      boxSizing: 'border-box',
      cursor: 'pointer',
      fontSize: 'var(--yoya-field-font-size, 14px)',
      color: 'var(--yoya-field-text-color, var(--yoya-text, #333))',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('editing', (editing, host) => {
      if (editing) {
        host._showContainer && host._showContainer.style('display', 'none');
        host._editContainer && host._editContainer.style('display', 'flex');
        // 进入编辑状态时重置 hover 状态
        host.setState('hovered', false);
        if (host._onEdit) host._onEdit({ value: host._value, target: host });
      } else {
        host._showContainer && host._showContainer.style('display', 'flex');
        host._editContainer && host._editContainer.style('display', 'none');
      }
    });

    this.registerStateHandler('hovered', (hovered, host) => {
      if (hovered && !host.hasState('disabled') && !host.hasState('editing')) {
        host._editIcon && host._editIcon.style('opacity', '1');
      } else {
        host._editIcon && host._editIcon.style('opacity', '0');
      }
    });

    this.registerStateHandler('disabled', (disabled, host) => {
      host.clearStateStyles();
      if (disabled) {
        host.styles({
          opacity: 'var(--yoya-field-disabled-opacity, 0.5)',
          cursor: 'var(--yoya-field-disabled-cursor, not-allowed)',
          pointerEvents: 'none',
        });
      } else {
        host.styles({
          opacity: '1',
          cursor: 'pointer',
          pointerEvents: 'auto',
        });
      }
    });

    this.registerStateHandler('loading', (loading, host) => {
      host.clearStateStyles();
      host.style('pointerEvents', loading ? 'none' : 'auto');
      host.style('opacity', loading ? 'var(--yoya-field-loading-opacity, 0.7)' : '1');
    });
  }

  // ============================================
  // 构建内容（只调用一次）
  // ============================================
  _buildShowEl(){
    // 内容
    this._showEl = div(c => {
      c.className('yoya-field__show-el');
      c.styles({
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        fontSize: 'inherit',
        color: 'inherit',
      });
    });
  }
  _buildEditIcon(){
    // 编辑图标
    this._editIcon = span(e => {
      e.className('yoya-field__edit-icon');
      e.styles({
        fontSize: 'var(--yoya-field-edit-icon-size, 14px)',
        color: 'var(--yoya-field-edit-icon-color, #999)',
        opacity: '0',
        transition: 'opacity 0.2s',
        marginLeft: 'var(--yoya-field-edit-icon-margin, 4px)',
        cursor: 'pointer',
      });
      e.html('📝');
      e.on('click', (ev) => {
        ev.stopPropagation();
        if (this._editable) this.setState('editing', true);
      });
    });
  }
  _buildShowContainer(){
    this._buildShowEl();
    this._buildEditIcon();
    this._showContainer = div(s => {
      s.className('yoya-field__show-container');
      s.styles({
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--yoya-field-show-gap, 4px)',
        height: 'var(--yoya-field-show-height, 32px)',
        padding: 'var(--yoya-field-show-padding, 8px 12px)',
        borderRadius: 'var(--yoya-field-radius, 6px)',
        border: 'var(--yoya-field-show-border, 1px solid transparent)',
        background: 'var(--yoya-field-show-bg, transparent)',
        color: 'var(--yoya-field-text-color, var(--yoya-text, #333))',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s, border-color 0.2s',
      });

      // hover 显示图标
      // 绑定事件处理函数
      this._boundHandleMouseEnter = () => {
        this.setState('hovered', true);
      };

      this._boundHandleMouseLeave = () => {
        this.setState('hovered', false);
      };

      // hover 显示图标
      s.on('mouseenter', this._boundHandleMouseEnter);
      s.on('mouseleave', this._boundHandleMouseLeave);
      // 点击/双击进入编辑
      // 绑定点击事件处理函数
      this._boundHandleClick = () => {
        if (!this.hasState('disabled') && !this.hasState('editing') && this._editable) {
          this.setState('editing', true);
        }
      };

      this._boundHandleDoubleClick = () => {
        if (!this.hasState('disabled') && !this.hasState('editing') && this._editable) {
          this.setState('editing', true);
        }
      };

      // 点击/双击进入编辑
      s.on('dblclick', this._boundHandleDoubleClick);
    });
    this._showContainer.child(this._showEl);
    this._showContainer.child(this._editIcon);
  }
  _buildEditEl(){
    // 编辑内容
    this._editEl = div(c => {
      c.className('yoya-field__edit-el');
      c.styles({
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        fontSize: 'inherit',
        color: 'inherit',
      });
    });
  }
  _buildBtnContainer(){
    let that = this;
    this._btnContainer = div(a => {
      a.className('yoya-field__btn-container');
      a.styles({
        display: 'flex',
        gap: 'var(--yoya-field-btn-gap, 4px)',
      });
      a.child(button(save => {
        save.className('yoya-field__btn-save');
        save.styles({
          minWidth: 'var(--yoya-field-btn-size, 24px)',
          height: 'var(--yoya-field-btn-size, 24px)',
          padding: 'var(--yoya-field-btn-padding, 0 6px)',
          border: 'var(--yoya-field-save-border, 1px solid #28a745)',
          borderRadius: 'var(--yoya-field-btn-radius, 4px)',
          background: 'var(--yoya-field-save-bg, #28a745)',
          color: 'var(--yoya-field-save-color, white)',
          fontSize: 'var(--yoya-field-btn-font-size, 11px)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        });
        save.text('✓');
        save.on('mouseenter', () => {
          save.styles({
            background: 'var(--yoya-field-save-hover-bg, #218838)',
          });
        });
        save.on('click', (ev) => { ev.stopPropagation(); that._handleSave(); });
      }));
      a.child(button(cancel => {
        cancel.className('yoya-field__btn-cancel');
        cancel.styles({
          minWidth: 'var(--yoya-field-btn-size, 24px)',
          height: 'var(--yoya-field-btn-size, 24px)',
          padding: 'var(--yoya-field-btn-padding, 0 6px)',
          border: 'var(--yoya-field-cancel-border, 1px solid var(--yoya-border, #e0e0e0))',
          borderRadius: 'var(--yoya-field-btn-radius, 4px)',
          background: 'var(--yoya-field-cancel-bg, var(--yoya-bg-secondary, #f7f8fa))',
          color: 'var(--yoya-field-cancel-color, var(--yoya-text-secondary, #666))',
          fontSize: 'var(--yoya-field-btn-font-size, 11px)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        });
        cancel.text('✕');
        cancel.on('mouseenter', () => {
          cancel.styles({
            background: 'var(--yoya-field-cancel-hover-bg, var(--yoya-bg-tertiary, #f0f0f0))',
          });
        });
        cancel.on('click', (ev) => { ev.stopPropagation(); that._handleCancel(); });
      }));
    });
  }
  _buildEditContainer(){
    this._buildEditEl();
    this._buildBtnContainer();
    this._editContainer = div(e => {
      e.className('yoya-field__edit-container');
      e.styles({
        display: 'none',
        alignItems: 'center',
        gap: 'var(--yoya-field-edit-gap, 6px)',
        width: '100%',
        boxSizing: 'border-box',
        padding: 'var(--yoya-field-edit-padding, 4px)',
        background: 'var(--yoya-field-edit-bg, var(--yoya-bg-secondary, #f7f8fa))',
        borderRadius: 'var(--yoya-field-radius, 6px)',
        border: 'var(--yoya-field-edit-border, 1px solid var(--yoya-border, #e0e0e0))',
        boxShadow: 'var(--yoya-field-edit-shadow, 0 2px 8px rgba(0,0,0,0.1))',
        color: 'var(--yoya-field-text-color, var(--yoya-text, #333))',
      });
      e.child(this._editEl);
      // 按钮（手动保存模式）
      e.child(this._btnContainer);
      e.on('click', (ev) => ev.stopPropagation());
    });
  }
  _buildContent() {
    // 创建显示容器
    this._buildShowContainer();
    this.child(this._showContainer);
    // 创建编辑容器
    this._buildEditContainer();
    this.child(this._editContainer);

    // 更新内容
    this._updateShowContent();
    this._updateEditContent();

    // 更新按钮显示
    if (this._btnContainer) {
      this._btnContainer.style('display', this._autoSave ? 'none' : 'flex');
    }
  }

  _updateShowContent() {
    if (!this._showEl) return;
    this._showEl.clear();
    const displayValue = this._value;
    if (typeof this._showContentFn === 'function') {
      this._showContentFn(this._showEl, displayValue, this);
    } else if (typeof this._showContentFn === 'string') {
      this._showEl.text(this._showContentFn);
    } else {
      this._showEl.styles({ color: '#999', fontStyle: 'italic' });
      this._showEl.text(this._placeholder);
    }
  }

  _updateEditContent() {
    if (!this._editEl) return;
    this._editEl.clear();

    const setValueFn = (value) => {
      this._editValue = value;
      // 判断当前状态：
      // - 显示状态（!editing）：说明有异步保存动作没执行完，执行保存动作
      // - 编辑状态（editing）：说明修改动作还没执行完，不执行保存动作
      // 注意：在自动保存模式下，用户输入时处于编辑状态，不应触发保存
      // 只有当从显示状态进入时（如异步保存场景中），才需要执行保存
      if (!this.hasState('editing')) {
        // 当前是显示状态，执行保存
        if (this._autoSave) this._handleSave();
      }
      // 编辑状态下不执行保存，等待用户确认或失去焦点
    };

    if (typeof this._editContentFn === 'function') {
      this._editContentFn(this._editEl, setValueFn, this);
    }
  }

  // ============================================
  // 保存/取消
  // ============================================

  _handleSave() {
    this._doSave();
  }
  _doSave(){
    // 验证 _editValue 是否为有效值（不是组件实例）
    if (this._editValue !== undefined && this._editValue !== null) {
      // 如果 _editValue 是对象且有 value 方法，则可能是组件实例
      if (typeof this._editValue === 'object' && this._editValue !== null && typeof this._editValue.value === 'function') {
        console.warn('VField: _editValue appears to be a component instance, extracting value');
        this._editValue = this._editValue.value();
      }
    }

    const newValue = this._editValue !== undefined ? this._editValue : this._value;
    const oldValue = this._value;

    if (this._onSave) {
      const result = this._onSave({ value: newValue, oldValue, target: this });
      if (result && result.then) {
        // 异步保存：立即退出编辑状态（进入显示状态），但保持 loading
        // 这样 setValueFn 可以判断：显示状态=有异步保存没执行完，编辑状态=用户还在编辑
        this.setState('loading', true);
        this.setState('editing', false);
        result.then(() => {
          this.setState('loading', false);
          this._value = newValue;
          this._updateShowContent();
          if (this._onChange) this._onChange({ value: newValue, oldValue, target: this });
        }).catch(() => {
          this.setState('loading', false);
          // 保存失败时重新进入编辑状态
          this.setState('editing', true);
        });
      } else {
        this._value = newValue;
        this.setState('editing', false);
        this._updateShowContent();
        if (this._onChange) this._onChange({ value: newValue, oldValue, target: this });
      }
    } else {
      this._value = newValue;
      this.setState('editing', false);
      this._updateShowContent();
      if (this._onChange) this._onChange({ value: newValue, oldValue, target: this });
    }
  }

  _handleCancel() {
    this.setState('editing', false);
  }

  _setupGlobalClickHandler() {
    if (typeof document !== 'undefined' && !this._globalClickHandlerSetup) {
      this._globalClickHandlerSetup = true;
      // 绑定全局点击事件处理函数
      this._boundHandleGlobalClick = (e) => {
        if (this.hasState('editing') && !this._el.contains(e.target)) {
          if (this._autoSave) this._handleSave();
          else this._handleCancel();
        }
      };
      document.addEventListener('click', this._boundHandleGlobalClick);
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  getValue() {
    return this._value;
  }

  setValue(value) {
    let validatedValue = value;
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && value !== null && typeof value.value === 'function') {
        console.warn('VField.setValue: value appears to be a component instance, extracting value');
        validatedValue = value.value();
      }
    }

    if (this.hasState('editing')) {
      this._editValue = validatedValue;
      this._value = validatedValue;
      this._updateShowContent();
      if (this._autoSave) this._handleSave();
    } else {
      this._value = validatedValue;
      this._updateShowContent();
    }
    return this;
  }

  showContent(fn) {
    if (fn === undefined) return this._showContentFn;
    this._showContentFn = fn;
    if (!this.hasState('editing')) this._updateShowContent();
    return this;
  }

  editContent(fn) {
    if (fn === undefined) return this._editContentFn;
    this._editContentFn = fn;
    if (this.hasState('editing')) this._updateEditContent();
    return this;
  }

  value(val) {
    if (val === undefined) return this.getValue();
    return this.setValue(val);
  }

  autoSave(v) {
    if (v === undefined) return this._autoSave;
    this._autoSave = v;
    return this;
  }

  placeholder(v) {
    if (v === undefined) return this._placeholder;
    this._placeholder = v;
    return this;
  }

  editable(v) {
    if (v === undefined) return this._editable;
    this._editable = v;
    return this;
  }

  onEdit(fn) {
    if (fn === undefined) return this._onEdit;
    this._onEdit = fn;
    return this;
  }

  onSave(fn) {
    if (fn === undefined) return this._onSave;
    this._onSave = fn;
    return this;
  }

  onChange(fn) {
    if (fn === undefined) return this._onChange;
    this._onChange = fn;
    return this;
  }

  disabled(v = true) {
    return this.setState('disabled', v);
  }

  loading(v = true) {
    return this.setState('loading', v);
  }

  editing(v) {
    if (v === undefined) return this.hasState('editing');
    return this.setState('editing', v);
  }

  destroy() {
    // 移除全局点击事件监听器
    if (this._globalClickHandlerSetup) {
      document.removeEventListener('click', this._boundHandleGlobalClick);
      this._globalClickHandlerSetup = false;
    }
    
    // 移除事件监听器引用
    this._boundHandleMouseEnter = null;
    this._boundHandleMouseLeave = null;
    this._boundHandleClick = null;
    this._boundHandleDoubleClick = null;
    this._boundHandleGlobalClick = null;
    
    // 调用父类的destroy方法
    super.destroy();
  }
}


function vField(setup = null) {
  return new VField(setup);
}

Tag.prototype.vField = function(setup = null) {
  const field = vField(setup);
  this.child(field);
  return this;
};

/**
 * Yoya.Basic - Switchers 分段控制器组件
 * 用于在一组互斥选项中选择一个，类似 segmented control / radio group 的横向按钮样式
 * @module Yoya.Switchers
 * @example
 * // 基础用法
 * import { vSwitchers } from '../yoya/index.js';
 *
 * vSwitchers(s => {
 *   s.options([
 *     { value: 'day', label: '日' },
 *     { value: 'week', label: '周' },
 *     { value: 'month', label: '月' },
 *   ]);
 *   s.value('week');
 *   s.onChange((value) => {
 *     console.log('选中：', value);
 *   });
 * });
 *
 * // 自定义尺寸
 * vSwitchers(s => {
 *   s.options(['小', '中', '大']);
 *   s.size('small'); // 'small' | 'medium' | 'large'
 * });
 *
 * // 带禁用项
 * vSwitchers(s => {
 *   s.options([
 *     { value: 'opt1', label: '选项 1' },
 *     { value: 'opt2', label: '选项 2', disabled: true },
 *     { value: 'opt3', label: '选项 3' },
 *   ]);
 *   s.value('opt1');
 * });
 */


// ============================================
// VSwitchers 分段控制器
// ============================================

/**
 * VSwitchers 分段控制器
 * 支持单选、多选、禁用项、尺寸调整等
 * @class
 * @extends Tag
 */
class VSwitchers extends Tag {
  static _stateAttrs = ['disabled'];

  /**
   * 创建 VSwitchers 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    // 内部引用
    this._items = [];
    this._selectedValue = null;
    this._selectedValues = []; // 多选模式
    this._options = [];
    this._multiple = false;
    this._onChange = null;
    this._size = 'medium';

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
    });

    // 3. 设置基础 CSS 类
    this.addClass('yoya-switchers');

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    // disabled 状态
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-switchers--disabled');
      } else {
        host.removeClass('yoya-switchers--disabled');
      }
      // 同步更新所有选项的禁用状态
      host._updateAllItemsDisabled();
    });
  }

  /**
   * 同步更新所有选项的禁用状态
   * @private
   */
  _updateAllItemsDisabled() {
    const isDisabled = this.hasState('disabled');
    this._items.forEach((item, index) => {
      const option = this._options[index];
      if (option && !option.disabled) {
        // 选项本身不禁用，但容器禁用
        if (isDisabled) {
          item.addClass('yoya-switchers__item--disabled');
        } else {
          item.removeClass('yoya-switchers__item--disabled');
        }
      }
    });
  }

  /**
   * 设置选项
   * @param {Array} options - 选项数组（支持字符串或对象 {value, label, disabled}）
   * @returns {this}
   */
  options(options) {
    if (options === undefined) return this._options;

    this._options = options.map(opt => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt, disabled: false };
      }
      return {
        value: opt.value || opt.label || '',
        label: opt.label || opt.value || '',
        disabled: opt.disabled || false,
      };
    });

    this._renderItems();
    return this;
  }

  /**
   * 渲染选项项
   * @private
   */
  _renderItems() {
    // 清空现有项
    this._items = [];
    this.clear();

    this._options.forEach((option, index) => {
      const item = this._createItem(option, index);
      this._items.push(item);
      this.child(item);
    });

    // 如果有已选值，更新选中状态
    if (this._multiple && this._selectedValues.length > 0) {
      this._updateSelectedState();
    } else if (!this._multiple && this._selectedValue !== null) {
      this._updateSelectedState();
    }
  }

  /**
   * 创建选项项
   * @param {Object} option - 选项配置
   * @param {number} index - 索引
   * @returns {Tag} 选项元素
   * @private
   */
  _createItem(option, index) {
    const item = div(i => {
      i.addClass('yoya-switchers__item');
      i.text(option.label);

      // 如果选项本身禁用或容器禁用，添加禁用样式
      if (option.disabled || this.hasState('disabled')) {
        i.addClass('yoya-switchers__item--disabled');
      }

      // 点击事件
      if (!option.disabled && !this.hasState('disabled')) {
        i.on('click', () => {
          this._handleItemClick(option, index);
        });
      }
    });

    return item;
  }

  /**
   * 处理选项点击
   * @param {Object} option - 选项配置
   * @param {number} index - 索引
   * @private
   */
  _handleItemClick(option, index) {
    if (this._multiple) {
      // 多选模式
      const valueIndex = this._selectedValues.indexOf(option.value);
      if (valueIndex > -1) {
        // 取消选中
        this._selectedValues.splice(valueIndex, 1);
      } else {
        // 选中
        this._selectedValues.push(option.value);
      }
      this._updateSelectedState();
      if (this._onChange) {
        this._onChange([...this._selectedValues], option, index);
      }
    } else {
      // 单选模式
      if (this._selectedValue === option.value) {
        return; // 已选中，不重复触发
      }
      this._selectedValue = option.value;
      this._updateSelectedState();
      if (this._onChange) {
        this._onChange(option.value, option, index);
      }
    }
  }

  /**
   * 更新选中状态
   * @private
   */
  _updateSelectedState() {
    this._items.forEach((item, index) => {
      const option = this._options[index];
      if (!option) return;

      if (this._multiple) {
        const isSelected = this._selectedValues.indexOf(option.value) > -1;
        if (isSelected) {
          item.addClass('yoya-switchers__item--active');
        } else {
          item.removeClass('yoya-switchers__item--active');
        }
      } else {
        if (option.value === this._selectedValue) {
          item.addClass('yoya-switchers__item--active');
        } else {
          item.removeClass('yoya-switchers__item--active');
        }
      }
    });
  }

  /**
   * 设置/获取选中值
   * @param {string|Array} value - 选中值（多选时为数组）
   * @returns {this|*}
   */
  value(value) {
    if (value === undefined) {
      return this._multiple ? [...this._selectedValues] : this._selectedValue;
    }

    if (this._multiple) {
      this._selectedValues = Array.isArray(value) ? [...value] : [value];
    } else {
      this._selectedValue = value;
    }

    this._updateSelectedState();
    return this;
  }

  /**
   * 设置多选模式
   * @param {boolean} multiple - 是否多选
   * @returns {this}
   */
  multiple(multiple) {
    if (multiple === undefined) return this._multiple;
    this._multiple = multiple;
    return this;
  }

  /**
   * 设置禁用状态
   * @param {boolean} disabled - 是否禁用
   * @returns {this}
   */
  disabled(disabled) {
    return this.setState('disabled', disabled);
  }

  /**
   * 设置尺寸
   * @param {string} size - 'small' | 'medium' | 'large'
   * @returns {this}
   */
  size(size) {
    if (size === undefined) return this._size;

    // 移除旧尺寸类
    this.removeClass('yoya-switchers--small')
        .removeClass('yoya-switchers--medium')
        .removeClass('yoya-switchers--large');

    this._size = size;

    // 添加新尺寸类
    if (size === 'small' || size === 'medium' || size === 'large') {
      this.addClass(`yoya-switchers--${size}`);
    } else {
      this.addClass('yoya-switchers--medium');
    }

    return this;
  }

  /**
   * 设置变化事件回调
   * @param {Function} callback - 回调函数
   * @returns {this}
   */
  onChange(callback) {
    if (typeof callback === 'function') {
      this._onChange = callback;
    }
    return this;
  }

  /**
   * 设置背景色
   * @param {string} color - 颜色值
   * @returns {this}
   */
  background(color) {
    if (color === undefined) return this.style('background-color');
    this.style('background-color', color);
    return this;
  }

  /**
   * 设置内边距
   * @param {string} value - 内边距值
   * @returns {this}
   */
  padding(value) {
    if (value === undefined) return this.style('padding');
    this.style('padding', value);
    return this;
  }

  /**
   * 设置外边距
   * @param {string} value - 外边距值
   * @returns {this}
   */
  margin(value) {
    if (value === undefined) return this.style('margin');
    this.style('margin', value);
    return this;
  }

  /**
   * 设置宽度
   * @param {string} value - 宽度值
   * @returns {this}
   */
  width(value) {
    if (value === undefined) return this.style('width');
    this.style('width', value);
    return this;
  }
}

/**
 * 创建 VSwitchers 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VSwitchers}
 */
function vSwitchers(setup = null) {
  return new VSwitchers(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 vSwitchers 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vSwitchers = function(setup = null) {
  const el = vSwitchers(setup);
  this.child(el);
  return this;
};

/**
 * Yoya.Basic - Body 组件
 * 页面整体背景容器
 */


/**
 * VBody 类 - 页面背景容器
 *
 * @example
 * vBody(b => {
 *   b.child(
 *     div(d => {
 *       d.text('页面内容');
 *     })
 *   );
 * });
 */
class VBody extends Tag {
  static _stateAttrs = ['fullscreen'];

  constructor(setup = null) {
    super('div', null);

    // 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 初始化状态
    this.initializeStates({ fullscreen: true });

    // 应用基础 CSS 类
    this.addClass('yoya-body');
    this.addClass('yoya-body--fullscreen');

    // 注册状态处理器
    this._registerStateHandlers();

    // 监听主题变化
    this._setupThemeListener();

    // 执行 setup
    if (setup) {
      this.setup(setup);
    }
  }

  /**
   * 监听主题变化事件
   */
  _setupThemeListener() {
    if (typeof window === 'undefined') return;

    this._themeChangeListener = (e) => {
      // 主题变化时重新应用样式
      this._applyThemeBaseStyles();
    };

    window.addEventListener('theme-changed', this._themeChangeListener);
  }

  /**
   * 应用主题基础样式
   */
  _applyThemeBaseStyles() {
    // 从主题管理器获取 VBody 组件样式
    const theme = this._getTheme();
    if (theme?.componentThemes?.VBody?.baseStyles) {
      this.styles(theme.componentThemes.VBody.baseStyles);
    }
  }

  /**
   * 获取当前主题
   */
  _getTheme() {
    if (typeof window !== 'undefined' && window._yoyaTheme) {
      return window._yoyaTheme;
    }
    return null;
  }

  /**
   * 设置背景色
   * @param {string} color - 颜色值
   * @returns {VBody} this
   */
  background(color) {
    this.style('background', color);
    return this;
  }

  /**
   * 设置最小高度
   * @param {string} height - 高度值
   * @returns {VBody} this
   */
  minHeight(height) {
    this.style('minHeight', height);
    return this;
  }

  /**
   * 设置全屏模式
   * @param {boolean} enabled - 是否启用全屏
   * @returns {VBody} this
   */
  fullscreen(enabled) {
    this.setState('fullscreen', enabled);
    return this;
  }

  /**
   * 设置内容对齐方式
   * @param {string} align - 对齐方式
   * @returns {VBody} this
   */
  align(align) {
    this.removeClass('yoya-body--align-top', 'yoya-body--align-bottom', 'yoya-body--align-stretch', 'yoya-body--center');
    if (align === 'top') {
      this.addClass('yoya-body--align-top');
    } else if (align === 'bottom') {
      this.addClass('yoya-body--align-bottom');
    } else if (align === 'center') {
      this.addClass('yoya-body--center');
    } else {
      this.addClass('yoya-body--align-stretch');
    }
    return this;
  }

  /**
   * 设置内容居中对齐
   * @returns {VBody} this
   */
  center() {
    this.addClass('yoya-body--center');
    return this;
  }

  /**
   * 设置内边距
   * @param {string} padding - 内边距值
   * @returns {VBody} this
   */
  padding(padding) {
    this.style('padding', padding);
    return this;
  }

  /**
   * 添加子元素
   * @param {Tag|HTMLElement|string} child - 子元素
   * @returns {VBody} this
   */
  content(child) {
    if (typeof child === 'string') {
      this.text(child);
    } else if (child instanceof Tag) {
      this.child(child);
    } else if (child instanceof HTMLElement) {
      this.child(child);
    }
    return this;
  }

  /**
   * 注册状态处理器
   */
  _registerStateHandlers() {
    // fullscreen 状态处理器
    this.registerStateHandler('fullscreen', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-body--fullscreen');
      } else {
        host.removeClass('yoya-body--fullscreen');
      }
    });
  }

  /**
   * 销毁组件，清理事件监听
   */
  destroy() {
    // 移除主题变化监听器
    if (this._themeChangeListener && typeof window !== 'undefined') {
      window.removeEventListener('theme-changed', this._themeChangeListener);
    }
    super.destroy();
  }
}

/**
 * vBody 工厂函数
 * @param {Function|Object|string} setup - 配置函数、对象或文本内容
 * @returns {VBody} VBody 实例
 */
function vBody(setup = null) {
  return new VBody(setup);
}

/**
 * 创建 Body 容器并绑定到指定目标
 * @param {string|HTMLElement} target - 绑定目标
 * @param {Function} setup - 配置函数
 * @returns {VBody} VBody 实例
 */
function createBody(target, setup = null) {
  const body = new VBody(setup);
  if (target) {
    body.bindTo(target);
  }
  return body;
}

/**
 * Yoya.Components - Table
 * 表格组件，使用原生 table 元素，自带主题样式
 */


// ============================================
// VTable 表格
// ============================================

class VTable extends Tag {
  static _stateAttrs = ['bordered', 'striped', 'hoverable', 'compact'];

  constructor(setup = null) {
    super('table', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      bordered: false,
      striped: false,
      hoverable: false,  // 默认 false，当调用 hoverable() 时才启用
      compact: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 'var(--yoya-table-font-size, 14px)',
      color: 'var(--yoya-table-text, var(--yoya-text))',
      background: 'var(--yoya-table-bg, var(--yoya-bg))',
    });
  }

  _registerStateHandlers() {
    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.styles({
          border: '1px solid var(--yoya-table-border, var(--yoya-border))',
        });
      } else {
        host.style('border', '');
      }
    });

    // striped 状态 - 影响所有子元素 tr
    this.registerStateHandler('striped', (enabled, host) => {
      // 设置 CSS 变量
      const el = host._boundElement || host._el;
      if (el) {
        if (enabled) {
          el.style.setProperty('--yoya-table-striped-bg', 'var(--yoya-bg-secondary)');
        } else {
          el.style.removeProperty('--yoya-table-striped-bg');
        }
      }
      // 通知所有 VTr 子元素更新样式
      host._updateChildrenStyles();
    });

    // hoverable 状态 - 影响所有子元素 tr
    this.registerStateHandler('hoverable', (enabled, host) => {
      // 设置 CSS 变量
      const el = host._boundElement || host._el;
      if (el) {
        if (enabled) {
          el.style.setProperty('--yoya-table-hover-bg', 'var(--yoya-hover-bg)');
        } else {
          el.style.removeProperty('--yoya-table-hover-bg');
        }
      }
      // 通知所有 VTr 子元素更新样式
      host._updateChildrenStyles();
    });

    // compact 状态
    this.registerStateHandler('compact', (enabled, host) => {
      const el = host._boundElement || host._el;
      if (el) {
        if (enabled) {
          el.style.setProperty('--yoya-table-cell-padding', '8px 12px');
        } else {
          el.style.removeProperty('--yoya-table-cell-padding');
        }
      }
    });
  }

  // 通知所有 VTr 子元素更新样式
  _updateChildrenStyles() {
    const striped = this.getState('striped');
    const hoverable = this.getState('hoverable');

    // 只统计 tbody 中的 tr 用于斑马纹
    this._children.forEach(child => {
      if (child instanceof VTbody) {
        // 只统计 tbody 中的 tr
        let trIndex = 0;
        child._children.forEach(innerChild => {
          if (innerChild instanceof VTr) {
            innerChild._syncTableStates(striped, hoverable, trIndex % 2 === 0);
            trIndex++;
          }
        });
      } else if (child instanceof VThead || child instanceof VTfoot) {
        // thead 和 tfoot 中的 tr 不应用斑马纹
        child._children.forEach(innerChild => {
          if (innerChild instanceof VTr) {
            innerChild._syncTableStates(false, hoverable, false);
          }
        });
      } else if (child instanceof VTr) {
        // 直接在 table 下的 tr（不常见）
        child._syncTableStates(striped, hoverable, false);
      }
    });
  }

  // 链式方法
  bordered(value = true) {
    this.setState('bordered', value);
    return this;
  }

  striped(value = true) {
    this.setState('striped', value);
    return this;
  }

  hoverable(value = true) {
    this.setState('hoverable', value);
    return this;
  }

  compact(value = true) {
    this.setState('compact', value);
    return this;
  }

  // 重写 child 方法，添加子元素时同步状态
  child(...children) {
    super.child(...children);
    // 添加子元素后，同步状态
    this._updateChildrenStyles();
    return this;
  }
}

function vTable(setup = null) {
  return new VTable(setup);
}

// ============================================
// VThead 表格头部
// ============================================

class VThead extends Tag {
  constructor(setup = null) {
    super('thead', null);

    this.styles({
      background: 'var(--yoya-table-head-bg, var(--yoya-bg-secondary))',
      borderBottom: '2px solid var(--yoya-table-border, var(--yoya-border))',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 重写 child 方法，添加子元素时通知 VTable 更新
  child(...children) {
    super.child(...children);
    this._notifyTableUpdate();
    return this;
  }

  // 通知 VTable 更新
  _notifyTableUpdate() {
    // 查找父元素 VTable
    const parent = this._findParentTable();
    if (parent && parent._updateChildrenStyles) {
      parent._updateChildrenStyles();
    }
  }

  // 查找父元素 VTable
  _findParentTable() {
    // 通过 boundElement 的 parentNode 查找
    if (this._boundElement && this._boundElement.parentNode) {
      let node = this._boundElement.parentNode;
      while (node) {
        if (node._vnode instanceof VTable) {
          return node._vnode;
        }
        node = node.parentNode;
      }
    }
    return null;
  }
}

function vThead(setup = null) {
  return new VThead(setup);
}

// ============================================
// VTbody 表格主体
// ============================================

class VTbody extends Tag {
  constructor(setup = null) {
    super('tbody', null);

    this.styles({
      background: 'var(--yoya-table-body-bg, var(--yoya-bg))',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 重写 child 方法，添加子元素时通知 VTable 更新
  child(...children) {
    super.child(...children);
    this._notifyTableUpdate();
    return this;
  }

  // 通知 VTable 更新
  _notifyTableUpdate() {
    // 查找父元素 VTable
    const parent = this._findParentTable();
    if (parent && parent._updateChildrenStyles) {
      parent._updateChildrenStyles();
    }
  }

  // 查找父元素 VTable
  _findParentTable() {
    // 通过 boundElement 的 parentNode 查找
    if (this._boundElement && this._boundElement.parentNode) {
      let node = this._boundElement.parentNode;
      while (node) {
        if (node._vnode instanceof VTable) {
          return node._vnode;
        }
        node = node.parentNode;
      }
    }
    return null;
  }
}

function vTbody(setup = null) {
  return new VTbody(setup);
}

// ============================================
// VTfoot 表格底部
// ============================================

class VTfoot extends Tag {
  constructor(setup = null) {
    super('tfoot', null);

    this.styles({
      background: 'var(--yoya-table-foot-bg, var(--yoya-bg-secondary))',
      borderTop: '2px solid var(--yoya-table-border, var(--yoya-border))',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 重写 child 方法，添加子元素时通知 VTable 更新
  child(...children) {
    super.child(...children);
    this._notifyTableUpdate();
    return this;
  }

  // 通知 VTable 更新
  _notifyTableUpdate() {
    // 查找父元素 VTable
    const parent = this._findParentTable();
    if (parent && parent._updateChildrenStyles) {
      parent._updateChildrenStyles();
    }
  }

  // 查找父元素 VTable
  _findParentTable() {
    // 通过 boundElement 的 parentNode 查找
    if (this._boundElement && this._boundElement.parentNode) {
      let node = this._boundElement.parentNode;
      while (node) {
        if (node._vnode instanceof VTable) {
          return node._vnode;
        }
        node = node.parentNode;
      }
    }
    return null;
  }
}

function vTfoot(setup = null) {
  return new VTfoot(setup);
}

// ============================================
// VTr 表格行
// ============================================

class VTr extends Tag {
  static _stateAttrs = ['striped', 'hoverable', 'isEvenRow'];

  constructor(setup = null) {
    super('tr', null);

    // 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 初始化状态
    this.initializeStates({
      striped: false,
      hoverable: false,
      isEvenRow: false,
    });

    // 设置基础样式
    this._setupBaseStyles();

    // 注册状态处理器
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      transition: 'background-color 0.2s',
    });
  }

  _registerStateHandlers() {
    // striped + isEvenRow 状态 - 偶数行应用背景色
    this.registerStateHandler('isEvenRow', (isEven, host) => {
      // 只有当 striped 状态启用且是偶数行时才应用背景色
      if (isEven && host.hasState('striped')) {
        host.style('background', 'var(--yoya-table-striped-bg, var(--yoya-bg-secondary))');
        host._hasStripedBg = true;
      } else {
        host.style('background', '');
        host._hasStripedBg = false;
      }
    });

    // striped 状态 - 重新应用偶数行样式
    this.registerStateHandler('striped', (enabled, host) => {
      if (enabled && host.hasState('isEvenRow')) {
        host.style('background', 'var(--yoya-table-striped-bg, var(--yoya-bg-secondary))');
        host._hasStripedBg = true;
      } else {
        if (!host.hasState('hoverable')) {
          host.style('background', '');
        }
        host._hasStripedBg = false;
      }
    });

    // hoverable 状态 - 绑定悬停事件
    this.registerStateHandler('hoverable', (enabled, host) => {
      const el = host._boundElement || host._el;

      // 先清除旧的事件监听器
      if (host._hoverBound) {
        if (el) {
          el.removeEventListener('mouseenter', host._mouseenterHandler);
          el.removeEventListener('mouseleave', host._mouseleaveHandler);
        }
        host._hoverBound = false;
      }

      if (enabled) {
        // 创建事件处理器
        host._mouseenterHandler = () => {
          // 直接设置 DOM 元素的 style.setProperty 来覆盖简写属性
          if (host._el) {
            host._el.style.setProperty('background', 'var(--yoya-table-hover-bg, var(--yoya-hover-bg))');
          }
        };
        host._mouseleaveHandler = () => {
          // 若有条纹且是偶数行，恢复条纹色；否则恢复透明
          if (host._hasStripedBg) {
            if (host._el) {
              host._el.style.setProperty('background', 'var(--yoya-table-striped-bg, var(--yoya-bg-secondary))');
            }
          } else {
            if (host._el) {
              host._el.style.removeProperty('background');
            }
          }
        };

        // 直接绑定到真实 DOM 元素
        if (el) {
          el.addEventListener('mouseenter', host._mouseenterHandler);
          el.addEventListener('mouseleave', host._mouseleaveHandler);
        }
        host._hoverBound = true;
      }
    });
  }

  // 同步 VTable 的状态
  _syncTableStates(tableStriped, tableHoverable, isEvenRow) {
    this.setState('striped', tableStriped);
    this.setState('hoverable', tableHoverable);
    this.setState('isEvenRow', isEvenRow);
  }
}

function vTr(setup = null) {
  return new VTr(setup);
}

// ============================================
// VTh 表格头单元格
// ============================================

class VTh extends Tag {
  constructor(setup = null) {
    super('th', null);

    this.styles({
      padding: 'var(--yoya-table-head-padding, 12px 16px)',
      textAlign: 'left',
      fontWeight: '600',
      color: 'var(--yoya-table-head-color, var(--yoya-text))',
      borderBottom: '2px solid var(--yoya-table-border, var(--yoya-border))',
      whiteSpace: 'nowrap',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }
}

function vTh(setup = null) {
  return new VTh(setup);
}

// ============================================
// VTd 表格单元格
// ============================================

class VTd extends Tag {
  constructor(setup = null) {
    super('td', null);

    this.styles({
      padding: 'var(--yoya-table-cell-padding, 12px 16px)',
      borderBottom: '1px solid var(--yoya-table-row-border, var(--yoya-border))',
      color: 'var(--yoya-table-cell-color, var(--yoya-text))',
      verticalAlign: 'middle',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }
}

function vTd(setup = null) {
  return new VTd(setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vTable = function(setup = null) {
  const table = vTable(setup);
  this.child(table);
  return this;
};

Tag.prototype.vThead = function(setup = null) {
  const thead = vThead(setup);
  this.child(thead);
  return this;
};

Tag.prototype.vTbody = function(setup = null) {
  const tbody = vTbody(setup);
  this.child(tbody);
  return this;
};

Tag.prototype.vTfoot = function(setup = null) {
  const tfoot = vTfoot(setup);
  this.child(tfoot);
  return this;
};

Tag.prototype.vTr = function(setup = null) {
  const tr = vTr(setup);
  this.child(tr);
  return this;
};

Tag.prototype.vTh = function(setup = null) {
  const th = vTh(setup);
  this.child(th);
  return this;
};

Tag.prototype.vTd = function(setup = null) {
  const td = vTd(setup);
  this.child(td);
  return this;
};

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

/**
 * Yoya.Components - Tabs
 * IDEA 风格的标签页组件，紧凑设计，优秀的标题与内容结合
 */


// ============================================
// VTabs 标签页容器组件
// ============================================

class VTabs extends Tag {
  static _stateAttrs = ['editable', 'closable', 'dragable', 'activeIndex'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      editable: false,
      closable: true,
      dragable: false,
      activeIndex: 0,
    });

    // 3. 内部状态
    this._tabs = [];
    this._activeTab = null;
    this._tabsHeader = null;
    this._contentContainer = null;

    // 4. 设置基础 CSS 类
    this.addClass('yoya-tabs');

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup) {
      this.setup(setup);
    }
  }

  _registerStateHandlers() {
    // closable 状态处理器
    this.registerStateHandler('closable', (closable, host) => {
      if (closable) {
        host.addClass('yoya-tabs--closable');
      } else {
        host.removeClass('yoya-tabs--closable');
      }
    });
  }

  /**
   * 添加标签页
   * @param {string} id - 标签页唯一标识
   * @param {string} title - 标签页标题
   * @param {Function} content - 内容创建函数
   * @param {Object} options - 选项 { icon, closable, data }
   * @returns {VTabs} this
   */
  addTab(id, title, content, options = {}) {
    const { icon = null, closable = true, data = {} } = options;

    // 检查是否已存在
    const existingIndex = this._tabs.findIndex((t) => t.id === id);
    if (existingIndex >= 0) {
      // 已存在则激活该标签页
      this.setActiveTab(id);
      return this;
    }

    // 延迟初始化 DOM 结构
    this._ensureDom();

    // 创建标签页数据
    const tabData = {
      id,
      title,
      icon,
      closable,
      data,
      content,
      el: null,
      contentEl: null,
      _closeBtn: null,
    };

    this._tabs.push(tabData);

    // 创建标签元素
    const tabEl = this._createTabElement(tabData);
    this._tabsHeader.child(tabEl);
    tabData.el = tabEl;

    // 创建内容元素（隐藏）
    const contentEl = this._createTabContent(tabData);
    this._contentContainer.child(contentEl);
    tabData.contentEl = contentEl;

    // 如果是第一个标签页或当前没有激活的标签页，激活它
    if (this._tabs.length === 1 || !this._activeTab) {
      this.setActiveTab(id);
    }

    return this;
  }

  /**
   * 确保 DOM 结构已初始化
   */
  _ensureDom() {
    if (!this._tabsHeader) {
      // 创建标签栏容器 - IDEA 风格：紧凑、与内容无缝衔接
      this._tabsHeader = div(h => {
        h.addClass('yoya-tabs__header');
      });

      // 创建内容容器
      this._contentContainer = div(c => {
        c.addClass('yoya-tabs__content-container');
      });

      this._children = [this._tabsHeader, this._contentContainer];
    }
  }

  /**
   * 创建标签元素
   */
  _createTabElement(tabData) {
    const self = this;

    const tabEl = div(t => {
      t.addClass('yoya-tabs__tab');

      // 如果标签页不可关闭，添加标记类
      if (!tabData.closable) {
        t.addClass('yoya-tabs__tab--unclosable');
      }

      t.on('click', () => {
        self.setActiveTab(tabData.id);
      });

      // 图标
      if (tabData.icon) {
        t.child(
          span(i => {
            i.addClass('yoya-tabs__tab-icon');
            i.html(tabData.icon);
          })
        );
      }

      // 标题 - IDEA 风格：紧凑清晰
      t.child(
        span(s => {
          s.addClass('yoya-tabs__tab-title');
          s.text(tabData.title);
          tabData._titleEl = s;
        })
      );

      // 关闭按钮
      t.child(
        span(c => {
          c.addClass('yoya-tabs__tab-close');
          c.html('×');

          c.on('click', (e) => {
            e.stopPropagation();
            self.removeTab(tabData.id);
          });

          tabData._closeBtn = c;
        })
      );
    });

    return tabEl;
  }

  /**
   * 创建内容元素
   */
  _createTabContent(tabData) {
    const contentEl = div(c => {
      c.addClass('yoya-tabs__content');

      // 执行内容创建函数
      if (typeof tabData.content === 'function') {
        tabData.content(c);
      } else if (tabData.content instanceof Tag) {
        c.child(tabData.content);
      }
    });

    return contentEl;
  }

  /**
   * 设置激活的标签页
   * @param {string} id - 标签页 ID
   * @returns {VTabs} this
   */
  setActiveTab(id) {
    const tabData = this._tabs.find((t) => t.id === id);
    if (!tabData) return this;

    const previousTab = this._activeTab;

    // 更新激活状态
    this._activeTab = tabData;
    this.setState('activeIndex', this._tabs.indexOf(tabData));

    // 更新之前激活的标签样式
    if (previousTab && previousTab.el) {
      previousTab.el.removeClass('yoya-tabs__tab--active');
      // 关闭按钮恢复隐藏
      if (previousTab._closeBtn) {
        previousTab._closeBtn.style('opacity', '0');
      }
    }

    // 更新新激活的标签样式 - IDEA 风格：激活标签与内容背景一致，无缝衔接
    tabData.el.addClass('yoya-tabs__tab--active');

    // 激活标签的关闭按钮始终可见
    if (tabData._closeBtn) {
      tabData._closeBtn.style('opacity', '0.7');
    }

    // 隐藏所有内容
    this._tabs.forEach((t) => {
      if (t.contentEl) {
        t.contentEl.removeClass('yoya-tabs__content--active');
      }
    });

    // 显示当前内容
    if (tabData.contentEl) {
      tabData.contentEl.addClass('yoya-tabs__content--active');
    }

    // 派发事件
    if (this._onChange) {
      this._onChange(tabData.id, tabData);
    }

    return this;
  }

  /**
   * 移除标签页
   * @param {string} id - 标签页 ID
   * @returns {VTabs} this
   */
  removeTab(id) {
    const index = this._tabs.findIndex((t) => t.id === id);
    if (index < 0) return this;

    const tabData = this._tabs[index];
    const wasActive = this._activeTab?.id === id;

    // 从 DOM 移除 - 使用 destroy 方法标记为删除
    if (tabData.el) {
      tabData.el.destroy();
    }
    if (tabData.contentEl) {
      tabData.contentEl.destroy();
    }

    // 从数组移除
    this._tabs.splice(index, 1);

    // 如果移除的是激活的标签页，激活相邻的标签页
    if (wasActive) {
      if (this._tabs.length > 0) {
        const newIndex = Math.min(index, this._tabs.length - 1);
        this.setActiveTab(this._tabs[newIndex].id);
      } else {
        this._activeTab = null;
      }
    }

    return this;
  }

  /**
   * 更新标签页标题
   * @param {string} id - 标签页 ID
   * @param {string} title - 新标题
   * @returns {VTabs} this
   */
  updateTabTitle(id, title) {
    const tabData = this._tabs.find((t) => t.id === id);
    if (!tabData) return this;

    tabData.title = title;
    if (tabData._titleEl) {
      tabData._titleEl.text(title);
    }

    return this;
  }

  /**
   * 获取激活的标签页 ID
   * @returns {string|null}
   */
  getActiveTabId() {
    return this._activeTab?.id || null;
  }

  /**
   * 获取激活的标签页数据
   * @returns {Object|null}
   */
  getActiveTab() {
    return this._activeTab || null;
  }

  /**
   * 获取所有标签页
   * @returns {Array}
   */
  getTabs() {
    return [...this._tabs];
  }

  /**
   * 标签变化回调
   * @param {Function} fn
   * @returns {VTabs} this
   */
  onChange(fn) {
    this._onChange = fn;
    return this;
  }

  renderDom() {
    if (this._deleted) return null;

    if (!this._initialized) {
      // 使用延迟初始化
      this._ensureDom();
      this._initialized = true;
    }

    return super.renderDom();
  }
}

function vTabs(setup = null) {
  return new VTabs(setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vTabs = function (setup = null) {
  const tabs = vTabs(setup);
  this.child(tabs);
  return this;
};

/**
 * Yoya.Components - Pager 分页导航
 * 用于处理分页导航，支持页码显示、上一页/下一页、跳转等功能
 * @module Yoya.Pager
 * @example
 * // 基础用法
 * import { vPager } from '../yoya/index.js';
 *
 * vPager(p => {
 *   p.total(100);        // 总记录数
 *   p.pageSize(10);      // 每页显示数量
 *   p.current(1);        // 当前页码
 *   p.onChange((page) => {
 *     console.log('切换到第', page, '页');
 *   });
 * });
 *
 * // 简洁模式（只显示必要按钮）
 * vPager(p => {
 *   p.total(100);
 *   p.simple(true);
 *   p.onChange((page) => {});
 * });
 *
 * // 显示完整页码
 * vPager(p => {
 *   p.total(200);
 *   p.pageSize(20);
 *   p.showQuickJumper(true);  // 显示跳转输入框
 *   p.showTotal(true);        // 显示总记录数
 *   p.onChange((page) => {});
 * });
 */


// ============================================
// VPager 分页导航组件
// ============================================

class VPager extends Tag {
  static _stateAttrs = ['disabled', 'current', 'pageSize', 'total', 'totalPage', 'showQuickJumper', 'showTotal', 'simple'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      current: 1,
      pageSize: 10,
      total: 0,
      totalPage: 0,
      showQuickJumper: false,
      showTotal: false,
      simple: false,
    });

    // 3. 内部状态
    this._total = 0;
    this._pageSize = 10;
    this._current = 1;
    this._totalPage = 0;
    this._showQuickJumper = false;
    this._showTotal = false;
    this._simple = false;
    this._onChange = null;

    // 4. 设置基础 CSS 类
    this.addClass('yoya-pager');

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 构建内容
    this._buildContent();

    // 7. 执行 setup
    if (setup) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      fontSize: '11px',
      color: 'var(--yoya-pager-color, var(--yoya-text, #333))',
      userSelect: 'none',
    });
  }

  _registerStateHandlers() {
    // disabled 状态处理器
    this.registerStateHandler('disabled', (disabled, host) => {
      if (disabled) {
        host.addClass('yoya-pager--disabled');
      } else {
        host.removeClass('yoya-pager--disabled');
      }
    });

    // current 状态处理器 - 更新页码显示
    this.registerStateHandler('current', (current, host) => {
      // 检查是否超出范围
      let newCurrent = current;
      if (host._totalPage > 0 && current > host._totalPage) {
        newCurrent = host._totalPage;
      }
      if (newCurrent < 1) newCurrent = 1;

      host._current = newCurrent;
      host._renderPageNumbers();
      // 触发变化事件
      host._triggerChange(newCurrent);
    });

    // total 状态处理器 - 重新计算总页数
    this.registerStateHandler('total', (total, host) => {
      host._total = total;
      host._totalPage = Math.ceil(total / host._pageSize);
      if (host._current > host._totalPage && host._totalPage > 0) {
        host.setState('current', host._totalPage);
      }
      host._renderPageNumbers();
    });

    // pageSize 状态处理器 - 重新计算总页数
    this.registerStateHandler('pageSize', (pageSize, host) => {
      host._pageSize = pageSize;
      host._totalPage = Math.ceil(host._total / pageSize);
      host._renderPageNumbers();
    });

    // simple 状态处理器 - 重新渲染页码
    this.registerStateHandler('simple', (simple, host) => {
      host._simple = simple;
      host._renderPageNumbers();
    });
  }

  /**
   * 创建导航按钮（上一页/下一页）
   * @private
   */
  _createNavButton(direction) {
    const self = this;
    const isPrev = direction === 'prev';

    const btn = div((b) => {
      b.addClass('yoya-pager__nav');

      b.html(isPrev ? '‹' : '›');

      b.on('mouseenter', () => {
        if (!self.hasState('disabled') && !self._isNavDisabled(isPrev)) {
          b.styles({
            borderColor: 'var(--yoya-primary)',
            color: 'var(--yoya-primary)',
          });
        }
      });

      b.on('mouseleave', () => {
        if (!self.hasState('disabled') && !self._isNavDisabled(isPrev)) {
          b.styles({
            borderColor: 'var(--yoya-border)',
            color: 'var(--yoya-text-primary)',
          });
        }
      });

      b.on('click', (e) => {
        e.stopPropagation();
        if (self.hasState('disabled') || self._isNavDisabled(isPrev)) return;

        const newPage = isPrev ? self._current - 1 : self._current + 1;
        self.setState('current', newPage);
      });

      // 初始禁用状态
      if (self._isNavDisabled(isPrev)) {
        b.addClass('yoya-pager__nav--disabled');
      }
    });

    return btn;
  }

  /**
   * 创建页码按钮
   * @private
   */
  _createPageButton(pageNum) {
    const self = this;
    const isCurrent = pageNum === self._current;

    const btn = div((b) => {
      b.addClass('yoya-pager__number');
      if (isCurrent) {
        b.addClass('yoya-pager__number--active');
      }

      b.text(String(pageNum));

      if (!isCurrent) {
        b.on('mouseenter', () => {
          if (!self.hasState('disabled')) {
            b.styles({
              borderColor: 'var(--yoya-primary)',
              color: 'var(--yoya-primary)',
            });
          }
        });

        b.on('mouseleave', () => {
          if (!self.hasState('disabled')) {
            b.styles({
              borderColor: 'var(--yoya-border)',
              color: 'var(--yoya-text-primary)',
            });
          }
        });
      }

      b.on('click', (e) => {
        e.stopPropagation();
        if (self.hasState('disabled') || isCurrent) return;

        self.setState('current', pageNum);
      });
    });

    return btn;
  }

  /**
   * 创建省略号
   * @private
   */
  _createMoreButton() {
    const more = div((m) => {
      m.addClass('yoya-pager__more');
      m.text('···');
    });
    return more;
  }

  /**
   * 创建总记录数显示
   * @private
   */
  _createTotalText() {
    const total = div((t) => {
      t.addClass('yoya-pager__total');
      t.text(`共 ${this._total} 条`);
    });
    return total;
  }

  /**
   * 创建快速跳转输入框
   * @private
   */
  _createJumperInput() {
    const self = this;

    const wrapper = div((w) => {
      w.addClass('yoya-pager__jumper');

      const label = span((s) => {
        s.addClass('yoya-pager__jumper-label');
        s.text('跳至');
      });

      const input = div((i) => {
        i.addClass('yoya-pager__jumper-input');

        const inputEl = document.createElement('input');
        inputEl.type = 'number';
        inputEl.min = '1';
        inputEl.max = String(self._totalPage);
        inputEl.value = String(self._current);
        inputEl.style.cssText = `
          width: 100%;
          border: none;
          outline: none;
          text-align: center;
          font-size: 11px;
          color: var(--yoya-text, #333);
          background: transparent;
          -moz-appearance: textfield;
        `;
        inputEl.style.webkitAppearance = 'none';

        // 移除数字输入框的上下箭头
        const style = document.createElement('style');
        style.textContent = `
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `;
        inputEl.appendChild(style);

        inputEl.onkeydown = (e) => {
          if (e.key === 'Enter') {
            const page = parseInt(inputEl.value, 10);
            if (page >= 1 && page <= self._totalPage) {
              self.setState('current', page);
              self._triggerChange(page);
            }
          }
        };

        inputEl.onblur = () => {
          const page = parseInt(inputEl.value, 10);
          if (page >= 1 && page <= self._totalPage) {
            self.setState('current', page);
            self._triggerChange(page);
          } else {
            inputEl.value = String(self._current);
          }
        };

        i._el.appendChild(inputEl);
        self._jumperInput = inputEl;
      });

      const unit = span((s) => {
        s.addClass('yoya-pager__jumper-unit');
        s.text('页');
      });

      w.child(label).child(input).child(unit);
    });

    return wrapper;
  }

  /**
   * 判断导航按钮是否应该禁用
   * @private
   */
  _isNavDisabled(isPrev) {
    if (this.hasState('disabled')) return true;
    if (isPrev) return this._current <= 1;
    return this._current >= this._totalPage;
  }

  /**
   * 渲染页码数字
   * @private
   */
  _renderPageNumbers() {
    if (!this._pageContainer) return;

    // 清空现有内容
    this._pageContainer._children = [];
    if (this._pageContainer._el) {
      this._pageContainer._el.innerHTML = '';
    }

    if (this._simple) {
      // 简洁模式：只显示当前页/总页数
      const simpleText = span((s) => {
        s.addClass('yoya-pager__simple');
        s.text(`${this._current} / ${this._totalPage || 1}`);
      });
      this._pageContainer.child(simpleText);
    } else {
      // 完整模式
      const pages = this._calculateVisiblePages();

      pages.forEach((page) => {
        if (page === 'more') {
          this._pageContainer.child(this._createMoreButton());
        } else {
          this._pageContainer.child(this._createPageButton(page));
        }
      });
    }

    // 更新导航按钮状态
    this._updateNavButtons();
  }

  /**
   * 计算可见的页码
   * @private
   */
  _calculateVisiblePages() {
    const pages = [];
    const totalPage = this._totalPage || 1;
    const current = this._current;

    if (totalPage <= 7) {
      // 总页数较少，显示所有
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      // 总页数较多，智能显示
      if (current <= 4) {
        // 当前页靠近开始
        pages.push(1, 2, 3, 4, 5, 'more', totalPage);
      } else if (current >= totalPage - 3) {
        // 当前页靠近结束
        pages.push(1, 'more', totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage);
      } else {
        // 当前页在中间
        pages.push(1, 'more', current - 1, current, current + 1, 'more', totalPage);
      }
    }

    return pages;
  }

  /**
   * 更新导航按钮状态
   * @private
   */
  _updateNavButtons() {
    const prevDisabled = this._isNavDisabled(true);
    const nextDisabled = this._isNavDisabled(false);

    if (this._prevBtn) {
      if (prevDisabled) {
        this._prevBtn.addClass('yoya-pager__nav--disabled');
      } else {
        this._prevBtn.removeClass('yoya-pager__nav--disabled');
      }
    }
    if (this._nextBtn) {
      if (nextDisabled) {
        this._nextBtn.addClass('yoya-pager__nav--disabled');
      } else {
        this._nextBtn.removeClass('yoya-pager__nav--disabled');
      }
    }
  }

  /**
   * 触发变化事件
   * @private
   */
  _triggerChange(page) {
    if (this._onChange) {
      this._onChange(page, {
        current: page,
        pageSize: this._pageSize,
        total: this._total,
        totalPage: this._totalPage,
      });
    }

    // 更新跳转输入框的值
    if (this._jumperInput) {
      this._jumperInput.value = String(page);
    }
  }

  /**
   * 构建组件内容
   * @private
   */
  _buildContent() {
    // 显示总记录数
    if (this._showTotal) {
      this.child(this._createTotalText());
    }

    // 上一页按钮
    this._prevBtn = this._createNavButton('prev');
    this.child(this._prevBtn);

    // 页码数字容器
    this._pageContainer = div((c) => {
      c.addClass('yoya-pager__pages');
    });
    this.child(this._pageContainer);

    // 下一页按钮
    this._nextBtn = this._createNavButton('next');
    this.child(this._nextBtn);

    // 快速跳转
    if (this._showQuickJumper) {
      this.child(this._createJumperInput());
    }

    // 初始渲染页码
    this._renderPageNumbers();
  }

  /**
   * 设置总记录数
   * @param {number} total - 总记录数
   * @returns {VPager} this
   */
  total(total) {
    this.setState('total', total);
    return this;
  }

  /**
   * 设置每页显示数量
   * @param {number} size - 每页显示数量
   * @returns {VPager} this
   */
  pageSize(size) {
    this.setState('pageSize', size);
    return this;
  }

  /**
   * 设置当前页码
   * @param {number} page - 当前页码
   * @returns {VPager} this
   */
  current(page) {
    this.setState('current', page);
    return this;
  }

  /**
   * 设置是否显示快速跳转
   * @param {boolean} show - 是否显示
   * @returns {VPager} this
   */
  showQuickJumper(show) {
    this._showQuickJumper = show;
    this.setState('showQuickJumper', show);
    return this;
  }

  /**
   * 设置是否显示总记录数
   * @param {boolean} show - 是否显示
   * @returns {VPager} this
   */
  showTotal(show) {
    this._showTotal = show;
    this.setState('showTotal', show);
    return this;
  }

  /**
   * 设置是否为简洁模式
   * @param {boolean} simple - 是否简洁模式
   * @returns {VPager} this
   */
  simple(simple) {
    this._simple = simple;
    this.setState('simple', simple);
    return this;
  }

  /**
   * 设置禁用状态
   * @param {boolean} disabled - 是否禁用
   * @returns {VPager} this
   */
  disabled(disabled) {
    this.setState('disabled', disabled);
    return this;
  }

  /**
   * 设置变化事件回调
   * @param {Function} fn - 回调函数
   * @returns {VPager} this
   */
  onChange(fn) {
    this._onChange = fn;
    return this;
  }

  /**
   * 获取当前页码
   * @returns {number}
   */
  getCurrent() {
    return this._current;
  }

  /**
   * 获取每页显示数量
   * @returns {number}
   */
  getPageSize() {
    return this._pageSize;
  }

  /**
   * 获取总记录数
   * @returns {number}
   */
  getTotal() {
    return this._total;
  }

  /**
   * 获取总页数
   * @returns {number}
   */
  getTotalPage() {
    return this._totalPage;
  }
}

/**
 * 创建 VPager 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VPager}
 */
function vPager(setup = null) {
  return new VPager(setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vPager = function (setup = null) {
  const pager = vPager(setup);
  this.child(pager);
  return this;
};

/**
 * Yoya.Basic - Modal 弹出框组件
 * 提供完全透明的弹出框控制，内容由用户自定义
 * @module Yoya.Modal
 * @example
 * // 基础用法
 * import { vModal, vButton, toast } from '../yoya/index.js';
 *
 * const modal = vModal(m => {
 *   m.content(c => {
 *     c.h2('标题');
 *     c.p('这里是弹出框内容');
 *   });
 *   m.footer(f => {
 *     f.button('确定', b => b.onclick(() => {
 *       toast.success('已确认');
 *       modal.hide();
 *     }));
 *     f.button('取消', b => b.onclick(() => modal.hide()));
 *   });
 * });
 *
 * vButton('打开弹出框', b => b.onclick(() => modal.show()));
 */


// ============================================
// VModal 弹出框
// ============================================

/**
 * VModal 弹出框组件
 * 提供完全透明的弹出框控制，内容由用户自定义
 * @class
 * @extends Tag
 */
class VModal extends Tag {
  static _stateAttrs = ['visible', 'closable', 'maskClosable', 'centered'];

  /**
   * 创建 VModal 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this._visible = false;
    this._closable = true;
    this._maskClosable = true;
    this._centered = false;
    this._width = '500px';
    this._title = null;
    this._contentBox = null;
    this._headerBox = null;
    this._footerBox = null;
    this._maskBox = null;
    this._closeBtn = null;
    this._afterCloseCallbacks = [];

    // 3. 设置基础样式
    this.addClass('yoya-modal');
    this.style('display', 'none');
    this.style('position', 'fixed');
    this.style('top', '0');
    this.style('left', '0');
    this.style('width', '100%');
    this.style('height', '100%');
    this.style('z-index', '1000');

    // 4. 构建遮罩和内容
    this._buildMask();
    this._buildContent();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 应用 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 构建遮罩层
   * @private
   */
  _buildMask() {
    this._maskBox = div(mask => {
      mask.addClass('yoya-modal__mask');
      mask.styles({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        transition: 'opacity 0.3s ease'
      });

      // 点击遮罩关闭
      mask.on('click', () => {
        if (this._maskClosable) {
          this.hide();
        }
      });
    });
    this._children.push(this._maskBox);
  }

  /**
   * 构建弹出框内容
   * @private
   */
  _buildContent() {
    // 内容容器
    this._contentBox = div(inner => {
      inner.addClass('yoya-modal__body');
    });

    // 创建模态框内容区域
    this._contentElement = div(content => {
      content.addClass('yoya-modal__content');
      content.styles({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'auto',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        opacity: '0',
        zIndex: '1001'
      });

      // 关闭按钮
      if (this._closable) {
        content.child(this._createCloseButton());
      }

      // 内容容器
      content.child(this._contentBox);
    });

    // 添加到 modal 的 children
    this.child(this._contentElement);
  }

  /**
   * 创建关闭按钮
   * @private
   */
  _createCloseButton() {
    this._closeBtn = button(close => {
      close.addClass('yoya-modal__close');
      close.styles({
        position: 'absolute',
        top: '12px',
        right: '12px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '18px',
        lineHeight: '1',
        transition: 'color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0'
      });

      close.text('×');

      close.on('mouseenter', () => {
        close.style('color', 'var(--yoya-modal-close-hover-color, #333)');
      });
      close.on('mouseleave', () => {
        close.style('color', 'var(--yoya-modal-close-color, #999)');
      });
      close.on('click', () => this.hide());
    });
    return this._closeBtn;
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    // visible 状态处理器
    this.registerStateHandler('visible', (visible, host) => {
      // 同步内部属性
      this._visible = visible;

      if (visible) {
        host.style('display', 'block');
        // 动画：显示
        requestAnimationFrame(() => {
          if (this._contentElement) {
            this._contentElement.style('opacity', '1');
          }
        });
      } else {
        // 动画：隐藏
        if (this._contentElement) {
          this._contentElement.style('opacity', '0');
        }
        setTimeout(() => {
          if (!this._visible) {
            host.style('display', 'none');
            // 执行关闭后回调
            this._executeAfterCloseCallbacks();
          }
        }, 300);
      }
    });

    // closable 状态处理器
    this.registerStateHandler('closable', (closable, host) => {
      if (this._closeBtn) {
        this._closeBtn.style('display', closable ? 'flex' : 'none');
      }
    });

    // centered 状态处理器
    this.registerStateHandler('centered', (centered, host) => {
      if (this._contentElement) {
        if (centered) {
          this._contentElement.addClass('yoya-modal__content--centered');
        } else {
          this._contentElement.removeClass('yoya-modal__content--centered');
        }
      }
    });
  }

  /**
   * 设置弹出框宽度
   * @param {string} width - 宽度值
   * @returns {this}
   */
  width(width) {
    this._width = width;
    if (this._contentElement) {
      this._contentElement.style('width', width);
    }
    return this;
  }

  /**
   * 设置弹出框标题
   * @param {string|Function} title - 标题内容或 setup 函数
   * @returns {this}
   */
  title(title) {
    if (!this._headerBox) {
      this._headerBox = div(header => {
        header.addClass('yoya-modal__header');
        header.style('padding', '16px 20px');
        header.style('borderBottom', '1px solid #f0f0f0');
        header.style('fontWeight', '600');
        header.style('fontSize', '16px');
        header.style('lineHeight', '1.5');

        if (typeof title === 'function') {
          title(header);
        } else {
          header.text(title);
        }
      });
      // 将头部插入到内容区域的最前面
      if (this._contentBox) {
        if (this._contentBox._children) {
          this._contentBox._children.unshift(this._headerBox);
        } else {
          this._contentBox.child(this._headerBox);
        }
      }
    } else {
      if (typeof title === 'function') {
        this._headerBox.setup(title);
      } else {
        this._headerBox.text(title);
      }
    }
    return this;
  }

  /**
   * 设置弹出框内容
   * @param {Function|string} content - 内容 setup 函数或文本
   * @returns {this}
   */
  content(content) {
    if (!this._contentBox) {
      this._contentBox = div(inner => {
        inner.addClass('yoya-modal__body');
        inner.style('padding', '20px');
      });
      this._children.push(this._contentBox);

      // 如果已经有 header（比如 VConfirm 先调用了 title()），将其添加到 contentBox
      if (this._headerBox) {
        this._contentBox._children.unshift(this._headerBox);
      }
    }

    if (typeof content === 'function') {
      // 提供常用工厂方法
      const api = {
        p: (text) => {
          const el = p(text);
          this._contentBox.child(el);
          return el;
        },
        div: (setup) => {
          const el = div(setup);
          this._contentBox.child(el);
          return el;
        },
        h1: (text) => {
          const el = h1(text);
          this._contentBox.child(el);
          return el;
        },
        h2: (text) => {
          const el = h2(text);
          this._contentBox.child(el);
          return el;
        },
        h3: (text) => {
          const el = h3(text);
          this._contentBox.child(el);
          return el;
        },
        button: (setup) => {
          const el = button(setup);
          this._contentBox.child(el);
          return el;
        },
        // 导出组件工厂函数，允许用户嵌套使用
        vForm: (setup) => {
          const el = vForm(setup);
          this._contentBox.child(el);
          return el;
        },
        vInput: (setup) => {
          const el = vInput(setup);
          this._contentBox.child(el);
          return el;
        },
        vTextarea: (setup) => {
          const el = vTextarea(setup);
          this._contentBox.child(el);
          return el;
        },
      };
      content(api);
    } else if (typeof content === 'string') {
      this._contentBox.text(content);
    }
    return this;
  }

  /**
   * 设置弹出框底部
   * @param {Function} setup - 底部内容 setup 函数
   * @returns {this}
   */
  footer(setup) {
    if (!this._footerBox) {
      this._footerBox = div(footer => {
        footer.addClass('yoya-modal__footer');
        footer.style('padding', '12px 20px');
        footer.style('borderTop', '1px solid #f0f0f0');
        footer.style('display', 'flex');
        footer.style('justifyContent', 'flex-end');
        footer.style('gap', '8px');
      });
      // 将底部添加到内容区域的最后面
      if (this._contentBox && this._contentBox._children) {
        this._contentBox._children.push(this._footerBox);
      }
    }

    if (typeof setup === 'function') {
      // 提供 button、vButton 和 child 工厂方法
      const api = {
        button: (btnSetup) => {
          const btn = button(btnSetup);
          this._footerBox.child(btn);
          return btn;
        },
        vButton: (text) => {
          const btn = vButton(text);
          this._footerBox.child(btn);
          return btn;
        },
        child: (el) => {
          this._footerBox.child(el);
          return el;
        }
      };
      setup(api);
    }
    return this;
  }

  /**
   * 设置是否可关闭
   * @param {boolean} closable - 是否可关闭
   * @returns {this}
   */
  closable(closable) {
    this.setState('closable', closable);
    return this;
  }

  /**
   * 设置是否可点击遮罩关闭
   * @param {boolean} maskClosable - 是否可点击遮罩关闭
   * @returns {this}
   */
  maskClosable(maskClosable) {
    this._maskClosable = maskClosable;
    return this;
  }

  /**
   * 设置是否居中模式
   * @param {boolean} centered - 是否居中
   * @returns {this}
   */
  centered(centered) {
    this.setState('centered', centered);
    return this;
  }

  /**
   * 显示弹出框
   * @returns {this}
   */
  show() {
    // 如果没有绑定到 DOM，先绑定到 document.body
    // 检查 _boundElement 是否存在且是否在 DOM 中
    if (typeof document !== 'undefined') {
      const isInDom = this._boundElement && document.body.contains(this._boundElement);
      if (!isInDom) {
        this.bindTo(document.body);
      }
    }
    this.setState('visible', true);
    return this;
  }

  /**
   * 隐藏弹出框
   * @returns {this}
   */
  hide() {
    this.setState('visible', false);
    return this;
  }

  /**
   * 切换弹出框显示状态
   * @returns {this}
   */
  toggle() {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
    return this;
  }

  /**
   * 注册关闭后回调
   * @param {Function} callback - 回调函数
   * @returns {this}
   */
  afterClose(callback) {
    this._afterCloseCallbacks.push(callback);
    return this;
  }

  /**
   * 执行关闭后回调
   * @private
   */
  _executeAfterCloseCallbacks() {
    const callbacks = [...this._afterCloseCallbacks];
    this._afterCloseCallbacks = [];
    callbacks.forEach(cb => cb(this));
  }

  /**
   * 获取弹出框内容区域
   * @returns {Tag} 内容区域引用
   */
  getBody() {
    return this._contentBox;
  }

  /**
   * 获取弹出框头部区域
   * @returns {Tag} 头部区域引用
   */
  getHeader() {
    return this._headerBox;
  }

  /**
   * 获取弹出框底部区域
   * @returns {Tag} 底部区域引用
   */
  getFooter() {
    return this._footerBox;
  }
}

/**
 * 创建 VModal 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VModal}
 */
function vModal(setup = null) {
  return new VModal(setup);
}

// ============================================
// VConfirm 确认框（简化版弹出框）
// ============================================

/**
 * VConfirm 确认框组件
 * 用于快速创建确认对话框
 * @class
 * @extends VModal
 */
class VConfirm extends VModal {
  /**
   * 创建 VConfirm 实例
   * @param {string} [title='确认'] - 标题
   * @param {string} [content=''] - 内容
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(title = '确认', content = '', setup = null) {
    super(null);

    this._onConfirm = null;
    this._onCancel = null;
    this._confirmText = '确定';
    this._cancelText = '取消';
    this._confirmType = 'primary';

    this.title(title);
    this.content(content);
    this._buildFooter();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 构建底部按钮
   * @private
   */
  _buildFooter() {
    this.footer(f => {
      // 取消按钮
      f.button(cancelBtn => {
        cancelBtn.text(this._cancelText);
        cancelBtn.addClass('yoya-btn yoya-btn--secondary');
        cancelBtn.style('padding', '6px 16px');
        cancelBtn.style('fontSize', '14px');

        cancelBtn.on('click', () => {
          if (this._onCancel) this._onCancel();
          this.hide();
        });
      });

      // 确定按钮
      f.button(confirmBtn => {
        confirmBtn.text(this._confirmText);
        confirmBtn.addClass('yoya-btn yoya-btn--primary');
        confirmBtn.style('padding', '6px 16px');
        confirmBtn.style('fontSize', '14px');

        confirmBtn.on('click', () => {
          if (this._onConfirm) this._onConfirm();
          this.hide();
        });
      });
    });
  }

  /**
   * 设置确认按钮文本
   * @param {string} text - 按钮文本
   * @returns {this}
   */
  confirmText(text) {
    this._confirmText = text;
    return this;
  }

  /**
   * 设置取消按钮文本
   * @param {string} text - 按钮文本
   * @returns {this}
   */
  cancelText(text) {
    this._cancelText = text;
    return this;
  }

  /**
   * 设置确认回调
   * @param {Function} fn - 回调函数
   * @returns {this}
   */
  onConfirm(fn) {
    this._onConfirm = fn;
    return this;
  }

  /**
   * 设置取消回调
   * @param {Function} fn - 回调函数
   * @returns {this}
   */
  onCancel(fn) {
    this._onCancel = fn;
    return this;
  }
}

/**
 * 创建 VConfirm 实例
 * @param {string} [title='确认'] - 标题
 * @param {string} [content=''] - 内容
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VConfirm}
 */
function vConfirm(title = '确认', content = '', setup = null) {
  return new VConfirm(title, content, setup);
}

// ============================================
// 便捷方法
// ============================================

/**
 * 快速创建确认框
 * @param {string} content - 确认内容
 * @param {Function} onConfirm - 确认回调
 * @param {Function} [onCancel] - 取消回调
 * @returns {VConfirm}
 */
function confirm(content, onConfirm, onCancel) {
  const modal = vConfirm('确认', content);
  if (onConfirm) modal.onConfirm(onConfirm);
  if (onCancel) modal.onCancel(onCancel);
  modal.show();
  return modal;
}

// ============================================
// CSS 样式
// ============================================

// 注入全局样式
if (typeof document !== 'undefined') {
  const styleId = 'yoya-modal-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
      .yoya-modal {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      .yoya-modal__mask {
        background-color: var(--yoya-modal-mask-bg, rgba(0, 0, 0, 0.45));
        backdrop-filter: var(--yoya-modal-mask-backdrop-filter, blur(4px));
        animation: yoya-modal-fade-in var(--yoya-modal-animation-duration, 0.3s) var(--yoya-modal-animation-timing, ease);
      }

      .yoya-modal__content {
        background-color: var(--yoya-modal-bg, white);
        border-radius: var(--yoya-modal-radius, 8px);
        box-shadow: var(--yoya-modal-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
        min-width: var(--yoya-modal-min-width, 300px);
        max-width: var(--yoya-modal-max-width, 90%);
        max-height: var(--yoya-modal-max-height, 90vh);
        animation: yoya-modal-zoom-in var(--yoya-modal-animation-duration, 0.3s) var(--yoya-modal-animation-timing, ease);
      }

      .yoya-modal__content--centered {
        text-align: center;
      }

      .yoya-modal__header {
        padding: var(--yoya-modal-header-padding, 16px 20px);
        border-bottom: var(--yoya-modal-header-border, 1px solid #e0e0e0);
        font-weight: var(--yoya-modal-header-font-weight, 600);
        font-size: var(--yoya-modal-header-font-size, 16px);
        line-height: var(--yoya-modal-header-line-height, 1.5);
        color: var(--yoya-modal-header-color, #333);
      }

      .yoya-modal__body {
        padding: var(--yoya-modal-body-padding, 20px);
        color: var(--yoya-modal-body-color, #333);
        font-size: var(--yoya-modal-body-font-size, 14px);
        line-height: var(--yoya-modal-body-line-height, 1.5);
      }

      .yoya-modal__footer {
        padding: var(--yoya-modal-footer-padding, 12px 20px);
        border-top: var(--yoya-modal-footer-border, 1px solid #e0e0e0);
        display: flex;
        justify-content: var(--yoya-modal-footer-justify, flex-end);
        gap: var(--yoya-modal-footer-gap, 8px);
      }

      .yoya-modal__close {
        font-family: inherit;
        width: var(--yoya-modal-close-size, 24px);
        height: var(--yoya-modal-close-size, 24px);
        color: var(--yoya-modal-close-color, #999);
        border-radius: var(--yoya-modal-close-radius, 4px);
      }

      .yoya-modal__close:hover {
        background-color: var(--yoya-modal-close-hover-bg, rgba(0, 0, 0, 0.05));
        color: var(--yoya-modal-close-hover-color, #333);
      }

      @keyframes yoya-modal-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes yoya-modal-zoom-in {
        from {
          transform: translate(-50%, -50%) scale(0.95);
          opacity: 0;
        }
        to {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }

      .yoya-modal.hiding .yoya-modal__content {
        animation: yoya-modal-zoom-out var(--yoya-modal-animation-duration, 0.3s) var(--yoya-modal-animation-timing, ease) forwards;
      }

      .yoya-modal.hiding .yoya-modal__mask {
        animation: yoya-modal-fade-out var(--yoya-modal-animation-duration, 0.3s) var(--yoya-modal-animation-timing, ease) forwards;
      }

      @keyframes yoya-modal-zoom-out {
        from {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        to {
          transform: translate(-50%, -50%) scale(0.95);
          opacity: 0;
        }
      }

      @keyframes yoya-modal-fade-out {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }
}

/**
 * Yoya.Theme - 主题管理系统 (CSS-based)
 * 通过加载 CSS 文件和切换 data-attribute 来管理主题
 */


// 当前主题和 mode
let currentThemeId = 'islands';
let currentMode = 'auto'; // 'auto' | 'light' | 'dark'

// localStorage 键名
const STORAGE_KEY_THEME = 'yoya-theme';
const STORAGE_KEY_MODE = 'yoya-mode';

// 已加载的 CSS 文件引用
let loadedLinkElement = null;

/**
 * 获取当前 mode（解析 auto）
 */
function getEffectiveMode() {
  if (currentMode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return currentMode;
}

/**
 * 监听系统主题变化
 */
function setupAutoThemeListener() {
  if (typeof window === 'undefined') return;

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentMode === 'auto') {
      const effectiveMode = e.matches ? 'dark' : 'light';
      setThemeAttribute(effectiveMode);
      dispatchThemeChanged(effectiveMode);
    }
  });
}

/**
 * 在 HTML 元素上设置主题属性
 */
function setThemeAttribute(mode) {
  const html = document.documentElement;
  const effectiveMode = mode || getEffectiveMode();

  if (currentThemeId === 'islands') {
    if (effectiveMode === 'dark') {
      html.setAttribute('data-theme', 'islands-dark');
    } else {
      html.setAttribute('data-theme', 'islands-light');
    }
  } else {
    html.setAttribute('data-theme', `${currentThemeId}-${effectiveMode}`);
  }
}

/**
 * 加载主题 CSS 文件
 */
function loadThemeCSS(themeId, mode) {
  // 移除旧的 link 元素
  if (loadedLinkElement) {
    loadedLinkElement.remove();
  }

  const effectiveMode = mode || getEffectiveMode();

  // 创建新的 link 元素
  const link = document.createElement('link');
  link.rel = 'stylesheet';

  // Islands 主题使用内置的 CSS 文件
  if (themeId === 'islands') {
    // 使用 base.css，它包含了 :root 和 [data-theme] 选择器
    const basePath = getThemeBasePath();
    link.href = `${basePath}/css/base.css`;
    link.dataset.theme = 'islands';
  } else {
    // 其他主题可以自定义 CSS 路径
    const themeConfig = getThemeConfig(themeId);
    if (themeConfig && themeConfig.cssPath) {
      link.href = themeConfig.cssPath;
    } else {
      // 默认回退到 islands
      const basePath = getThemeBasePath();
      link.href = `${basePath}/css/base.css`;
    }
    link.dataset.theme = themeId;
  }

  // 加载完成回调
  link.onload = () => {
    console.log(`Theme CSS loaded: ${themeId}-${effectiveMode}`);
  };

  link.onerror = () => {
    console.error(`Failed to load theme CSS: ${themeId}`);
  };

  // 添加到文档
  document.head.appendChild(link);
  loadedLinkElement = link;
}

/**
 * 获取主题配置
 */
const themeConfigs = new Map();

function registerThemeConfig(themeId, config) {
  themeConfigs.set(themeId, config);
}

function getThemeConfig(themeId) {
  return themeConfigs.get(themeId);
}

/**
 * 从 localStorage 读取主题配置
 */
function loadThemeFromStorage() {
  try {
    return localStorage.getItem(STORAGE_KEY_THEME);
  } catch (e) {
    return null;
  }
}

/**
 * 从 localStorage 读取 mode 配置
 */
function loadModeFromStorage() {
  try {
    return localStorage.getItem(STORAGE_KEY_MODE);
  } catch (e) {
    return null;
  }
}

/**
 * 保存主题配置到 localStorage
 */
function saveThemeToStorage(themeId) {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, themeId);
  } catch (e) {
    // 忽略存储错误
  }
}

/**
 * 保存 mode 配置到 localStorage
 */
function saveModeToStorage(mode) {
  try {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  } catch (e) {
    // 忽略存储错误
  }
}

/**
 * 派发主题变化事件
 */
function dispatchThemeChanged(effectiveMode) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent('theme-changed', {
    detail: {
      themeId: currentThemeId,
      mode: effectiveMode,
      currentMode
    }
  }));
}

/**
 * 初始化主题
 * @param {Object} options - 配置选项
 * @param {string} options.defaultTheme - 默认主题 ID (如 'islands')
 * @param {string} options.defaultMode - 默认 mode (如 'auto' | 'light' | 'dark')
 * @param {Function} options.onLoaded - 主题加载完成的回调
 */
function initTheme(options = {}) {
  const {
    defaultTheme = 'islands',
    defaultMode = 'auto',
    onLoaded = null,
  } = options;

  // 从 localStorage 读取主题和 mode
  const savedTheme = loadThemeFromStorage();
  const savedMode = loadModeFromStorage();

  currentThemeId = savedTheme || defaultTheme;
  currentMode = savedMode || defaultMode;

  // 获取实际生效的 mode
  const effectiveMode = getEffectiveMode();

  // 设置 data-theme 属性
  setThemeAttribute(effectiveMode);

  // 加载主题 CSS
  loadThemeCSS(currentThemeId, effectiveMode);

  // 设置 auto mode 监听器
  if (currentMode === 'auto') {
    setupAutoThemeListener();
  }

  // 调用回调
  if (typeof onLoaded === 'function') {
    onLoaded({ themeId: currentThemeId, mode: effectiveMode });
  }
}

/**
 * 切换主题
 * @param {string} themeId - 主题 ID
 */
function switchTheme(themeId) {
  currentThemeId = themeId;
  saveThemeToStorage(themeId);

  const effectiveMode = getEffectiveMode();
  setThemeAttribute(effectiveMode);
  loadThemeCSS(themeId, effectiveMode);
  dispatchThemeChanged(effectiveMode);

  return true;
}

/**
 * 设置 mode (auto|light|dark)
 * @param {string} mode - mode 值
 */
function setThemeMode(mode) {
  currentMode = mode;
  saveModeToStorage(mode);

  const effectiveMode = getEffectiveMode();
  setThemeAttribute(effectiveMode);
  dispatchThemeChanged(effectiveMode);

  // 设置 auto mode 监听器
  if (mode === 'auto') {
    setupAutoThemeListener();
  }
}

/**
 * 获取当前 mode
 * @returns {string} 'auto' | 'light' | 'dark'
 */
function getThemeMode() {
  return currentMode;
}

/**
 * 获取当前生效的 mode
 * @returns {string} 'light' | 'dark'
 */
function getEffectiveThemeMode() {
  return getEffectiveMode();
}

/**
 * 获取当前主题 ID
 * @returns {string|null}
 */
function getCurrentThemeId() {
  return currentThemeId;
}

// ========================================
// 主题 CSS 文件路径导出（用于自定义主题）
// ========================================

/**
 * 获取主题基础路径
 * @returns {string} 主题 CSS 文件的基础路径
 */
function getThemeBasePath() {
  const modulePath = import.meta.url;
  const baseUrl = modulePath.substring(0, modulePath.lastIndexOf('/'));
  return `${baseUrl}`;
}

/**
 * 获取主题 CSS 文件路径
 * @param {string} cssName - CSS 文件名称（不带扩展名）
 * @returns {string} 完整的 CSS 文件路径
 */
function getThemeCssPath(cssName) {
  const basePath = getThemeBasePath();
  return `${basePath}/css/${cssName}.css`;
}

/**
 * 获取组件 CSS 文件路径
 * @param {string} componentName - 组件名称
 * @returns {string} 组件 CSS 文件路径
 */
function getComponentCssPath(componentName) {
  const basePath = getThemeBasePath();
  return `${basePath}/css/components/${componentName}.css`;
}

/**
 * 组件 CSS 文件列表
 */
const COMPONENT_CSS_FILES = {
  base: 'css/base.css',
  button: 'css/components/button.css',
  card: 'css/components/card.css',
  menu: 'css/components/menu.css',
  form: 'css/components/form.css',
  code: 'css/components/code.css',
  detail: 'css/components/detail.css',
  pager: 'css/components/pager.css',
  tabs: 'css/components/tabs.css',
  switchers: 'css/components/switchers.css',
  body: 'css/components/body.css',
  table: 'css/components/table.css',
  message: 'css/components/message.css',
  box: 'css/components/box.css',
  field: 'css/components/field.css',
  index: 'css/components/index.css',
};

/**
 * 手动加载 CSS 文件到文档
 * @param {string} cssPath - CSS 文件路径
 * @param {Object} options - 选项
 * @param {string} options.themeId - 主题 ID
 * @param {boolean} options.replaceExisting - 是否替换现有的主题 CSS
 * @returns {HTMLLinkElement} 创建的 link 元素
 */
function loadCssFile(cssPath, options = {}) {
  const {
    themeId = 'custom',
    replaceExisting = true
  } = options;

  // 移除旧的 link 元素
  if (replaceExisting && loadedLinkElement) {
    loadedLinkElement.remove();
  }

  // 创建新的 link 元素
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssPath;
  link.dataset.theme = themeId;

  // 加载完成回调
  link.onload = () => {
    console.log(`CSS loaded: ${cssPath}`);
  };

  link.onerror = () => {
    console.error(`Failed to load CSS: ${cssPath}`);
  };

  // 添加到文档
  document.head.appendChild(link);

  if (replaceExisting) {
    loadedLinkElement = link;
  }

  return link;
}

/**
 * 加载多个组件 CSS 文件
 * @param {string[]} componentNames - 组件名称数组
 * @returns {Promise<HTMLLinkElement[]>} 加载的 link 元素数组
 */
function loadComponentCssFiles(componentNames) {
  return Promise.all(componentNames.map(name => {
    const cssPath = getComponentCssPath(name);
    return loadCssFile(cssPath, { replaceExisting: false });
  }));
}

/**
 * Yoya.I18n - 国际化模块
 * 提供翻译、语言切换、占位符替换等功能
 * @module Yoya.I18n
 * @example
 * // 注册语言包
 * import { registerLanguage, setLanguage, t } from './yoya/i18n.js';
 *
 * registerLanguage('zh-CN', {
 *   common: {
 *     ok: '确定',
 *     cancel: '取消'
 *   },
 *   greeting: '你好，{name}！'
 * });
 *
 * registerLanguage('en-US', {
 *   common: {
 *     ok: 'OK',
 *     cancel: 'Cancel'
 *   },
 *   greeting: 'Hello, {name}!'
 * });
 *
 * // 使用翻译
 * t('common.ok'); // '确定'
 * t('greeting', { name: '世界' }); // '你好，世界！'
 *
 * // 切换语言
 * setLanguage('en-US');
 * t('common.ok'); // 'OK'
 */

// 当前语言
let currentLanguage = 'zh-CN';

// 语言包注册表
const languagePacks = new Map();

// 默认语言
const defaultLanguage = 'zh-CN';

// localStorage 键名
const STORAGE_KEY_LANGUAGE = 'yoya-language';

/**
 * 注册语言包
 * @param {string} lang - 语言代码 (如 'zh-CN', 'en-US')
 * @param {Object} messages - 翻译消息对象
 * @example
 * registerLanguage('zh-CN', {
 *   common: { ok: '确定', cancel: '取消' },
 *   greeting: '你好，{name}！'
 * });
 */
function registerLanguage(lang, messages) {
  if (!languagePacks.has(lang)) {
    languagePacks.set(lang, {});
  }
  const pack = languagePacks.get(lang);
  // 合并消息
  Object.assign(pack, messages);
}

/**
 * 设置当前语言
 * @param {string} lang - 语言代码
 * @param {boolean} [save=true] - 是否保存到 localStorage
 * @example
 * setLanguage('en-US');
 * setLanguage('zh-CN', false); // 不保存
 */
function setLanguage(lang, save = true) {
  currentLanguage = lang;
  if (save) {
    saveLanguageToStorage(lang);
  }
  // 派发语言切换事件
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: lang } }));
  }
}

/**
 * 获取当前语言
 * @returns {string} 当前语言代码
 */
function getLanguage() {
  return currentLanguage;
}

/**
 * 从 localStorage 读取语言设置
 * @returns {string|null} 语言代码或 null
 */
function loadLanguageFromStorage() {
  try {
    return localStorage.getItem(STORAGE_KEY_LANGUAGE);
  } catch (e) {
    return null;
  }
}

/**
 * 保存语言设置到 localStorage
 * @param {string} lang - 语言代码
 */
function saveLanguageToStorage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
  } catch (e) {
    // 忽略存储错误
  }
}

/**
 * 替换字符串中的占位符
 * @param {string} str - 包含占位符的字符串
 * @param {Object} [params={}] - 参数对象
 * @returns {string} 替换后的字符串
 * @private
 */
function replacePlaceholders(str, params = {}) {
  if (!params || typeof params !== 'object') {
    return str;
  }

  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return params.hasOwnProperty(key) ? params[key] : match;
  });
}

/**
 * 获取嵌套的翻译键值
 * @param {Object} obj - 消息对象
 * @param {string} key - 嵌套键 (如 'common.ok')
 * @returns {string|undefined} 翻译值或 undefined
 * @private
 */
function getNestedValue(obj, key) {
  const keys = key.split('.');
  let value = obj;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * 翻译函数
 * @param {string} key - 翻译键
 * @param {string} [defaultValue=''] - 默认值（当翻译不存在时使用）
 * @param {Object} [params={}] - 占位符参数
 * @returns {string} 翻译后的字符串
 * @example
 * t('common.ok'); // '确定'
 * t('greeting', 'Hello', { name: '世界' }); // '你好，世界！'
 * t('missing.key', '默认文本'); // 返回 '默认文本'
 */
function t(key, defaultValue = '', params = {}) {
  // 获取当前语言的翻译
  const pack = languagePacks.get(currentLanguage);
  let message = pack ? getNestedValue(pack, key) : undefined;

  // 如果当前语言没有，尝试默认语言
  if (message === undefined && currentLanguage !== defaultLanguage) {
    const defaultPack = languagePacks.get(defaultLanguage);
    if (defaultPack) {
      message = getNestedValue(defaultPack, key);
    }
  }

  // 使用默认值或键本身
  if (message === undefined) {
    message = defaultValue || key;
  }

  // 替换占位符
  return replacePlaceholders(message, params);
}

/**
 * 带默认值和参数的翻译函数
 * @param {string} key - 翻译键
 * @param {Object} [params={}] - 占位符参数
 * @returns {string} 翻译后的字符串
 */
function translate(key, params = {}) {
  return t(key, key, params);
}

/**
 * 初始化 i18n
 * @param {Object} [options={}] - 配置选项
 * @param {string} [options.defaultLanguage='zh-CN'] - 默认语言
 * @param {Map} [options.languages=new Map()] - 语言包 Map
 * @param {boolean} [options.autoLoad=true] - 是否自动从 localStorage 加载语言
 * @example
 * initI18n({
 *   defaultLanguage: 'en-US',
 *   languages: new Map([
 *     ['zh-CN', { common: { ok: '确定' } }],
 *     ['en-US', { common: { ok: 'OK' } }]
 *   ]),
 *   autoLoad: true
 * });
 */
function initI18n(options = {}) {
  const {
    defaultLanguage: defLang = 'zh-CN',
    languages = new Map(),
    autoLoad = true,
  } = options;

  // 注册语言包
  for (const [lang, messages] of languages.entries()) {
    registerLanguage(lang, messages);
  }

  // 从 localStorage 加载语言
  if (autoLoad) {
    const savedLang = loadLanguageFromStorage();
    if (savedLang && languagePacks.has(savedLang)) {
      setLanguage(savedLang, false);
    } else {
      setLanguage(defLang, false);
    }
  } else {
    setLanguage(defLang, false);
  }

  // 扩展 String 原型
  extendStringPrototype();
}

/**
 * 扩展 String 原型，添加 .t() 方法
 * @private
 */
function extendStringPrototype() {
  // 避免重复扩展
  if (String.prototype._i18nExtended) {
    return;
  }

  String.prototype._i18nExtended = true;

  /**
   * String 扩展方法：翻译
   * @param {string} key - 翻译键
   * @param {Object} [params={}] - 占位符参数
   * @returns {string} 翻译后的字符串
   * @this {string} 字符串本身作为默认值
   */
  String.prototype.t = function (key, params = {}) {
    return t(key, this, params);
  };

  /**
   * String 扩展方法：带参数的翻译
   * @param {Object} [params={}] - 占位符参数
   * @returns {string} 翻译后的字符串
   * @this {string} 字符串本身作为键和默认值
   */
  String.prototype.tr = function (params = {}) {
    // 使用字符串本身作为键和默认值
    return t(this, this, params);
  };
}

/**
 * 创建翻译文本节点
 * 用于在 DOM 中直接添加翻译文本
 * @param {string} key - 翻译键
 * @param {string} [defaultValue=''] - 默认值
 * @param {Object} [params={}] - 占位符参数
 * @returns {string} 翻译后的文本
 */
function createText(key, defaultValue = '', params = {}) {
  return t(key, defaultValue, params);
}

/**
 * 获取所有支持的语言
 * @returns {string[]} 支持的语言代码列表
 */
function getSupportedLanguages() {
  return Array.from(languagePacks.keys());
}

/**
 * 检查语言包是否存在
 * @param {string} lang - 语言代码
 * @returns {boolean} 语言包是否存在
 */
function hasLanguage(lang) {
  return languagePacks.has(lang);
}

/**
 * Yoya.Basic - Helper Utilities
 * 工具函数：安全的动态加载组件
 * @module Yoya.Helper
 */


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
        color: 'var(--yoya-error, #dc3545)',
        padding: '12px',
        background: 'var(--yoya-bg-error, #fff5f5)',
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

/**
 * Yoya.Icons - SVG 图标库
 * 提供常用图标的函数式创建方法
 * 使用 PascalCase 命名，直接返回 SVG 元素
 *
 * 所有图标都基于 svg.js 的 SvgTag 基类构建，遵循项目组件开发规范
 */


/**
 * 创建基础图标配置
 * 返回默认的 SVG 属性配置对象
 */
function defaultIconProps(props = {}) {
  return {
    width: props.width || '24',
    height: props.height || '24',
    viewBox: props.viewBox || '0 0 24 24',
    fill: 'none',
    stroke: props.stroke || 'currentColor',
    strokeWidth: props['stroke-width'] || '2',
    strokeLinecap: props['stroke-linecap'] || 'round',
    strokeLinejoin: props['stroke-linejoin'] || 'round',
    ...props,
  };
}

/**
 * 创建图标
 * 使用 svg 工厂函数创建 SVG 容器，内部包含 path 路径
 * @param {string} d - 路径数据
 * @param {Object} props - 属性配置
 * @returns {SvgTag} SVG 元素（svg 容器）
 */
function createIcon(d, props = {}) {
  const attrs = defaultIconProps(props);

  // 创建 SVG 容器
  return svg(setup => {
    setup.attr('width', attrs.width);
    setup.attr('height', attrs.height);
    setup.attr('viewBox', attrs.viewBox);
    setup.style('display', 'inline-block');
    setup.style('vertical-align', 'middle');

    // 创建 path 路径作为子元素
    setup.path(pathSetup => {
      pathSetup.d(attrs.d || d);
      pathSetup.attr('fill', attrs.fill);
      pathSetup.attr('stroke', attrs.stroke);
      pathSetup.attr('stroke-width', attrs.strokeWidth);
      pathSetup.attr('stroke-linecap', attrs.strokeLinecap);
      pathSetup.attr('stroke-linejoin', attrs.strokeLinejoin);

      // 应用额外的属性到 path
      for (const [key, value] of Object.entries(props)) {
        if (!['d', 'width', 'height', 'viewBox'].includes(key)) {
          pathSetup.attr(key, value);
        }
      }
    });
  });
}

// ============= 导航类图标 =============

function HomeIcon(props = {}) {
  return createIcon('M 3 9 l 9 -7 l 9 7 v 11 a 2 2 0 0 1 -2 2 h -14 a 2 2 0 0 1 -2 -2 z', props);
}

function DashboardIcon(props = {}) {
  createIcon('', props);
  // 需要在 svg.js 中支持多路径，这里简化为单路径图标
  return createIcon('M 3 3 h 8 v 8 h -8 Z M 13 3 h 8 v 8 h -8 Z M 3 13 h 8 v 8 h -8 Z M 13 13 h 8 v 8 h -8 Z', props);
}

function MenuIcon(props = {}) {
  return createIcon('M 3 6 h 18 M 3 12 h 18 M 3 18 h 18', props);
}

function ChevronDownIcon(props = {}) {
  return createIcon('M 6 9 l 6 6 l 6 -6', props);
}

function ChevronUpIcon(props = {}) {
  return createIcon('M 18 15 l -6 -6 l -6 6', props);
}

function ChevronLeftIcon(props = {}) {
  return createIcon('M 15 6 l -6 6 l 6 6', props);
}

function ChevronRightIcon(props = {}) {
  return createIcon('M 9 6 l 6 6 l -6 6', props);
}

function ArrowLeftIcon(props = {}) {
  return createIcon('M 19 12 h -16 M 9 6 l -6 6 l 6 6', props);
}

function ArrowRightIcon(props = {}) {
  return createIcon('M 5 12 h 16 M 15 6 l 6 6 l -6 6', props);
}

function CloseIcon(props = {}) {
  return createIcon('M 18 6 L 6 18 M 6 6 l 12 12', props);
}

function PlusIcon(props = {}) {
  return createIcon('M 12 5 v 14 M 5 12 h 14', props);
}

function MinusIcon(props = {}) {
  return createIcon('M 5 12 h 14', props);
}

// ============= 用户类图标 =============

function UserIcon(props = {}) {
  return createIcon('M 20 21 v -2 a 4 4 0 0 0 -4 -4 h -8 a 4 4 0 0 0 -4 4 v 2 M 12 3 a 4 4 0 1 0 0 8 a 4 4 0 1 0 0 -8', props);
}

function UsersIcon(props = {}) {
  return createIcon('M 17 21 v -2 a 4 4 0 0 0 -4 -4 h -1 M 16 3.13 a 4 4 0 0 1 0 7.75 M 23 21 v -2 a 4 4 0 0 0 -3 -3.87 M 20 9.88 a 4 4 0 0 1 0 7.75 M 7 21 v -2 a 4 4 0 0 1 -4 -4 v 0 a 4 4 0 0 1 1.47 -3.06 M 12 7 a 4 4 0 1 0 0 8 a 4 4 0 1 0 0 -8', props);
}

function SettingsIcon(props = {}) {
  return createIcon('M 12 15 a 3 3 0 1 0 0 -6 a 3 3 0 1 0 0 6 z M 19.4 15 a 1.65 1.65 0 0 0 .33 1.82 l .06 .06 a 2 2 0 1 1 -2.83 2.83 l -.06 -.06 a 1.65 1.65 0 0 0 -1.82 -.33 a 1.65 1.65 0 0 0 -1 1.51 v .17 a 2 2 0 1 1 -4 0 v -.17 a 1.65 1.65 0 0 0 -1 -1.51 a 1.65 1.65 0 0 0 -1.82 .33 l -.06 .06 a 2 2 0 1 1 -2.83 -2.83 l .06 -.06 a 1.65 1.65 0 0 0 .33 -1.82 a 1.65 1.65 0 0 0 -1.51 -1 h -.17 a 2 2 0 1 1 0 -4 h .17 a 1.65 1.65 0 0 0 1.51 -1 a 1.65 1.65 0 0 0 -.33 -1.82 l -.06 -.06 a 2 2 0 1 1 2.83 -2.83 l .06 .06 a 1.65 1.65 0 0 0 1.82 -.33 h .17 a 1.65 1.65 0 0 0 1 -1.51 v -.17 a 2 2 0 1 1 4 0 v .17 a 1.65 1.65 0 0 0 1 1.51 a 1.65 1.65 0 0 0 1.82 -.33 l .06 -.06 a 2 2 0 1 1 2.83 2.83 l -.06 .06 a 1.65 1.65 0 0 0 -.33 1.82 v .17 a 1.65 1.65 0 0 0 1.51 1 h .17 a 2 2 0 1 1 0 4 h -.17 a 1.65 1.65 0 0 0 -1.51 1', props);
}

function ProfileIcon(props = {}) {
  return createIcon('M 20 21 v -2 a 4 4 0 0 0 -4 -4 h -8 a 4 4 0 0 0 -4 4 v 2 M 12 3 a 4 4 0 1 0 0 8 a 4 4 0 1 0 0 -8 M 3 7 h 18', props);
}

function LoginIcon(props = {}) {
  return createIcon('M 15 3 h 4 a 2 2 0 0 1 2 2 v 14 a 2 2 0 0 1 -2 2 h -4 M 10 17 l 5 -5 l -5 -5 M 15 12 h -9', props);
}

function LogoutIcon(props = {}) {
  return createIcon('M 9 21 h -4 a 2 2 0 0 1 -2 -2 v -14 a 2 2 0 0 1 2 -2 h 4 M 16 17 l 5 -5 l -5 -5 M 21 12 h -9', props);
}

// ============= 操作类图标 =============

function SearchIcon(props = {}) {
  return createIcon('M 11 19 a 8 8 0 1 0 0 -16 a 8 8 0 1 0 0 16 M 21 21 l -4.35 -4.35', props);
}

function EditIcon(props = {}) {
  return createIcon('M 11 4 h 4 a 2 2 0 0 1 2 2 v 14 a 2 2 0 0 1 -2 2 h -4 M 11 4 l -6 6 v 8 h 12 v -8 l -6 -6 M 11 4 v 6', props);
}

function DeleteIcon(props = {}) {
  return createIcon('M 3 6 h 18 M 19 6 v 14 a 2 2 0 0 1 -2 2 h -10 a 2 2 0 0 1 -2 -2 v -14 M 8 6 v -4 h 8 v 4', props);
}

function SaveIcon(props = {}) {
  return createIcon('M 19 21 h -14 a 2 2 0 0 1 -2 -2 v -14 a 2 2 0 0 1 2 -2 h 11.586 a 2 2 0 0 1 1.414 .586 l 4.414 4.414 a 2 2 0 0 1 .586 1.414 v 11.586 a 2 2 0 0 1 -2 2 M 17 21 v -8 h -10 v 8 M 7 3 v 5 h 8 v -5', props);
}

function UploadIcon(props = {}) {
  return createIcon('M 21 15 v 4 a 2 2 0 0 1 -2 2 h -14 a 2 2 0 0 1 -2 -2 v -4 M 17 8 l -5 -5 l -5 5 M 12 3 v 12', props);
}

function DownloadIcon(props = {}) {
  return createIcon('M 21 15 v 4 a 2 2 0 0 1 -2 2 h -14 a 2 2 0 0 1 -2 -2 v -4 M 7 10 l 5 5 l 5 -5 M 12 15 v -12', props);
}

function CopyIcon(props = {}) {
  return createIcon('M 8 4 h 10 a 2 2 0 0 1 2 2 v 14 a 2 2 0 0 1 -2 2 h -10 a 2 2 0 0 1 -2 -2 v -14 a 2 2 0 0 1 2 -2 M 8 4 v 10 a 2 2 0 0 1 -2 2 h -4 a 2 2 0 0 1 -2 -2 v -14 a 2 2 0 0 1 2 -2 h 4', props);
}

function CheckIcon(props = {}) {
  return createIcon('M 20 6 l -11 11 l -6 -6', props);
}

function XIcon(props = {}) {
  return createIcon('M 18 6 l -12 12 M 6 6 l 12 12', props);
}

// ============= 文件类图标 =============

function FileIcon(props = {}) {
  return createIcon('M 14 2 h -8 a 2 2 0 0 0 -2 2 v 16 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -10 l -6 -6 z M 14 2 v 6 h 6', props);
}

function FolderIcon(props = {}) {
  return createIcon('M 22 19 a 2 2 0 0 1 -2 2 h -16 a 2 2 0 0 1 -2 -2 v -14 a 2 2 0 0 1 2 -2 h 8 l 2 2 h 8 a 2 2 0 0 1 2 2 v 2 z', props);
}

function FileTextIcon(props = {}) {
  return createIcon('M 14 2 h -8 a 2 2 0 0 0 -2 2 v 16 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -10 l -6 -6 z M 14 2 v 6 h 6 M 10 13 v 6 M 14 13 v 6 M 18 13 v 6', props);
}

function ImageIcon(props = {}) {
  return createIcon('M 21 19 v -14 a 2 2 0 0 0 -2 -2 h -14 a 2 2 0 0 0 -2 2 v 14 a 2 2 0 0 0 2 2 h 14 a 2 2 0 0 0 2 -2 z M 8.5 13.5 l 2.5 3 l 3.5 -4.5 l 4.5 6 h -13 z M 8.5 10.5 a 2.5 2.5 0 1 0 0 -5 a 2.5 2.5 0 1 0 0 5', props);
}

function VideoIcon(props = {}) {
  return createIcon('M 23 7 l -7 5 l 7 5 v -10 z M 3 5 h 13 a 2 2 0 0 1 2 2 v 10 a 2 2 0 0 1 -2 2 h -13 a 2 2 0 0 1 -2 -2 v -10 a 2 2 0 0 1 2 -2', props);
}

// ============= 通知类图标 =============

function BellIcon(props = {}) {
  return createIcon('M 18 8 a 6 6 0 1 0 -12 0 c 0 7 -3 9 -3 9 h 18 s -3 -2 -3 -9 M 13.73 21 a 2 2 0 0 1 -3.46 0', props);
}

function AlertCircleIcon(props = {}) {
  return createIcon('M 12 22 a 10 10 0 1 0 0 -20 a 10 10 0 1 0 0 20 M 12 8 v 8 M 12 16 h .01', props);
}

function AlertTriangleIcon(props = {}) {
  return createIcon('M 10.29 3.86 l -8.48 14.71 a 2 2 0 0 0 1.71 3 h 16.96 a 2 2 0 0 0 1.71 -3 l -8.48 -14.71 a 2 2 0 0 0 -3.46 0 M 12 9 v 4 M 12 17 h .01', props);
}

function InfoIcon(props = {}) {
  return createIcon('M 12 22 a 10 10 0 1 0 0 -20 a 10 10 0 1 0 0 20 M 12 16 v -4 M 12 8 h .01', props);
}

function CheckCircleIcon(props = {}) {
  return createIcon('M 22 11.08 v 1 a 10 10 0 1 1 -5.93 -9.14 M 22 4 l -10 10 l -5 -5', props);
}

function XCircleIcon(props = {}) {
  return createIcon('M 22 11.08 v 1 a 10 10 0 1 1 -5.93 -9.14 M 22 4 l -10 10 l -5 -5 M 18 6 l -12 12 M 6 6 l 12 12', props);
}

// ============= 通讯类图标 =============

function MailIcon(props = {}) {
  return createIcon('M 4 4 h 16 a 2 2 0 0 1 2 2 v 12 a 2 2 0 0 1 -2 2 h -16 a 2 2 0 0 1 -2 -2 v -12 a 2 2 0 0 1 2 -2 z M 22 6 l -10 7 l -10 -7', props);
}

function PhoneIcon(props = {}) {
  return createIcon('M 22 16.92 v 3 a 2 2 0 0 1 -2.18 2 a 19.79 19.79 0 0 1 -8.63 -3.07 a 19.5 19.5 0 0 1 -6 -6 a 19.79 19.79 0 0 1 -3.07 -8.67 a 2 2 0 0 1 2 -2.17 l 3 -0.01 a 2 2 0 0 1 2 1.72 c 0.12 0.9 0.34 1.77 0.65 2.6 a 2 2 0 0 1 -0.45 2.11 l -1.27 1.27 a 16 16 0 0 0 6 6 l 1.27 -1.27 a 2 2 0 0 1 2.11 -0.45 c 0.83 0.31 1.7 0.53 2.6 0.65 a 2 2 0 0 1 1.72 1.97', props);
}

function MessageSquareIcon(props = {}) {
  return createIcon('M 21 15 a 2 2 0 0 1 -2 2 h -7 l -7 7 v -7 a 2 2 0 0 1 -2 -2 v -10 a 2 2 0 0 1 2 -2 h 14 a 2 2 0 0 1 2 2 v 10', props);
}

function MessageCircleIcon(props = {}) {
  return createIcon('M 21 11.5 a 8.38 8.38 0 0 1 -.9 3.8 a 8.5 8.5 0 0 1 -7.6 4.7 a 8.38 8.38 0 0 1 -3.8 -.9 l -3.7 2.2 v -3.7 a 8.5 8.5 0 0 1 -4.7 -7.6 a 8.38 8.38 0 0 1 .9 -3.8 a 8.5 8.5 0 0 1 7.6 -4.7 a 8.38 8.38 0 0 1 3.8 .9 a 8.5 8.5 0 0 1 4.7 7.6', props);
}

// ============= 状态类图标 =============

function HeartIcon(props = {}) {
  return createIcon('M 20.84 4.61 a 5.5 5.5 0 0 0 -7.78 0 l -1.06 1.06 l -1.06 -1.06 a 5.5 5.5 0 0 0 -7.78 7.78 l 8.84 8.84 a 1 1 0 0 0 1.42 0 l 8.84 -8.84 a 5.5 5.5 0 0 0 0 -7.78', props);
}

function StarIcon(props = {}) {
  return createIcon('M 12 2 l 3.09 6.26 l 6.91 1 l -5 4.87 l 1.18 6.88 l -6.18 -3.26 l -6.18 3.26 l 1.18 -6.88 l -5 -4.87 l 6.91 -1 z', props);
}

function ThumbsUpIcon(props = {}) {
  return createIcon('M 14 9 v 11 a 2 2 0 0 1 -2 2 h 0 a 2 2 0 0 1 -2 -2 v -11 a 2 2 0 0 1 2 -2 h 0 a 2 2 0 0 1 2 2 M 7 9 h 14 a 2 2 0 0 1 2 2 v 7 a 2 2 0 0 1 -2 2 h -7 a 2 2 0 0 1 -2 -2 v -7 a 2 2 0 0 1 2 -2 M 7 20 h 7 M 7 9 l -2 -7', props);
}

function ThumbsDownIcon(props = {}) {
  return createIcon('M 10 15 v -11 a 2 2 0 0 1 2 -2 h 0 a 2 2 0 0 1 2 2 v 11 a 2 2 0 0 1 -2 2 h 0 a 2 2 0 0 1 -2 -2 M 17 15 h -14 a 2 2 0 0 1 -2 -2 v -7 a 2 2 0 0 1 2 -2 h 7 a 2 2 0 0 1 2 2 v 7 a 2 2 0 0 1 -2 2 M 17 4 h -7 M 17 15 l 2 7', props);
}

// ============= 时间类图标 =============

function ClockIcon(props = {}) {
  return createIcon('M 12 22 a 10 10 0 1 0 0 -20 a 10 10 0 1 0 0 20 M 12 6 v 6 l 4 2', props);
}

function CalendarIcon(props = {}) {
  return createIcon('M 19 4 h -1 v -2 a 2 2 0 0 0 -2 -2 h -8 a 2 2 0 0 0 -2 2 v 2 h -1 a 2 2 0 0 0 -2 2 v 14 a 2 2 0 0 0 2 2 h 14 a 2 2 0 0 0 2 -2 v -14 a 2 2 0 0 0 -2 -2 M 19 10 h -14 v 8 h 14 v -8 M 9 4 v 6 M 15 4 v 6', props);
}

function CalendarEventIcon(props = {}) {
  return createIcon('M 19 4 h -1 v -2 a 2 2 0 0 0 -2 -2 h -8 a 2 2 0 0 0 -2 2 v 2 h -1 a 2 2 0 0 0 -2 2 v 14 a 2 2 0 0 0 2 2 h 14 a 2 2 0 0 0 2 -2 v -14 a 2 2 0 0 0 -2 -2 M 19 10 h -14 v 8 h 14 v -8 M 9 4 v 6 M 15 4 v 6 M 12 14 l 2 2 l 4 -4', props);
}

// ============= 链接类图标 =============

function LinkIcon(props = {}) {
  return createIcon('M 10 13 a 5 5 0 0 0 7.54 .54 l 3 -3 a 5 5 0 0 0 -7.07 -7.07 l -1.72 1.71 M 14 11 a 5 5 0 0 0 -7.54 -.54 l -3 3 a 5 5 0 0 0 7.07 7.07 l 1.71 -1.71', props);
}

function ExternalLinkIcon(props = {}) {
  return createIcon('M 18 13 v 6 a 2 2 0 0 1 -2 2 h -10 a 2 2 0 0 1 -2 -2 v -10 a 2 2 0 0 1 2 -2 h 6 M 15 3 h 6 v 6 M 10 14 l 11 -11', props);
}

function ShareIcon(props = {}) {
  return createIcon('M 4 12 v 6 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -6 a 2 2 0 0 0 -2 -2 h -4 M 16 6 l -4 -4 l -4 4 M 12 2 v 13', props);
}

// ============= 设备类图标 =============

function MonitorIcon(props = {}) {
  return createIcon('M 3 3 h 18 v 14 h -18 z M 8 21 h 8 M 12 17 v 4', props);
}

function SmartphoneIcon(props = {}) {
  return createIcon('M 6 2 h 12 a 2 2 0 0 1 2 2 v 16 a 2 2 0 0 1 -2 2 h -12 a 2 2 0 0 1 -2 -2 v -16 a 2 2 0 0 1 2 -2 M 12 18 h .01', props);
}

function TabletIcon(props = {}) {
  return createIcon('M 4 2 h 16 a 2 2 0 0 1 2 2 v 16 a 2 2 0 0 1 -2 2 h -16 a 2 2 0 0 1 -2 -2 v -16 a 2 2 0 0 1 2 -2 M 12 18 h .01', props);
}

// ============= 其他图标 =============

function EyeIcon(props = {}) {
  return createIcon('M 1 12 s 4 -8 11 -8 s 11 8 11 8 s -4 8 -11 8 s -11 -8 -11 -8 M 12 5 a 7 7 0 1 0 0 14 a 7 7 0 1 0 0 -14 M 12 9 a 3 3 0 1 0 0 6 a 3 3 0 1 0 0 -6', props);
}

function EyeOffIcon(props = {}) {
  return createIcon('M 17.94 17.94 a 10.07 10.07 0 0 1 -13.88 0 M 1 1 l 22 22 M 10.58 10.58 a 3 3 0 0 0 3.84 3.84 M 9.9 4.24 a 10.07 10.07 0 0 1 10.04 2.82 M 5.64 5.64 a 10.07 10.07 0 0 0 -3.58 2.42 M 1 12 s 4 -8 11 -8 c 1.3 0 2.54 .22 3.71 .61', props);
}

function LockIcon(props = {}) {
  return createIcon('M 19 11 h -1 v -4 a 5 5 0 0 0 -10 0 v 4 h -1 a 2 2 0 0 0 -2 2 v 8 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -8 a 2 2 0 0 0 -2 -2 M 12 3 a 3 3 0 0 1 3 3 v 4 h -6 v -4 a 3 3 0 0 1 3 -3', props);
}

function UnlockIcon(props = {}) {
  return createIcon('M 19 11 h -1 v -4 a 5 5 0 0 1 8.71 -3.29 M 7 11 v -4 a 5 5 0 0 1 9.9 -1 M 19 11 h -1 v 4 h -10 v -4 h -1 a 2 2 0 0 0 -2 2 v 8 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -8 a 2 2 0 0 0 -2 -2', props);
}

function KeyIcon(props = {}) {
  return createIcon('M 21 2 l -2 2 m 0 4 l -2 2 m 0 4 a 2 2 0 1 1 -2.83 -2.83 l 7.83 -7.83 a 2 2 0 0 1 2.83 2.83 z M 12 12 l -3 3 M 9 15 l -2 2 M 15 9 l -3 3', props);
}

function FilterIcon(props = {}) {
  return createIcon('M 22 3 h -16 a 2 2 0 0 0 -2 2 v 2 l 8 7 v 6 l 4 2 v -8 l 8 -7 v -2 a 2 2 0 0 0 -2 -2', props);
}

function LayersIcon(props = {}) {
  return createIcon('M 12 2 l -10 5 l 10 5 l 10 -5 z M 2 17 l 10 5 l 10 -5 M 2 12 l 10 5 l 10 -5', props);
}

function PackageIcon(props = {}) {
  return createIcon('M 16.5 9.4 l -9 -5.19 M 21 16 v -4.5 a 2 2 0 0 0 -1 -1.73 l -7 -4 a 2 2 0 0 0 -2 0 l -7 4 a 2 2 0 0 0 -1 1.73 v 4.5 a 2 2 0 0 0 1 1.73 l 7 4 a 2 2 0 0 0 2 0 l 7 -4 a 2 2 0 0 0 1 -1.73 M 3.27 6.96 l 8.73 5.04 l 8.73 -5.04 M 12 22 v -10', props);
}

function ShoppingCartIcon(props = {}) {
  return createIcon('M 6 6 h 15 l -1.5 9 h -12 z M 6 6 l -1 -4 h -2 M 9 21 a 1 1 0 1 0 0 -2 a 1 1 0 1 0 0 2 M 20 21 a 1 1 0 1 0 0 -2 a 1 1 0 1 0 0 2', props);
}

function CreditCardIcon(props = {}) {
  return createIcon('M 3 4 h 18 a 2 2 0 0 1 2 2 v 12 a 2 2 0 0 1 -2 2 h -18 a 2 2 0 0 1 -2 -2 v -12 a 2 2 0 0 1 2 -2 M 3 10 h 18', props);
}

function DollarSignIcon(props = {}) {
  return createIcon('M 12 2 v 20 M 17 5 h -5 a 3 3 0 0 0 0 6 h 5 a 3 3 0 0 1 0 6 h -5', props);
}

function TrendingUpIcon(props = {}) {
  return createIcon('M 23 6 l -9.5 9.5 l -5 -5 l -10 10', props);
}

function TrendingDownIcon(props = {}) {
  return createIcon('M 23 18 l -9.5 -9.5 l -5 5 l -10 -10', props);
}

function ActivityIcon(props = {}) {
  return createIcon('M 22 12 l -4 0 l -3 -9 l -6 18 l -3 -9 l -4 0', props);
}

function ZapIcon(props = {}) {
  return createIcon('M 13 2 l -10 13 h 9 l -1 11 l 10 -13 h -9 z', props);
}

function HelpCircleIcon(props = {}) {
  return createIcon('M 12 22 a 10 10 0 1 0 0 -20 a 10 10 0 1 0 0 20 M 9.09 9 a 3 3 0 0 1 5.83 1 c 0 2 -3 3 -3 3 M 12 17 h .01', props);
}

function MaximizeIcon(props = {}) {
  return createIcon('M 8 3 h 13 v 13 M 3 8 h 13 v 13 M 3 21 l 8 -8 M 21 3 l -8 8', props);
}

function MinimizeIcon(props = {}) {
  return createIcon('M 8 3 h 13 v 13 M 3 8 h 13 v 13 M 21 21 l -8 -8 M 3 3 l 8 8', props);
}

function RefreshCwIcon(props = {}) {
  return createIcon('M 1 4 v 6 h 6 M 23 20 v -6 h -6 M 20.49 15 a 9 9 0 1 1 -2.12 -9.36 l 2.63 -2.64 M 3.51 9 a 9 9 0 1 1 2.12 9.36 l -2.63 2.64', props);
}

function MoreHorizontalIcon(props = {}) {
  return createIcon('M 12 12 h .01 M 19 12 h .01 M 5 12 h .01', props);
}

function MoreVerticalIcon(props = {}) {
  return createIcon('M 12 12 h .01 M 12 19 h .01 M 12 5 h .01', props);
}

function GridIcon(props = {}) {
  return createIcon('M 3 3 h 8 v 8 h -8 z M 13 3 h 8 v 8 h -8 z M 3 13 h 8 v 8 h -8 z M 13 13 h 8 v 8 h -8 z', props);
}

function ListIcon(props = {}) {
  return createIcon('M 8 6 h 13 M 8 12 h 13 M 8 18 h 13 M 3 6 h .01 M 3 12 h .01 M 3 18 h .01', props);
}

/**
 * Yoya.Basic - Browser-native HTML DSL Library
 * 提供类似 Kotlin HTML DSL 的声明式语法
 */

initTagExtensions(Tag);

export { A, ActivityIcon, AlertCircleIcon, AlertTriangleIcon, ArrowLeftIcon, ArrowRightIcon, Article, Aside, Audio, BellIcon, Blockquote, Br, Button, COMPONENT_CSS_FILES, CalendarEventIcon, CalendarIcon, Canvas, Center, CheckCircleIcon, CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, Circle, ClockIcon, CloseIcon, Code, CodeBlock, Container, CopyIcon, CreditCardIcon, DashboardIcon, Dd, Defs, DeleteIcon, Div, Divider, Dl, DollarSignIcon, DownloadIcon, Dt, EditIcon, Ellipse, Em, ExternalLinkIcon, EyeIcon, EyeOffIcon, FileIcon, FileTextIcon, Filter, FilterIcon, Flex, FolderIcon, Footer, Form, G, Grid, GridIcon, H1, H2, H3, H4, H5, H6, HStack, Header, HeartIcon, HelpCircleIcon, HomeIcon, Hr, IFrame, ImageIcon, Img, InfoIcon, Input, KeyIcon, Label, LayersIcon, Li, Line, LinearGradient, LinkIcon, ListIcon, LoadStatus, LockIcon, LoginIcon, LogoutIcon, MailIcon, Main, MaximizeIcon, MenuIcon, MessageCircleIcon, MessageSquareIcon, MinimizeIcon, MinusIcon, MonitorIcon, MoreHorizontalIcon, MoreVerticalIcon, Nav, Ol, Option, P, PackageIcon, Path, Pattern, PhoneIcon, PlusIcon, Polygon, Polyline, Pre, ProfileIcon, RadialGradient, Rect, RefreshCwIcon, ResponsiveGrid, SaveIcon, SearchIcon, Section, Select, SettingsIcon, ShareIcon, ShoppingCartIcon, SmartphoneIcon, Source, Spacer, Span, Stack, StarIcon, StateMachine, Stop, Strong, Svg, SvgElement, Image as SvgImage, SvgTag, Text as SvgText, Table, TabletIcon, Tag, Tbody, Td, Textarea, Tfoot, Th, Thead, Theme, ThemeManager, ThumbsDownIcon, ThumbsUpIcon, Tr, TrendingDownIcon, TrendingUpIcon, Tspan, Ul, UnlockIcon, UploadIcon, UserIcon, UsersIcon, VBody, VBox, VButton, VButtons, VCard, VCardBody, VCardFooter, VCardHeader, VCheckbox, VCheckboxes, VCode, VConfirm, VContextMenu, VDetail, VDetailItem, VDropdownMenu, VDynamicLoader, VEchart, VField, VForm, VInput, VLink, VMenu, VMenuDivider, VMenuGroup, VMenuItem, VMessage, VMessageContainer, VMessageManager, VModal, VPager, VRoute, VRouter, VRouterView, VSelect, VSidebar, VStack, VSubMenu, VSwitch, VSwitchers, VTable, VTabs, VTbody, VTd, VTextarea, VTfoot, VTh, VThead, VTimer, VTimer2, VTopNavbar, VTr, Video, VideoIcon, XCircleIcon, XIcon, ZapIcon, a, article, aside, audio, blockquote, br, button, canvas, center, circle, clearModuleCache, code, codeBlock, confirm, container, createBody, createText, createTheme, dd, defs, div, divider, dl, dt, ellipse, em, filter, flex, footer, form, g, getComponentCssPath, getCurrentThemeId, getEffectiveThemeMode, getLanguage, getModuleCacheStatus, getSupportedLanguages, getThemeBasePath, getThemeCssPath, getThemeMode, grid, h1, h2, h3, h4, h5, h6, hasLanguage, header, hr, hstack, iframe, img, initI18n, initStateMachine, initTagExtensions, initTheme, input, label, li, line, linearGradient, loadComponentCssFiles, loadCssFile, loadLanguageFromStorage, loadModules, main, nav, ol, option, p, path, pattern, polygon, polyline, pre, preloadModules, radialGradient, rect, registerLanguage, registerStateHandler, registerThemeConfig, responsiveGrid, saveLanguageToStorage, section, select, setLanguage, setThemeMode, source, spacer, span, stack, stop, strong, svg, svgElement, svgImage, svgText, switchTheme, t, table, tag, tbody, td, text, textarea, tfoot, th, thead, themeManager, toast, tr, translate, tspan, ul, vBody, vBox, vButton, vButtons, vCard, vCardBody, vCardFooter, vCardHeader, vCheckbox, vCheckboxes, vCode, vConfirm, vContextMenu, vDetail, vDetailItem, vDropdownMenu, vDynamicLoader, vEchart, vField, vForm, vInput, vLink, vMenu, vMenuDivider, vMenuGroup, vMenuItem, vMessage, vMessageContainer, vMessageManager, vModal, vOption, vPager, vRoute, vRouter, vRouterView, vSelect, vSidebar, vSubMenu, vSwitch, vSwitchers, vTable, vTabs, vTbody, vTd, vTextarea, vTfoot, vTh, vThead, vTimer, vTimer2, vTopNavbar, vTr, video, vstack };
//# sourceMappingURL=yoya.esm.js.map
