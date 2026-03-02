/**
 * Yoya.Basic - Theme System
 * 主题系统：基于状态机的样式管理机制
 * 支持 boolean、string、number 多种状态值类型
 */

// 注意：不在这里导入 Tag，而是在 initTagExtensions 中动态获取
// 这是为了避免循环依赖问题

// ============================================
// 状态处理器注册表
// ============================================

/**
 * 主题注册表
 * 存储每个组件类型的状态处理器
 */
const themeRegistry = new Map();

/**
 * 全局主题配置
 */
let globalTheme = {
  name: 'default',
  states: {},
  components: {}
};

// ============================================
// StateMachine 状态机类
// ============================================

/**
 * @typedef {boolean | string | number} StateValue
 */

class StateMachine {
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

class Theme {
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
   * @returns {this}
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
   * @returns {this}
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
   * @returns {this}
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

class ThemeManager {
  constructor() {
    this._currentTheme = null;
    this._themes = new Map();
  }

  /**
   * 注册主题
   * @param {Theme} theme
   * @returns {this}
   */
  registerTheme(theme) {
    this._themes.set(theme.name, theme);
    return this;
  }

  /**
   * 获取主题
   * @param {string} name
   * @returns {Theme|undefined}
   */
  getTheme(name) {
    return this._themes.get(name);
  }

  /**
   * 设置当前主题
   * @param {string} name - 主题名
   * @returns {this}
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
   * @returns {Theme|null}
   */
  getCurrentTheme() {
    return this._currentTheme;
  }

  /**
   * 应用当前主题到组件
   * @param {Tag} component
   * @returns {this}
   */
  applyTheme(component) {
    if (this._currentTheme) {
      this._currentTheme.applyToComponent(component);
    }
    return this;
  }

  /**
   * 应用所有已注册主题到组件
   * @param {Tag} component
   * @returns {this}
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

const themeManager = new ThemeManager();

// ============================================
// 辅助函数
// ============================================

/**
 * 快速创建主题
 * @param {string} name - 主题名
 * @param {Object} definitions - 主题定义
 * @returns {Theme}
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
 * @param {string} themeName - 主题名
 * @param {string} componentName - 组件名
 * @param {string} stateName - 状态名
 * @param {Function} handler - 处理函数
 * @returns {Theme}
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
 * @param {typeof Tag} TagClass - Tag 类
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
   * @param {...string|Object} attrs
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
   * @param {string} stateName
   * @param {StateValue} value
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
   */
  TagClass.prototype.getState = function(stateName) {
    if (!this._stateMachine) {
      return undefined;
    }
    return this._stateMachine.getState(stateName);
  };

  /**
   * 获取布尔状态值
   */
  TagClass.prototype.getBooleanState = function(stateName) {
    if (!this._stateMachine) {
      return false;
    }
    return this._stateMachine.getBooleanState(stateName);
  };

  /**
   * 获取字符串状态值
   */
  TagClass.prototype.getStringState = function(stateName) {
    if (!this._stateMachine) {
      return '';
    }
    return this._stateMachine.getStringState(stateName);
  };

  /**
   * 获取数值状态值
   */
  TagClass.prototype.getNumberState = function(stateName) {
    if (!this._stateMachine) {
      return 0;
    }
    return this._stateMachine.getNumberState(stateName);
  };

  /**
   * 检查状态（适用于 boolean）
   */
  TagClass.prototype.hasState = function(stateName) {
    if (!this._stateMachine) {
      return false;
    }
    return this._stateMachine.hasState(stateName);
  };

  /**
   * 获取所有状态
   */
  TagClass.prototype.getAllStates = function() {
    if (!this._stateMachine) {
      return {};
    }
    return this._stateMachine.getAllStates();
  };

  /**
   * 重置状态
   */
  TagClass.prototype.resetStates = function() {
    if (!this._stateMachine) {
      return this;
    }
    return this._stateMachine.reset();
  };

  /**
   * 保存状态快照
   */
  TagClass.prototype.saveStateSnapshot = function(name = 'default') {
    if (!this._stateMachine) {
      return this;
    }
    return this._stateMachine.saveSnapshot(name);
  };

  /**
   * 恢复状态快照
   */
  TagClass.prototype.restoreStateSnapshot = function(name = 'default') {
    if (!this._stateMachine) {
      return this;
    }
    return this._stateMachine.restoreSnapshot(name);
  };

  /**
   * 初始化状态
   */
  TagClass.prototype.initializeStates = function(defaultStates = {}) {
    if (!this._stateMachine) {
      this._stateMachine = new StateMachine(this);
    }
    return this._stateMachine.initialize(defaultStates);
  };

  /**
   * 反初始化（恢复初始状态）
   */
  TagClass.prototype.deinitializeStates = function() {
    if (!this._stateMachine) {
      return this;
    }
    return this._stateMachine.deinitialize();
  };

  /**
   * 注册拦截器
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

// ============================================
// 导出
// ============================================

export {
  // 类
  StateMachine,
  Theme,
  ThemeManager,

  // 全局单例
  themeManager,

  // 辅助函数
  createTheme,
  registerStateHandler,
  initStateMachine,
  initTagExtensions
};
