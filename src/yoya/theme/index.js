/**
 * Yoya.Theme - 主题管理系统
 * 提供主题初始化、加载、切换等功能
 */

import { themeManager, Theme } from '../core/theme.js';
import {
  allVariables,
  baseVariables,
  cardVariables,
  buttonVariables,
  menuVariables,
  messageVariables,
  codeVariables,
  fieldVariables,
  descriptionsVariables,
  bodyVariables,
  applyVariables,
  applyGlobalVariables,
  createDarkTheme,
} from './variables.js';

// 主题注册表
const themeRegistry = new Map();

// 当前主题
let currentThemeId = null;

// localStorage 键名
const STORAGE_KEY_THEME = 'yoya-theme';

/**
 * 注册主题
 * @param {string} themeId - 主题 ID
 * @param {Function} themeFactory - 主题创建函数
 */
export function registerTheme(themeId, themeFactory) {
  themeRegistry.set(themeId, themeFactory);
}

/**
 * 获取主题实例
 * @param {string} themeId - 主题 ID
 * @returns {Theme|null}
 */
export function getTheme(themeId) {
  const factory = themeRegistry.get(themeId);
  if (!factory) return null;
  return factory();
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
 * @param {string} options.defaultTheme - 默认主题 ID (如 'islands:light')
 * @param {Function} options.onLoaded - 主题加载完成的回调
 * @param {Map} options.themes - 主题 Map，key 为主题 ID，value 为创建函数
 */
export function initTheme(options = {}) {
  const {
    defaultTheme = 'islands:light',
    onLoaded = null,
    themes = new Map(),
  } = options;

  // 注册提供的主题
  for (const [themeId, factory] of themes.entries()) {
    registerTheme(themeId, factory);
  }

  // 从 localStorage 读取主题
  const savedTheme = loadThemeFromStorage();
  const themeId = savedTheme || defaultTheme;

  // 加载并应用主题
  try {
    const theme = getTheme(themeId);
    if (theme) {
      applyTheme(theme, false);
    } else {
      // 尝试加载默认主题
      const defaultThemeInstance = getTheme(defaultTheme);
      if (defaultThemeInstance) {
        applyTheme(defaultThemeInstance, false);
      }
    }

    // 调用回调
    if (typeof onLoaded === 'function') {
      onLoaded(theme || getTheme(defaultTheme));
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
export function applyTheme(theme, save = true) {
  if (!theme) return;

  currentThemeId = theme.name;

  // 应用 CSS 变量
  applyThemeVariables(theme);

  // 应用组件样式
  applyComponentStyles(theme);

  // 更新主题管理器
  themeManager.setTheme(theme.name);

  // 保存到 localStorage
  if (save) {
    saveThemeToStorage(theme.name);
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
export function switchTheme(themeId) {
  const theme = getTheme(themeId);
  if (theme) {
    applyTheme(theme, true);
    return true;
  }
  return false;
}

/**
 * 获取当前主题 ID
 * @returns {string|null}
 */
export function getCurrentThemeId() {
  return currentThemeId;
}

/**
 * 获取所有已注册的主题 ID
 * @returns {string[]}
 */
export function getRegisteredThemes() {
  return Array.from(themeRegistry.keys());
}

/**
 * 从 localStorage 读取语言设置
 * @returns {string|null}
 */
export function loadLanguageFromStorage() {
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
export function saveLanguageToStorage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
  } catch (e) {
    // 忽略存储错误
  }
}

// 导出主题管理器
export { themeManager };

// 导出主题变量
export {
  allVariables,
  baseVariables,
  cardVariables,
  buttonVariables,
  menuVariables,
  messageVariables,
  codeVariables,
  fieldVariables,
  descriptionsVariables,
  bodyVariables,
  applyVariables,
  applyGlobalVariables,
  createDarkTheme,
};
