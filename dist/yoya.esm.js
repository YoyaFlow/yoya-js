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
        // 分发所有处理器
        handlers.forEach(handler => handler(nativeEvent));
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
      super(tagName, setup);
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
    result[factoryName] = function(setup = null) {
      return new result[className](setup);
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
 * 添加 div 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this} 返回当前实例支持链式调用
 */
Tag.prototype.div = function(setup = null) {
  const el = div(setup);
  this.child(el);
  return this;
};

/**
 * 添加 span 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this} 返回当前实例支持链式调用
 */
Tag.prototype.span = function(setup = null) {
  const el = span(setup);
  this.child(el);
  return this;
};

/**
 * 添加 p 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this} 返回当前实例支持链式调用
 */
Tag.prototype.p = function(setup = null) {
  const el = p(setup);
  this.child(el);
  return this;
};

Tag.prototype.section = function(setup = null) {
  const el = section(setup);
  this.child(el);
  return this;
};

Tag.prototype.article = function(setup = null) {
  const el = article(setup);
  this.child(el);
  return this;
};

Tag.prototype.header = function(setup = null) {
  const el = header(setup);
  this.child(el);
  return this;
};

Tag.prototype.footer = function(setup = null) {
  const el = footer(setup);
  this.child(el);
  return this;
};

Tag.prototype.nav = function(setup = null) {
  const el = nav(setup);
  this.child(el);
  return this;
};

Tag.prototype.aside = function(setup = null) {
  const el = aside(setup);
  this.child(el);
  return this;
};

Tag.prototype.main = function(setup = null) {
  const el = main(setup);
  this.child(el);
  return this;
};

Tag.prototype.h1 = function(setup = null) {
  const el = h1(setup);
  this.child(el);
  return this;
};

Tag.prototype.h2 = function(setup = null) {
  const el = h2(setup);
  this.child(el);
  return this;
};

Tag.prototype.h3 = function(setup = null) {
  const el = h3(setup);
  this.child(el);
  return this;
};

Tag.prototype.h4 = function(setup = null) {
  const el = h4(setup);
  this.child(el);
  return this;
};

Tag.prototype.h5 = function(setup = null) {
  const el = h5(setup);
  this.child(el);
  return this;
};

Tag.prototype.h6 = function(setup = null) {
  const el = h6(setup);
  this.child(el);
  return this;
};

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

Tag.prototype.a = function(setup = null) {
  const el = a(setup);
  this.child(el);
  return this;
};

Tag.prototype.strong = function(setup = null) {
  const el = strong(setup);
  this.child(el);
  return this;
};

Tag.prototype.em = function(setup = null) {
  const el = em(setup);
  this.child(el);
  return this;
};

Tag.prototype.code = function(setup = null) {
  const el = code(setup);
  this.child(el);
  return this;
};

Tag.prototype.pre = function(setup = null) {
  const el = pre(setup);
  this.child(el);
  return this;
};

Tag.prototype.blockquote = function(setup = null) {
  const el = blockquote(setup);
  this.child(el);
  return this;
};

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
Select.prototype.option = function(setup = null) {
  const optionEl = option(setup);
  this.child(optionEl);
  return this;
};

Form.prototype.input = function(setup = null) {
  const inputEl = input(setup);
  this.child(inputEl);
  return this;
};

Form.prototype.button = function(setup = null) {
  const btnEl = button(setup);
  this.child(btnEl);
  return this;
};

Form.prototype.textarea = function(setup = null) {
  const textareaEl = textarea(setup);
  this.child(textareaEl);
  return this;
};

Form.prototype.select = function(setup = null) {
  const selectEl = select(setup);
  this.child(selectEl);
  return this;
};

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

Tag.prototype.button = function(setup = null) {
  const el = button(setup);
  this.child(el);
  return this;
};

Tag.prototype.input = function(setup = null) {
  const el = input(setup);
  this.child(el);
  return this;
};

Tag.prototype.textarea = function(setup = null) {
  const el = textarea(setup);
  this.child(el);
  return this;
};

Tag.prototype.select = function(setup = null) {
  const el = select(setup);
  this.child(el);
  return this;
};

Tag.prototype.option = function(setup = null) {
  const el = option(setup);
  this.child(el);
  return this;
};

Tag.prototype.label = function(setup = null) {
  const el = label(setup);
  this.child(el);
  return this;
};

Tag.prototype.form = function(setup = null) {
  const el = form(setup);
  this.child(el);
  return this;
};

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
Ul.prototype.li = function(setup = null) {
  const liEl = li(setup);
  this.child(liEl);
  return this;
};

Ol.prototype.li = function(setup = null) {
  const liEl = li(setup);
  this.child(liEl);
  return this;
};

Dl.prototype.dt = function(setup = null) {
  const dtEl = dt(setup);
  this.child(dtEl);
  return this;
};

Dl.prototype.dd = function(setup = null) {
  const ddEl = dd(setup);
  this.child(ddEl);
  return this;
};

// ============================================
// Tag 原型扩展方法 - 列表
// ============================================

Tag.prototype.ul = function(setup = null) {
  const el = ul(setup);
  this.child(el);
  return this;
};

Tag.prototype.ol = function(setup = null) {
  const el = ol(setup);
  this.child(el);
  return this;
};

Tag.prototype.li = function(setup = null) {
  const el = li(setup);
  this.child(el);
  return this;
};

Tag.prototype.dl = function(setup = null) {
  const el = dl(setup);
  this.child(el);
  return this;
};

Tag.prototype.dt = function(setup = null) {
  const el = dt(setup);
  this.child(el);
  return this;
};

Tag.prototype.dd = function(setup = null) {
  const el = dd(setup);
  this.child(el);
  return this;
};

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
Table.prototype.tr = function(setup = null) {
  const trEl = tr(setup);
  this.child(trEl);
  return this;
};

Tr.prototype.td = function(setup = null) {
  const tdEl = td(setup);
  this.child(tdEl);
  return this;
};

Tr.prototype.th = function(setup = null) {
  const thEl = th(setup);
  this.child(thEl);
  return this;
};

Thead.prototype.tr = function(setup = null) {
  const trEl = tr(setup);
  this.child(trEl);
  return this;
};

Tbody.prototype.tr = function(setup = null) {
  const trEl = tr(setup);
  this.child(trEl);
  return this;
};

Tfoot.prototype.tr = function(setup = null) {
  const trEl = tr(setup);
  this.child(trEl);
  return this;
};

// ============================================
// Tag 原型扩展方法 - 表格
// ============================================

Tag.prototype.table = function(setup = null) {
  const el = table(setup);
  this.child(el);
  return this;
};

Tag.prototype.tr = function(setup = null) {
  const el = tr(setup);
  this.child(el);
  return this;
};

Tag.prototype.td = function(setup = null) {
  const el = td(setup);
  this.child(el);
  return this;
};

Tag.prototype.th = function(setup = null) {
  const el = th(setup);
  this.child(el);
  return this;
};

Tag.prototype.thead = function(setup = null) {
  const el = thead(setup);
  this.child(el);
  return this;
};

Tag.prototype.tbody = function(setup = null) {
  const el = tbody(setup);
  this.child(el);
  return this;
};

Tag.prototype.tfoot = function(setup = null) {
  const el = tfoot(setup);
  this.child(el);
  return this;
};

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

Tag.prototype.img = function(setup = null) {
  const el = img(setup);
  this.child(el);
  return this;
};

Tag.prototype.video = function(setup = null) {
  const el = video(setup);
  this.child(el);
  return this;
};

Tag.prototype.audio = function(setup = null) {
  const el = audio(setup);
  this.child(el);
  return this;
};

Tag.prototype.source = function(setup = null) {
  const el = source(setup);
  this.child(el);
  return this;
};

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

Tag.prototype.br = function(setup = null) {
  const el = br(setup);
  this.child(el);
  return this;
};

Tag.prototype.hr = function(setup = null) {
  const el = hr(setup);
  this.child(el);
  return this;
};

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

Tag.prototype.iframe = function(setup = null) {
  const el = iframe(setup);
  this.child(el);
  return this;
};

