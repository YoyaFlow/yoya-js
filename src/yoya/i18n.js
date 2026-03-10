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
export function registerLanguage(lang, messages) {
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
export function setLanguage(lang, save = true) {
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
export function getLanguage() {
  return currentLanguage;
}

/**
 * 从 localStorage 读取语言设置
 * @returns {string|null} 语言代码或 null
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
export function t(key, defaultValue = '', params = {}) {
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
export function translate(key, params = {}) {
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
export function initI18n(options = {}) {
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
export function createText(key, defaultValue = '', params = {}) {
  return t(key, defaultValue, params);
}

/**
 * 获取所有支持的语言
 * @returns {string[]} 支持的语言代码列表
 */
export function getSupportedLanguages() {
  return Array.from(languagePacks.keys());
}

/**
 * 检查语言包是否存在
 * @param {string} lang - 语言代码
 * @returns {boolean} 语言包是否存在
 */
export function hasLanguage(lang) {
  return languagePacks.has(lang);
}

// 默认导出
export default {
  t,
  translate,
  setLanguage,
  getLanguage,
  registerLanguage,
  initI18n,
  createText,
};
