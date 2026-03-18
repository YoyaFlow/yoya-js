/**
 * Yoya.Theme - 主题管理系统 (CSS-based)
 * 通过加载 CSS 文件和切换 data-attribute 来管理主题
 */

import { themeManager } from '../core/theme.js';

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

export function registerThemeConfig(themeId, config) {
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
export function initTheme(options = {}) {
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
export function switchTheme(themeId) {
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
export function setThemeMode(mode) {
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
export function getThemeMode() {
  return currentMode;
}

/**
 * 获取当前生效的 mode
 * @returns {string} 'light' | 'dark'
 */
export function getEffectiveThemeMode() {
  return getEffectiveMode();
}

/**
 * 获取当前主题 ID
 * @returns {string|null}
 */
export function getCurrentThemeId() {
  return currentThemeId;
}

/**
 * 从 localStorage 读取语言设置
 */
export function loadLanguageFromStorage() {
  try {
    return localStorage.getItem('yoya-language');
  } catch (e) {
    return null;
  }
}

/**
 * 保存语言设置到 localStorage
 */
export function saveLanguageToStorage(lang) {
  try {
    localStorage.setItem('yoya-language', lang);
  } catch (e) {
    // 忽略存储错误
  }
}

// 导出主题管理器
export { themeManager };

// ========================================
// 主题 CSS 文件路径导出（用于自定义主题）
// ========================================

/**
 * 获取主题基础路径
 * @returns {string} 主题 CSS 文件的基础路径
 */
export function getThemeBasePath() {
  const modulePath = import.meta.url;
  const baseUrl = modulePath.substring(0, modulePath.lastIndexOf('/'));
  return `${baseUrl}`;
}

/**
 * 获取主题 CSS 文件路径
 * @param {string} cssName - CSS 文件名称（不带扩展名）
 * @returns {string} 完整的 CSS 文件路径
 */
export function getThemeCssPath(cssName) {
  const basePath = getThemeBasePath();
  return `${basePath}/css/${cssName}.css`;
}

/**
 * 获取组件 CSS 文件路径
 * @param {string} componentName - 组件名称
 * @returns {string} 组件 CSS 文件路径
 */
export function getComponentCssPath(componentName) {
  const basePath = getThemeBasePath();
  return `${basePath}/css/components/${componentName}.css`;
}

/**
 * 组件 CSS 文件列表
 */
export const COMPONENT_CSS_FILES = {
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
export function loadCssFile(cssPath, options = {}) {
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
export function loadComponentCssFiles(componentNames) {
  return Promise.all(componentNames.map(name => {
    const cssPath = getComponentCssPath(name);
    return loadCssFile(cssPath, { replaceExisting: false });
  }));
}