Tag.prototype.canvas = function(setup = null) {
  const el = canvas(setup);
  this.child(el);
  return this;
};

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
const themeRegistry$1 = new Map();

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
    themeRegistry$1.set(this.name, this);
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

    // 3. 设置基础样式（使用主题变量）
    this.styles({
      background: 'var(--islands-card-bg, var(--islands-bg))',
      borderRadius: 'var(--islands-card-radius, 8px)',
      boxShadow: 'var(--islands-card-shadow, var(--islands-shadow))',
      overflow: 'hidden',
      border: 'var(--islands-card-border, 1px solid transparent)',
    });

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
        host.styles({
          transition: 'box-shadow 0.3s, transform 0.2s',
          cursor: 'pointer',
        });
        host.on('mouseenter', () => {
          host.styles({
            boxShadow: 'var(--islands-card-hover-shadow, var(--islands-shadow-hover))',
            transform: 'translateY(-2px)',
          });
        });
        host.on('mouseleave', () => {
          host.styles({
            boxShadow: 'var(--islands-card-shadow, var(--islands-shadow))',
            transform: 'translateY(0)',
          });
        });
      }
    });

    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.styles({
          border: 'var(--islands-card-border-color, 1px solid var(--islands-border))',
          boxShadow: 'none',
        });
      } else {
        host.styles({
          border: 'var(--islands-card-border, 1px solid transparent)',
          boxShadow: 'var(--islands-card-shadow, var(--islands-shadow))',
        });
      }
    });

    // noShadow 状态
    this.registerStateHandler('noShadow', (enabled, host) => {
      host.style('boxShadow', enabled ? 'none' : 'var(--islands-card-shadow, var(--islands-shadow))');
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
    this.styles({
      padding: 'var(--islands-card-header-padding, 16px)',
      borderBottom: 'var(--islands-card-header-border, 1px solid var(--islands-border-light))',
      fontWeight: 'var(--islands-card-header-font-weight, 600)',
      fontSize: 'var(--islands-card-header-font-size, 16px)',
      color: 'var(--islands-card-header-color, var(--islands-text))',
      background: 'var(--islands-card-header-bg, var(--islands-bg-secondary))',
    });
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
    this.styles({
      padding: 'var(--islands-card-body-padding, 16px)',
      fontSize: 'var(--islands-card-body-font-size, 14px)',
      color: 'var(--islands-card-body-color, var(--islands-text))',
      background: 'var(--islands-card-body-bg, transparent)',
    });
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
    this.styles({
      padding: 'var(--islands-card-footer-padding, 16px)',
      borderTop: 'var(--islands-card-footer-border, 1px solid var(--islands-border-light))',
      display: 'flex',
      gap: 'var(--islands-card-footer-gap, 8px)',
      fontSize: 'var(--islands-card-footer-font-size, 14px)',
      color: 'var(--islands-card-footer-color, var(--islands-text-secondary))',
      background: 'var(--islands-card-footer-bg, transparent)',
    });
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
    this.styles({
      display: 'inline-block',
      background: 'var(--islands-menu-bg, var(--islands-bg))',
      borderRadius: 'var(--islands-menu-radius, var(--islands-radius-md))',
      boxShadow: 'var(--islands-menu-shadow, var(--islands-shadow-dropdown))',
      padding: 'var(--islands-menu-padding, 8px) 0',
      minWidth: 'var(--islands-menu-min-width, 160px)',
      border: 'var(--islands-menu-border, 1px solid var(--islands-border))',
      pointerEvents: 'auto',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置垂直布局
   * @returns {this}
   */
  vertical() {
    return this.style('flexDirection', 'column');
  }

  /**
   * 设置水平布局
   * @returns {this}
   */
  horizontal() {
    this.style('display', 'flex');
    this.style('flexDirection', 'row');
    this.style('flexWrap', 'nowrap');
    this.style('gap', '4px');
    this.style('padding', '8px');
    return this;
  }

  /**
   * 设置紧凑模式（减小内边距）
   * @returns {this}
   */
  compact() {
    return this.style('padding', '4px 0');
  }

  /**
   * 移除阴影
   * @returns {this}
   */
  noShadow() {
    return this.style('boxShadow', 'none');
  }

  /**
   * 添加边框
   * @returns {this}
   */
  bordered() {
    return this.style('border', '1px solid #e0e0e0');
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

    this.styles({
      padding: 'var(--islands-menu-item-padding, 10px) var(--islands-menu-item-horizontal-padding, 16px)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--islands-menu-item-gap, 10px)',
      transition: 'background-color 0.2s',
      borderRadius: 'var(--islands-menu-item-radius, 4px)',
      color: 'var(--islands-menu-item-color, var(--islands-text))',
      fontSize: 'var(--islands-menu-item-font-size, 13px)',
      background: 'transparent',
    });

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
      const el = host._boundElement;
      if (enabled) {
        host.styles({
          opacity: 'var(--islands-menu-item-disabled-opacity, 0.5)',
          cursor: 'var(--islands-menu-item-disabled-cursor, not-allowed)',
          pointerEvents: 'none',
          color: 'var(--islands-menu-item-disabled-color, var(--islands-text-secondary))',
        });
        if (el) {
          el.style.opacity = 'var(--islands-menu-item-disabled-opacity, 0.5)';
          el.style.cursor = 'var(--islands-menu-item-disabled-cursor, not-allowed)';
          el.style.pointerEvents = 'none';
        }
      } else {
        host.style('opacity', '');
        host.style('cursor', 'pointer');
        host.style('pointerEvents', '');
        host.style('color', '');
        if (el) {
          el.style.opacity = '';
          el.style.cursor = 'pointer';
          el.style.pointerEvents = '';
          el.style.color = '';
        }
      }
    });

    this.registerStateHandler('active', (enabled, host) => {
      const el = host._boundElement;
      if (enabled) {
        host.styles({
          background: 'var(--islands-menu-item-active-bg, var(--islands-primary-alpha))',
          fontWeight: 'var(--islands-menu-item-active-font-weight, 500)',
          color: 'var(--islands-menu-item-active-color, var(--islands-primary))',
        });
        if (el) {
          el.style.background = 'var(--islands-menu-item-active-bg, var(--islands-primary-alpha))';
          el.style.fontWeight = 'var(--islands-menu-item-active-font-weight, 500)';
          el.style.color = 'var(--islands-menu-item-active-color, var(--islands-primary))';
        }
      } else {
        host.style('background', '');
        host.style('fontWeight', '');
        host.style('color', '');
        if (el) {
          el.style.background = '';
          el.style.fontWeight = '';
          el.style.color = '';
        }
      }
    });

    this.registerStateHandler('danger', (enabled, host) => {
      const el = host._boundElement;
      if (enabled) {
        host.style('color', 'var(--islands-menu-item-danger-color, var(--islands-error))');
        if (el) {
          el.style.color = 'var(--islands-menu-item-danger-color, var(--islands-error))';
        }
      } else {
        host.style('color', '');
        if (el) {
          el.style.color = '';
        }
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
          host.style('background', 'var(--islands-menu-item-hover-bg, var(--islands-hover-bg))');
        } else {
          submenuContainer._boundElement.style.display = 'none';
          arrowEl._boundElement.style.transform = 'rotate(0deg)';
          // 折叠时恢复背景（如果没有 active）
          if (!host.hasState('active')) {
            host.style('background', 'transparent');
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
        self.style('background', 'var(--islands-menu-item-hover-bg, var(--islands-hover-bg))');
        if (self._boundElement) {
          self._boundElement.style.background = 'var(--islands-menu-item-hover-bg, var(--islands-hover-bg))';
        }
      }
    }).on('mouseleave', () => {
      if (!self.hasState('disabled') && !self.hasState('active')) {
        self.style('background', 'transparent');
        if (self._boundElement) {
          self._boundElement.style.background = '';
        }
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
        color: '#999',
        background: '#f5f5f5',
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
    this.styles({
      border: 'none',
      height: 'var(--islands-menu-divider-height, 1px)',
      background: 'var(--islands-menu-divider-bg, var(--islands-border))',
      margin: 'var(--islands-menu-divider-margin, 8px) 0',
    });
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
    this.styles({
      display: 'flex',
      flexDirection: 'column',
    });
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
        label.styles({
          display: 'block',
          padding: 'var(--islands-menu-group-label-padding, 8px 16px 4px)',
          fontSize: 'var(--islands-menu-group-label-font-size, 12px)',
          color: 'var(--islands-menu-group-label-color, var(--islands-text-tertiary))',
          fontWeight: 'var(--islands-menu-group-label-font-weight, 500)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--islands-menu-group-label-letter-spacing, 0.5px)',
        });
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
        padding: 'var(--islands-dropdown-trigger-padding, 8px 16px)',
        background: 'var(--islands-dropdown-trigger-bg, var(--islands-primary))',
        color: 'var(--islands-dropdown-trigger-color, white)',
        borderRadius: 'var(--islands-dropdown-trigger-radius, 6px)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--islands-dropdown-trigger-gap, 6px)',
        userSelect: 'none',
        transition: 'all 0.2s',
      });
      wrap.on('mouseenter', () => {
        wrap.style('background', 'var(--islands-dropdown-trigger-hover-bg, var(--islands-primary-dark))');
      });
      wrap.on('mouseleave', () => {
        wrap.style('background', 'var(--islands-dropdown-trigger-bg, var(--islands-primary))');
      });

      if (typeof this._triggerContent === 'string') {
        wrap.span(this._triggerContent);
      } else if (this._triggerContent && this._triggerContent.renderDom) {
        wrap.child(this._triggerContent);
      }

      wrap.span(arrow => {
        arrow.text('▼');
        arrow.styles({ fontSize: 'var(--islands-dropdown-arrow-size, 10px)', transition: 'transform 0.2s' });
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
          top: 'calc(100% + var(--islands-dropdown-menu-offset, 4px))',
          left: '0',
          minWidth: 'var(--islands-dropdown-menu-min-width, 160px)',
          background: 'var(--islands-dropdown-menu-bg, var(--islands-bg))',
          borderRadius: 'var(--islands-dropdown-menu-radius, var(--islands-radius-md))',
          boxShadow: 'var(--islands-dropdown-menu-shadow, var(--islands-shadow-dropdown))',
          padding: 'var(--islands-dropdown-menu-padding, 8px) 0',
          zIndex: 'var(--islands-dropdown-z-index, 1000)',
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
      zIndex: 'var(--islands-context-menu-z-index, 9999)',
      display: 'none',
      background: 'var(--islands-context-menu-bg, var(--islands-bg))',
      borderRadius: 'var(--islands-context-menu-radius, var(--islands-radius-md))',
      boxShadow: 'var(--islands-context-menu-shadow, var(--islands-shadow-dropdown))',
      padding: 'var(--islands-context-menu-padding, 8px) 0',
      minWidth: 'var(--islands-context-menu-min-width, 160px)',
      border: 'var(--islands-context-menu-border, 1px solid var(--islands-border))',
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
        borderLeft: '1px solid var(--islands-border, #e0e0e0)',
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
    this._width = 'var(--islands-sidebar-width, 240px)';
    this._collapsedWidth = 'var(--islands-sidebar-collapsed-width, 64px)';

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
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      width: this._width,
      minWidth: this._width,
      height: '100%',
      background: 'var(--islands-sidebar-bg, var(--islands-card-bg, white))',
      borderRight: 'var(--islands-sidebar-border, 1px solid var(--islands-border, #e0e0e0))',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      boxSizing: 'border-box',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('collapsed', (collapsed, host) => {
      const el = host._boundElement;

      if (collapsed) {
        // 折叠状态
        host.styles({
          width: host._collapsedWidth,
          minWidth: host._collapsedWidth,
        });

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
        host.styles({
          width: host._width,
          minWidth: host._width,
        });

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
        header.styles({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--islands-sidebar-header-padding, 16px)',
          borderBottom: 'var(--islands-sidebar-header-border, 1px solid var(--islands-border, #e0e0e0))',
          background: 'var(--islands-sidebar-header-bg, var(--islands-bg-secondary, #f7f8fa))',
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
        content.styles({
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 'var(--islands-sidebar-content-padding, 8px 0)',
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
        footer.styles({
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--islands-sidebar-footer-padding, 16px)',
          borderTop: 'var(--islands-sidebar-footer-border, 1px solid var(--islands-border, #e0e0e0))',
          background: 'var(--islands-sidebar-footer-bg, var(--islands-bg-secondary, #f7f8fa))',
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
      marginLeft: 'var(--islands-sidebar-divider-margin, 8px)',
      marginRight: 'var(--islands-sidebar-divider-margin, 8px)',
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
        padding: 'var(--islands-sidebar-toggle-padding, 8px)',
        borderRadius: 'var(--islands-sidebar-toggle-radius, 6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        color: 'var(--islands-text-secondary, #666)',
        fontSize: '16px',
      });
      btn.text('◀');
      btn.on('mouseenter', () => {
        btn.styles({
          background: 'var(--islands-hover-bg, rgba(102, 126, 234, 0.1))',
          color: 'var(--islands-primary, #667eea)',
        });
      });
      btn.on('mouseleave', () => {
        btn.styles({
          background: 'transparent',
          color: 'var(--islands-text-secondary, #666)',
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
          this._toggleBtnEl.text(value ? '▶' : '◀');
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
      background: 'var(--islands-sidebar-bg-dark, var(--islands-bg-dark, #1a1a1a))',
      borderRight: 'var(--islands-sidebar-border-dark, 1px solid var(--islands-border-dark, #333))',
    });
    if (this._headerEl) {
      this._headerEl.styles({
        background: 'var(--islands-sidebar-header-bg-dark, var(--islands-bg-dark-secondary, #2a2a2a))',
        borderBottom: 'var(--islands-sidebar-header-border-dark, 1px solid var(--islands-border-dark, #333))',
      });
    }
    if (this._footerEl) {
      this._footerEl.styles({
        background: 'var(--islands-sidebar-footer-bg-dark, var(--islands-bg-dark-secondary, #2a2a2a))',
        borderTop: 'var(--islands-sidebar-footer-border-dark, 1px solid var(--islands-border-dark, #333))',
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
  /**
   * 创建 VMessage 实例
   * @param {string} [content=''] - 消息内容
   * @param {string} [type='info'] - 消息类型：success、error、warning、info
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(content = '', type = 'info', setup = null) {
    super('div', null);

    this._content = content;
    this._type = type;
    this._closable = true;
    this._duration = 3000;
    this._timer = null;
    this._closed = false;

    this.styles({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: 'var(--islands-message-box-shadow, 0 4px 12px rgba(0,0,0,0.15))',
      minWidth: '280px',
      maxWidth: '400px',
      animation: 'slideIn 0.3s ease',
      position: 'relative'
    });

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
    const typeStyles = {
      success: {
        background: 'var(--islands-message-success-bg)',
        color: 'var(--islands-message-success-color)',
        border: 'var(--islands-message-success-border)',
      },
      error: {
        background: 'var(--islands-message-error-bg)',
        color: 'var(--islands-message-error-color)',
        border: 'var(--islands-message-error-border)',
      },
      warning: {
        background: 'var(--islands-message-warning-bg)',
        color: 'var(--islands-message-warning-color)',
        border: 'var(--islands-message-warning-border)',
      },
      info: {
        background: 'var(--islands-message-info-bg)',
        color: 'var(--islands-message-info-color)',
        border: 'var(--islands-message-info-border)',
      }
    };

    const styles = typeStyles[this._type] || typeStyles.info;
    this.styles(styles);
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
      icon.styles({
        fontSize: 'var(--islands-message-icon-size, 18px)',
        fontWeight: 'bold',
        flexShrink: '0',
        marginRight: 'var(--islands-message-icon-margin, 10px)',
      });
    }));

    this.child(span(text => {
      text.text(this._content);
      text.styles({
        flex: 1,
        fontSize: 'var(--islands-message-font-size, 14px)',
        lineHeight: 'var(--islands-message-line-height, 1.5)',
        color: 'var(--islands-message-text-color, inherit)',
      });
    }));

    if (this._closable) {
      this.child(span(closeBtn => {
        closeBtn.text('×');
        closeBtn.styles({
          fontSize: 'var(--islands-message-close-size, 20px)',
          cursor: 'pointer',
          padding: 'var(--islands-message-close-padding, 0 4px)',
          opacity: 'var(--islands-message-close-opacity, 0.7)',
          transition: 'opacity 0.2s',
          flexShrink: '0',
          color: 'var(--islands-message-close-color, inherit)',
        });
        closeBtn.on('mouseenter', () => {
          closeBtn.style('opacity', 'var(--islands-message-close-hover-opacity, 1)');
        });
        closeBtn.on('mouseleave', () => {
          closeBtn.style('opacity', 'var(--islands-message-close-opacity, 0.7)');
        });
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

    this.styles({
      position: 'fixed',
      zIndex: 'var(--islands-message-z-index, 9999)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--islands-message-gap, 10px)',
      padding: 'var(--islands-message-container-padding, 16px)',
      maxWidth: 'var(--islands-message-max-width, 420px)',
    });

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
    const positions = {
      'top-left': { top: '0', left: '0' },
      'top-right': { top: '0', right: '0' },
      'top-center': { top: '0', left: '50%', transform: 'translateX(-50%)' },
      'bottom-left': { bottom: '0', left: '0' },
      'bottom-right': { bottom: '0', right: '0' },
      'bottom-center': { bottom: '0', left: '50%', transform: 'translateX(-50%)' }
    };

    const pos = positions[this._position] || positions['top-right'];
    this.styles(pos);
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

    // 3. 设置基础样式（直接设置到 this._el）
    this._setupBaseStyles();

    // 4. 保存基础样式快照（用于状态变更时恢复）
    this.saveBaseStylesSnapshot();

    // 4.5. 应用默认类型样式
    this._applyTypeStyles();

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

  // 设置基础样式
  _setupBaseStyles() {
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--islands-gap-sm, 6px)',
      padding: 'var(--islands-button-padding, 8px 16px)',
      fontSize: 'var(--islands-button-font-size, 14px)',
      fontWeight: '400',
      borderRadius: 'var(--islands-button-radius, 6px)',
      border: '1px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
      minWidth: 'var(--islands-button-min-width, 64px)',
      height: 'var(--islands-button-height, 32px)',
      transform: 'scale(1)',
      transformOrigin: 'center center',
    });

    // 使用状态机管理 hover
    this.on('mouseenter', () => {
      this.setState('hovered', true);
    });

    this.on('mouseleave', () => {
      this.setState('hovered', false);
    });

    // 点击按压效果
    this.on('mousedown', (e) => {
      e.preventDefault();
      if (!this.hasState('disabled') && !this.hasState('loading')) {
        this.style('transform', 'scale(0.98)');
      }
    });

    this.on('mouseup', () => {
      if (!this.hasState('disabled') && !this.hasState('loading')) {
        this.style('transform', 'scale(1)');
      }
    });

    this.on('mouseout', () => {
      if (!this.hasState('disabled') && !this.hasState('loading')) {
        this.style('transform', 'scale(1)');
      }
    });
  }

  // 获取 hover 样式
  _getHoverStyles() {
    const type = this._type || 'default';
    const isGhost = this.hasState('ghost');
    const hoverStyles = {
      primary: {
        background: isGhost ? 'var(--islands-primary-alpha)' : 'var(--islands-button-primary-hover)',
      },
      success: {
        background: isGhost ? 'var(--islands-success-bg)' : 'var(--islands-button-success-hover)',
      },
      warning: {
        background: isGhost ? 'var(--islands-warning-bg)' : 'var(--islands-button-warning-hover)',
      },
      danger: {
        background: isGhost ? 'var(--islands-error-bg)' : 'var(--islands-button-danger-hover)',
      },
      default: {
        background: isGhost ? 'var(--islands-hover-bg)' : 'var(--islands-button-default-hover)',
      },
    };
    return hoverStyles[type] || hoverStyles.default;
  }

  // 注册状态处理器
  _registerStateHandlers() {
    // disabled 状态
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
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

    // loading 状态
    this.registerStateHandler('loading', (loading, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (loading) {
        host.styles({
          cursor: 'wait',
          pointerEvents: 'none',
        });
      } else {
        host.styles({
          cursor: 'pointer',
          pointerEvents: 'auto',
        });
      }
      host._updateContent();
    });

    // block 状态（占满容器）
    this.registerStateHandler('block', (isBlock, host) => {
      host.style('display', isBlock ? 'flex' : 'inline-flex');
      host.style('width', isBlock ? '100%' : '');
    });

    // ghost 状态
    this.registerStateHandler('ghost', (isGhost, host) => {
      host._applyTypeStyles();
    });

    // hovered 状态 - 使用状态机管理 hover
    this.registerStateHandler('hovered', (isHovered, host) => {
      if (isHovered && !host.hasState('disabled') && !host.hasState('loading')) {
        host.styles(host._getHoverStyles());
      } else {
        host._applyTypeStyles();
      }
    });
  }

  // 应用类型样式
  _applyTypeStyles() {
    const type = this._type || 'default';
    const isGhost = this.hasState('ghost');

    const typeStyles = {
      primary: {
        background: isGhost ? 'transparent' : 'var(--islands-primary)',
        color: isGhost ? 'var(--islands-primary)' : 'white',
        border: '1px solid var(--islands-primary)',
      },
      success: {
        background: isGhost ? 'transparent' : 'var(--islands-success)',
        color: isGhost ? 'var(--islands-success)' : 'white',
        border: '1px solid var(--islands-success)',
      },
      warning: {
        background: isGhost ? 'transparent' : 'var(--islands-warning)',
        color: isGhost ? 'var(--islands-warning)' : 'var(--islands-text-primary)',
        border: '1px solid var(--islands-warning)',
      },
      danger: {
        background: isGhost ? 'transparent' : 'var(--islands-error)',
        color: isGhost ? 'var(--islands-error)' : 'white',
        border: '1px solid var(--islands-error)',
      },
      default: {
        background: isGhost ? 'transparent' : 'var(--islands-bg)',
        color: isGhost ? 'var(--islands-text)' : 'var(--islands-text)',
        border: '1px solid var(--islands-button-default-border)',
      },
    };

    const styles = typeStyles[type] || typeStyles.default;
    this.styles(styles);

    // 存储当前类型样式，用于 hover 时恢复
    this._currentTypeStyles = styles;
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
    this._applyTypeStyles();
    return this;
  }

  size(value) {
    if (value === undefined) return this._size;

    const sizeStyles = {
      large: {
        padding: 'var(--islands-button-padding-lg, 10px 20px)',
        fontSize: 'var(--islands-button-font-size-lg, 16px)',
        height: 'var(--islands-button-height-lg, 40px)',
      },
      default: {
        padding: 'var(--islands-button-padding, 8px 16px)',
        fontSize: 'var(--islands-button-font-size, 14px)',
        height: 'var(--islands-button-height, 32px)',
      },
      small: {
        padding: 'var(--islands-button-padding-sm, 4px 10px)',
        fontSize: 'var(--islands-button-font-size-sm, 12px)',
        height: 'var(--islands-button-height-sm, 24px)',
      },
    };

    this._size = value;
    const styles = sizeStyles[value] || sizeStyles.default;
    this.styles(styles);
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
// Tag 原型扩展
// ============================================

Tag.prototype.vButton = function(content = '', setup = null) {
  const btn = vButton(content, setup);
  this.child(btn);
  return this;
};

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
      borderRadius: 'var(--islands-code-radius, 8px)',
      overflow: 'hidden',
      background: 'var(--islands-code-bg, #1e1e1e)',
      border: 'var(--islands-code-border, 1px solid rgba(255,255,255,0.1))',
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
            background: 'var(--islands-code-copy-success-bg, #28a745)',
            color: 'var(--islands-code-copy-success-color, white)',
          });
          // 2 秒后恢复
          setTimeout(() => {
            host.setState('copied', false);
          }, 2000);
        } else {
          host._copyButton.textContent('📋 复制');
          host._copyButton.styles({
            background: 'var(--islands-code-copy-bg, #444)',
            color: 'var(--islands-code-copy-color, #ccc)',
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
          padding: 'var(--islands-code-header-padding, 10px 16px)',
          background: 'var(--islands-code-header-bg, rgba(255,255,255,0.05))',
          borderBottom: 'var(--islands-code-header-border, 1px solid rgba(255,255,255,0.1))',
        });

        // 标题
        if (this._title) {
          h.child(span(t => {
            t.styles({
              color: 'var(--islands-code-title-color, #007acc)',
              fontSize: 'var(--islands-code-title-font-size, 13px)',
              fontWeight: 'var(--islands-code-title-font-weight, 600)',
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
              padding: 'var(--islands-code-copy-padding, 4px 10px)',
              borderRadius: 'var(--islands-code-copy-radius, 4px)',
              fontSize: 'var(--islands-code-copy-font-size, 12px)',
              cursor: 'pointer',
              background: 'var(--islands-code-copy-bg, #444)',
              color: 'var(--islands-code-copy-color, #ccc)',
              transition: 'all 0.2s',
              userSelect: 'none',
            });
            b.text('📋 复制');
            b.on('click', () => this._handleCopy());
            b.on('mouseenter', () => {
              if (!this.hasState('copied')) {
                b.styles({
                  background: 'var(--islands-code-copy-hover-bg, #555)',
                  color: 'var(--islands-code-copy-hover-color, white)',
                });
              }
            });
            b.on('mouseleave', () => {
              if (!this.hasState('copied')) {
                b.styles({
                  background: 'var(--islands-code-copy-bg, #444)',
                  color: 'var(--islands-code-copy-color, #ccc)',
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
        padding: 'var(--islands-code-padding, 16px)',
        overflow: 'auto',
        fontSize: 'var(--islands-code-font-size, 13px)',
        lineHeight: 'var(--islands-code-line-height, 1.6)',
        color: 'var(--islands-code-text-color, #d4d4d4)',
        fontFamily: 'var(--islands-code-font-family, "Fira Code", "Consolas", "Monaco", monospace)',
      });

      c.child(this._codeElement = code(inner => {
        inner.styles({
          color: 'var(--islands-code-text-color, #d4d4d4)',
          fontFamily: 'inherit',
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
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      width: '100%',
      maxWidth: '100%',
      fontSize: 'var(--islands-input-font-size, 14px)',
      borderRadius: 'var(--islands-input-radius, 6px)',
      border: '1px solid var(--islands-input-border, var(--islands-border))',
      background: 'var(--islands-input-bg, var(--islands-bg))',
      color: 'var(--islands-input-text, var(--islands-text))',
      transition: 'all 0.2s',
      outline: 'none',
      height: 'var(--islands-input-height, 32px)',
      boxSizing: 'border-box',
      cursor: 'text',
    });
  }

  _createInternalElements() {
    // 只在首次创建内部 input 元素
    if (this._inputEl) return;

    this._inputEl = input(i => {
      i.styles({
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: 'inherit',
        color: 'inherit',
        minWidth: 0,
        width: '100%',
        height: '100%',
        padding: 'var(--islands-input-padding, 8px 12px)',
      });
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
      if (this._inputEl) {
        this._inputEl.focus();
      }
    });
  }

  _showLoadingSpinner() {
    if (!this._loadingSpinner) {
      this._loadingSpinner = span(s => {
        s.styles({
          display: 'inline-block',
          width: '14px',
          height: '14px',
          border: '2px solid currentColor',
          borderBottomColor: 'transparent',
          borderRadius: '50%',
          animation: 'buttonLoadingSpin 0.8s linear infinite',
          marginLeft: '12px',
        });
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
      host.clearStateStyles();  // 先清空状态样式

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
          background: 'var(--islands-input-disabled-bg, var(--islands-bg-tertiary))',
        });
        if (host._inputEl) {
          host._inputEl.attr('disabled', 'disabled');
        }
      } else {
        host.styles({
          opacity: '1',
          cursor: 'text',
          background: 'var(--islands-input-bg, var(--islands-bg))',
        });
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
      host.clearStateStyles();  // 先清空状态样式

      if (hasError) {
        host.style('borderColor', 'var(--islands-error, var(--islands-border-error))');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-bg, rgba(224, 82, 82, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
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
    const sizeStyles = {
      large: {
        padding: 'var(--islands-input-padding-lg, 10px 16px)',
        fontSize: 'var(--islands-input-font-size-lg, 16px)',
        height: 'var(--islands-input-height-lg, 40px)',
      },
      default: {
        padding: 'var(--islands-input-padding, 8px 12px)',
        fontSize: 'var(--islands-input-font-size, 14px)',
        height: 'var(--islands-input-height, 32px)',
      },
      small: {
        padding: 'var(--islands-input-padding-sm, 4px 8px)',
        fontSize: 'var(--islands-input-font-size-sm, 12px)',
        height: 'var(--islands-input-height-sm, 24px)',
      },
    };
    const styles = sizeStyles[s] || sizeStyles.default;
    this.styles(styles);
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
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      width: '100%',
      fontSize: 'var(--islands-select-font-size, 14px)',
      borderRadius: 'var(--islands-select-radius, 6px)',
      border: '1px solid var(--islands-select-border, var(--islands-border, #e0e0e0))',
      background: 'var(--islands-select-bg, var(--islands-bg, white))',
      color: 'var(--islands-select-text, var(--islands-text, #333))',
      transition: 'all 0.2s',
      outline: 'none',
      height: 'var(--islands-select-height, 32px)',
      boxSizing: 'border-box',
      cursor: 'pointer',
      position: 'relative',
    });
  }

  _createInternalElements() {
    // 首次创建 select 元素
    if (!this._selectEl) {
      this._selectEl = select(s => {
        s.styles({
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 'inherit',
          color: 'inherit',
          cursor: 'inherit',
          width: '100%',
          height: '100%',
        });
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
      host.clearStateStyles();  // 先清空状态样式

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
          background: 'var(--islands-select-disabled-bg, var(--islands-bg-tertiary, #f5f5f5))',
        });
        if (host._selectEl) {
          host._selectEl.attr('disabled', 'disabled');
        }
      } else {
        host.styles({
          opacity: '1',
          cursor: 'pointer',
        });
        if (host._selectEl) {
          host._selectEl.attr('disabled', null);
        }
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (hasError) {
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
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
    const sizeStyles = {
      large: {
        padding: 'var(--islands-select-padding-lg, 10px 16px)',
        fontSize: 'var(--islands-select-font-size-lg, 16px)',
        height: 'var(--islands-select-height-lg, 40px)',
      },
      default: {
        padding: 'var(--islands-select-padding, 8px 12px)',
        fontSize: 'var(--islands-select-font-size, 14px)',
        height: 'var(--islands-select-height, 32px)',
      },
      small: {
        padding: 'var(--islands-select-padding-sm, 4px 8px)',
        fontSize: 'var(--islands-select-font-size-sm, 12px)',
        height: 'var(--islands-select-height-sm, 24px)',
      },
    };

    this._size = s;
    const styles = sizeStyles[s] || sizeStyles.default;
    this.styles(styles);
    return this;
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
    this.styles({
      display: 'inline-flex',
      width: '100%',
      fontSize: 'var(--islands-textarea-font-size, 14px)',
      borderRadius: 'var(--islands-textarea-radius, 6px)',
      border: '1px solid var(--islands-textarea-border, var(--islands-border, #e0e0e0))',
      background: 'var(--islands-textarea-bg, var(--islands-bg, white))',
      color: 'var(--islands-textarea-text, var(--islands-text, #333))',
      transition: 'all 0.2s',
      outline: 'none',
      boxSizing: 'border-box',
      minHeight: 'var(--islands-textarea-min-height, 80px)',
      cursor: 'text',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
          background: 'var(--islands-textarea-disabled-bg, var(--islands-bg-tertiary, #f5f5f5))',
        });
        if (host._textareaEl) {
          host._textareaEl.attr('disabled', 'disabled');
        }
      } else {
        host.styles({
          opacity: '1',
          cursor: 'text',
        });
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
      host.clearStateStyles();  // 先清空状态样式

      if (hasError) {
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
      }
    });
  }

  _updateContent() {
    // 只在首次创建内部 textarea 元素
    if (this._textareaEl) return;

    this._textareaEl = textarea(t => {
      t.styles({
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: 'inherit',
        color: 'inherit',
        resize: 'vertical',
        fontFamily: 'inherit',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: 'var(--islands-textarea-padding, 8px 12px)',
      });
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
      if (this._textareaEl) {
        this._textareaEl.focus();
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
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--islands-gap-sm, 6px)',
      cursor: 'pointer',
      fontSize: 'var(--islands-checkbox-font-size, 14px)',
      color: 'var(--islands-checkbox-text, var(--islands-text, #333))',
      userSelect: 'none',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
        });
        if (host._checkboxEl) {
          host._checkboxEl.attr('disabled', 'disabled');
        }
      } else {
        host.styles({
          opacity: '1',
          cursor: 'pointer',
        });
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
      host.clearStateStyles();  // 先清空状态样式

      if (hasError) {
        host.style('color', 'var(--islands-error, #dc3545)');
      }
    });
  }

  _updateContent() {
    // 只在首次创建内部 checkbox 元素
    if (this._checkboxEl) return;

    this._checkboxEl = input(i => {
      i.attr('type', 'checkbox');
      i.styles({
        width: '16px',
        height: '16px',
        margin: 0,
        cursor: 'inherit',
      });
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
      k.styles({
        display: 'inline-block',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s',
        transform: this._checked ? 'translateX(22px)' : 'translateX(0)',
      });
    });

    // 创建 switch 按钮容器
    this._switchEl = div(s => {
      s.styles({
        display: 'inline-flex',
        alignItems: 'center',
        width: 'var(--islands-switch-width, 44px)',
        height: 'var(--islands-switch-height, 22px)',
        borderRadius: 'var(--islands-switch-radius, 11px)',
        background: this._checked ? 'var(--islands-primary, #667eea)' : 'var(--islands-switch-bg, var(--islands-border, #e0e0e0))',
        padding: '2px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        boxSizing: 'border-box',
      });
      s.child(knob);
    });

    // 如果有 label，创建 wrapper
    if (this._label) {
      this._wrapper = div(w => {
        w.styles({
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: this.hasState('disabled') ? 'not-allowed' : 'pointer',
        });
        w.child(this._switchEl);
        w.child(this._labelEl = span(s => {
          s.text(this._label);
          s.styles({
            fontSize: '14px',
            color: 'inherit',
            userSelect: 'none',
          });
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
      if (host._switchEl) {
        host._switchEl.style('cursor', enabled ? 'not-allowed' : 'pointer');
      }
      if (host._wrapper) {
        host._wrapper.style('cursor', enabled ? 'not-allowed' : 'pointer');
      }
      if (host._labelEl) {
        host._labelEl.style('opacity', enabled ? '0.5' : '1');
      }
    });

    this.registerStateHandler('checked', (checked, host) => {
      host._checked = checked;
      if (host._switchEl) {
        host._switchEl.style('background',
          checked ? 'var(--islands-primary, #667eea)' : 'var(--islands-switch-bg, var(--islands-border, #e0e0e0))');
      }
      // 更新滑块位置
      const knob = host._switchEl?._children?.find(c => c._isKnob);
      if (knob) {
        knob.style('transform', checked ? 'translateX(22px)' : 'translateX(0)');
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
    const sizes = {
      large: { width: '56px', height: '28px' },
      default: { width: '44px', height: '22px' },
      small: { width: '32px', height: '16px' },
    };

    const size = sizes[value] || sizes.default;
    this.styles({
      width: `var(--islands-switch-width, ${size.width})`,
      height: `var(--islands-switch-height, ${size.height})`,
    });
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
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--islands-form-gap, 16px)',
      width: '100%',
    });
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

    // 7. 创建内部元素
    this._updateContent();
  }

  _setupBaseStyles() {
    this.styles({
      display: 'flex',
      gap: 'var(--islands-gap, 12px)',
      fontSize: 'var(--islands-checkbox-font-size, 14px)',
      color: 'var(--islands-checkbox-text, var(--islands-text, #333))',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
        });
        // 禁用所有复选框
        host._checkboxes.forEach(cb => {
          if (cb._checkboxEl) {
            cb._checkboxEl.attr('disabled', 'disabled');
          }
        });
      } else {
        host.styles({
          opacity: '1',
          cursor: 'pointer',
        });
        // 启用所有复选框
        host._checkboxes.forEach(cb => {
          if (cb._checkboxEl) {
            cb._checkboxEl.attr('disabled', null);
          }
        });
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();

      if (hasError) {
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
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
    const layoutStyles = {
      column: {
        flexDirection: 'column',
        gap: 'var(--islands-gap, 12px)',
      },
      row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 'var(--islands-gap, 12px)',
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: `repeat(${this._columns}, 1fr)`,
        gap: 'var(--islands-gap, 12px)',
      },
    };

    this.styles(layoutStyles[this._layout] || layoutStyles.column);
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
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
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
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--islands-border, #d1d5db)',
        background: 'white',
        fontSize: '14px',
        color: 'var(--islands-text, #333)',
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
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
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
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--islands-border, #d1d5db)',
        background: 'white',
        fontSize: '14px',
        color: 'var(--islands-text, #333)',
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
      s.styles({ color: '#999', fontSize: '14px' });
    });

    // 结束时间输入
    this._endInputEl = input(i => {
      i.attr('type', this._type);
      i.attr('placeholder', '结束日期');
      i.styles({
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--islands-border, #d1d5db)',
        background: 'white',
        fontSize: '14px',
        color: 'var(--islands-text, #333)',
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
  constructor(setup = null) {
    super('div', null);

    this._items = [];
    this._column = 3;
    this._title = null;
    this._bordered = false;
    this._layout = 'horizontal'; // 'horizontal' | 'vertical'
    this._initialized = false;

    // 1. 设置基础样式
    this._setupBaseStyles();

    // 2. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 3. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      fontSize: 'var(--islands-descriptions-font-size, 14px)',
      color: 'var(--islands-descriptions-text, var(--islands-text, #333))',
      background: 'var(--islands-descriptions-bg, transparent)',
    });
  }

  // 创建表格结构
  _buildTable() {
    this.clear();

    // 标题
    if (this._title) {
      const titleEl = div(t => {
        t.styles({
          padding: 'var(--islands-descriptions-title-padding, 12px 0)',
          fontSize: 'var(--islands-descriptions-title-size, 16px)',
          fontWeight: 'var(--islands-descriptions-title-font-weight, 600)',
          color: 'var(--islands-descriptions-title-color, var(--islands-text, #333))',
          marginBottom: 'var(--islands-descriptions-title-margin, 12px)',
        });
        t.text(this._title);
      });
      this.child(titleEl);
    }

    // 表格容器
    const tableContainer = div(tc => {
      tc.styles({
        width: '100%',
        overflowX: 'auto',
      });

      if (this._layout === 'vertical') {
        // 纵向布局：使用 flex 布局
        this._buildVerticalLayout(tc);
      } else {
        // 横向布局：使用表格布局
        const tbl = table(t => {
          t.styles({
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'inherit',
          });

          if (this._bordered) {
            t.style('border', '1px solid var(--islands-descriptions-border, var(--islands-border, #e0e0e0))');
          }
        });

        // 根据 items 和 column 计算行数
        const rows = this._buildRows();

        rows.forEach(rowItems => {
          const trEl = tr(r => {
            if (this._bordered) {
              r.style('borderBottom', '1px solid var(--islands-descriptions-border, var(--islands-border, #e0e0e0))');
            }
          });

          rowItems.forEach(item => {
            // 标签单元格
            const labelTd = td(l => {
              l.styles({
                padding: 'var(--islands-descriptions-padding, 12px 16px)',
                background: this._bordered
                  ? 'var(--islands-descriptions-label-bg, var(--islands-bg-secondary, #f7f8fa))'
                  : 'transparent',
                color: 'var(--islands-descriptions-label-color, var(--islands-text-secondary, #666))',
                fontWeight: 'var(--islands-descriptions-label-font-weight, 500)',
                textAlign: 'left',
                width: 'var(--islands-descriptions-label-width, 120px)',
                boxSizing: 'border-box',
              });

              if (this._bordered) {
                l.style('borderRight', '1px solid var(--islands-descriptions-border, var(--islands-border, #e0e0e0))');
              }

              if (item.label) {
                l.text(item.label);
              }
            });

            // 内容单元格
            const contentTd = td(c => {
              c.styles({
                padding: 'var(--islands-descriptions-padding, 12px 16px)',
                color: 'var(--islands-descriptions-content-color, var(--islands-text, #333))',
                boxSizing: 'border-box',
              });

              if (this._bordered) {
                c.style('borderRight', '1px solid var(--islands-descriptions-border, var(--islands-border, #e0e0e0))');
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
      g.styles({
        display: 'grid',
        gridTemplateColumns: `repeat(${this._column}, 1fr)`,
        gap: 'var(--islands-descriptions-vertical-gap, 16px)',
      });

      this._items.forEach(item => {
        const itemEl = div(i => {
          i.styles({
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--islands-descriptions-vertical-item-gap, 6px)',
          });

          // 标签
          const labelEl = span(l => {
            l.styles({
              fontSize: 'var(--islands-descriptions-label-font-size, 12px)',
              color: 'var(--islands-descriptions-label-color, var(--islands-text-secondary, #666))',
              fontWeight: 'var(--islands-descriptions-label-font-weight, 500)',
            });
            if (item.label) l.text(item.label);
          });

          // 内容
          const contentEl = div(c => {
            c.styles({
              fontSize: 'var(--islands-descriptions-content-font-size, 14px)',
              color: 'var(--islands-descriptions-content-color, var(--islands-text, #333))',
              padding: 'var(--islands-descriptions-vertical-content-padding, 8px 0)',
            });

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
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--islands-field-gap, 6px)',
      padding: '0',
      minWidth: 'var(--islands-field-min-width, 80px)',
      minHeight: 'var(--islands-field-min-height, 32px)',
      position: 'relative',
      boxSizing: 'border-box',
      cursor: 'pointer',
      fontSize: 'var(--islands-field-font-size, 14px)',
      color: 'var(--islands-field-text-color, var(--islands-text, #333))',
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
          opacity: 'var(--islands-field-disabled-opacity, 0.5)',
          cursor: 'var(--islands-field-disabled-cursor, not-allowed)',
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
      host.style('opacity', loading ? 'var(--islands-field-loading-opacity, 0.7)' : '1');
    });
  }

  // ============================================
  // 构建内容（只调用一次）
  // ============================================
  _buildShowEl(){
    // 内容
    this._showEl = div(c => {
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
      e.styles({
        fontSize: 'var(--islands-field-edit-icon-size, 14px)',
        color: 'var(--islands-field-edit-icon-color, #999)',
        opacity: '0',
        transition: 'opacity 0.2s',
        marginLeft: 'var(--islands-field-edit-icon-margin, 4px)',
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
      s.styles({
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--islands-field-show-gap, 4px)',
        height: 'var(--islands-field-show-height, 32px)',
        padding: 'var(--islands-field-show-padding, 8px 12px)',
        borderRadius: 'var(--islands-field-radius, 6px)',
        border: 'var(--islands-field-show-border, 1px solid transparent)',
        background: 'var(--islands-field-show-bg, transparent)',
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
      a.styles({
        display: 'flex',
        gap: 'var(--islands-field-btn-gap, 4px)',
      });
      a.child(button(save => {
        save.styles({
          minWidth: 'var(--islands-field-btn-size, 24px)',
          height: 'var(--islands-field-btn-size, 24px)',
          padding: 'var(--islands-field-btn-padding, 0 6px)',
          border: 'var(--islands-field-save-border, 1px solid #28a745)',
          borderRadius: 'var(--islands-field-btn-radius, 4px)',
          background: 'var(--islands-field-save-bg, #28a745)',
          color: 'var(--islands-field-save-color, white)',
          fontSize: 'var(--islands-field-btn-font-size, 11px)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        });
        save.text('✓');
        save.on('mouseenter', () => {
          save.styles({
            background: 'var(--islands-field-save-hover-bg, #218838)',
          });
        });
        save.on('click', (ev) => { ev.stopPropagation(); that._handleSave(); });
      }));
      a.child(button(cancel => {
        cancel.styles({
          minWidth: 'var(--islands-field-btn-size, 24px)',
          height: 'var(--islands-field-btn-size, 24px)',
          padding: 'var(--islands-field-btn-padding, 0 6px)',
          border: 'var(--islands-field-cancel-border, 1px solid #e0e0e0)',
          borderRadius: 'var(--islands-field-btn-radius, 4px)',
          background: 'var(--islands-field-cancel-bg, white)',
          color: 'var(--islands-field-cancel-color, #666)',
          fontSize: 'var(--islands-field-btn-font-size, 11px)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        });
        cancel.text('✕');
        cancel.on('mouseenter', () => {
          cancel.styles({
            background: 'var(--islands-field-cancel-hover-bg, #f5f5f5)',
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
      e.styles({
        display: 'none',
        alignItems: 'center',
        gap: 'var(--islands-field-edit-gap, 6px)',
        width: '100%',
        boxSizing: 'border-box',
        padding: 'var(--islands-field-edit-padding, 4px)',
        background: 'var(--islands-field-edit-bg, white)',
        borderRadius: 'var(--islands-field-radius, 6px)',
        border: 'var(--islands-field-edit-border, 1px solid var(--islands-border, #e0e0e0))',
        boxShadow: 'var(--islands-field-edit-shadow, 0 2px 8px rgba(0,0,0,0.1))',
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

    // 应用基础样式（使用主题变量）
    this.styles({
      // 背景色
      background: 'var(--islands-body-bg, var(--islands-bg, white))',
      backgroundColor: 'var(--islands-body-bg-color, var(--islands-body-bg, var(--islands-bg, white)))',

      // 最小高度
      minHeight: 'var(--islands-body-min-height, 100vh)',

      // 宽度
      width: 'var(--islands-body-width, 100%)',

      // 布局
      display: 'var(--islands-body-display, flex)',
      flexDirection: 'var(--islands-body-flex-direction, column)',
      alignItems: 'var(--islands-body-align-items, stretch)',

      // 内边距
      padding: 'var(--islands-body-padding, 0)',
      margin: 'var(--islands-body-margin, 0)',
      boxSizing: 'border-box',

      // 过渡效果
      transition: 'background-color 0.3s ease, min-height 0.3s ease',
    });

    // 应用组件基础样式
    this._applyThemeBaseStyles();

    // 执行 setup
    if (setup) {
      this.setup(setup);
    }
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
    if (enabled) {
      this.style('minHeight', 'var(--islands-body-min-height, 100vh)');
    }
    return this;
  }

  /**
   * 设置内容对齐方式
   * @param {string} align - 对齐方式
   * @returns {VBody} this
   */
  align(align) {
    this.style('alignItems', align);
    return this;
  }

  /**
   * 设置内容居中对齐
   * @returns {VBody} this
   */
  center() {
    this.style('alignItems', 'center')
      .style('justifyContent', 'center');
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
        host.styles({
          minHeight: 'var(--islands-body-min-height, 100vh)',
          width: 'var(--islands-body-width, 100%)',
        });
      } else {
        host.style('minHeight', '');
        host.style('width', '');
      }
    });
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
      fontSize: 'var(--islands-table-font-size, 14px)',
      color: 'var(--islands-table-text, var(--islands-text))',
      background: 'var(--islands-table-bg, var(--islands-bg))',
    });
  }

  _registerStateHandlers() {
    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.styles({
          border: '1px solid var(--islands-table-border, var(--islands-border))',
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
          el.style.setProperty('--islands-table-striped-bg', 'var(--islands-bg-secondary)');
        } else {
          el.style.removeProperty('--islands-table-striped-bg');
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
          el.style.setProperty('--islands-table-hover-bg', 'var(--islands-hover-bg)');
        } else {
          el.style.removeProperty('--islands-table-hover-bg');
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
          el.style.setProperty('--islands-table-cell-padding', '8px 12px');
        } else {
          el.style.removeProperty('--islands-table-cell-padding');
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
      background: 'var(--islands-table-head-bg, var(--islands-bg-secondary))',
      borderBottom: '2px solid var(--islands-table-border, var(--islands-border))',
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
      background: 'var(--islands-table-body-bg, var(--islands-bg))',
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
      background: 'var(--islands-table-foot-bg, var(--islands-bg-secondary))',
      borderTop: '2px solid var(--islands-table-border, var(--islands-border))',
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
        host.style('background', 'var(--islands-table-striped-bg, var(--islands-bg-secondary))');
        host._hasStripedBg = true;
      } else {
        host.style('background', '');
        host._hasStripedBg = false;
      }
    });

    // striped 状态 - 重新应用偶数行样式
    this.registerStateHandler('striped', (enabled, host) => {
      if (enabled && host.hasState('isEvenRow')) {
        host.style('background', 'var(--islands-table-striped-bg, var(--islands-bg-secondary))');
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
            host._el.style.setProperty('background', 'var(--islands-table-hover-bg, var(--islands-hover-bg))');
          }
        };
        host._mouseleaveHandler = () => {
          // 若有条纹且是偶数行，恢复条纹色；否则恢复透明
          if (host._hasStripedBg) {
            if (host._el) {
              host._el.style.setProperty('background', 'var(--islands-table-striped-bg, var(--islands-bg-secondary))');
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
      padding: 'var(--islands-table-head-padding, 12px 16px)',
      textAlign: 'left',
      fontWeight: '600',
      color: 'var(--islands-table-head-color, var(--islands-text))',
      borderBottom: '2px solid var(--islands-table-border, var(--islands-border))',
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
      padding: 'var(--islands-table-cell-padding, 12px 16px)',
      borderBottom: '1px solid var(--islands-table-row-border, var(--islands-border))',
      color: 'var(--islands-table-cell-color, var(--islands-text))',
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
          color: 'var(--islands-primary-color, #5470c6)',
          textColor: 'var(--islands-text-color, #333)',
          maskColor: 'var(--islands-mask-bg, rgba(255, 255, 255, 0.8))',
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
 * Yoya.Basic - 主题变量配置
 * 所有组件支持的主题变量列表
 *
 * 使用方式：在 CSS 中定义这些变量，或在 JavaScript 中通过 style.setProperty 设置
 */

// ============================================
// 基础主题变量
// ============================================

const baseVariables = {
  // 主色
  '--islands-primary': '#667eea',
  '--islands-primary-hover': '#5a6fd6',
  '--islands-primary-alpha': 'rgba(102, 126, 234, 0.1)',

  // 成功色
  '--islands-success': '#28a745',
  '--islands-success-hover': '#218838',

  // 警告色
  '--islands-warning': '#ffc107',
  '--islands-warning-hover': '#e0a800',

  // 错误色
  '--islands-error': '#dc3545',
  '--islands-error-hover': '#c82333',

  // 背景色
  '--islands-bg': 'white',
  '--islands-bg-secondary': '#f7f8fa',

  // 文本色
  '--islands-text': '#333',
  '--islands-text-secondary': '#666',

  // 边框色
  '--islands-border': '#e0e0e0',

  // 间距
  '--islands-padding-sm': '8px',
  '--islands-padding-md': '16px',
  '--islands-padding-lg': '24px',
  '--islands-margin-md': '8px',
  '--islands-gap-sm': '6px',
  '--islands-gap-md': '12px',

  // 圆角
  '--islands-radius-sm': '4px',
  '--islands-radius-md': '8px',
  '--islands-radius-lg': '12px',

  // 阴影
  '--islands-shadow': '0 4px 12px rgba(0,0,0,0.15)',

  // 悬停背景
  '--islands-hover-bg': 'rgba(102, 126, 234, 0.05)',
};

// ============================================
// Card 卡片组件变量
// ============================================

const cardVariables = {
  '--islands-card-bg': 'white',
  '--islands-card-radius': '8px',
  '--islands-card-shadow': '0 2px 8px rgba(0,0,0,0.1)',
  '--islands-card-border': '1px solid transparent',
  '--islands-card-hover-shadow': '0 4px 16px rgba(0,0,0,0.15)',

  // 头部
  '--islands-card-header-padding': '16px',
  '--islands-card-header-border': '1px solid #e0e0e0',
  '--islands-card-header-font-weight': '600',
  '--islands-card-header-font-size': '16px',
  '--islands-card-header-color': '#333',
  '--islands-card-header-bg': 'transparent',

  // 内容
  '--islands-card-body-padding': '16px',
  '--islands-card-body-font-size': '14px',
  '--islands-card-body-color': '#333',
  '--islands-card-body-bg': 'transparent',

  // 底部
  '--islands-card-footer-padding': '16px',
  '--islands-card-footer-border': '1px solid #e0e0e0',
  '--islands-card-footer-gap': '8px',
  '--islands-card-footer-font-size': '14px',
  '--islands-card-footer-color': '#666',
  '--islands-card-footer-bg': 'transparent',
};

// ============================================
// Button 按钮组件变量
// ============================================

const buttonVariables = {
  '--islands-button-padding': '8px 16px',
  '--islands-button-padding-sm': '4px 10px',
  '--islands-button-padding-lg': '10px 20px',
  '--islands-button-font-size': '14px',
  '--islands-button-font-size-sm': '12px',
  '--islands-button-font-size-lg': '16px',
  '--islands-button-height': '32px',
  '--islands-button-height-sm': '24px',
  '--islands-button-height-lg': '40px',
  '--islands-button-min-width': '64px',
  '--islands-button-radius': '6px',
};

// ============================================
// Menu 菜单组件变量
// ============================================

const menuVariables = {
  // 菜单容器
  '--islands-menu-bg': 'white',
  '--islands-menu-radius': '8px',
  '--islands-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
  '--islands-menu-padding': '8px 0',
  '--islands-menu-min-width': '160px',
  '--islands-menu-border': '1px solid #e0e0e0',

  // 菜单项
  '--islands-menu-item-padding': '10px',
  '--islands-menu-item-horizontal-padding': '16px',
  '--islands-menu-item-gap': '10px',
  '--islands-menu-item-radius': '4px',
  '--islands-menu-item-color': '#333',
  '--islands-menu-item-font-size': '13px',
  '--islands-menu-item-hover-bg': 'rgba(102, 126, 234, 0.05)',
  '--islands-menu-item-active-bg': 'rgba(102, 126, 234, 0.1)',
  '--islands-menu-item-active-font-weight': '500',
  '--islands-menu-item-active-color': '#667eea',
  '--islands-menu-item-disabled-opacity': '0.5',
  '--islands-menu-item-disabled-cursor': 'not-allowed',
  '--islands-menu-item-disabled-color': '#999',
  '--islands-menu-item-danger-color': '#dc3545',

  // 分割线
  '--islands-menu-divider-height': '1px',
  '--islands-menu-divider-bg': '#e0e0e0',
  '--islands-menu-divider-margin': '8px',

  // 菜单组
  '--islands-menu-group-label-padding': '8px 16px 4px',
  '--islands-menu-group-label-font-size': '12px',
  '--islands-menu-group-label-color': '#999',
  '--islands-menu-group-label-font-weight': '500',
  '--islands-menu-group-label-letter-spacing': '0.5px',

  // 下拉菜单
  '--islands-dropdown-trigger-padding': '8px 16px',
  '--islands-dropdown-trigger-bg': '#667eea',
  '--islands-dropdown-trigger-color': 'white',
  '--islands-dropdown-trigger-radius': '6px',
  '--islands-dropdown-trigger-gap': '6px',
  '--islands-dropdown-trigger-hover-bg': '#5a6fd6',
  '--islands-dropdown-arrow-size': '10px',
  '--islands-dropdown-menu-offset': '4px',
  '--islands-dropdown-menu-min-width': '160px',
  '--islands-dropdown-menu-bg': 'white',
  '--islands-dropdown-menu-radius': '8px',
  '--islands-dropdown-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
  '--islands-dropdown-menu-padding': '8px 0',
  '--islands-dropdown-z-index': '1000',

  // 右键菜单
  '--islands-context-menu-z-index': '9999',
  '--islands-context-menu-bg': 'white',
  '--islands-context-menu-radius': '8px',
  '--islands-context-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
  '--islands-context-menu-padding': '8px 0',
  '--islands-context-menu-min-width': '160px',
  '--islands-context-menu-border': '1px solid #e0e0e0',
};

// ============================================
// Message 消息组件变量
// ============================================

const messageVariables = {
  // 容器
  '--islands-message-z-index': '9999',
  '--islands-message-gap': '10px',
  '--islands-message-container-padding': '16px',
  '--islands-message-max-width': '420px',

  // 消息体
  '--islands-message-icon-size': '18px',
  '--islands-message-icon-margin': '10px',
  '--islands-message-font-size': '14px',
  '--islands-message-line-height': '1.5',
  '--islands-message-text-color': 'inherit',
  '--islands-message-close-size': '20px',
  '--islands-message-close-padding': '0 4px',
  '--islands-message-close-opacity': '0.7',
  '--islands-message-close-hover-opacity': '1',
  '--islands-message-close-color': 'inherit',

  // 成功消息
  '--islands-message-success-bg': 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
  '--islands-message-success-color': '#155724',
  '--islands-message-success-border': '1px solid #c3e6cb',

  // 错误消息
  '--islands-message-error-bg': 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
  '--islands-message-error-color': '#721c24',
  '--islands-message-error-border': '1px solid #f5c6cb',

  // 警告消息
  '--islands-message-warning-bg': 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
  '--islands-message-warning-color': '#856404',
  '--islands-message-warning-border': '1px solid #ffeaa7',

  // 信息消息
  '--islands-message-info-bg': 'linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)',
  '--islands-message-info-color': '#0c5460',
  '--islands-message-info-border': '1px solid #bee5eb',
};

// ============================================
// Code 代码组件变量
// ============================================

const codeVariables = {
  // 容器
  '--islands-code-bg': '#1e1e1e',
  '--islands-code-radius': '8px',
  '--islands-code-border': '1px solid rgba(255,255,255,0.1)',
  '--islands-code-padding': '16px',
  '--islands-code-font-size': '13px',
  '--islands-code-line-height': '1.6',
  '--islands-code-text-color': '#d4d4d4',
  '--islands-code-font-family': '"Fira Code", "Consolas", "Monaco", monospace',

  // 标题栏
  '--islands-code-header-padding': '10px 16px',
  '--islands-code-header-bg': 'rgba(255,255,255,0.05)',
  '--islands-code-header-border': '1px solid rgba(255,255,255,0.1)',
  '--islands-code-title-color': '#007acc',
  '--islands-code-title-font-size': '13px',
  '--islands-code-title-font-weight': '600',

  // 复制按钮
  '--islands-code-copy-padding': '4px 10px',
  '--islands-code-copy-radius': '4px',
  '--islands-code-copy-font-size': '12px',
  '--islands-code-copy-bg': '#444',
  '--islands-code-copy-color': '#ccc',
  '--islands-code-copy-hover-bg': '#555',
  '--islands-code-copy-hover-color': 'white',
  '--islands-code-copy-success-bg': '#28a745',
  '--islands-code-copy-success-color': 'white',

  // 语法高亮
  '--islands-code-token-comment': '#6a9955',
  '--islands-code-token-keyword': '#569cd6',
  '--islands-code-token-string': '#ce9178',
  '--islands-code-token-function': '#dcdcaa',
  '--islands-code-token-number': '#b5cea8',
};

// ============================================
// Field 可编辑字段组件变量
// ============================================

const fieldVariables = {
  // 基础
  '--islands-field-gap': '6px',
  '--islands-field-min-width': '80px',
  '--islands-field-min-height': '32px',
  '--islands-field-font-size': '14px',
  '--islands-field-text-color': '#333',
  '--islands-field-radius': '6px',

  // 显示状态
  '--islands-field-show-gap': '4px',
  '--islands-field-show-height': '32px',
  '--islands-field-show-padding': '8px 12px',
  '--islands-field-show-bg': 'transparent',
  '--islands-field-show-border': '1px solid transparent',
  '--islands-field-show-hover-bg': 'rgba(0,0,0,0.03)',
  '--islands-field-show-hover-border': '#e0e0e0',

  // 编辑图标
  '--islands-field-edit-icon-size': '12px',
  '--islands-field-edit-icon-color': '#999',
  '--islands-field-edit-icon-margin': '6px',

  // 编辑状态
  '--islands-field-edit-gap': '6px',
  '--islands-field-edit-padding': '4px',
  '--islands-field-edit-bg': 'white',
  '--islands-field-edit-border': '1px solid #e0e0e0',
  '--islands-field-edit-shadow': '0 2px 8px rgba(0,0,0,0.1)',

  // 按钮
  '--islands-field-btn-size': '24px',
  '--islands-field-btn-padding': '0 6px',
  '--islands-field-btn-radius': '4px',
  '--islands-field-btn-font-size': '11px',
  '--islands-field-btn-gap': '4px',
  '--islands-field-save-bg': '#28a745',
  '--islands-field-save-color': 'white',
  '--islands-field-save-border': '1px solid #28a745',
  '--islands-field-save-hover-bg': '#218838',
  '--islands-field-cancel-bg': 'white',
  '--islands-field-cancel-color': '#666',
  '--islands-field-cancel-border': '1px solid #e0e0e0',
  '--islands-field-cancel-hover-bg': '#f5f5f5',

  // 状态
  '--islands-field-disabled-opacity': '0.5',
  '--islands-field-disabled-cursor': 'not-allowed',
  '--islands-field-loading-opacity': '0.7',
};

// ============================================
// Descriptions 详情组件变量
// ============================================

const descriptionsVariables = {
  '--islands-descriptions-font-size': '14px',
  '--islands-descriptions-text': '#333',
  '--islands-descriptions-bg': 'transparent',

  // 标题
  '--islands-descriptions-title-padding': '12px 0',
  '--islands-descriptions-title-size': '16px',
  '--islands-descriptions-title-font-weight': '600',
  '--islands-descriptions-title-color': '#333',
  '--islands-descriptions-title-margin': '12px',

  // 表格
  '--islands-descriptions-padding': '12px 16px',
  '--islands-descriptions-border': '#e0e0e0',

  // 标签
  '--islands-descriptions-label-bg': '#f7f8fa',
  '--islands-descriptions-label-color': '#666',
  '--islands-descriptions-label-font-weight': '500',
  '--islands-descriptions-label-width': '120px',

  // 内容
  '--islands-descriptions-content-color': '#333',
};

// ============================================
// Body 页面背景组件变量
// ============================================

const bodyVariables = {
  // 背景
  '--islands-body-bg': 'var(--islands-bg, white)',
  '--islands-body-bg-color': 'var(--islands-body-bg, var(--islands-bg, white))',

  // 尺寸
  '--islands-body-min-height': '100vh',
  '--islands-body-width': '100%',

  // 布局
  '--islands-body-display': 'flex',
  '--islands-body-flex-direction': 'column',
  '--islands-body-align-items': 'stretch',
  '--islands-body-justify-content': 'flex-start',

  // 间距
  '--islands-body-padding': '0',
  '--islands-body-margin': '0',

  // 过渡
  '--islands-body-transition': 'background-color 0.3s ease, min-height 0.3s ease',

  // 全屏模式
  '--islands-body-fullscreen-min-height': '100vh',
  '--islands-body-fullscreen-width': '100%',
};

// ============================================
// 导出所有变量
// ============================================

const allVariables = {
  ...baseVariables,
  ...cardVariables,
  ...buttonVariables,
  ...menuVariables,
  ...messageVariables,
  ...codeVariables,
  ...fieldVariables,
  ...descriptionsVariables,
  ...bodyVariables,
};

// ============================================
// 辅助函数：应用主题变量到指定元素
// ============================================

/**
 * 应用主题变量到指定元素
 * @param {HTMLElement} element - 目标元素
 * @param {Object} variables - 变量对象
 */
function applyVariables(element, variables) {
  for (const [name, value] of Object.entries(variables)) {
    element.style.setProperty(name, value);
  }
}

/**
 * 应用主题变量到根元素
 * @param {Object} variables - 变量对象
 */
function applyGlobalVariables(variables) {
  const root = document.documentElement;
  applyVariables(root, variables);
}

/**
 * 创建暗色主题变量
 */
function createDarkTheme$1() {
  return {
    '--islands-bg': '#1a1a1a',
    '--islands-bg-secondary': '#2a2a2a',
    '--islands-text': '#e0e0e0',
    '--islands-text-secondary': '#a0a0a0',
    '--islands-border': '#404040',
    '--islands-card-bg': '#2a2a2a',
    '--islands-menu-bg': '#2a2a2a',
    '--islands-dropdown-menu-bg': '#2a2a2a',
    '--islands-context-menu-bg': '#2a2a2a',
    '--islands-field-edit-bg': '#2a2a2a',
    '--islands-button-bg': '#3a3a3a',
    '--islands-hover-bg': 'rgba(255,255,255,0.05)',
  };
}

/**
 * Yoya.Theme - 主题管理系统
 * 提供主题初始化、加载、切换等功能
 */


// 主题注册表
const themeRegistry = new Map();

// 当前主题和 mode
let currentThemeId = null;
let currentMode = 'auto'; // 'auto' | 'light' | 'dark'

// localStorage 键名
const STORAGE_KEY_THEME = 'yoya-theme';
const STORAGE_KEY_MODE = 'yoya-mode';

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
      const theme = getThemeWithMode(currentThemeId || 'islands', e.matches ? 'dark' : 'light');
      if (theme) {
        applyTheme(theme, false);
      }
    }
  });
}

/**
 * 注册主题
 * @param {string} themeId - 主题 ID
 * @param {Function} themeFactory - 主题创建函数
 * @param {Function} options.lightFactory - 浅色主题创建函数（可选）
 * @param {Function} options.darkFactory - 深色主题创建函数（可选）
 */
function registerTheme(themeId, themeFactory, options = {}) {
  themeRegistry.set(themeId, {
    factory: themeFactory,
    lightFactory: options.lightFactory,
    darkFactory: options.darkFactory,
  });
}

/**
 * 根据 mode 获取主题实例
 */
function getThemeWithMode(themeId, mode = null) {
  const entry = themeRegistry.get(themeId);
  if (!entry) return null;

  const effectiveMode = mode || getEffectiveMode();
  const factory = effectiveMode === 'dark' ? entry.darkFactory || entry.factory : entry.lightFactory || entry.factory;

  if (factory) {
    return factory();
  }
  return null;
}

/**
 * 获取主题实例
 * @param {string} themeId - 主题 ID
 * @returns {Theme|null}
 */
function getTheme(themeId) {
  return getThemeWithMode(themeId, currentMode === 'auto' ? null : currentMode);
}

/**
 * 从 localStorage 读取主题配置
 * @returns {string|null}
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
 * @returns {string|null}
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
 * @param {string} themeId - 主题 ID
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
 * @param {string} mode - mode 值 (auto|light|dark)
 */
function saveModeToStorage(mode) {
  try {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  } catch (e) {
    // 忽略存储错误
  }
}

/**
 * 应用主题 CSS 变量到 DOM
 * @param {Theme} theme - 主题实例
 */
function applyThemeVariables(theme) {
  if (!theme || !theme.variables) return;

  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.variables)) {
    root.style.setProperty(key, value);
  }
}

/**
 * 为组件应用主题样式
 * @param {Theme} theme - 主题实例
 */
function applyComponentStyles(theme) {
  if (!theme || !theme.componentThemes) return;

  // 为每个组件类型应用样式
  for (const [componentName, config] of Object.entries(theme.componentThemes)) {
    const componentClass = getComponentClass(componentName);
    if (!componentClass) continue;

    // 应用基础样式
    if (config.baseStyles) {
      applyBaseStyles(componentClass, config.baseStyles);
    }

    // 应用状态样式
    if (config.stateStyles) {
      applyStateStyles(componentClass, componentName, config.stateStyles);
    }

    // 应用变体样式
    if (config.variants) {
      applyVariantStyles(componentClass, componentName, config.variants);
    }
  }
}

/**
 * 获取组件类
 * @param {string} componentName - 组件名
 * @returns {Function|null}
 */
function getComponentClass(componentName) {
  // 从全局 scope 查找组件类
  if (typeof window !== 'undefined') {
    return window[componentName] || null;
  }
  return null;
}

/**
 * 应用基础样式
 * @param {Function} componentClass - 组件类
 * @param {Object} styles - 样式对象
 */
function applyBaseStyles(componentClass, styles) {
  if (!componentClass || !componentClass.prototype) return;

  // 保存基础样式引用
  const proto = componentClass.prototype;
  if (!proto._themeBaseStyles) {
    proto._themeBaseStyles = styles;

    // 包装 setup 方法以应用基础样式
    const originalSetup = proto.setup;
    proto.setup = function (...args) {
      const result = originalSetup ? originalSetup.call(this, ...args) : this;
      // 应用基础样式
      if (styles) {
        this.styles(styles);
      }
      return result;
    };
  }
}

/**
 * 应用状态样式
 * @param {Function} componentClass - 组件类
 * @param {string} componentName - 组件名
 * @param {Object} stateStyles - 状态样式对象
 */
function applyStateStyles(componentClass, componentName, stateStyles) {
  if (!componentClass || !componentClass.prototype) return;

  const proto = componentClass.prototype;

  // 包装 _registerStateHandlers 方法
  const originalRegisterHandlers = proto._registerStateHandlers;
  proto._registerStateHandlers = function (...args) {
    // 先调用原有的状态处理器注册
    const result = originalRegisterHandlers ? originalRegisterHandlers.call(this, ...args) : undefined;

    // 注册主题状态样式处理器
    for (const [stateName, styles] of Object.entries(stateStyles)) {
      this.registerStateHandler(stateName, (value, host) => {
        if (value) {
          host.styles(styles);
          // 如果已经绑定到 DOM，直接更新 DOM 样式
          if (host._boundElement) {
            for (const [prop, val] of Object.entries(styles)) {
              host._boundElement.style[prop] = val;
            }
          }
        } else {
          // 恢复样式
          for (const prop of Object.keys(styles)) {
            host.style(prop, '');
            if (host._boundElement) {
              host._boundElement.style[prop] = '';
            }
          }
        }
      });
    }

    return result;
  };
}

/**
 * 应用变体样式
 * @param {Function} componentClass - 组件类
 * @param {string} componentName - 组件名
 * @param {Object} variants - 变体样式对象
 */
function applyVariantStyles(componentClass, componentName, variants) {
  if (!componentClass || !componentClass.prototype) return;

  const proto = componentClass.prototype;

  // 保存变体样式
  if (!proto._themeVariants) {
    proto._themeVariants = variants;

    // 添加 variant 方法
    if (!proto.variant) {
      proto.variant = function (variantName) {
        const variantStyles = this._themeVariants?.[variantName];
        if (variantStyles) {
          this.styles(variantStyles);
          // 如果已经绑定到 DOM，直接更新 DOM 样式
          if (this._boundElement) {
            for (const [prop, val] of Object.entries(variantStyles)) {
              this._boundElement.style[prop] = val;
            }
          }
        }
        return this;
      };
    }
  }
}

/**
 * 初始化主题
 * @param {Object} options - 配置选项
 * @param {string} options.defaultTheme - 默认主题 ID (如 'islands')
 * @param {string} options.defaultMode - 默认 mode (如 'auto' | 'light' | 'dark')
 * @param {Function} options.onLoaded - 主题加载完成的回调
 * @param {Map} options.themes - 主题 Map，key 为主题 ID，value 为 { factory, lightFactory, darkFactory }
 */
function initTheme(options = {}) {
  const {
    defaultTheme = 'islands',
    defaultMode = 'auto',
    onLoaded = null,
    themes = new Map(),
  } = options;

  // 注册提供的主题
  for (const [themeId, config] of themes.entries()) {
    registerTheme(themeId, config.factory, {
      lightFactory: config.lightFactory,
      darkFactory: config.darkFactory,
    });
  }

  // 从 localStorage 读取主题和 mode
  const savedTheme = loadThemeFromStorage();
  const savedMode = loadModeFromStorage();

  // 处理 savedTheme 可能包含 mode 后缀的情况（如 'islands:dark'）
  let themeId = savedTheme || defaultTheme;
  if (themeId && themeId.includes(':')) {
    themeId = themeId.split(':')[0];
  }

  currentMode = savedMode || defaultMode;

  // 加载并应用主题
  try {
    const theme = getThemeWithMode(themeId, currentMode === 'auto' ? null : currentMode);
    if (theme) {
      applyTheme(theme, false);
    }

    // 设置 auto mode 监听器
    if (currentMode === 'auto') {
      setupAutoThemeListener();
    }

    // 调用回调
    if (typeof onLoaded === 'function') {
      onLoaded(theme);
    }
  } catch (err) {
    console.error('Failed to load theme:', err);
    if (typeof onLoaded === 'function') {
      onLoaded(null);
    }
  }
}

/**
 * 应用主题
 * @param {Theme} theme - 主题实例
 * @param {boolean} save - 是否保存到 localStorage
 */
function applyTheme(theme, save = true) {
  if (!theme) return;

  currentThemeId = theme.name.split(':')[0]; // 获取主题 ID（不含 mode）

  // 注册主题到主题管理器（如果尚未注册）
  if (!themeManager.getTheme(theme.name)) {
    themeManager.registerTheme(theme);
  }

  // 应用 CSS 变量
  applyThemeVariables(theme);

  // 应用组件样式
  applyComponentStyles(theme);

  // 更新主题管理器
  themeManager.setTheme(theme.name);

  // 保存到 localStorage（保存主题 ID，不含 mode）
  if (save) {
    saveThemeToStorage(currentThemeId);
  }

  // 派发事件
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }
}

/**
 * 切换主题
 * @param {string} themeId - 主题 ID
 */
function switchTheme(themeId) {
  const theme = getThemeWithMode(themeId, currentMode === 'auto' ? null : currentMode);
  if (theme) {
    applyTheme(theme, true);
    return true;
  }
  return false;
}

/**
 * 设置 mode (auto|light|dark)
 * @param {string} mode - mode 值
 */
function setThemeMode(mode) {
  currentMode = mode;
  saveModeToStorage(mode);

  // 重新应用当前主题
  if (currentThemeId) {
    const theme = getThemeWithMode(currentThemeId, mode === 'auto' ? null : mode);
    if (theme) {
      applyTheme(theme, false);
    }
  }

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

/**
 * 获取所有已注册的主题 ID
 * @returns {string[]}
 */
function getRegisteredThemes() {
  return Array.from(themeRegistry.keys());
}

/**
 * Islands 主题 - 浅色模式
 * Small 尺寸规格
 */


// Small 尺寸规格
const size$2 = {
  paddingXs: '4px',
  paddingSm: '6px',
  paddingMd: '8px',
  paddingLg: '10px',
  marginXs: '4px',
  marginSm: '6px',
  marginMd: '8px',
  marginLg: '10px',
  gapXs: '4px',
  gapSm: '6px',
  gapMd: '8px',
  gapLg: '10px',
  radiusSm: '4px',
  radiusMd: '6px',
  radiusLg: '8px',
  fontSizeSm: '12px',
  fontSizeMd: '13px',
};

/**
 * 创建 Islands 浅色主题
 */
function createLightTheme() {
  const theme = new Theme('islands:light');

  // 定义颜色变量 - JetBrains Islands 浅色主题配色
  const colors = {
    // 主色调 - JetBrains 蓝紫色
    primary: '#5A67D6',        // 主要交互色
    primaryLight: '#7B85EE',    // 悬停/高亮
    primaryDark: '#4655B8',     // 按压/激活
    primaryAlpha: 'rgba(90, 103, 214, 0.1)',  // 半透明背景

    // 背景色 - Islands 风格白色系
    background: '#FFFFFF',
    backgroundSecondary: '#F5F6F7',   // 次级背景（表头、分组）
    backgroundTertiary: '#EBECED',    // 第三级背景（禁用、不可用）
    backgroundHover: '#E8EAED',       // 悬停背景

    // 文字颜色 - JetBrains 灰度体系
    textPrimary: '#2B2D30',     // 主要文字
    textSecondary: '#6B6E75',   // 次要文字/描述
    textTertiary: '#9A9DA3',    // 辅助文字
    textDisabled: '#B8BAC0',    // 禁用文字
    textLink: '#3574F0',        // 链接色

    // 边框 - JetBrains 边框色
    border: '#D3D3D6',          // 主边框
    borderLight: '#E5E5E7',     // 次级边框
    borderFocus: '#5A67D6',     // 聚焦边框
    borderHover: '#A8A8AC',     // 悬停边框

    // 状态色 - JetBrains 语义色
    success: '#49B85C',         // 成功（绿色）
    successBg: 'rgba(73, 184, 92, 0.1)',
    warning: '#F0A664',         // 警告（橙色）
    warningBg: 'rgba(240, 166, 100, 0.1)',
    error: '#E05252',           // 错误（红色）
    errorBg: 'rgba(224, 82, 82, 0.1)',
    info: '#4FB3E4',            // 信息（蓝色）
    infoBg: 'rgba(79, 179, 228, 0.1)',

    //  selection - 选区背景
    selection: 'rgba(90, 103, 214, 0.2)',
    selectionInactive: 'rgba(90, 103, 214, 0.1)',

    // 阴影 - JetBrains 柔和阴影
    shadow: 'rgba(30, 32, 35, 0.08)',
    shadowHover: 'rgba(30, 32, 35, 0.12)',
    shadowDropdown: 'rgba(30, 32, 35, 0.15)',

    // 特殊效果
    overlay: 'rgba(30, 32, 35, 0.5)'};

  // 全局样式变量
  theme.variables = {
    '--islands-primary': colors.primary,
    '--islands-primary-light': colors.primaryLight,
    '--islands-primary-dark': colors.primaryDark,
    '--islands-primary-alpha': colors.primaryAlpha,
    '--islands-bg': colors.background,
    '--islands-bg-secondary': colors.backgroundSecondary,
    '--islands-bg-tertiary': colors.backgroundTertiary,
    '--islands-bg-hover': colors.backgroundHover,
    '--islands-text': colors.textPrimary,
    '--islands-text-secondary': colors.textSecondary,
    '--islands-text-tertiary': colors.textTertiary,
    '--islands-text-disabled': colors.textDisabled,
    '--islands-text-link': colors.textLink,
    '--islands-border': colors.border,
    '--islands-border-light': colors.borderLight,
    '--islands-border-focus': colors.borderFocus,
    '--islands-border-hover': colors.borderHover,
    '--islands-success': colors.success,
    '--islands-success-bg': colors.successBg,
    '--islands-warning': colors.warning,
    '--islands-warning-bg': colors.warningBg,
    '--islands-error': colors.error,
    '--islands-error-bg': colors.errorBg,
    '--islands-info': colors.info,
    '--islands-info-bg': colors.infoBg,
    '--islands-selection': colors.selection,
    '--islands-selection-inactive': colors.selectionInactive,
    '--islands-shadow': colors.shadow,
    '--islands-shadow-hover': colors.shadowHover,
    '--islands-shadow-dropdown': colors.shadowDropdown,
    '--islands-hover-bg': colors.backgroundHover,
    '--islands-error-alpha': colors.errorBg,
    '--islands-overlay': colors.overlay,
    // 尺寸变量
    '--islands-padding-xs': size$2.paddingXs,
    '--islands-padding-sm': size$2.paddingSm,
    '--islands-padding-md': size$2.paddingMd,
    '--islands-padding-lg': size$2.paddingLg,
    '--islands-margin-xs': size$2.marginXs,
    '--islands-margin-sm': size$2.marginSm,
    '--islands-margin-md': size$2.marginMd,
    '--islands-margin-lg': size$2.marginLg,
    '--islands-gap-xs': size$2.gapXs,
    '--islands-gap-sm': size$2.gapSm,
    '--islands-gap-md': size$2.gapMd,
    '--islands-gap-lg': size$2.gapLg,
    '--islands-radius-sm': size$2.radiusSm,
    '--islands-radius-md': size$2.radiusMd,
    '--islands-radius-lg': size$2.radiusLg,
    '--islands-font-size-sm': size$2.fontSizeSm,
    '--islands-font-size-md': size$2.fontSizeMd,
    // 按钮变量
    '--islands-button-padding': '8px 16px',
    '--islands-button-padding-lg': '10px 20px',
    '--islands-button-padding-sm': '4px 10px',
    '--islands-button-font-size': '14px',
    '--islands-button-font-size-lg': '16px',
    '--islands-button-font-size-sm': '12px',
    '--islands-button-height': '32px',
    '--islands-button-height-lg': '40px',
    '--islands-button-height-sm': '24px',
    '--islands-button-radius': '6px',
    '--islands-button-min-width': '64px',
    '--islands-button-primary-bg': colors.primary,
    '--islands-button-primary-hover': colors.primaryLight,
    '--islands-button-primary-active': colors.primaryDark,
    '--islands-button-success-bg': colors.success,
    '--islands-button-success-hover': '#3D9F4E',
    '--islands-button-warning-bg': colors.warning,
    '--islands-button-warning-hover': '#E0962E',
    '--islands-button-danger-bg': colors.error,
    '--islands-button-danger-hover': '#C84646',
    '--islands-button-default-bg': colors.background,
    '--islands-button-default-hover': colors.backgroundHover,
    '--islands-button-default-border': colors.border,
    // 输入框变量
    '--islands-input-padding': '8px 12px',
    '--islands-input-padding-lg': '10px 16px',
    '--islands-input-padding-sm': '4px 8px',
    '--islands-input-font-size': '14px',
    '--islands-input-font-size-lg': '16px',
    '--islands-input-font-size-sm': '12px',
    '--islands-input-height': '32px',
    '--islands-input-height-lg': '40px',
    '--islands-input-height-sm': '24px',
    '--islands-input-radius': '6px',
    '--islands-input-border': colors.border,
    '--islands-input-bg': colors.background,
    '--islands-input-text': colors.textPrimary,
    '--islands-input-disabled-bg': colors.backgroundTertiary,
    // 选择框变量
    '--islands-select-padding': '8px 12px',
    '--islands-select-padding-lg': '10px 16px',
    '--islands-select-padding-sm': '4px 8px',
    '--islands-select-font-size': '14px',
    '--islands-select-font-size-lg': '16px',
    '--islands-select-font-size-sm': '12px',
    '--islands-select-height': '32px',
    '--islands-select-height-lg': '40px',
    '--islands-select-height-sm': '24px',
    '--islands-select-radius': '6px',
    '--islands-select-border': colors.border,
    '--islands-select-bg': colors.background,
    '--islands-select-text': colors.textPrimary,
    '--islands-select-disabled-bg': colors.backgroundTertiary,
    // 文本域变量
    '--islands-textarea-padding': '8px 12px',
    '--islands-textarea-font-size': '14px',
    '--islands-textarea-radius': '6px',
    '--islands-textarea-border': colors.border,
    '--islands-textarea-bg': colors.background,
    '--islands-textarea-text': colors.textPrimary,
    '--islands-textarea-disabled-bg': colors.backgroundTertiary,
    '--islands-textarea-min-height': '80px',
    // 复选框变量
    '--islands-checkbox-font-size': '14px',
    '--islands-checkbox-text': colors.textPrimary,
    // 开关变量
    '--islands-switch-width': '44px',
    '--islands-switch-height': '22px',
    '--islands-switch-bg': colors.border,
    // 表单变量
    '--islands-form-gap': '16px',
    // 详情展示变量
    '--islands-descriptions-font-size': '14px',
    '--islands-descriptions-text': colors.textPrimary,
    '--islands-descriptions-title-size': '16px',
    '--islands-descriptions-title-color': colors.textPrimary,
    '--islands-descriptions-title-padding': '12px 0',
    '--islands-descriptions-padding': '12px 16px',
    '--islands-descriptions-border': colors.border,
    '--islands-descriptions-label-bg': colors.backgroundSecondary,
    '--islands-descriptions-label-color': colors.textSecondary,
    '--islands-descriptions-content-color': colors.textPrimary,
    // 字段编辑变量
    '--islands-field-padding': '4px 8px',
    '--islands-field-radius': '4px',
    '--islands-field-min-width': '80px',
    '--islands-field-min-height': '24px',
    // 代码变量
    '--islands-code-bg': '#1e1e1e',
    '--islands-code-radius': '8px',
    '--islands-code-border': '1px solid rgba(255,255,255,0.1)',
    '--islands-code-padding': '16px',
    '--islands-code-font-size': '13px',
    '--islands-code-line-height': '1.6',
    '--islands-code-text-color': '#d4d4d4',
    '--islands-code-font-family': '"Fira Code", "Consolas", "Monaco", monospace',
    '--islands-code-header-padding': '10px 16px',
    '--islands-code-header-bg': 'rgba(255,255,255,0.05)',
    '--islands-code-header-border': '1px solid rgba(255,255,255,0.1)',
    '--islands-code-title-color': '#007acc',
    '--islands-code-title-font-size': '13px',
    '--islands-code-title-font-weight': '600',
    '--islands-code-copy-padding': '4px 10px',
    '--islands-code-copy-radius': '4px',
    '--islands-code-copy-font-size': '12px',
    '--islands-code-copy-bg': '#444',
    '--islands-code-copy-color': '#ccc',
    '--islands-code-copy-hover-bg': '#555',
    '--islands-code-copy-hover-color': 'white',
    '--islands-code-copy-success-bg': '#28a745',
    '--islands-code-copy-success-color': 'white',
    // 消息变量
    '--islands-message-z-index': '9999',
    '--islands-message-gap': '10px',
    '--islands-message-container-padding': '16px',
    '--islands-message-max-width': '420px',
    '--islands-message-icon-size': '18px',
    '--islands-message-icon-margin': '10px',
    '--islands-message-font-size': '14px',
    '--islands-message-line-height': '1.5',
    '--islands-message-close-size': '20px',
    '--islands-message-close-padding': '0 4px',
    '--islands-message-close-opacity': '0.7',
    '--islands-message-close-hover-opacity': '1',
    '--islands-message-success-bg': colors.successBg,
    '--islands-message-success-color': colors.success,
    '--islands-message-success-border': `1px solid ${colors.success}`,
    '--islands-message-error-bg': colors.errorBg,
    '--islands-message-error-color': colors.error,
    '--islands-message-error-border': `1px solid ${colors.error}`,
    '--islands-message-warning-bg': colors.warningBg,
    '--islands-message-warning-color': colors.warning,
    '--islands-message-warning-border': `1px solid ${colors.warning}`,
    '--islands-message-info-bg': colors.infoBg,
    '--islands-message-info-color': colors.info,
    '--islands-message-info-border': `1px solid ${colors.info}`,
    // 菜单变量
    '--islands-menu-bg': 'white',
    '--islands-menu-radius': '8px',
    '--islands-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
    '--islands-menu-padding': '8px 0',
    '--islands-menu-min-width': '160px',
    '--islands-menu-item-padding': '10px',
    '--islands-menu-item-horizontal-padding': '16px',
    '--islands-menu-item-gap': '10px',
    '--islands-menu-item-radius': '4px',
    '--islands-menu-item-color': '#333',
    '--islands-menu-item-font-size': '13px',
    '--islands-menu-item-hover-bg': 'rgba(102, 126, 234, 0.05)',
    '--islands-menu-item-active-bg': 'rgba(102, 126, 234, 0.1)',
    '--islands-menu-item-active-font-weight': '500',
    '--islands-menu-item-active-color': '#667eea',
    '--islands-menu-item-disabled-opacity': '0.5',
    '--islands-menu-item-danger-color': '#dc3545',
    '--islands-menu-divider-height': '1px',
    '--islands-menu-divider-bg': '#e0e0e0',
    '--islands-menu-group-label-padding': '8px 16px 4px',
    '--islands-menu-group-label-font-size': '12px',
    '--islands-menu-group-label-color': '#999',
    '--islands-dropdown-trigger-bg': '#667eea',
    '--islands-dropdown-trigger-color': 'white',
    '--islands-dropdown-trigger-radius': '6px',
    '--islands-dropdown-menu-bg': 'white',
    '--islands-dropdown-menu-radius': '8px',
    '--islands-dropdown-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
    '--islands-context-menu-bg': 'white',
    '--islands-context-menu-radius': '8px',
    '--islands-context-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
    // 表格变量
    '--islands-table-bg': colors.background,
    '--islands-table-text': colors.textPrimary,
    '--islands-table-border': colors.border,
    '--islands-table-head-bg': colors.backgroundSecondary,
    '--islands-table-head-color': colors.textPrimary,
    '--islands-table-body-bg': colors.background,
    '--islands-table-foot-bg': colors.backgroundSecondary,
    '--islands-table-row-border': colors.border,
    '--islands-table-cell-color': colors.textPrimary,
    '--islands-table-cell-padding': '12px 16px',
    '--islands-table-head-padding': '12px 16px',
    '--islands-table-striped-bg': colors.backgroundSecondary,
    '--islands-table-hover-bg': 'rgba(102, 126, 234, 0.05)',
    '--islands-table-font-size': '14px',
  };

  // 组件主题定义
  theme.componentThemes = {
    // 按钮
    Button: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
      },
      baseStyles: {
        padding: `${size$2.paddingSm} ${size$2.paddingMd}`,
        fontSize: size$2.fontSizeSm,
        borderRadius: size$2.radiusSm,
      },
    },

    // 菜单
    Menu: {
      stateStyles: {},
      baseStyles: {
        background: colors.background,
        borderRadius: size$2.radiusMd,
        boxShadow: `0 2px 8px ${colors.shadow}`,
        padding: `${size$2.paddingSm} 0`,
        minWidth: '140px',
      },
    },

    // 菜单项
    MenuItem: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
        active: {
          background: 'rgba(102, 126, 234, 0.1)',
          fontWeight: '500',
        },
        danger: {
          color: colors.error,
        },
      },
      baseStyles: {
        padding: `${size$2.paddingSm} ${size$2.paddingMd}`,
        cursor: 'pointer',
        alignItems: 'center',
        gap: size$2.gapSm,
        transition: 'background-color 0.2s',
        borderRadius: size$2.radiusSm,
        color: colors.textPrimary,
        fontSize: size$2.fontSizeSm,
      },
    },

    // 卡片
    Card: {
      stateStyles: {},
      baseStyles: {
        background: colors.background,
        borderRadius: size$2.radiusLg,
        boxShadow: `0 2px 8px ${colors.shadow}`,
        overflow: 'hidden',
      },
    },

    // 卡片头部
    CardHeader: {
      stateStyles: {},
      baseStyles: {
        padding: `${size$2.paddingMd} ${size$2.paddingLg}`,
        borderBottom: `1px solid ${colors.borderLight}`,
        background: colors.backgroundSecondary,
        fontSize: size$2.fontSizeMd,
      },
    },

    // 卡片内容
    CardBody: {
      stateStyles: {},
      baseStyles: {
        padding: `${size$2.paddingMd} ${size$2.paddingLg}`,
        fontSize: size$2.fontSizeMd,
      },
    },

    // 卡片底部
    CardFooter: {
      stateStyles: {},
      baseStyles: {
        padding: `${size$2.paddingMd} ${size$2.paddingLg}`,
        borderTop: `1px solid ${colors.borderLight}`,
        background: colors.backgroundSecondary,
        fontSize: size$2.fontSizeSm,
      },
    },

    // 消息
    Message: {
      stateStyles: {},
      variants: {
        success: {
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
        },
        error: {
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
        },
        warning: {
          background: '#fff3cd',
          border: '1px solid #ffeeba',
          color: '#856404',
        },
        info: {
          background: '#d1ecf1',
          border: '1px solid #bee5eb',
          color: '#0c5460',
        },
      },
      baseStyles: {
        padding: `${size$2.paddingSm} ${size$2.paddingMd}`,
        borderRadius: size$2.radiusMd,
        fontSize: size$2.fontSizeSm,
        margin: `${size$2.marginSm} 0`,
      },
    },

    // 输入框
    Input: {
      stateStyles: {
        disabled: {
          background: colors.backgroundTertiary,
          cursor: 'not-allowed',
        },
      },
      baseStyles: {
        padding: `${size$2.paddingSm} ${size$2.paddingMd}`,
        border: `1px solid ${colors.border}`,
        borderRadius: size$2.radiusSm,
        fontSize: size$2.fontSizeSm,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      },
    },

    // 分隔线
    Divider: {
      stateStyles: {},
      baseStyles: {
        height: '1px',
        background: colors.border,
        margin: `${size$2.marginMd} 0`,
      },
    },

    // 按钮组件
    VButton: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
        loading: {
          cursor: 'wait',
          pointerEvents: 'none',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: size$2.gapSm,
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '400',
        borderRadius: size$2.radiusSm,
        border: '1px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none',
        minWidth: '64px',
        height: '32px',
      },
    },

    // 输入框组件
    VInput: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
        error: {
          borderColor: colors.error,
          boxShadow: '0 0 0 2px rgba(220, 53, 69, 0.2)',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: size$2.radiusSm,
        border: `1px solid ${colors.border}`,
        background: colors.background,
        color: colors.textPrimary,
        transition: 'all 0.2s',
        outline: 'none',
        height: '32px',
        boxSizing: 'border-box',
      },
    },

    // 选择框组件
    VSelect: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
        error: {
          borderColor: colors.error,
          boxShadow: '0 0 0 2px rgba(220, 53, 69, 0.2)',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: size$2.radiusSm,
        border: `1px solid ${colors.border}`,
        background: colors.background,
        color: colors.textPrimary,
        transition: 'all 0.2s',
        outline: 'none',
        height: '32px',
        boxSizing: 'border-box',
        cursor: 'pointer',
      },
    },

    // 文本域组件
    VTextarea: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
        error: {
          borderColor: colors.error,
          boxShadow: '0 0 0 2px rgba(220, 53, 69, 0.2)',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: size$2.radiusSm,
        border: `1px solid ${colors.border}`,
        background: colors.background,
        color: colors.textPrimary,
        transition: 'all 0.2s',
        outline: 'none',
        boxSizing: 'border-box',
        minHeight: '80px',
      },
    },

    // 复选框组件
    VCheckbox: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: size$2.gapSm,
        cursor: 'pointer',
        fontSize: '14px',
        color: colors.textPrimary,
        userSelect: 'none',
      },
    },

    // 开关组件
    VSwitch: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '44px',
        height: '22px',
        borderRadius: '11px',
        background: colors.border,
        padding: '2px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        boxSizing: 'border-box',
      },
    },

    // 表单容器
    VForm: {
      stateStyles: {},
      baseStyles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      },
    },

    // 详情展示
    VDescriptions: {
      stateStyles: {},
      baseStyles: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        fontSize: '14px',
        color: colors.textPrimary,
      },
    },

    // 可编辑字段
    VField: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: size$2.gapSm,
        padding: '4px 8px',
        borderRadius: size$2.radiusSm,
        border: '1px dashed transparent',
        minWidth: '80px',
        minHeight: '24px',
        position: 'relative',
        boxSizing: 'border-box',
        transition: 'all 0.2s',
      },
    },

    // 页面背景
    VBody: {
      stateStyles: {},
      baseStyles: {
        display: 'flex',
        flexDirection: 'column',
        background: colors.background,
        minHeight: '100vh',
        width: '100%',
        transition: 'background-color 0.3s ease',
      },
    },

    // 表格
    VTable: {
      stateStyles: {
        bordered: {
          border: '1px solid var(--islands-table-border)',
        },
        compact: {
          '--islands-table-cell-padding': '8px 12px',
        },
      },
      baseStyles: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 'var(--islands-table-font-size, 14px)',
        color: 'var(--islands-table-text)',
        background: 'var(--islands-table-bg)',
      },
    },

    // 表格行
    VTr: {
      stateStyles: {
        striped: {
          background: 'var(--islands-table-striped-bg)',
        },
        hoverable: {
          transition: 'background-color 0.2s',
        },
      },
      baseStyles: {
        transition: 'background-color 0.2s',
      },
    },

    // 表格头单元格
    VTh: {
      stateStyles: {},
      baseStyles: {
        padding: 'var(--islands-table-head-padding)',
        textAlign: 'left',
        fontWeight: '600',
        color: 'var(--islands-table-head-color)',
        borderBottom: '2px solid var(--islands-table-border)',
        whiteSpace: 'nowrap',
      },
    },

    // 表格单元格
    VTd: {
      stateStyles: {},
      baseStyles: {
        padding: 'var(--islands-table-cell-padding)',
        borderBottom: '1px solid var(--islands-table-row-border)',
        color: 'var(--islands-table-cell-color)',
        verticalAlign: 'middle',
      },
    },

    // 表格头部
    VThead: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--islands-table-head-bg)',
        borderBottom: '2px solid var(--islands-table-border)',
      },
    },

    // 表格主体
    VTbody: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--islands-table-body-bg)',
      },
    },

    // 表格底部
    VTfoot: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--islands-table-foot-bg)',
        borderTop: '2px solid var(--islands-table-border)',
      },
    },
  };

  return theme;
}

