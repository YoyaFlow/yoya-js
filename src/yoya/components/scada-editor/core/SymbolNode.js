/**
 * @fileoverview SymbolNode 图元节点类
 * 表示组态画布中的一个图形元素（泵、阀、管道等）
 */

/**
 * 图元节点类
 */
class SymbolNode {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;  // 'pump', 'valve', 'pipe', etc.
    this.name = data.name || data.type;
    this.parentId = data.parentId || null;
    this.children = data.children || [];

    // 图形属性
    this.position = data.position || { x: 0, y: 0 };
    this.size = data.size || { width: 100, height: 100 };
    this.rotation = data.rotation || 0;
    this.styles = data.styles || {};

    // 变量绑定
    this.bindings = data.bindings || {};  // { runStatus: 'P101_RUN', current: 'P101_CURRENT' }

    // 动画配置
    this.animations = data.animations || [];

    // 告警配置
    this.alarms = data.alarms || [];

    // 脚本
    this.scripts = data.scripts || {};  // { onClick: '...', onChange: '...' }

    // 元数据
    this.meta = {
      createdAt: data.createdAt || Date.now(),
      updatedAt: data.updatedAt || Date.now(),
      locked: data.locked || false,
      hidden: data.hidden || false,
      layer: data.layer || 'default'  // 'background', 'dynamic', 'foreground'
    };

    // 虚拟元素引用
    this._element = null;
  }

  /**
   * 更新图元属性
   * @param {Object} changes - 变更对象
   */
  update(changes) {
    Object.assign(this, changes);
    this.meta.updatedAt = Date.now();
  }

  /**
   * 绑定变量到属性
   * @param {string} propName - 属性名
   * @param {string} variableId - 变量 ID
   */
  bindVariable(propName, variableId) {
    this.bindings[propName] = variableId;
  }

  /**
   * 添加动画
   * @param {Object} animation - 动画配置
   */
  addAnimation(animation) {
    this.animations.push(animation);
  }

  /**
   * 添加告警
   * @param {Object} alarm - 告警配置
   */
  addAlarm(alarm) {
    this.alarms.push(alarm);
  }

  /**
   * 设置位置
   * @param {number} x - X 坐标
   * @param {number} y - Y 坐标
   * @returns {SymbolNode} this
   */
  setPosition(x, y) {
    this.position = { x, y };
    if (this._element) {
      this._element.style.left = x + 'px';
      this._element.style.top = y + 'px';
    }
    return this;
  }

  /**
   * 设置尺寸
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @returns {SymbolNode} this
   */
  setSize(width, height) {
    this.size = { width, height };
    if (this._element) {
      this._element.style.width = width + 'px';
      this._element.style.height = height + 'px';
    }
    return this;
  }

  /**
   * 设置样式
   * @param {string} key - 样式键
   * @param {string} value - 样式值
   * @returns {SymbolNode} this
   */
  setStyle(key, value) {
    this.styles[key] = value;
    if (this._element) {
      this._element.style[key] = value;
    }
    return this;
  }

  /**
   * 导出为 JSON
   * @returns {Object} JSON 对象
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      parentId: this.parentId,
      children: this.children,
      position: this.position,
      size: this.size,
      rotation: this.rotation,
      styles: this.styles,
      bindings: this.bindings,
      animations: this.animations,
      alarms: this.alarms,
      scripts: this.scripts,
      meta: this.meta
    };
  }

  /**
   * 从 JSON 创建 SymbolNode
   * @param {Object} data - JSON 数据
   * @returns {SymbolNode} SymbolNode 实例
   */
  static fromJSON(data) {
    return new SymbolNode(data);
  }

  /**
   * 渲染为 DOM 元素
   * @returns {HTMLElement|null} DOM 元素
   */
  renderDom() {
    if (this.meta.hidden) return null;

    // 创建容器元素
    const element = document.createElement('div');
    element.id = this.id;
    element.className = `scada-symbol scada-symbol-${this.type}`;

    // 应用样式
    Object.assign(element.style, {
      position: 'absolute',
      left: this.position.x + 'px',
      top: this.position.y + 'px',
      width: this.size.width + 'px',
      height: this.size.height + 'px',
      transform: `rotate(${this.rotation}deg)`,
      ...this.styles
    });

    // 应用图层
    if (this.meta.layer === 'background') {
      element.style.zIndex = '0';
    } else if (this.meta.layer === 'foreground') {
      element.style.zIndex = '100';
    } else {
      element.style.zIndex = '10';
    }

    // 锁定状态
    if (this.meta.locked) {
      element.setAttribute('data-locked', 'true');
    }

    this._element = element;
    return element;
  }

  /**
   * 更新 DOM 元素位置
   * @param {HTMLElement} element - DOM 元素
   */
  updateDom(element) {
    if (!element) return;

    element.style.left = this.position.x + 'px';
    element.style.top = this.position.y + 'px';
    element.style.width = this.size.width + 'px';
    element.style.height = this.size.height + 'px';
    element.style.transform = `rotate(${this.rotation}deg)`;

    // 更新样式
    Object.assign(element.style, this.styles);
  }
}

export { SymbolNode };