/**
 * Islands 主题 - 深色模式
 * Small 尺寸规格
 */


// Small 尺寸规格
const size$1 = {
  paddingXs: '4px',
  paddingSm: '6px',
  paddingMd: '8px',
  paddingLg: '10px',
  marginXs: '4px',
  marginSm: '6px',
  marginMd: '8px',
  marginLg: '10px',
  gapXs: '4px',
  gapSm: '6px',
  gapMd: '8px',
  gapLg: '10px',
  radiusSm: '4px',
  radiusMd: '6px',
  radiusLg: '8px',
  fontSizeSm: '12px',
  fontSizeMd: '13px',
};

/**
 * 创建 Islands 深色主题
 */
function createDarkTheme() {
  const theme = new Theme('islands:dark');

  // 定义颜色变量 - JetBrains Islands 深色主题配色
  const colors = {
    // 主色调 - JetBrains 蓝紫色（深色模式调整）
    primary: '#7B85EE',        // 主要交互色（提亮）
    primaryLight: '#949FF5',    // 悬停/高亮
    primaryDark: '#5A67D6',     // 按压/激活
    primaryAlpha: 'rgba(123, 133, 238, 0.15)',  // 半透明背景

    // 背景色 - Islands 风格深色系
    background: '#19191C',      // 主背景（深灰黑）
    backgroundSecondary: '#252528',   // 次级背景（表头、分组）
    backgroundTertiary: '#2F2F33',    // 第三级背景（禁用、不可用）
    backgroundHover: '#353539',       // 悬停背景

    // 文字颜色 - JetBrains 灰度体系（深色模式）
    textPrimary: '#E8E8E8',     // 主要文字
    textSecondary: '#9B9DA3',   // 次要文字/描述
    textTertiary: '#6B6E75',    // 辅助文字
    textDisabled: '#4F5157',    // 禁用文字
    textLink: '#5A8BFF',        // 链接色（提亮）

    // 边框 - JetBrains 边框色（深色模式）
    border: '#3E3E42',          // 主边框
    borderLight: '#4A4A4F',     // 次级边框
    borderFocus: '#7B85EE',     // 聚焦边框
    borderHover: '#5A5C63',     // 悬停边框

    // 状态色 - JetBrains 语义色（深色模式调整）
    success: '#5FD471',         // 成功（亮绿色）
    successBg: 'rgba(95, 212, 113, 0.15)',
    warning: '#F5B86A',         // 警告（亮橙色）
    warningBg: 'rgba(245, 184, 106, 0.15)',
    error: '#F56A6A',           // 错误（亮红色）
    errorBg: 'rgba(245, 106, 106, 0.15)',
    info: '#5FC4F0',            // 信息（亮蓝色）
    infoBg: 'rgba(95, 196, 240, 0.15)',

    // selection - 选区背景
    selection: 'rgba(123, 133, 238, 0.25)',
    selectionInactive: 'rgba(123, 133, 238, 0.1)',

    // 阴影 - JetBrains 深色模式阴影
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowHover: 'rgba(0, 0, 0, 0.4)',
    shadowDropdown: 'rgba(0, 0, 0, 0.5)',

    // 特殊效果
    overlay: 'rgba(0, 0, 0, 0.6)'};

  // 全局样式变量
  theme.variables = {
    '--islands-primary': colors.primary,
    '--islands-primary-light': colors.primaryLight,
    '--islands-primary-dark': colors.primaryDark,
    '--islands-primary-alpha': colors.primaryAlpha,
    '--islands-bg': colors.background,
    '--islands-bg-secondary': colors.backgroundSecondary,
    '--islands-bg-tertiary': colors.backgroundTertiary,
    '--islands-bg-hover': colors.backgroundHover,
    '--islands-text': colors.textPrimary,
    '--islands-text-secondary': colors.textSecondary,
    '--islands-text-tertiary': colors.textTertiary,
    '--islands-text-disabled': colors.textDisabled,
    '--islands-text-link': colors.textLink,
    '--islands-border': colors.border,
    '--islands-border-light': colors.borderLight,
    '--islands-border-focus': colors.borderFocus,
    '--islands-border-hover': colors.borderHover,
    '--islands-success': colors.success,
    '--islands-success-bg': colors.successBg,
    '--islands-warning': colors.warning,
    '--islands-warning-bg': colors.warningBg,
    '--islands-error': colors.error,
    '--islands-error-bg': colors.errorBg,
    '--islands-info': colors.info,
    '--islands-info-bg': colors.infoBg,
    '--islands-selection': colors.selection,
    '--islands-selection-inactive': colors.selectionInactive,
    '--islands-shadow': colors.shadow,
    '--islands-shadow-hover': colors.shadowHover,
    '--islands-shadow-dropdown': colors.shadowDropdown,
    '--islands-hover-bg': colors.backgroundHover,
    '--islands-error-alpha': colors.errorBg,
    '--islands-overlay': colors.overlay,
    // 尺寸变量
    '--islands-padding-xs': size$1.paddingXs,
    '--islands-padding-sm': size$1.paddingSm,
    '--islands-padding-md': size$1.paddingMd,
    '--islands-padding-lg': size$1.paddingLg,
    '--islands-margin-xs': size$1.marginXs,
    '--islands-margin-sm': size$1.marginSm,
    '--islands-margin-md': size$1.marginMd,
    '--islands-margin-lg': size$1.marginLg,
    '--islands-gap-xs': size$1.gapXs,
    '--islands-gap-sm': size$1.gapSm,
    '--islands-gap-md': size$1.gapMd,
    '--islands-gap-lg': size$1.gapLg,
    '--islands-radius-sm': size$1.radiusSm,
    '--islands-radius-md': size$1.radiusMd,
    '--islands-radius-lg': size$1.radiusLg,
    '--islands-font-size-sm': size$1.fontSizeSm,
    '--islands-font-size-md': size$1.fontSizeMd,
    // 按钮变量
    '--islands-button-padding': '8px 16px',
    '--islands-button-padding-lg': '10px 20px',
    '--islands-button-padding-sm': '4px 10px',
    '--islands-button-font-size': '14px',
    '--islands-button-font-size-lg': '16px',
    '--islands-button-font-size-sm': '12px',
    '--islands-button-height': '32px',
    '--islands-button-height-lg': '40px',
    '--islands-button-height-sm': '24px',
    '--islands-button-radius': '6px',
    '--islands-button-min-width': '64px',
    '--islands-button-primary-bg': colors.primary,
    '--islands-button-primary-hover': colors.primaryLight,
    '--islands-button-primary-active': colors.primaryDark,
    '--islands-button-success-bg': colors.success,
    '--islands-button-success-hover': '#52C663',
    '--islands-button-warning-bg': colors.warning,
    '--islands-button-warning-hover': '#E0962E',
    '--islands-button-danger-bg': colors.error,
    '--islands-button-danger-hover': '#E05252',
    '--islands-button-default-bg': colors.background,
    '--islands-button-default-hover': colors.backgroundHover,
    '--islands-button-default-border': colors.border,
    // 输入框变量
    '--islands-input-padding': '8px 12px',
    '--islands-input-padding-lg': '10px 16px',
    '--islands-input-padding-sm': '4px 8px',
    '--islands-input-font-size': '14px',
    '--islands-input-font-size-lg': '16px',
    '--islands-input-font-size-sm': '12px',
    '--islands-input-height': '32px',
    '--islands-input-height-lg': '40px',
    '--islands-input-height-sm': '24px',
    '--islands-input-radius': '6px',
    '--islands-input-border': colors.border,
    '--islands-input-bg': colors.background,
    '--islands-input-text': colors.textPrimary,
    '--islands-input-disabled-bg': colors.backgroundTertiary,
    // 选择框变量
    '--islands-select-padding': '8px 12px',
    '--islands-select-padding-lg': '10px 16px',
    '--islands-select-padding-sm': '4px 8px',
    '--islands-select-font-size': '14px',
    '--islands-select-font-size-lg': '16px',
    '--islands-select-font-size-sm': '12px',
    '--islands-select-height': '32px',
    '--islands-select-height-lg': '40px',
    '--islands-select-height-sm': '24px',
    '--islands-select-radius': '6px',
    '--islands-select-border': colors.border,
    '--islands-select-bg': colors.background,
    '--islands-select-text': colors.textPrimary,
    '--islands-select-disabled-bg': colors.backgroundTertiary,
    // 文本域变量
    '--islands-textarea-padding': '8px 12px',
    '--islands-textarea-font-size': '14px',
    '--islands-textarea-radius': '6px',
    '--islands-textarea-border': colors.border,
    '--islands-textarea-bg': colors.background,
    '--islands-textarea-text': colors.textPrimary,
    '--islands-textarea-disabled-bg': colors.backgroundTertiary,
    '--islands-textarea-min-height': '80px',
    // 复选框变量
    '--islands-checkbox-font-size': '14px',
    '--islands-checkbox-text': colors.textPrimary,
    // 开关变量
    '--islands-switch-width': '44px',
    '--islands-switch-height': '22px',
    '--islands-switch-bg': colors.border,
    // 表单变量
    '--islands-form-gap': '16px',
    // 详情展示变量
    '--islands-descriptions-font-size': '14px',
    '--islands-descriptions-text': colors.textPrimary,
    '--islands-descriptions-title-size': '16px',
    '--islands-descriptions-title-color': colors.textPrimary,
    '--islands-descriptions-title-padding': '12px 0',
    '--islands-descriptions-padding': '12px 16px',
    '--islands-descriptions-border': colors.border,
    '--islands-descriptions-label-bg': colors.backgroundSecondary,
    '--islands-descriptions-label-color': colors.textSecondary,
    '--islands-descriptions-content-color': colors.textPrimary,
    // 字段编辑变量
    '--islands-field-padding': '4px 8px',
    '--islands-field-radius': '4px',
    '--islands-field-min-width': '80px',
    '--islands-field-min-height': '24px',
    // 代码变量
    '--islands-code-bg': '#2d2d2d',
    '--islands-code-radius': '8px',
    '--islands-code-border': '1px solid rgba(255,255,255,0.1)',
    '--islands-code-padding': '16px',
    '--islands-code-font-size': '13px',
    '--islands-code-line-height': '1.6',
    '--islands-code-text-color': '#d4d4d4',
    '--islands-code-font-family': '"Fira Code", "Consolas", "Monaco", monospace',
    '--islands-code-header-padding': '10px 16px',
    '--islands-code-header-bg': 'rgba(255,255,255,0.05)',
    '--islands-code-header-border': '1px solid rgba(255,255,255,0.1)',
    '--islands-code-title-color': '#007acc',
    '--islands-code-title-font-size': '13px',
    '--islands-code-title-font-weight': '600',
    '--islands-code-copy-padding': '4px 10px',
    '--islands-code-copy-radius': '4px',
    '--islands-code-copy-font-size': '12px',
    '--islands-code-copy-bg': '#444',
    '--islands-code-copy-color': '#ccc',
    '--islands-code-copy-hover-bg': '#555',
    '--islands-code-copy-hover-color': 'white',
    '--islands-code-copy-success-bg': '#28a745',
    '--islands-code-copy-success-color': 'white',
    // 消息变量
    '--islands-message-z-index': '9999',
    '--islands-message-gap': '10px',
    '--islands-message-container-padding': '16px',
    '--islands-message-max-width': '420px',
    '--islands-message-icon-size': '18px',
    '--islands-message-icon-margin': '10px',
    '--islands-message-font-size': '14px',
    '--islands-message-line-height': '1.5',
    '--islands-message-close-size': '20px',
    '--islands-message-close-padding': '0 4px',
    '--islands-message-close-opacity': '0.7',
    '--islands-message-close-hover-opacity': '1',
    '--islands-message-success-bg': colors.successBg,
    '--islands-message-success-color': colors.success,
    '--islands-message-success-border': `1px solid ${colors.success}`,
    '--islands-message-error-bg': colors.errorBg,
    '--islands-message-error-color': colors.error,
    '--islands-message-error-border': `1px solid ${colors.error}`,
    '--islands-message-warning-bg': colors.warningBg,
    '--islands-message-warning-color': colors.warning,
    '--islands-message-warning-border': `1px solid ${colors.warning}`,
    '--islands-message-info-bg': colors.infoBg,
    '--islands-message-info-color': colors.info,
    '--islands-message-info-border': `1px solid ${colors.info}`,
    // 菜单变量
    '--islands-menu-bg': '#252542',
    '--islands-menu-radius': '8px',
    '--islands-menu-shadow': '0 4px 12px rgba(0,0,0,0.3)',
    '--islands-menu-padding': '8px 0',
    '--islands-menu-min-width': '160px',
    '--islands-menu-item-padding': '10px',
    '--islands-menu-item-horizontal-padding': '16px',
    '--islands-menu-item-gap': '10px',
    '--islands-menu-item-radius': '4px',
    '--islands-menu-item-color': '#eaeaea',
    '--islands-menu-item-font-size': '13px',
    '--islands-menu-item-hover-bg': 'rgba(255, 255, 255, 0.05)',
    '--islands-menu-item-active-bg': 'rgba(124, 143, 240, 0.2)',
    '--islands-menu-item-active-font-weight': '500',
    '--islands-menu-item-active-color': '#7c8ff0',
    '--islands-menu-item-disabled-opacity': '0.5',
    '--islands-menu-item-danger-color': '#f87171',
    '--islands-menu-divider-height': '1px',
    '--islands-menu-divider-bg': '#3a3a5c',
    '--islands-menu-group-label-padding': '8px 16px 4px',
    '--islands-menu-group-label-font-size': '12px',
    '--islands-menu-group-label-color': '#999',
    '--islands-dropdown-trigger-bg': '#7c8ff0',
    '--islands-dropdown-trigger-color': 'white',
    '--islands-dropdown-trigger-radius': '6px',
    '--islands-dropdown-menu-bg': '#252542',
    '--islands-dropdown-menu-radius': '8px',
    '--islands-dropdown-menu-shadow': '0 4px 12px rgba(0,0,0,0.3)',
    '--islands-context-menu-bg': '#252542',
    '--islands-context-menu-radius': '8px',
    '--islands-context-menu-shadow': '0 4px 12px rgba(0,0,0,0.3)',
    // 表格变量
    '--islands-table-bg': colors.background,
    '--islands-table-text': colors.textPrimary,
    '--islands-table-border': colors.border,
    '--islands-table-head-bg': colors.backgroundSecondary,
    '--islands-table-head-color': colors.textPrimary,
    '--islands-table-body-bg': colors.background,
    '--islands-table-foot-bg': colors.backgroundSecondary,
    '--islands-table-row-border': colors.border,
    '--islands-table-cell-color': colors.textPrimary,
    '--islands-table-cell-padding': '12px 16px',
    '--islands-table-head-padding': '12px 16px',
    '--islands-table-striped-bg': colors.backgroundSecondary,
    '--islands-table-hover-bg': 'rgba(255, 255, 255, 0.05)',
    '--islands-table-font-size': '14px',
  };

  // 组件主题定义
  theme.componentThemes = {
    // 按钮
    Button: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
      },
      baseStyles: {
        padding: `${size$1.paddingSm} ${size$1.paddingMd}`,
        fontSize: size$1.fontSizeSm,
        borderRadius: size$1.radiusSm,
      },
    },

    // 菜单
    Menu: {
      stateStyles: {},
      baseStyles: {
        background: colors.backgroundSecondary,
        borderRadius: size$1.radiusMd,
        boxShadow: `0 2px 8px ${colors.shadow}`,
        padding: `${size$1.paddingSm} 0`,
        minWidth: '140px',
      },
    },

    // 菜单项
    MenuItem: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
        active: {
          background: 'rgba(124, 143, 240, 0.2)',
          fontWeight: '500',
        },
        danger: {
          color: colors.error,
        },
      },
      baseStyles: {
        padding: `${size$1.paddingSm} ${size$1.paddingMd}`,
        cursor: 'pointer',
        alignItems: 'center',
        gap: size$1.gapSm,
        transition: 'background-color 0.2s',
        borderRadius: size$1.radiusSm,
        color: colors.textPrimary,
        fontSize: size$1.fontSizeSm,
      },
      hoverStyles: {
        background: 'rgba(255, 255, 255, 0.05)',
      },
    },

    // 卡片
    Card: {
      stateStyles: {},
      baseStyles: {
        background: colors.backgroundSecondary,
        borderRadius: size$1.radiusLg,
        boxShadow: `0 2px 8px ${colors.shadow}`,
        overflow: 'hidden',
      },
    },

    // 卡片头部
    CardHeader: {
      stateStyles: {},
      baseStyles: {
        padding: `${size$1.paddingMd} ${size$1.paddingLg}`,
        borderBottom: `1px solid ${colors.border}`,
        background: colors.backgroundTertiary,
        fontSize: size$1.fontSizeMd,
      },
    },

    // 卡片内容
    CardBody: {
      stateStyles: {},
      baseStyles: {
        padding: `${size$1.paddingMd} ${size$1.paddingLg}`,
        fontSize: size$1.fontSizeMd,
      },
    },

    // 卡片底部
    CardFooter: {
      stateStyles: {},
      baseStyles: {
        padding: `${size$1.paddingMd} ${size$1.paddingLg}`,
        borderTop: `1px solid ${colors.border}`,
        background: colors.backgroundTertiary,
        fontSize: size$1.fontSizeSm,
      },
    },

    // 消息
    Message: {
      stateStyles: {},
      variants: {
        success: {
          background: 'rgba(74, 222, 128, 0.15)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          color: colors.success,
        },
        error: {
          background: 'rgba(248, 113, 113, 0.15)',
          border: '1px solid rgba(248, 113, 113, 0.3)',
          color: colors.error,
        },
        warning: {
          background: 'rgba(251, 191, 36, 0.15)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          color: colors.warning,
        },
        info: {
          background: 'rgba(34, 211, 238, 0.15)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          color: colors.info,
        },
      },
      baseStyles: {
        padding: `${size$1.paddingSm} ${size$1.paddingMd}`,
        borderRadius: size$1.radiusMd,
        fontSize: size$1.fontSizeSm,
        margin: `${size$1.marginSm} 0`,
      },
    },

    // 输入框
    Input: {
      stateStyles: {
        disabled: {
          background: colors.backgroundTertiary,
          cursor: 'not-allowed',
        },
      },
      baseStyles: {
        padding: `${size$1.paddingSm} ${size$1.paddingMd}`,
        border: `1px solid ${colors.border}`,
        borderRadius: size$1.radiusSm,
        fontSize: size$1.fontSizeSm,
        background: colors.background,
        color: colors.textPrimary,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      },
    },

    // 分隔线
    Divider: {
      stateStyles: {},
      baseStyles: {
        height: '1px',
        background: colors.border,
        margin: `${size$1.marginMd} 0`,
      },
    },

    // 按钮组件
    VButton: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
        loading: {
          cursor: 'wait',
          pointerEvents: 'none',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: size$1.gapSm,
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '400',
        borderRadius: size$1.radiusSm,
        border: '1px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none',
        minWidth: '64px',
        height: '32px',
      },
    },

    // 输入框组件
    VInput: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
        error: {
          borderColor: colors.error,
          boxShadow: '0 0 0 2px rgba(248, 113, 113, 0.2)',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: size$1.radiusSm,
        border: `1px solid ${colors.border}`,
        background: colors.background,
        color: colors.textPrimary,
        transition: 'all 0.2s',
        outline: 'none',
        height: '32px',
        boxSizing: 'border-box',
      },
    },

    // 选择框组件
    VSelect: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
        error: {
          borderColor: colors.error,
          boxShadow: '0 0 0 2px rgba(248, 113, 113, 0.2)',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: size$1.radiusSm,
        border: `1px solid ${colors.border}`,
        background: colors.background,
        color: colors.textPrimary,
        transition: 'all 0.2s',
        outline: 'none',
        height: '32px',
        boxSizing: 'border-box',
        cursor: 'pointer',
      },
    },

    // 文本域组件
    VTextarea: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
        error: {
          borderColor: colors.error,
          boxShadow: '0 0 0 2px rgba(248, 113, 113, 0.2)',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: size$1.radiusSm,
        border: `1px solid ${colors.border}`,
        background: colors.background,
        color: colors.textPrimary,
        transition: 'all 0.2s',
        outline: 'none',
        boxSizing: 'border-box',
        minHeight: '80px',
      },
    },

    // 复选框组件
    VCheckbox: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: size$1.gapSm,
        cursor: 'pointer',
        fontSize: '14px',
        color: colors.textPrimary,
        userSelect: 'none',
      },
    },

    // 开关组件
    VSwitch: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '44px',
        height: '22px',
        borderRadius: '11px',
        background: colors.border,
        padding: '2px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        boxSizing: 'border-box',
      },
    },

    // 表单容器
    VForm: {
      stateStyles: {},
      baseStyles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      },
    },

    // 详情展示
    VDescriptions: {
      stateStyles: {},
      baseStyles: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        fontSize: '14px',
        color: colors.textPrimary,
      },
    },

    // 可编辑字段
    VField: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: size$1.gapSm,
        padding: '4px 8px',
        borderRadius: size$1.radiusSm,
        border: '1px dashed transparent',
        minWidth: '80px',
        minHeight: '24px',
        position: 'relative',
        boxSizing: 'border-box',
        transition: 'all 0.2s',
      },
    },

    // 页面背景
    VBody: {
      stateStyles: {},
      baseStyles: {
        display: 'flex',
        flexDirection: 'column',
        background: colors.background,
        minHeight: '100vh',
        width: '100%',
        transition: 'background-color 0.3s ease',
      },
    },

    // 表格
    VTable: {
      stateStyles: {
        bordered: {
          border: '1px solid var(--islands-table-border)',
        },
        compact: {
          '--islands-table-cell-padding': '8px 12px',
        },
      },
      baseStyles: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 'var(--islands-table-font-size, 14px)',
        color: 'var(--islands-table-text)',
        background: 'var(--islands-table-bg)',
      },
    },

    // 表格行
    VTr: {
      stateStyles: {
        striped: {
          background: 'var(--islands-table-striped-bg)',
        },
        hoverable: {
          transition: 'background-color 0.2s',
        },
      },
      baseStyles: {
        transition: 'background-color 0.2s',
      },
    },

    // 表格头单元格
    VTh: {
      stateStyles: {},
      baseStyles: {
        padding: 'var(--islands-table-head-padding)',
        textAlign: 'left',
        fontWeight: '600',
        color: 'var(--islands-table-head-color)',
        borderBottom: '2px solid var(--islands-table-border)',
        whiteSpace: 'nowrap',
      },
    },

    // 表格单元格
    VTd: {
      stateStyles: {},
      baseStyles: {
        padding: 'var(--islands-table-cell-padding)',
        borderBottom: '1px solid var(--islands-table-row-border)',
        color: 'var(--islands-table-cell-color)',
        verticalAlign: 'middle',
      },
    },

    // 表格头部
    VThead: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--islands-table-head-bg)',
        borderBottom: '2px solid var(--islands-table-border)',
      },
    },

    // 表格主体
    VTbody: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--islands-table-body-bg)',
      },
    },

    // 表格底部
    VTfoot: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--islands-table-foot-bg)',
        borderTop: '2px solid var(--islands-table-border)',
      },
    },
  };

  return theme;
}

/**
 * Islands 主题系列
 * 提供 light 和 dark 两种模式
 */


// 导出尺寸规格
const size = {
  paddingXs: '4px',
  paddingSm: '6px',
  paddingMd: '8px',
  paddingLg: '10px',
  marginXs: '4px',
  marginSm: '6px',
  marginMd: '8px',
  marginLg: '10px',
  gapXs: '4px',
  gapSm: '6px',
  gapMd: '8px',
  gapLg: '10px',
  radiusSm: '4px',
  radiusMd: '6px',
  radiusLg: '8px',
  fontSizeSm: '12px',
  fontSizeMd: '13px',
};

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

/**
 * Yoya.Basic - Browser-native HTML DSL Library
 * 提供类似 Kotlin HTML DSL 的声明式语法
 */

initTagExtensions(Tag);

export { A, Article, Aside, Audio, Blockquote, Br, Button, Canvas, Center, Circle, Code, CodeBlock, Container, Dd, Defs, Div, Divider, Dl, Dt, Ellipse, Em, Filter, Flex, Footer, Form, G, Grid, H1, H2, H3, H4, H5, H6, HStack, Header, Hr, IFrame, Img, Input, Label, Li, Line, LinearGradient, LoadStatus, Main, Nav, Ol, Option, P, Path, Pattern, Polygon, Polyline, Pre, RadialGradient, Rect, ResponsiveGrid, Section, Select, Source, Spacer, Span, Stack, StateMachine, Stop, Strong, Svg, SvgElement, Image as SvgImage, SvgTag, Text as SvgText, Table, Tag, Tbody, Td, Textarea, Tfoot, Th, Thead, Theme, ThemeManager, Tr, Tspan, Ul, VBody, VButton, VCard, VCardBody, VCardFooter, VCardHeader, VCheckbox, VCheckboxes, VCode, VContextMenu, VDetail, VDetailItem, VDropdownMenu, VDynamicLoader, VEchart, VField, VForm, VInput, VMenu, VMenuDivider, VMenuGroup, VMenuItem, VMessage, VMessageContainer, VMessageManager, VSelect, VSidebar, VStack, VSubMenu, VSwitch, VTable, VTbody, VTd, VTextarea, VTfoot, VTh, VThead, VTimer, VTimer2, VTr, Video, a, allVariables, applyGlobalVariables, applyTheme, applyVariables, article, aside, audio, baseVariables, blockquote, br, button, buttonVariables, canvas, cardVariables, center, circle, clearModuleCache, code, codeBlock, codeVariables, container, createBody, createDarkTheme, createDarkTheme$1 as createDarkThemeVars, createLightTheme, createText, createTheme, dd, defs, descriptionsVariables, div, divider, dl, dt, ellipse, em, fieldVariables, filter, flex, footer, form, g, getCurrentThemeId, getEffectiveThemeMode, getLanguage, getModuleCacheStatus, getRegisteredThemes, getSupportedLanguages, getTheme, getThemeMode, grid, h1, h2, h3, h4, h5, h6, hasLanguage, header, hr, hstack, iframe, img, initI18n, initStateMachine, initTagExtensions, initTheme, input, size as islandsSize, label, li, line, linearGradient, loadLanguageFromStorage, loadModules, main, menuVariables, messageVariables, nav, ol, option, p, path, pattern, polygon, polyline, pre, preloadModules, radialGradient, rect, registerLanguage, registerStateHandler, registerTheme, responsiveGrid, saveLanguageToStorage, section, select, setLanguage, setThemeMode, source, spacer, span, stack, stop, strong, svg, svgElement, svgImage, svgText, switchTheme, t, table, tag, tbody, td, text, textarea, tfoot, th, thead, themeManager, toast, tr, translate, tspan, ul, vBody, vButton, vCard, vCardBody, vCardFooter, vCardHeader, vCheckbox, vCheckboxes, vCode, vContextMenu, vDetail, vDetailItem, vDropdownMenu, vDynamicLoader, vEchart, vField, vForm, vInput, vMenu, vMenuDivider, vMenuGroup, vMenuItem, vMessage, vMessageContainer, vMessageManager, vOption, vSelect, vSidebar, vSubMenu, vSwitch, vTable, vTbody, vTd, vTextarea, vTfoot, vTh, vThead, vTimer, vTimer2, vTr, video, vstack };
//# sourceMappingURL=yoya.esm.js.map
